"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// ── Types ─────────────────────────────────────────────────────────────────────
type Belt = "White" | "Yellow" | "Green" | "Blue" | "Brown" | "Black";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  belt: Belt;
  state: string;
  photo?: string;
  sensei: string;
  campsCount: number;
  eventsCount: number;
  isChampion: boolean;
  championYear?: number;
}

// ── Belt colour system ────────────────────────────────────────────────────────
const BELT_COLORS: Record<Belt, { bg: string; text: string; border: string; glow: string }> = {
  White: { bg: "#f5f5f5", text: "#111", border: "#ccc", glow: "rgba(255,255,255,0.25)" },
  Blue: { bg: "#1a3a6e", text: "#fff", border: "#2255aa", glow: "rgba(34,85,170,0.5)" },
  Yellow: { bg: "#f5c518", text: "#111", border: "#d4a800", glow: "rgba(245,197,24,0.45)" },
  Green: { bg: "#2d6a2d", text: "#fff", border: "#3a8c3a", glow: "rgba(58,140,58,0.4)" },
  Brown: { bg: "#5c3317", text: "#fff", border: "#7a4520", glow: "rgba(122,69,32,0.4)" },
  Black: { bg: "#111", text: "#fff", border: "#555", glow: "rgba(201,168,76,0.4)" },
};

const BELT_GRADIENTS: Record<Belt, string> = {
  White: "linear-gradient(180deg, #e8e8e8, #aaa, #e8e8e8)",
  Blue: "linear-gradient(180deg, #0f2548, #2255aa, #0f2548)",
  Yellow: "linear-gradient(180deg, #f5c518, #d4a800, #f5c518)",
  Green: "linear-gradient(180deg, #1e4a1e, #3a8c3a, #1e4a1e)",
  Brown: "linear-gradient(180deg, #3e2210, #7a4520, #3e2210)",
  Black: "linear-gradient(180deg, #111, #555, #c9a84c, #555, #111)",
};

const BELT_ORDER: Belt[] = ["White", "Yellow", "Green", "Blue", "Brown", "Black"];

// ── Sample data ───────────────────────────────────────────────────────────────
const SAMPLE_STUDENTS: Student[] = [
  { id: 1, firstName: "Arjun", lastName: "Sharma", age: 14, belt: "Black", state: "Maharashtra", sensei: "Dadi Bulsara", campsCount: 6, eventsCount: 12, isChampion: true, championYear: 2023 },
  { id: 2, firstName: "Priya", lastName: "Mehta", age: 16, belt: "Brown", state: "Gujarat", sensei: "Dadi Bulsara", campsCount: 4, eventsCount: 8, isChampion: false },
  { id: 3, firstName: "Rahul", lastName: "Verma", age: 12, belt: "Blue", state: "Delhi", sensei: "Raj Nair", campsCount: 3, eventsCount: 5, isChampion: false },
  { id: 4, firstName: "Sneha", lastName: "Patil", age: 17, belt: "Black", state: "Maharashtra", sensei: "Dadi Bulsara", campsCount: 8, eventsCount: 15, isChampion: true, championYear: 2024 },
  { id: 5, firstName: "Vikram", lastName: "Singh", age: 13, belt: "Green", state: "Punjab", sensei: "Raj Nair", campsCount: 2, eventsCount: 4, isChampion: false },
  { id: 6, firstName: "Ananya", lastName: "Iyer", age: 15, belt: "Brown", state: "Tamil Nadu", sensei: "Dadi Bulsara", campsCount: 5, eventsCount: 9, isChampion: false },
  { id: 7, firstName: "Dev", lastName: "Kapoor", age: 11, belt: "Green", state: "Delhi", sensei: "Raj Nair", campsCount: 1, eventsCount: 2, isChampion: false },
  { id: 8, firstName: "Meera", lastName: "Nair", age: 18, belt: "Black", state: "Kerala", sensei: "Dadi Bulsara", campsCount: 9, eventsCount: 18, isChampion: true, championYear: 2022 },
  { id: 9, firstName: "Karan", lastName: "Joshi", age: 14, belt: "Blue", state: "Rajasthan", sensei: "Raj Nair", campsCount: 3, eventsCount: 6, isChampion: false },
  { id: 10, firstName: "Ishaan", lastName: "Reddy", age: 16, belt: "Brown", state: "Andhra", sensei: "Dadi Bulsara", campsCount: 4, eventsCount: 7, isChampion: false },
  { id: 11, firstName: "Tara", lastName: "Bose", age: 13, belt: "Yellow", state: "West Bengal", sensei: "Raj Nair", campsCount: 1, eventsCount: 3, isChampion: false },
  { id: 12, firstName: "Aditya", lastName: "Kumar", age: 17, belt: "Black", state: "Karnataka", sensei: "Dadi Bulsara", campsCount: 7, eventsCount: 14, isChampion: true, championYear: 2024 },
];

