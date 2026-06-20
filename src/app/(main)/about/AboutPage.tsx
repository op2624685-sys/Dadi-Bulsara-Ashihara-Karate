"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { MapPin, Users, Trophy, Globe, ChevronRight, Flag, Shield, Star, Flame } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── DATA ─────────────────────────────────────────────────────────────────────

const BRANCHES = [
    { city: "Kolkata",    location: "Dadar, West",    students: 120, since: 2005 },
    { city: "Pune",      location: "Kothrud",         students: 85,  since: 2008 },
    { city: "Delhi",     location: "Lajpat Nagar",    students: 70,  since: 2011 },
    { city: "Bangalore", location: "Koramangala",     students: 60,  since: 2013 },
    { city: "Ahmedabad", location: "Navrangpura",     students: 55,  since: 2015 },
    { city: "Surat",     location: "Athwa Lines",     students: 45,  since: 2017 },
    { city: "Hyderabad", location: "Banjara Hills",   students: 50,  since: 2018 },
    { city: "Nagpur",    location: "Dharampeth",      students: 38,  since: 2020 },
    { city: "Jharkhand",    location: "SIS Traning Centre, Gadhwa Road",     students: 456,  since: 2022 },
    { city: "Siliguri",    location: "Guruwathan, Kalingpong",     students: 138,  since: 2019 },
];

const MILESTONES = [
    { year: 2003, event: "Foundation",           detail: "Shihan Dadi Bulsara established the Ashihara Kai Kan Foundation in Mumbai after training under Kancho Hideyuki Ashihara in Japan for over a decade.", icon: Flame  },
    { year: 2005, event: "First Dojo",           detail: "The inaugural dojo opened in Dadar, Mumbai with 12 founding students. The first formal grading examination was conducted the same year.", icon: Shield  },
    { year: 2007, event: "National Recognition", detail: "Officially recognized by the All India Karate Federation. Hosted the first National Sabaki Challenge attracting 200+ participants.", icon: Trophy  },
    { year: 2009, event: "International Camp",   detail: "First international training camp held in collaboration with Ashihara Karate World HQ, Japan. 40 students participated.", icon: Globe   },
    { year: 2012, event: "5 Branches Milestone", detail: "Expansion across Maharashtra and Delhi. 350+ active students across all dojos.", icon: MapPin  },
    { year: 2015, event: "Junior Programme",     detail: "Launched the Kodomo Ashihara Programme for children aged 5–14. Over 200 children enrolled in year one.", icon: Users   },
    { year: 2018, event: "Pan-India Expansion",  detail: "Crossed 7 active dojos and 500 registered students. First South Indian dojo opens in Hyderabad.", icon: Flag    },
    { year: 2021, event: "Online Grading",       detail: "Pioneered digital grading records and belt certification in Indian Ashihara Karate. First virtual national camp conducted.", icon: Star    },
    { year: 2024, event: "20 Year Celebration",  detail: "Grand Anniversary Camp at Alibaug. 600+ students, 8 branches, international Sensei guests from Japan, Netherlands and Australia.", icon: Trophy  },
];

const CAMPS = [
    { year: 2009, title: "Sabaki Summer Camp",         location: "Lonavala, Maharashtra",  participants: 40,  highlight: "First international instructors from Japan",      photo: "/img/06.jpg" },
    { year: 2011, title: "SIS GTO Traning Camp",           location: "Mahabaleshwar",          participants: 75,  highlight: "Kata & Kumite intensive — 5 days",                photo: "/img/08.jpg" },
    { year: 2013, title: "Sabaki Challenge Camp",       location: "Alibaug Beach",           participants: 95,  highlight: "Beach Sabaki training — 3 days",                  photo: "/img/04.jpg" },
    { year: 2015, title: "Pre-Commando Training Camp",     location: "Pune Military Grounds",   participants: 130, highlight: "Military conditioning + Karate",                   photo: "/img/10.jpg" },
    { year: 2017, title: "Youth Warriors Camp",         location: "Nashik",                  participants: 110, highlight: "Exclusively for under-18 students",                photo: "/img/09.jpg" },
    { year: 2019, title: "National Winter Camp",      location: "Mumbai Dojo HQ",          participants: 180, highlight: "Sensei from Japan, Netherlands, Australia",         photo: "/img/07.jpg" },
    { year: 2021, title: "Virtual National Camp",       location: "Online (COVID Edition)",  participants: 220, highlight: "First-ever virtual Ashihara Camp in India",         photo: "/img/05.jpg"   },
    { year: 2023, title: "Black Belt Invitational",     location: "Goa",                     participants: 95,  highlight: "Exclusive Dan-grade practitioners only",            photo: "/img/02.jpg"   },
    { year: 2024, title: "20th Anniversary Grand Camp", location: "Alibaug, Maharashtra",    participants: 340, highlight: "Largest camp in federation history",                photo: "/img/03.jpg" },
];

