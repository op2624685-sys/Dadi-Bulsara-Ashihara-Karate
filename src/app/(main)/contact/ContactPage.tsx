"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Send, Mail, Phone, MapPin, Shield, Crown, Star,
    ChevronRight, CheckCircle2, AlertCircle, User, MessageSquare
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Federation Members Data ──────────────────────────────────────────────────
const FEDERATION_MEMBERS = [
    {
        name: "Shihan Dadi Bulsara",
        position: "Chief Instructor & Founder",
        rank: "8th Dan Black Belt",
        email: "dadi@dadibulsara.com",
        phone: "+91 98000 00001",
        icon: Crown,
        badge: "Founder",
    },
    {
        name: "Sensei Arjun Mehta",
        position: "Technical Director",
        rank: "5th Dan Black Belt",
        email: "arjun.mehta@dadibulsara.com",
        phone: "+91 98000 00002",
        icon: Shield,
        badge: "Technical",
    },
    {
        name: "Sensei Priya Sharma",
        position: "Head of Women's Division",
        rank: "4th Dan Black Belt",
        email: "priya.sharma@dadibulsara.com",
        phone: "+91 98000 00003",
        icon: Star,
        badge: "Division Head",
    },
    {
        name: "Sempai Rohan Desai",
        position: "Youth Programme Director",
        rank: "3rd Dan Black Belt",
        email: "rohan.desai@dadibulsara.com",
        phone: "+91 98000 00004",
        icon: Star,
        badge: "Youth",
    },
    {
        name: "Sempai Kavita Nair",
        position: "Events & Competition Manager",
        rank: "2nd Dan Black Belt",
        email: "kavita.nair@dadibulsara.com",
        phone: "+91 98000 00005",
        icon: Star,
        badge: "Events",
    },
    {
        name: "Mr. Vikram Joshi",
        position: "Federation Secretary",
        rank: "Administrative Head",
        email: "vikram.joshi@dadibulsara.com",
        phone: "+91 98000 00006",
        icon: Shield,
        badge: "Admin",
    },
];

