"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// ── Types ─────────────────────────────────────────────────────────────────────
type Belt = "Black" | "Red-Black" | "Red-White" | "Red";
type Rank = "Shodan" | "Nidan" | "Sandan" | "Yondan" | "Godan" | "Rokudan" | "Nanadan" | "Hachidan";

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  belt: Belt;
  rank: Rank;
  danGrade: number;
  state: string;
  photo?: string;
  yearsTraining: number;
  speciality: string;
  students: number;
  campsHosted: number;
  seminarsGiven: number;
  bio: string;
  achievements: string[];
  certifiedBy: string;
  dojoName: string;
  dojoLocation: string;
  phone: string;
  email: string;
}

// ── Sample data ───────────────────────────────────────────────────────────────
const SAMPLE_TEACHERS: Teacher[] = [
  {
    id: 1,
    firstName: "Dadi", lastName: "Bulsara",
    age: 52, belt: "Red-Black", rank: "Hachidan", danGrade: 8,
    state: "Maharashtra",
    yearsTraining: 34, speciality: "Sabaki",
    students: 48, campsHosted: 22, seminarsGiven: 65,
    bio: "Founder of the Indian chapter of Ashihara Karate. Trained directly under Hirokazu Kanazawa and has represented India at the World Ashihara Championships.",
    achievements: ["World Championship — Silver 1998", "National Champion 5x", "ISKA Certified Master Instructor"],
    certifiedBy: "International Ashihara Karate Organisation",
    dojoName: "Bulsara Ashihara Karate Dojo",
    dojoLocation: "Mumbai, Maharashtra",
    phone: "+91 98765 43210",
    email: "dadi@ashihara.in",
  },
  {
    id: 2,
    firstName: "Raj", lastName: "Nair",
    age: 38, belt: "Black", rank: "Yondan", danGrade: 4,
    state: "Kerala",
    yearsTraining: 20, speciality: "Kumite",
    students: 24, campsHosted: 8, seminarsGiven: 18,
    bio: "Head instructor of the Southern India chapter. Specialises in full-contact Kumite and has produced multiple national-level competitors.",
    achievements: ["National Champion 2x", "All India Open — Gold 2017", "Certified ISKA Instructor"],
    certifiedBy: "Dadi Bulsara Ashihara Karate",
    dojoName: "Nair Kumite Academy",
    dojoLocation: "Kochi, Kerala",
    phone: "+91 98765 43211",
    email: "raj@ashihara.in",
  },
  {
    id: 3,
    firstName: "Sunita", lastName: "Rao",
    age: 34, belt: "Black", rank: "Sandan", danGrade: 3,
    state: "Karnataka",
    yearsTraining: 16, speciality: "Kata",
    students: 18, campsHosted: 5, seminarsGiven: 12,
    bio: "One of the first women to earn Sandan in the Indian Ashihara circuit. Leads women's and junior programmes across Bangalore.",
    achievements: ["National Kata Champion 3x", "Youth Development Award 2021"],
    certifiedBy: "Dadi Bulsara Ashihara Karate",
    dojoName: "Sunita Rao Kata Dojo",
    dojoLocation: "Bangalore, Karnataka",
    phone: "+91 98765 43212",
    email: "sunita@ashihara.in",
  },
  {
    id: 4,
    firstName: "Arun", lastName: "Menon",
    age: 45, belt: "Red-White", rank: "Rokudan", danGrade: 6,
    state: "Tamil Nadu",
    yearsTraining: 26, speciality: "Sabaki",
    students: 35, campsHosted: 14, seminarsGiven: 40,
    bio: "Senior technical adviser and chief examiner for belt gradings in South India. Known for his precise Sabaki footwork seminars.",
    achievements: ["Asian Championship — Bronze 2002", "National Champion 4x", "Technical Excellence Award 2019"],
    certifiedBy: "International Ashihara Karate Organisation",
    dojoName: "Menon Technical Training Center",
    dojoLocation: "Chennai, Tamil Nadu",
    phone: "+91 98765 43213",
    email: "arun@ashihara.in",
  },
];

