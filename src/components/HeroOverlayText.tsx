"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Message {
  text: string;
  fromFrame: number;
  toFrame: number;
}

const MESSAGES: Message[] = [
  { text: "Focus", fromFrame: 1, toFrame: 50 },
  { text: "Discipline", fromFrame: 51, toFrame: 110 },
  { text: "Strength", fromFrame: 111, toFrame: 180 },
  { text: "Become Unstoppable", fromFrame: 181, toFrame: 245 },
];

function getMessageIndex(frameIndex: number): number {
  const frame = frameIndex + 1; // convert 0-based to 1-based
  for (let i = MESSAGES.length - 1; i >= 0; i--) {
    if (frame >= MESSAGES[i].fromFrame) return i;
  }
  return 0;
}

interface HeroOverlayTextProps {
  frameIndex: number;
  visible: boolean;
}

export default function HeroOverlayText({
  frameIndex,
  visible,
}: HeroOverlayTextProps) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(-1);

  // Show first message on mount
  useEffect(() => {
    if (!visible) return;
    const idx = getMessageIndex(0);
    const el = refs.current[idx];
    if (el) {
      gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)" });
      activeIndexRef.current = idx;
    }
  }, [visible]);

  // Transition messages on frame change
  useEffect(() => {
    if (!visible) return;
    const newIdx = getMessageIndex(frameIndex);
    if (newIdx === activeIndexRef.current) return;

    const prevEl = refs.current[activeIndexRef.current];
    const nextEl = refs.current[newIdx];
    const prev = activeIndexRef.current;
    activeIndexRef.current = newIdx;

    // Fade out previous
    if (prevEl) {
      gsap.to(prevEl, {
        opacity: 0,
        y: -10,
        filter: "blur(6px)",
        duration: 0.6,
        ease: "power2.in",
      });
    }

    // Fade in new
    if (nextEl) {
      gsap.fromTo(
        nextEl,
        { opacity: 0, y: 16, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }
  }, [frameIndex, visible]);

  return (
    <div className="overlay-text-container">

      {/* Dynamic message */}
      <div className="message-area">
        {MESSAGES.map((msg, i) => (
          <div
            key={msg.text}
            ref={(el) => { refs.current[i] = el; }}
            className="hero-message"
            style={{ opacity: 0 }}
            aria-live="polite"
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <span className="scroll-label">Scroll</span>
        <div className="scroll-line" />
      </div>

      {/* Side label */}
      <div className="side-label" aria-hidden="true">
        <span>Ashihara · Honbu Dojo · 1980</span>
      </div>

      <style jsx>{`
        .overlay-text-container {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          display: flex;
          flex-direction: column;
        }

        /* ── Dynamic message ── */
        .message-area {
          position: absolute;
          bottom: 18vh;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-message {
          position: absolute;
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: clamp(1.6rem, 5vw, 4.5rem);
          font-weight: 400;
          letter-spacing: 0.25em;
          color: rgba(255, 255, 255, 0.95);
          text-transform: uppercase;
          text-align: center;
          white-space: nowrap;
          text-shadow: 0 0 80px rgba(0, 0, 0, 0.9);
          will-change: opacity, transform, filter;
        }

        /* ── Scroll indicator ── */
        .scroll-indicator {
          position: absolute;
          bottom: 4vh;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .scroll-label {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 0.6rem;
          letter-spacing: 0.55em;
          color: rgba(255, 255, 255, 0.35);
          text-transform: uppercase;
          animation: scrollFade 2.2s ease-in-out infinite;
        }

        .scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(
            180deg,
            rgba(200, 16, 46, 0.7),
            transparent
          );
          animation: scrollFade 2.2s ease-in-out infinite;
        }

        /* ── Side label ── */
        .side-label {
          position: absolute;
          right: 2.5vw;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          transform-origin: center center;
        }

        .side-label span {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 0.6rem;
          letter-spacing: 0.45em;
          color: rgba(200, 16, 46, 0.45);
          text-transform: uppercase;
          white-space: nowrap;
        }

        @keyframes scrollFade {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .hero-message {
            white-space: normal;
            padding: 0 2rem;
            text-align: center;
          }
          .side-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
