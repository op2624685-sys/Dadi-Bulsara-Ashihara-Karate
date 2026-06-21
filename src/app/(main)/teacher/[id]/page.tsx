"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Types ─────────────────────────────────────────────────────────────────────
type Belt = "Black" | "Red-Black" | "Red-White" | "Red";
type Rank = "Shodan" | "Nidan" | "Sandan" | "Yondan" | "Godan" | "Rokudan" | "Nanadan" | "Hachidan";

interface TeacherDetail {
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
  dojoLat: number;
  dojoLng: number;
  phone: string;
  email: string;
  fullBio: string;
  studentsList: string[];
  timeline: { year: number; event: string; icon: string }[];
  certifications: string[];
}

// ── Sample data (teacher detail) ───────────────────────────────────────────────
const SAMPLE_TEACHER_DETAIL: TeacherDetail = {
  id: 1,
  firstName: "Dadi", lastName: "Bulsara",
  age: 52, belt: "Red-Black", rank: "Hachidan", danGrade: 8,
  state: "Maharashtra",
  yearsTraining: 34, speciality: "Sabaki",
  students: 48, campsHosted: 22, seminarsGiven: 65,
  bio: "Founder of the Indian chapter of Ashihara Karate. Trained directly under Hirokazu Kanazawa.",
  achievements: ["World Championship — Silver 1998", "National Champion 5x", "ISKA Certified Master Instructor"],
  certifiedBy: "International Ashihara Karate Organisation",
  dojoName: "Bulsara Ashihara Karate Dojo",
  dojoLocation: "Mumbai, Maharashtra",
  dojoLat: 19.0760,
  dojoLng: 72.8777,
  phone: "+91 98765 43210",
  email: "dadi@ashihara.in",
  fullBio: "Dadi Bulsara is the founder and chief instructor of the Indian chapter of Ashihara Karate. With 34 years of dedicated training and teaching, she has been instrumental in popularizing Ashihara Karate across India. She trained directly under the legendary Hirokazu Kanazawa and has represented India at the World Ashihara Championships, earning a silver medal in 1998. Her expertise in Sabaki footwork is renowned across the karate community, and she has mentored countless students who have gone on to become national and international champions. Dadi believes in the holistic development of her students through rigorous training, discipline, and spiritual growth.",
  studentsList: [
    "Arjun Sharma (Black Belt, Champion 2023)",
    "Sneha Patil (Black Belt, Champion 2024)",
    "Priya Mehta (Brown Belt, National Level)",
    "Ananya Iyer (Brown Belt, Coach)",
  ],
  timeline: [
    { year: 1990, event: "Started training under Hirokazu Kanazawa", icon: "🥋" },
    { year: 1998, event: "World Championship — Silver Medal", icon: "🥈" },
    { year: 2005, event: "Founded Indian Ashihara Karate Chapter", icon: "🏢" },
    { year: 2010, event: "Promoted to Hachidan (8th Dan)", icon: "⭐" },
    { year: 2015, event: "50+ Seminars Hosted Internationally", icon: "🌍" },
    { year: 2024, event: "48 Active Students, 5 Black Belts", icon: "👥" },
  ],
  certifications: [
    "ISKA Master Instructor Certification",
    "International Referee License",
    "Youth Development Specialist",
    "Kata Master Certification",
    "Kumite Coaching Advanced",
  ],
};

// ── Dan color system ──────────────────────────────────────────────────────────
const DAN_COLORS: Record<number, { ring: string; glow: string; bg: string; light: string }> = {
  1: { ring: "#2255aa", glow: "rgba(34,85,170,0.5)", bg: "rgba(34,85,170,0.08)", light: "#e3f2fd" },
  2: { ring: "#2255aa", glow: "rgba(34,85,170,0.5)", bg: "rgba(34,85,170,0.08)", light: "#e3f2fd" },
  3: { ring: "#3a8c3a", glow: "rgba(58,140,58,0.4)", bg: "rgba(58,140,58,0.08)", light: "#e8f5e9" },
  4: { ring: "#3a8c3a", glow: "rgba(58,140,58,0.4)", bg: "rgba(58,140,58,0.08)", light: "#e8f5e9" },
  5: { ring: "#d4a800", glow: "rgba(245,197,24,0.4)", bg: "rgba(245,197,24,0.08)", light: "#fffde7" },
  6: { ring: "#c9a84c", glow: "rgba(201,168,76,0.5)", bg: "rgba(201,168,76,0.12)", light: "#fff9c4" },
  7: { ring: "#c9a84c", glow: "rgba(201,168,76,0.5)", bg: "rgba(201,168,76,0.12)", light: "#fff9c4" },
  8: { ring: "#c9a84c", glow: "rgba(201,168,76,0.5)", bg: "rgba(201,168,76,0.12)", light: "#fff9c4" },
};

