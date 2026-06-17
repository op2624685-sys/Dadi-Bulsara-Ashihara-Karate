"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  Trophy, Compass, FileText, Sparkles,
  Swords, User, MapPin, Shield,
} from "lucide-react";

// ── cosmetics imports ─────────────────────────────────────────────────────────
import { AVATARS, BANNERS } from "../profile/avatar/cosmetics";
import { getEquipped } from "../profile/avatar/cosmeticsStore";

// ── Visual system (same as CustomizePage — keep in sync) ─────────────────────
const BELT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  white: { bg: "#f5f5f5", text: "#111", border: "#ccc" },
  yellow: { bg: "#f5c518", text: "#111", border: "#d4a800" },
  orange: { bg: "#f97316", text: "#fff", border: "#c2410c" },
  green: { bg: "#2d6a2d", text: "#fff", border: "#1e4a1e" },
  blue: { bg: "#1a3a6e", text: "#fff", border: "#0f2548" },
  purple: { bg: "#4c1d95", text: "#fff", border: "#2e1065" },
  brown: { bg: "#5c3317", text: "#fff", border: "#3e2210" },
  black: { bg: "#111", text: "#fff", border: "#333" },
};

const BELT_AURA: Record<string, { ringColor: string; glowColor: string; animClass: string }> = {
  white: { ringColor: "#ddd", glowColor: "rgba(255,255,255,0.30)", animClass: "aura-shimmer" },
  yellow: { ringColor: "#ffe600", glowColor: "rgba(255,230,0,0.60)", animClass: "aura-pulse" },
  orange: { ringColor: "#f97316", glowColor: "rgba(249,115,22,0.60)", animClass: "aura-ember" },
  green: { ringColor: "#4ade80", glowColor: "rgba(74,222,128,0.55)", animClass: "aura-breathe" },
  blue: { ringColor: "#4a9eff", glowColor: "rgba(74,158,255,0.55)", animClass: "aura-ripple" },
  purple: { ringColor: "#a855f7", glowColor: "rgba(168,85,247,0.55)", animClass: "aura-pulse" },
  brown: { ringColor: "#f59e0b", glowColor: "rgba(245,158,11,0.60)", animClass: "aura-earthpulse" },
  black: { ringColor: "#f5d576", glowColor: "rgba(245,213,118,0.85)", animClass: "aura-rotate" },
};

const BELT_PANEL: Record<string, { gradient: string; pattern: string; glow: string }> = {
  white: { gradient: "linear-gradient(to bottom,#e8e8e8,#aaa,#e8e8e8)", pattern: "solid", glow: "rgba(255,255,255,0.2)" },
  yellow: { gradient: "linear-gradient(to bottom,#f5c518,#d4a800,#f5c518)", pattern: "dashes", glow: "rgba(245,197,24,0.4)" },
  orange: { gradient: "linear-gradient(to bottom,#f97316,#c2410c,#f97316)", pattern: "dots", glow: "rgba(249,115,22,0.45)" },
  green: { gradient: "linear-gradient(to bottom,#1e4a1e,#3a8c3a,#1e4a1e)", pattern: "double", glow: "rgba(58,140,58,0.35)" },
  blue: { gradient: "linear-gradient(to bottom,#0f2548,#2255aa,#0f2548)", pattern: "double", glow: "rgba(34,85,170,0.4)" },
  purple: { gradient: "linear-gradient(to bottom,#2e1065,#7c3aed,#2e1065)", pattern: "dots", glow: "rgba(124,58,237,0.4)" },
  brown: { gradient: "linear-gradient(to bottom,#3e2210,#7a4520,#3e2210)", pattern: "dots", glow: "rgba(122,69,32,0.4)" },
  black: { gradient: "linear-gradient(to bottom,#111,#444,#c9a84c,#444,#111)", pattern: "zigzag", glow: "rgba(201,168,76,0.5)" },
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
    { belt: "white", date: "Mar 2024", instructor: "Sensei Vikram Singh", location: "Patna Central Dojo" },
    { belt: "yellow", date: "Aug 2024", instructor: "Sensei Vikram Singh", location: "Patna Central Dojo" },
  ],
  achievements: [
    { id: "1", title: "State Kata Championship", event: "Bihar Karate State Open 2024", date: "Oct 2024", position: "silver", category: "Kata · Under-19" },
    { id: "2", title: "District Kumite Cup", event: "Patna District Meet 2024", date: "Jul 2024", position: "gold", category: "Kumite · -55 kg" },
    { id: "3", title: "Federation Grading Camp", event: "BKF Summer Camp 2024", date: "Jun 2024", position: "participation", category: "Training" },
  ],
};

