"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
// ScrollTrigger plugin ko import karein
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP core me ScrollTrigger ko register karna mandatory hai
gsap.registerPlugin(ScrollTrigger);

// ── Types ─────────────────────────────────────────────────────────────────────
type Belt =
  | "White" | "Yellow" | "Green"
  | "Blue" | "Brown" | "Black";

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
const BELT_COLORS: Record<Belt, { bg: string; text: string; border: string }> = {
  White: { bg: "#f5f5f5", text: "#111", border: "#ccc" },
  Blue: { bg: "#1a3a6e", text: "#fff", border: "#0f2548" },
  Yellow: { bg: "#f5c518", text: "#111", border: "#d4a800" },
  Green: { bg: "#2d6a2d", text: "#fff", border: "#1e4a1e" },
  Brown: { bg: "#5c3317", text: "#fff", border: "#3e2210" },
  Black: { bg: "#111", text: "#fff", border: "#333" },
};

const BELT_ORDER: Belt[] = ["White","Blue", "Yellow", "Green", "Brown", "Black"];

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

// ── Belt avatar animation config ─────────────────────────────────────────────
const BELT_AURA: Record<Belt, { ringColor: string; glowColor: string; animation: string }> = {
  White: { ringColor: "rgba(255,255,255,0.4)", glowColor: "rgba(255,255,255,0.1)", animation: "aura-shimmer" },
  Blue: { ringColor: "#2255aa", glowColor: "rgba(34,85,170,0.4)", animation: "aura-ripple" },
  Yellow: { ringColor: "#f5c518", glowColor: "rgba(245,197,24,0.3)", animation: "aura-pulse" },
  Green: { ringColor: "#3a8c3a", glowColor: "rgba(58,140,58,0.3)", animation: "aura-breathe" },
  Brown: { ringColor: "#7a4520", glowColor: "rgba(122,69,32,0.3)", animation: "aura-earthpulse" },
  Black: { ringColor: "#555", glowColor: "rgba(180,180,180,0.2)", animation: "aura-rotate" },
};

const BELT_PANEL: Record<Belt, { gradient: string; pattern: string; glow: string }> = {
  White: { gradient: "linear-gradient(to bottom, #e8e8e8, #aaa, #e8e8e8)", pattern: "solid", glow: "rgba(255,255,255,0.1)" },
  Blue: { gradient: "linear-gradient(to bottom, #0f2548, #2255aa, #0f2548)", pattern: "double", glow: "rgba(34,85,170,0.3)" },
  Yellow: { gradient: "linear-gradient(to bottom, #f5c518, #d4a800, #f5c518)", pattern: "dashes", glow: "rgba(245,197,24,0.25)" },
  Green: { gradient: "linear-gradient(to bottom, #1e4a1e, #3a8c3a, #1e4a1e)", pattern: "double", glow: "rgba(58,140,58,0.2)" },
  Brown: { gradient: "linear-gradient(to bottom, #3e2210, #7a4520, #3e2210)", pattern: "dots", glow: "rgba(122,69,32,0.25)" },
  Black: { gradient: "linear-gradient(to bottom, #111, #555, #c9a84c, #555, #111)", pattern: "zigzag", glow: "rgba(201,168,76,0.25)" },
};