const ALL_STATES = [...new Set(SAMPLE_STUDENTS.map(s => s.state))].sort();

// ── Global keyframes ──────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes ring-spin        { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
  @keyframes ring-spin-rev    { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
  @keyframes ring-pulse       { 0%,100% { opacity:.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.07); } }
  @keyframes ring-ripple      { 0% { opacity:.8; transform:scale(1); } 100% { opacity:0; transform:scale(1.45); } }
  @keyframes spark-orbit      { 0% { transform:rotate(0deg) translateX(40px); opacity:1; } 50% { opacity:.3; } 100% { transform:rotate(360deg) translateX(40px); opacity:1; } }
  @keyframes banner-shine     { 0% { top:-50px; opacity:0; } 25% { opacity:1; } 75% { opacity:1; } 100% { top:110%; opacity:0; } }
  @keyframes white-shimmer    { 0%,100% { opacity:.4; transform:scale(1); } 50% { opacity:.9; transform:scale(1.05); } }
  @keyframes green-breathe    { 0%,100% { opacity:.5; transform:scale(1); } 50% { opacity:.15; transform:scale(1.10); } }
  @keyframes brown-earthpulse { 0%,100% { opacity:.5; transform:scale(1); } 50% { opacity:.9; transform:scale(1.06); } }
  @keyframes yellow-dashes    { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  input::placeholder { color:#333; }
  select option { background:#0d0d0d; }
  @media (max-width: 1024px) {
    .cards-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 768px) {
    .hero-section, .filters-bar, .divider-bar, .cards-grid { padding-left: 20px !important; padding-right: 20px !important; }
    .hero-bg-text { display: none !important; }
  }
`;

// ── Avatar ring effects ───────────────────────────────────────────────────────
function AvatarRings({ belt }: { belt: Belt }) {
  const bc = BELT_COLORS[belt];

  if (belt === "Black") return (
    <>
      <div style={{
        position: "absolute", inset: "-9px", borderRadius: "50%",
        background: `conic-gradient(#c9a84c 0deg 40deg, transparent 40deg 90deg, #c9a84c 90deg 130deg, transparent 130deg 180deg, #c9a84c 180deg 220deg, transparent 220deg 270deg, #c9a84c 270deg 310deg, transparent 310deg 360deg)`,
        WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 2px))",
        animationName: "ring-spin", animationDuration: "5s", animationTimingFunction: "linear", animationIterationCount: "infinite",
      }} />
      <div style={{
        position: "absolute", inset: "-4px", borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.25)",
        animationName: "ring-spin-rev", animationDuration: "8s", animationTimingFunction: "linear", animationIterationCount: "infinite",
        boxShadow: "0 0 10px rgba(201,168,76,0.2), inset 0 0 8px rgba(201,168,76,0.1)",
      }} />
      {[
        { color: "#c9a84c", dur: "2.6s", delay: "0s" },
        { color: "#fff", dur: "3.2s", delay: "0.9s" },
        { color: "#c9a84c", dur: "3.8s", delay: "1.8s" },
      ].map((sp, i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: "4px", height: "4px", borderRadius: "50%", margin: "-2px 0 0 -2px",
          background: sp.color,
          animationName: "spark-orbit", animationDuration: sp.dur, animationDelay: sp.delay,
          animationTimingFunction: "linear", animationIterationCount: "infinite",
          boxShadow: `0 0 5px 2px ${sp.color}`,
        }} />
      ))}
    </>
  );

  if (belt === "Blue") return (
    <>
      <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: `2px solid ${bc.border}`, boxShadow: `0 0 14px ${bc.glow}`, animationName: "ring-pulse", animationDuration: "2s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }} />
      <div style={{ position: "absolute", inset: "-6px", borderRadius: "50%", border: `1px solid ${bc.border}`, opacity: 0, animationName: "ring-ripple", animationDuration: "1.6s", animationTimingFunction: "ease-out", animationIterationCount: "infinite" }} />
      <div style={{ position: "absolute", inset: "-6px", borderRadius: "50%", border: `1px solid ${bc.border}`, opacity: 0, animationName: "ring-ripple", animationDuration: "1.6s", animationDelay: "0.8s", animationTimingFunction: "ease-out", animationIterationCount: "infinite" }} />
    </>
  );

  if (belt === "Yellow") return (
    <>
      <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: `2px solid ${bc.border}`, boxShadow: `0 0 16px ${bc.glow}`, animationName: "ring-pulse", animationDuration: "1.8s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }} />
      <div style={{ position: "absolute", inset: "-9px", borderRadius: "50%", border: `1px dashed ${bc.border}`, opacity: 0.45, animationName: "yellow-dashes", animationDuration: "9s", animationTimingFunction: "linear", animationIterationCount: "infinite" }} />
    </>
  );

  if (belt === "Green") return (
    <>
      <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: `2px solid ${bc.border}`, boxShadow: `0 0 12px ${bc.glow}`, animationName: "green-breathe", animationDuration: "3.5s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }} />
      <div style={{ position: "absolute", inset: "-9px", borderRadius: "50%", border: `1px solid ${bc.border}`, opacity: 0.2, animationName: "ring-spin", animationDuration: "10s", animationTimingFunction: "linear", animationIterationCount: "infinite" }} />
    </>
  );

  if (belt === "Brown") return (
    <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: `2px solid ${bc.border}`, boxShadow: `0 0 12px ${bc.glow}`, animationName: "brown-earthpulse", animationDuration: "3s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }} />
  );

  // White
  return (
    <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.35)", boxShadow: "0 0 8px rgba(255,255,255,0.1)", animationName: "white-shimmer", animationDuration: "4s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }} />
  );
}