// ── Global Styles ────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes fade-in-up { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes glow-pulse { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
  input, textarea { font-family: var(--font-montserrat); }
  input::placeholder, textarea::placeholder { color:#555; }
  @media (max-width: 768px) {
    .hero-section, .content-section { padding-left: 20px !important; padding-right: 20px !important; }
  }
`;

// ── Section: Hero with avatar ─────────────────────────────────────────────────
function HeroSection({ teacher }: { teacher: TeacherDetail }) {
  const colors = DAN_COLORS[teacher.danGrade];
  const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  return (
    <div className="hero-section" style={{
      position: "relative", padding: "60px 56px", background: `linear-gradient(135deg, ${colors.bg}, transparent)`,
      borderBottom: `2px solid ${colors.ring}50`,
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "40px", alignItems: "center", flexWrap: "wrap" }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            position: "absolute", inset: "-20px", borderRadius: "50%",
            border: `3px solid ${colors.ring}`, opacity: 0.5,
            boxShadow: `0 0 30px ${colors.glow}`,
            animationName: "glow-pulse", animationDuration: "3s", animationIterationCount: "infinite",
          }} />
          {teacher.photo ? (
            <img src={teacher.photo} alt={teacher.firstName}
              style={{
                width: "200px", height: "200px", borderRadius: "50%", objectFit: "cover",
                border: `4px solid ${colors.ring}`, boxShadow: `0 0 30px ${colors.glow}99`,
                position: "relative", zIndex: 2,
              }} />
          ) : (
            <div style={{
              width: "200px", height: "200px", borderRadius: "50%",
              border: `4px solid ${colors.ring}`, background: colors.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-cinzel)", fontSize: "48px", fontWeight: 700,
              color: colors.ring, boxShadow: `0 0 30px ${colors.glow}99`,
              position: "relative", zIndex: 2,
            }}>
              {teacher.firstName[0]}{teacher.lastName[0]}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ marginBottom: "12px" }}>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "12px", letterSpacing: "3px",
              color: "#666", textTransform: "uppercase",
            }}>
              {teacher.rank} · {teacher.danGrade}{["st", "nd", "rd"][teacher.danGrade - 1] || "th"} Dan
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-cinzel)", fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 900, color: "#e8e8e8", letterSpacing: "2px",
            margin: "0 0 16px", lineHeight: 0.9,
          }}>
            Sensei {teacher.firstName} {teacher.lastName}
          </h1>

          <p style={{
            fontFamily: "var(--font-cormorant)", fontSize: "18px",
            color: "#999", fontStyle: "italic", margin: "0 0 24px",
          }}>
            {teacher.speciality} Specialist · {teacher.yearsTraining} Years of Mastery
          </p>

          {/* Dan badge */}
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            padding: "16px 24px", border: `2px solid ${colors.ring}`,
            borderRadius: "8px", background: colors.bg,
          }}>
            <span style={{
              fontFamily: "var(--font-cinzel)", fontSize: "32px", fontWeight: 700,
              color: colors.ring,
            }}>
              {ROMAN[teacher.danGrade]}
            </span>
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: "10px",
              color: colors.ring, letterSpacing: "2px", textTransform: "uppercase",
            }}>
              Dan Master
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section: Bio ──────────────────────────────────────────────────────────────
function BioSection({ teacher }: { teacher: TeacherDetail }) {
  const colors = DAN_COLORS[teacher.danGrade];

  return (
    <div className="content-section" style={{ padding: "56px", background: "#050505", borderBottom: `1px solid #1a1a1a` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-cinzel)", fontSize: "36px", fontWeight: 700,
          color: "#e8e8e8", letterSpacing: "2px", marginBottom: "32px", marginTop: 0,
        }}>
          About
        </h2>

        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-cormorant)", fontSize: "18px", lineHeight: 2,
              color: "#bbb", margin: 0, fontStyle: "italic",
            }}>
              {teacher.fullBio}
            </p>
          </div>

          {/* Quick stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ padding: "16px", background: colors.bg, borderRadius: "8px", borderLeft: `4px solid ${colors.ring}` }}>
              <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "28px", fontWeight: 700, color: colors.ring }}>
                {teacher.students}
              </div>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#666", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>
                Active Students
              </div>
            </div>

            <div style={{ padding: "16px", background: colors.bg, borderRadius: "8px", borderLeft: `4px solid ${colors.ring}` }}>
              <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "28px", fontWeight: 700, color: colors.ring }}>
                {teacher.campsHosted}
              </div>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#666", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>
                Camps Hosted
              </div>
            </div>

            <div style={{ padding: "16px", background: colors.bg, borderRadius: "8px", borderLeft: `4px solid ${colors.ring}` }}>
              <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "28px", fontWeight: 700, color: colors.ring }}>
                {teacher.seminarsGiven}
              </div>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#666", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>
                Seminars Given
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section: Dojo location + Map ──────────────────────────────────────────────
function DojoSection({ teacher }: { teacher: TeacherDetail }) {
  const colors = DAN_COLORS[teacher.danGrade];

  return (
    <div className="content-section" style={{ padding: "56px", background: "#050505", borderBottom: `1px solid #1a1a1a` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-cinzel)", fontSize: "36px", fontWeight: 700,
          color: "#e8e8e8", letterSpacing: "2px", marginBottom: "32px", marginTop: 0,
        }}>
          Dojo Location
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          {/* Info */}
          <div style={{ padding: "24px", background: colors.bg, borderRadius: "8px" }}>
            <h3 style={{
              fontFamily: "var(--font-cinzel)", fontSize: "22px", color: colors.ring,
              margin: "0 0 16px", letterSpacing: "1px",
            }}>
              {teacher.dojoName}
            </h3>
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "14px", color: "#999", margin: "0 0 20px",
            }}>
              📍 {teacher.dojoLocation}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>
                  📧 Email
                </span>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "13px", color: "#ccc", margin: "4px 0 0" }}>
                  {teacher.email}
                </p>
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>
                  📱 Phone
                </span>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "13px", color: "#ccc", margin: "4px 0 0" }}>
                  {teacher.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Map placeholder (will integrate actual map later) */}
          <div style={{
            padding: "24px", background: "#0a0a0a", borderRadius: "8px", border: `1px solid ${colors.ring}50`,
            display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px",
            color: "#666", fontFamily: "var(--font-cormorant)", fontSize: "16px", fontStyle: "italic",
            textAlign: "center",
          }}>
            🗺️ Map: {teacher.dojoLocation}<br/>
            <span style={{ fontSize: "12px", color: "#555", marginTop: "8px", display: "block" }}>
              (Lat: {teacher.dojoLat}, Lng: {teacher.dojoLng})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section: Students List ────────────────────────────────────────────────────
