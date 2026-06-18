"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

type BeltLevel = "white" | "yellow" | "orange" | "green" | "blue" | "brown" | "black";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  beltLevel: BeltLevel | "";
  agreed: boolean;
}

const BELT_LEVELS: { value: BeltLevel; label: string; hex: string; dark: boolean }[] = [
  { value: "white",  label: "White",  hex: "#FFFFFF", dark: false },
  { value: "yellow", label: "Yellow", hex: "#F5C518", dark: false },
  { value: "orange", label: "Orange", hex: "#E8722A", dark: true  },
  { value: "green",  label: "Green",  hex: "#2D7A3A", dark: true  },
  { value: "blue",   label: "Blue",   hex: "#1D4ED8", dark: true  },
  { value: "brown",  label: "Brown",  hex: "#78350F", dark: true  },
  { value: "black",  label: "Black",  hex: "#121212", dark: true  },
];

const STRENGTH_COLORS = [
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-[#BE0027]",
];

export default function SignupPage() {
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", email: "",
    password: "", beltLevel: "", agreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);
  const h1Ref       = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const credoRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const fieldRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const btnRef      = useRef<HTMLButtonElement>(null);
  const successRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo([leftRef.current, rightRef.current],
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.15 }
      );
      tl.fromTo(logoRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, "-=0.6");
      tl.fromTo(h1Ref.current,
        { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
      tl.fromTo(subRef.current,
        { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");
      tl.fromTo(credoRefs.current.filter(Boolean),
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04 }, "-=0.2");
      tl.fromTo(fieldRefs.current.filter(Boolean),
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, "-=0.5");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;
    setSubmitted(true);
    gsap.timeline()
      .to(btnRef.current, { scale: 0.98, duration: 0.1 })
      .to(btnRef.current, { scale: 1, duration: 0.2, ease: "back.out(2)" });
    setTimeout(() => {
      gsap.fromTo(successRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
    }, 250);
  };

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const selectedBelt = BELT_LEVELS.find((b) => b.value === form.beltLevel);
  const strength = Math.min(Math.floor(form.password.length / 3), 4);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#060606] via-[#0c0c0c] to-[#060606] mt-[72px] p-6 md:p-12 overflow-hidden selection:bg-[#BE0027]/30">
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#BE0027]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-[#BE0027]/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Main Grid Wrapper */}
      <div className="w-full max-w-[1600px] flex flex-col lg:flex-row gap-10 justify-center items-center relative z-10">

        {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
        <div
          ref={leftRef}
          className="relative hidden lg:flex flex-col justify-between w-1/2 lg:h-[680px] bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-12 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BE0027] to-transparent" />

          <span className="absolute -bottom-16 -right-16 font-serif text-white/[0.02] leading-none select-none pointer-events-none z-0" style={{ fontSize: 380 }}>
            武
          </span>

          {/* TOP Content */}
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <div ref={logoRef} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 border border-[#BE0027]/40 rounded-xl flex items-center justify-center bg-black/60 shadow-[0_0_25px_rgba(190,0,39,0.15)]">
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                  <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" stroke="#BE0027" strokeWidth="2" fill="none" />
                  <text x="18" y="23" textAnchor="middle" fontSize="13" fontFamily="serif" fontWeight="bold" fill="#BE0027">DB</text>
                </svg>
              </div>
              <div className="flex flex-col leading-tight items-center">
                <span className="font-cinzel font-bold text-[16px] text-white tracking-[0.15em]">DADI BULSARA</span>
                <span className="font-cormorant text-[11px] text-[#BE0027] tracking-[0.45em] font-light mt-0.5">ASHIHARA KARATE</span>
              </div>
            </div>

            <div className="flex flex-col items-center mt-1">
              <span className="font-inter text-[9px] font-bold tracking-[0.3em] uppercase text-[#BE0027] bg-[#BE0027]/10 px-3 py-1 rounded-full border border-[#BE0027]/20">
                Sabaki Federation
              </span>
              <h1 ref={h1Ref} className="mt-4 font-cinzel font-bold text-white leading-[1.25] tracking-wide text-center text-[32px]">
                DISCIPLINE.<br />STRENGTH.<br />
                <span className="text-[#BE0027] drop-shadow-[0_0_15px_rgba(190,0,39,0.35)]">SABAKI.</span>
              </h1>
              <p ref={subRef} className="mt-4 font-cormorant italic text-[16px] text-white/50 leading-relaxed max-w-sm">
                &quot;Mastering Ashihara Karate is the integration of dynamic movement, blind-spot positioning, and effortless control.&quot;
              </p>
            </div>
          </div>

          {/* BOTTOM Content */}
          <div className="relative z-10 flex flex-col items-center w-full mt-6">
            <div className="flex items-center justify-center gap-3 mb-4 w-full">
              <div className="h-[1px] bg-gradient-to-r from-transparent to-[#BE0027]/40 flex-1" />
              <p className="font-inter text-[9px] font-semibold tracking-[0.25em] uppercase text-white/30 text-center shrink-0">
                Dojo Kun — The Eight Codes
              </p>
              <div className="h-[1px] bg-gradient-to-l from-transparent to-[#BE0027]/40 flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              {[
                ["義", "Gi", "Rectitude"], ["勇", "Yu", "Courage"],
                ["仁", "Jin", "Benevolence"], ["礼", "Rei", "Respect"],
                ["誠", "Makoto", "Sincerity"], ["名誉", "Meiyo", "Honor"],
                ["忠義", "Chugi", "Loyalty"], ["自制", "Jisei", "Self-Control"],
              ].map(([kanji, romaji, english], i) => (
                <div
                  key={english}
                  ref={(el) => { credoRefs.current[i] = el as HTMLDivElement | null; }}
                  className="flex items-center gap-3.5 p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-[#BE0027]/30 rounded-xl transition-all duration-300 group"
                >
                  <span className="font-serif text-[18px] text-[#BE0027] leading-none transition-transform duration-300 group-hover:scale-110 w-5 text-center shrink-0">
                    {kanji}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-inter text-[10px] font-bold tracking-wider text-white/80 uppercase truncate">{english}</span>
                    <span className="font-cormorant text-[10px] text-white/30 mt-0.5 truncate">{romaji}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (Redesigned for Premium Spacing & Legibility) ─────────────────────────────────────────── */}
        <div
          ref={rightRef}
          className="w-full lg:w-1/2 lg:h-[680px] bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-10 md:px-12 md:py-12 shadow-[0_24px_60px_rgba(0,0,0,0.6)] flex flex-col justify-between items-center"
        >
          {/* Increased container width to max-w-[540px] for broad, airy layout */}
          <div className="w-full max-w-[680px] mx-auto my-auto flex flex-col justify-center h-full">
            
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 border border-[#BE0027]/40 bg-black/50 rounded-lg flex items-center justify-center font-serif text-base text-[#BE0027]">武</div>
                <span className="font-cinzel font-bold text-[13px] text-white tracking-widest">BUSHIDO DIGITAL</span>
              </div>
              <Link href="/login" className="text-[#BE0027] text-sm font-bold tracking-wider uppercase hover:text-white transition-colors">Sign in</Link>
            </div>

            {/* Desktop Sign in link */}
            <p className="hidden lg:block font-inter text-sm text-white/50 text-right mb-6">
              Already a member?{" "}
              <Link href="/login" className="text-[#BE0027] font-semibold hover:text-white transition-colors ml-1">
                Sign in
              </Link>
            </p>

            {/* Header */}
            <div ref={(el) => { fieldRefs.current[0] = el; }} className="mb-6">
              <p className="font-inter text-xs font-bold tracking-[0.25em] uppercase text-[#BE0027] mb-2">Registration</p>
              <h2 className="font-cinzel font-bold text-2xl md:text-3xl text-white tracking-wide">Create Your Account</h2>
            </div>

            {/* Form Fields with premium spacing and increased font size */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              
              {/* Name row */}
              <div ref={(el) => { fieldRefs.current[1] = el; }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-white/70 tracking-wide font-inter ml-0.5">First name</label>
                  <input id="firstName" type="text" placeholder="Kenji" value={form.firstName} onChange={set("firstName")}
                    className="w-full px-4.5 py-5 bg-white/[0.03] focus:bg-white/[0.06] border border-white/10 focus:border-[#BE0027] text-white rounded-xl font-inter text-lg placeholder:text-white/30 transition-all outline-none shadow-md" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-white/70 tracking-wide font-inter ml-0.5">Last name</label>
                  <input id="lastName" type="text" placeholder="Tanaka" value={form.lastName} onChange={set("lastName")}
                    className="w-full px-4.5 py-5 bg-white/[0.03] focus:bg-white/[0.06] border border-white/10 focus:border-[#BE0027] text-white rounded-xl font-inter text-lg placeholder:text-white/30 transition-all outline-none shadow-md" required />
                </div>
              </div>

              {/* Email */}
              <div ref={(el) => { fieldRefs.current[2] = el; }} className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-white/70 tracking-wide font-inter ml-0.5">Email address</label>
                <input id="email" type="email" placeholder="you@dojo.com" value={form.email} onChange={set("email")}
                  className="w-full px-4.5 py-5 bg-white/[0.03] focus:bg-white/[0.06] border border-white/10 focus:border-[#BE0027] text-white rounded-xl font-inter text-lg placeholder:text-white/30 transition-all outline-none shadow-md" required />
              </div>

              {/* Password */}
              <div ref={(el) => { fieldRefs.current[3] = el; }} className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-white/70 tracking-wide font-inter ml-0.5">Password</label>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} placeholder="8+ characters" value={form.password} onChange={set("password")}
                    className="w-full px-4.5 py-5 pr-12 bg-white/[0.03] focus:bg-white/[0.06] border border-white/10 focus:border-[#BE0027] text-white rounded-xl font-inter text-lg placeholder:text-white/30 transition-all outline-none shadow-md" required />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex gap-1.5 mt-2 px-0.5">
                  {[1, 2, 3, 4].map((lvl) => (
                    <div key={lvl} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${strength >= lvl ? STRENGTH_COLORS[lvl - 1] : "bg-white/10"}`} />
                  ))}
                </div>
              </div>

              {/* Belt rank */}
              <div ref={(el) => { fieldRefs.current[4] = el; }} className="flex flex-col gap-2">
                <label htmlFor="beltLevel" className="text-sm font-medium text-white/70 tracking-wide font-inter ml-0.5">Belt rank</label>
                <div className="relative">
                  <select id="beltLevel" value={form.beltLevel} onChange={set("beltLevel")}
                    className="w-full px-4.5 py-5 bg-white/[0.03] focus:bg-white/[0.06] border border-white/10 focus:border-[#BE0027] text-white rounded-xl font-inter text-lg transition-all outline-none appearance-none cursor-pointer pr-10 shadow-md" >
                    <option value="" className="bg-[#0e0e0e] text-white/40">Select your belt level</option>
                    {BELT_LEVELS.map((b) => (
                      <option key={b.value} value={b.value} className="bg-[#0e0e0e] text-white">{b.label} Belt</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                {selectedBelt && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-inter text-xs font-bold tracking-wider uppercase border border-black/10 shadow-sm" style={{ backgroundColor: selectedBelt.hex, color: selectedBelt.dark ? "#fff" : "#121212" }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: selectedBelt.dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)" }} />
                      {selectedBelt.label} Belt
                    </span>
                  </div>
                )}
              </div>

              {/* Terms checkbox */}
              <div ref={(el) => { fieldRefs.current[5] = el; }} className="mt-1">
                <label className="flex items-start gap-3.5 cursor-pointer group">
                  <input type="checkbox" checked={form.agreed} onChange={(e) => setForm((p) => ({ ...p, agreed: e.target.checked }))} className="sr-only" />
                  <div className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all ${form.agreed ? "bg-[#BE0027] border-[#BE0027] shadow-[0_0_10px_rgba(190,0,39,0.4)]" : "bg-white/5 border-white/20 group-hover:border-[#BE0027]/50"}`} >
                    {form.agreed && <Check size={12} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="font-inter text-sm leading-normal text-white/60 select-none">
                    I accept the <Link href="/terms" className="text-[#BE0027] font-semibold hover:text-white transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-[#BE0027] font-semibold hover:text-white transition-colors">Privacy Policy</Link>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div ref={(el) => { fieldRefs.current[6] = el; }} className="mt-3">
                <button
                  ref={btnRef}
                  type="submit"
                  disabled={!form.agreed || submitted}
                  className="w-full flex items-center justify-center gap-3.5 py-6 px-6 bg-[#BE0027] hover:enabled:bg-white hover:enabled:text-black hover:enabled:shadow-[0_0_25px_rgba(255,255,255,0.25)] text-white rounded-xl font-inter text-base font-bold tracking-widest uppercase disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {submitted ? <><Check size={16} strokeWidth={2.5} /> Account Created</> : <>Begin Your Journey <ArrowRight size={16} /></>}
                </button>
              </div>

              {/* Success Message */}
              {submitted && (
                <div ref={successRef} className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-md mt-2">
                  <p className="font-inter text-sm font-medium text-green-400 text-center">Welcome to Dadi Bulsara Ashihara Federation. Check your inbox to verify your email.</p>
                </div>
              )}
            </form>

            <p className="font-inter text-[11px] tracking-wider text-white/30 uppercase mt-10 text-center">
              © {new Date().getFullYear()} Dadi Bulsara Ashihara Federation. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}