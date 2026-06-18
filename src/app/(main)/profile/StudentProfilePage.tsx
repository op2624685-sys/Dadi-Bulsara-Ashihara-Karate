"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  Trophy, Compass, FileText, Sparkles,
  Swords, User, MapPin, Shield, Star, Zap, ChevronRight,
} from "lucide-react";

// ── cosmetics imports ─────────────────────────────────────────────────────────
import { AVATARS, BANNERS } from "./avatar/cosmetics";
import { getEquipped } from "./avatar/cosmeticsStore";

// ── Visual system ─────────────────────────────────────────────────────────────
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

// ── Types ─────────────────────────────────────────────────────────────────────
type Belt = "white" | "yellow" | "orange" | "green" | "blue" | "purple" | "brown" | "black";

interface BeltHistoryEntry {
  belt: Belt; date: string; instructor: string; location: string;
}
interface Achievement {
  id: string; title: string; event: string; date: string;
  position: "gold" | "silver" | "bronze" | "participation"; category: string;
}
interface StudentProfile {
  firstName: string; lastName: string; email: string;
  memberId: string; joinedDate: string;
  fatherName: string; motherName: string;
  dob: string; bloodGroup: string; mobileNumber: string;
  address: string; state: string; pinCode: string;
  currentBelt: Belt; instructorName: string; dojo: string;
  registrationStatus: "pending" | "approved" | "rejected";
  avatarInitials: string;
  beltHistory: BeltHistoryEntry[];
  achievements: Achievement[];
}

const MOCK_PROFILE: StudentProfile = {
  firstName: "Arjun", lastName: "Sharma",
  email: "arjun.sharma@email.com", memberId: "BKF-2024-00847", joinedDate: "March 2024",
  fatherName: "Rajesh Sharma", motherName: "Sunita Sharma",
  dob: "2005-08-14", bloodGroup: "B+", mobileNumber: "9876543210",
  address: "House No. 12, Patliputra Colony", state: "Bihar", pinCode: "800013",
  currentBelt: "yellow", instructorName: "Sensei Vikram Singh", dojo: "Patna Central Dojo",
  registrationStatus: "approved", avatarInitials: "AS",
  beltHistory: [
    { belt: "white",  date: "Mar 2024", instructor: "Sensei Vikram Singh", location: "Patna Central Dojo" },
    { belt: "yellow", date: "Aug 2024", instructor: "Sensei Vikram Singh", location: "Patna Central Dojo" },
  ],
  achievements: [
    { id: "1", title: "State Kata Championship",  event: "Bihar Karate State Open 2024", date: "Oct 2024", position: "silver",        category: "Kata · Under-19" },
    { id: "2", title: "District Kumite Cup",       event: "Patna District Meet 2024",     date: "Jul 2024", position: "gold",          category: "Kumite · -55 kg" },
    { id: "3", title: "Federation Grading Camp",  event: "BKF Summer Camp 2024",          date: "Jun 2024", position: "participation", category: "Training" },
  ],
};

const BELT_ORDER: Belt[] = ["white", "yellow", "orange", "green", "blue", "purple", "brown", "black"];

const BELT_META: Record<Belt, { color: string; label: string; glow: string; rank: number }> = {
  white:  { color: "#E5E7EB", label: "White Belt",  glow: "rgba(229,231,235,0.2)", rank: 1 },
  yellow: { color: "#FBBF24", label: "Yellow Belt", glow: "rgba(251,191,36,0.35)", rank: 2 },
  orange: { color: "#F97316", label: "Orange Belt", glow: "rgba(249,115,22,0.35)", rank: 3 },
  green:  { color: "#22C55E", label: "Green Belt",  glow: "rgba(34,197,94,0.35)",  rank: 4 },
  blue:   { color: "#3B82F6", label: "Blue Belt",   glow: "rgba(59,130,246,0.35)", rank: 5 },
  purple: { color: "#A855F7", label: "Purple Belt", glow: "rgba(168,85,247,0.35)", rank: 6 },
  brown:  { color: "#D97706", label: "Brown Belt",  glow: "rgba(217,119,6,0.35)",  rank: 7 },
  black:  { color: "#F5D576", label: "Black Belt",  glow: "rgba(245,213,118,0.5)", rank: 8 },
};

