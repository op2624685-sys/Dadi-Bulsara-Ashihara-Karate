"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const ink = inkRef.current;
    if (!section || !ink) return;

    // Ink splash reveal
    gsap.fromTo(
      ink,
      { scale: 0.4, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );

    const elements = section.querySelectorAll(".reveal");
    elements.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: i * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="cta-section">
      {/* Ink splash background */}
      <div ref={inkRef} className="ink-splash" aria-hidden="true">
        <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <text
            x="400"
            y="620"
            textAnchor="middle"
            fontFamily="serif"
            fontSize="640"
            fill="rgba(200,16,46,0.04)"
          >
            始
          </text>
        </svg>
      </div>

      <div className="cta-inner">
        <span className="eyebrow reveal">Begin</span>
        <h2 className="cta-headline reveal">
          Start Your<br />Journey
        </h2>
        <p className="cta-sub reveal">
          The dojo awaits. Your path begins with a single step.
        </p>
        <Link href="/signup">
          <button className="cta-btn reveal" type="button">
            Join The Dojo
          </button>
        </Link>
      </div>

      <div className="footer-bar">
        <span className="footer-text">Dadi Bulsara Ashihara Karate</span>
        <span className="footer-text footer-right">
          空手道 · The Way of the Empty Hand
        </span>
      </div>

      <style jsx>{`
        .cta-section {
          background: #000;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8rem 4rem 0;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(200, 16, 46, 0.5),
            transparent
          );
        }

        .ink-splash {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .ink-splash svg {
          width: 100%;
          height: 100%;
          max-width: 900px;
        }

        .cta-inner {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 700px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          flex: 1;
          justify-content: center;
        }

        .eyebrow {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.7rem;
          letter-spacing: 0.7em;
          color: #c8102e;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .eyebrow::before,
        .eyebrow::after {
          content: "";
          display: inline-block;
          width: 36px;
          height: 1px;
          background: #c8102e;
        }

        .cta-headline {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: clamp(2.8rem, 6.5vw, 5.5rem);
          font-weight: 400;
          letter-spacing: 0.1em;
          line-height: 1.05;
          color: #fff;
          margin: 0;
        }

        .cta-sub {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: clamp(1rem, 1.6vw, 1.25rem);
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.45);
          margin: 0.5rem 0 1rem;
        }

        .cta-btn {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.75rem;
          letter-spacing: 0.55em;
          text-transform: uppercase;
          color: #000;
          background: #c8102e;
          border: none;
          padding: 1.2rem 4rem;
          cursor: pointer;
          transition: background 0.3s ease, letter-spacing 0.3s ease,
            transform 0.2s ease;
          outline-offset: 4px;
        }

        .cta-btn:hover {
          background: #e01535;
          letter-spacing: 0.65em;
        }

        .cta-btn:active {
          transform: scale(0.97);
        }

        .cta-btn:focus-visible {
          outline: 2px solid #c8102e;
        }

        /* Footer */
        .footer-bar {
          width: 100%;
          padding: 2.5rem 4rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .footer-text {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
        }

        @media (max-width: 640px) {
          .cta-section {
            padding: 6rem 2rem 0;
          }
          .footer-bar {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            padding: 2rem;
          }
          .footer-right {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
