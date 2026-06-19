"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { camps } from "@/data/camps";

gsap.registerPlugin(ScrollTrigger);

const TYPE_META = {
  upcoming: { color: "#34D399", dim: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)" },
  past:     { color: "rgba(238,232,223,0.35)", dim: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)" },
};

export default function CampsPage() {
  const [filter, setFilter] = useState<"all" | "past" | "upcoming">("all");
  const heroRef   = useRef<HTMLDivElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);

  const filtered = camps.filter(c =>
    filter === "all" ? true : (filter === "upcoming" ? c.status === "upcoming" : c.status !== "upcoming")
  );

  /* ── Hero entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".camps-hero-line",
        { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power4.inOut", transformOrigin: "left" }
      );
      gsap.fromTo(".camps-hero-kicker",
        { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(".camps-hero-title .word",
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, stagger: 0.12, duration: 1, ease: "power4.out", delay: 0.3 }
      );
      gsap.fromTo(".camps-hero-sub",
        { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.9 }
      );
      gsap.fromTo(".camps-hero-stat",
        { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power3.out", delay: 1.1 }
      );
      gsap.fromTo(".camps-filter-bar",
        { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 1.3 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* ── Cards scroll reveal ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".camp-card",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".camps-grid", start: "top 85%", once: true }
        }
      );
    });
    return () => ctx.revert();
  }, [filter]);

  const totalParticipants = camps.reduce((a, c) => a + c.participants, 0);

  return (
    <>
      <style>{CSS}</style>
      <main className="camps-root">

        {/* ── BG ── */}
        <div className="camps-bg-glow camps-bg-glow--1" />
        <div className="camps-bg-glow camps-bg-glow--2" />
        <div className="camps-bg-grid" />

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="camps-hero" ref={heroRef}>

          {/* Vertical side label */}
          <div className="camps-side-label">
            <span>Annual Camp · Dadi Bulsara Federation</span>
          </div>

          <div className="camps-hero-inner">
            {/* Kicker */}
            <div className="camps-hero-kicker">
              <div className="camps-hero-line" />
              <span>Every Year, A New Camp</span>
              <div className="camps-hero-line" />
            </div>

            {/* Title — word-by-word reveal */}
            <div className="camps-hero-title-wrap">
              <h1 className="camps-hero-title">
                {"DADI".split("").map((ch, i) => (
                  <span key={i} className="word" style={{ display: "inline-block" }}>{ch}</span>
                ))}
                <br />
                <em className="camps-hero-title-em">
                  {"Federation".split("").map((ch, i) => (
                    <span key={i} className="word" style={{ display: "inline-block" }}>{ch}</span>
                  ))}
                </em>
              </h1>
            </div>

            <p className="camps-hero-sub">
              Dadi Bulsara — intensive residential training camps — are the heartbeat of our federation calendar. Each one a chapter. Each one a crucible.
            </p>

            {/* Stats row */}
            <div className="camps-stats-row">
              {[
                { num: camps.length, label: "Camps Held" },
                { num: totalParticipants, label: "Total Athletes" },
                { num: new Set(camps.map(c => c.location)).size, label: "Locations" },
                { num: new Date().getFullYear() - 2009, label: "Years of Legacy" },
              ].map((s, i) => (
                <div key={i} className="camps-hero-stat">
                  <div className="camps-stat-num">{s.num}+</div>
                  <div className="camps-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="camps-scroll-hint">
            <div className="camps-scroll-line" />
            <span>Scroll</span>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FILTER + GRID
        ══════════════════════════════════════ */}
        <section className="camps-body">

          {/* Filter bar */}
          <div className="camps-filter-bar">
            <div className="camps-filter-left">
              {(["all", "upcoming", "past"] as const).map(f => (
                <button
                  key={f}
                  className={`camps-filter-btn ${filter === f ? "camps-filter-btn--on" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? `All Camps (${camps.length})` : f === "upcoming" ? `Upcoming (${camps.filter(c => c.status === "upcoming").length})` : `Past (${camps.filter(c => c.status !== "upcoming").length})`}
                </button>
              ))}
            </div>
            <div className="camps-filter-count">
              <span className="camps-filter-count-num">{filtered.length}</span>
              <span className="camps-filter-count-lbl">camp{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* ── GRID ── */}
          <div className="camps-grid">
            {filtered.map((camp, idx) => (
              <CampCard key={camp.slug} camp={camp} idx={idx} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="camps-bottom-cta">
            <div className="camps-bottom-cta-line" />
            <div className="camps-bottom-cta-content">
              <p className="camps-bottom-cta-txt">Want to be part of the next Dadi Bulsara Camp?</p>
              <Link href="/events" className="camps-bottom-btn">
                View Upcoming Events
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginLeft: 10 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

/* ══════════════════════════════════════
   CAMP CARD
══════════════════════════════════════ */
function CampCard({ camp, idx }: { camp: any; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const isUpcoming = camp.status === "upcoming";

  const onEnter = () => {
    setHovered(true);
    if (imgRef.current) gsap.to(imgRef.current, { scale: 1.07, duration: 0.8, ease: "power3.out" });
  };
  const onLeave = () => {
    setHovered(false);
    if (imgRef.current) gsap.to(imgRef.current, { scale: 1, duration: 0.7, ease: "power3.out" });
  };

  return (
    <Link
      href={`/camps/${camp.slug}`}
      className="camp-card"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      ref={cardRef as any}
    >
      {/* ── IMAGE ── */}
      <div className="camp-card-img-wrap">
        <div ref={imgRef} className="camp-card-img-inner">
          <Image
            src={camp.heroImage}
            alt={camp.name}
            fill
            className="camp-card-img"
            style={{ filter: hovered ? "grayscale(0%) brightness(0.75)" : "grayscale(30%) brightness(0.6)" }}
          />
        </div>

        {/* Year badge */}
        <div className="camp-card-year">{camp.year}</div>

        {/* Status badge */}
        <div className="camp-card-status" style={{
          color: isUpcoming ? "#34D399" : "rgba(238,232,223,0.5)",
          background: isUpcoming ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${isUpcoming ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)"}`,
        }}>
          {isUpcoming && <span className="camp-status-dot" />}
          {isUpcoming ? "Upcoming" : "Past"}
        </div>

        {/* Overlay gradient */}
        <div className="camp-card-overlay" />

        {/* Bottom content ON the image */}
        <div className="camp-card-img-content">
          <div className="camp-card-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11, marginRight: 5, opacity: 0.6 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {camp.location}
          </div>
          <h2 className="camp-card-title">{camp.name}<br /><em>{camp.subtitle}</em></h2>
        </div>
      </div>

      {/* ── INFO ── */}
      <div className="camp-card-info">
        <div className="camp-card-meta">
          <div className="camp-card-meta-item">
            <span className="camp-card-meta-lbl">Duration</span>
            <span className="camp-card-meta-val">{camp.duration}</span>
          </div>
          <div className="camp-card-meta-sep" />
          <div className="camp-card-meta-item">
            <span className="camp-card-meta-lbl">Athletes</span>
            <span className="camp-card-meta-val">{camp.participants}</span>
          </div>
          <div className="camp-card-meta-sep" />
          <div className="camp-card-meta-item">
            <span className="camp-card-meta-lbl">Instructors</span>
            <span className="camp-card-meta-val">{camp.instructorCount}</span>
          </div>
        </div>

        {camp.kana && (
          <p className="camp-card-kana">{camp.kana}</p>
        )}

        <div className="camp-card-cta">
          <span className="camp-card-cta-txt">
            {isUpcoming ? "View Details & Enroll" : "View Full Details"}
          </span>
          <div className="camp-card-arrow" style={{ background: hovered ? "#C0392B" : "rgba(255,255,255,0.05)", borderColor: hovered ? "#C0392B" : "rgba(255,255,255,0.1)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, transform: hovered ? "translateX(2px)" : "none", transition: "transform 0.3s" }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════
   CSS
══════════════════════════════════════ */
const CSS = `
.camps-root {
  min-height: 100vh;
  background: #060606;
  color: #EEE8DF;
  font-family: var(--font-inter, 'Inter', sans-serif);
  overflow-x: hidden;
  position: relative;
}
.camps-bg-glow { position: fixed; pointer-events: none; border-radius: 50%; z-index: 0; }
.camps-bg-glow--1 { top: -15%; left: 50%; transform: translateX(-50%); width: 90vw; height: 55vh; background: radial-gradient(ellipse, rgba(192,57,43,.07) 0%, transparent 70%); }
.camps-bg-glow--2 { bottom: 0; right: -10%; width: 55vw; height: 60vh; background: radial-gradient(ellipse, rgba(192,57,43,.04) 0%, transparent 70%); }
.camps-bg-grid { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px); background-size: 72px 72px; }

/* ── HERO ── */
.camps-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 72px 80px;
  z-index: 1;
  overflow: hidden;
}
.camps-hero::before {
  content: 'BULSARA';
  position: absolute;
  font-family: var(--font-bebas, 'Bebas Neue', sans-serif);
  font-size: clamp(120px, 22vw, 320px);
  letter-spacing: .06em;
  color: rgba(255,255,255,.018);
  pointer-events: none;
  user-select: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  line-height: 1;
}
.camps-side-label {
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: center center;
  white-space: nowrap;
  font-size: 9px;
  letter-spacing: .28em;
  text-transform: uppercase;
  color: rgba(238,232,223,.2);
  font-weight: 500;
  z-index: 2;
}
.camps-hero-inner {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 1000px;
  margin: 0 auto;
}
.camps-hero-kicker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 28px;
}
.camps-hero-line {
  flex: 1;
  max-width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #C0392B, transparent);
  transform-origin: left;
}
.camps-hero-kicker span {
  font-size: 10px;
  letter-spacing: .32em;
  text-transform: uppercase;
  color: #C0392B;
  font-weight: 500;
  white-space: nowrap;
}
.camps-hero-title-wrap { overflow: hidden; margin-bottom: 6px; }
.camps-hero-title {
  font-family: var(--font-bebas, 'Bebas Neue', sans-serif);
  font-size: clamp(72px, 12vw, 176px);
  line-height: .88;
  letter-spacing: .04em;
  color: #EEE8DF;
  margin: 0;
}
.camps-hero-title-em {
  font-style: normal;
  color: transparent;
  -webkit-text-stroke: 1px rgba(238,232,223,.25);
  display: block;
}
.camps-hero-sub {
  font-family: var(--font-cormorant, 'Cormorant Garamond', serif);
  font-style: italic;
  font-size: clamp(16px, 1.6vw, 22px);
  font-weight: 400;
  line-height: 1.65;
  color: rgba(238,232,223,.5);
  max-width: 680px;
  margin: 28px auto 52px;
}
.camps-stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  border: 1px solid rgba(255,255,255,.07);
  background: rgba(8,8,8,.7);
  backdrop-filter: blur(16px);
  max-width: 640px;
  margin: 0 auto;
}
.camps-hero-stat {
  flex: 1;
  padding: 24px 20px;
  border-right: 1px solid rgba(255,255,255,.07);
  text-align: center;
}
.camps-hero-stat:last-child { border-right: none; }
.camps-stat-num {
  font-family: var(--font-bebas, 'Bebas Neue', sans-serif);
  font-size: 44px;
  color: #C0392B;
  line-height: 1;
  letter-spacing: .02em;
}
.camps-stat-lbl {
  font-size: 8px;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: rgba(238,232,223,.35);
  margin-top: 5px;
}
.camps-scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 2;
}
.camps-scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, #C0392B, transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse { 0%,100%{opacity:.3;transform:scaleY(.5);transform-origin:top} 50%{opacity:1;transform:scaleY(1)} }
.camps-scroll-hint span {
  font-size: 8px;
  letter-spacing: .3em;
  text-transform: uppercase;
  color: rgba(238,232,223,.25);
}

/* ── BODY ── */
.camps-body {
  position: relative;
  z-index: 1;
  padding: 0 72px 100px;
}

/* ── FILTER BAR ── */
.camps-filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 0 32px;
  border-bottom: 1px solid rgba(255,255,255,.06);
  margin-bottom: 48px;
  flex-wrap: wrap;
}
.camps-filter-left { display: flex; gap: 4px; background: rgba(0,0,0,.6); border: 1px solid rgba(255,255,255,.07); padding: 4px; }
.camps-filter-btn {
  background: transparent;
  border: none;
  color: rgba(238,232,223,.4);
  padding: .5rem 1.3rem;
  font-family: inherit;
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .3s;
}
.camps-filter-btn--on { background: #C0392B; color: #fff; box-shadow: 0 4px 16px rgba(192,57,43,.35); }
.camps-filter-count { display: flex; align-items: baseline; gap: 6px; }
.camps-filter-count-num { font-family: var(--font-bebas, 'Bebas Neue', sans-serif); font-size: 36px; color: #C0392B; line-height: 1; }
.camps-filter-count-lbl { font-size: .65rem; letter-spacing: .2em; text-transform: uppercase; color: rgba(238,232,223,.3); }

/* ── GRID ── */
.camps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

/* ── CAMP CARD ── */
.camp-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: #0A0A0A;
  position: relative;
  overflow: hidden;
  transition: z-index .1s;
  outline: none;
}

/* Image */
.camp-card-img-wrap {
  position: relative;
  padding-top: 72%;
  overflow: hidden;
}
.camp-card-img-inner {
  position: absolute;
  inset: 0;
  will-change: transform;
}
.camp-card-img {
  object-fit: cover;
  transition: filter .5s ease;
  display: block;
  width: 100%;
  height: 100%;
}
.camp-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(6,6,6,.96) 0%, rgba(6,6,6,.4) 45%, rgba(6,6,6,.1) 100%);
  z-index: 1;
}

/* year badge */
.camp-card-year {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 3;
  font-family: var(--font-bebas, 'Bebas Neue', sans-serif);
  font-size: 13px;
  letter-spacing: .18em;
  background: rgba(6,6,6,.75);
  border: 1px solid rgba(255,255,255,.12);
  color: rgba(238,232,223,.7);
  padding: 4px 10px;
  backdrop-filter: blur(8px);
}

/* status */
.camp-card-status {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 3;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(8px);
}
.camp-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #34D399; animation: pls2 2s infinite; flex-shrink: 0; }
@keyframes pls2 { 0%{box-shadow:0 0 0 0 rgba(52,211,153,.5)} 70%{box-shadow:0 0 0 7px rgba(52,211,153,0)} 100%{box-shadow:0 0 0 0 rgba(52,211,153,0)} }

/* image bottom content */
.camp-card-img-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 24px;
  z-index: 2;
}
.camp-card-location {
  display: flex;
  align-items: center;
  font-size: 10px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: rgba(238,232,223,.45);
  margin-bottom: 8px;
}
.camp-card-title {
  font-family: var(--font-bebas, 'Bebas Neue', sans-serif);
  font-size: clamp(28px, 3vw, 42px);
  line-height: .92;
  letter-spacing: .04em;
  color: #EEE8DF;
  margin: 0;
}
.camp-card-title em {
  color: #C0392B;
  font-style: normal;
  display: block;
}

/* info strip */
.camp-card-info {
  padding: 20px 24px 24px;
  border-top: 1px solid rgba(255,255,255,.06);
  background: rgba(8,8,8,.95);
}
.camp-card-meta {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 14px;
}
.camp-card-meta-item { flex: 1; }
.camp-card-meta-sep { width: 1px; height: 28px; background: rgba(255,255,255,.07); margin: 0 12px; }
.camp-card-meta-lbl { font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: rgba(238,232,223,.3); display: block; margin-bottom: 4px; }
.camp-card-meta-val { font-family: var(--font-bebas, 'Bebas Neue', sans-serif); font-size: 22px; color: #EEE8DF; line-height: 1; letter-spacing: .03em; }
.camp-card-kana { font-family: var(--font-cormorant, 'Cormorant Garamond', serif); font-style: italic; font-size: 12px; color: rgba(238,232,223,.2); letter-spacing: .12em; margin: 0 0 16px; }
.camp-card-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,.05);
}
.camp-card-cta-txt { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: rgba(238,232,223,.4); }
.camp-card-arrow {
  width: 30px;
  height: 30px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .35s, border-color .35s;
}

/* ── BOTTOM CTA ── */
.camps-bottom-cta { margin-top: 80px; }
.camps-bottom-cta-line { height: 1px; background: rgba(255,255,255,.06); margin-bottom: 48px; }
.camps-bottom-cta-content { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
.camps-bottom-cta-txt { font-family: var(--font-cormorant, 'Cormorant Garamond', serif); font-style: italic; font-size: clamp(22px, 2.5vw, 32px); font-weight: 400; color: rgba(238,232,223,.6); margin: 0; }
.camps-bottom-btn {
  display: inline-flex;
  align-items: center;
  background: #C0392B;
  color: #fff;
  text-decoration: none;
  padding: .75rem 2rem;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  transition: background .3s, transform .2s;
}
.camps-bottom-btn:hover { background: #9B1D10; transform: translateY(-2px); }

@media (max-width: 1100px) {
  .camps-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .camps-hero { padding: 100px 24px 64px; }
  .camps-body { padding: 0 24px 80px; }
  .camps-grid { grid-template-columns: 1fr; }
  .camps-side-label { display: none; }
  .camps-stats-row { max-width: 100%; }
}
`;