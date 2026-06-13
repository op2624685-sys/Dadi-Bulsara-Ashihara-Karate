"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
    MapPin, Users, Calendar, Trophy, Globe, ChevronRight, Flag, Shield, Star, Flame
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── DATA ─────────────────────────────────────────────────────────────────────

const BRANCHES = [
    { city: "Mumbai", location: "Dadar, West", students: 120, since: 2005 },
    { city: "Pune", location: "Kothrud", students: 85, since: 2008 },
    { city: "Delhi", location: "Lajpat Nagar", students: 70, since: 2011 },
    { city: "Bangalore", location: "Koramangala", students: 60, since: 2013 },
    { city: "Ahmedabad", location: "Navrangpura", students: 55, since: 2015 },
    { city: "Surat", location: "Athwa Lines", students: 45, since: 2017 },
    { city: "Hyderabad", location: "Banjara Hills", students: 50, since: 2018 },
    { city: "Nagpur", location: "Dharampeth", students: 38, since: 2020 },
];

const MILESTONES = [
    { year: 2003, event: "Foundation", detail: "Shihan Dadi Bulsara established the Ashihara Kai Kan Foundation in Mumbai after training under Kancho Hideyuki Ashihara in Japan for over a decade.", icon: Flame },
    { year: 2005, event: "First Dojo", detail: "The inaugural dojo opened in Dadar, Mumbai with 12 founding students. The first formal grading examination was conducted the same year.", icon: Shield },
    { year: 2007, event: "National Recognition", detail: "Officially recognized by the All India Karate Federation. Hosted the first National Sabaki Challenge tournament attracting 200+ participants.", icon: Trophy },
    { year: 2009, event: "International Camp", detail: "First international training camp held in collaboration with Ashihara Karate World Headquarters, Japan. 40 students participated.", icon: Globe },
    { year: 2012, event: "5 Branches Milestone", detail: "Expansion across Maharashtra and Delhi. 350+ active students across all dojos.", icon: MapPin },
    { year: 2015, event: "Junior Programme", detail: "Launched the Kodomo (Children's) Ashihara Programme, introducing Karate to children aged 5–14. Over 200 children enrolled in year one.", icon: Users },
    { year: 2018, event: "Pan-India Expansion", detail: "Crossed 7 active dojos and 500 registered students. First South Indian dojo opens in Hyderabad.", icon: Flag },
    { year: 2021, event: "Online Grading System", detail: "Pioneered digital grading records and belt certification in Indian Ashihara Karate. Conducted first virtual national camp during lockdown.", icon: Star },
    { year: 2024, event: "20 Year Celebration", detail: "Grand Anniversary Camp at Alibaug. 600+ students, 8 branches, international Sensei guests from Japan, Netherlands and Australia.", icon: Trophy },
];

const CAMPS = [
    { year: 2009, title: "Sabaki Summer Camp", location: "Lonavala, Maharashtra", participants: 40, highlight: "First international instructors from Japan" },
    { year: 2011, title: "National Gasshuku", location: "Mahabaleshwar", participants: 75, highlight: "Kata & Kumite intensive — 5 days" },
    { year: 2013, title: "Sabaki Challenge Camp", location: "Alibaug Beach", participants: 95, highlight: "Beach Sabaki training — 3 days" },
    { year: 2015, title: "Pan-India Training Camp", location: "Pune Military Grounds", participants: 130, highlight: "Military conditioning + Karate" },
    { year: 2017, title: "Youth Warriors Camp", location: "Nashik", participants: 110, highlight: "Exclusively for under-18 students" },
    { year: 2019, title: "International Gasshuku", location: "Mumbai Dojo HQ", participants: 180, highlight: "Sensei from Japan, Netherlands, Australia" },
    { year: 2021, title: "Virtual National Camp", location: "Online (COVID Edition)", participants: 220, highlight: "First-ever virtual Ashihara Camp in India" },
    { year: 2023, title: "Black Belt Invitational", location: "Goa", participants: 95, highlight: "Exclusive Dan-grade practitioners only" },
    { year: 2024, title: "20th Anniversary Grand Camp", location: "Alibaug, Maharashtra", participants: 340, highlight: "Largest camp in federation history" },
];

