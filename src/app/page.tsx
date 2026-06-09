"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const kanjiChars = ["空", "手", "道", "武", "士", "力", "心", "技", "気", "礼", "義", "勇", "仁", "剛", "柔"];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Classes", href: "/classes" },
  { name: "Sensei", href: "/sensei" },
  { name: "Gallery", href: "/gallery" },
  { name: "Schedule", href: "/schedule" },
  { name: "Sign Up", href: "/signup" },
];

interface KanjiParticle {
  char: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
}

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const particlesRef = useRef<KanjiParticle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: 28 }, () => ({
      char: kanjiChars[Math.floor(Math.random() * kanjiChars.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 40 + Math.random() * 100,
      opacity: 0.03 + Math.random() * 0.07,
      speed: 0.2 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.002,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = "#C8102E";
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.char, 0, 0);
        ctx.restore();

        p.y -= p.speed;
        p.rotation += p.rotationSpeed;
        if (p.y < -p.size * 1.5) {
          p.y = window.innerHeight + p.size;
          p.x = Math.random() * window.innerWidth;
        }
      });
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#F5F0E8", overflowX: "hidden" }}>

      {/* Kanji Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      />

      {/* Red top line accent */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "3px", background: "linear-gradient(90deg, #C8102E, #8B0000, #C8102E)", zIndex: 100 }} />

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: "3px", left: 0, width: "100%", zIndex: 99,
        background: scrolled ? "rgba(10,10,10,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(200,16,46,0.2)" : "none",
        transition: "all 0.3s ease",
        padding: "0 2rem",
        boxSizing: "border-box",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "2rem", color: "#C8102E", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1 }}>空手</span>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F5F0E8", letterSpacing: "3px", textTransform: "uppercase", lineHeight: 1 }}>KARATE</div>
              <div style={{ fontSize: "0.6rem", color: "#8B7355", letterSpacing: "4px", textTransform: "uppercase" }}>DO · WAY OF THE EMPTY HAND</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }} className="desktop-nav">
            {navLinks.map((link, i) =>
              link.name === "Sign Up" ? (
                <Link key={i} href={link.href} style={{
                  padding: "8px 22px", background: "#C8102E", color: "#F5F0E8",
                  textDecoration: "none", fontSize: "0.78rem", fontWeight: 700,
                  letterSpacing: "2px", textTransform: "uppercase",
                  clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                  transition: "background 0.2s",
                  marginLeft: "12px",
                }}>
                  {link.name}
                </Link>
              ) : (
                <Link key={i} href={link.href} style={{
                  padding: "8px 14px", color: "rgba(245,240,232,0.7)", textDecoration: "none",
                  fontSize: "0.78rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase",
                  transition: "color 0.2s",
                  position: "relative",
                }}>
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }}
            className="hamburger"
            aria-label="Menu"
          >
            <div style={{ width: "24px", height: "2px", background: "#F5F0E8", marginBottom: "5px", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <div style={{ width: "24px", height: "2px", background: "#C8102E", marginBottom: "5px", opacity: menuOpen ? 0 : 1, transition: "all 0.3s" }} />
            <div style={{ width: "24px", height: "2px", background: "#F5F0E8", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: "rgba(10,10,10,0.98)", borderTop: "1px solid rgba(200,16,46,0.3)",
            padding: "1rem 2rem 1.5rem",
          }}>
            {navLinks.map((link, i) => (
              <Link key={i} href={link.href} onClick={() => setMenuOpen(false)} style={{
                display: "block", padding: "12px 0", color: "#F5F0E8", textDecoration: "none",
                fontSize: "0.9rem", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase",
                borderBottom: "1px solid rgba(245,240,232,0.05)",
              }}>
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 2rem 60px" }}>

        {/* Vertical red line */}
        <div style={{ position: "absolute", left: "50%", top: "10%", bottom: "10%", width: "1px", background: "linear-gradient(to bottom, transparent, rgba(200,16,46,0.4), transparent)", display: "none" }} className="vertical-line" />

        <div style={{ maxWidth: "1100px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="hero-grid">

          {/* Left: Big Kanji */}
          <div style={{ textAlign: "center", position: "relative" }}>
            <div style={{
              fontSize: "clamp(140px, 20vw, 240px)",
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: "1px rgba(200,16,46,0.5)",
              fontFamily: "serif",
              userSelect: "none",
              filter: "drop-shadow(0 0 40px rgba(200,16,46,0.15))",
            }}>
              空手
            </div>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              fontSize: "clamp(140px, 20vw, 240px)",
              lineHeight: 1,
              color: "#C8102E",
              fontFamily: "serif",
              opacity: 0.06,
              userSelect: "none",
              whiteSpace: "nowrap",
            }}>
              空手
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1.5rem" }}>
              {["礼", "義", "勇", "仁"].map((k, i) => (
                <div key={i} style={{
                  width: "52px", height: "52px", border: "1px solid rgba(200,16,46,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", fontFamily: "serif", color: "rgba(245,240,232,0.5)",
                }}>
                  {k}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Text content */}
          <div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "5px", textTransform: "uppercase", color: "#C8102E", marginBottom: "1rem", fontWeight: 700 }}>
              — 武道の道 · THE WAY OF BUDO
            </div>

            <h1 style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-1px",
              marginBottom: "1.5rem",
              color: "#F5F0E8",
            }}>
              FORGE YOUR<br />
              <span style={{ color: "#C8102E" }}>SPIRIT.</span><br />
              MASTER THE<br />
              <span style={{ WebkitTextStroke: "1px rgba(245,240,232,0.4)", color: "transparent" }}>ART.</span>
            </h1>

            <p style={{
              fontSize: "1rem", lineHeight: 1.8, color: "rgba(245,240,232,0.55)",
              marginBottom: "2.5rem", maxWidth: "400px",
              fontWeight: 400,
            }}>
              Discipline born from tradition. Power refined through practice.
              Step onto the tatami and discover what you are truly capable of.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/signup" style={{
                padding: "14px 36px",
                background: "#C8102E",
                color: "#F5F0E8",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 800,
                letterSpacing: "3px",
                textTransform: "uppercase",
                clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
                display: "inline-block",
              }}>
                Begin Training
              </Link>
              <Link href="/classes" style={{
                padding: "14px 36px",
                background: "transparent",
                color: "#F5F0E8",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "3px",
                textTransform: "uppercase",
                border: "1px solid rgba(245,240,232,0.2)",
                display: "inline-block",
              }}>
                View Classes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "1rem", padding: "0 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(245,240,232,0.08)" }} />
        <span style={{ fontSize: "1.2rem", fontFamily: "serif", color: "rgba(200,16,46,0.4)" }}>道</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(245,240,232,0.08)" }} />
      </div>

      {/* STATS SECTION */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px" }} className="stats-grid">
          {[
            { num: "30+", label: "Years of Tradition", kanji: "年" },
            { num: "500+", label: "Active Students", kanji: "人" },
            { num: "12", label: "Black Belt Sensei", kanji: "段" },
            { num: "8", label: "Championship Titles", kanji: "優" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "2.5rem 2rem",
              background: i % 2 === 0 ? "rgba(245,240,232,0.02)" : "rgba(200,16,46,0.04)",
              borderTop: "1px solid rgba(200,16,46,0.15)",
              borderBottom: "1px solid rgba(200,16,46,0.05)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "50%", right: "1rem", transform: "translateY(-50%)",
                fontSize: "4rem", fontFamily: "serif", color: "rgba(200,16,46,0.06)", userSelect: "none",
              }}>{s.kanji}</div>
              <div style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#C8102E", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(245,240,232,0.45)", marginTop: "0.5rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 2rem 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.7rem", letterSpacing: "5px", color: "#C8102E", textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem" }}>心技体 · SHIN-GI-TAI</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#F5F0E8", letterSpacing: "-0.5px" }}>The Three Pillars</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(245,240,232,0.06)" }} className="pillars-grid">
            {[
              { kanji: "心", romaji: "SHIN", title: "Mind", desc: "Mental fortitude and unwavering focus. The art of karate begins long before the first punch is thrown — it starts in the stillness of a disciplined mind." },
              { kanji: "技", romaji: "GI", title: "Technique", desc: "Precision born from ten thousand repetitions. Every kata, every strike, refined until movement and intention become one seamless expression." },
              { kanji: "体", romaji: "TAI", title: "Body", desc: "The vessel of the warrior. Strength, flexibility, and endurance cultivated through years of dedicated training under the guidance of a true sensei." },
            ].map((p, i) => (
              <div key={i} style={{
                padding: "3rem 2.5rem",
                background: "#0A0A0A",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  fontSize: "6rem", fontFamily: "serif",
                  color: "transparent", WebkitTextStroke: "1px rgba(200,16,46,0.2)",
                  lineHeight: 1, marginBottom: "0.5rem", userSelect: "none",
                }}>{p.kanji}</div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "5px", color: "#C8102E", textTransform: "uppercase", marginBottom: "0.75rem", fontWeight: 700 }}>{p.romaji}</div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F5F0E8", marginBottom: "1rem" }}>{p.title}</h3>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: "rgba(245,240,232,0.45)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(245,240,232,0.06)", padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", fontFamily: "serif", color: "rgba(200,16,46,0.3)", marginBottom: "0.5rem" }}>空手道</div>
        <div style={{ fontSize: "0.7rem", letterSpacing: "3px", color: "rgba(245,240,232,0.2)", textTransform: "uppercase" }}>
          © 2025 Karate Dojo · The Way of the Empty Hand
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; text-align: center; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pillars-grid { grid-template-columns: 1fr !important; }
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
        a:hover { opacity: 0.8; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
      `}</style>
    </div>
  );
}