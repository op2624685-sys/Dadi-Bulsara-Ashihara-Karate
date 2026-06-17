"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { 
  Trophy, Award, Calendar, Shield, Swords, User, MapPin, 
  Phone, Mail, Fingerprint, Heart, Compass, FileText, Sparkles 
} from "lucide-react";

// ─────────────────────────────────────────────
// System Types & Configurations
// ─────────────────────────────────────────────
type Belt = "white" | "yellow" | "orange" | "green" | "blue" | "purple" | "brown" | "black";

interface BeltHistoryEntry {
  belt: Belt;
  date: string;
  instructor: string;
  location: string;
}

interface Achievement {
  id: string;
  title: string;
  event: string;
  date: string;
  position: "gold" | "silver" | "bronze" | "participation";
  category: string;
}

interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  memberId: string;
  joinedDate: string;
  fatherName: string;
  motherName: string;
  dob: string;
  bloodGroup: string;
  mobileNumber: string;
  address: string;
  state: string;
  pinCode: string;
  currentBelt: Belt;
  instructorName: string;
  dojo: string;
  registrationStatus: "pending" | "approved" | "rejected";
  avatarInitials: string;
  beltHistory: BeltHistoryEntry[];
  achievements: Achievement[];
}

const MOCK_PROFILE: StudentProfile = {
  firstName: "Arjun",
  lastName: "Sharma",
  email: "arjun.sharma@email.com",
  memberId: "BKF-2024-00847",
  joinedDate: "March 2024",
  fatherName: "Rajesh Sharma",
  motherName: "Sunita Sharma",
  dob: "2005-08-14",
  bloodGroup: "B+",
  mobileNumber: "9876543210",
  address: "House No. 12, Patliputra Colony",
  state: "Bihar",
  pinCode: "800013",
  currentBelt: "yellow",
  instructorName: "Sensei Vikram Singh",
  dojo: "Patna Central Dojo",
  registrationStatus: "approved",
  avatarInitials: "AS",
  beltHistory: [
    { belt: "white",  date: "Mar 2024", instructor: "Sensei Vikram Singh", location: "Patna Central Dojo" },
    { belt: "yellow", date: "Aug 2024", instructor: "Sensei Vikram Singh", location: "Patna Central Dojo" },
  ],
  achievements: [
    { id: "1", title: "State Kata Championship", event: "Bihar Karate State Open 2024", date: "Oct 2024", position: "silver", category: "Kata · Under-19" },
    { id: "2", title: "District Kumite Cup", event: "Patna District Meet 2024", date: "Jul 2024", position: "gold", category: "Kumite · -55 kg" },
    { id: "3", title: "Federation Grading Camp", event: "BKF Summer Camp 2024", date: "Jun 2024", position: "participation", category: "Training" },
  ],
};

const BELT_META: Record<Belt, { color: string; label: string; glow: string }> = {
  white:  { color: "#FFFFFF", label: "White Belt", glow: "rgba(255,255,255,0.15)" },
  yellow: { color: "#FBBF24", label: "Yellow Belt", glow: "rgba(251,191,36,0.3)" },
  orange: { color: "#F97316", label: "Orange Belt", glow: "rgba(249,115,22,0.3)" },
  green:  { color: "#16A34A", label: "Green Belt", glow: "rgba(22,163,74,0.3)" },
  blue:   { color: "#2563EB", label: "Blue Belt", glow: "rgba(37,99,235,0.3)" },
  purple: { color: "#7C3AED", label: "Purple Belt", glow: "rgba(124,58,237,0.3)" },
  brown:  { color: "#92400E", label: "Brown Belt", glow: "rgba(146,64,14,0.3)" },
  black:  { color: "#EF4444", label: "Black Belt", glow: "rgba(239,68,68,0.4)" },
};

const BELT_ORDER: Belt[] = ["white", "yellow", "orange", "green", "blue", "purple", "brown", "black"];

const POSITION_META = {
  gold:  { icon: "🥇", label: "1st Place", color: "#F59E0B" },
  silver: { icon: "🥈", label: "2nd Place", color: "#9CA3AF" },
  bronze: { icon: "🥉", label: "3rd Place", color: "#B45309" },
  participation: { icon: "🎖️", label: "Participant", color: "#6B7280" },
};