const POSITION_META = {
  gold:          { icon: "🥇", label: "1st Place",  color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)" },
  silver:        { icon: "🥈", label: "2nd Place",  color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)" },
  bronze:        { icon: "🥉", label: "3rd Place",  color: "#CD7F32", bg: "rgba(205,127,50,0.1)",  border: "rgba(205,127,50,0.3)" },
  participation: { icon: "🎖️", label: "Participant", color: "#6B7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)" },
};

// ── Keyframes ─────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');

  @keyframes aura-shimmer    { 0%,100%{opacity:.45;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.9;transform:translate(-50%,-50%) scale(1.05)} }
  @keyframes aura-pulse      { 0%,100%{opacity:.9;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.45;transform:translate(-50%,-50%) scale(1.07)} }
  @keyframes aura-ember      { 0%{opacity:.9;transform:translate(-50%,-50%) scale(1) rotate(0deg)} 40%{opacity:.6;transform:translate(-50%,-50%) scale(1.05) rotate(4deg)} 100%{opacity:.9;transform:translate(-50%,-50%) scale(1) rotate(0deg)} }
  @keyframes aura-breathe    { 0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.2;transform:translate(-50%,-50%) scale(1.09)} }
  @keyframes aura-ripple     { 0%{opacity:.75;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.3)} }
  @keyframes aura-earthpulse { 0%,100%{opacity:.55;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.9;transform:translate(-50%,-50%) scale(1.05)} }
  @keyframes aura-rotate     { 0%{transform:translate(-50%,-50%) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes aura-counter    { 0%{transform:translate(-50%,-50%) rotate(0deg);opacity:.35} 50%{opacity:.15} 100%{transform:translate(-50%,-50%) rotate(-360deg);opacity:.35} }
  @keyframes rotate-conic    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes panel-spark     { 0%{transform:translateY(-150%)} 100%{transform:translateY(250%)} }
  @keyframes scan-line       { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes flicker         { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.7} 94%{opacity:1} 97%{opacity:0.85} 98%{opacity:1} }
  @keyframes hud-pulse       { 0%,100%{opacity:0.6;box-shadow:0 0 0 0 currentColor} 50%{opacity:1;box-shadow:0 0 8px 2px currentColor} }
  @keyframes slide-in-left   { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slide-in-right  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slide-in-up     { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes corner-glow     { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes data-scroll     { 0%{transform:translateY(0)} 100%{transform:translateY(-50%)} }
  @keyframes rank-fill       { from{width:0} to{width:var(--fill-w)} }
  @keyframes badge-pop       { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes shimmer-sweep   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes border-race     { 0%{stroke-dashoffset:1000} 100%{stroke-dashoffset:0} }

  .sp-page { font-family: 'Rajdhani', 'Montserrat', sans-serif; }

  .hud-corner::before, .hud-corner::after {
    content: '';
    position: absolute;
    width: 14px; height: 14px;
    border-color: currentColor; border-style: solid; opacity: 0.7;
  }
  .hud-corner-tl::before { top:0; left:0; border-width: 2px 0 0 2px; }
  .hud-corner-tr::after  { top:0; right:0; border-width: 2px 2px 0 0; }
  .hud-corner-bl::before { bottom:0; left:0; border-width: 0 0 2px 2px; }
  .hud-corner-br::after  { bottom:0; right:0; border-width: 0 2px 2px 0; }

  .sp-stat-bar { transition: width 1.2s cubic-bezier(0.23,1,0.32,1); }
  .sp-card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .sp-card-hover:hover { transform: translateY(-2px); }

  .shimmer-text {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer-sweep 3s infinite;
    -webkit-background-clip: text;
  }

  .achievement-row { transition: all 0.25s ease; }
  .achievement-row:hover { background: rgba(255,255,255,0.03); transform: translateX(4px); }

  /* Scrollbar */
  .sp-scroll::-webkit-scrollbar { width: 3px; }
  .sp-scroll::-webkit-scrollbar-track { background: transparent; }
  .sp-scroll::-webkit-scrollbar-thumb { background: rgba(200,16,46,0.4); border-radius: 2px; }
`;

// ── Avatar Renderer ───────────────────────────────────────────────────────────
function AvatarRenderer({ avatarId, size = 72 }: { avatarId: string; size?: number }) {
  const item = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
  const beltKey = item.unlockBelt.toLowerCase();
  const bc   = BELT_COLORS[beltKey] ?? BELT_COLORS["white"];
  const aura = BELT_AURA[beltKey]   ?? BELT_AURA["white"];
  const wrap = size + 44;

  return (
    <div style={{ position: "relative", width: wrap, height: wrap, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {[0,1,2,3,4].map((i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width:  size + 14 + i * 10, height: size + 14 + i * 10,
          borderRadius: "50%",
          border: `${i === 0 ? 2.5 : 1.5}px solid ${aura.ringColor}`,
          opacity: 0.8 - i * 0.14,
          animation: `${i % 2 === 0 ? aura.animClass : "aura-counter"} ${2.8 + i * 0.7}s linear infinite`,
          boxShadow: `0 0 ${22 + i * 8}px ${aura.glowColor}`,
          pointerEvents: "none",
        }} />
      ))}
      {/* Hexagonal clip via border-radius trick */}
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
        {/* inner glow layer */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at 30% 30%, ${aura.glowColor}, transparent 70%)`,
          opacity: 0.5,
        }} />
        <span style={{
          fontFamily: "serif", fontSize: size * 0.42,
          fontWeight: 700, color: bc.text,
          userSelect: "none", position: "relative", zIndex: 1,
          textShadow: `0 0 20px ${aura.ringColor}`,
        }}>
          {item.kanji}
        </span>
      </div>
    </div>
  );
}

// ── Banner Renderer ───────────────────────────────────────────────────────────
function BannerRenderer({ bannerId, height = 200 }: { bannerId: string; height?: number }) {
  const item    = BANNERS.find((b) => b.id === bannerId) ?? BANNERS[0];
  const beltKey = item.unlockBelt.toLowerCase();
  const bc      = BELT_COLORS[beltKey] ?? BELT_COLORS["white"];
  const aura    = BELT_AURA[beltKey]   ?? BELT_AURA["white"];
  const panel   = BELT_PANEL[beltKey]  ?? BELT_PANEL["white"];
  const PW = 10;

  const patternURL: Record<string, string> = {
    dashes: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='12'><rect x='0' y='0' width='${PW}' height='7' fill='rgba(0,0,0,0.3)'/></svg>`)}")`,
    double: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='1'><rect x='1' y='0' width='1' height='1' fill='rgba(255,255,255,0.3)'/><rect x='4' y='0' width='1' height='1' fill='rgba(255,255,255,0.3)'/></svg>`)}")`,
    dots:   `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='8'><circle cx='3' cy='4' r='1.1' fill='rgba(255,255,255,0.3)'/></svg>`)}")`,
    zigzag: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='8'><polyline points='0,4 3,0 6,4 3,8' fill='none' stroke='rgba(201,168,76,0.6)' stroke-width='1'/></svg>`)}")`,
    solid:  "none",
  };

  return (
    <div style={{ position: "relative", width: "100%", height, overflow: "hidden", background: "#050505" }}>
      {/* Animated conic glow behind */}
      <div style={{
        position: "absolute", inset: -32,
        background: `conic-gradient(transparent 20%, ${aura.ringColor}44, transparent 80%)`,
        animation: `rotate-conic ${beltKey === "black" ? "5s" : "9s"} linear infinite`,
        opacity: 0.35, filter: "blur(4px)", pointerEvents: "none",
      }} />
      {/* Main diagonal stripe pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `repeating-linear-gradient(
          -55deg,
          transparent,
          transparent 30px,
          ${aura.ringColor}08 30px,
          ${aura.ringColor}08 31px
        )`,
      }} />
      {/* Left accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: PW, height: "100%",
        background: panel.gradient, boxShadow: `6px 0 28px 6px ${panel.glow}`, zIndex: 2, overflow: "hidden",
      }}>
        {panel.pattern !== "solid" && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: patternURL[panel.pattern] ?? "none",
            backgroundRepeat: "repeat-y", backgroundSize: `${PW}px auto`, mixBlendMode: "overlay",
          }} />
        )}
        {beltKey === "black" && (
          <div style={{
            position: "absolute", left: 0, width: "100%", height: 40,
            background: "linear-gradient(to bottom,transparent,rgba(245,213,118,0.95),transparent)",
            animation: "panel-spark 1.8s linear infinite",
          }} />
        )}
      </div>
      {/* Kanji watermark */}
      <div style={{
        position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)",
        fontFamily: "serif", fontSize: height * 1.3,
        color: bc.border, opacity: 0.05, fontWeight: 700,
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>
        {item.kanji}
      </div>
      {/* Horizontal scan line */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: `linear-gradient(to right, transparent, ${aura.ringColor}60, transparent)`,
          animation: "panel-spark 3s linear infinite",
          opacity: 0.6,
        }} />
      </div>
      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "60%",
        background: "linear-gradient(to bottom, transparent, rgba(5,5,5,0.95))",
        pointerEvents: "none",
      }} />
      {/* Right edge glow */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 140,
        background: `linear-gradient(to left, ${aura.glowColor}, transparent)`,
        opacity: 0.15, pointerEvents: "none",
      }} />
    </div>
  );
}

