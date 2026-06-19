"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swords, Sparkles, LogOut, User, ChevronDown, X } from "lucide-react";
import { useCosmetics } from "@/context/CosmeticsContext";
import { AVATARS, BANNERS } from "@/app/(main)/profile/avatar/cosmetics";

// ── Same visual system as StudentProfilePage ──────────────────────────────────
const BELT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  white:  { bg: "#f5f5f5", text: "#111", border: "#ccc" },
  yellow: { bg: "#f5c518", text: "#111", border: "#d4a800" },
  orange: { bg: "#f97316", text: "#fff", border: "#c2410c" },
  green:  { bg: "#2d6a2d", text: "#fff", border: "#1e4a1e" },
  blue:   { bg: "#1a3a6e", text: "#fff", border: "#0f2548" },
  purple: { bg: "#4c1d95", text: "#fff", border: "#2e1065" },
  brown:  { bg: "#5c3317", text: "#fff", border: "#3e2210" },
  black:  { bg: "#111",    text: "#fff", border: "#333" },
};

const BELT_AURA: Record<string, { ringColor: string; glowColor: string; animClass: string }> = {
  white:  { ringColor: "#ddd",    glowColor: "rgba(255,255,255,0.30)", animClass: "aura-shimmer" },
  yellow: { ringColor: "#ffe600", glowColor: "rgba(255,230,0,0.60)",   animClass: "aura-pulse" },
  orange: { ringColor: "#f97316", glowColor: "rgba(249,115,22,0.60)",  animClass: "aura-ember" },
  green:  { ringColor: "#4ade80", glowColor: "rgba(74,222,128,0.55)",  animClass: "aura-breathe" },
  blue:   { ringColor: "#4a9eff", glowColor: "rgba(74,158,255,0.55)",  animClass: "aura-ripple" },
  purple: { ringColor: "#a855f7", glowColor: "rgba(168,85,247,0.55)",  animClass: "aura-pulse" },
  brown:  { ringColor: "#f59e0b", glowColor: "rgba(245,158,11,0.60)",  animClass: "aura-earthpulse" },
  black:  { ringColor: "#f5d576", glowColor: "rgba(245,213,118,0.85)", animClass: "aura-rotate" },
};

const BELT_PANEL: Record<string, { gradient: string; pattern: string; glow: string }> = {
  white:  { gradient: "linear-gradient(to bottom,#e8e8e8,#aaa,#e8e8e8)", pattern: "solid",  glow: "rgba(255,255,255,0.2)" },
  yellow: { gradient: "linear-gradient(to bottom,#f5c518,#d4a800,#f5c518)", pattern: "dashes", glow: "rgba(245,197,24,0.4)" },
  orange: { gradient: "linear-gradient(to bottom,#f97316,#c2410c,#f97316)", pattern: "dots",   glow: "rgba(249,115,22,0.45)" },
  green:  { gradient: "linear-gradient(to bottom,#1e4a1e,#3a8c3a,#1e4a1e)", pattern: "double", glow: "rgba(58,140,58,0.35)" },
  blue:   { gradient: "linear-gradient(to bottom,#0f2548,#2255aa,#0f2548)", pattern: "double", glow: "rgba(34,85,170,0.4)" },
  purple: { gradient: "linear-gradient(to bottom,#2e1065,#7c3aed,#2e1065)", pattern: "dots",   glow: "rgba(124,58,237,0.4)" },
  brown:  { gradient: "linear-gradient(to bottom,#3e2210,#7a4520,#3e2210)", pattern: "dots",   glow: "rgba(122,69,32,0.4)" },
  black:  { gradient: "linear-gradient(to bottom,#111,#444,#c9a84c,#444,#111)", pattern: "zigzag", glow: "rgba(201,168,76,0.5)" },
};