const ALL_STATES = [...new Set(SAMPLE_TEACHERS.map(t => t.state))].sort();
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const RANKS = ["Shodan", "Nidan", "Sandan", "Yondan", "Godan", "Rokudan", "Nanadan", "Hachidan"];

// ── Dan color system ──────────────────────────────────────────────────────────
const DAN_COLORS: Record<number, { ring: string; glow: string; badge: string; bg: string }> = {
  1: { ring: "#2255aa", glow: "rgba(34,85,170,0.5)", badge: "#1a3a6e", bg: "rgba(34,85,170,0.08)" },
  2: { ring: "#2255aa", glow: "rgba(34,85,170,0.5)", badge: "#1a3a6e", bg: "rgba(34,85,170,0.08)" },
  3: { ring: "#3a8c3a", glow: "rgba(58,140,58,0.4)", badge: "#2d6a2d", bg: "rgba(58,140,58,0.08)" },
  4: { ring: "#3a8c3a", glow: "rgba(58,140,58,0.4)", badge: "#2d6a2d", bg: "rgba(58,140,58,0.08)" },
  5: { ring: "#d4a800", glow: "rgba(245,197,24,0.4)", badge: "#f5c518", bg: "rgba(245,197,24,0.08)" },
  6: { ring: "#c9a84c", glow: "rgba(201,168,76,0.5)", badge: "#8b6914", bg: "rgba(201,168,76,0.12)" },
  7: { ring: "#c9a84c", glow: "rgba(201,168,76,0.5)", badge: "#8b6914", bg: "rgba(201,168,76,0.12)" },
  8: { ring: "#c9a84c", glow: "rgba(201,168,76,0.5)", badge: "#8b6914", bg: "rgba(201,168,76,0.12)" },
};

