"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { useScrollFrame } from "@/hooks/useScrollFrame";
import { TOTAL_FRAMES } from "@/hooks/useFramePreloader";
import HeroOverlayText from "./HeroOverlayText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);



interface HeroSequenceProps {
  frames:  HTMLImageElement[];
  visible: boolean;
}

export default function HeroSequence({ frames, visible }: HeroSequenceProps) {
  const wrapperRef       = useRef<HTMLDivElement>(null);
  const stickyRef        = useRef<HTMLDivElement>(null);
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef  = useRef(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  // ── Idle state ────────────────────────────────────────────────────────────
  const idleTimeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleActiveRef    = useRef(false);
  const idleRAFRef       = useRef<number | null>(null);
  const idleTLRef        = useRef<gsap.core.Timeline | null>(null);
  const idleStartTimeRef = useRef(0);

  // ── GSAP proxy object — mutated in-place, NEVER replaced ────────────────
  const breatheProxy = useRef({ scaleX: 1, scaleY: 1, y: 0 });

  // ── idleLoop stored in a ref to avoid circular useCallback dependency ─────
  const idleLoopRef = useRef<FrameRequestCallback | null>(null);

  // ── Canvas sizing ─────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas  = canvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w   = canvas.offsetWidth;
    const h   = canvas.offsetHeight;

    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    if (overlay) {
      overlay.width  = w * dpr;
      overlay.height = h * dpr;
      const octx = overlay.getContext("2d");
      if (octx) octx.scale(dpr, dpr);
    }
  }, []);

  // ── object-fit: contain rect ──────────────────────────────────────────────
  const getDrawRect = useCallback(
    (img: HTMLImageElement, cw: number, ch: number) => {
      const imgRatio    = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let drawW: number, drawH: number, drawX: number, drawY: number;
      // object-fit: cover — image fills entire canvas, cropped if needed
      if (imgRatio > canvasRatio) {
        // Image is wider than canvas → fit height, crop sides
        drawH = ch; drawW = ch * imgRatio;
        drawX = (cw - drawW) / 2; drawY = 0;
      } else {
        // Image is taller than canvas → fit width, crop top/bottom
        drawW = cw; drawH = cw / imgRatio;
        drawX = 0; drawY = (ch - drawH) / 2;
      }
      return { drawX, drawY, drawW, drawH };
    },
    []
  );

  // ── Draw main frame (scroll-driven) ──────────────────────────────────────
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = frames[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      if (idleActiveRef.current) {
        // Apply breathe only to the draw rect — canvas element stays fixed
        const { scaleX, scaleY, y: shiftY } = breatheProxy.current;
        const { drawX, drawY, drawW, drawH } = getDrawRect(img, cw, ch);
        const imgCX   = drawX + drawW / 2;
        const imgCY   = drawY + drawH / 2;
        const scaledW = drawW * scaleX;
        const scaledH = drawH * scaleY;
        ctx.drawImage(img, imgCX - scaledW / 2, imgCY - scaledH / 2 + shiftY, scaledW, scaledH);
      } else {
        const { drawX, drawY, drawW, drawH } = getDrawRect(img, cw, ch);
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
    },
    [frames, getDrawRect]
  );

  // ── Draw overlay: dust + haze + belt ─────────────────────────────────────
  const drawOverlay = useCallback((_elapsed: number) => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    const cw = overlay.offsetWidth;
    const ch = overlay.offsetHeight;
    ctx.clearRect(0, 0, cw, ch);
  }, []);

  // ── Idle RAF loop — stored in ref, NO circular useCallback dependency ─────
  useEffect(() => {
    idleLoopRef.current = (timestamp: number) => {
      if (!idleActiveRef.current) return;
      const elapsed = timestamp - idleStartTimeRef.current;
      drawFrame(currentFrameRef.current);
      drawOverlay(elapsed);
      idleRAFRef.current = requestAnimationFrame(idleLoopRef.current!);
    };
  }, [drawFrame, drawOverlay]);

  // ── Start idle ────────────────────────────────────────────────────────────
  const startIdle = useCallback(() => {
    if (idleActiveRef.current) return;
    idleActiveRef.current    = true;
    idleStartTimeRef.current = performance.now();

    // Reset in-place — NEVER replace the object or GSAP loses its reference
    breatheProxy.current.scaleX = 1;
    breatheProxy.current.scaleY = 1;
    breatheProxy.current.y      = 0;

    idleTLRef.current?.kill();

    // Breathing only
    const breatheTL = gsap.timeline({ repeat: -1 });
    breatheTL
      .to(breatheProxy.current, { scaleY: 1.022, scaleX: 0.991, y: -8, duration: 3.0, ease: "sine.inOut" })
      .to(breatheProxy.current, { scaleY: 1.0,   scaleX: 1.0,   y:  0, duration: 4.0, ease: "sine.inOut" });

    idleTLRef.current = breatheTL;

    idleRAFRef.current = requestAnimationFrame(idleLoopRef.current!);
  }, []);

  // ── Stop idle ─────────────────────────────────────────────────────────────
  const stopIdle = useCallback(() => {
    if (!idleActiveRef.current) return;
    idleActiveRef.current = false;

    idleTLRef.current?.kill();
    idleTLRef.current = null;

    if (idleRAFRef.current !== null) {
      cancelAnimationFrame(idleRAFRef.current);
      idleRAFRef.current = null;
    }

    // Reset in-place
    breatheProxy.current.scaleX = 1;
    breatheProxy.current.scaleY = 1;
    breatheProxy.current.y      = 0;

    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ctx = overlay.getContext("2d");
      ctx?.clearRect(0, 0, overlay.offsetWidth, overlay.offsetHeight);
    }
  }, []);

  // ── Scroll debounce ───────────────────────────────────────────────────────
  const scheduleIdle = useCallback(() => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(startIdle, 500);
  }, [startIdle]);

  const cancelIdle = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
    stopIdle();
  }, [stopIdle]);

  useEffect(() => {
    if (!visible) return;
    const onScroll = () => { cancelIdle(); scheduleIdle(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    scheduleIdle();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelIdle();
    };
  }, [visible, cancelIdle, scheduleIdle]);

  // ── Scroll-driven frame updates ───────────────────────────────────────────
  const handleFrame = useCallback(
    (frameIndex: number) => {
      currentFrameRef.current = frameIndex;
      drawFrame(frameIndex);
      setCurrentFrame(frameIndex);
    },
    [drawFrame]
  );

  useScrollFrame({
    wrapperRef: wrapperRef as React.RefObject<HTMLDivElement>,
    onFrame:    handleFrame,
    enabled:    visible,
  });

  // ── Initial draw + resize ─────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    resizeCanvas();
    drawFrame(0);

    const observer = new ResizeObserver(() => {
      resizeCanvas();
      drawFrame(currentFrameRef.current);
    });
    const canvas = canvasRef.current;
    if (canvas) observer.observe(canvas);
    return () => observer.disconnect();
  }, [visible, resizeCanvas, drawFrame]);

  useEffect(() => {
    if (!visible || !stickyRef.current) return;
    stickyRef.current.style.opacity = "1";
  }, [visible]);

  useEffect(() => () => cancelIdle(), [cancelIdle]);

  return (
    <div
      ref={wrapperRef}
      className="hero-wrapper"
      aria-label="Ashihara Karate animation sequence"
    >
      <div
        ref={stickyRef}
        className="hero-sticky"
        style={{ opacity: 0, transition: "opacity 0.8s ease" }}
      >
        <div className="ink-texture" aria-hidden="true" />

        <svg
          className="mountain-layer"
          viewBox="0 0 1440 300"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <path
            d="M0 300 L0 195 L110 145 L220 178 L350 108 L470 158 L600 76 L730 128 L860 68 L980 118 L1100 88 L1220 138 L1340 98 L1440 148 L1440 300 Z"
            fill="rgba(255,255,255,0.05)"
          />
          <path
            d="M0 300 L0 228 L155 178 L310 218 L470 158 L630 198 L790 138 L950 183 L1110 153 L1275 183 L1440 163 L1440 300 Z"
            fill="rgba(255,255,255,0.03)"
          />
        </svg>

        <canvas
          ref={canvasRef}
          className="frame-canvas"
          aria-label={`Animation frame ${currentFrame + 1} of ${TOTAL_FRAMES}`}
        />

        <canvas
          ref={overlayCanvasRef}
          className="overlay-canvas"
          aria-hidden="true"
        />

        <SmokeParticles />

        <div className="vignette" aria-hidden="true" />

        <HeroOverlayText frameIndex={currentFrame} visible={visible} />
      </div>

      <style jsx>{`
        .hero-wrapper {
          position: relative;
          height: 580vh;
          width: 100%;
        }
        .hero-sticky {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: #000;
          overflow: hidden;
          will-change: transform;
        }
        .ink-texture {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.15;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7 0.75' numOctaves='4' seed='12' /%3E%3CfeColorMatrix type='saturate' values='0' /%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 256px 256px;
          mix-blend-mode: overlay;
        }
        .mountain-layer {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 2;
          pointer-events: none;
        }
        .frame-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          display: block;
          will-change: contents;
        }
        .overlay-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 4;
          display: block;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .vignette {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          background:
            radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 15%, transparent 70%, rgba(0,0,0,0.9) 100%);
        }
      `}</style>
    </div>
  );
}

/* ── Smoke particles ─────────────────────────────────────────────────────────── */
function SmokeParticles() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id:       i,
    size:     10 + ((i * 37) % 110),
    left:     (i * 1234567) % 100,
    bottom:   (i * 9876543) % 35,
    duration: 9 + ((i * 3) % 11),
    delay:    (i * 7) % 9,
  }));

  return (
    <div className="smoke-layer" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="smoke-particle"
          style={{
            width:             p.size,
            height:            p.size,
            left:              `${p.left}%`,
            bottom:            `${p.bottom}%`,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        .smoke-layer {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          overflow: hidden;
        }
        .smoke-particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          animation: smokeRise linear infinite;
        }
        @keyframes smokeRise {
          0%   { transform: translateY(0) scale(1);        opacity: 0;   }
          15%  {                                            opacity: 1;   }
          85%  {                                            opacity: 0.3; }
          100% { transform: translateY(-220px) scale(2.8); opacity: 0;   }
        }
      `}</style>
    </div>
  );
}