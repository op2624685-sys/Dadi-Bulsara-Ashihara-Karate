"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface Program {
  kanji: string;
  title: string;
  age: string;
  description: string;
}

const PROGRAMS: Program[] = [
  {
    kanji: "子",
    title: "Kids Program",
    age: "Ages 5 – 12",
    description:
      "Building confidence, coordination, and character through structured, age-appropriate karate training in a safe and encouraging environment.",
  },
  {
    kanji: "若",
    title: "Teen Program",
    age: "Ages 13 – 17",
    description:
      "Channeling energy into discipline. Teens develop leadership, resilience, and practical self-defence under focused mentorship.",
  },
  {
    kanji: "武",
    title: "Adult Program",
    age: "Ages 18+",
    description:
      "Comprehensive Ashihara training covering Sabaki movement, striking, kata, and practical self-defence principles for modern life.",
  },
  {
    kanji: "極",
    title: "Advanced Fighters",
    age: "By Assessment",
    description:
      "Intensive conditioning and competition preparation for dedicated practitioners seeking the highest level of mastery and excellence.",
  },
];

export default function ProgramsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll(".program-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );

    const header = section.querySelector(".programs-header");
    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="programs-section">
      <div className="programs-inner">
        <div className="programs-header">
          <span className="eyebrow">Training Programs</span>
          <h2 className="section-title">Choose Your Path</h2>
        </div>

        <div className="programs-grid">
          {PROGRAMS.map((program) => (
            <div key={program.title} className="program-card">
              <div className="card-kanji">{program.kanji}</div>
              <div className="card-title">{program.title}</div>
              <p className="card-desc">{program.description}</p>
              <div className="card-age">{program.age}</div>
              <div className="card-hover-line" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .programs-section {
          background: #040404;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 8rem 4rem;
          position: relative;
        }

        .programs-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.06),
            transparent
          );
        }

        .programs-inner {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .programs-header {
          margin-bottom: 4rem;
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
          margin-bottom: 1.2rem;
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

        /* Grid */
        .programs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        /* Card */
        .program-card {
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.07);
          padding: 2.5rem 1.8rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: border-color 0.4s ease, transform 0.4s ease;
          overflow: hidden;
          cursor: default;
        }

        .program-card:hover {
          border-color: rgba(200, 16, 46, 0.35);
          transform: translateY(-5px);
        }

        .program-card:hover .card-hover-line {
          transform: scaleX(1);
        }

        .card-kanji {
          font-family: "Noto Serif JP", serif;
          font-size: 2.5rem;
          color: rgba(200, 16, 46, 0.55);
          line-height: 1;
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          color: #fff;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .card-desc {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 1rem;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
          flex: 1;
        }

        .card-age {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          color: #c8102e;
          text-transform: uppercase;
          margin-top: 1.8rem;
        }

        .card-hover-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            #c8102e,
            transparent
          );
          transform: scaleX(0);
          transition: transform 0.4s ease;
          transform-origin: center;
        }

        @media (max-width: 1024px) {
          .programs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .programs-section {
            padding: 6rem 2rem;
          }
          .programs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
