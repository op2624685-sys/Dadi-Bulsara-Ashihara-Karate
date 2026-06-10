"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import IntroReveal from "@/components/IntroReveal";
import HeroSequence from "@/components/HeroSequence";
import AboutSection from "@/components/AboutSection";
import ProgramsSection from "@/components/ProgramsSection";
import InstructorSection from "@/components/InstructorSection";
import CTASection from "@/components/CTASection";
import ProgressBar from "@/components/ProgressBar";
import { useFramePreloader } from "@/hooks/useFramePreloader";

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  // Preload all 121 frames while intro is playing
  const { frames, isLoaded } = useFramePreloader();
  const isLoadedRef = useRef(isLoaded);
  useEffect(() => { isLoadedRef.current = isLoaded; }, [isLoaded]);

  // Only reveal hero when BOTH intro animation AND frames are loaded
  const handleIntroComplete = useCallback(() => {
    if (isLoadedRef.current) {
      setIntroComplete(true);
      setHeroVisible(true);
    } else {
      // Poll until frames are loaded (max 5s fallback)
      const start = Date.now();
      const poll = setInterval(() => {
        if (isLoadedRef.current || Date.now() - start > 5000) {
          clearInterval(poll);
          setIntroComplete(true);
          setHeroVisible(true);
        }
      }, 100);
    }
  }, []);

  return (
    <main>
      {/* Cinematic intro — hides while frames preload in background */}
      <IntroReveal onComplete={handleIntroComplete} />

      {/* Page-level scroll progress */}
      {introComplete && <ProgressBar />}

      {/* Hero canvas frame sequence */}
      <HeroSequence frames={frames} visible={heroVisible} />

      {/* Content sections — always in DOM for SEO, animated on scroll */}
      <AboutSection />
      <ProgramsSection />
      <InstructorSection />
      <CTASection />
    </main>
  );
}
