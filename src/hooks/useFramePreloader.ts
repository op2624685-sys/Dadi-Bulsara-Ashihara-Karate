"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 121;

export function getFrameUrl(index: number): string {
  // index is 0-based; files are frame_001.png … frame_121.png
  return `/frames/frame_${String(index + 1).padStart(3, "0")}.png`;
}

interface FramePreloaderResult {
  frames: HTMLImageElement[];
  isLoaded: boolean;
  progress: number; // 0–1
}

export function useFramePreloader(): FramePreloaderResult {
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const loadedCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    loadedCountRef.current = 0;
    framesRef.current = new Array(TOTAL_FRAMES);

    const onLoad = () => {
      if (cancelled) return;
      loadedCountRef.current++;
      const p = loadedCountRef.current / TOTAL_FRAMES;
      setProgress(p);
      if (loadedCountRef.current >= TOTAL_FRAMES) {
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      // Decode asynchronously to avoid blocking the main thread
      img.onload = () => {
        img.decode?.().catch(() => {}).finally(onLoad);
      };
      img.onerror = onLoad; // Count failures so we don't hang
      img.src = getFrameUrl(i);
      framesRef.current[i] = img;
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    frames: framesRef.current,
    isLoaded,
    progress,
  };
}

export { TOTAL_FRAMES };