const BELT_META: Record<string, { color: string; label: string; glow: string; rank: number }> = {
  white:  { color: "#E5E7EB", label: "White Belt",  glow: "rgba(229,231,235,0.2)", rank: 1 },
  yellow: { color: "#FBBF24", label: "Yellow Belt", glow: "rgba(251,191,36,0.35)", rank: 2 },
  orange: { color: "#F97316", label: "Orange Belt", glow: "rgba(249,115,22,0.35)", rank: 3 },
  green:  { color: "#22C55E", label: "Green Belt",  glow: "rgba(34,197,94,0.35)",  rank: 4 },
  blue:   { color: "#3B82F6", label: "Blue Belt",   glow: "rgba(59,130,246,0.35)", rank: 5 },
  purple: { color: "#A855F7", label: "Purple Belt", glow: "rgba(168,85,247,0.35)", rank: 6 },
  brown:  { color: "#D97706", label: "Brown Belt",  glow: "rgba(217,119,6,0.35)",  rank: 7 },
  black:  { color: "#F5D576", label: "Black Belt",  glow: "rgba(245,213,118,0.5)", rank: 8 },
};

// ── Keyframes (same animations as profile page) ───────────────────────────────
const CARD_KEYFRAMES = `
  @keyframes npc-aura-shimmer    { 0%,100%{opacity:.45;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.9;transform:translate(-50%,-50%) scale(1.05)} }
  @keyframes npc-aura-pulse      { 0%,100%{opacity:.9;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.45;transform:translate(-50%,-50%) scale(1.07)} }
  @keyframes npc-aura-ember      { 0%{opacity:.9;transform:translate(-50%,-50%) scale(1) rotate(0deg)} 40%{opacity:.6;transform:translate(-50%,-50%) scale(1.05) rotate(4deg)} 100%{opacity:.9;transform:translate(-50%,-50%) scale(1) rotate(0deg)} }
  @keyframes npc-aura-breathe    { 0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.2;transform:translate(-50%,-50%) scale(1.09)} }
  @keyframes npc-aura-ripple     { 0%{opacity:.75;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.3)} }
  @keyframes npc-aura-earthpulse { 0%,100%{opacity:.55;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.9;transform:translate(-50%,-50%) scale(1.05)} }
  @keyframes npc-aura-rotate     { 0%{transform:translate(-50%,-50%) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes npc-aura-counter    { 0%{transform:translate(-50%,-50%) rotate(0deg);opacity:.35} 50%{opacity:.15} 100%{transform:translate(-50%,-50%) rotate(-360deg);opacity:.35} }
  @keyframes npc-rotate-conic    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes npc-panel-spark     { 0%{transform:translateY(-150%)} 100%{transform:translateY(250%)} }
  @keyframes npc-slide-down      { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
`;

// Aura animation name mapping (npc- prefix taaki profile page ke saath clash na ho)
const AURA_ANIM: Record<string, string> = {
  "aura-shimmer":    "npc-aura-shimmer",
  "aura-pulse":      "npc-aura-pulse",
  "aura-ember":      "npc-aura-ember",
  "aura-breathe":    "npc-aura-breathe",
  "aura-ripple":     "npc-aura-ripple",
  "aura-earthpulse": "npc-aura-earthpulse",
  "aura-rotate":     "npc-aura-rotate",
};

