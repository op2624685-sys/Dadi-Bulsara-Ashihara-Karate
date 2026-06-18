"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Tying GSAP with ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CampDetailsPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entry Animations
      gsap.from(".hero-elem", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2,
      });

      // 2. Horizontal Scroll Pinning (The CodePen Effect)
      const cards = gsap.utils.toArray(".horizontal-card");
      
      if (horizontalSectionRef.current && horizontalContainerRef.current) {
        gsap.to(horizontalContainerRef.current, {
          xPercent: -100 * (cards.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + horizontalContainerRef.current!.offsetWidth,
          },
        });
      }

      // 3. General Fade Up for standard content
      gsap.utils.toArray(".fade-up").forEach((elem: any) => {
        gsap.from(elem, {
          y: 50,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, mainRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <div ref={mainRef} className="bg-neutral-950 text-white min-h-screen overflow-x-hidden font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col justify-center px-8 md:px-20 pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Replace with your actual Karate Camp Hero Image */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-neutral-950/50 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2000&auto=format&fit=crop" 
            alt="Karate Hero Background"
            className="w-full h-full object-cover grayscale opacity-40 mix-blend-overlay"
          />
        </div>

        <div className="relative z-20 max-w-5xl">
          <div className="hero-elem inline-block px-4 py-1.5 mb-6 border border-red-600 bg-red-600/10 text-red-500 font-bold uppercase tracking-widest text-sm">
            Elite Summer Training 2026
          </div>
          <h1 className="hero-elem text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Master the <br /> <span className="text-red-600">Discipline</span>
          </h1>
          <p className="hero-elem text-lg md:text-2xl text-neutral-400 max-w-2xl mb-10 border-l-4 border-red-600 pl-4">
            Push your physical and mental limits in our advanced 14-day intensive karate camp. Designed for practitioners seeking perfection.
          </p>
          <div className="hero-elem flex gap-6">
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              Secure Your Spot
            </button>
          </div>
        </div>
      </section>

      {/* --- CAMP PURPOSE / OVERVIEW --- */}
      <section className="py-24 px-8 md:px-20 bg-neutral-900 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6 border-b border-neutral-800 pb-4">
              Camp <span className="text-red-600">Purpose</span>
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-6">
              This isn&apos;t just a summer retreat; it&apos;s a crucible. Our objective is to strip away weaknesses and rebuild your foundation through rigorous kihon, explosive kumite, and profound kata analysis.
            </p>
            <ul className="space-y-4">
              {['Advanced Kata Bunkai', 'High-Intensity Kumite Sparring', 'Mental Toughness & Zen Meditation'].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-300 font-medium">
                  <span className="w-2 h-2 bg-red-600 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="fade-up relative h-[400px] md:h-[600px] w-full">
            <img 
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop" 
              alt="Dojo Practice"
              className="absolute inset-0 w-full h-full object-cover border-l-8 border-red-600 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* --- TRAINING STRATEGY (HORIZONTAL SCROLL) --- */}
      <section 
        ref={horizontalSectionRef} 
        className="h-screen bg-neutral-950 overflow-hidden flex items-center relative"
      >
        <div className="absolute top-10 md:top-20 left-8 md:left-20 z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white/10 tracking-widest pointer-events-none">
            Training Strategy
          </h2>
        </div>

        <div 
          ref={horizontalContainerRef} 
          className="flex h-full w-[400vw] md:w-[300vw]"
        >
          {/* Pillar Card 1 */}
          <div className="horizontal-card w-screen h-full flex items-center justify-center p-8 md:p-24 relative">
            <div className="bg-neutral-900 border border-neutral-800 p-10 md:p-16 w-full max-w-5xl flex gap-8 flex-col md:flex-row items-center group hover:border-red-900 transition-colors">
              <div className="text-8xl md:text-[12rem] font-black text-red-600/20 group-hover:text-red-600 transition-colors">01</div>
              <div>
                <h3 className="text-3xl md:text-5xl font-bold uppercase mb-4 text-white">Conditioning Phase</h3>
                <p className="text-xl text-neutral-400">The first 3 days focus on tearing down muscle fibers and building raw stamina. Beach runs, hojo undo (traditional conditioning), and extreme cardio.</p>
              </div>
            </div>
          </div>

          {/* Pillar Card 2 */}
          <div className="horizontal-card w-screen h-full flex items-center justify-center p-8 md:p-24 relative">
            <div className="bg-neutral-900 border border-neutral-800 p-10 md:p-16 w-full max-w-5xl flex gap-8 flex-col md:flex-row items-center group hover:border-red-900 transition-colors">
              <div className="text-8xl md:text-[12rem] font-black text-red-600/20 group-hover:text-red-600 transition-colors">02</div>
              <div>
                <h3 className="text-3xl md:text-5xl font-bold uppercase mb-4 text-white">Technical Precision</h3>
                <p className="text-xl text-neutral-400">Refining kihon (basics). Micro-adjustments to stances, hip rotation (koshi), and striking dynamics to generate maximum kinetic energy.</p>
              </div>
            </div>
          </div>

          {/* Pillar Card 3 */}
          <div className="horizontal-card w-screen h-full flex items-center justify-center p-8 md:p-24 relative">
            <div className="bg-neutral-900 border border-neutral-800 p-10 md:p-16 w-full max-w-5xl flex gap-8 flex-col md:flex-row items-center group hover:border-red-900 transition-colors">
              <div className="text-8xl md:text-[12rem] font-black text-red-600/20 group-hover:text-red-600 transition-colors">03</div>
              <div>
                <h3 className="text-3xl md:text-5xl font-bold uppercase mb-4 text-white">Combat Application</h3>
                <p className="text-xl text-neutral-400">Live sparring and pressure testing. Applying learned techniques in controlled but high-intensity kumite matches to forge combat readiness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INSTRUCTORS SECTION --- */}
      <section className="py-24 px-8 md:px-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">
              Master <span className="text-red-600">Instructors</span>
            </h2>
            <p className="text-neutral-400 text-lg">Learn directly from national champions and 8th-Dan masters.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="fade-up bg-neutral-950 border border-neutral-800 group overflow-hidden">
                <div className="h-80 w-full overflow-hidden bg-neutral-800">
                  <img 
                    src={`https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop&sig=${item}`} 
                    alt={`Instructor ${item}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                </div>
                <div className="p-8">
                  <div className="text-red-600 font-bold tracking-widest text-sm mb-2">8TH DAN BLACK BELT</div>
                  <h3 className="text-2xl font-bold uppercase mb-2">Sensei Name</h3>
                  <p className="text-neutral-500">Former World Champion, specializing in advanced Kumite and physical conditioning.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}