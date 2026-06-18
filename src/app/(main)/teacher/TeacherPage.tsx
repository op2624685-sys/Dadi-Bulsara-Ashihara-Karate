"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Types ─────────────────────────────────────────────────────────────────────
type Belt = "Black" | "Red-Black" | "Red-White" | "Red";
type Rank = "Shodan" | "Nidan" | "Sandan" | "Yondan" | "Godan" | "Rokudan" | "Nanadan" | "Hachidan";

interface Teacher {
  id:            number;
  firstName:     string;
  lastName:      string;
  age:           number;
  belt:          Belt;
  rank:          Rank;
  danGrade:      number;
  state:         string;
  photo?:        string;
  yearsTraining: number;
  speciality:    string;
  students:      number;
  campsHosted:   number;
  seminarsGiven: number;
  bio:           string;
  achievements:  string[];
  certifiedBy:   string;
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
  },
];

const ALL_STATES = [...new Set(SAMPLE_TEACHERS.map(t => t.state))].sort();
const ROMAN = ["","I","II","III","IV","V","VI","VII","VIII"];

// ── Dan badge ─────────────────────────────────────────────────────────────────
function DanBadge({ dan, rank }: { dan: number; rank: Rank }) {
  const isHighDan = dan >= 6;
  return (
    <div style={{
      display: "inline-flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      width: "52px", height: "52px",
      border: `2px solid ${isHighDan ? "#c9a84c" : "#444"}`,
      borderRadius: "3px",
      background: isHighDan ? "rgba(201,168,76,0.08)" : "transparent",
    }}>
      <span style={{
        fontFamily: "var(--font-cinzel)", fontSize: "15px", fontWeight: 700,
        color: isHighDan ? "#c9a84c" : "#888", lineHeight: 1,
      }}>
        {ROMAN[dan]}
      </span>
      <span style={{
        fontFamily: "var(--font-montserrat)", fontSize: "7px",
        color: isHighDan ? "#8b6914" : "#444",
        letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px",
      }}>
        DAN
      </span>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function TeacherAvatar({ teacher }: { teacher: Teacher }) {
  const isHighDan = teacher.danGrade >= 6;
  const borderColor = isHighDan ? "#c9a84c" : "#333";
  if (teacher.photo) {
    return (
      <img src={teacher.photo} alt={teacher.firstName}
        style={{ width:80, height:80, borderRadius:"50%", objectFit:"cover",
          border:`2px solid ${borderColor}`, flexShrink:0 }} />
    );
  }
  return (
    <div style={{
      width:80, height:80, borderRadius:"50%", flexShrink:0,
      border:`2px solid ${borderColor}`,
      background:"#0d0d0d",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"var(--font-cinzel)", fontSize:"22px", fontWeight:700,
      color: isHighDan ? "#c9a84c" : "#555",
      letterSpacing:"2px",
    }}>
      {teacher.firstName[0]}{teacher.lastName[0]}
    </div>
  );
}

// ── Speciality tag ────────────────────────────────────────────────────────────
function SpecialityTag({ label }: { label: string }) {
  return (
    <span style={{
      padding:"3px 10px",
      border:"1px solid #2a2a2a",
      borderRadius:"2px",
      fontFamily:"var(--font-montserrat)", fontSize:"9px",
      letterSpacing:"2px", textTransform:"uppercase",
      color:"#666",
    }}>
      {label}
    </span>
  );
}

// ── Teacher Card ──────────────────────────────────────────────────────────────
function TeacherCard({ teacher }: { teacher: Teacher }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isHighDan = teacher.danGrade >= 6;

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      borderColor: isHighDan ? "#c9a84c" : "#3a3a3a",
      boxShadow: isHighDan ? "0 10px 30px rgba(201,168,76,0.15)" : "0 10px 25px rgba(0,0,0,0.6)",
      backgroundColor: "#0d0d0d",
      scale: 1.01,
      duration: 0.35,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      borderColor: isHighDan ? "rgba(201,168,76,0.2)" : "#181818",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      backgroundColor: "#080808",
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div 
      ref={cardRef}
      className="teacher-card"
      style={{
        background: "#080808",
        border: `1px solid ${isHighDan ? "rgba(201,168,76,0.2)" : "#181818"}`,
        borderRadius: "4px",
        overflow: "hidden",
        opacity: 0,
        visibility: "hidden",
        transform: "translateX(-45px) scale(0.96)" 
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHighDan && (
        <div style={{ height:"2px", background:"linear-gradient(to right,#c9a84c,#8b6914,transparent)" }} />
      )}

      <div style={{ padding:"28px 28px 20px", display:"flex", gap:"24px", flexWrap:"wrap" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
          <TeacherAvatar teacher={teacher} />
          <DanBadge dan={teacher.danGrade} rank={teacher.rank} />
        </div>

        <div style={{ flex:1, minWidth:"200px" }}>
          <div style={{ marginBottom:"6px" }}>
            <span style={{
              fontFamily:"var(--font-montserrat)", fontSize:"10px",
              letterSpacing:"3px", color:"#444", textTransform:"uppercase",
            }}>
              {teacher.rank} · {teacher.danGrade}{["st","nd","rd"][teacher.danGrade-1]||"th"} Dan
            </span>
          </div>
          <h2 style={{
            fontFamily:"var(--font-cinzel)", fontSize:"22px",
            fontWeight:700, color: isHighDan ? "#dfd4a8" : "#e0e0e0",
            letterSpacing:"1px", margin:"0 0 10px",
          }}>
            Sensei {teacher.firstName} {teacher.lastName}
          </h2>

          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"14px" }}>
            <SpecialityTag label={teacher.speciality} />
            <SpecialityTag label={teacher.state} />
            <SpecialityTag label={`${teacher.yearsTraining} yrs`} />
          </div>

          <p style={{
            fontFamily:"var(--font-cormorant)", fontSize:"15px",
            color:"#666", lineHeight:1.7, fontStyle:"italic",
            margin:0,
            display: expanded ? "block" : "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : 2,
            WebkitBoxOrient: "vertical",
            overflow: expanded ? "visible" : "hidden",
          }}>
            {teacher.bio}
          </p>
        </div>

        <div style={{
          display:"flex", flexDirection:"column", gap:"16px",
          borderLeft:"1px solid #161616", paddingLeft:"24px",
          minWidth:"130px",
        }}>
          <TeacherStat value={teacher.students}      label="Students" />
          <TeacherStat value={teacher.campsHosted}   label="Camps Hosted" />
          <TeacherStat value={teacher.seminarsGiven} label="Seminars" />
          <TeacherStat value={teacher.yearsTraining} label="Years Active" />
        </div>
      </div>

      <div style={{
        borderTop:"1px solid #111", padding:"14px 28px",
        display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap",
      }}>
        <span style={{
          fontFamily:"var(--font-montserrat)", fontSize:"9px",
          color:"#444", letterSpacing:"2px", textTransform:"uppercase",
          flexShrink:0,
        }}>
          Achievements
        </span>
        {teacher.achievements.map((a, i) => (
          <span key={i} style={{
            fontFamily:"var(--font-montserrat)", fontSize:"10px",
            color: isHighDan ? "#8b6914" : "#555",
            letterSpacing:"0.5px",
          }}>
            {i > 0 && <span style={{ color:"#222", marginRight:"12px" }}>·</span>}
            {a}
          </span>
        ))}
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            marginLeft:"auto", background:"none", border:"none",
            fontFamily:"var(--font-montserrat)", fontSize:"10px",
            color:"#444", letterSpacing:"1px", cursor:"pointer",
            textTransform:"uppercase", padding:0,
          }}
        >
          {expanded ? "Less ↑" : "More ↓"}
        </button>
      </div>

      {expanded && (
        <div style={{
          borderTop:"1px solid #111", padding:"14px 28px",
          fontFamily:"var(--font-montserrat)", fontSize:"10px",
          color:"#444", letterSpacing:"1px",
        }}>
          CERTIFIED BY &nbsp;
          <span style={{ color:"#666" }}>{teacher.certifiedBy}</span>
        </div>
      )}
    </div>
  );
}

function TeacherStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div style={{
        fontFamily:"var(--font-cinzel)", fontSize:"22px",
        fontWeight:700, color:"#ccc", lineHeight:1,
      }}>{value}</div>
      <div style={{
        fontFamily:"var(--font-montserrat)", fontSize:"9px",
        color:"#444", letterSpacing:"1.5px", textTransform:"uppercase", marginTop:"3px",
      }}>{label}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherPage() {
  const [search,      setSearch]      = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [rankFilter,  setRankFilter]  = useState("All");

  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return SAMPLE_TEACHERS.filter(t => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q)  ||
        t.speciality.toLowerCase().includes(q);
      const matchState = stateFilter === "All" || t.state === stateFilter;
      const matchRank  = rankFilter  === "All" || t.rank  === rankFilter;
      return matchSearch && matchState && matchRank;
    });
  }, [search, stateFilter, rankFilter]);

  const totalStudents = SAMPLE_TEACHERS.reduce((a, t) => a + t.students, 0);

  // Master Orchestration Sequence: Page Load + List Sequential Entrance Anim
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // 1. Pure page base alpha reveal
    gsap.to(".page-wrap", { opacity: 1, duration: 0.4 });

    // 2. Header details cinematic blur slide
    if (headerRef.current) {
      tl.fromTo(headerRef.current.children,
        { opacity: 0, y: 20, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.1 }
      );
    }
    
    // 3. Filter control panels reveal
    tl.fromTo(filterRef.current, 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.5 }, 
      "-=0.5"
    );

    // 4. MAIN FIX: Page load hote hi starting lists premium flow me staggered trigger hongi
    tl.fromTo(".teacher-card", 
      {
        opacity: 0,
        x: -45,
        scale: 0.96,
        autoAlpha: 0
      },
      {
        opacity: 1, 
        x: 0, 
        scale: 1,
        autoAlpha: 1,
        duration: 0.7, 
        stagger: 0.12, // Ek ke baad ek card smooth aayega
        ease: "power2.out",
        onComplete: () => {
          // Jab entry animation complete ho jaye, tab dynamic ScrollTriggers active ho jayein
          ScrollTrigger.refresh();
        }
      },
      "-=0.3"
    );
  }, []);

  // Scroll Trigger Engine: List scrolling updates + Top Exit Control
  useEffect(() => {
    // Purane scroll instance clean karenge taki filters lagne pr page crash ya jumps na ho
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const cards = document.querySelectorAll(".teacher-card");
    
    if (cards.length > 0) {
      cards.forEach((card) => {
        gsap.fromTo(card,
          { 
            opacity: 0, 
            x: -45,            
            scale: 0.96        
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 94%",       // 4 cards load space trigger setup
              end: "top 94%",          // Top navigation clearance escape
              toggleActions: "play reverse none reverse", 
              scrub: 0.4,             // Realtime sync transition mapping
              invalidateOnRefresh: true
            }
          }
        );
      });
    }
  }, [filtered]);

  return (
    <div className="page-wrap" style={{ minHeight:"100vh", background:"#050505", paddingTop:"80px", opacity: 0 }}>

      {/* Header */}
      <div ref={headerRef} style={{ borderBottom:"1px solid #111", padding:"48px 40px 32px", maxWidth:"1000px", margin:"0 auto" }}>
        <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"11px", letterSpacing:"4px", color:"#555", textTransform:"uppercase", marginBottom:"12px" }}>
          Dadi Bulsara Ashihara Karate
        </p>
        <h1 style={{ fontFamily:"var(--font-cinzel)", fontSize:"clamp(32px,5vw,52px)", fontWeight:700, color:"#e8e8e8", letterSpacing:"3px", textTransform:"uppercase", margin:"0 0 8px" }}>
          Instructors
        </h1>
        <p style={{ fontFamily:"var(--font-cormorant)", fontSize:"17px", color:"#555", fontStyle:"italic", margin:"8px 0 20px" }}>
          The lineage of knowledge — each instructor a guardian of the Sabaki way.
        </p>
        <div style={{ display:"flex", gap:"32px", flexWrap:"wrap" }}>
          <HeaderStat value={SAMPLE_TEACHERS.length} label="Instructors" />
          <HeaderStat value={totalStudents}           label="Total Students" />
          <HeaderStat value={SAMPLE_TEACHERS.filter(t=>t.danGrade>=6).length} label="Senior Dan" />
          <HeaderStat value={SAMPLE_TEACHERS.reduce((a,t)=>a+t.seminarsGiven,0)} label="Seminars Given" />
        </div>
      </div>

      {/* Search + filters */}
      <div ref={filterRef} style={{ padding:"24px 40px", maxWidth:"1000px", margin:"0 auto", display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:"1", minWidth:"220px" }}>
          <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"#444", fontSize:"14px", pointerEvents:"none" }}>⌕</span>
          <input
            type="text"
            placeholder="Search by name or speciality…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"10px 14px 10px 36px", background:"#0d0d0d", border:"1px solid #222", borderRadius:"3px", color:"#ccc", fontFamily:"var(--font-montserrat)", fontSize:"12px", outline:"none", boxSizing:"border-box" }}
          />
        </div>

        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} style={{ padding:"10px 14px", background:"#0d0d0d", border:"1px solid #222", borderRadius:"3px", color:"#888", fontFamily:"var(--font-montserrat)", fontSize:"11px", letterSpacing:"1px", cursor:"pointer", outline:"none" }}>
          <option value="All">All States</option>
          {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={rankFilter} onChange={e => setRankFilter(e.target.value)} style={{ padding:"10px 14px", background:"#0d0d0d", border:"1px solid #222", borderRadius:"3px", color:"#888", fontFamily:"var(--font-montserrat)", fontSize:"11px", letterSpacing:"1px", cursor:"pointer", outline:"none" }}>
          <option value="All">All Ranks</option>
          {["Shodan","Nidan","Sandan","Yondan","Godan","Rokudan","Nanadan","Hachidan"].map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <span style={{ fontFamily:"var(--font-montserrat)", fontSize:"11px", color:"#444", letterSpacing:"1px", whiteSpace:"nowrap" }}>
          {filtered.length} instructor{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Teacher list */}
      <div style={{ maxWidth:"1000px", margin:"0 auto", padding:"0 40px 80px", display:"flex", flexDirection:"column", gap:"16px" }}>
        {filtered.length === 0 ? (
          <div style={{ padding:"80px 0", textAlign:"center", fontFamily:"var(--font-cormorant)", fontSize:"20px", color:"#333", fontStyle:"italic" }}>
            No instructors match your search.
          </div>
        ) : (
          filtered.map(t => <TeacherCard key={t.id} teacher={t} />)
        )}
      </div>
    </div>
  );
}

function HeaderStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div style={{ fontFamily:"var(--font-cinzel)", fontSize:"28px", fontWeight:700, color:"#e8e8e8", lineHeight:1 }}>{value}</div>
      <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"10px", color:"#555", letterSpacing:"2px", textTransform:"uppercase", marginTop:"3px" }}>{label}</div>
    </div>
  );
}