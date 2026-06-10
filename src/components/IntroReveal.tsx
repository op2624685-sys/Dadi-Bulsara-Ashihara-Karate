"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface IntroRevealProps {
  onComplete: () => void;
}

export default function IntroReveal({ onComplete }: IntroRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const name = nameRef.current;
    const subtitle = subtitleRef.current;
    const divider = dividerRef.current;
    if (!container || !text || !name || !subtitle || !divider) return;

    // Initial state
    gsap.set([name, subtitle, divider], { opacity: 0, filter: "blur(12px)" });
    gsap.set(name, { y: 20 });
    gsap.set(subtitle, { y: 12 });
    gsap.set(divider, { scaleX: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the entire container
        gsap.to(container, {
          opacity: 0,
          duration: 0.9,
          ease: "power2.inOut",
          onComplete: () => {
            container.style.display = "none";
            onComplete();
          },
        });
      },
    });

    // Phase 1: 0–1s — black screen
    tl.to({}, { duration: 1 });

    // Phase 2: 1–2.5s — text reveal
    tl.to(
      name,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
      },
      "reveal"
    )
      .to(
        divider,
        {
          scaleX: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out",
        },
        "reveal+=0.3"
      )
      .to(
        subtitle,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
        },
        "reveal+=0.5"
      );

    // Phase 3: 2.5–3.5s — subtle breathing
    tl.to(text, {
      scale: 1.012,
      duration: 0.9,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 1,
    });

    // Phase 4: 3.5–4.2s — text fades
    tl.to([name, divider, subtitle], {
      opacity: 0,
      y: -8,
      filter: "blur(8px)",
      duration: 0.7,
      ease: "power2.in",
      stagger: 0.05,
    });

    // Phase 5: 4.2–5s — hold black, then onComplete fires
    tl.to({}, { duration: 0.4 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="intro-container"
      aria-label="Dadi Bulsara Ashihara Karate"
      role="presentation"
    >
      <div ref={textRef} className="intro-text">
        <div ref={nameRef} className="intro-name">
          Dadi Bulsara
        </div>
        <div ref={dividerRef} className="intro-divider" />
        <div ref={subtitleRef} className="intro-subtitle">
          Ashihara Karate
        </div>
      </div>

      <style jsx>{`
        .intro-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .intro-text {
          text-align: center;
          transform-origin: center center;
        }

        .intro-name {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: clamp(2.2rem, 7vw, 5.5rem);
          font-weight: 700;
          letter-spacing: 0.28em;
          color: #ffffff;
          line-height: 1;
          text-transform: uppercase;
        }

        .intro-divider {
          width: 90px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #c8102e,
            transparent
          );
          margin: 1.4em auto;
          transform-origin: center;
        }

        .intro-subtitle {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: clamp(1rem, 2.8vw, 1.8rem);
          font-weight: 300;
          letter-spacing: 0.6em;
          color: rgba(255, 255, 255, 0.75);
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