function StudentsSection({ teacher }: { teacher: TeacherDetail }) {
  const colors = DAN_COLORS[teacher.danGrade];

  return (
    <div className="content-section" style={{ padding: "56px", background: "#050505", borderBottom: `1px solid #1a1a1a` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-cinzel)", fontSize: "36px", fontWeight: 700,
          color: "#e8e8e8", letterSpacing: "2px", marginBottom: "32px", marginTop: 0,
        }}>
          Notable Students ({teacher.studentsList.length})
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
          {teacher.studentsList.map((student, i) => (
            <div key={i} style={{
              padding: "20px", background: colors.bg, borderRadius: "6px",
              borderLeft: `3px solid ${colors.ring}`,
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "13px",
                color: "#ccc", margin: 0, letterSpacing: "0.5px",
              }}>
                {student}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Section: Achievements Timeline ────────────────────────────────────────────
function TimelineSection({ teacher }: { teacher: TeacherDetail }) {
  const colors = DAN_COLORS[teacher.danGrade];

  return (
    <div className="content-section" style={{ padding: "56px", background: "#050505", borderBottom: `1px solid #1a1a1a` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-cinzel)", fontSize: "36px", fontWeight: 700,
          color: "#e8e8e8", letterSpacing: "2px", marginBottom: "32px", marginTop: 0,
        }}>
          Journey
        </h2>

        <div style={{ position: "relative", paddingLeft: "40px" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: "12px", top: 0, bottom: 0,
            width: "2px", background: `linear-gradient(to bottom, ${colors.ring}, transparent)`,
          }} />

          {/* Timeline items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {teacher.timeline.map((item, i) => (
              <div key={i} style={{
                position: "relative", paddingLeft: "24px",
                animationName: "fade-in-up", animationDuration: "0.6s",
                animationDelay: `${i * 0.1}s`, animationFillMode: "both",
              }}>
                {/* Dot */}
                <div style={{
                  position: "absolute", left: "-31px", top: "5px",
                  width: "16px", height: "16px", borderRadius: "50%",
                  background: colors.ring, border: "3px solid #050505",
                  boxShadow: `0 0 12px ${colors.glow}`,
                }} />

                <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "20px", fontWeight: 700, color: colors.ring, marginBottom: "4px" }}>
                  {item.year}
                </div>
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#666", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                  {item.icon} {item.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section: Certifications Gallery ───────────────────────────────────────────
function CertificationsSection({ teacher }: { teacher: TeacherDetail }) {
  const colors = DAN_COLORS[teacher.danGrade];

  return (
    <div className="content-section" style={{ padding: "56px", background: "#050505", borderBottom: `1px solid #1a1a1a` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-cinzel)", fontSize: "36px", fontWeight: 700,
          color: "#e8e8e8", letterSpacing: "2px", marginBottom: "32px", marginTop: 0,
        }}>
          Certifications & Achievements
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          {teacher.certifications.map((cert, i) => (
            <div key={i} style={{
              padding: "24px", background: colors.bg, borderRadius: "8px",
              border: `1px solid ${colors.ring}40`, textAlign: "center",
              animationName: "fade-in-up", animationDuration: "0.6s",
              animationDelay: `${i * 0.1}s`, animationFillMode: "both",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🏆</div>
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: "12px",
                color: colors.ring, fontWeight: 600, margin: 0,
                letterSpacing: "0.5px",
              }}>
                {cert}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Section: Contact Form ─────────────────────────────────────────────────────
function ContactSection({ teacher }: { teacher: TeacherDetail }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const colors = DAN_COLORS[teacher.danGrade];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Message sent! Sensei will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="content-section" style={{ padding: "56px", background: "#050505" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-cinzel)", fontSize: "36px", fontWeight: 700,
          color: "#e8e8e8", letterSpacing: "2px", marginBottom: "32px", marginTop: 0,
        }}>
          Get in Touch
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{
              display: "block", fontFamily: "var(--font-montserrat)", fontSize: "11px",
              color: "#666", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px",
            }}>
              Your Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              required
              style={{
                width: "100%", padding: "12px 16px", background: "#0a0a0a",
                border: `1px solid ${colors.ring}40`, borderRadius: "6px", color: "#ccc",
                fontSize: "13px", boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{
              display: "block", fontFamily: "var(--font-montserrat)", fontSize: "11px",
              color: "#666", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px",
            }}>
              Your Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
              style={{
                width: "100%", padding: "12px 16px", background: "#0a0a0a",
                border: `1px solid ${colors.ring}40`, borderRadius: "6px", color: "#ccc",
                fontSize: "13px", boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{
              display: "block", fontFamily: "var(--font-montserrat)", fontSize: "11px",
              color: "#666", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px",
            }}>
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Inquire about training programs, camps, or anything else..."
              required
              rows={5}
              style={{
                width: "100%", padding: "12px 16px", background: "#0a0a0a",
                border: `1px solid ${colors.ring}40`, borderRadius: "6px", color: "#ccc",
                fontSize: "13px", boxSizing: "border-box", resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "14px 32px", background: colors.ring, color: "#fff",
              border: "none", borderRadius: "6px", fontFamily: "var(--font-montserrat)",
              fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px",
              textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s ease",
              boxShadow: `0 8px 20px ${colors.glow}40`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 28px ${colors.glow}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 8px 20px ${colors.glow}40`;
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherDetailPage() {
  const teacher = SAMPLE_TEACHER_DETAIL; // Replace with router.query.id lookup

  useEffect(() => {
    gsap.to(".page-wrapper", { opacity: 1, duration: 0.4 });
  }, []);

  return (
    <div className="page-wrapper" style={{ background: "#050505", minHeight: "100vh", opacity: 0 }}>
      <style>{GLOBAL_STYLES}</style>

      <HeroSection teacher={teacher} />
      <BioSection teacher={teacher} />
      <DojoSection teacher={teacher} />
      <StudentsSection teacher={teacher} />
      <TimelineSection teacher={teacher} />
      <CertificationsSection teacher={teacher} />
      <ContactSection teacher={teacher} />

      {/* Footer */}
      <footer style={{
        padding: "40px 56px", background: "#0a0a0a", borderTop: "1px solid #1a1a1a",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#555",
          letterSpacing: "1px", margin: 0,
        }}>
          © 2024 Dadi Bulsara Ashihara Karate. All rights reserved.
        </p>
      </footer>
    </div>
  );
}