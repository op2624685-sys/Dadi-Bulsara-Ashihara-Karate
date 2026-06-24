"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll(".reveal");
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-inner">
        <div className="about-content reveal">
          <span className="eyebrow">Philosophy</span>
          <h2 className="section-title">
            The Art of<br />Ashihara Karate
          </h2>
          <p className="body-text">
            Founded by Hideyuki Ashihara in 1980, Ashihara Karate is a dynamic,
            practical martial art rooted in the principle of{" "}
            <em>Sabaki</em> — the art of moving around an opponent to control
            and redirect force rather than oppose it.
          </p>
          <p className="body-text">
            At Dadi Bulsara Dojo, we honour this tradition through rigorous
            discipline, honest training, and the cultivation of character as
            much as technique. Every punch thrown is a lesson in focus. Every
            fall taken is a lesson in resilience.
          </p>
          <p className="body-text">
            Our curriculum draws from the complete Ashihara system —
            striking, grappling, takedowns, and kata — taught in an environment
            of mutual respect and continuous growth.
          </p>
          <div className="stats-row reveal">
            <Stat number="20+" label="Years of Practice" />
            <Stat number="500+" label="Students Trained" />
            <Stat number="黒帯" label="Black Belt Lineage" />
          </div>
        </div>

        <div className="about-visual reveal">
            <Image src="/img/11.jpg" width={530} height={550} alt="Kanji"></Image>
          <div className="visual-border" />
        </div>
      </div>

      <style jsx>{`
        .about-section {
          background: #060606;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 8rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .about-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(200, 16, 46, 0.4),
            transparent
          );
        }

        .about-inner {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
        }

        .about-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .eyebrow {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.7rem;
          letter-spacing: 0.6em;
          color: #c8102e;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .eyebrow::before {
          content: "";
          display: inline-block;
          width: 36px;
          height: 1px;
          background: #c8102e;
        }

        .section-title {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 400;
          letter-spacing: 0.08em;
          line-height: 1.1;
          color: #fff;
          margin: 0;
        }

        .body-text {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          font-weight: 300;
          line-height: 1.95;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .stats-row {
          display: flex;
          gap: 3rem;
          margin-top: 1rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* About visual */
        .about-visual {
          position: relative;
          aspect-ratio: 3 / 4;
          background: #0d0d0d;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .kanji-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: "Noto Serif JP", serif;
          color: rgba(200, 16, 46, 0.8);
          line-height: 1;
          gap: 0.2em;
        }

        .visual-border {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(200, 16, 46, 0.12);
          pointer-events: none;
        }

        .visual-border::before {
          content: "";
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          bottom: 12px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        @media (max-width: 900px) {
          .about-inner {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
          .about-section {
            padding: 6rem 2rem;
          }
          .about-visual {
            aspect-ratio: 16 / 9;
          }
        }
      `}</style>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-cinzel), 'Cinzel', serif",
          fontSize: "2.2rem",
          fontWeight: 400,
          color: "#c8102e",
          lineHeight: 1,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontSize: "0.7rem",
          letterSpacing: "0.35em",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
          marginTop: "0.5rem",
        }}
      >
        {label}
      </div>
    </div>
  );
}