// ── Global Styles ────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes dan-glow { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.08); } }
  @keyframes ring-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes ring-pulse { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
  @keyframes banner-spark { 0% { top:-40px; opacity:0; } 30% { opacity:1; } 70% { opacity:1; } 100% { top:110%; opacity:0; } }
  @keyframes text-shimmer { 0% { opacity:0.6; } 50% { opacity:1; } 100% { opacity:0.6; } }
  input::placeholder { color:#333; }
  select option { background:#0d0d0d; }
  @media (max-width: 768px) {
    .hero-section, .filters-bar, .divider-bar, .teachers-grid { padding-left: 20px !important; padding-right: 20px !important; }
    .hero-bg-text { display: none !important; }
  }
`;

// ── Avatar with rotating dan rings (unique to teachers) ──────────────────────
function TeacherAvatarWithRings({ teacher }: { teacher: Teacher }) {
  const colors = DAN_COLORS[teacher.danGrade];
  const initials = teacher.firstName[0] + teacher.lastName[0];

  return (
    <div style={{ position: "relative", width: "110px", height: "110px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Outer rotating ring — dan-based color */}
      <div style={{
        position: "absolute", width: "134px", height: "134px", borderRadius: "50%",
        border: `2.5px solid ${colors.ring}`,
        boxShadow: `0 0 16px ${colors.glow}, inset 0 0 10px ${colors.glow}`,
        animationName: "ring-spin",
        animationDuration: "8s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      }} />

      {/* Middle pulsing ring — centered */}
      <div style={{
        position: "absolute", width: "98px", height: "98px", borderRadius: "50%",
        border: `1.5px solid ${colors.ring}`,
        opacity: 0.5,
        boxShadow: `0 0 8px ${colors.glow}`,
        animationName: "ring-pulse",
        animationDuration: "2.5s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
      }} />

      {/* Inner avatar */}
      {teacher.photo ? (
        <img src={teacher.photo} alt={teacher.firstName}
          style={{
            position: "relative", zIndex: 2,
            width: "88px", height: "88px", borderRadius: "50%", objectFit: "cover",
            border: `2.5px solid ${colors.ring}`,
            boxShadow: `0 0 18px ${colors.glow}77`,
          }} />
      ) : (
        <div style={{
          position: "relative", zIndex: 2,
          width: "88px", height: "88px", borderRadius: "50%",
          border: `2.5px solid ${colors.ring}`,
          background: colors.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-cinzel)", fontSize: "28px", fontWeight: 700,
          color: colors.ring,
          letterSpacing: "3px",
          boxShadow: `0 0 18px ${colors.glow}77`,
        }}>
          {initials}
        </div>
      )}

      {/* Decorative center dot */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: "8px", height: "8px", borderRadius: "50%",
        background: colors.ring,
        transform: "translate(-50%, -50%)",
        zIndex: 3,
        boxShadow: `0 0 10px ${colors.glow}`,
      }} />
    </div>
  );
}

// ── Dan rank badge with unique styling ─────────────────────────────────────────
function DanBadgeTeacher({ dan, rank }: { dan: number; rank: Rank }) {
  const colors = DAN_COLORS[dan];
  const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  return (
    <div style={{
      display: "inline-flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      width: "64px", height: "64px",
      border: `2.5px solid ${colors.ring}`,
      borderRadius: "6px",
      background: colors.bg,
      boxShadow: `0 0 14px ${colors.glow}`,
      animationName: "dan-glow",
      animationDuration: "2.8s",
      animationTimingFunction: "ease-in-out",
      animationIterationCount: "infinite",
    }}>
      <span style={{
        fontFamily: "var(--font-cinzel)", fontSize: "22px", fontWeight: 700,
        color: colors.ring, lineHeight: 1,
      }}>
        {ROMAN[dan]}
      </span>
      <span style={{
        fontFamily: "var(--font-montserrat)", fontSize: "9px",
        color: colors.ring, opacity: 0.8,
        letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px",
      }}>
        DAN
      </span>
    </div>
  );
}

// ── Epic banner — left side with particles ────────────────────────────────────
function TeacherBanner({ dan }: { dan: number }) {
  const colors = DAN_COLORS[dan];
  const gradient = dan >= 6
    ? "linear-gradient(180deg, #c9a84c 0%, #8b6914 50%, #c9a84c 100%)"
    : dan >= 3
      ? "linear-gradient(180deg, #3a8c3a 0%, #1e4a1e 50%, #3a8c3a 100%)"
      : "linear-gradient(180deg, #2255aa 0%, #0f2548 50%, #2255aa 100%)";

  return (
    <div style={{ position: "relative", width: "8px", flexShrink: 0, overflow: "hidden", borderRadius: "6px 0 0 6px" }}>
      {/* Main gradient */}
      <div style={{ position: "absolute", inset: 0, background: gradient, boxShadow: `4px 0 16px ${colors.glow}` }} />

      {/* Animated spark */}
      <div style={{
        position: "absolute", left: 0, width: "100%", height: "60px",
        background: `linear-gradient(to bottom, transparent, ${colors.ring}aa, transparent)`,
        animationName: "banner-spark",
        animationDuration: "2.5s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
      }} />
    </div>
  );
}

// ── Tag component ─────────────────────────────────────────────────────────────
function TagBadge({ label, icon }: { label: string; icon?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "5px 12px",
      border: "1px solid #2a2a2a",
      borderRadius: "4px",
      fontFamily: "var(--font-montserrat)", fontSize: "10px",
      letterSpacing: "1px", textTransform: "uppercase",
      color: "#666",
      background: "#0a0a0a",
    }}>
      {icon && <span style={{ fontSize: "12px" }}>{icon}</span>}
      {label}
    </span>
  );
}

// ── 4-sided legendary borders ─────────────────────────────────────────────────
function LegendaryCardBorders({ dan, isHovered }: { dan: number; isHovered?: boolean }) {
  const colors = DAN_COLORS[dan];
  const op1 = isHovered ? "cc" : "77";
  const op2 = isHovered ? "99" : "44";

  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, ${colors.ring}00, ${colors.ring}${op1}, ${colors.ring}00)`, zIndex: 4 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, ${colors.ring}00, ${colors.ring}${op2}, ${colors.ring}00)`, zIndex: 4 }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "1px", background: `linear-gradient(to bottom, ${colors.ring}00, ${colors.ring}${op1}, ${colors.ring}00)`, zIndex: 4 }} />
    </>
  );
}

// ── Teacher Card — Epic legendary design ──────────────────────────────────────
function TeacherCard({ teacher, onSelect }: { teacher: Teacher; onSelect: (id: number) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const colors = DAN_COLORS[teacher.danGrade];

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      backgroundColor: "#0f0f0f",
      boxShadow: `0 16px 48px rgba(0,0,0,0.8), 0 0 24px ${colors.glow}`,
      duration: 0.35, ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      backgroundColor: "#0a0a0a",
      boxShadow: `inset 0 0 16px ${colors.glow}15, 0 0 8px ${colors.glow}20`,
      duration: 0.28, ease: "power2.inOut",
    });
  };

  return (
    <div
      ref={cardRef}
      className="teacher-card"
      style={{
        position: "relative",
        background: "#0a0a0a",
        border: "1px solid transparent",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer",
        opacity: 0,
        visibility: "hidden",
        boxShadow: `inset 0 0 16px ${colors.glow}15, 0 0 8px ${colors.glow}20`,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(teacher.id)}
    >
      <LegendaryCardBorders dan={teacher.danGrade} isHovered={false} />
      <TeacherBanner dan={teacher.danGrade} />

      {/* Card content */}
      <div style={{ padding: "24px 24px 18px 18px", display: "flex", gap: "18px", alignItems: "flex-start", minWidth: 0 }}>
        {/* Left: Avatar + Dan badge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <TeacherAvatarWithRings teacher={teacher} />
          <DanBadgeTeacher dan={teacher.danGrade} rank={teacher.rank} />
        </div>

        {/* Center: Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Rank header */}
          <div style={{ marginBottom: "4px" }}>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "9px",
              letterSpacing: "2.5px", color: "#555", textTransform: "uppercase",
            }}>
              {teacher.rank} · {teacher.danGrade}{["st", "nd", "rd"][teacher.danGrade - 1] || "th"} Dan
            </span>
          </div>

          {/* Name */}
          <h2 style={{
            fontFamily: "var(--font-cinzel)", fontSize: "19px",
            fontWeight: 700, color: "#e0e0e0",
            letterSpacing: "1px", margin: "0 0 10px",
          }}>
            Sensei {teacher.firstName} {teacher.lastName}
          </h2>

          {/* Dojo info — NEW */}
          <div style={{ marginBottom: "10px", padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{
              fontFamily: "var(--font-montserrat)", fontSize: "11px",
              color: colors.ring, fontWeight: 600, marginBottom: "3px",
              letterSpacing: "0.5px",
            }}>
              📍 {teacher.dojoName}
            </div>
            <div style={{
              fontFamily: "var(--font-montserrat)", fontSize: "9px",
              color: "#666", letterSpacing: "0.5px",
            }}>
              {teacher.dojoLocation}
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
            <TagBadge label={teacher.speciality} icon="⚡" />
            <TagBadge label={`${teacher.yearsTraining} yrs`} icon="📅" />
            <TagBadge label={teacher.state} icon="🗺️" />
          </div>

          {/* Bio */}
          <p style={{
            fontFamily: "var(--font-cormorant)", fontSize: "13px",
            color: "#777", lineHeight: 1.5, fontStyle: "italic",
            margin: 0,
          }}>
            {teacher.bio}
          </p>
        </div>

        {/* Right: Stats */}
        <div style={{
          display: "flex", flexDirection: "column", gap: "12px",
          borderLeft: "1px solid #161616", paddingLeft: "18px",
          minWidth: "100px", flexShrink: 0,
        }}>
          <StatItem value={teacher.students} label="Students" />
          <StatItem value={teacher.campsHosted} label="Camps" />
          <StatItem value={teacher.seminarsGiven} label="Seminars" />
          <StatItem value={teacher.yearsTraining} label="Yrs Active" />
        </div>
      </div>

      {/* Achievements footer */}
      <div style={{
        borderTop: "1px solid #111", padding: "10px 24px",
        display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap",
        fontSize: "9px",
      }}>
        <span style={{
          fontFamily: "var(--font-montserrat)", fontSize: "8px",
          color: "#444", letterSpacing: "2px", textTransform: "uppercase",
          flexShrink: 0,
        }}>
          ⭐ Achievements
        </span>
        {teacher.achievements.map((a, i) => (
          <span key={i} style={{
            fontFamily: "var(--font-montserrat)", fontSize: "9px",
            color: colors.ring, opacity: 0.8,
            letterSpacing: "0.5px",
          }}>
            {i > 0 && <span style={{ color: "#222", marginRight: "8px" }}>·</span>}
            {a}
          </span>
        ))}
      </div>

      {/* Contact info footer */}
      <div style={{
        borderTop: "1px solid #111", padding: "10px 24px",
        display: "flex", gap: "16px", flexWrap: "wrap",
        fontFamily: "var(--font-montserrat)", fontSize: "9px",
        color: "#555",
      }}>
        <div>📧 {teacher.email}</div>
        <div>📱 {teacher.phone}</div>
        <div style={{ marginLeft: "auto" }}>Certified by <span style={{ color: colors.ring }}>{teacher.certifiedBy}</span></div>
      </div>

      {/* Click to view full profile hint */}
      <div style={{
        position: "absolute", bottom: "8px", right: "12px",
        fontFamily: "var(--font-montserrat)", fontSize: "8px",
        color: "#444", letterSpacing: "1px", textTransform: "uppercase",
        animationName: "text-shimmer",
        animationDuration: "2s",
        animationIterationCount: "infinite",
      }}>
        Click for details →
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div style={{
        fontFamily: "var(--font-cinzel)", fontSize: "18px",
        fontWeight: 700, color: "#bbb", lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontFamily: "var(--font-montserrat)", fontSize: "8px",
        color: "#444", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "2px",
      }}>{label}</div>
    </div>
  );
}

// ── Header Stat ───────────────────────────────────────────────────────────────
function HeaderStat({ value, label, gold }: { value: number; label: string; gold?: boolean }) {
  return (
    <div style={{ flex: 1, padding: "16px 24px", borderRight: "1px solid #1a1a1a", background: gold ? "#0d0d0d" : "#080808" }}>
      <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "32px", fontWeight: 700, color: gold ? "#c9a84c" : "#e8e8e8", lineHeight: 1, marginBottom: "5px" }}>
        {value}
      </div>
      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#444", letterSpacing: "2px", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [stateFilter, setStateFilter] = useState("All");
  const [rankFilter, setRankFilter] = useState("All");

  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return SAMPLE_TEACHERS.filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        t.speciality.toLowerCase().includes(q) ||
        t.dojoName.toLowerCase().includes(q);
      const matchState = stateFilter === "All" || t.state === stateFilter;
      const matchRank = rankFilter === "All" || t.rank === rankFilter;
      return matchSearch && matchState && matchRank;
    });
  }, [search, stateFilter, rankFilter]);

  const totalStudents = SAMPLE_TEACHERS.reduce((a, t) => a + t.students, 0);
  const totalSeminars = SAMPLE_TEACHERS.reduce((a, t) => a + t.seminarsGiven, 0);

  const handleTeacherSelect = (id: number) => {
    router.push(`/teacher/${id}`);
    // Iska implementation aage: router.push(`/teacher/${id}`)
  };

  // Initial load animation
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
      ".teacher-card",
      { opacity: 0, y: 30, scale: 0.98, autoAlpha: 0 },
      { opacity: 1, y: 0, scale: 1, autoAlpha: 1, duration: 0.7, stagger: 0.12, ease: "power2.out", onComplete: () => ScrollTrigger.refresh() },
      "-=0.4"
    );
  }, []);

  // ScrollTrigger on filter change
  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    document.querySelectorAll(".teacher-card").forEach(card => {
      gsap.fromTo(card,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power1.out",
          scrollTrigger: {
            trigger: card, start: "top 95%", end: "top 88%",
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
          SENSEI
        </div>

        <div ref={headerRef}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "32px", height: "1px", background: "#555" }} />
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "5px", color: "#555", textTransform: "uppercase" }}>
              Dadi Bulsara Ashihara Karate · Master Instructors
            </span>
          </div>

          {/* Title + tagline */}
          <div>
            <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(10px,1.2vw,14px)", fontWeight: 300, letterSpacing: "10px", color: "#3a3a3a", marginBottom: "8px", textTransform: "uppercase" }}>
              Keepers of
            </div>
            <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(52px,7vw,96px)", fontWeight: 900, color: "#e8e8e8", letterSpacing: "8px", textTransform: "uppercase", margin: "0 0 16px", lineHeight: 0.88 }}>
              Sabaki
            </h1>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px", color: "#555", fontStyle: "italic", margin: "0 0 24px", maxWidth: "700px" }}>
              The lineage of knowledge — each instructor a guardian of the ancient way. Click any card to explore their dojo and teachings.
            </p>
            <div>
              <Link href="/teacher/registration" style={{ display: "inline-block", marginRight: "12px" }}>
              
              <button style={{ background: "#c9a84c", border: "none", color: "#000", padding: "12px 32px", borderRadius: "4px", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}>Register as an Instructor</button>
              </Link>
            </div>
          </div>

          {/* Stats panel */}
          <div style={{ display: "flex", border: "1px solid #1a1a1a", borderRadius: "4px", overflow: "hidden", minWidth: "380px", marginTop: "20px" }}>
            <HeaderStat value={SAMPLE_TEACHERS.length} label="Instructors" />
            <HeaderStat value={totalStudents} label="Total Students" />
            <HeaderStat value={SAMPLE_TEACHERS.filter(t => t.danGrade >= 6).length} label="Senior Dan" gold />
            <div style={{ flex: 1, padding: "16px 24px", background: "#0d0d0d", borderLeft: "1px solid #1a1a1a" }}>
              <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "32px", fontWeight: 700, color: "#c9a84c", lineHeight: 1, marginBottom: "5px" }}>
                {totalSeminars}
              </div>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#444", letterSpacing: "2px", textTransform: "uppercase" }}>
                Seminars
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
            placeholder="Search by name, speciality, or dojo…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 12px 10px 34px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "3px", color: "#ccc", fontFamily: "var(--font-montserrat)", fontSize: "11px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={{ padding: "10px 14px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "3px", color: "#888", fontFamily: "var(--font-montserrat)", fontSize: "11px", letterSpacing: "1px", cursor: "pointer", outline: "none" }}>
          <option value="All">All States</option>
          {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={rankFilter} onChange={e => setRankFilter(e.target.value)} style={{ padding: "10px 14px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "3px", color: "#888", fontFamily: "var(--font-montserrat)", fontSize: "11px", letterSpacing: "1px", cursor: "pointer", outline: "none" }}>
          <option value="All">All Ranks</option>
          {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#444", letterSpacing: "1px", whiteSpace: "nowrap", marginLeft: "auto" }}>
          {filtered.length} instructor{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── TEACHERS LIST ── */}
      <div className="teachers-grid" style={{
        padding: "28px 56px 100px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "80px 0", textAlign: "center", fontFamily: "var(--font-cormorant)", fontSize: "20px", color: "#333", fontStyle: "italic" }}>
            No instructors match your search.
          </div>
        ) : (
          filtered.map(t => <TeacherCard key={t.id} teacher={t} onSelect={handleTeacherSelect} />)
        )}
      </div>
    </div>
  );
}