function BeltAvatar({ firstName, lastName, belt, photo }: { firstName: string; lastName: string; belt: Belt; photo?: string }) {
  const bc = BELT_COLORS[belt];
  return (
    <div style={{ position: "relative", width: "88px", height: "88px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AvatarRings belt={belt} />
      <div style={{
        width: "72px", height: "72px", borderRadius: "50%",
        background: bc.bg, border: `2px solid ${bc.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", position: "relative", zIndex: 2,
        boxShadow: `0 0 18px ${bc.glow}66`,
      }}>
        {photo
          ? <img src={photo} alt={firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "20px", fontWeight: 700, color: bc.text, letterSpacing: "1px" }}>{firstName[0]}{lastName[0]}</span>
        }
      </div>
    </div>
  );
}

function BeltBadge({ belt }: { belt: Belt }) {
  const bc = BELT_COLORS[belt];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px 3px 6px", background: bc.bg, color: bc.text, border: `1px solid ${bc.border}`, borderRadius: "2px", fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: bc.text, opacity: 0.6 }} />
      {belt}
    </span>
  );
}

// ── Left banner panel ─────────────────────────────────────────────────────────
function BannerPanel({ belt }: { belt: Belt }) {
  const bc = BELT_COLORS[belt];
  const isBlack = belt === "Black";
  const shineColor = isBlack ? "rgba(201,168,76,0.85)" : `${bc.border}cc`;
  return (
    <div style={{ width: "9px", flexShrink: 0, position: "relative", overflow: "hidden", borderRadius: "6px 0 0 6px" }}>
      <div style={{ position: "absolute", inset: 0, background: BELT_GRADIENTS[belt], boxShadow: `4px 0 14px ${bc.glow}55` }} />
      <div style={{
        position: "absolute", left: 0, width: "100%", height: "60px",
        background: `linear-gradient(to bottom, transparent, ${shineColor}, transparent)`,
        animationName: "banner-shine",
        animationDuration: isBlack ? "2.2s" : "3s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDelay: isBlack ? "0s" : "0.4s",
      }} />
    </div>
  );
}

// ── 4-sided legendary border edges ───────────────────────────────────────────
function LegendaryEdges({ belt, isChampion }: { belt: Belt; isChampion: boolean }) {
  const bc = BELT_COLORS[belt];
  const op = isChampion ? "bb" : "44";
  const op2 = isChampion ? "88" : "28";
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, ${bc.border}00, ${bc.border}${op}, ${bc.border}00)`, pointerEvents: "none", zIndex: 4 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, ${bc.border}00, ${bc.border}${op2}, ${bc.border}00)`, pointerEvents: "none", zIndex: 4 }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "1px", background: `linear-gradient(to bottom, ${bc.border}00, ${bc.border}${op}, ${bc.border}00)`, pointerEvents: "none", zIndex: 4 }} />
    </>
  );
}

// ── Student Card ──────────────────────────────────────────────────────────────
function StudentCard({ student }: { student: Student }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const bc = BELT_COLORS[student.belt];

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -4, backgroundColor: "#0f0f0f",
      boxShadow: student.isChampion
        ? `0 10px 32px rgba(0,0,0,0.7), 0 0 16px ${bc.glow}`
        : `0 8px 24px rgba(0,0,0,0.5), 0 0 8px ${bc.border}20`,
      duration: 0.28, ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0, backgroundColor: "#0a0a0a",
      boxShadow: student.isChampion
        ? `inset 0 0 14px ${bc.glow}15, 0 0 6px ${bc.glow}20`
        : "none",
      duration: 0.22, ease: "power2.inOut",
    });
  };

  return (
    <div
      ref={cardRef}
      className="student-card"
      style={{
        position: "relative", background: "#0a0a0a", borderRadius: "6px",
        display: "flex", overflow: "hidden", cursor: "default",
        opacity: 0, visibility: "hidden",
        border: student.isChampion ? "1px solid transparent" : "1px solid #1a1a1a",
        boxShadow: student.isChampion ? `inset 0 0 14px ${bc.glow}15, 0 0 6px ${bc.glow}20` : "none",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <LegendaryEdges belt={student.belt} isChampion={student.isChampion} />
      <BannerPanel belt={student.belt} />

      {/* Card body */}
      <div style={{ flex: 1, padding: "22px 22px 18px 18px", display: "flex", gap: "18px", alignItems: "flex-start", minWidth: 0 }}>
        <BeltAvatar firstName={student.firstName} lastName={student.lastName} belt={student.belt} photo={student.photo} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + champion badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "7px" }}>
            <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "16px", fontWeight: 600, color: "#e0e0e0", letterSpacing: "0.5px" }}>
              {student.firstName} {student.lastName}
            </span>
            {student.isChampion && (
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "2px 8px", borderRadius: "2px", color: "#c9a84c", border: "1px solid #c9a84c44", background: "#c9a84c10" }}>
                ★ {student.championYear}
              </span>
            )}
          </div>

          {/* Belt + meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
            <BeltBadge belt={student.belt} />
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#555" }}>Age {student.age}</span>
            <span style={{ color: "#2a2a2a" }}>·</span>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#555" }}>{student.state}</span>
          </div>

          {/* Stats + sensei */}
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
            <MiniStat label="Camps" value={student.campsCount} />
            <MiniStat label="Events" value={student.eventsCount} />
            <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "8px", color: "#444", letterSpacing: "1px", textTransform: "uppercase" }}>Sensei</span>
              <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "14px", color: "#777", fontStyle: "italic" }}>{student.sensei}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "18px", fontWeight: 700, color: "#bbb", lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#444", letterSpacing: "1.5px", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

// ── Header Stats ──────────────────────────────────────────────────────────────
function HeaderStat({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ flex: 1, padding: "16px 24px", borderRight: "1px solid #1a1a1a", background: "#080808" }}>
      <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "32px", fontWeight: 700, color: "#e8e8e8", lineHeight: 1, marginBottom: "5px" }}>{value}</div>
      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#444", letterSpacing: "2px", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentPage() {
  const [search, setSearch] = useState("");
  const [beltFilter, setBeltFilter] = useState<Belt | "All">("All");
  const [stateFilter, setStateFilter] = useState("All");

  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return SAMPLE_STUDENTS.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q) || s.sensei.toLowerCase().includes(q);
      const matchBelt = beltFilter === "All" || s.belt === beltFilter;
      const matchState = stateFilter === "All" || s.state === stateFilter;
      return matchSearch && matchBelt && matchState;
    });
  }, [search, beltFilter, stateFilter]);

  const champions = filtered.filter(s => s.isChampion).length;

  // Initial entrance animation
  useEffect(() => {
    gsap.to(".page-container", { opacity: 1, duration: 0.4 });
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(
      headerRef.current ? headerRef.current.children : [],
      { opacity: 0, y: 30, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.15 }
    );
    tl.fromTo(filterRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");
    tl.fromTo(
      ".student-card",
      { opacity: 0, y: 30, scale: 0.98, autoAlpha: 0 },
      { opacity: 1, y: 0, scale: 1, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: "power2.out", onComplete: () => ScrollTrigger.refresh() },
      "-=0.4"
    );
  }, []);

  // ScrollTrigger on filter change
  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    document.querySelectorAll(".student-card").forEach(card => {
      gsap.fromTo(card,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power1.out",
          scrollTrigger: {
            trigger: card, start: "top 100%", end: "top 88%",
            toggleActions: "play reverse none reverse", scrub: 0.5, invalidateOnRefresh: true,
          },
        }
      );
    });
  }, [filtered]);

  return (
    <div className="page-container" style={{ minHeight: "100vh", background: "#050505", paddingTop: "80px", opacity: 0 }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── HERO HEADER ── */}
      <div className="hero-section" style={{ position: "relative", overflow: "hidden", padding: "60px 56px 0" }}>
        <div className="hero-bg-text" style={{ position: "absolute", top: "-10px", right: "-20px", fontFamily: "var(--font-cinzel)", fontSize: "200px", fontWeight: 900, color: "rgba(255,255,255,0.02)", letterSpacing: "10px", textTransform: "uppercase", pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>
          KARATE
        </div>

        <div ref={headerRef}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "32px", height: "1px", background: "#555" }} />
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "5px", color: "#555", textTransform: "uppercase" }}>
              Dadi Bulsara Ashihara Karate · Dojo Records
            </span>
          </div>

          {/* Title + stats */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", flexWrap: "wrap", marginBottom: "40px" }}>
            <div>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(10px,1.2vw,14px)", fontWeight: 300, letterSpacing: "10px", color: "#3a3a3a", marginBottom: "8px", textTransform: "uppercase" }}>
                Hall of
              </div>
              <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(52px,7vw,96px)", fontWeight: 900, color: "#e8e8e8", letterSpacing: "8px", textTransform: "uppercase", margin: 0, lineHeight: 0.88 }}>
                Students
              </h1>
              <Link
                href="/students/registration"
                className="
    group relative inline-flex items-center justify-center
    overflow-hidden rounded-full
    border border-white/10
    bg-zinc-950/90
    px-12 py-5
    text-lg font-semibold uppercase
    tracking-[0.3em] text-white
    backdrop-blur-xl
    transition-all duration-500
    hover:-translate-y-1 hover:border-white/20
    hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
  "
              >
                {/* Gradient border glow */}
                <div
                  className="
      absolute inset-0 opacity-0
      bg-gradient-to-r
      from-emerald-500/20 via-white/5 to-emerald-500/20
      transition-opacity duration-500
      group-hover:opacity-100
    "
                />

                {/* Shine effect */}
                <div
                  className="absolute inset-y-0 -left-20 w-20 rotate-12 bg-white/10 blur-xl transition-all duration-700 group-hover:left-[120%]" />
                <span className="relative z-10 flex items-center gap-4">
                  JOIN THE DOJO
                  <span className="text-2xl transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </div>

            <div style={{ display: "flex", border: "1px solid #1a1a1a", borderRadius: "4px", overflow: "hidden", minWidth: "340px" }}>
              <HeaderStat value={SAMPLE_STUDENTS.length} label="Enrolled" />
              <HeaderStat value={SAMPLE_STUDENTS.filter(s => s.belt === "Black").length} label="Black Belts" />
              <div style={{ flex: 1, padding: "16px 24px", background: "#0d0d0d", borderLeft: "1px solid #1a1a1a" }}>
                <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "32px", fontWeight: 700, color: "#c9a84c", lineHeight: 1, marginBottom: "5px" }}>
                  {SAMPLE_STUDENTS.filter(s => s.isChampion).length}
                </div>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#444", letterSpacing: "2px", textTransform: "uppercase" }}>Champions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="divider-bar" style={{ padding: "0 56px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #1e1e1e 15%, #1e1e1e 85%, transparent)" }} />
      </div>

      {/* ── FILTERS ── */}
      <div ref={filterRef} className="filters-bar" style={{ padding: "20px 56px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", borderBottom: "1px solid #111" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: "15px", pointerEvents: "none" }}>⌕</span>
          <input
            type="text"
            placeholder="Search by name or sensei…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 12px 10px 34px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "3px", color: "#ccc", fontFamily: "var(--font-montserrat)", fontSize: "11px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <select value={beltFilter} onChange={e => setBeltFilter(e.target.value as Belt | "All")}
          style={{ padding: "10px 14px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "3px", color: "#888", fontFamily: "var(--font-montserrat)", fontSize: "11px", letterSpacing: "1px", cursor: "pointer", outline: "none" }}>
          <option value="All">All Belts</option>
          {BELT_ORDER.map(b => <option key={b} value={b}>{b} Belt</option>)}
        </select>

        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
          style={{ padding: "10px 14px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "3px", color: "#888", fontFamily: "var(--font-montserrat)", fontSize: "11px", letterSpacing: "1px", cursor: "pointer", outline: "none" }}>
          <option value="All">All States</option>
          {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#444", letterSpacing: "1px", whiteSpace: "nowrap", marginLeft: "auto" }}>
          {filtered.length} found · {champions} champion{champions !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── 2-COLUMN CARDS GRID — full width ── */}
      <div
        className="cards-grid"
        style={{
          padding: "28px 56px 100px",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1/-1", padding: "80px 0", textAlign: "center", fontFamily: "var(--font-cormorant)", fontSize: "20px", color: "#333", fontStyle: "italic" }}>
            No students match your search.
          </div>
        ) : (
          filtered.map(s => <StudentCard key={s.id} student={s} />)
        )}
      </div>
    </div>
  );
}