"use client";

import { useState, useMemo } from "react";

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
  danGrade:      number;           // 1–8
  state:         string;
  photo?:        string;
  yearsTraining: number;
  speciality:    string;           // e.g. "Kumite", "Kata", "Sabaki"
  students:      number;           // total students under them
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

// ── Dan grade roman numerals ──────────────────────────────────────────────────
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

// ── Teacher Card — horizontal, expanded layout ────────────────────────────────
function TeacherCard({ teacher }: { teacher: Teacher }) {
  const [expanded, setExpanded] = useState(false);
  const isHighDan = teacher.danGrade >= 6;

  return (
    <div style={{
      background: "#080808",
      border: `1px solid ${isHighDan ? "rgba(201,168,76,0.2)" : "#181818"}`,
      borderRadius: "4px",
      overflow: "hidden",
      transition: "border-color 0.3s",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor =
        isHighDan ? "rgba(201,168,76,0.45)" : "#2a2a2a";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor =
        isHighDan ? "rgba(201,168,76,0.2)" : "#181818";
    }}
    >
      {/* Top gold bar for high dan */}
      {isHighDan && (
        <div style={{ height:"2px", background:"linear-gradient(to right,#c9a84c,#8b6914,transparent)" }} />
      )}

      {/* Main content */}
      <div style={{ padding:"28px 28px 20px", display:"flex", gap:"24px", flexWrap:"wrap" }}>

        {/* Left: avatar + dan */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
          <TeacherAvatar teacher={teacher} />
          <DanBadge dan={teacher.danGrade} rank={teacher.rank} />
        </div>

        {/* Centre: identity */}
        <div style={{ flex:1, minWidth:"200px" }}>
          {/* Name + rank */}
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

          {/* Tags */}
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"14px" }}>
            <SpecialityTag label={teacher.speciality} />
            <SpecialityTag label={teacher.state} />
            <SpecialityTag label={`${teacher.yearsTraining} yrs`} />
          </div>

          {/* Bio */}
          <p style={{
            fontFamily:"var(--font-cormorant)", fontSize:"15px",
            color:"#666", lineHeight:1.7, fontStyle:"italic",
            margin:0,
            display: expanded ? "block" : "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: expanded ? "visible" : "hidden",
          }}>
            {teacher.bio}
          </p>
        </div>

        {/* Right: stats */}
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

      {/* Achievements + expand */}
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

      {/* Expanded: certification */}
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

  return (
    <div style={{ minHeight:"100vh", background:"#050505", paddingTop:"80px" }}>

      {/* ── Page header ── */}
      <div style={{
        borderBottom:"1px solid #111",
        padding:"48px 40px 32px",
        maxWidth:"1000px", margin:"0 auto",
      }}>
        <p style={{
          fontFamily:"var(--font-montserrat)", fontSize:"11px",
          letterSpacing:"4px", color:"#555", textTransform:"uppercase", marginBottom:"12px",
        }}>
          Dadi Bulsara Ashihara Karate
        </p>
        <h1 style={{
          fontFamily:"var(--font-cinzel)", fontSize:"clamp(32px,5vw,52px)",
          fontWeight:700, color:"#e8e8e8", letterSpacing:"3px",
          textTransform:"uppercase", margin:"0 0 8px",
        }}>
          Instructors
        </h1>
        <p style={{
          fontFamily:"var(--font-cormorant)", fontSize:"17px",
          color:"#555", fontStyle:"italic", margin:"8px 0 20px",
        }}>
          The lineage of knowledge — each instructor a guardian of the Sabaki way.
        </p>
        <div style={{ display:"flex", gap:"32px", flexWrap:"wrap" }}>
          <HeaderStat value={SAMPLE_TEACHERS.length} label="Instructors" />
          <HeaderStat value={totalStudents}           label="Total Students" />
          <HeaderStat value={SAMPLE_TEACHERS.filter(t=>t.danGrade>=6).length} label="Senior Dan" />
          <HeaderStat value={SAMPLE_TEACHERS.reduce((a,t)=>a+t.seminarsGiven,0)} label="Seminars Given" />
        </div>
      </div>

      {/* ── Search + filters ── */}
      <div style={{
        padding:"24px 40px",
        maxWidth:"1000px", margin:"0 auto",
        display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"center",
      }}>
        <div style={{ position:"relative", flex:"1", minWidth:"220px" }}>
          <span style={{
            position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)",
            color:"#444", fontSize:"14px", pointerEvents:"none",
          }}>⌕</span>
          <input
            type="text"
            placeholder="Search by name or speciality…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width:"100%", padding:"10px 14px 10px 36px",
              background:"#0d0d0d", border:"1px solid #222",
              borderRadius:"3px", color:"#ccc",
              fontFamily:"var(--font-montserrat)", fontSize:"12px",
              outline:"none", boxSizing:"border-box",
            }}
          />
        </div>

        <select
          value={stateFilter}
          onChange={e => setStateFilter(e.target.value)}
          style={{
            padding:"10px 14px", background:"#0d0d0d",
            border:"1px solid #222", borderRadius:"3px",
            color:"#888", fontFamily:"var(--font-montserrat)",
            fontSize:"11px", letterSpacing:"1px", cursor:"pointer", outline:"none",
          }}
        >
          <option value="All">All States</option>
          {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={rankFilter}
          onChange={e => setRankFilter(e.target.value)}
          style={{
            padding:"10px 14px", background:"#0d0d0d",
            border:"1px solid #222", borderRadius:"3px",
            color:"#888", fontFamily:"var(--font-montserrat)",
            fontSize:"11px", letterSpacing:"1px", cursor:"pointer", outline:"none",
          }}
        >
          <option value="All">All Ranks</option>
          {["Shodan","Nidan","Sandan","Yondan","Godan","Rokudan","Nanadan","Hachidan"].map(r =>
            <option key={r} value={r}>{r}</option>
          )}
        </select>

        <span style={{
          fontFamily:"var(--font-montserrat)", fontSize:"11px",
          color:"#444", letterSpacing:"1px", whiteSpace:"nowrap",
        }}>
          {filtered.length} instructor{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Teacher list ── */}
      <div style={{
        maxWidth:"1000px", margin:"0 auto",
        padding:"0 40px 80px",
        display:"flex", flexDirection:"column", gap:"16px",
      }}>
        {filtered.length === 0 ? (
          <div style={{
            padding:"80px 0", textAlign:"center",
            fontFamily:"var(--font-cormorant)", fontSize:"20px",
            color:"#333", fontStyle:"italic",
          }}>
            No instructors match your search.
          </div>
        ) : (
          filtered.map(t => <TeacherCard key={t.id} teacher={t} />)
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
      <div style={{
        fontFamily:"var(--font-cinzel)", fontSize:"28px",
        fontWeight:700, color:"#e8e8e8", lineHeight:1,
      }}>{value}</div>
      <div style={{
        fontFamily:"var(--font-montserrat)", fontSize:"10px",
        color:"#555", letterSpacing:"2px", textTransform:"uppercase", marginTop:"3px",
      }}>{label}</div>
    </div>
  );
}