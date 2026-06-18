"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const h1Ref = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const credoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);

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
        if (!email) return;
        setSubmitted(true);
        gsap.timeline()
            .to(btnRef.current, { scale: 1.05, duration: 0.1 })
            .to(btnRef.current, { scale: 1, duration: 0.2, ease: "back.out(2)" });
    };

    return (
        /* Outer container: fixed to viewport minus navbar, padding so boxes dont touch edges */
        <div
            ref={containerRef}
            className="relative w-full h-screen mt-[72px] flex items-center justify-center bg-gradient-to-tr from-[#060606] via-[#0c0c0c] to-[#060606] px-6 md:px-10 py-8 overflow-hidden selection:bg-[#BE0027]/30"
        >
            {/* Ambient Red Glows */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#BE0027]/5 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-[#BE0027]/5 blur-[160px] rounded-full pointer-events-none" />

            {/* Main Grid — fixed height = viewport - navbar - vertical padding (py-8 = 4rem total) */}
            <div className="w-full max-w-[1300px] h-[780px] flex flex-col lg:flex-row gap-10 items-stretch relative z-10">

                {/* ── LEFT PANEL ── */}
                <div
                    ref={leftRef}
                    className="relative hidden lg:flex flex-col justify-between w-full lg:w-[50%] bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-10 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BE0027] to-transparent" />
                    <span className="absolute -bottom-16 -right-16 font-serif text-white/[0.02] leading-none select-none pointer-events-none z-0" style={{ fontSize: 380 }}>
                        武
                    </span>

                    {/* TOP */}
                    <div className="relative z-10 flex flex-col items-center text-center gap-6">
                        <div ref={logoRef} className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 border border-[#BE0027]/40 rounded-xl flex items-center justify-center bg-black/60 shadow-[0_0_25px_rgba(190,0,39,0.15)]">
                                <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                                    <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" stroke="#BE0027" strokeWidth="2" fill="none" />
                                    <text x="18" y="23" textAnchor="middle" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#BE0027">DB</text>
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
                            <h1 ref={h1Ref} className="mt-4 font-cinzel font-bold text-white leading-[1.25] tracking-wide text-center text-[28px]">
                                RESET PASSWORD.<br />RESTORE ACCESS.<br />
                                <span className="text-[#BE0027] drop-shadow-[0_0_15px_rgba(190,0,39,0.35)]">RECOVER.</span>
                            </h1>
                            <p ref={subRef} className="mt-4 font-cormorant italic text-[15px] text-white/50 leading-relaxed max-w-sm">
                                &quot;True path demands resilience. Overcome the barrier and return to your training.&quot;
                            </p>
                        </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="relative z-10 flex flex-col items-center w-full mt-4">
                        <div className="flex items-center justify-center gap-3 mb-4 w-full">
                            <div className="h-[1px] bg-gradient-to-r from-transparent to-[#BE0027]/40 flex-1" />
                            <p className="font-inter text-[9px] font-semibold tracking-[0.25em] uppercase text-white/30 text-center shrink-0">
                                Dojo Kun — The Eight Codes
                            </p>
                            <div className="h-[1px] bg-gradient-to-l from-transparent to-[#BE0027]/40 flex-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 w-full">
                            {[
                                ["義", "Gi", "Rectitude"], ["勇", "Yu", "Courage"],
                                ["仁", "Jin", "Benevolence"], ["礼", "Rei", "Respect"],
                                ["誠", "Makoto", "Sincerity"], ["名誉", "Meiyo", "Honor"],
                                ["忠義", "Chugi", "Loyalty"], ["自制", "Jisei", "Self-Control"],
                            ].map(([kanji, romaji, english], i) => (
                                <div
                                    key={english}
                                    ref={(el) => { credoRefs.current[i] = el as HTMLDivElement | null; }}
                                    className="flex items-center gap-3 p-2.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-[#BE0027]/30 rounded-xl transition-all duration-300 group"
                                >
                                    <span className="font-serif text-[17px] text-[#BE0027] leading-none transition-transform duration-300 group-hover:scale-110 w-5 text-center shrink-0">
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

                {/* ── RIGHT PANEL ── */}
                <div
                    ref={rightRef}
                    className="w-full lg:w-[50%] bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-8 md:p-12"
                >
                    {/* Content centered, max width locked */}
                    <div className="w-full max-w-[540px] flex flex-col gap-10">

                        {/* Back to sign in — top of content block */}
                        <div className="flex items-center mb-1">
                            <Link href="/login" className="flex items-center gap-2 font-inter text-sm text-white/50 hover:text-white transition-colors group">
                                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                                Back to sign in
                            </Link>
                        </div>

                        {/* Title */}
                        <div ref={(el) => { fieldRefs.current[0] = el; }} className="mb-8">
                            <p className="font-inter text-xs font-bold tracking-[0.25em] uppercase text-[#BE0027] mb-2">Recovery System</p>
                            <h2 className="font-cinzel font-bold text-2xl md:text-3xl text-white tracking-wide leading-tight">Forgot Password?</h2>
                            <p className="font-inter text-sm text-white/50 mt-3 leading-relaxed">
                                Koi baat nahi. Apna registered email address dalein, hum aapko recovery code bhej denge.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 w-full">
                            {!submitted ? (
                                <>
                                    <div ref={(el) => { fieldRefs.current[1] = el; }} className="flex flex-col gap-2 w-full">
                                        <label htmlFor="email" className="text-sm font-medium text-white/70 tracking-wide font-inter ml-1">Account email address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="you@dojo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-6 py-4 bg-white/[0.03] focus:bg-white/[0.06] border border-white/10 focus:border-[#BE0027] text-white rounded-xl font-inter text-base placeholder:text-white/30 transition-all outline-none shadow-md"
                                            required
                                        />
                                    </div>
                                    <div ref={(el) => { fieldRefs.current[2] = el; }}>
                                        <button
                                            ref={btnRef}
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-3.5 py-4 px-8 bg-[#BE0027] hover:enabled:bg-white hover:enabled:text-black hover:enabled:shadow-[0_0_25px_rgba(255,255,255,0.25)] active:enabled:scale-105 text-white rounded-xl font-inter text-base font-bold tracking-widest uppercase transition-all duration-300 transform"
                                        >
                                            Send Instructions <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div ref={(el) => { fieldRefs.current[3] = el; }} className="flex flex-col items-center text-center p-6 bg-white/[0.02] border border-[#BE0027]/20 rounded-xl animate-fade-in">
                                    <div className="w-12 h-12 rounded-full bg-[#BE0027]/10 flex items-center justify-center text-[#BE0027] mb-4 shadow-[0_0_15px_rgba(190,0,39,0.2)]">
                                        <Mail size={22} />
                                    </div>
                                    <h3 className="font-cinzel font-bold text-lg text-white mb-2">Check Your Inbox</h3>
                                    <p className="font-inter text-sm text-white/60 leading-relaxed max-w-sm">
                                        Humne recovery link aapke email <span className="text-white font-semibold">{email}</span> par bhej diya hai.
                                    </p>
                                </div>
                            )}
                        </form>

                        {/* Copyright */}
                        <p className="font-inter text-[11px] tracking-wider text-white/30 uppercase mt-10 text-center w-full">
                            © 2026 Dadi Bulsara Ashihara Karate Federation. All rights reserved.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}