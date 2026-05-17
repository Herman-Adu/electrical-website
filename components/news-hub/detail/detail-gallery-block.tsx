"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { NewsGalleryImage } from "@/types/news";
import { DetailSectionHeading } from "./detail-section-heading";

// GSAP requires direct DOM access — useEffect is appropriate here
gsap.registerPlugin(ScrollTrigger);

interface DetailGalleryBlockProps {
  gallery: NewsGalleryImage[];
  title?: string;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

function HorizontalScrollGallery({ gallery }: { gallery: NewsGalleryImage[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP requires direct DOM access — useEffect is appropriate here
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Enable smooth drag scrolling with GSAP
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      container.style.cursor = "grabbing";
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.style.cursor = "grab";
    };

    const handleMouseUp = () => {
      isDown = false;
      container.style.cursor = "grab";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    container.style.cursor = "grab";
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-electric-cyan/30"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
        {gallery.map((image, index) => (
          <div
            key={`gallery-h-${index}`}
            className="group relative flex-shrink-0 aspect-video w-72 overflow-hidden rounded-xl border border-electric-cyan/20"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-sm text-foreground">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GridGallery({ gallery }: { gallery: NewsGalleryImage[] }) {
  return (
    <motion.div variants={staggerContainer} className="grid gap-4 sm:grid-cols-2">
      {gallery.map((image, index) => (
        <motion.div
          key={`gallery-${index}`}
          variants={itemVariants}
          className="group relative aspect-video overflow-hidden rounded-xl border border-electric-cyan/20"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {image.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-sm text-foreground">{image.caption}</p>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function DetailGalleryBlock({ gallery, title = 'Gallery' }: DetailGalleryBlockProps) {
  const useHorizontalScroll = gallery.length >= 3;

  return (
    <motion.section
      id="gallery"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <DetailSectionHeading title={title} />
      {useHorizontalScroll ? (
        <HorizontalScrollGallery gallery={gallery} />
      ) : (
        <GridGallery gallery={gallery} />
      )}
    </motion.section>
  );
}