const BADGE_COLORS: Record<string, string> = {
    Founder: "bg-[#BE0027]/20 text-[#BE0027] border-[#BE0027]/30",
    Technical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Division Head": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Youth: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Events: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Admin: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const membersRef = useRef<HTMLDivElement>(null);
    const memberCardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const btnRef = useRef<HTMLButtonElement>(null);

    // ── Entrance Animation ───────────────────────────────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
            tl.fromTo(heroRef.current,
                { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
            tl.fromTo(formRef.current,
                { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5");

            // Member cards stagger on scroll
            memberCardRefs.current.filter(Boolean).forEach((card, i) => {
                gsap.fromTo(card,
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.6,
                        delay: i * 0.08,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                        }
                    }
                );
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.message || !form.name) return;
        setStatus("sending");

        // Button pulse animation
        gsap.timeline()
            .to(btnRef.current, { scale: 0.97, duration: 0.1 })
            .to(btnRef.current, { scale: 1, duration: 0.3, ease: "back.out(2)" });

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus("success");
                setForm({ name: "", email: "", subject: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full min-h-screen mt-18 bg-gradient-to-tr from-[#060606] via-[#0c0c0c] to-[#060606] overflow-hidden selection:bg-[#BE0027]/30"
        >
            {/* ── Ambient Glows ── */}
            <div className="fixed top-0 left-1/4 w-[600px] h-[800px] bg-[#BE0027]/4 blur-[160px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[600px] h-[800px] bg-[#BE0027]/3 blur-[180px] rounded-full pointer-events-none" />

            <div className="relative z-10 mx-auto px-6 md:px-10 py-16 flex flex-col gap-20">

                {/* ══════════════════════════════════════════════════
                    SECTION 1 — HERO HEADER
                ══════════════════════════════════════════════════ */}
                <div ref={heroRef} className="flex flex-col items-center text-center gap-4">
                    <span className="font-inter text-[9px] font-bold tracking-[0.35em] uppercase text-[#BE0027] bg-[#BE0027]/10 px-4 py-1.5 rounded-full border border-[#BE0027]/20">
                        Sabaki Federation — Contact
                    </span>
                    <h1 className="font-cinzel font-bold text-4xl md:text-6xl text-white tracking-wide leading-[1.15] max-w-3xl">
                        REACH THE <br />
                        <span className="text-[#BE0027] drop-shadow-[0_0_20px_rgba(190,0,39,0.4)]">DOJO.</span>
                    </h1>
                    <p className="font-cormorant italic text-lg text-white/40 leading-relaxed max-w-xl">
                        &quot;The door to the dojo is always open for those who seek.&quot;
                    </p>
                    {/* Decorative divider */}
                    <div className="flex items-center gap-4 mt-2 w-full max-w-xs">
                        <div className="h-[1px] bg-gradient-to-r from-transparent to-[#BE0027]/50 flex-1" />
                        <div className="w-1.5 h-1.5 bg-[#BE0027] rounded-full" />
                        <div className="h-[1px] bg-gradient-to-l from-transparent to-[#BE0027]/50 flex-1" />
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    SECTION 2 — CONTACT FORM + INFO SIDEBAR
                ══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_650px] gap-10 w-[95vw] max-w-[1800px] mx-auto">

                    {/* ── FORM PANEL ── */}
                    <div
                        ref={formRef}
                        className="relative bg-white/[0.02] h-[60vh] gap-10 flex flex-col justify-center backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-14 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BE0027] to-transparent" />

                        <div className="mb-8">
                            <p className="font-inter text-[14px] font-bold tracking-[0.3em] uppercase text-[#BE0027] mb-2">Send a Message</p>
                            <h2 className="font-cinzel font-bold text-5xl text-white tracking-wide">Get In Touch</h2>
                            <p className="font-inter text-sm text-white/40 mt-2">Fill out the form below and our team will get back to you within 24 hours.</p>
                        </div>

                        {status === "success" ? (
                            /* ── Success State ── */
                            <div className="flex flex-col items-center text-center py-12 gap-4">
                                <div className="w-16 h-16 rounded-full bg-[#BE0027]/10 border border-[#BE0027]/20 flex items-center justify-center shadow-[0_0_20px_rgba(190,0,39,0.2)]">
                                    <CheckCircle2 size={28} className="text-[#BE0027]" />
                                </div>
                                <h3 className="font-cinzel font-bold text-xl text-white">Message Delivered</h3>
                                <p className="font-inter text-sm text-white/50 max-w-sm leading-relaxed">
                                    Aapka message humein mil gaya. Hum jald hi aapke email par jawab denge.
                                </p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="mt-4 font-inter text-sm text-[#BE0027] hover:text-white border border-[#BE0027]/30 hover:border-white/20 px-6 py-5 rounded-4xl transition-all duration-300"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

                                {/* Row: Name + Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-2.5">
                                        <label className="flex items-center gap-1.5 font-inter text-mb font-semibold tracking-wider text-white/50 uppercase">
                                            <User size={11} /> Full Name
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Your full name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-5 bg-white/[0.03] focus:bg-white/[0.06] border border-white/10 focus:border-[#BE0027] text-white rounded-b-xl font-inter text-mb placeholder:text-white/25 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2.5">
                                        <label className="flex items-center gap-1.5 font-inter text-mb font-semibold tracking-wider text-white/50 uppercase">
                                            <Mail size={11} /> Email Address
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-6 py-5 bg-white/[0.03] focus:bg-white/[0.06] border border-white/10 focus:border-[#BE0027] text-white rounded-b-xl font-inter text-mb placeholder:text-white/25 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="flex flex-col gap-2.5">
                                    <label className="flex items-center gap-1.5 font-inter text-mb font-semibold tracking-wider text-white/50 uppercase">
                                        <ChevronRight size={11} /> Subject
                                    </label>
                                    <input
                                        name="subject"
                                        type="text"
                                        placeholder="What is this regarding?"
                                        value={form.subject}
                                        onChange={handleChange}
                                        className="w-full px-6 py-5 bg-white/[0.03] focus:bg-white/[0.06] border border-white/10 focus:border-[#BE0027] text-white rounded-b-xl font-inter text-mb placeholder:text-white/25 transition-all outline-none"
                                    />
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-2.5">
                                    <label className="flex items-center gap-1.5 font-inter text-mb font-semibold tracking-wider text-white/50 uppercase">
                                        <MessageSquare size={11} /> Message
                                    </label>
                                    <textarea
                                        name="message"
                                        placeholder="Write your message here..."
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={7}
                                        className="w-full px-6 py-6.5 bg-white/[0.03] focus:bg-white/[0.06] border border-white/10 focus:border-[#BE0027] text-white rounded-b-xl font-inter text-mb placeholder:text-white/25 transition-all outline-none resize-none"
                                    />
                                </div>

                                {/* Error state */}
                                {status === "error" && (
                                    <div className="flex items-center gap-2.5 px-4 py-3 bg-[#BE0027]/10 border border-[#BE0027]/20 rounded-xl">
                                        <AlertCircle size={18} className="text-[#BE0027] shrink-0" />
                                        <p className="font-inter text-xs text-[#BE0027]">Something went wrong. Please try again or contact us directly.</p>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    ref={btnRef}
                                    type="submit"
                                    disabled={status === "sending"}
                                    className="w-full flex items-center justify-center gap-3 py-5 px-8 bg-[#BE0027] hover:enabled:bg-[#02be34] hover:enabled:text-black hover:enabled:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-b-xl font-inter text-base font-bold tracking-widest uppercase transition-all duration-300"
                                >
                                    {status === "sending" ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>Send Message <Send size={18} /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ── INFO SIDEBAR ── */}
                    <div className="h-full flex flex-col gap-6">

                        {/* Dojo Info Card */}
                        <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)] overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BE0027]/60 to-transparent" />
                            <p className="font-inter text-[10px] font-bold tracking-[0.3em] uppercase text-[#BE0027] mb-4">Federation HQ</p>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-3.5 group">
                                    <div className="w-8 h-8 rounded-lg bg-[#BE0027]/10 border border-[#BE0027]/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <MapPin size={14} className="text-[#BE0027]" />
                                    </div>
                                    <div>
                                        <p className="font-inter text-xs font-semibold text-white/70 uppercase tracking-wider">Dojo Address</p>
                                        <p className="font-inter text-sm text-white/50 mt-0.5 leading-relaxed">23, Martial Arts Complex,<br />Sector 7, Mumbai – 400001</p>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-white/5" />

                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#BE0027]/10 border border-[#BE0027]/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Mail size={14} className="text-[#BE0027]" />
                                    </div>
                                    <div>
                                        <p className="font-inter text-xs font-semibold text-white/70 uppercase tracking-wider">General Email</p>
                                        <a href="mailto:info@dadibulsara.com" className="font-inter text-sm text-white/50 hover:text-[#BE0027] transition-colors mt-0.5 block">
                                            info@dadibulsara.com
                                        </a>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-white/5" />

                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#BE0027]/10 border border-[#BE0027]/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Phone size={14} className="text-[#BE0027]" />
                                    </div>
                                    <div>
                                        <p className="font-inter text-xs font-semibold text-white/70 uppercase tracking-wider">Main Line</p>
                                        <a href="tel:+919800000000" className="font-inter text-sm text-white/50 hover:text-[#BE0027] transition-colors mt-0.5 block">
                                            +91 98000 00000
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Training Hours Card */}
                        <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)] overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <p className="font-inter text-[10px] font-bold tracking-[0.3em] uppercase text-[#BE0027] mb-4">Training Hours</p>
                            <div className="flex flex-col gap-2.5">
                                {[
                                    ["Mon – Fri", "06:00 AM – 08:00 PM"],
                                    ["Saturday", "07:00 AM – 06:00 PM"],
                                    ["Sunday", "08:00 AM – 12:00 PM"],
                                ].map(([day, time]) => (
                                    <div key={day} className="flex items-center justify-between">
                                        <span className="font-inter text-xs text-white/40 font-medium">{day}</span>
                                        <span className="font-inter text-xs text-white/70 font-semibold">{time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    SECTION 3 — FEDERATION MEMBERS
                ══════════════════════════════════════════════════ */}
                <div ref={membersRef}>
                    {/* Section Header */}
                    <div className="flex flex-col items-center text-center gap-3 mb-12">
                        <span className="font-inter text-[9px] font-bold tracking-[0.35em] uppercase text-[#BE0027] bg-[#BE0027]/10 px-4 py-1.5 rounded-full border border-[#BE0027]/20">
                            Official Directory
                        </span>
                        <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-white tracking-wide">
                            Federation <span className="text-[#BE0027]">Members</span>
                        </h2>
                        <p className="font-cormorant italic text-base text-white/40 max-w-lg">
                            Our official representatives and senior members of the Sabaki Federation
                        </p>
                        <div className="flex items-center gap-4 mt-1 w-full max-w-xs">
                            <div className="h-[1px] bg-gradient-to-r from-transparent to-[#BE0027]/50 flex-1" />
                            <div className="w-1.5 h-1.5 bg-[#BE0027] rounded-full" />
                            <div className="h-[1px] bg-gradient-to-l from-transparent to-[#BE0027]/50 flex-1" />
                        </div>
                    </div>

                    {/* Members Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {FEDERATION_MEMBERS.map((member, i) => {
                            const Icon = member.icon;
                            const badgeClass = BADGE_COLORS[member.badge] || BADGE_COLORS["Admin"];
                            return (
                                <div
                                    key={member.email}
                                    ref={(el) => { memberCardRefs.current[i] = el as HTMLDivElement | null; }}
                                    className="group relative bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl border border-white/8 hover:border-[#BE0027]/25 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-400 overflow-hidden"
                                >
                                    {/* Top accent on hover */}
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BE0027]/0 group-hover:via-[#BE0027]/50 to-transparent transition-all duration-500" />

                                    {/* Card Header */}
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-[#BE0027]/10 border border-[#BE0027]/20 flex items-center justify-center group-hover:bg-[#BE0027]/15 transition-colors duration-300 shrink-0">
                                                <Icon size={18} className="text-[#BE0027]" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-cinzel font-bold text-[13px] text-white leading-tight truncate">{member.name}</span>
                                                <span className="font-inter text-[11px] text-white/40 mt-0.5 truncate">{member.rank}</span>
                                            </div>
                                        </div>
                                        <span className={`font-inter text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border shrink-0 ml-2 ${badgeClass}`}>
                                            {member.badge}
                                        </span>
                                    </div>

                                    {/* Position */}
                                    <p className="font-inter text-xs font-semibold text-white/60 uppercase tracking-wider mb-4 pb-4 border-b border-white/5">
                                        {member.position}
                                    </p>

                                    {/* Contact Details */}
                                    <div className="flex flex-col gap-3">
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="flex items-center gap-2.5 group/link"
                                        >
                                            <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center shrink-0">
                                                <Mail size={11} className="text-white/30 group-hover/link:text-[#BE0027] transition-colors" />
                                            </div>
                                            <span className="font-inter text-xs text-white/40 group-hover/link:text-white/70 transition-colors truncate">
                                                {member.email}
                                            </span>
                                        </a>
                                        <a
                                            href={`tel:${member.phone.replace(/\s/g, "")}`}
                                            className="flex items-center gap-2.5 group/link"
                                        >
                                            <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center shrink-0">
                                                <Phone size={11} className="text-white/30 group-hover/link:text-[#BE0027] transition-colors" />
                                            </div>
                                            <span className="font-inter text-xs text-white/40 group-hover/link:text-white/70 transition-colors">
                                                {member.phone}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Footer Note ── */}
                <p className="font-inter text-[11px] tracking-wider text-white/20 uppercase text-center pb-4">
                    © 2026 Dadi Bulsara Ashihara Karate Federation. All rights reserved.
                </p>
            </div>
        </div>
    );
}