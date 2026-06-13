"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useScrollFrame
//
// Unchanged contract — still calls onFrame(frameIndex) on every scroll update.
// Only internal change: ScrollTrigger now reads from the Lenis proxy instead
// of window.scrollY directly, so frame updates are smooth and in sync with
// Lenis's virtual scroll position.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { TOTAL_FRAMES } from "./useFramePreloader";

interface UseScrollFrameOptions {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  onFrame:    (frameIndex: number) => void;
  enabled:    boolean;
}

export function useScrollFrame({
  wrapperRef,
  onFrame,
  enabled,
}: UseScrollFrameOptions) {
  const stRef           = useRef<ScrollTrigger | null>(null);
  const rafRef          = useRef<number | null>(null);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Small delay so LenisProvider's scrollerProxy is registered first.
    // RAF ensures we're past the current paint before creating the trigger.
    const raf = requestAnimationFrame(() => {
      stRef.current = ScrollTrigger.create({
        trigger:  wrapper,
        start:    "top top",
        end:      "bottom bottom",
        // scroller must match the proxy target set in LenisProvider
        scroller: document.documentElement,
        scrub:    0.5,
        onUpdate: (self) => {
          const targetFrame = Math.round(
            Math.min(self.progress * (TOTAL_FRAMES - 1), TOTAL_FRAMES - 1)
          );

          if (targetFrame === currentFrameRef.current) return;

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
    });

    return () => {
      cancelAnimationFrame(raf);
      stRef.current?.kill();
      stRef.current = null;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [enabled, wrapperRef, onFrame]);
}