export default function StudentProfilePage() {
  const [profile] = useState<StudentProfile>(MOCK_PROFILE);
  
  // COSMETICS CONFIGURATION SYNC STATES
  // Tie these directly to database hooks or storage context variables to reflect updates dynamically
  const [equippedAvatarColor, setEquippedAvatarColor] = useState(BELT_META[profile.currentBelt].color);
  const [equippedBannerBg, setEquippedBannerBg] = useState("#BE0027"); 

  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = [heroRef.current, ...cardsRef.current].filter(Boolean) as HTMLDivElement[];
    els.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
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
      
      {/* HOLOGRAPHIC BACKGROUND AMBIENCE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-red-900/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-zinc-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* GLOBAL PROFILE HUD ACTION BAR */}
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

        {/* ====================================================================
            PRIMARY INTERACTIVE HERO CARD (GAMING LAYOUT COMPONENT)
            ==================================================================== */}
        <div 
          ref={heroRef}
          className="relative rounded-3xl border border-white/10 bg-[#09090B] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] group"
        >
          {/* CUSTOMIZABLE BACKGROUND BANNER STRIP */}
          <div className="h-44 relative overflow-hidden flex items-end border-b border-white/5 bg-gradient-to-r from-zinc-900 via-neutral-950 to-zinc-900">
            <div 
              className="absolute inset-0 opacity-20 mix-blend-color-dodge transition-all duration-700"
              style={{ backgroundColor: equippedBannerBg }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none" />
            <div className="absolute bottom-4 right-6 text-[9px] font-mono tracking-[0.3em] text-zinc-600 font-bold select-none opacity-40">
              {"// ASHIHARA_DOJO_CLIENT"}
            </div>
          </div>

          {/* MAIN IDENTIFIERS INNER OVERLAP PANEL */}
          <div className="px-8 pb-8 relative z-10 -mt-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              {/* CUSTOMIZABLE USER AVATAR FRAME SYSTEM */}
              <div className="relative flex-shrink-0">
                <div 
                  className="absolute -inset-3 rounded-full border border-dashed opacity-20 animate-[spin_20s_linear_infinite]"
                  style={{ borderColor: equippedAvatarColor }}
                />
                <div 
                  className="absolute -inset-1.5 rounded-full blur-md opacity-40 transition-opacity duration-500 group-hover:opacity-60"
                  style={{ backgroundColor: equippedAvatarColor }}
                />
                <div 
                  className="relative w-24 h-24 rounded-full bg-black border-2 flex items-center justify-center overflow-hidden shadow-2xl z-10"
                  style={{ borderColor: equippedAvatarColor }}
                >
                  <span className="text-3xl font-black tracking-tight text-white">{profile.avatarInitials}</span>
                </div>
              </div>

              {/* CHARACTER IDENTITY TRACKS */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                    profile.registrationStatus === "approved" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                    {profile.registrationStatus}
                  </span>
                </div>

                {/* CLAN / GUILD SPECIFICATIONS STRIP */}
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

            {/* HIGH-CONTROST HUD CALLOUT FOR CURRENT RANK STATUS */}
            <div 
              className="bg-black/60 border border-white/10 p-4 rounded-2xl flex items-center gap-4 self-center md:self-auto shadow-inner w-full sm:w-auto min-w-[200px]"
              style={{ boxShadow: `inset 0 0 20px ${beltMeta.glow}` }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg"
                style={{ borderColor: beltMeta.color, background: `${beltMeta.color}15` }}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: beltMeta.color }} />
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">Current Tier</span>
                <span className="text-base font-black uppercase text-white tracking-wide" style={{ color: beltMeta.color }}>
                  {beltMeta.label}
                </span>
              </div>
            </div>
          </div>

          {/* QUICK HERO DASHBOARD PERFORMANCE COUNTERS */}
          <div className="border-t border-white/5 bg-white/[0.01] grid grid-cols-2 sm:grid-cols-4 division-x division-white/5 text-center">
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


        {/* ====================================================================
            SECONDARY ROW LAYER (CLEAN MATRIX TEXT LAYOUT WITH DEEMPHASIZED VALUES)
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COMBAT TACTICS AND HISTORY (LEFT COLUMN COMPONENT HUB) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* TIER TIMELINE PROGRESSION LIST */}
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
                    <div 
                      key={belt} 
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        entry 
                          ? "bg-white/[0.02] border-white/10 text-white" 
                          : "bg-transparent border-white/[0.02] text-zinc-600 opacity-40"
                      } ${isNow ? "!border-red-500/40 bg-red-500/[0.02]" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full shadow-md" style={{ backgroundColor: meta.color }} />
                        <span className="text-xs font-bold uppercase tracking-wider">{meta.label}</span>
                      </div>
                      <div className="text-right">
                        {entry ? (
                          <span className="text-[11px] font-mono font-bold text-red-400">{entry.date}</span>
                        ) : (
                          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-700">Locked</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COMBAT RECORDS & TOURNAMENT CERTIFICATES */}
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

          {/* LOWER DEEMPHASIZED DATA DECK (RIGHT COLUMN COMPONENT HUB) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* PERSONAL METADATA STRIP */}
            <div ref={(el) => { cardsRef.current[2] = el; }} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                <h4 className="text-xs font-black tracking-widest text-zinc-400 uppercase">Core Dossier</h4>
              </div>

              <div className="space-y-3.5 text-[11px] font-medium uppercase tracking-wider">
                <div className="flex justify-between items-baseline py-1.5 border-b border-white/[0.02]">
                  <span className="text-zinc-500">Father Reference</span>
                  <span className="text-zinc-300 font-bold tracking-normal text-right">{profile.fatherName}</span>
                </div>
                <div className="flex justify-between items-baseline py-1.5 border-b border-white/[0.02]">
                  <span className="text-zinc-500">Mother Reference</span>
                  <span className="text-zinc-300 font-bold tracking-normal text-right">{profile.motherName}</span>
                </div>
                <div className="flex justify-between items-baseline py-1.5 border-b border-white/[0.02]">
                  <span className="text-zinc-500">Date of Entry</span>
                  <span className="text-zinc-300 font-mono text-right">{new Date(profile.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between items-baseline py-1.5 border-b border-white/[0.02]">
                  <span className="text-zinc-500">Vital Blood Type</span>
                  <span className="text-red-400 font-black text-right">{profile.bloodGroup}</span>
                </div>
                <div className="flex justify-between items-baseline py-1.5 border-b border-white/[0.02]">
                  <span className="text-zinc-500">Comms Network</span>
                  <span className="text-zinc-300 font-mono tracking-normal text-right">+91 {profile.mobileNumber}</span>
                </div>
                <div className="flex justify-between items-baseline py-1.5">
                  <span className="text-zinc-500">Comms Router</span>
                  <span className="text-zinc-400 font-mono tracking-normal text-right lowercase truncate max-w-[180px]">{profile.email}</span>
                </div>
              </div>
            </div>

            {/* RADAR ADDRESS ROUTING CORES */}
            <div ref={(el) => { cardsRef.current[3] = el; }} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <h4 className="text-xs font-black tracking-widest text-zinc-400 uppercase">Sector Boundaries</h4>
              </div>

              <div className="space-y-3 text-[11px] font-medium uppercase tracking-wider">
                <div className="flex justify-between items-start gap-4 py-1 border-b border-white/[0.02]">
                  <span className="text-zinc-500 flex-shrink-0">Dojo Grid Location</span>
                  <span className="text-zinc-300 text-right font-bold tracking-normal normal-case">{profile.address}</span>
                </div>
                <div className="flex justify-between items-baseline py-1 border-b border-white/[0.02]">
                  <span className="text-zinc-500">Provincial Node</span>
                  <span className="text-zinc-300 font-bold text-right">{profile.state}</span>
                </div>
                <div className="flex justify-between items-baseline py-1">
                  <span className="text-zinc-500">Postal Index Core</span>
                  <span className="text-zinc-400 font-mono text-right">{profile.pinCode}</span>
                </div>
              </div>
            </div>

            {/* IDENTITY VERIFICATION RECORDS STATUS */}
            <div ref={(el) => { cardsRef.current[4] = el; }} className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                <h4 className="text-xs font-black tracking-widest text-zinc-400 uppercase">System Ledger Clearances</h4>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Identity Verification Document", status: "Verified" },
                  { label: "Passport Profile Reference Image", status: "Verified" },
                  { label: "Belt Certification Document", status: "Verified" },
                  { label: "Signature Registry File", status: "Verified" },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/[0.02]">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide truncate">{doc.label}</span>
                    </div>
                    <span className="text-[9px] font-mono font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* CLIENT FOOTER FOOTPRINT */}
      <footer className="max-w-6xl mx-auto px-6 mt-16 text-center text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-700">
        © 2026 Dadi Bulsara Ashihara Karate Federation · Authentication Hub Secure
      </footer>
    </div>
  );
}