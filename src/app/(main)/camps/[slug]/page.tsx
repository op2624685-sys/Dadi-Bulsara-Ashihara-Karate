"use client";

import { use } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getCampBySlug } from "@/data/camps";
import { CampData, TrainingPillar } from "@/types/camp";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   ICONS MAP
═══════════════════════════════════════ */
const ICONS: Record<TrainingPillar["icon"], React.ReactNode> = {
  kata: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-[#C0392B] fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  kumite: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-[#C0392B] fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4z" />
      <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  conditioning: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-[#C0392B] fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  bunkai: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-[#C0392B] fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  grading: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-[#C0392B] fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  philosophy: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-[#C0392B] fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
};

/* ═══════════════════════════════════════
   SECTION LABEL
═══════════════════════════════════════ */
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-[14px] mb-6">
      <div className="w-8 h-px bg-[#C0392B] shrink-0" />
      <span className="text-[9px] tracking-[0.32em] uppercase text-[#C0392B] font-medium">{text}</span>
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION HEADING
═══════════════════════════════════════ */
function SectionHeading({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <h2
      className="leading-[1.08] tracking-[-0.01em] text-[#EEE8DF]"
      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px,4.5vw,68px)", fontWeight: 300 }}
    >
      {line1}<br />
      <em style={{ fontStyle: "italic", fontWeight: 600 }}>{line2}</em>
    </h2>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function CampDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const camp = getCampBySlug(slug);
  if (!camp) notFound();

  /* refs */
  const heroBgRef     = useRef<HTMLDivElement>(null);
  const heroEyeRef    = useRef<HTMLDivElement>(null);
  const heroKanaRef   = useRef<HTMLDivElement>(null);
  const heroT1Ref     = useRef<HTMLSpanElement>(null);
  const heroT2Ref     = useRef<HTMLSpanElement>(null);
  const heroDescRef   = useRef<HTMLParagraphElement>(null);
  const heroMetaRef   = useRef<HTMLDivElement>(null);
  const trainSecRef   = useRef<HTMLDivElement>(null);
  const trainTrackRef = useRef<HTMLDivElement>(null);
  const trainLeftRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── Hero entrance ── */
    const heroEls = [
      heroEyeRef.current, heroKanaRef.current,
      heroT1Ref.current,  heroT2Ref.current,
      heroDescRef.current, heroMetaRef.current,
    ];
    gsap.set(heroEls, { y: 50, opacity: 0 });
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
    heroTl
      .to(heroEyeRef.current,  { y: 0, opacity: 1, duration: 0.9 }, 0.2)
      .to(heroKanaRef.current, { y: 0, opacity: 1, duration: 0.9 }, 0.35)
      .to(heroT1Ref.current,   { y: 0, opacity: 1, duration: 1.0 }, 0.5)
      .to(heroT2Ref.current,   { y: 0, opacity: 1, duration: 1.0 }, 0.65)
      .to(heroDescRef.current, { y: 0, opacity: 1, duration: 0.8 }, 0.85)
      .to(heroMetaRef.current, { y: 0, opacity: 1, duration: 0.8 }, 0.95);

    /* ── Hero parallax ── */
    const onScroll = () => {
      if (!heroBgRef.current) return;
      const y = window.pageYOffset;
      if (y < window.innerHeight)
        heroBgRef.current.style.transform = `translateY(${y * 0.28}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── Generic scroll reveals ── */
    gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 50, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        delay: (i % 4) * 0.08,
      });
    });

    /* ── Stats count-up ── */
    document.querySelectorAll<HTMLElement>(".count-up").forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () => {
          const target = Number(el.dataset.to);
          gsap.to({ v: 0 }, {
            v: target, duration: 1.6, ease: "power2.out",
            onUpdate: function () {
              el.textContent = String(Math.round(this.targets()[0].v));
            },
          });
        },
      });
    });

    /* ── Instructor cards stagger ── */
    gsap.from(".inst-card", {
      opacity: 0, y: 60, stagger: 0.13, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".inst-grid", start: "top 82%", once: true },
    });

    /* ── Gallery stagger ── */
    gsap.from(".gal-item", {
      opacity: 0, scale: 0.96, stagger: 0.09, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".gal-grid", start: "top 84%", once: true },
    });

    /* ── Timeline rows ── */
    gsap.from(".tl-row", {
      opacity: 0, x: -50, stagger: 0.15, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".tl-list", start: "top 82%", once: true },
    });

    /* ── Horizontal scroll: trigger when section reaches CENTER of viewport ── */
    if (window.innerWidth >= 769 && trainSecRef.current && trainTrackRef.current && trainLeftRef.current) {
      const section   = trainSecRef.current;
      const track     = trainTrackRef.current;
      const leftPanel = trainLeftRef.current;

      // Refresh once layout is stable
      ScrollTrigger.refresh();

      const getAmt = () =>
        track.scrollWidth - (window.innerWidth - leftPanel.offsetWidth);

      const scrubAnim = gsap.to(track, {
        x: () => -getAmt(),
        ease: "none",
        paused: true,
      });

      ScrollTrigger.create({
        trigger: section,
        // Pin starts when TOP of section hits TOP of viewport
        start: "top top",
        // End after scrolling exactly the track width
        end: () => "+=" + getAmt(),
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
        animation: scrubAnim,
        onRefresh: () => scrubAnim.invalidate(),
      });

      /* Pillar cards fade in as they scroll into view */
      document.querySelectorAll<HTMLElement>(".pillar-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrubAnim,
              start: "left 90%",
              once: true,
            },
          }
        );
      });

      window.addEventListener("resize", () => {
        scrubAnim.invalidate();
        ScrollTrigger.refresh();
      });
    } else {
      /* Mobile fallback — vertical stack */
      gsap.from(".pillar-card", {
        opacity: 0, y: 60, stagger: 0.12, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: trainSecRef.current, start: "top 82%", once: true },
      });
    }

    ScrollTrigger.refresh();
    return () => {
      window.removeEventListener("scroll", onScroll);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <main className="bg-[#060606] text-[#EEE8DF] overflow-x-hidden">

      {/* ═══════════ NAV — "All Camps" button hataya ═══════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-[500] px-16 py-7 flex items-center justify-end max-lg:px-6"
        style={{ background: "linear-gradient(to bottom,rgba(6,6,6,.92) 0%,transparent 100%)" }}
      >
        <span className="text-[10px] tracking-[0.22em] uppercase text-[#C0392B]">
          Annual Winter Camp
        </span>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative h-screen min-h-[720px] flex items-end overflow-hidden">
        {/* BG */}
        <div
          ref={heroBgRef}
          className="absolute inset-[-10%] bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url('${camp.heroImage}')` }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#060606]/97 via-[#060606]/78 to-[#060606]/30" />
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Year watermark */}
        <div
          className="absolute right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none leading-none text-white/[0.025] max-lg:hidden"
          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(140px,18vw,260px)", letterSpacing: "0.05em" }}
        >
          {camp.year}
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-16 pb-24 max-lg:px-6">
          {/* Eyebrow */}
          <div ref={heroEyeRef} className="flex items-center gap-4 mb-5">
            <div className="w-10 h-px bg-[#C0392B] shrink-0" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#C0392B] font-medium">
              Annual Camp · {camp.location}
            </span>
          </div>
          {/* Kana */}
          <div
            ref={heroKanaRef}
            className="mb-2 font-light tracking-[0.5em] uppercase text-white/25"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(12px,1.2vw,17px)" }}
          >
            {camp.kana}
          </div>
          {/* Title */}
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(80px,13vw,200px)", lineHeight: 0.88, letterSpacing: "0.02em" }}>
            <span ref={heroT1Ref} className="block text-[#EEE8DF]">{camp.name}</span>
            <span ref={heroT2Ref} className="block text-[#C0392B]">{camp.subtitle}</span>
          </h1>
          {/* Bottom row */}
          <div className="flex items-end justify-between mt-7 flex-wrap gap-6">
            <p ref={heroDescRef} className="max-w-[440px] text-sm leading-[1.8] text-[#EEE8DF]/55 font-light">
              Five days of intensive residential training — Kata, Kumite, and the philosophy of Budo — in the highlands of {camp.state}.
            </p>
            <div ref={heroMetaRef} className="flex flex-col gap-[10px] items-end max-lg:items-start">
              {[`${camp.location}, ${camp.state}`, `${camp.duration} · Kata & Kumite`, `${camp.participants} Practitioners`].map((t) => (
                <div key={t} className="text-[11px] tracking-[0.14em] uppercase text-[#EEE8DF]/45">{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-16 z-10 flex items-center gap-[14px] max-lg:left-6">
          <div className="relative w-14 h-px bg-white/10 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full w-[30%] bg-[#C0392B]"
              style={{ animation: "scrollSlide 2s ease-in-out infinite" }}
            />
          </div>
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#EEE8DF]/30">Scroll to explore</span>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <div className="grid grid-cols-4 bg-[#0A0A0A] border-t border-b border-white/[0.06] max-sm:grid-cols-2">
        {[
          { label: "Participants",   val: camp.participants,    unit: "Athletes",    anim: true  },
          { label: "Duration",       val: 5,                    unit: "Days",        anim: false },
          { label: "Total Sessions", val: camp.sessions,        unit: "On the mat",  anim: true  },
          { label: "Sensei",         val: camp.instructorCount, unit: "Instructors", anim: true  },
        ].map((s) => (
          <div
            key={s.label}
            className="gsap-reveal group relative px-12 py-14 border-r border-white/[0.06] last:border-r-0 max-sm:border-r-0 max-sm:border-b overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#C0392B] to-transparent group-hover:w-full transition-all duration-700" />
            <div className="text-[9px] tracking-[0.3em] uppercase text-[#5A5A5A] mb-4">{s.label}</div>
            <div
              className="leading-none text-[#EEE8DF] mb-[6px]"
              style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "72px", letterSpacing: "0.02em" }}
            >
              {s.anim ? <span className="count-up" data-to={s.val}>0</span> : s.val}
            </div>
            <div className="text-[12px] tracking-[0.1em] uppercase text-[#5A5A5A]">{s.unit}</div>
          </div>
        ))}
      </div>

      {/* ═══════════ ABOUT ═══════════ */}
      <section className="px-16 py-36 max-lg:px-6 max-lg:py-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 gap-28 items-center max-lg:grid-cols-1 max-lg:gap-16">
          {/* Left */}
          <div>
            <div className="gsap-reveal"><SectionLabel text="About This Camp" /></div>
            <div className="gsap-reveal"><SectionHeading line1="Kata & Kumite" line2={`Intensive — ${camp.duration}`} /></div>
            <p className="gsap-reveal text-[15px] leading-[1.9] text-[#EEE8DF]/60 font-light mt-7">{camp.description}</p>
            {/* Quote */}
            <div className="gsap-reveal mt-12 p-8 border border-white/[0.06] border-l-[3px] border-l-[#C0392B] bg-[#C0392B]/[0.04] relative">
              <span
                className="absolute top-[-8px] left-6 leading-none text-[#C0392B]/15 pointer-events-none select-none"
                style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "80px" }}
              >
                &ldquo;
              </span>
              <p
                className="relative z-10 leading-[1.55] text-[#EEE8DF]"
                style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "21px", fontStyle: "italic" }}
              >
                {camp.quote}
              </p>
              <cite className="block mt-4 text-[10px] tracking-[0.18em] uppercase text-[#5A5A5A] not-italic">
                — {camp.quoteAuthor}
              </cite>
            </div>
          </div>
          {/* Right — image collage */}
          <div className="gsap-reveal relative h-[600px] max-lg:h-[400px]">
            <div className="absolute top-0 left-0 w-[76%] h-[80%] overflow-hidden">
              <Image src={camp.aboutImages[0]} alt="Camp" fill className="object-cover brightness-[0.82] grayscale-[15%]" />
            </div>
            <div className="absolute bottom-0 right-0 w-[53%] h-[47%] overflow-hidden" style={{ outline: "6px solid #060606" }}>
              <Image src={camp.aboutImages[1]} alt="Kata" fill className="object-cover brightness-[0.82] grayscale-[15%]" />
            </div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-7 w-14 h-14 bg-[#C0392B] z-10" />
            <div className="absolute bottom-12 left-[-20px] w-[90px] h-[90px] bg-[#0A0A0A] border border-white/[0.06] flex flex-col items-center justify-center gap-[2px] z-10">
              <span className="text-[#C0392B] leading-none" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "32px" }}>{camp.year}</span>
              <span className="text-[8px] tracking-[0.2em] uppercase text-[#5A5A5A]">Bulsara</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TRAINING — HORIZONTAL SCROLL ═══════════
          Pin starts when section top hits viewport top.
          Left panel stays fixed; cards track scrolls horizontally.
      ═══════════════════════════════════════════════════════ */}
      <div ref={trainSecRef} className="bg-[#0A0A0A] overflow-hidden">
        <div className="flex items-stretch min-h-screen">

          {/* ── Fixed left panel ── */}
          <div
            ref={trainLeftRef}
            className="flex-shrink-0 w-[460px] px-16 py-32 bg-[#0A0A0A] flex flex-col justify-center border-r border-white/[0.06] relative z-10 max-lg:hidden"
          >
            <div className="absolute right-[-1px] top-[28%] bottom-[28%] w-px bg-gradient-to-b from-transparent via-[#C0392B] to-transparent" />
            <SectionLabel text="Training Strategy" />
            <SectionHeading line1="How We" line2="Train Together" />
            <p className="text-[14px] leading-[1.9] text-[#EEE8DF]/40 font-light mt-6 max-w-[300px]">
              Six structured pillars, each isolating a dimension of karate mastery.
            </p>
            <div className="flex items-center gap-[10px] mt-10">
              <div className="w-6 h-px bg-[#C0392B]" />
              <span className="text-[9px] tracking-[0.28em] uppercase text-[#5A5A5A]">Drag or scroll →</span>
            </div>
          </div>

          {/* ── Scrolling cards track ── */}
          <div
            ref={trainTrackRef}
            className="flex items-center gap-6 py-24 px-10 will-change-transform max-lg:flex-wrap max-lg:px-6 max-lg:pb-16 max-lg:pt-16"
          >
            {/* Mobile heading — only shows on small screens */}
            <div className="hidden max-lg:block w-full mb-8">
              <SectionLabel text="Training Strategy" />
              <SectionHeading line1="How We" line2="Train Together" />
            </div>

            {camp.pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="pillar-card group flex-shrink-0 bg-[#111] border border-white/[0.06] relative overflow-hidden flex flex-col transition-colors duration-500 hover:bg-[#141414] hover:border-[#C0392B]/40 max-lg:w-full"
                style={{
                  width: "460px",
                  height: "600px",
                }}
              >
                {/* Hover corner triangle */}
                <div className="absolute top-0 left-0 w-0 h-0 border-[0px] border-solid border-transparent group-hover:border-t-[90px] group-hover:border-r-[90px] group-hover:border-t-[#C0392B] transition-all duration-500" />
                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#C0392B] group-hover:w-full transition-all duration-[600ms]" />

                <div className="relative z-10 p-14 flex flex-col h-full">
                  <span className="text-[9px] tracking-[0.28em] uppercase text-[#C0392B] font-medium mb-8">
                    {pillar.method}
                  </span>
                  {/* Icon */}
                  <div className="w-[64px] h-[64px] rounded-full border border-[#C0392B]/30 bg-[#C0392B]/[0.08] flex items-center justify-center mb-8 transition-colors duration-500 group-hover:bg-[#C0392B]/20 group-hover:border-[#C0392B]/60">
                    {ICONS[pillar.icon]}
                  </div>
                  {/* Title */}
                  <h3
                    className="leading-[1.15] text-[#EEE8DF] mb-6"
                    style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "42px", fontWeight: 600 }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-[15px] leading-[1.9] text-[#EEE8DF]/50 font-light flex-1">
                    {pillar.description}
                  </p>
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
                    <span className="text-[11px] tracking-[0.18em] uppercase text-[#5A5A5A]">{pillar.hoursPerDay}</span>
                    <div className="w-10 h-10 border border-white/[0.06] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#C0392B] group-hover:border-[#C0392B]">
                      <svg className="w-[16px] h-[16px] fill-none stroke-[#EEE8DF]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Big number watermark */}
                <div
                  className="absolute right-8 bottom-6 leading-none select-none pointer-events-none text-white/[0.04] group-hover:text-[#C0392B]/[0.08] transition-colors duration-500"
                  style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "120px", letterSpacing: "0.02em" }}
                >
                  {pillar.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ INSTRUCTORS ═══════════ */}
      <section className="px-16 py-36 max-lg:px-6 max-lg:py-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-10">
            <div>
              <div className="gsap-reveal"><SectionLabel text="Camp Instructors" /></div>
              <div className="gsap-reveal"><SectionHeading line1="The Sensei" line2="Who Led" /></div>
            </div>
            <p className="gsap-reveal max-w-[360px] text-[14px] leading-[1.8] text-[#EEE8DF]/40 font-light">
              Each instructor brought a distinct lineage — representing Japan, Pune, Delhi, and Mumbai within our federation.
            </p>
          </div>

          {/* Grid: proper aspect ratio, images show correctly */}
          <div className="inst-grid grid grid-cols-4 gap-[3px] max-lg:grid-cols-2">
            {camp.instructors.map((inst) => (
              <div
                key={inst.id}
                className="inst-card group relative overflow-hidden bg-[#111] cursor-pointer"
              >
                {/* Top red bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C0392B] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 z-10" />
                {/* Aspect ratio box — taller for portrait photos */}
                <div className="relative overflow-hidden" style={{ paddingTop: "145%" }}>
                  <Image
                    src={inst.image}
                    alt={inst.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover object-top grayscale-[55%] brightness-75 transition-all duration-[900ms] group-hover:scale-[1.06] group-hover:grayscale-[10%] group-hover:brightness-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/95 via-[#060606]/25 to-transparent" />
                </div>
                {/* Info — always visible, slightly lifted on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-7 z-10 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                  <div className="inline-block bg-[#C0392B] text-[9px] font-semibold tracking-[0.22em] uppercase px-3 py-[5px] mb-[10px]">
                    {inst.grade}{inst.role ? ` · ${inst.role}` : ""}
                  </div>
                  <div
                    className="leading-[1.2] text-[#EEE8DF]"
                    style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "26px", fontWeight: 600 }}
                  >
                    {inst.name}
                  </div>
                  <div className="mt-[6px] text-[11px] tracking-[0.1em] uppercase text-[#EEE8DF]/50">
                    {inst.origin}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ GALLERY ═══════════ */}
      <section className="bg-[#0A0A0A] pb-0">
        <div className="px-16 pt-24 pb-14 max-w-[1400px] mx-auto max-lg:px-6">
          <div className="gsap-reveal"><SectionLabel text="Camp Gallery" /></div>
          <div className="gsap-reveal"><SectionHeading line1="Moments" line2="From the Mat" /></div>
        </div>
        <div
          className="gal-grid gap-[3px] max-lg:grid-cols-2"
          style={{ display: "grid", gridTemplateColumns: "3fr 2fr 2fr", gridTemplateRows: "340px 340px" }}
        >
          {camp.galleryImages.map((img, i) => (
            <div
              key={i}
              className="gal-item group relative overflow-hidden cursor-pointer"
              style={i === 0 ? { gridRow: "1 / 3" } : {}}
            >
              <Image
                src={img}
                alt={`Camp ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover grayscale-[30%] brightness-80 transition-all duration-[800ms] group-hover:scale-[1.06] group-hover:grayscale-0 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />
              {i === camp.galleryImages.length - 1 && (
                <div className="absolute bottom-4 right-4 z-20 bg-[#060606]/85 border border-white/[0.12] text-[10px] tracking-[0.16em] uppercase px-[14px] py-[7px] text-[#5A5A5A]">
                  +28 photos
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ SCHEDULE ═══════════ */}
      <section className="px-16 py-36 max-lg:px-6 max-lg:py-24">
        <div className="max-w-[1300px] mx-auto">
          <div className="gsap-reveal"><SectionLabel text="Camp Schedule" /></div>
          <div className="gsap-reveal"><SectionHeading line1={`${camp.duration},`} line2="Day by Day" /></div>

          <div className="tl-list mt-20">
            {camp.schedule.map((day) => (
              <div
                key={day.dayNum}
                className="tl-row grid border-b border-white/[0.06] first:border-t first:border-white/[0.06] relative"
                style={{ gridTemplateColumns: "200px 1fr" }}
              >
                {/* Vertical accent line + dot */}
                <div className="absolute left-[200px] top-0 bottom-0 w-px bg-white/[0.06] max-lg:hidden">
                  <div className="absolute top-[52px] left-[-5px] w-[11px] h-[11px] rounded-full bg-[#060606] border-2 border-[#C0392B]" />
                </div>

                {/* Day number label */}
                <div className="py-14 pr-12 flex flex-col justify-center max-lg:hidden">
                  <span
                    className="block leading-none text-white/[0.07]"
                    style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "52px" }}
                  >
                    {day.dayNum}
                  </span>
                  <span className="block mt-2 text-[9px] tracking-[0.28em] uppercase text-[#5A5A5A]">
                    {day.dayLabel}
                  </span>
                </div>

                {/* Content */}
                <div className="py-14 pl-16 max-lg:pl-0 max-lg:py-9">
                  <div className="hidden max-lg:block mb-4 text-[9px] tracking-[0.28em] uppercase text-[#5A5A5A]">
                    Day {day.dayNum} · {day.dayLabel}
                  </div>
                  <h3
                    className="leading-[1.15] text-[#EEE8DF] mb-4"
                    style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", fontWeight: 600 }}
                  >
                    {day.title}
                  </h3>
                  <p className="text-[14px] leading-[1.85] text-[#EEE8DF]/50 font-light max-w-[660px]">
                    {day.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {day.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-[14px] py-[6px] border border-white/[0.09] text-[9px] tracking-[0.18em] uppercase text-[#5A5A5A]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-48 relative overflow-hidden max-lg:py-28">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 55% 60% at 50% 50%,rgba(192,57,43,.13),transparent)" }}
        />
        {/* Watermark */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-white/[0.02] leading-none whitespace-nowrap gsap-reveal"
          style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(80px,14vw,200px)", letterSpacing: "0.05em" }}
        >
          BULSARA
        </div>

        {/* Content — centered with explicit text-center and mx-auto */}
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="gsap-reveal text-[9px] tracking-[0.35em] uppercase text-[#C0392B] mb-5">
            Next Annual Camp
          </div>
          <h2
            className="gsap-reveal leading-[0.95] tracking-[-0.02em] max-w-[800px] mb-6"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(52px,7vw,100px)", fontWeight: 300 }}
          >
            Join the<br />
            <em style={{ fontStyle: "italic", fontWeight: 600 }}>Next Camp</em>
          </h2>
          <p className="gsap-reveal text-[12px] tracking-[0.2em] uppercase text-[#5A5A5A] mb-16">
            Registrations open · 2025 Announced
          </p>

          {/* Buttons — bigger, more padding */}
          <div className="gsap-reveal flex gap-6 justify-center flex-wrap">
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-4 bg-[#C0392B] text-white text-[12px] font-semibold tracking-[0.22em] uppercase overflow-hidden transition-colors duration-300 hover:bg-[#9B1D10] no-underline"
              style={{ padding: "22px 52px" }}
            >
              Register Now
              <svg
                className="w-[16px] h-[16px] transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/camps"
              className="group inline-flex items-center gap-4 bg-transparent text-[#EEE8DF] text-[12px] font-semibold tracking-[0.22em] uppercase border border-white/[0.18] transition-colors duration-300 hover:border-white/40 no-underline"
              style={{ padding: "22px 52px" }}
            >
              View All Camps
              <svg
                className="w-[16px] h-[16px] transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="px-16 py-8 border-t border-white/[0.06] flex items-center justify-between max-lg:px-6 max-sm:flex-col max-sm:gap-3 max-sm:text-center">
        <div
          className="text-[#EEE8DF]"
          style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", fontWeight: 600, letterSpacing: "0.08em" }}
        >
          Dadi Bulsara <span className="text-[#C0392B]">Federation</span>
        </div>
        <div className="text-[10px] tracking-[0.18em] uppercase text-[#5A5A5A]">
          Annual Training Camps · Est. 2009
        </div>
      </footer>

      {/* Scroll animation keyframe */}
      <style>{`
        @keyframes scrollSlide {
          0%   { left: -30%; width: 30%; }
          50%  { left: 35%;  width: 40%; }
          100% { left: 100%; width: 30%; }
        }
      `}</style>
    </main>
  );
}