const BELT_ORDER: Belt[] = ["white", "yellow", "orange", "green", "blue", "purple", "brown", "black"];

const BELT_META: Record<Belt, { color: string; label: string; glow: string }> = {
  white: { color: "#FFFFFF", label: "White Belt", glow: "rgba(255,255,255,0.15)" },
  yellow: { color: "#FBBF24", label: "Yellow Belt", glow: "rgba(251,191,36,0.3)" },
  orange: { color: "#F97316", label: "Orange Belt", glow: "rgba(249,115,22,0.3)" },
  green: { color: "#16A34A", label: "Green Belt", glow: "rgba(22,163,74,0.3)" },
  blue: { color: "#2563EB", label: "Blue Belt", glow: "rgba(37,99,235,0.3)" },
  purple: { color: "#7C3AED", label: "Purple Belt", glow: "rgba(124,58,237,0.3)" },
  brown: { color: "#92400E", label: "Brown Belt", glow: "rgba(146,64,14,0.3)" },
  black: { color: "#EF4444", label: "Black Belt", glow: "rgba(239,68,68,0.4)" },
};

const POSITION_META = {
  gold: { icon: "🥇", label: "1st Place", color: "#F59E0B" },
  silver: { icon: "🥈", label: "2nd Place", color: "#9CA3AF" },
  bronze: { icon: "🥉", label: "3rd Place", color: "#B45309" },
  participation: { icon: "🎖️", label: "Participant", color: "#6B7280" },
};

// ── CSS keyframes ─────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes aura-shimmer    { 0%,100%{opacity:.45;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.9;transform:translate(-50%,-50%) scale(1.05)} }
  @keyframes aura-pulse      { 0%,100%{opacity:.9;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.45;transform:translate(-50%,-50%) scale(1.07)} }
  @keyframes aura-ember      { 0%{opacity:.9;transform:translate(-50%,-50%) scale(1) rotate(0deg)} 40%{opacity:.6;transform:translate(-50%,-50%) scale(1.05) rotate(4deg)} 70%{opacity:1;transform:translate(-50%,-50%) scale(.97) rotate(-3deg)} 100%{opacity:.9;transform:translate(-50%,-50%) scale(1) rotate(0deg)} }
  @keyframes aura-breathe    { 0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.2;transform:translate(-50%,-50%) scale(1.09)} }
  @keyframes aura-ripple     { 0%{opacity:.75;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.3)} }
  @keyframes aura-earthpulse { 0%,100%{opacity:.55;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.9;transform:translate(-50%,-50%) scale(1.05)} }
  @keyframes aura-rotate     { 0%{transform:translate(-50%,-50%) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes aura-counter    { 0%{transform:translate(-50%,-50%) rotate(0deg);opacity:.35} 50%{opacity:.15} 100%{transform:translate(-50%,-50%) rotate(-360deg);opacity:.35} }
  @keyframes rotate-border   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes panel-spark     { 0%{transform:translateY(-150%)} 100%{transform:translateY(250%)} }
`;

// ── Avatar renderer (exact same as CustomizePage) ─────────────────────────────
function AvatarRenderer({ avatarId, size = 72 }: { avatarId: string; size?: number }) {
  const item = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
  // Map cosmetics.ts Belt (capitalised) → profile Belt (lowercase) for visual lookup
  const beltKey = item.unlockBelt.toLowerCase();
  const bc = BELT_COLORS[beltKey] ?? BELT_COLORS["white"];
  const aura = BELT_AURA[beltKey] ?? BELT_AURA["white"];
  const wrap = size + 40;

  return (
    <div style={{ position: "relative", width: wrap, height: wrap, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: size + 12 + i * 9,
          height: size + 12 + i * 9,
          borderRadius: "50%",
          border: `2px solid ${aura.ringColor}`,
          opacity: 0.75 - i * 0.12,
          animation: `${i % 2 === 0 ? aura.animClass : "aura-counter"} ${2.8 + i * 0.7}s linear infinite`,
          boxShadow: `0 0 ${18 + i * 6}px ${aura.glowColor}`,
          pointerEvents: "none",
        }} />
      ))}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: bc.bg, border: `3px solid ${bc.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2,
        boxShadow: `inset 0 0 20px ${aura.glowColor}, 0 0 20px 6px rgba(0,0,0,0.7)`,
      }}>
        <span style={{ fontFamily: "serif", fontSize: size * 0.36, fontWeight: 700, color: bc.text, userSelect: "none" }}>
          {item.kanji}
        </span>
      </div>
    </div>
  );
}