function BeltPanel({ belt }: { belt: Belt; height: number }) {
  const panel = BELT_PANEL[belt];
  const W = 6;
  const patternSVG: Record<string, string> = {
    solid: "",
    dashes: `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='12'><rect x='0' y='0' width='${W}' height='7' fill='rgba(0,0,0,0.25)'/></svg>`,
    double: `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='1'><rect x='1' y='0' width='1' height='1' fill='rgba(255,255,255,0.2)'/><rect x='4' y='0' width='1' height='1' fill='rgba(255,255,255,0.2)'/></svg>`,
    dots: `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='8'><circle cx='3' cy='4' r='1.2' fill='rgba(255,255,255,0.2)'/></svg>`,
    zigzag: `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='8'><polyline points='0,4 3,0 6,4 3,8' fill='none' stroke='rgba(201,168,76,0.4)' stroke-width='0.8'/></svg>`,
  };
  const patternB64 = patternSVG[panel.pattern] ? `url("data:image/svg+xml,${encodeURIComponent(patternSVG[panel.pattern])}")` : "none";

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: `${W}px`, height: "100%", borderRadius: "4px 0 0 4px", background: panel.gradient, boxShadow: `2px 0 12px 0 ${panel.glow}`, overflow: "hidden" }}>
      {panel.pattern !== "solid" && <div style={{ position: "absolute", inset: 0, backgroundImage: patternB64, backgroundRepeat: "repeat-y", backgroundSize: `${W}px auto`, mixBlendMode: "overlay" }} />}
      {belt === "Black" && <div style={{ position: "absolute", left: 0, width: "100%", height: "30px", background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.8), transparent)", animationName: "panel-spark", animationDuration: "2.4s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite" }} />}
      {belt === "Yellow" && <div style={{ position: "absolute", left: 0, width: "100%", height: "20px", background: `linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)`, animationName: "panel-spark", animationDuration: "1.8s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: "0.3s" }} />}
    </div>
  );
}

function BeltAvatar({ firstName, lastName, belt, photo }: { firstName: string; lastName: string; belt: Belt; photo?: string }) {
  const bc = BELT_COLORS[belt];
  const aura = BELT_AURA[belt];
  const SIZE = 64;

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes aura-shimmer { 0%,100% { opacity:0.45; transform:translate(-50%,-50%) scale(1); } 50% { opacity:0.9; transform:translate(-50%,-50%) scale(1.05); } }
        @keyframes aura-pulse { 0%,100% { opacity:0.9; transform:translate(-50%,-50%) scale(1); } 50% { opacity:0.45; transform:translate(-50%,-50%) scale(1.07); } }
        @keyframes aura-ember { 0% { opacity:0.9; transform:translate(-50%,-50%) scale(1) rotate(0deg); } 40% { opacity:0.6; transform:translate(-50%,-50%) scale(1.05) rotate(4deg); } 70% { opacity:1; transform:translate(-50%,-50%) scale(0.97) rotate(-3deg); } 100% { opacity:0.9; transform:translate(-50%,-50%) scale(1) rotate(0deg); } }
        @keyframes aura-breathe { 0%,100% { opacity:0.6; transform:translate(-50%,-50%) scale(1); } 50% { opacity:0.2; transform:translate(-50%,-50%) scale(1.09); } }
        @keyframes aura-ripple { 0% { opacity:0.75; transform:translate(-50%,-50%) scale(1); } 100% { opacity:0; transform:translate(-50%,-50%) scale(1.30); } }
        @keyframes aura-earthpulse { 0%,100% { opacity:0.55; transform:translate(-50%,-50%) scale(1) filter:blur(0px); } 50% { opacity:0.9; transform:translate(-50%,-50%) scale(1.05) filter:blur(1px); } }
        @keyframes aura-rotate { 0% { transform:translate(-50%,-50%) rotate(0deg); } 100% { transform:translate(-50%,-50%) rotate(360deg); } }
        @keyframes aura-counter { 0% { transform:translate(-50%,-50%) rotate(0deg); opacity:0.35; } 50% { opacity:0.15; } 100% { transform:translate(-50%,-50%) rotate(-360deg); opacity:0.35; } }
        @keyframes sparks-orbit { 0% { transform:rotate(0deg) translateX(34px) scale(1); opacity:0.9; } 50% { transform:rotate(180deg) translateX(34px) scale(0.4); opacity:0.35; } 100% { transform:rotate(360deg) translateX(34px) scale(1); opacity:0.9; } }
        @keyframes panel-spark { 0% { top: -30px; } 100% { top: 110%; } }
      `}</style>

      <div style={{ position: "relative", width: `${SIZE + 16}px`, height: `${SIZE + 16}px`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", width: `${SIZE + 10}px`, height: `${SIZE + 10}px`, borderRadius: "50%",
          border: belt === "Black" ? "2px solid transparent" : `2px solid ${aura.ringColor}`,
          background: belt === "Black" ? `conic-gradient(${aura.ringColor} 0deg 55deg, transparent 55deg 110deg, ${aura.ringColor} 110deg 165deg, transparent 165deg 220deg, ${aura.ringColor} 220deg 275deg, transparent 275deg 330deg, ${aura.ringColor} 330deg 360deg)` : "transparent",
          WebkitMask: belt === "Black" ? `radial-gradient(farthest-side, transparent calc(100% - 3px), #fff calc(100% - 3px))` : "none",
          boxShadow: `0 0 8px 1px ${aura.glowColor}`, animationName: aura.animation,
          animationDuration: belt === "White" ? "3s" : belt === "Yellow" ? "2s" : belt === "Green" ? "4s" : belt === "Blue" ? "1.4s" : belt === "Brown" ? "3.5s" : "4s",
          animationTimingFunction: belt === "Blue" || belt === "Black" ? "linear" : "ease-in-out", animationIterationCount: "infinite",
        }} />

        {belt === "Blue" && <div style={{ position: "absolute", top: "50%", left: "50%", width: `${SIZE + 10}px`, height: `${SIZE + 10}px`, borderRadius: "50%", border: `1.5px solid ${aura.ringColor}`, opacity: 0, animationName: "aura-ripple", animationDuration: "1.4s", animationDelay: "0.7s", animationTimingFunction: "linear", animationIterationCount: "infinite" }} />}
        {belt === "Black" && <div style={{ position: "absolute", top: "50%", left: "50%", width: `${SIZE + 6}px`, height: `${SIZE + 6}px`, borderRadius: "50%", border: "1px solid rgba(201,168,76,0.25)", animationName: "aura-counter", animationDuration: "6s", animationTimingFunction: "linear", animationIterationCount: "infinite" }} />}
        {belt === "Black" && [0, 1, 2].map(i => (
          <div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: "3px", height: "3px", borderRadius: "50%", background: i === 0 ? "#c9a84c" : "#fff", animationName: "sparks-orbit", animationDuration: `${2.6 + i * 0.5}s`, animationDelay: `${i * 0.85}s`, animationTimingFunction: "linear", animationIterationCount: "infinite", transformOrigin: "0 0", marginLeft: "-1.5px", marginTop: "-1.5px" }} />
        ))}

        <div style={{ position: "absolute", top: "50%", left: "50%", width: `${SIZE + 4}px`, height: `${SIZE + 4}px`, borderRadius: "50%", boxShadow: `inset 0 0 6px 2px ${aura.glowColor}`, transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 2 }} />
        <div style={{ width: `${SIZE}px`, height: `${SIZE}px`, borderRadius: "50%", background: bc.bg, border: `2px solid ${bc.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", zIndex: 1, flexShrink: 0 }}>
          {photo
            ? <img src={photo} alt={firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "18px", fontWeight: 700, color: bc.text, letterSpacing: "1px" }}>{firstName[0]}{lastName[0]}</span>
          }
        </div>
      </div>
    </>
  );
}

function BeltBadge({ belt }: { belt: Belt }) {
  const bc = BELT_COLORS[belt];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "2px 10px 2px 6px", background: bc.bg, color: bc.text, border: `1px solid ${bc.border}`, borderRadius: "2px", fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: bc.text, opacity: 0.6 }} />
      {belt}
    </span>
  );
}

// ── Student Card ──────────────────────────────────────────────────────────────
function StudentCard({ student }: { student: Student }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowColor = BELT_COLORS[student.belt].border;

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      borderColor: "#3a3a3a", x: 6, backgroundColor: "#0f0f0f",
      boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 10px ${glowColor}20`, // Glow effect on hover
      duration: 0.3, ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      borderColor: "#1e1e1e", x: 0, backgroundColor: "#0a0a0a",
      boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.25, ease: "power2.inOut"
    });
  };

  return (
    <div
      ref={cardRef}
      className="student-card"
      style={{
        background: "#0a0a0a", border: `1px solid ${student.isChampion ? glowColor : "#1e1e1e"}`, borderRadius: "4px",
        padding: "18px 20px 18px 26px", display: "flex", gap: "16px", position: "relative",
        cursor: "default", overflow: "hidden", opacity: 0, visibility: "hidden", transform: "translateY(30px)",boxShadow: student.isChampion ? `inset 0 0 10px ${glowColor}40, 0 0 5px ${glowColor}20` : "none"
       // starting position niche rakha hai
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* --- LEGENDARY BORDER EFFECT --- */}
      <div style={{
        position: "absolute", inset: 0, padding: "1px", borderRadius: "4px",
        background: `linear-gradient(135deg, ${glowColor}, transparent 50%, ${glowColor})`,
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        pointerEvents: "none",
        opacity: student.isChampion ? 0.8 : 0.2 // Champion ho to border zyada glow karega
      }} />
      
      <BeltPanel belt={student.belt} height={0} />

      {student.isChampion && (
        <div style={{ position: "absolute", top: "10px", right: "14px", fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "#c9a84c", textTransform: "uppercase", border: `1px solid ${glowColor}`, pointerEvents: "none", borderRadius: "4px", boxShadow: `0 0 5px ${glowColor}30` }}>
          ★ Champion {student.championYear}
        </div>
      )}

      <BeltAvatar firstName={student.firstName} lastName={student.lastName} belt={student.belt} photo={student.photo} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
          <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "15px", fontWeight: 600, color: "#e8e8e8", letterSpacing: "0.5px" }}>
            {student.firstName} {student.lastName}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
          <BeltBadge belt={student.belt} />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#555" }}>Age {student.age}</span>
          <span style={{ color: "#2a2a2a" }}>·</span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#555" }}>{student.state}</span>
        </div>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Stat label="Camps" value={student.campsCount} />
          <Stat label="Events" value={student.eventsCount} />
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#444", letterSpacing: "0.5px" }}>SENSEI</span>
            <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "13px", color: "#888", fontStyle: "italic" }}>{student.sensei}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
      <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "16px", fontWeight: 700, color: "#ccc", lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#444", letterSpacing: "1.5px", textTransform: "uppercase" }}>{label}</span>
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
  const listRef = useRef<HTMLDivElement>(null);

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

  // 1. Initial Load Orchestration
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    gsap.to(".page-container", { opacity: 1, duration: 0.4 });

    tl.fromTo(headerRef.current ? headerRef.current.children : [],
      { opacity: 0, y: 30, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.15 }
    );

    tl.fromTo(filterRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");
    tl.fromTo(".student-card", 
      { 
        opacity: 0, 
        y: 30, 
        scale: 0.98,
        autoAlpha: 0 // Shuruat me visibility: hidden rakhega
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        autoAlpha: 1, // Animate hote hi visibility: visible kar dega
        duration: 0.7, 
        stagger: 0.12, 
        ease: "power2.out",
        onComplete: () => {
          ScrollTrigger.refresh();
        }
      },
      "-=0.4"
    );
  }, []);

  // 2. ScrollTrigger + Dynamic Filtering Setup
  useEffect(() => {
    // Purane chal rahe ScrollTriggers ko clear karein taki memory leak ya duplicate triggers na banein
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const cards = document.querySelectorAll(".student-card");

    if (cards.length > 0) {
      cards.forEach((card) => {
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 30,
            scale: 0.98
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power1.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",    // Niche se enter hote hi card dikhega (Jaise aapko chahiye tha)
              end: "top 88%",       // Jab card screen ke bilkul upar (top se 8% niche) pahuchega

              // Sabse important change:
              // 1st (play): niche se enter hote hi chalega
              // 2nd (reverse): upar se wapas niche aane par wapas animate hoga
              // 3rd (none): upar jaate waqt normal animation handle hoga
              // 4th (reverse): jab card upar se screen ke bahar nikal jaye toh wapas hide ho jaye
              toggleActions: "play reverse none reverse",

              // Upward scroll ko smooth fade-out karne ke liye scrub ko enable kiya
              scrub: 0.5,

              invalidateOnRefresh: true
            },
            // Note: clearProps ko humne hata diya hai taaki upar scroll ka animation state track ho sake
          }
        );
      });
    }
  }, [filtered]);

  return (
    <div className="page-container" style={{ minHeight: "100vh", background: "#050505", paddingTop: "80px", opacity: 0 }}>

      {/* Header */}
      <div ref={headerRef} style={{ borderBottom: "1px solid #111", padding: "48px 40px 32px", maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", letterSpacing: "4px", color: "#555", textTransform: "uppercase", marginBottom: "12px" }}>
          Dadi Bulsara Ashihara Karate
        </p>
        <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "#e8e8e8", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 8px" }}>
          Students
        </h1>
        <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
          <HeaderStat value={SAMPLE_STUDENTS.length} label="Enrolled" />
          <HeaderStat value={SAMPLE_STUDENTS.filter(s => s.belt === "Black").length} label="Black Belts" />
          <HeaderStat value={SAMPLE_STUDENTS.filter(s => s.isChampion).length} label="Champions" />
        </div>
      </div>

      {/* Filters */}
      <div ref={filterRef} style={{ padding: "24px 40px", maxWidth: "900px", margin: "0 auto", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1", minWidth: "220px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: "14px", pointerEvents: "none" }}>⌕</span>
          <input
            type="text"
            placeholder="Search by name or sensei…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px 10px 36px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "3px", color: "#ccc", fontFamily: "var(--font-montserrat)", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <select value={beltFilter} onChange={e => setBeltFilter(e.target.value as Belt | "All")} style={{ padding: "10px 14px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "3px", color: "#888", fontFamily: "var(--font-montserrat)", fontSize: "11px", letterSpacing: "1px", cursor: "pointer", outline: "none" }}>
          <option value="All">All Belts</option>
          {BELT_ORDER.map(b => <option key={b} value={b}>{b} Belt</option>)}
        </select>

        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={{ padding: "10px 14px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "3px", color: "#888", fontFamily: "var(--font-montserrat)", fontSize: "11px", letterSpacing: "1px", cursor: "pointer", outline: "none" }}>
          <option value="All">All States</option>
          {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#444", letterSpacing: "1px", whiteSpace: "nowrap" }}>
          {filtered.length} found · {champions} champion{champions !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Dynamic List Container */}
      <div ref={listRef} style={{ maxWidth: "900px", margin: "0 auto", padding: "0 40px 80px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {filtered.length === 0 ? (
          <div className="no-results" style={{ padding: "80px 0", textAlign: "center", fontFamily: "var(--font-cormorant)", fontSize: "20px", color: "#333", fontStyle: "italic" }}>
            No students match your search.
          </div>
        ) : (
          filtered.map(s => <StudentCard key={s.id} student={s} />)
        )}
      </div>

      <style jsx global>{`
        input::placeholder { color: #333; }
        select option { background: #0d0d0d; }
      `}</style>
    </div>
  );
}

function HeaderStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "28px", fontWeight: 700, color: "#e8e8e8", lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", letterSpacing: "2px", textTransform: "uppercase", marginTop: "3px" }}>{label}</div>
    </div>
  );
}