const STATS = [
    { value: "21+",  label: "Years of Excellence"   },
    { value: "8",    label: "Active Dojos"           },
    { value: "600+", label: "Registered Students"    },
    { value: "9",    label: "Camps Conducted"        },
    { value: "15+",  label: "Black Belt Holders"     },
    { value: "3",    label: "International Partners" },
];

// ── Reusable centred section header ──────────────────────────────────────────
function SectionHeader({ eyebrow, title, highlight, sub }: {
    eyebrow: string; title: string; highlight: string; sub?: string;
}) {
    return (
        <div className="w-full flex flex-col items-center text-center gap-3 mb-14">
            <span className="font-inter text-[9px] font-bold tracking-[0.4em] uppercase text-[#BE0027] bg-[#BE0027]/10 px-4 py-1.5 rounded-full border border-[#BE0027]/20">
                {eyebrow}
            </span>
            <h2 className="font-cinzel font-bold text-white tracking-wide" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}>
                {title} <span className="text-[#BE0027]">{highlight}</span>
            </h2>
            {sub && (
                <p className="font-cormorant italic text-white/40 text-lg max-w-lg mx-auto">{sub}</p>
            )}
            <div className="flex items-center justify-center gap-4 mt-1 w-40">
                <div className="h-[1px] bg-gradient-to-r from-transparent to-[#BE0027]/50 flex-1" />
                <div className="w-1.5 h-1.5 bg-[#BE0027] rounded-full shrink-0" />
                <div className="h-[1px] bg-gradient-to-l from-transparent to-[#BE0027]/50 flex-1" />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
    const containerRef  = useRef<HTMLDivElement>(null);
    const heroTextRef   = useRef<HTMLDivElement>(null);
    const storyRef      = useRef<HTMLDivElement>(null);
    const statRefs      = useRef<(HTMLDivElement | null)[]>([]);
    const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);
    const branchRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const campRefs      = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(heroTextRef.current,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
            );
            gsap.fromTo(storyRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out",
                  scrollTrigger: { trigger: storyRef.current, start: "top 85%" } }
            );
            statRefs.current.filter(Boolean).forEach((el, i) => {
                gsap.fromTo(el,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, delay: i * 0.07, ease: "power3.out",
                      scrollTrigger: { trigger: el, start: "top 90%" } }
                );
            });
            milestoneRefs.current.filter(Boolean).forEach((el, i) => {
                gsap.fromTo(el,
                    { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
                      scrollTrigger: { trigger: el, start: "top 88%" } }
                );
            });
            branchRefs.current.filter(Boolean).forEach((el, i) => {
                gsap.fromTo(el,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, delay: i * 0.06, ease: "power3.out",
                      scrollTrigger: { trigger: el, start: "top 92%" } }
                );
            });
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
        <div ref={containerRef} className="relative w-full min-h-screen mt-[72px] bg-[#060606] selection:bg-[#BE0027]/30">

            {/* Ambient glows — pointer-events-none, no overflow effect */}
            <div className="pointer-events-none fixed top-0 left-0 z-0 w-[700px] h-[700px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[#BE0027]/4 blur-[200px]" />
            <div className="pointer-events-none fixed bottom-0 right-0 z-0 w-[600px] h-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-[#BE0027]/3 blur-[180px]" />

            {/* ══════════════════════════════════════════
                HERO — full bleed cinematic
            ══════════════════════════════════════════ */}
            <section className="relative w-full h-screen flex items-end ">
                {/* BG image */}
                <div className="absolute inset-0 overflow-hidden hover:scale-105 ease-in-out duration-500">
                    <Image
                        src="/img/01.jpg"
                        alt="Karate training"
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/60 to-[#060606]/10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/70 via-transparent to-[#060606]/30" />
                </div>

                {/* Kanji watermark */}
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-serif text-white/2.5 leading-none select-none pointer-events-none hidden lg:block" style={{ fontSize: 350 }}>
                    芦原カラテ
                </span>

                {/* Hero text — left-aligned inside centred max-width container */}
                <div className="relative z-10 w-full">
                    <div ref={heroTextRef} className="mx-auto w-full max-w-[1300px] px-6 md:px-10 pb-20 flex flex-col gap-5 max-w-3xl">
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-10 bg-[#BE0027]" />
                            <span className="font-inter text-[10px] font-bold tracking-[0.4em] uppercase text-[#BE0027]">Est. 2003 — Kolkata, India</span>
                        </div>
                        <h1 className="font-cinzel font-black text-white leading-[1.05] tracking-tight" style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)" }}>
                            DADI BULSARA<br />
                            <span className="text-[#BE0027] drop-shadow-[0_0_40px_rgba(190,0,39,0.5)]">ASHIHARA</span><br />
                            KAI KAN FOUNDATION
                        </h1>
                        <p className="font-cormorant italic text-white/50 max-w-xl leading-relaxed" style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)" }}>
                            India&apos;s premier Ashihara Karate organisation — built on tradition, forged through Sabaki, and dedicated to the lifelong pursuit of Budo.
                        </p>
                        <div className="flex flex-wrap gap-8 mt-3 pt-5 border-t border-white/5">
                            {[["21+","Years"],["600+","Students"],["8","Dojos"],["9","Camps"]].map(([num, lbl]) => (
                                <div key={lbl} className="flex flex-col">
                                    <span className="font-cinzel font-bold text-[#BE0027] text-2xl leading-none">{num}</span>
                                    <span className="font-inter text-[10px] tracking-[0.25em] uppercase text-white/40 mt-1">{lbl}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
                    <div className="w-[1px] h-10 bg-gradient-to-b from-[#BE0027] to-transparent animate-pulse" />
                    <span className="font-inter text-[9px] tracking-[0.3em] uppercase text-white/25">Scroll</span>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                FOUNDER & STORY
            ══════════════════════════════════════════ */}
            <section className="relative z-10 w-full flex items-center py-28">
                <div className="w-full max-w-full px-6 md:px-10 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Image side */}
                        <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
                            <div className="absolute -top-4 -left-4 w-28 h-28 border-t-2 border-l-2 border-[#BE0027]/40 rounded-tl-lg pointer-events-none" />
                            <div className="absolute -bottom-4 -right-4 w-28 h-28 border-b-2 border-r-2 border-[#BE0027]/40 rounded-br-lg pointer-events-none" />
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group">
                                <Image
                                    src="/img/05.jpg"
                                    alt="Shihan Santosh Kumar"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 480px"
                                    className="object-cover object-top grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="font-inter text-[10px] tracking-[0.35em] uppercase text-[#BE0027] font-bold">Founder & Chief Instructor</p>
                                    <h3 className="font-cinzel font-bold text-white text-xl mt-1">Shihan Dadi Bulsara</h3>
                                    <p className="font-cormorant italic text-white/50 text-sm mt-0.5">8th Dan Black Belt — Ashihara Karate</p>
                                </div>
                            </div>
                            <div className="absolute top-6 -right-4 lg:-right-6 bg-[#BE0027] rounded-xl px-4 py-3 shadow-[0_8px_32px_rgba(190,0,39,0.4)]">
                                <p className="font-cinzel font-bold text-white text-lg leading-none">21+</p>
                                <p className="font-inter text-[9px] tracking-wider uppercase text-white/80 mt-0.5">Years</p>
                            </div>
                        </div>

                        {/* Story side */}
                        <div ref={storyRef} className="flex flex-col gap-7">
                            <div>
                                <span className="font-inter text-[9px] font-bold tracking-[0.4em] uppercase text-[#BE0027] bg-[#BE0027]/10 px-3 py-1.5 rounded-full border border-[#BE0027]/20">
                                    Our Origin Story
                                </span>
                                <h2 className="font-cinzel font-bold text-white mt-5 leading-tight" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
                                    Born from Discipline.<br />
                                    <span className="text-[#BE0027]">Built for India.</span>
                                </h2>
                            </div>
                            <div className="relative pl-5 border-l-2 border-[#BE0027]/30">
                                <p className="font-cormorant text-white/70 leading-[1.9]" style={{ fontSize: "clamp(1rem, 1.4vw, 1.12rem)" }}>
                                    <span className="float-left font-cinzel font-black text-[#BE0027] mr-2" style={{ fontSize: "3.6rem", lineHeight: "0.82" }}>I</span>
                                    n the late 1980s, a young Dadi Bulsara left Mumbai for Japan — not as a tourist, but as a seeker. He trained directly under Kancho Hideyuki Ashihara, the legendary karateka who developed Ashihara Karate: a dynamic, circular style built around the philosophy of <em>Sabaki</em> — the art of moving out of danger while simultaneously countering.
                                </p>
                            </div>
                            <p className="font-inter text-white/50 text-sm leading-[1.85]">
                                After more than a decade of rigorous training in Japan and across Europe, Shihan Bulsara returned to India carrying not just a black belt, but a vision: to build a genuine Budo institution where traditional martial arts deserved a permanent home. In 2003, with twelve students and one room in Dadar, Mumbai, the Dadi Bulsara Ashihara Kai Kan Foundation was born.
                            </p>
                            <p className="font-inter text-white/50 text-sm leading-[1.85]">
                                Today, under the continued leadership of Shihan Bulsara and Technical Director Sensei Arjun Mehta, the foundation operates eight branches across India, training over 600 active students — all unified by the same Sabaki principles first encountered in Matsuyama, Japan.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-1">
                                {[["Founded","2003"],["Head","Shihan Dadi Bulsara"],["Style","Ashihara Karate"],["Affiliation","IKO Ashihara"]].map(([label, val]) => (
                                    <div key={label} className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                                        <ChevronRight size={11} className="text-[#BE0027]" />
                                        <span className="font-inter text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
                                        <span className="font-inter text-[11px] text-white font-semibold">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                STATS BAND
            ══════════════════════════════════════════ */}
            <section className="relative z-10 w-full flex items-center bottom-0 border-y border-white/[0.06] bg-white/[0.015]">
                <div className="mx-auto w-full px-6 md:px-10 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {STATS.map((s, i) => (
                            <div
                                key={s.label}
                                ref={(el) => { statRefs.current[i] = el; }}
                                className="flex flex-col items-center text-center gap-2 group"
                            >
                                <span className="font-cinzel font-black text-[#BE0027] group-hover:drop-shadow-[0_0_20px_rgba(190,0,39,0.6)] transition-all duration-300" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
                                    {s.value}
                                </span>
                                <span className="font-inter text-[10px] text-white/35 tracking-[0.2em] uppercase">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                TIMELINE
            ══════════════════════════════════════════ */}
            <section className="relative z-10 flex flex-col w-full py-28">
                <div className="mx-auto w-full h-[100vh] px-6 md:px-10">
                    <SectionHeader
                        eyebrow="Our Journey"
                        title="Two Decades of"
                        highlight="Progress"
                        sub="Every year has written a new chapter in the story of Ashihara Karate in India"
                    />

                    <div className="relative">
                        {/* Centre vertical line desktop */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#BE0027]/20 to-transparent hidden lg:block" />

                        <div className="flex flex-col gap-4">
                            {MILESTONES.map((m, i) => {
                                const Icon = m.icon;
                                const isLeft = i % 2 === 0;
                                return (
                                    <div
                                        key={m.year}
                                        ref={(el) => { milestoneRefs.current[i] = el; }}
                                        className="relative flex flex-col lg:grid lg:grid-cols-[1fr_80px_1fr] items-center gap-4 py-6"
                                    >
                                        {/* Left slot */}
                                        {isLeft ? (
                                            <div className="group w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-[#BE0027]/20 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden lg:text-right">
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BE0027]/0 group-hover:via-[#BE0027]/40 to-transparent transition-all duration-500" />
                                                <div className="flex items-center gap-3 mb-3 lg:flex-row-reverse">
                                                    <div className="w-8 h-8 rounded-lg bg-[#BE0027]/10 border border-[#BE0027]/20 flex items-center justify-center shrink-0">
                                                        <Icon size={14} className="text-[#BE0027]" />
                                                    </div>
                                                    <span className="font-cinzel font-bold text-[#BE0027] text-sm tracking-wider">{m.event}</span>
                                                </div>
                                                <p className="font-inter text-sm text-white/50 leading-relaxed">{m.detail}</p>
                                            </div>
                                        ) : (
                                            <div className="hidden lg:block" />
                                        )}

                                        {/* Centre year bubble */}
                                        <div className="flex items-center justify-center">
                                            <div className="w-[72px] h-[72px] rounded-full bg-[#060606] border-2 border-[#BE0027]/40 flex items-center justify-center shadow-[0_0_20px_rgba(190,0,39,0.15)] shrink-0 hidden lg:flex">
                                                <span className="font-cinzel font-black text-white text-xs leading-none text-center">{m.year}</span>
                                            </div>
                                            {/* Mobile: show pill */}
                                            <div className="flex lg:hidden items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-[#BE0027]/20 border border-[#BE0027]/40 flex items-center justify-center">
                                                    <Icon size={13} className="text-[#BE0027]" />
                                                </div>
                                                <span className="font-cinzel font-bold text-[#BE0027] text-sm">{m.year}</span>
                                            </div>
                                        </div>

                                        {/* Right slot */}
                                        {!isLeft ? (
                                            <div className="group w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-[#BE0027]/20 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BE0027]/0 group-hover:via-[#BE0027]/40 to-transparent transition-all duration-500" />
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[#BE0027]/10 border border-[#BE0027]/20 flex items-center justify-center shrink-0">
                                                        <Icon size={14} className="text-[#BE0027]" />
                                                    </div>
                                                    <span className="font-cinzel font-bold text-[#BE0027] text-sm tracking-wider">{m.event}</span>
                                                </div>
                                                <p className="font-inter text-sm text-white/50 leading-relaxed">{m.detail}</p>
                                            </div>
                                        ) : (
                                            <div className="hidden lg:block" />
                                        )}

                                        {/* Mobile card (for even items, shown below year) */}
                                        {isLeft && (
                                            <div className="group w-full lg:hidden bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5">
                                                <p className="font-inter text-sm text-white/50 leading-relaxed">{m.detail}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                TRAINING CAMPS
            ══════════════════════════════════════════ */}
            <section className="relative z-10 w-full border-t border-white/[0.06] bg-white/[0.01] py-28">
                <div className="mx-auto w-full px-6 md:px-10">
                    <SectionHeader
                        eyebrow="Annual Camps"
                        title="Every Year,"
                        highlight="A New Camp."
                        sub="Dadi Bulsara — intensive residential training camps — are the heartbeat of our federation calendar"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {CAMPS.map((camp, i) => (
                            <div
                                key={camp.year}
                                ref={(el) => { campRefs.current[i] = el; }}
                                className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-[#BE0027]/20 rounded-2xl overflow-hidden transition-all duration-300"
                            >
                                <div className="relative h-44 overflow-hidden">
                                    <Image
                                        src={camp.photo}
                                        alt={camp.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/30 to-transparent" />
                                    <div className="absolute top-4 left-4 bg-[#BE0027] px-3 py-1 rounded-lg">
                                        <span className="font-cinzel font-bold text-white text-sm">{camp.year}</span>
                                    </div>
                                </div>
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

            {/* ══════════════════════════════════════════
                BRANCHES
            ══════════════════════════════════════════ */}
            <section className="relative z-10 w-full py-28">
                <div className="mx-auto w-full h-auto px-6 md:px-10 ">
                    <SectionHeader
                        eyebrow="National Network"
                        title="Our"
                        highlight="Branches"
                        sub="Eight active dojos across India, each carrying the same Sabaki tradition"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {BRANCHES.map((branch, i) => (
                            <div
                                key={branch.city}
                                ref={(el) => { branchRefs.current[i] = el; }}
                                className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-[#BE0027]/25 rounded-2xl p-5 transition-all duration-300 overflow-hidden"
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
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                CLOSING QUOTE
            ══════════════════════════════════════════ */}
            <section className="relative z-10 w-full border-t border-white/[0.06] py-24 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] select-none pointer-events-none">
                    <span className="font-serif text-white" style={{ fontSize: "30vw" }}>武</span>
                </div>
                <div className="relative mx-auto w-full px-6 md:px-10 flex flex-col items-center text-center gap-5">
                    <div className="h-[1px] w-16 bg-[#BE0027]/50" />
                    <blockquote className="font-cormorant font-medium italic text-white/60 leading-relaxed" style={{ fontSize: "clamp(1.3rem, 2.8vw, 1.9rem)" }}>
                        &quot;Ashihara Karate is not just a fighting system. It is a philosophy — a way of moving through life with awareness, economy and grace.&quot;
                    </blockquote>
                    <div className="flex flex-col items-center gap-1 mt-2">
                        <span className="font-cinzel font-bold text-white text-sm tracking-widest">SHIHAN DADI BULSARA</span>
                        <span className="font-inter text-[10px] text-[#BE0027] tracking-[0.3em] uppercase">Founder, Ashihara Kai Kan Foundation</span>
                    </div>
                    <div className="h-[1px] w-16 bg-[#BE0027]/50" />
                </div>
            </section>

            <p className="relative z-10 font-inter text-[11px] tracking-wider text-white/15 uppercase text-center py-8">
                © 2026 Dadi Bulsara Ashihara Karate Federation. All rights reserved.
            </p>
        </div>
    );
}
