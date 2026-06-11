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
  frames: HTMLImageElement[];
  visible: boolean;
}

// ── Dust particle config ──────────────────────────────────────────────────────
const DUST_COUNT = 22;
interface DustParticle {
  x: number;     // 0–1 relative to canvas width
  y: number;     // 0–1 relative to canvas height
  r: number;     // radius in px
  speed: number; // upward drift per frame
  opacity: number;
  phase: number; // sine phase offset
}

function makeDustParticles(): DustParticle[] {
  return Array.from({ length: DUST_COUNT }, (_, i) => ({
    x: Math.sin(i * 2.399) * 0.5 + 0.5,
    y: Math.cos(i * 1.618) * 0.5 + 0.5,
    r: 0.6 + (i % 5) * 0.35,
    speed: 0.18 + (i % 7) * 0.06,
    opacity: 0.12 + (i % 4) * 0.06,
    phase: i * 0.7,
  }));
}

export default function HeroSequence({ frames, visible }: HeroSequenceProps) {
  const wrapperRef      = useRef<HTMLDivElement>(null);
  const stickyRef       = useRef<HTMLDivElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  // ── Idle state — all refs, zero React re-renders ──────────────────────────
  const idleTimeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleActiveRef    = useRef(false);
  const idleRAFRef       = useRef<number | null>(null);
  const idleTLRef        = useRef<gsap.core.Timeline | null>(null);
  const idleStartTimeRef = useRef(0);
  const dustParticlesRef = useRef<DustParticle[]>(makeDustParticles());

  // ── GSAP proxy objects — plain refs, never trigger renders ───────────────
  //
  // breatheProxy: animates the *draw rectangle* of the character image only.
  //   scaleX / scaleY expand/contract the destination rect.
  //   y shifts the destination rect vertically.
  //   The canvas element itself never moves.
  //
  // beltProxy: drives the two dangling belt-end curves drawn on the overlay.
  //   swayX = horizontal tip displacement in px (both ends mirror each other)
  //   swayY = vertical drop/rise in px
  const breatheProxy = useRef({ scaleX: 1, scaleY: 1, y: 0 });
  const beltProxy    = useRef({ swayX: 0, swayY: 0 });
  const windProxy    = useRef({ shiftX: 0 });

  // ── Canvas sizing ─────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas  = canvasRef.current;
    const overlay = overlayCanvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    canvas.width = w * dpr;
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

  // ── Compute the "fit" draw rectangle for a frame image ───────────────────
  //   Returns the un-transformed draw rect (object-fit: contain logic).
  //   Breathing scale and vertical shift are applied *only* to this rect,
  //   leaving the canvas coordinate system completely untouched.
  const getDrawRect = useCallback(
    (img: HTMLImageElement, cw: number, ch: number) => {
      const imgRatio    = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let drawW: number, drawH: number, drawX: number, drawY: number;

      if (imgRatio > canvasRatio) {
        drawW = cw;
        drawH = cw / imgRatio;
        drawX = 0;
        drawY = (ch - drawH) / 2;
      } else {
        drawH = ch;
        drawW = ch * imgRatio;
        drawX = (cw - drawW) / 2;
        drawY = 0;
      }
      return { drawX, drawY, drawW, drawH };
    },
    []
  );

  // ── Draw a specific frame ─────────────────────────────────────────────────
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

      const { drawX, drawY, drawW, drawH } = getDrawRect(img, cw, ch);

      if (idleActiveRef.current) {
        // ── Apply breathing ONLY to the image draw rect ──────────────────
        // Scale the destination rect around its own centre.
        // The canvas transform remains identity — no global translate/scale.
        const { scaleX, scaleY, y: shiftY } = breatheProxy.current;

        // Centre of the image within the canvas
        const imgCX = drawX + drawW / 2;
        const imgCY = drawY + drawH / 2;

        const scaledW = drawW * scaleX;
        const scaledH = drawH * scaleY;

        // Keep the scaled image centred on the same point, then apply shiftY.
        // shiftY moves the image up/down in canvas px — the canvas itself is fixed.
        const finalX = imgCX - scaledW / 2;
        const finalY = imgCY - scaledH / 2 + shiftY;

        ctx.drawImage(img, finalX, finalY, scaledW, scaledH);
      } else {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
    },
    [frames, getDrawRect]
  );

  // ── Draw overlay: dust particles + atmospheric haze + belt sway ──────────
  const drawOverlay = useCallback(
    (elapsed: number) => {
      const overlay = overlayCanvasRef.current;
      const mainCanvas = canvasRef.current;
      if (!overlay || !mainCanvas) return;
      const ctx = overlay.getContext("2d");
      if (!ctx) return;

      const cw = overlay.offsetWidth;
      const ch = overlay.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      const { shiftX } = windProxy.current;
      const windNorm   = shiftX / 6; // normalised –1..1

      // ── Atmospheric haze ────────────────────────────────────────────────
      const hazeX = cw * (0.5 + windNorm * 0.08);
      const haze  = ctx.createRadialGradient(hazeX, ch * 0.55, 0, hazeX, ch * 0.55, cw * 0.7);
      haze.addColorStop(0, "rgba(200,210,230,0.03)");
      haze.addColorStop(1, "rgba(200,210,230,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, cw, ch);

      // ── Floating dust ───────────────────────────────────────────────────
      const dust = dustParticlesRef.current;
      for (let i = 0; i < dust.length; i++) {
        const p = dust[i];
        p.y -= p.speed * 0.0004;
        p.x += windNorm * 0.0002 + Math.sin(elapsed * 0.0003 + p.phase) * 0.00008;
        if (p.y < -0.05) p.y = 1.05;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x >  1.05) p.x = -0.05;

        const pulse = 0.6 + 0.4 * Math.sin(elapsed * 0.001 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x * cw, p.y * ch, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,225,235,${p.opacity * pulse})`;
        ctx.fill();
      }

      // ── Belt-end sway ────────────────────────────────────────────────────
      // We don't have pixel-level knowledge of belt position, so we anchor
      // the belt overlay to a fixed waist region (60–65% down the image rect)
      // and use multiply blending so it only darkens existing dark pixels —
      // completely invisible over the black canvas background, perceptible
      // only where the gi fabric is lighter.
      //
      // Two dangling ends hang from the waist centre, one left, one right.
      // Each is a thin tapered bezier stroke in near-black with low opacity.
      const img = frames[currentFrameRef.current];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const { drawX, drawY, drawW, drawH } = getDrawRect(img, cw, ch);

      // Belt anchor: horizontal centre, ~62% down the image
      const beltCX = drawX + drawW * 0.5;
      const beltCY = drawY + drawH * 0.62;

      const { swayX, swayY } = beltProxy.current;

      // Half-width of knot area — ends start just outside the knot
      const knotHalf = drawW * 0.04;
      // End length — proportional to image width, feels natural on any size
      const endLen   = drawW * 0.12;

      // Wind nudge on top of the GSAP sway (purely additive, driven by windProxy)
      const windNudge = windNorm * drawW * 0.006;

      ctx.save();
      // multiply: darkens the gi fabric, invisible on black bg
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.18;
      ctx.lineCap  = "round";
      ctx.lineJoin = "round";

      // Left end
      const lStartX = beltCX - knotHalf;
      const lStartY = beltCY;
      // Control point droops down and left, tip swings with sway
      const lCtrlX  = lStartX - endLen * 0.4 + windNudge;
      const lCtrlY  = lStartY + endLen * 0.5 + swayY * 0.6;
      const lTipX   = lStartX - endLen + (-swayX) + windNudge * 1.4;
      const lTipY   = lStartY + endLen * 0.75 + swayY;

      // Taper: draw twice — wider near knot, narrower at tip
      ctx.strokeStyle = "rgba(15,10,8,1)";
      ctx.lineWidth   = drawW * 0.018; // ~belt width near knot
      ctx.beginPath();
      ctx.moveTo(lStartX, lStartY);
      ctx.quadraticCurveTo(lCtrlX, lCtrlY, lTipX, lTipY);
      ctx.stroke();

      // Thinner re-stroke for taper illusion at tip
      ctx.lineWidth = drawW * 0.006;
      ctx.globalAlpha = 0.10;
      ctx.beginPath();
      ctx.moveTo(lCtrlX, lCtrlY);
      ctx.quadraticCurveTo(
        (lCtrlX + lTipX) / 2, (lCtrlY + lTipY) / 2,
        lTipX, lTipY
      );
      ctx.stroke();

      // Right end (mirrors left, sway is reversed)
      ctx.globalAlpha = 0.18;
      ctx.lineWidth   = drawW * 0.018;
      const rStartX = beltCX + knotHalf;
      const rStartY = beltCY;
      const rCtrlX  = rStartX + endLen * 0.4 + windNudge;
      const rCtrlY  = rStartY + endLen * 0.5 + swayY * 0.6;
      const rTipX   = rStartX + endLen + swayX + windNudge * 1.4;
      const rTipY   = rStartY + endLen * 0.75 + swayY;

      ctx.beginPath();
      ctx.moveTo(rStartX, rStartY);
      ctx.quadraticCurveTo(rCtrlX, rCtrlY, rTipX, rTipY);
      ctx.stroke();

      ctx.lineWidth = drawW * 0.006;
      ctx.globalAlpha = 0.10;
      ctx.beginPath();
      ctx.moveTo(rCtrlX, rCtrlY);
      ctx.quadraticCurveTo(
        (rCtrlX + rTipX) / 2, (rCtrlY + rTipY) / 2,
        rTipX, rTipY
      );
      ctx.stroke();

      ctx.restore();
    },
    [frames, getDrawRect]
  );

  // ── Idle RAF loop ─────────────────────────────────────────────────────────
  const idleLoop = useCallback(() => {
    if (!idleActiveRef.current) return;
    const elapsed = performance.now() - idleStartTimeRef.current;
    drawFrame(currentFrameRef.current);
    drawOverlay(elapsed);
    idleRAFRef.current = requestAnimationFrame(idleLoop);
  }, [drawFrame, drawOverlay]);

  // ── Start idle ────────────────────────────────────────────────────────────
  const startIdle = useCallback(() => {
    if (idleActiveRef.current) return;
    idleActiveRef.current    = true;
    idleStartTimeRef.current = performance.now();

    // Reset proxies to neutral
    breatheProxy.current = { scaleX: 1,  scaleY: 1, y: 0 };
    beltProxy.current    = { swayX: 0,   swayY: 0 };
    windProxy.current    = { shiftX: 0 };

    idleTLRef.current?.kill();

    // ── Breathing timeline ──────────────────────────────────────────────
    // Animates only breatheProxy — which scales/shifts the drawImage rect.
    // Values are extremely subtle per spec:
    //   scaleY 1 → 1.008  (chest rise)
    //   scaleX 1 → 0.996  (slight narrowing as chest expands forward)
    //   y 0 → -2          (body lifts 2 px on inhale)
    //
    // One full breath cycle ≈ 7 s (inhale 3.2 s, exhale 3.8 s).
    const breatheTL = gsap.timeline({ repeat: -1 });

    // Inhale
    breatheTL.to(breatheProxy.current, {
      scaleY:   1.020,
      scaleX:   0.999,
      y:        -2,
      duration: 3.2,
      ease:     "sine.inOut",
    });
    // Exhale
    breatheTL.to(breatheProxy.current, {
      scaleY:   1.008,
      scaleX:   1.006,
      y:        0,
      duration: 3.8,
      ease:     "sine.inOut",
    });

    // ── Belt sway timeline ──────────────────────────────────────────────
    // Slightly slower and out of phase with breathing — two independent
    // sinusoidal swings that feel like light wind, not a metronome.
    // swayX ≤ ±3 px   swayY ≤ ±1.5 px  → almost imperceptible at small sizes
    const beltTL = gsap.timeline({ repeat: -1 });

    beltTL.to(beltProxy.current, {
      swayX:    2.5,
      swayY:    1.2,
      duration: 2.4,
      ease:     "sine.inOut",
    });
    beltTL.to(beltProxy.current, {
      swayX:   -1.8,
      swayY:    0.4,
      duration: 3.1,
      ease:     "sine.inOut",
    });
    beltTL.to(beltProxy.current, {
      swayX:    1.2,
      swayY:   -0.8,
      duration: 2.7,
      ease:     "sine.inOut",
    });
    beltTL.to(beltProxy.current, {
      swayX:    0,
      swayY:    0,
      duration: 2.0,
      ease:     "sine.inOut",
    });

    // ── Wind timeline ───────────────────────────────────────────────────
    // Drives the atmospheric haze and dust nudge in drawOverlay.
    // Also nudges beltProxy via windProxy for cross-influence.
    const windTL = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });

    windTL.to(windProxy.current, { shiftX:  4,  duration: 1.8, ease: "power1.inOut" });
    windTL.to(windProxy.current, { shiftX: -2,  duration: 2.6, ease: "power2.inOut" });
    windTL.to(windProxy.current, { shiftX:  6,  duration: 1.4, ease: "power1.in"    });
    windTL.to(windProxy.current, { shiftX:  0,  duration: 3.0, ease: "power2.out"   });

    // Compose into one master TL so killing is a single call
    idleTLRef.current = gsap.timeline();
    idleTLRef.current.add(breatheTL, 0).add(beltTL, 0.8).add(windTL, 0);

    idleRAFRef.current = requestAnimationFrame(idleLoop);
  }, [idleLoop]);

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

    // Reset proxies so the next scroll drawFrame is pixel-perfect
    breatheProxy.current = { scaleX: 1, scaleY: 1, y: 0 };
    beltProxy.current    = { swayX: 0,  swayY: 0 };
    windProxy.current    = { shiftX: 0 };

    // Clear overlay canvas
    const overlay = overlayCanvasRef.current;
    if (overlay) {
      const ctx = overlay.getContext("2d");
      ctx?.clearRect(0, 0, overlay.offsetWidth, overlay.offsetHeight);
    }
  }, []);

  // ── Scroll → idle debounce (500 ms) ──────────────────────────────────────
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

  // ── Scroll listener ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const onScroll = () => { cancelIdle(); scheduleIdle(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    scheduleIdle(); // fire on initial load if no scroll
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

  // ── Initial draw & resize observer ───────────────────────────────────────
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

  // ── Opacity reveal ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || !stickyRef.current) return;
    stickyRef.current.style.opacity = "1";
  }, [visible]);

  // ── Unmount cleanup ───────────────────────────────────────────────────────
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
        {/* Ink texture overlay */}
        <div className="ink-texture" aria-hidden="true" />

        {/* Mountain silhouette layer */}
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

        {/* Frame canvas — fixed, never transformed */}
        <canvas
          ref={canvasRef}
          className="frame-canvas"
          aria-label={`Animation frame ${currentFrame + 1} of ${TOTAL_FRAMES}`}
        />

        {/* Overlay canvas — dust, atmosphere, belt sway (idle only) */}
        <canvas
          ref={overlayCanvasRef}
          className="overlay-canvas"
          aria-hidden="true"
        />

        {/* Smoke particles */}
        <SmokeParticles />

        {/* Bottom vignette */}
        <div className="vignette" aria-hidden="true" />

        {/* Overlay text */}
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

        /* Canvas stays absolutely fixed — breathing is purely in drawImage geometry */
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
            radial-gradient(
              ellipse 70% 70% at 50% 50%,
              transparent 40%,
              rgba(0,0,0,0.6) 100%
            ),
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.5) 0%,
              transparent 15%,
              transparent 70%,
              rgba(0,0,0,0.9) 100%
            );
        }
      `}</style>
    </div>
  );
}

/* ── Smoke particles ────────────────────────────────────────────────────────── */
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
          background: radial-gradient(
            circle,
            rgba(255,255,255,0.05) 0%,
            transparent 70%
          );
          animation: smokeRise linear infinite;
        }

        @keyframes smokeRise {
          0%   { transform: translateY(0) scale(1);     opacity: 0; }
          15%  {                                         opacity: 1; }
          85%  {                                         opacity: 0.3; }
          100% { transform: translateY(-220px) scale(2.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}