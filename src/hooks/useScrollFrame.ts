"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { TOTAL_FRAMES } from "./useFramePreloader";

interface UseScrollFrameOptions {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  onFrame: (frameIndex: number) => void;
  enabled: boolean;
}

export function useScrollFrame({
  wrapperRef,
  onFrame,
  enabled,
}: UseScrollFrameOptions) {
  const stRef = useRef<ScrollTrigger | null>(null);
  const rafRef = useRef<number | null>(null);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Drive animation via a GSAP proxy object
    const proxy = { frame: 0 };

    stRef.current = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const targetFrame = Math.round(
          Math.min(self.progress * (TOTAL_FRAMES - 1), TOTAL_FRAMES - 1)
        );

        if (targetFrame === currentFrameRef.current) return;

        // Cancel any pending RAF and schedule new one
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }

        currentFrameRef.current = targetFrame;
        rafRef.current = requestAnimationFrame(() => {
          onFrame(targetFrame);
          rafRef.current = null;
        });
      },
    });

    return () => {
      stRef.current?.kill();
      stRef.current = null;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [enabled, wrapperRef, onFrame]);
}
