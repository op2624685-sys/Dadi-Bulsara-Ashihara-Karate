"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type BeltLevel = "white" | "yellow" | "orange" | "green" | "blue" | "brown" | "black";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  beltLevel: BeltLevel | "";
  agreed: boolean;
}

// ─── Belt data ────────────────────────────────────────────────────────────────
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
  "bg-orange-400",
  "bg-yellow-400",
  "bg-green-600",
  "bg-bushido-primary",
];

export default function SignupPage() {
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", email: "",
    password: "", beltLevel: "", agreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // GSAP refs
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);
  const h1Ref       = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const credoRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const fieldRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const btnRef      = useRef<HTMLButtonElement>(null);
  const successRef  = useRef<HTMLDivElement>(null);

  // ── Entrance Animation ──────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(leftRef.current,
        { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 });
      tl.fromTo(rightRef.current,
        { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, "-=0.6");
      tl.fromTo(logoRef.current,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.5");
      tl.fromTo(h1Ref.current,
        { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3");
      tl.fromTo(subRef.current,
        { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");
      tl.fromTo(credoRefs.current.filter(Boolean),
        { x: -16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35, stagger: 0.06 }, "-=0.2");
      tl.fromTo(fieldRefs.current.filter(Boolean),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.06 }, "-=0.6");
    });
    return () => ctx.revert();
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) return;
    setSubmitted(true);
    gsap.timeline()
      .to(btnRef.current, { scale: 0.96, duration: 0.1 })
      .to(btnRef.current, { scale: 1, duration: 0.2, ease: "back.out(2)" });
    setTimeout(() => {
      gsap.fromTo(successRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
    }, 250);
  };

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const selectedBelt = BELT_LEVELS.find((b) => b.value === form.beltLevel);
  const strength = Math.min(Math.floor(form.password.length / 3), 4);

  return (
    // Full screen relative container positioned below the 72px Navbar
    <div className="relative w-full min-h-[calc(100vh-72px)] flex bg-bushido-surface mt-[72px]">

      {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
      <div
        ref={leftRef}
        className="relative hidden lg:flex flex-col justify-between w-[45%] shrink-0 bg-gradient-to-b from-[#121212] to-[#0a0a0a] px-12 py-12 sticky top-[72px] h-[calc(100vh-72px)] overflow-hidden border-r border-white/5"
      >
        {/* Subtle crimson accent line at the left */}
        <div className="absolute top-0 left-0 w-1 h-full bg-[#BE0027] z-20" />

        {/* Washi paper texture overlay */}
        <div className="washi-overlay" />

        {/* Giant Kanji Watermark in the background */}
        <span
          className="absolute -bottom-16 -right-16 font-serif leading-none select-none pointer-events-none z-0"
          style={{ fontSize: 360, color: "rgba(190, 0, 39, 0.02)" }}
        >
          武
        </span>

        {/* TOP: Unified Brand Logo + Sabaki Headline */}
        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          {/* Logo */}
          <div ref={logoRef} className="flex flex-col items-center text-center gap-2.5">
            {/* The Octagonal Ashihara Logo Mark */}
            <div className="w-12 h-12 border border-[#BE0027] rounded-[4px] flex items-center justify-center bg-black/40 shrink-0">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <polygon
                  points="18,2 34,10 34,26 18,34 2,26 2,10"
                  stroke="#BE0027"
                  strokeWidth="2"
                  fill="none"
                />
                <text
                  x="18"
                  y="23"
                  textAnchor="middle"
                  fontSize="13"
                  fontFamily="serif"
                  fontWeight="bold"
                  fill="#BE0027"
                >
                  芦
                </text>
              </svg>
            </div>
            <div className="flex flex-col leading-tight items-center">
              <span className="font-cinzel font-bold text-[14px] text-white tracking-[0.12em]">
                DADI BULSARA
              </span>
              <span className="font-cormorant text-[10px] text-[#BE0027] tracking-[0.4em] font-light">
                ASHIHARA KARATE
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="flex flex-col items-center">
            <span className="font-inter text-[9px] font-bold tracking-[0.25em] uppercase text-[#BE0027]">
              Sabaki Federation
            </span>
            <h1
              ref={h1Ref}
              className="mt-2 font-cinzel font-bold text-white leading-[1.15] tracking-wide text-center"
              style={{ fontSize: "clamp(28px, 2.3vw, 38px)" }}
            >
              DISCIPLINE.
              <br />
              STRENGTH.
              <br />
              <span className="text-[#BE0027]">SABAKI.</span>
            </h1>
            <p
              ref={subRef}
              className="mt-4 font-cormorant italic text-[16px] text-white/70 leading-relaxed max-w-xs text-center"
            >
              &quot;Mastering Ashihara Karate is the integration of dynamic movement, blind-spot positioning, and effortless control.&quot;
            </p>
          </div>
        </div>

        {/* BOTTOM: Dojo Kun (Eight Codes of Bushido) */}
        <div className="relative z-10 mt-6 flex flex-col items-center w-full">
          <div className="flex items-center justify-center gap-2.5 mb-4 w-full">
            <div className="h-px bg-[#BE0027] w-6" />
            <p className="font-inter text-[10px] font-bold tracking-[0.25em] uppercase text-white/50 text-center">
              Dojo Kun — The Eight Codes
            </p>
            <div className="h-px bg-[#BE0027] w-6" />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {([
              ["義", "Gi", "Rectitude"],
              ["勇", "Yu", "Courage"],
              ["仁", "Jin", "Benevolence"],
              ["礼", "Rei", "Respect"],
              ["誠", "Makoto", "Sincerity"],
              ["名誉", "Meiyo", "Honor"],
              ["忠義", "Chugi", "Loyalty"],
              ["自制", "Jisei", "Self-Control"],
            ] as [string, string, string][]).map(([kanji, romaji, english], i) => (
              <div
                key={english}
                ref={(el) => { credoRefs.current[i] = el as HTMLDivElement | null; }}
                className="flex flex-col items-center justify-center p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-[#BE0027]/30 rounded-[4px] transition-all duration-300 group text-center"
              >
                <span className="font-serif text-[22px] text-[#BE0027] leading-none mb-2 transition-transform duration-300 group-hover:scale-110">
                  {kanji}
                </span>
                <span className="font-inter text-[10px] font-bold tracking-[0.12em] text-white/90 uppercase">
                  {english}
                </span>
                <span className="font-cormorant text-[11px] text-white/40 mt-0.5">
                  {romaji}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
      <div
        ref={rightRef}
        className="flex-1 bg-bushido-surface px-6 py-10 md:py-16"
      >
        <div className="min-h-full flex flex-col justify-center items-center">
          <div className="w-full max-w-[460px] my-auto">

            {/* Mobile Header (Logo + Sign In inline) */}
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-bushido-primary rounded-[4px] flex items-center justify-center font-montserrat font-extrabold text-base text-white shrink-0">
                  武
                </div>
                <span className="font-montserrat font-extrabold text-[15px] text-bushido-charcoal tracking-tight">
                  BUSHIDO DIGITAL
                </span>
              </div>
              <Link href="/login" className="text-bushido-primary text-sm font-semibold hover:underline">
                Sign in
              </Link>
            </div>

            {/* Desktop-only Sign in link */}
            <p className="hidden lg:block font-inter text-sm text-bushido-on-surface-variant text-right mb-8">
              Already a member?{" "}
              <Link href="/login" className="text-bushido-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>

            {/* Header */}
            <div ref={(el) => { fieldRefs.current[0] = el; }} className="mb-7">
              <p className="font-inter text-[11px] font-semibold tracking-widest uppercase text-bushido-primary mb-2">
                Registration
              </p>
              <h2 className="font-montserrat font-extrabold text-[26px] text-bushido-charcoal tracking-[-0.02em] leading-tight">
                Create your account
              </h2>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* Name row */}
              <div ref={(el) => { fieldRefs.current[1] = el; }} className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="bd-label">First name</label>
                  <input id="firstName" type="text" placeholder="Kenji"
                    value={form.firstName} onChange={set("firstName")}
                    className="bd-input" required />
                </div>
                <div>
                  <label htmlFor="lastName" className="bd-label">Last name</label>
                  <input id="lastName" type="text" placeholder="Tanaka"
                    value={form.lastName} onChange={set("lastName")}
                    className="bd-input" required />
                </div>
              </div>

              {/* Email */}
              <div ref={(el) => { fieldRefs.current[2] = el; }}>
                <label htmlFor="email" className="bd-label">Email address</label>
                <input id="email" type="email" placeholder="you@dojo.com"
                  value={form.email} onChange={set("email")}
                  className="bd-input" required />
              </div>

              {/* Password */}
              <div ref={(el) => { fieldRefs.current[3] = el; }}>
                <label htmlFor="password" className="bd-label">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="8+ characters"
                    value={form.password}
                    onChange={set("password")}
                    className="bd-input pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-bushido-on-surface-variant hover:text-bushido-charcoal"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {/* Strength bar */}
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((lvl) => (
                    <div
                      key={lvl}
                      className={`flex-1 h-0.75 rounded-sm transition-colors duration-200 ${
                        strength >= lvl ? STRENGTH_COLORS[lvl - 1] : "bg-bushido-outline"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Belt rank */}
              <div ref={(el) => { fieldRefs.current[4] = el; }}>
                <label htmlFor="beltLevel" className="bd-label">Belt rank</label>
                <div className="relative">
                  <select
                    id="beltLevel"
                    value={form.beltLevel}
                    onChange={set("beltLevel")}
                    className="bd-input bd-select appearance-none cursor-pointer pr-10"
                  >
                    <option value="">Select your belt level</option>
                    {BELT_LEVELS.map((b) => (
                      <option key={b.value} value={b.value}>{b.label} Belt</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                    <svg width="11" height="7" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1l5 5 5-5" stroke="#121212" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                {selectedBelt && (
                  <div className="mt-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-inter text-[11px] font-semibold tracking-wider uppercase border"
                      style={{
                        backgroundColor: selectedBelt.hex,
                        color: selectedBelt.dark ? "#fff" : "#121212",
                        borderColor: selectedBelt.dark ? "transparent" : "rgba(0,0,0,0.18)",
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ background: selectedBelt.dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.18)" }}
                      />
                      {selectedBelt.label} Belt
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-bushido-outline w-full" />

              {/* Terms checkbox */}
              <div ref={(el) => { fieldRefs.current[5] = el; }}>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.agreed}
                    onChange={(e) => setForm((p) => ({ ...p, agreed: e.target.checked }))}
                    className="sr-only"
                  />
                  <div
                    className={`mt-0.5 w-4 h-4 shrink-0 rounded-[3px] border flex items-center justify-center transition-colors ${
                      form.agreed
                        ? "bg-bushido-primary border-bushido-primary"
                        : "bg-white border-bushido-charcoal group-hover:border-bushido-primary"
                    }`}
                  >
                    {form.agreed && <Check size={11} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="font-inter text-[13px] leading-relaxed text-bushido-on-surface-variant select-none">
                    I accept the{" "}
                    <Link href="/terms" className="text-bushido-primary font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-bushido-primary font-semibold hover:underline" onClick={(e) => e.stopPropagation()}>
                      Privacy Policy
                    </Link>.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div ref={(el) => { fieldRefs.current[6] = el; }}>
                <button
                  ref={btnRef}
                  type="submit"
                  disabled={!form.agreed || submitted}
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-bushido-primary hover:enabled:bg-bushido-charcoal text-white rounded-[4px] font-inter text-[13px] font-semibold tracking-wider uppercase disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  {submitted
                    ? <><Check size={15} />Account created</>
                    : <>Begin your journey<ArrowRight size={15} /></>
                  }
                </button>
              </div>

              {/* Success */}
              {submitted && (
                <div
                  ref={successRef}
                  className="px-4 py-3 bg-green-50 border border-green-300 rounded-[4px] opacity-0"
                >
                  <p className="font-inter text-sm font-semibold text-green-800">
                    Welcome to Bushido Digital. Check your inbox to verify your email.
                  </p>
                </div>
              )}
            </form>

            <p className="font-inter text-xs text-bushido-on-surface-variant mt-8 text-center">
              © {new Date().getFullYear()} Bushido Digital Federation. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}