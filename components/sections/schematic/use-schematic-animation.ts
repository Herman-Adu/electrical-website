"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function getSchematicElements(svgElement: SVGSVGElement | null) {
  const paths = Array.from(
    svgElement?.querySelectorAll<SVGPathElement>(".schematic-path") ?? [],
  );
  const dots = Array.from(
    svgElement?.querySelectorAll<SVGCircleElement>(".schematic-dot") ?? [],
  );
  const labels = Array.from(
    svgElement?.querySelectorAll<SVGTextElement>(".schematic-label") ?? [],
  );

  return { paths, dots, labels };
}

function resetSchematicAnimation(svgElement: SVGSVGElement | null) {
  const { paths, dots, labels } = getSchematicElements(svgElement);

  paths.forEach((path) => {
    gsap.set(path, { strokeDashoffset: path.getTotalLength?.() ?? 500 });
  });

  gsap.set(dots, { opacity: 0, scale: 0 });
  gsap.set(labels, { opacity: 0 });
}

export function useSchematicAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  useGSAP(() => {
    if (!svgRef.current || !isInView) {
      resetSchematicAnimation(svgRef.current);
      return;
    }

    const { paths, dots, labels } = getSchematicElements(svgRef.current);

    gsap.set(dots, { opacity: 0, scale: 0, transformOrigin: "center" });
    gsap.set(labels, { opacity: 0 });

    paths.forEach((path) => {
      const length = path.getTotalLength?.() ?? 500;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });
    });

    const tl = gsap.timeline();

    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 1.8,
      stagger: 0.2,
      ease: "power2.inOut",
    });

    tl.to(
      dots,
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        stagger: 0.1,
        ease: "back.out(2)",
      },
      "-=0.6",
    );

    tl.to(
      labels,
      {
        opacity: 0.7,
        duration: 0.4,
        stagger: 0.08,
        ease: "power1.out",
      },
      "-=0.3",
    );
  }, { scope: svgRef, dependencies: [isInView] });

  return { sectionRef, svgRef, isInView };
}