// ── Mini Avatar ───────────────────────────────────────────────────────────────
function MiniAvatar({ avatarId, size = 32 }: { avatarId: string; size?: number }) {
  const item    = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
  const beltKey = item.unlockBelt.toLowerCase();
  const bc      = BELT_COLORS[beltKey] ?? BELT_COLORS["white"];
  const aura    = BELT_AURA[beltKey]   ?? BELT_AURA["white"];

  return (
    <div style={{ position: "relative", width: size + 8, height: size + 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {/* Single ring for mini version */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: size + 6, height: size + 6, borderRadius: "50%",
        border: `1.5px solid ${aura.ringColor}`,
        opacity: 0.8,
        animation: `${AURA_ANIM[aura.animClass] ?? "npc-aura-pulse"} 2.8s linear infinite`,
        boxShadow: `0 0 8px ${aura.glowColor}`,
        pointerEvents: "none",
      }} />
      <div style={{
        width: size, height: size,
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        background: `linear-gradient(135deg, ${bc.bg}, #0a0a0a)`,
        border: `2px solid ${bc.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2,
        boxShadow: `inset 0 0 10px ${aura.glowColor}, 0 0 15px rgba(0,0,0,0.8)`,
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 30%, ${aura.glowColor}, transparent 70%)`, opacity: 0.5 }} />
        <span style={{ fontFamily: "serif", fontSize: size * 0.42, fontWeight: 700, color: bc.text, userSelect: "none", position: "relative", zIndex: 1, textShadow: `0 0 10px ${aura.ringColor}` }}>
          {item.kanji}
        </span>
      </div>
    </div>
  );
}

// ── Full Avatar (panel ke andar) ──────────────────────────────────────────────
function PanelAvatar({ avatarId, size = 72 }: { avatarId: string; size?: number }) {
  const item    = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
  const beltKey = item.unlockBelt.toLowerCase();
  const bc      = BELT_COLORS[beltKey] ?? BELT_COLORS["white"];
  const aura    = BELT_AURA[beltKey]   ?? BELT_AURA["white"];
  const wrap    = size + 44;

  return (
    <div style={{ position: "relative", width: wrap, height: wrap, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {[0,1,2,3,4].map((i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: size + 14 + i * 10, height: size + 14 + i * 10, borderRadius: "50%",
          border: `${i === 0 ? 2.5 : 1.5}px solid ${aura.ringColor}`,
          opacity: 0.8 - i * 0.14,
          animation: `${i % 2 === 0 ? (AURA_ANIM[aura.animClass] ?? "npc-aura-pulse") : "npc-aura-counter"} ${2.8 + i * 0.7}s linear infinite`,
          boxShadow: `0 0 ${22 + i * 8}px ${aura.glowColor}`,
          pointerEvents: "none",
        }} />
      ))}
      <div style={{
        width: size, height: size,
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        background: `linear-gradient(135deg, ${bc.bg}, #0a0a0a)`,
        border: `3px solid ${bc.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2,
        boxShadow: `inset 0 0 24px ${aura.glowColor}, 0 0 30px 8px rgba(0,0,0,0.8), 0 0 60px ${aura.glowColor}`,
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 30%, ${aura.glowColor}, transparent 70%)`, opacity: 0.5 }} />
        <span style={{ fontFamily: "serif", fontSize: size * 0.42, fontWeight: 700, color: bc.text, userSelect: "none", position: "relative", zIndex: 1, textShadow: `0 0 20px ${aura.ringColor}` }}>
          {item.kanji}
        </span>
      </div>
    </div>
  );
}

// ── Panel Banner ──────────────────────────────────────────────────────────────
function PanelBanner({ bannerId, height = 110 }: { bannerId: string; height?: number }) {
  const item    = BANNERS.find((b) => b.id === bannerId) ?? BANNERS[0];
  const beltKey = item.unlockBelt.toLowerCase();
  const bc      = BELT_COLORS[beltKey] ?? BELT_COLORS["white"];
  const aura    = BELT_AURA[beltKey]   ?? BELT_AURA["white"];
  const panel   = BELT_PANEL[beltKey]  ?? BELT_PANEL["white"];
  const PW = 8;

  const patternURL: Record<string, string> = {
    dashes: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='12'><rect x='0' y='0' width='${PW}' height='7' fill='rgba(0,0,0,0.3)'/></svg>`)}")`,
    double: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='1'><rect x='1' y='0' width='1' height='1' fill='rgba(255,255,255,0.3)'/><rect x='4' y='0' width='1' height='1' fill='rgba(255,255,255,0.3)'/></svg>`)}")`,
    dots:   `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='8'><circle cx='3' cy='4' r='1.1' fill='rgba(255,255,255,0.3)'/></svg>`)}")`,
    zigzag: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='8'><polyline points='0,4 3,0 6,4 3,8' fill='none' stroke='rgba(201,168,76,0.6)' stroke-width='1'/></svg>`)}")`,
    solid:  "none",
  };

  return (
    <div style={{ position: "relative", width: "100%", height, overflow: "hidden", background: "#050505" }}>
      <div style={{ position: "absolute", inset: -24, background: `conic-gradient(transparent 20%, ${aura.ringColor}44, transparent 80%)`, animation: `npc-rotate-conic ${beltKey === "black" ? "5s" : "9s"} linear infinite`, opacity: 0.35, filter: "blur(3px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(-55deg, transparent, transparent 28px, ${aura.ringColor}08 28px, ${aura.ringColor}08 29px)` }} />
      {/* Left accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, width: PW, height: "100%", background: panel.gradient, boxShadow: `5px 0 22px 5px ${panel.glow}`, zIndex: 2, overflow: "hidden" }}>
        {panel.pattern !== "solid" && (
          <div style={{ position: "absolute", inset: 0, backgroundImage: patternURL[panel.pattern] ?? "none", backgroundRepeat: "repeat-y", backgroundSize: `${PW}px auto`, mixBlendMode: "overlay" }} />
        )}
        {beltKey === "black" && (
          <div style={{ position: "absolute", left: 0, width: "100%", height: 32, background: "linear-gradient(to bottom,transparent,rgba(245,213,118,0.95),transparent)", animation: "npc-panel-spark 1.8s linear infinite" }} />
        )}
      </div>
      {/* Kanji watermark */}
      <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontFamily: "serif", fontSize: height * 1.2, color: bc.border, opacity: 0.055, fontWeight: 700, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
        {item.kanji}
      </div>
      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "65%", background: "linear-gradient(to bottom, transparent, rgba(5,5,5,0.97))", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, background: `linear-gradient(to left, ${aura.glowColor}, transparent)`, opacity: 0.15, pointerEvents: "none" }} />
    </div>
  );
}

