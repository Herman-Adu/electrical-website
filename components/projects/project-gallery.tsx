"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useTransition } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";
import type { ProjectGalleryImage } from "@/types/projects";
//import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 6;

interface ProjectGalleryProps {
  images: ProjectGalleryImage[];
  heading?: string;
  title?: string;
  description?: string;
  anchorId?: string;
  embedded?: boolean;
}

export function ProjectGallery({
  images,
  heading = "Project Gallery",
  title = "Captured at Every Stage.",
  description = "From groundworks to final commissioning, these images document the precision and care that goes into every Nexgen installation.",
  anchorId,
  //embedded,
}: ProjectGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const shouldReduce = useReducedMotion();
  const { sectionRef, lineScale } = useAnimatedBorders();

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [isPending, startTransition] = useTransition();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleImages = images.slice(0, visibleCount);

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    },
    [closeLightbox, goToNext, goToPrev],
  );

  if (images.length === 0) return null;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-card/30 section-padding"
      >
        <AnimatedBorders
          shouldReduce={shouldReduce}
          lineScale={lineScale}
          showBottom={false}
        />
        <div className="section-content max-w-6xl" ref={containerRef}>
          {/* Eyebrow */}
          <motion.div
            id={anchorId}
            className="flex items-center gap-4 mb-6 scroll-mt-36"
            initial={shouldReduce ? {} : { opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="h-px w-8 bg-[hsl(174_100%_35%)]/50 dark:bg-electric-cyan/50" />
            <h2 className="font-mono text-xs tracking-widest uppercase text-[hsl(174_100%_35%)] dark:text-electric-cyan">
              {heading}
            </h2>
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 max-w-3xl"
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg text-foreground dark:text-foreground/70 leading-relaxed max-w-4xl mb-12"
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {description}
          </motion.p>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleImages.map((image, gridIdx) => (
              <motion.button
                key={gridIdx}
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: gridIdx * 0.1 }}
                onClick={() => openLightbox(gridIdx)}
                className="group relative aspect-4/3 rounded-xl overflow-hidden border border-border bg-card/60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`View ${image.alt} in lightbox`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Zoom icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full border border-white/30 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Caption on hover */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm text-white font-medium">
                      {image.caption}
                    </p>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Load-more button */}
          {visibleCount < images.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() =>
                  startTransition(() => setVisibleCount(images.length))
                }
                disabled={isPending}
                aria-label={`Load ${images.length - visibleCount} more images`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card/60 text-sm font-medium text-foreground hover:border-[hsl(174_100%_35%)] hover:text-[hsl(174_100%_35%)] dark:hover:border-electric-cyan dark:hover:text-electric-cyan transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Loading..." : `+ ${images.length - visibleCount} more`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:border-white/40 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:border-white/40 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:border-white/40 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={currentIndex}
              initial={shouldReduce ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Caption */}
            {images[currentIndex].caption && (
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-white/90 text-sm max-w-2xl mx-auto px-4">
                  {images[currentIndex].caption}
                </p>
                <p className="text-white/50 text-xs font-mono mt-2">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
