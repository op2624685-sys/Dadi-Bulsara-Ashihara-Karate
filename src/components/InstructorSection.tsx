"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

export default function InstructorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    // Subtle parallax on background element
    gsap.to(bg, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    const elements = section.querySelectorAll(".reveal");
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="instructor-section">
      <div ref={bgRef} className="instructor-bg" aria-hidden="true">
        <div className="bg-kanji">
          <Image src="/img/12.jpg" alt="Kanji" width={800} height={800} />
        </div>
      </div>

      <div className="instructor-inner">
        <div className="reveal">
          <span className="eyebrow">Sensei</span>
          <h2 className="section-title">Dadi Bulsara</h2>
        </div>

        <div className="instructor-body reveal">
          <p className="body-text">
            A dedicated practitioner of Ashihara Karate for over two decades,
            Sensei Dadi Bulsara brings both technical mastery and a deep
            philosophical understanding to every class.
          </p>
          <p className="body-text">
            Trained under direct lineage from the Ashihara Honbu Dojo, Sensei
            Bulsara&apos;s approach to teaching centres on the complete
            student — mind, body, and spirit — guided by the principles of
            respect, perseverance, and honest effort.
          </p>
          <p className="body-text">
            The dojo is more than a training space. It is a community forged in
            shared discipline and mutual growth, open to anyone willing to
            commit to the path.
          </p>
        </div>

        <div className="credentials reveal">
          <Credential label="Lineage" value={"Ashihara Honbu\nDirect Lineage"} />
          <Credential label="System" value={"Sabaki Method\nFull Curriculum"} />
          <Credential label="Experience" value={"20+ Years\nActive Practice"} />
        </div>
      </div>

      <style jsx>{`
        .instructor-section {
          background: #060606;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 8rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .instructor-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(200, 16, 46, 0.3),
            transparent
          );
        }

        .instructor-bg {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 4rem;
          pointer-events: none;
        }

        .bg-kanji {
          font-family: "Noto Serif JP", serif;
          font-size: 30vw;
          line-height: 1;
          color: rgba(255, 255, 255, 0.025);
          user-select: none;
        }

        .instructor-inner {
          max-width: 700px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
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
          margin-bottom: 0.8rem;
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
          color: #fff;
          margin: 0;
        }

        .instructor-body {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }

        .body-text {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: clamp(1rem, 1.4vw, 1.2rem);
          font-weight: 300;
          line-height: 1.95;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .credentials {
          display: flex;
          gap: 0;
          flex-wrap: wrap;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 2rem;
        }

        @media (max-width: 640px) {
          .instructor-section {
            padding: 6rem 2rem;
          }
        }
      `}</style>
    </section>
  );
}

function Credential({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderLeft: "1px solid rgba(200,16,46,0.3)",
        paddingLeft: "1.5rem",
        marginRight: "3rem",
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-cinzel), 'Cinzel', serif",
          fontSize: "0.65rem",
          letterSpacing: "0.4em",
          color: "#c8102e",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
          fontSize: "1rem",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.6)",
          whiteSpace: "pre-line",
        }}
      >
        {value}
      </div>
    </div>
  );
}