// ── HUD Corners ───────────────────────────────────────────────────────────────
function HUDCorners({ color }: { color: string }) {
  const s: React.CSSProperties = { position: "absolute", width: 14, height: 14 };
  return (
    <>
      <div style={{ ...s, top: 0, left: 0,    borderTop: `2px solid ${color}`, borderLeft:   `2px solid ${color}` }} />
      <div style={{ ...s, top: 0, right: 0,   borderTop: `2px solid ${color}`, borderRight:  `2px solid ${color}` }} />
      <div style={{ ...s, bottom: 0, left: 0,  borderBottom: `2px solid ${color}`, borderLeft:  `2px solid ${color}` }} />
      <div style={{ ...s, bottom: 0, right: 0, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
    </>
  );
}

// ── Profile data (apna real auth/session yahan connect karo) ─────────────────
// Abhi mock data hain — baad mein useUser() ya session se replace karna
const MOCK_USER = {
  firstName:          "Arjun",
  lastName:           "Sharma",
  currentBelt:        "yellow",
  dojo:               "Patna Central Dojo",
  instructorName:     "Sensei Vikram Singh",
  memberId:           "BKF-2024-00847",
  registrationStatus: "approved" as const,
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function NavbarProfileCard() {
  const { avatarId, bannerId } = useCosmetics();
  const [open, setOpen]        = useState(false);
  const [mounted, setMounted]  = useState(false);
  const dropdownRef            = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Click outside se close
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Escape key se close
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const belt     = MOCK_USER.currentBelt;
  const beltMeta = BELT_META[belt] ?? BELT_META["white"];

  if (!mounted) return null;

  return (
    <>
      <style>{CARD_KEYFRAMES}</style>

      <div ref={dropdownRef} style={{ position: "relative", zIndex: 1000 }}>

        {/* ── Trigger button — navbar mein dikhta hai ── */}
        <button
          onClick={() => setOpen((p) => !p)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "5px 10px 5px 6px",
            background: open ? "rgba(255,255,255,0.05)" : "transparent",
            border: `1px solid ${open ? beltMeta.color + "40" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 6, cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <MiniAvatar avatarId={avatarId} size={28} />
          <span style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 700,
            letterSpacing: "0.05em", color: "#d0d0d0", textTransform: "uppercase",
          }}>
            {MOCK_USER.firstName}
          </span>
          <ChevronDown
            size={12} color="#666"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
          />
        </button>

        {/* ── Dropdown Panel ── */}
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 10px)", right: 0,
            width: 380,
            background: "#070707",
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: `0 32px 64px -16px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px -10px ${beltMeta.glow}`,
            animation: "npc-slide-down 0.2s ease-out",
          }}>
            <HUDCorners color={beltMeta.color} />

            {/* Belt top glow */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(to right, transparent 5%, ${beltMeta.color}80, transparent 95%)`,
              zIndex: 10,
            }} />

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute", top: 8, right: 8, zIndex: 20,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 4, padding: 4, cursor: "pointer", color: "#666",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X size={12} />
            </button>

            {/* Banner */}
            <div style={{ height: 110, position: "relative", overflow: "hidden" }}>
              <PanelBanner bannerId={bannerId} height={110} />
            </div>

            {/* Identity strip */}
            <div style={{
              background: "linear-gradient(to bottom, #080808, #0a0a0a)",
              padding: "0 20px 18px",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", inset: 0, opacity: 0.025, pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
                backgroundSize: "20px 20px",
              }} />

              <div style={{ display: "flex", gap: 14, alignItems: "flex-end", position: "relative" }}>
                {/* Avatar — overlapping banner */}
                <div style={{ marginTop: -48, flexShrink: 0, position: "relative" }}>
                  <PanelAvatar avatarId={avatarId} size={72} />
                  {/* Status dot */}
                  <div style={{
                    position: "absolute", bottom: 6, right: 6,
                    width: 10, height: 10, borderRadius: "50%",
                    background: MOCK_USER.registrationStatus === "approved" ? "#22c55e" : "#f59e0b",
                    border: "2px solid #080808",
                    boxShadow: `0 0 6px ${MOCK_USER.registrationStatus === "approved" ? "#22c55e" : "#f59e0b"}`,
                    zIndex: 10,
                  }} />
                </div>

                {/* Name + details */}
                <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
                  {/* Belt badge */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    marginBottom: 6, marginTop: 6,
                    padding: "2px 8px 2px 6px",
                    background: `${beltMeta.color}15`,
                    border: `1px solid ${beltMeta.color}40`,
                    borderRadius: 3,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, background: beltMeta.color, boxShadow: `0 0 6px ${beltMeta.glow}` }} />
                    <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: beltMeta.color, textTransform: "uppercase" }}>
                      {beltMeta.label}
                    </span>
                    <span style={{ width: 1, height: 8, background: `${beltMeta.color}30` }} />
                    <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: "#555", textTransform: "uppercase" }}>
                      Rank {beltMeta.rank}/8
                    </span>
                  </div>

                  {/* Name */}
                  <h2 style={{
                    fontFamily: "'Rajdhani', serif",
                    fontSize: "clamp(20px, 3vw, 28px)",
                    fontWeight: 800, letterSpacing: "0.04em",
                    color: "#f0f0f0", textTransform: "uppercase",
                    lineHeight: 1, margin: 0,
                    textShadow: `0 0 30px ${beltMeta.glow}`,
                  }}>
                    {MOCK_USER.firstName}{" "}
                    <span style={{ color: beltMeta.color }}>{MOCK_USER.lastName}</span>
                  </h2>

                  {/* Chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                    <span style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 600,
                      color: "#777", padding: "3px 8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4,
                    }}>
                      <Swords size={9} color="#c8102e" />
                      {MOCK_USER.dojo}
                    </span>
                    <span style={{
                      fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 600,
                      color: "#666", padding: "3px 8px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4,
                    }}>
                      {MOCK_USER.instructorName}
                    </span>
                    <span style={{
                      fontFamily: "monospace", fontSize: 9, color: "#555",
                      padding: "3px 8px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)", borderRadius: 4,
                      letterSpacing: "0.06em",
                    }}>
                      {MOCK_USER.memberId}
                    </span>
                    <span style={{
                      fontFamily: "'Rajdhani',sans-serif", fontSize: 8, fontWeight: 800,
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      padding: "3px 8px", borderRadius: 3,
                      color: MOCK_USER.registrationStatus === "approved" ? "#22c55e" : "#f59e0b",
                      background: MOCK_USER.registrationStatus === "approved" ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
                      border: `1px solid ${MOCK_USER.registrationStatus === "approved" ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)"}`,
                    }}>
                      ● {MOCK_USER.registrationStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}>
              {[
                { href: "/profile",        icon: <User size={13} />,     label: "Profile"   },
                { href: "/profile/avatar", icon: <Sparkles size={13} />, label: "Customize" },
                { href: "/logout",         icon: <LogOut size={13} />,   label: "Logout",   danger: true },
              ].map(({ href, icon, label, danger }, i) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "14px 8px",
                    color: danger ? "#c8102e" : "#555",
                    textDecoration: "none",
                    borderRight: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    background: "transparent",
                    transition: "background 0.15s, color 0.15s",
                    fontFamily: "'Rajdhani',sans-serif",
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.15em", textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = danger ? "rgba(200,16,46,0.08)" : "rgba(255,255,255,0.03)";
                    (e.currentTarget as HTMLElement).style.color = danger ? "#e84060" : "#ccc";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = danger ? "#c8102e" : "#555";
                  }}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}