const STATS = [
    { value: "21+", label: "Years of Excellence" },
    { value: "8", label: "Active Dojos" },
    { value: "600+", label: "Registered Students" },
    { value: "9", label: "Camps Conducted" },
    { value: "15+", label: "Black Belt Holders" },
    { value: "3", label: "International Partners" },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroTextRef = useRef<HTMLDivElement>(null);
    const storyRef = useRef<HTMLDivElement>(null);
    const statRefs = useRef<(HTMLDivElement | null)[]>([]);
    const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);
    const branchRefs = useRef<(HTMLDivElement | null)[]>([]);
    const campRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Hero entrance
            gsap.fromTo(heroTextRef.current,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
            );

            // Story section
            gsap.fromTo(storyRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out",
                  scrollTrigger: { trigger: storyRef.current, start: "top 85%" } }
            );

            // Stats counter-like reveal
            statRefs.current.filter(Boolean).forEach((el, i) => {
                gsap.fromTo(el,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, delay: i * 0.07, ease: "power3.out",
                      scrollTrigger: { trigger: el, start: "top 90%" } }
                );
            });

            // Milestones alternating slide
            milestoneRefs.current.filter(Boolean).forEach((el, i) => {
                gsap.fromTo(el,
                    { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
                      scrollTrigger: { trigger: el, start: "top 88%" } }
                );
            });

            // Branches stagger
            branchRefs.current.filter(Boolean).forEach((el, i) => {
                gsap.fromTo(el,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, delay: i * 0.06, ease: "power3.out",
                      scrollTrigger: { trigger: el, start: "top 92%" } }
                );
            });

            // Camps stagger
            campRefs.current.filter(Boolean).forEach((el, i) => {
                gsap.fromTo(el,
                    { scale: 0.95, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, delay: i * 0.05, ease: "power3.out",
                      scrollTrigger: { trigger: el, start: "top 92%" } }
                );
            });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen mt-[72px] bg-[#060606] overflow-hidden selection:bg-[#BE0027]/30">

            {/* ── Fixed Ambient Glows ── */}
            <div className="fixed top-0 left-0 w-[700px] h-[700px] bg-[#BE0027]/4 blur-[200px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#BE0027]/3 blur-[180px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />

            {/* ════════════════════════════════════════════════════════════════
                HERO — Full-bleed cinematic banner
            ════════════════════════════════════════════════════════════════ */}
            <section className="relative w-full h-[92vh] flex items-end overflow-hidden">

                {/* Background image with overlay */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1800&q=80"
                        alt="Karate training"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    {/* Multi-layer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/60 to-[#060606]/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/80 via-transparent to-[#060606]/40" />
                </div>

                {/* Kanji watermark */}
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-serif text-white/[0.025] leading-none select-none pointer-events-none hidden lg:block" style={{ fontSize: 500 }}>
                    武道
                </span>

                {/* Hero content */}
                <div ref={heroTextRef} className="relative z-10 w-full max-w-[1300px] mx-auto px-6 md:px-10 pb-20 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-12 bg-[#BE0027]" />
                        <span className="font-inter text-[10px] font-bold tracking-[0.4em] uppercase text-[#BE0027]">Est. 2003 — Mumbai, India</span>
                    </div>

                    <h1 className="font-cinzel font-black text-white leading-[1.05] tracking-tight max-w-4xl" style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}>
                        DADI BULSARA<br />
                        <span className="text-[#BE0027] drop-shadow-[0_0_40px_rgba(190,0,39,0.5)]">ASHIHARA</span><br />
                        KAI KAN FOUNDATION
                    </h1>

                    <p className="font-cormorant italic text-white/50 max-w-xl leading-relaxed" style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)" }}>
                        India&apos;s premier Ashihara Karate organisation — built on tradition, forged through Sabaki, and dedicated to the lifelong pursuit of Budo.
                    </p>

                    {/* Quick stats bar */}
                    <div className="flex flex-wrap gap-8 mt-4 pt-6 border-t border-white/10">
                        {[["21+", "Years"], ["600+", "Students"], ["8", "Dojos"], ["9", "Camps"]].map(([num, label]) => (
                            <div key={label} className="flex flex-col">
                                <span className="font-cinzel font-bold text-[#BE0027] text-2xl leading-none">{num}</span>
                                <span className="font-inter text-[10px] tracking-[0.25em] uppercase text-white/40 mt-1">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
                    <div className="w-[1px] h-10 bg-gradient-to-b from-[#BE0027] to-transparent animate-pulse" />
                    <span className="font-inter text-[9px] tracking-[0.3em] uppercase text-white/25">Scroll</span>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                FOUNDER & STORY
            ════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Image side */}
                    <div className="relative">
                        {/* Decorative frame */}
                        <div className="absolute -top-4 -left-4 w-32 h-32 border-t-2 border-l-2 border-[#BE0027]/40 rounded-tl-lg" />
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 border-b-2 border-r-2 border-[#BE0027]/40 rounded-br-lg" />

                        <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                            <Image
                                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
                                alt="Shihan Dadi Bulsara"
                                fill
                                className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/80 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-[#BE0027] font-bold">Founder & Chief Instructor</p>
                                <h3 className="font-cinzel font-bold text-white text-xl mt-1">Shihan Dadi Bulsara</h3>
                                <p className="font-cormorant italic text-white/50 text-sm mt-1">8th Dan Black Belt — Ashihara Karate</p>
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div className="absolute top-6 -right-5 bg-[#BE0027] rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(190,0,39,0.4)]">
                            <p className="font-cinzel font-bold text-white text-lg leading-none">21+</p>
                            <p className="font-inter text-[9px] tracking-wider uppercase text-white/80 mt-0.5">Years</p>
                        </div>
                    </div>

                    {/* Story text */}
                    <div ref={storyRef} className="flex flex-col gap-7">
                        <div>
                            <span className="font-inter text-[9px] font-bold tracking-[0.4em] uppercase text-[#BE0027] bg-[#BE0027]/10 px-3 py-1.5 rounded-full border border-[#BE0027]/20">
                                Our Origin Story
                            </span>
                            <h2 className="font-cinzel font-bold text-white mt-5 leading-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
                                Born from Discipline.<br />
                                <span className="text-[#BE0027]">Built for India.</span>
                            </h2>
                        </div>

                        {/* Drop-cap story paragraph */}
                        <div className="relative pl-5 border-l-2 border-[#BE0027]/30">
                            <p className="font-cormorant text-white/70 leading-[1.9]" style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}>
                                <span className="float-left font-cinzel font-black text-[#BE0027] leading-none mr-2" style={{ fontSize: "3.8rem", lineHeight: "0.85" }}>I</span>
                                n the late 1980s, a young Dadi Bulsara left Mumbai for Japan — not as a tourist, but as a seeker. He trained directly under Kancho Hideyuki Ashihara, the legendary karateka who developed Ashihara Karate: a dynamic, circular style built around the philosophy of <em>Sabaki</em> — the art of moving out of danger while simultaneously countering.
                            </p>
                        </div>

                        <p className="font-inter text-white/50 text-sm leading-[1.85]">
                            After more than a decade of rigorous training in Japan and across Europe, Shihan Bulsara returned to India carrying not just a black belt, but a vision: to build a genuine Budo institution in a country where traditional martial arts deserved a permanent home. In 2003, with twelve students and one room in Dadar, Mumbai, the Dadi Bulsara Ashihara Kai Kan Foundation was born.
                        </p>

                        <p className="font-inter text-white/50 text-sm leading-[1.85]">
                            Today, under the continued leadership of Shihan Bulsara and Technical Director Sensei Arjun Mehta, the foundation operates eight branches across India, training over 600 active students ranging from children to professional athletes — all unified by the same Sabaki principles that Shihan first encountered in Matsuyama, Japan.
                        </p>

                        {/* Key info pills */}
                        <div className="flex flex-wrap gap-3 mt-2">
                            {[
                                ["Founded", "2003"],
                                ["Head", "Shihan Dadi Bulsara"],
                                ["Style", "Ashihara Karate"],
                                ["Affiliation", "IKO Ashihara"],
                            ].map(([label, val]) => (
                                <div key={label} className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/8 rounded-xl">
                                    <ChevronRight size={11} className="text-[#BE0027]" />
                                    <span className="font-inter text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
                                    <span className="font-inter text-[11px] text-white font-semibold">{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                STATS BAND
            ════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.015]">
                <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {STATS.map((s, i) => (
                        <div
                            key={s.label}
                            ref={(el) => { statRefs.current[i] = el; }}
                            className="flex flex-col items-center text-center gap-2 group"
                        >
                            <span className="font-cinzel font-black text-[#BE0027] group-hover:drop-shadow-[0_0_20px_rgba(190,0,39,0.6)] transition-all duration-300" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
                                {s.value}
                            </span>
                            <span className="font-inter text-[10px] text-white/35 tracking-[0.25em] uppercase">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                TIMELINE — MILESTONES
            ════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 py-28">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-3 mb-20">
                    <span className="font-inter text-[9px] font-bold tracking-[0.4em] uppercase text-[#BE0027] bg-[#BE0027]/10 px-4 py-1.5 rounded-full border border-[#BE0027]/20">
                        Our Journey
                    </span>
                    <h2 className="font-cinzel font-bold text-white tracking-wide" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}>
                        Two Decades of <span className="text-[#BE0027]">Progress</span>
                    </h2>
                    <p className="font-cormorant italic text-white/40 text-lg max-w-lg">
                        Every year has written a new chapter in the story of Ashihara Karate in India
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Centre vertical line — desktop only */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#BE0027]/20 to-transparent hidden lg:block" />

                    <div className="flex flex-col gap-0">
                        {MILESTONES.map((m, i) => {
                            const Icon = m.icon;
                            const isLeft = i % 2 === 0;
                            return (
                                <div
                                    key={m.year}
                                    ref={(el) => { milestoneRefs.current[i] = el; }}
                                    className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-6 py-8 ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                                >
                                    {/* Card */}
                                    <div className={`w-full lg:w-[calc(50%-2.5rem)] group bg-white/[0.02] hover:bg-white/[0.04] border border-white/8 hover:border-[#BE0027]/20 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${isLeft ? "lg:text-right" : "lg:text-left"}`}>
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BE0027]/0 group-hover:via-[#BE0027]/40 to-transparent transition-all duration-500" />

                                        <div className={`flex items-center gap-3 mb-3 ${isLeft ? "lg:flex-row-reverse" : "flex-row"}`}>
                                            <div className="w-8 h-8 rounded-lg bg-[#BE0027]/10 border border-[#BE0027]/20 flex items-center justify-center shrink-0">
                                                <Icon size={14} className="text-[#BE0027]" />
                                            </div>
                                            <span className="font-cinzel font-bold text-[#BE0027] text-sm tracking-wider">{m.event}</span>
                                        </div>
                                        <p className="font-inter text-sm text-white/50 leading-relaxed">{m.detail}</p>
                                    </div>

                                    {/* Year bubble — centre */}
                                    <div className="hidden lg:flex w-20 h-20 rounded-full bg-[#060606] border-2 border-[#BE0027]/40 items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(190,0,39,0.15)]">
                                        <span className="font-cinzel font-black text-white text-sm leading-none">{m.year}</span>
                                    </div>

                                    {/* Empty side spacer */}
                                    <div className="hidden lg:block w-[calc(50%-2.5rem)]" />

                                    {/* Mobile year pill */}
                                    <div className="flex lg:hidden items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#BE0027]/20 border border-[#BE0027]/40 flex items-center justify-center">
                                            <Icon size={13} className="text-[#BE0027]" />
                                        </div>
                                        <span className="font-cinzel font-bold text-[#BE0027] text-sm">{m.year}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                TRAINING CAMPS
            ════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 border-t border-white/[0.06] bg-white/[0.01]">
                <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-28">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
                        <div className="flex flex-col gap-3">
                            <span className="font-inter text-[9px] font-bold tracking-[0.4em] uppercase text-[#BE0027] bg-[#BE0027]/10 px-4 py-1.5 rounded-full border border-[#BE0027]/20 w-fit">
                                Annual Gasshuku
                            </span>
                            <h2 className="font-cinzel font-bold text-white tracking-wide" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}>
                                Every Year,<br /><span className="text-[#BE0027]">A New Camp.</span>
                            </h2>
                        </div>
                        <p className="font-cormorant italic text-white/40 text-lg max-w-md lg:text-right">
                            Gasshuku — intensive residential training camps — are the heartbeat of our federation calendar. Each camp forges bonds beyond the dojo walls.
                        </p>
                    </div>

                    {/* Camp cards horizontal scroll on mobile, 3-col on desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {CAMPS.map((camp, i) => (
                            <div
                                key={camp.year}
                                ref={(el) => { campRefs.current[i] = el; }}
                                className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/8 hover:border-[#BE0027]/20 rounded-2xl overflow-hidden transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-44 overflow-hidden">
                                    <Image
                                        src={`https://images.unsplash.com/photo-${[
                                            "1555597673-b21d5c935865",
                                            "1571019613454-1cb2f99b2d8b",
                                            "1616279969898-3b50f9768d5c",
                                            "1574689049821-ea5f2d61f466",
                                            "1552058544-f2b08422138a",
                                            "1517649763962-0c623066013b",
                                            "1540569014015-19a7be504e3a",
                                            "1547483238-f400e65ccd56",
                                            "1544717305-2782549b5136",
                                        ][i % 9]}?w=600&q=75`}
                                        alt={camp.title}
                                        fill
                                        className="object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/30 to-transparent" />
                                    {/* Year badge */}
                                    <div className="absolute top-4 left-4 bg-[#BE0027] px-3 py-1 rounded-lg">
                                        <span className="font-cinzel font-bold text-white text-sm">{camp.year}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-cinzel font-bold text-white text-sm tracking-wide mb-1">{camp.title}</h3>
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <MapPin size={11} className="text-[#BE0027] shrink-0" />
                                        <span className="font-inter text-xs text-white/40">{camp.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-1.5">
                                            <Users size={11} className="text-white/30" />
                                            <span className="font-inter text-xs text-white/40">{camp.participants} participants</span>
                                        </div>
                                    </div>
                                    <p className="font-inter text-xs text-[#BE0027]/70 mt-2.5 italic">&quot;{camp.highlight}&quot;</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                BRANCHES
            ════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 max-w-[1300px] mx-auto px-6 md:px-10 py-28">
                <div className="flex flex-col items-center text-center gap-3 mb-14">
                    <span className="font-inter text-[9px] font-bold tracking-[0.4em] uppercase text-[#BE0027] bg-[#BE0027]/10 px-4 py-1.5 rounded-full border border-[#BE0027]/20">
                        National Network
                    </span>
                    <h2 className="font-cinzel font-bold text-white tracking-wide" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}>
                        Our <span className="text-[#BE0027]">Branches</span>
                    </h2>
                    <p className="font-cormorant italic text-white/40 text-lg max-w-md">
                        Eight active dojos across India, each carrying the same Sabaki tradition
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {BRANCHES.map((branch, i) => (
                        <div
                            key={branch.city}
                            ref={(el) => { branchRefs.current[i] = el; }}
                            className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/8 hover:border-[#BE0027]/25 rounded-2xl p-5 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BE0027]/0 group-hover:via-[#BE0027]/50 to-transparent transition-all duration-500" />

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-9 h-9 rounded-xl bg-[#BE0027]/10 border border-[#BE0027]/20 flex items-center justify-center">
                                    <MapPin size={15} className="text-[#BE0027]" />
                                </div>
                                <span className="font-inter text-[10px] text-white/25 tracking-wider font-semibold">Est. {branch.since}</span>
                            </div>

                            <h3 className="font-cinzel font-bold text-white text-base tracking-wide mb-0.5">{branch.city}</h3>
                            <p className="font-inter text-xs text-white/40 mb-4">{branch.location}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <div className="flex items-center gap-1.5">
                                    <Users size={11} className="text-white/30" />
                                    <span className="font-inter text-xs text-white/40">{branch.students} students</span>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 shadow-[0_0_6px_rgba(52,211,153,0.6)]" title="Active" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                CLOSING QUOTE
            ════════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 border-t border-white/[0.06] py-24 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] select-none pointer-events-none">
                    <span className="font-serif text-white" style={{ fontSize: "30vw" }}>武</span>
                </div>
                <div className="relative max-w-[900px] mx-auto px-6 text-center flex flex-col gap-5 items-center">
                    <div className="h-[1px] w-16 bg-[#BE0027]/50" />
                    <blockquote className="font-cormorant font-medium italic text-white/60 leading-relaxed" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                        &quot;Ashihara Karate is not just a fighting system. It is a philosophy — a way of moving through life with awareness, economy and grace.&quot;
                    </blockquote>
                    <div className="flex flex-col items-center gap-1 mt-2">
                        <span className="font-cinzel font-bold text-white text-sm tracking-widest">SHIHAN DADI BULSARA</span>
                        <span className="font-inter text-[10px] text-[#BE0027] tracking-[0.3em] uppercase">Founder, Ashihara Kai Kan Foundation</span>
                    </div>
                    <div className="h-[1px] w-16 bg-[#BE0027]/50" />
                </div>
            </section>

            {/* Footer note */}
            <p className="relative z-10 font-inter text-[11px] tracking-wider text-white/15 uppercase text-center py-8">
                © 2026 Dadi Bulsara Ashihara Karate Federation. All rights reserved.
            </p>

        </div>
    );
}