// ── Banner renderer (exact same as CustomizePage) ─────────────────────────────
function BannerRenderer({ bannerId, width = 800, height = 176 }: { bannerId: string; width?: number; height?: number }) {
  const item = BANNERS.find((b) => b.id === bannerId) ?? BANNERS[0];
  const beltKey = item.unlockBelt.toLowerCase();
  const bc = BELT_COLORS[beltKey] ?? BELT_COLORS["white"];
  const aura = BELT_AURA[beltKey] ?? BELT_AURA["white"];
  const panel = BELT_PANEL[beltKey] ?? BELT_PANEL["white"];
  const PW = 10;

  const patternURL: Record<string, string> = {
    dashes: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='12'><rect x='0' y='0' width='${PW}' height='7' fill='rgba(0,0,0,0.3)'/></svg>`)}")`,
    double: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='1'><rect x='1' y='0' width='1' height='1' fill='rgba(255,255,255,0.3)'/><rect x='4' y='0' width='1' height='1' fill='rgba(255,255,255,0.3)'/></svg>`)}")`,
    dots: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='8'><circle cx='3' cy='4' r='1.1' fill='rgba(255,255,255,0.3)'/></svg>`)}")`,
    zigzag: `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='8'><polyline points='0,4 3,0 6,4 3,8' fill='none' stroke='rgba(201,168,76,0.6)' stroke-width='1'/></svg>`)}")`,
    solid: "none",
  };

  return (
    <div style={{ position: "relative", width: "100%", height, overflow: "hidden", background: "#080808" }}>
      {/* Rotating border glow */}
      <div style={{ position: "absolute", inset: -24, background: `conic-gradient(transparent 30%,${aura.ringColor},transparent 70%)`, animation: `rotate-border ${beltKey === "black" ? "6s" : "9s"} linear infinite`, opacity: .4, filter: "blur(3px)", pointerEvents: "none" }} />
      {/* Left panel */}
      <div style={{ position: "absolute", top: 0, left: 0, width: PW, height: "100%", background: panel.gradient, boxShadow: `4px 0 24px 4px ${panel.glow}`, zIndex: 2, overflow: "hidden" }}>
        {panel.pattern !== "solid" && (
          <div style={{ position: "absolute", inset: 0, backgroundImage: patternURL[panel.pattern] ?? "none", backgroundRepeat: "repeat-y", backgroundSize: `${PW}px auto`, mixBlendMode: "overlay" }} />
        )}
        {beltKey === "black" && (
          <div style={{ position: "absolute", left: 0, width: "100%", height: 40, background: "linear-gradient(to bottom,transparent,rgba(245,213,118,0.95),transparent)", animation: "panel-spark 2s linear infinite" }} />
        )}
      </div>
      {/* Diagonal lines */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: .03, pointerEvents: "none" }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${i * 50}px`, width: 1, background: bc.border, transform: "skewX(-20deg)" }} />
        ))}
      </div>
      {/* Kanji watermark */}
      <div style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", fontFamily: "serif", fontSize: height * 1.1, color: bc.border, opacity: .055, fontWeight: 700, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
        {item.kanji}
      </div>
      {/* Right glow */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: `linear-gradient(to left,${aura.glowColor},transparent)`, opacity: .2, pointerEvents: "none" }} />
      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: height * 0.45, background: "linear-gradient(to bottom,transparent,rgba(0,0,0,0.7))", pointerEvents: "none" }} />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function StudentProfilePage() {
  const [profile] = useState<StudentProfile>(MOCK_PROFILE);

  // ── Load equipped cosmetics from store (localStorage) ──
  // Jab backend aaye: replace getEquipped() with API call inside useEffect

  const [avatarId] = useState(() => {
    if (typeof window === "undefined") return "avatar_white_s1";
    return getEquipped().avatarId;
  });

  const [bannerId] = useState(() => {
    if (typeof window === "undefined") return "banner_white_s1";
    return getEquipped().bannerId;
  });
  // ─────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const els = [heroRef.current, ...cardsRef.current].filter(Boolean) as HTMLDivElement[];
    els.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 50 + i * 60);
    });
  }, []);

  const beltMeta = BELT_META[profile.currentBelt];

  const age = (() => {
    const d = new Date(profile.dob);
    const now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) a--;
    return a;
  })();

  return (
    <div className="bg-[#030303] text-zinc-300 antialiased relative overflow-hidden font-sans">
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* Background ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-red-900/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-zinc-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Nav */}
      <nav className="mx-auto px-6 mb-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Player Card HUD</span>
        </div>
        <Link
          href="/profile/avatar"
          className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-red-400" /> Change Avatar
        </Link>
      </nav>

      <main className="mx-auto px-6 space-y-12 relative z-10">

        {/* ── Hero Card ── */}
        <div ref={heroRef} className="relative rounded-3xl border border-white/10 bg-[#09090B] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] group">

          {/* BANNER — from cosmeticsStore */}
          <div className="h-44 relative overflow-hidden border-b border-white/5">
            {mounted && <BannerRenderer bannerId={bannerId} height={176} />}
          </div>

          {/* Identity panel */}
          <div className="px-8 pb-8 relative z-10 -mt-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">

              {/* AVATAR — from cosmeticsStore */}
              <div className="relative flex-shrink-0 z-10">
                {mounted && <AvatarRenderer avatarId={avatarId} size={88} />}
              </div>

              {/* Name + status */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${profile.registrationStatus === "approved"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                    {profile.registrationStatus}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 text-xs text-zinc-400 font-medium tracking-wide">
                  <span className="bg-white/[0.04] border border-white/5 px-2.5 py-1 rounded-md text-zinc-300 flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5 text-red-500" /> {profile.dojo}
                  </span>
                  <span className="mx-2 text-zinc-700 hidden sm:inline">•</span>
                  <span className="text-zinc-400">Master: <strong className="text-zinc-200 font-semibold">{profile.instructorName}</strong></span>
                  <span className="mx-2 text-zinc-700 hidden sm:inline">•</span>
                  <span className="text-zinc-500 font-mono text-[11px]">ID: {profile.memberId}</span>
                </div>
              </div>
            </div>

            {/* Belt callout */}
            <div className="bg-black/60 border border-white/10 p-4 rounded-2xl flex items-center gap-4 self-center md:self-auto shadow-inner w-full sm:w-auto min-w-[200px]"
              style={{ boxShadow: `inset 0 0 20px ${beltMeta.glow}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg"
                style={{ borderColor: beltMeta.color, background: `${beltMeta.color}15` }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: beltMeta.color }} />
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">Current Tier</span>
                <span className="text-base font-black uppercase tracking-wide" style={{ color: beltMeta.color }}>{beltMeta.label}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="border-t border-white/5 bg-white/[0.01] grid grid-cols-2 sm:grid-cols-4 text-center">
            <div className="p-4 border-r border-white/5">
              <span className="block text-xl font-black text-white tracking-tight">{profile.beltHistory.length}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Tiers Cleared</span>
            </div>
            <div className="p-4 sm:border-r sm:border-white/5">
              <span className="block text-xl font-black text-white tracking-tight">{profile.achievements.length}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Achievements</span>
            </div>
            <div className="p-4 border-r border-white/5">
              <span className="block text-xs font-mono font-bold text-zinc-300 pt-1.5">{profile.joinedDate}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block mt-0.5">Enlisted</span>
            </div>
            <div className="p-4">
              <span className="block text-xl font-black text-white tracking-tight">{age} Yrs</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Age Bracket</span>
            </div>
          </div>
        </div>

        {/* ── Content grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left col */}
          <div className="lg:col-span-7 space-y-8">

            {/* Belt progression */}
            <div ref={(el) => { cardsRef.current[0] = el; }} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
                <Compass className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-black tracking-widest text-white uppercase">Belt Track Milestones</h3>
              </div>
              <div className="space-y-3">
                {BELT_ORDER.map((belt) => {
                  const meta = BELT_META[belt];
                  const entry = profile.beltHistory.find((h) => h.belt === belt);
                  const isNow = belt === profile.currentBelt;
                  return (
                    <div key={belt} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${entry ? "bg-white/[0.02] border-white/10 text-white" : "bg-transparent border-white/[0.02] text-zinc-600 opacity-40"
                      } ${isNow ? "!border-red-500/40 bg-red-500/[0.02]" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full shadow-md" style={{ backgroundColor: meta.color }} />
                        <span className="text-xs font-bold uppercase tracking-wider">{meta.label}</span>
                      </div>
                      <div className="text-right">
                        {entry
                          ? <span className="text-[11px] font-mono font-bold text-red-400">{entry.date}</span>
                          : <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-700">Locked</span>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div ref={(el) => { cardsRef.current[1] = el; }} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
                <Trophy className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-black tracking-widest text-white uppercase">Medals & Honors Vault</h3>
              </div>
              <div className="divide-y divide-white/5">
                {profile.achievements.map((ach) => {
                  const pos = POSITION_META[ach.position];
                  return (
                    <div key={ach.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0 group/row">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-xl p-1.5 bg-white/[0.02] border border-white/5 rounded-xl block">{pos.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white uppercase tracking-wide truncate group-hover/row:text-red-400 transition-colors">{ach.title}</p>
                          <p className="text-[11px] text-zinc-500 font-medium truncate mt-0.5">{ach.event} · <span className="text-zinc-600 font-mono">{ach.category}</span></p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-wider block" style={{ color: pos.color }}>{pos.label}</span>
                        <span className="text-[10px] font-mono text-zinc-600 block mt-0.5">{ach.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div className="lg:col-span-5 space-y-8">

            {/* Personal info */}
            <div ref={(el) => { cardsRef.current[2] = el; }} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                <h4 className="text-xs font-black tracking-widest text-zinc-400 uppercase">Core Dossier</h4>
              </div>
              <div className="space-y-3.5 text-[11px] font-medium uppercase tracking-wider">
                {[
                  { label: "Father Reference", value: profile.fatherName },
                  { label: "Mother Reference", value: profile.motherName },
                  { label: "Date of Entry", value: new Date(profile.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { label: "Vital Blood Type", value: profile.bloodGroup, red: true },
                  { label: "Comms Network", value: `+91 ${profile.mobileNumber}`, mono: true },
                  { label: "Comms Router", value: profile.email, mono: true },
                ].map(({ label, value, red, mono }) => (
                  <div key={label} className="flex justify-between items-baseline py-1.5 border-b border-white/[0.02] last:border-0">
                    <span className="text-zinc-500">{label}</span>
                    <span className={`text-right truncate max-w-[180px] ${red ? "text-red-400 font-black" : mono ? "text-zinc-400 font-mono tracking-normal lowercase" : "text-zinc-300 font-bold tracking-normal"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div ref={(el) => { cardsRef.current[3] = el; }} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <h4 className="text-xs font-black tracking-widest text-zinc-400 uppercase">Sector Boundaries</h4>
              </div>
              <div className="space-y-3 text-[11px] font-medium uppercase tracking-wider">
                {[
                  { label: "Dojo Grid Location", value: profile.address },
                  { label: "Provincial Node", value: profile.state },
                  { label: "Postal Index Core", value: profile.pinCode, mono: true },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex justify-between items-start gap-4 py-1 border-b border-white/[0.02] last:border-0">
                    <span className="text-zinc-500 flex-shrink-0">{label}</span>
                    <span className={`text-right font-bold tracking-normal normal-case ${mono ? "font-mono text-zinc-400" : "text-zinc-300"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div ref={(el) => { cardsRef.current[4] = el; }} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                <h4 className="text-xs font-black tracking-widest text-zinc-400 uppercase">System Ledger Clearances</h4>
              </div>
              <div className="space-y-2">
                {["Identity Verification Document", "Passport Profile Reference Image", "Belt Certification Document", "Signature Registry File"].map((doc) => (
                  <div key={doc} className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/[0.02]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide truncate">{doc}</span>
                    </div>
                    <span className="text-[9px] font-mono font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Verified</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 mt-16 text-center text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-700">
        © 2026 Dadi Bulsara Ashihara Karate Federation · Authentication Hub Secure
      </footer>
    </div>
  );
}