"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 245;

export function getFrameUrl(index: number): string {
  return `/frames/frame_${String(index + 1).padStart(3, "0")}.webp`;
}

interface FramePreloaderResult {
  frames: HTMLImageElement[];
  isLoaded: boolean;
  progress: number;
}

export function useFramePreloader(): FramePreloaderResult {
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const loadedCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    loadedCountRef.current = 0;

    const loadedFrames = new Array<HTMLImageElement>(TOTAL_FRAMES);

    const onLoad = () => {
      if (cancelled) return;

      loadedCountRef.current++;

      setProgress(loadedCountRef.current / TOTAL_FRAMES);

      if (loadedCountRef.current >= TOTAL_FRAMES) {
        setFrames([...loadedFrames]);
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();

      img.onload = () => {
        img.decode?.().catch(() => {}).finally(onLoad);
      };

      img.onerror = onLoad;

      img.src = getFrameUrl(i);

      loadedFrames[i] = img;
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    frames,
    isLoaded,
    progress,
  };
}

export { TOTAL_FRAMES };