// ── HUD Corner Decorator ──────────────────────────────────────────────────────
function HUDCorners({ color }: { color: string }) {
  const style: React.CSSProperties = { position: "absolute", width: 18, height: 18, color };
  return (
    <>
      <div style={{ ...style, top: 0, left: 0,   borderTop: `2px solid ${color}`,   borderLeft: `2px solid ${color}` }} />
      <div style={{ ...style, top: 0, right: 0,  borderTop: `2px solid ${color}`,   borderRight: `2px solid ${color}` }} />
      <div style={{ ...style, bottom: 0, left: 0,  borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <div style={{ ...style, bottom: 0, right: 0, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
    </>
  );
}

// ── Belt Progress Track ───────────────────────────────────────────────────────
function BeltProgressTrack({ currentBelt, beltHistory }: { currentBelt: Belt; beltHistory: BeltHistoryEntry[] }) {
  const currentRank = BELT_META[currentBelt].rank;
  const totalRanks  = BELT_ORDER.length;
  const progressPct = ((currentRank - 1) / (totalRanks - 1)) * 100;

  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
        borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 14,
      }}>
        <Compass size={14} color="#c8102e" />
        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#888", textTransform: "uppercase" }}>
          Belt Progression Track
        </span>
      </div>

      {/* Visual progress bar */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progressPct}%`,
            background: `linear-gradient(to right, rgba(200,16,46,0.6), ${BELT_META[currentBelt].color})`,
            borderRadius: 2, boxShadow: `0 0 10px ${BELT_META[currentBelt].glow}`,
            transition: "width 1.5s cubic-bezier(0.23,1,0.32,1)",
          }} />
        </div>
        {/* Dot markers */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {BELT_ORDER.map((b) => {
            const unlocked = BELT_META[b].rank <= currentRank;
            const isCurrent = b === currentBelt;
            return (
              <div key={b} style={{
                width: isCurrent ? 10 : 7,
                height: isCurrent ? 10 : 7,
                borderRadius: "50%",
                background: unlocked ? BELT_META[b].color : "rgba(255,255,255,0.1)",
                boxShadow: isCurrent ? `0 0 12px 4px ${BELT_META[b].glow}` : "none",
                border: isCurrent ? `2px solid ${BELT_META[b].color}` : "none",
                transition: "all 0.3s",
                marginTop: isCurrent ? -2 : 0,
              }} />
            );
          })}
        </div>
      </div>

      {/* Belt list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {BELT_ORDER.map((belt) => {
          const meta    = BELT_META[belt];
          const entry   = beltHistory.find((h) => h.belt === belt);
          const isCurrent = belt === currentBelt;
          const unlocked  = meta.rank <= currentRank;

          return (
            <div
              key={belt}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: 6,
                background: isCurrent
                  ? `linear-gradient(to right, ${meta.glow}, rgba(255,255,255,0.02))`
                  : unlocked
                    ? "rgba(255,255,255,0.02)"
                    : "transparent",
                border: `1px solid ${isCurrent ? meta.color + "50" : unlocked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)"}`,
                opacity: unlocked ? 1 : 0.3,
                transition: "all 0.2s",
                position: "relative", overflow: "hidden",
              }}
            >
              {isCurrent && (
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                  background: meta.color,
                  boxShadow: `0 0 8px ${meta.color}`,
                }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: isCurrent ? 6 : 0 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: 2,
                  background: unlocked ? meta.color : "rgba(255,255,255,0.15)",
                  boxShadow: unlocked ? `0 0 6px ${meta.glow}` : "none",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontSize: isCurrent ? 13 : 12,
                  fontWeight: isCurrent ? 700 : 600,
                  letterSpacing: "0.08em",
                  color: isCurrent ? meta.color : unlocked ? "#ccc" : "#444",
                  textTransform: "uppercase",
                }}>
                  {meta.label}
                </span>
                {isCurrent && (
                  <span style={{
                    fontSize: 8, fontWeight: 800, letterSpacing: "0.15em",
                    color: meta.color, background: `${meta.color}20`,
                    border: `1px solid ${meta.color}40`,
                    padding: "1px 5px", borderRadius: 2, textTransform: "uppercase",
                  }}>
                    Active
                  </span>
                )}
              </div>
              <div>
                {entry
                  ? <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#c8102e", letterSpacing: "0.05em" }}>{entry.date}</span>
                  : <span style={{ fontFamily: "monospace", fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.15em" }}>Locked</span>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Achievements Panel ────────────────────────────────────────────────────────
function AchievementsPanel({ achievements }: { achievements: Achievement[] }) {
  return (
    <div style={{ padding: "24px 28px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
        borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 14,
      }}>
        <Trophy size={14} color="#c8102e" />
        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#888", textTransform: "uppercase" }}>
          Medals & Honors
        </span>
        <span style={{
          marginLeft: "auto", fontSize: 9, fontWeight: 800,
          letterSpacing: "0.15em", color: "#c8102e",
          background: "rgba(200,16,46,0.1)", border: "1px solid rgba(200,16,46,0.2)",
          padding: "2px 8px", borderRadius: 3, textTransform: "uppercase",
        }}>
          {achievements.length} Records
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {achievements.map((ach) => {
          const pos = POSITION_META[ach.position];
          return (
            <div
              key={ach.id}
              className="achievement-row"
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 14px", borderRadius: 8,
                background: pos.bg,
                border: `1px solid ${pos.border}`,
                cursor: "default", position: "relative", overflow: "hidden",
              }}
            >
              {/* Left accent */}
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                background: pos.color,
                boxShadow: `0 0 8px ${pos.color}`,
              }} />
              <span style={{ fontSize: 22, flexShrink: 0 }}>{pos.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontSize: 13, fontWeight: 700, color: "#e8e8e8",
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {ach.title}
                </div>
                <div style={{
                  fontSize: 10, color: "#666", marginTop: 2,
                  fontFamily: "'Rajdhani',sans-serif",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {ach.event} · <span style={{ color: "#555" }}>{ach.category}</span>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
                  color: pos.color, textTransform: "uppercase",
                }}>
                  {pos.label}
                </div>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: "#555", marginTop: 2 }}>
                  {ach.date}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Info Panel ────────────────────────────────────────────────────────────────
function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.03)",
    }}>
      <span style={{
        fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 600,
        letterSpacing: "0.18em", color: "#555", textTransform: "uppercase",
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: accent ? "monospace" : "'Rajdhani',sans-serif",
        fontSize: accent ? 12 : 12,
        fontWeight: 700, color: accent ? "#c8102e" : "#ccc",
        letterSpacing: accent ? "0.04em" : "0.03em",
        textAlign: "right", maxWidth: 180,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {value}
      </span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentProfilePage() {
  const [profile]  = useState<StudentProfile>(MOCK_PROFILE);
  const [mounted,  setMounted] = useState(false);
  const [animated, setAnimated] = useState(false);

  const [avatarId] = useState(() => {
    if (typeof window === "undefined") return "avatar_white_s1";
    return getEquipped().avatarId;
  });
  const [bannerId] = useState(() => {
    if (typeof window === "undefined") return "banner_white_s1";
    return getEquipped().bannerId;
  });

  const pageRef   = useRef<HTMLDivElement>(null);
  const heroRef   = useRef<HTMLDivElement>(null);
  const leftRef   = useRef<HTMLDivElement>(null);
  const rightRef  = useRef<HTMLDivElement>(null);
  const statsRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!animated) return;
    const refs = [heroRef.current, statsRef.current, leftRef.current, rightRef.current];
    refs.forEach((el, i) => {
      if (!el) return;
      el.style.opacity    = "0";
      el.style.transform  = i % 2 === 0 ? "translateY(24px)" : "translateX(28px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)";
        el.style.opacity    = "1";
        el.style.transform  = "translate(0)";
      }, 80 + i * 90);
    });
  }, [animated]);

  const beltMeta = BELT_META[profile.currentBelt];
  const beltAura = BELT_AURA[profile.currentBelt];

  const age = (() => {
    const d = new Date(profile.dob);
    const now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) a--;
    return a;
  })();

  return (
    <div
      ref={pageRef}
      className="sp-page"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 0%, rgba(200,16,46,0.06) 0%, #030303 55%)",
        color: "#e0e0e0",
        paddingTop: 88,
        paddingBottom: 60,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* ── Background grid ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      {/* ── Ambient glows ── */}
      <div style={{ position: "fixed", top: "5%", left: "50%", transform: "translateX(-50%)", width: 700, height: 300, background: "radial-gradient(ellipse, rgba(200,16,46,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "20%", right: "-5%", width: 500, height: 500, background: `radial-gradient(ellipse, ${beltMeta.glow} 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0, opacity: 0.5 }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* ── Top nav bar ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Shield size={14} color="#c8102e" />
            <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#555", textTransform: "uppercase" }}>
              Dadi Bulsara · Ashihara Karate Federation
            </span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontFamily: "monospace", fontSize: 10, color: "#444" }}>
              {profile.memberId}
            </span>
          </div>
          <Link
            href="/profile/avatar"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 18px",
              background: "rgba(200,16,46,0.08)",
              border: "1px solid rgba(200,16,46,0.25)",
              borderRadius: 4,
              color: "#e0e0e0",
              textDecoration: "none",
              fontFamily: "'Rajdhani',sans-serif",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
              transition: "all 0.2s",
              position: "relative", overflow: "hidden",
            }}
          >
            <Sparkles size={12} color="#c8102e" />
            Customize
            <ChevronRight size={12} />
          </Link>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            HERO CARD
        ═══════════════════════════════════════════════════════════════════ */}
        <div
          ref={heroRef}
          style={{
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            marginBottom: 16,
            boxShadow: `0 40px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)`,
          }}
        >
          {/* HUD corner accents */}
          <HUDCorners color={beltMeta.color} />

          {/* Belt color top edge glow */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(to right, transparent 5%, ${beltMeta.color}90, transparent 95%)`,
            zIndex: 10,
          }} />

          {/* ── Banner ── */}
          <div style={{ height: 190, position: "relative", overflow: "hidden" }}>
            {mounted && <BannerRenderer bannerId={bannerId} height={190} />}
          </div>

          {/* ── Identity strip ── */}
          <div style={{
            background: "linear-gradient(to bottom, #080808, #0c0c0c)",
            padding: "0 32px 28px",
            position: "relative",
          }}>
            {/* Subtle inner grid */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
              backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }} />

            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-end", position: "relative" }}>

              {/* Avatar — overlaps banner */}
              <div style={{ marginTop: -56, flexShrink: 0, position: "relative" }}>
                {mounted && <AvatarRenderer avatarId={avatarId} size={96} />}
                {/* Status indicator */}
                <div style={{
                  position: "absolute", bottom: 8, right: 8,
                  width: 12, height: 12, borderRadius: "50%",
                  background: profile.registrationStatus === "approved" ? "#22c55e" : "#f59e0b",
                  border: "2px solid #080808",
                  boxShadow: `0 0 8px ${profile.registrationStatus === "approved" ? "#22c55e" : "#f59e0b"}`,
                  zIndex: 10,
                }} />
              </div>

              {/* Name + details */}
              <div style={{ flex: 1, minWidth: 200, paddingBottom: 4 }}>
                {/* Belt badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  marginBottom: 8, marginTop: 8,
                  padding: "3px 10px 3px 7px",
                  background: `${beltMeta.color}15`,
                  border: `1px solid ${beltMeta.color}40`,
                  borderRadius: 3,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 2,
                    background: beltMeta.color,
                    boxShadow: `0 0 8px ${beltMeta.glow}`,
                  }} />
                  <span style={{
                    fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 800,
                    letterSpacing: "0.2em", color: beltMeta.color, textTransform: "uppercase",
                  }}>
                    {beltMeta.label}
                  </span>
                  <span style={{ width: 1, height: 10, background: `${beltMeta.color}30` }} />
                  <span style={{
                    fontFamily: "'Rajdhani',sans-serif", fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.15em", color: "#555", textTransform: "uppercase",
                  }}>
                    Rank {beltMeta.rank} / 8
                  </span>
                </div>

                {/* Name */}
                <h1 style={{
                  fontFamily: "'Rajdhani', 'Cinzel', serif",
                  fontSize: "clamp(28px, 4vw, 46px)",
                  fontWeight: 800, letterSpacing: "0.04em",
                  color: "#f0f0f0", textTransform: "uppercase",
                  lineHeight: 1, margin: 0,
                  textShadow: `0 0 40px ${beltMeta.glow}`,
                }}>
                  {profile.firstName}{" "}
                  <span style={{ color: beltMeta.color }}>{profile.lastName}</span>
                </h1>

                {/* Sub-info */}
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10, alignItems: "center",
                }}>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 600,
                    letterSpacing: "0.08em", color: "#777",
                    padding: "4px 10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 4,
                  }}>
                    <Swords size={10} color="#c8102e" />
                    {profile.dojo}
                  </span>
                  <span style={{
                    fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 600,
                    color: "#666", padding: "4px 10px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 4,
                  }}>
                    Sensei: <strong style={{ color: "#999", fontWeight: 700 }}>{profile.instructorName}</strong>
                  </span>
                  <span style={{
                    fontFamily: "monospace", fontSize: 10, color: "#555",
                    padding: "4px 10px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    letterSpacing: "0.06em",
                  }}>
                    {profile.memberId}
                  </span>
                  <span style={{
                    fontFamily: "'Rajdhani',sans-serif", fontSize: 9, fontWeight: 800,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    padding: "4px 10px", borderRadius: 3,
                    color: profile.registrationStatus === "approved" ? "#22c55e" : "#f59e0b",
                    background: profile.registrationStatus === "approved" ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
                    border: `1px solid ${profile.registrationStatus === "approved" ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)"}`,
                  }}>
                    ● {profile.registrationStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── HUD Stats bar ── */}
          <div
            ref={statsRef}
            style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(0,0,0,0.4)",
            }}
          >
            {[
              { label: "Tiers Cleared",  value: profile.beltHistory.length,  suffix: `/ ${BELT_ORDER.length}`, icon: <Star size={12} color={beltMeta.color} /> },
              { label: "Achievements",   value: profile.achievements.length,  suffix: "Records",                icon: <Trophy size={12} color="#c8102e" /> },
              { label: "Enlisted",       value: profile.joinedDate,           suffix: "",                       icon: <Shield size={12} color="#555" />, mono: true },
              { label: "Age Bracket",    value: `${age}`,                     suffix: "Years",                  icon: <User size={12} color="#555" /> },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "18px 20px",
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  position: "relative",
                }}
              >
                {/* Top corner accent for first item */}
                {i === 0 && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(to right, ${beltMeta.color}80, transparent)`,
                  }} />
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  {s.icon}
                  <span style={{
                    fontFamily: "'Rajdhani',sans-serif", fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.2em", color: "#555", textTransform: "uppercase",
                  }}>
                    {s.label}
                  </span>
                </div>
                <div style={{
                  fontFamily: s.mono ? "monospace" : "'Rajdhani',sans-serif",
                  fontSize: s.mono ? 13 : 24,
                  fontWeight: 800, color: "#e0e0e0", lineHeight: 1,
                }}>
                  {s.value}
                  {s.suffix && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: "#555",
                      marginLeft: 5, fontFamily: "'Rajdhani',sans-serif",
                    }}>
                      {s.suffix}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            MAIN GRID
        ═══════════════════════════════════════════════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>

          {/* Row 1: Belt + Achievements side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

            {/* Belt Progression */}
            <div
              ref={leftRef}
              className="sp-card-hover"
              style={{
                background: "#080808",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                position: "relative", overflow: "hidden",
              }}
            >
              <HUDCorners color={beltMeta.color + "50"} />
              <div style={{
                position: "absolute", top: 0, left: 0, width: 3, height: "100%",
                background: `linear-gradient(to bottom, transparent, ${beltMeta.color}, transparent)`,
                opacity: 0.5,
              }} />
              <BeltProgressTrack currentBelt={profile.currentBelt} beltHistory={profile.beltHistory} />
            </div>

            {/* Achievements */}
            <div
              ref={rightRef}
              className="sp-card-hover"
              style={{
                background: "#080808",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                position: "relative", overflow: "hidden",
              }}
            >
              <HUDCorners color="rgba(200,16,46,0.4)" />
              <div style={{
                position: "absolute", top: 0, right: 0, width: 3, height: "100%",
                background: "linear-gradient(to bottom, transparent, rgba(200,16,46,0.6), transparent)",
                opacity: 0.6,
              }} />
              <AchievementsPanel achievements={profile.achievements} />
            </div>
          </div>

          {/* Row 2: Personal info + Documents */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

            {/* Personal Info */}
            <div
              className="sp-card-hover"
              style={{
                background: "#080808",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                padding: "24px 28px",
                position: "relative", overflow: "hidden",
              }}
            >
              <HUDCorners color="rgba(255,255,255,0.1)" />
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 18,
                borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 14,
              }}>
                <User size={13} color="#555" />
                <span style={{
                  fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.2em", color: "#555", textTransform: "uppercase",
                }}>
                  Core Dossier
                </span>
              </div>
              <InfoRow label="Father"       value={profile.fatherName} />
              <InfoRow label="Mother"       value={profile.motherName} />
              <InfoRow label="Date of Birth" value={new Date(profile.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
              <InfoRow label="Blood Group"  value={profile.bloodGroup} accent />
              <InfoRow label="Mobile"       value={`+91 ${profile.mobileNumber}`} />
              <InfoRow label="Email"        value={profile.email} />
            </div>

            {/* Location + Documents */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Location */}
              <div
                className="sp-card-hover"
                style={{
                  background: "#080808",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: "22px 28px",
                  position: "relative", overflow: "hidden",
                }}
              >
                <HUDCorners color="rgba(255,255,255,0.1)" />
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
                  borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 12,
                }}>
                  <MapPin size={13} color="#555" />
                  <span style={{
                    fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.2em", color: "#555", textTransform: "uppercase",
                  }}>
                    Sector Coordinates
                  </span>
                </div>
                <InfoRow label="Address" value={profile.address} />
                <InfoRow label="State"   value={profile.state} />
                <InfoRow label="PIN"     value={profile.pinCode} />
              </div>

              {/* Documents */}
              <div
                className="sp-card-hover"
                style={{
                  background: "#080808",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: "22px 28px",
                  position: "relative", overflow: "hidden",
                }}
              >
                <HUDCorners color="rgba(255,255,255,0.1)" />
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
                  borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 12,
                }}>
                  <FileText size={13} color="#555" />
                  <span style={{
                    fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.2em", color: "#555", textTransform: "uppercase",
                  }}>
                    Clearance Records
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {["Identity Document", "Passport Photo", "Belt Certificate", "Signature File"].map((doc, i) => (
                    <div
                      key={doc}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        borderRadius: 5,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "#22c55e", boxShadow: "0 0 6px #22c55e",
                        }} />
                        <span style={{
                          fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 600,
                          letterSpacing: "0.1em", color: "#888", textTransform: "uppercase",
                        }}>
                          {doc}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: "'Rajdhani',sans-serif", fontSize: 9, fontWeight: 800,
                        letterSpacing: "0.15em", color: "#22c55e", textTransform: "uppercase",
                        background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                        padding: "2px 7px", borderRadius: 3,
                      }}>
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          marginTop: 40, paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8,
        }}>
          <span style={{
            fontFamily: "'Rajdhani',sans-serif", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.2em", color: "#333", textTransform: "uppercase",
          }}>
            © 2026 Dadi Bulsara Ashihara Karate Federation
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <span style={{
              fontFamily: "monospace", fontSize: 9, color: "#444", letterSpacing: "0.1em",
            }}>
              SYSTEM SECURE · AUTHENTICATED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}