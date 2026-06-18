"use client";

/**
 * CustomizePage.tsx
 *
 * Cosmetics DATA layer  →  cosmetics.ts  (CosmeticItem, AVATARS, BANNERS,
 *                                         getUnlockedCosmetics, isUnlocked,
 *                                         SEASONS, BELT_RANK, BELT_ORDER)
 *
 * Visual RENDERER layer →  BeltAvatarPreview / BeltBannerPreview
 *                          (built on your student-page BELT_AURA / BELT_COLORS
 *                           / BELT_PANEL system — nothing re-invented)
 *
 * Flow:
 *  1. cosmetics.ts provides the catalogue (AVATARS, BANNERS) and unlock logic
 *  2. getUnlockedCosmetics() decides which items the student can equip
 *  3. isUnlocked()          decides whether to show lock overlay per item
 *  4. SEASONS               drives the season tab + season label on each card
 *  5. CosmeticItem.unlockBelt maps to BELT_AURA/BELT_COLORS for the renderer
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { saveEquipped } from "./cosmeticsStore";

// ── cosmetics.ts imports ──────────────────────────────────────────────────────
import {
  type Belt,
  type CosmeticItem,
  BELT_ORDER,
  BELT_RANK,
  SEASONS,
  AVATARS,
  BANNERS,
  getUnlockedCosmetics,
  isUnlocked,
} from "./cosmetics";

// ─────────────────────────────────────────────────────────────────────────────
// Visual system — mirrors your StudentPage exactly
// (BELT_AURA, BELT_COLORS, BELT_PANEL drive every renderer)
// ─────────────────────────────────────────────────────────────────────────────
const BELT_COLORS: Record<Belt, { bg: string; text: string; border: string }> = {
  White:  { bg: "#f5f5f5", text: "#111", border: "#ccc"    },
  Yellow: { bg: "#f5c518", text: "#111", border: "#d4a800" },
  Orange: { bg: "#f97316", text: "#fff", border: "#c2410c" },
  Green:  { bg: "#2d6a2d", text: "#fff", border: "#1e4a1e" },
  Blue:   { bg: "#1a3a6e", text: "#fff", border: "#0f2548" },
  Purple: { bg: "#4c1d95", text: "#fff", border: "#2e1065" },
  Brown:  { bg: "#5c3317", text: "#fff", border: "#3e2210" },
  Black:  { bg: "#111",    text: "#fff", border: "#333"    },
};

const BELT_AURA: Record<Belt, { ringColor: string; glowColor: string; animation: string }> = {
  White:  { ringColor: "#ddd",    glowColor: "rgba(255,255,255,0.30)", animation: "aura-shimmer"    },
  Yellow: { ringColor: "#ffe600", glowColor: "rgba(255,230,0,0.60)",   animation: "aura-pulse"      },
  Orange: { ringColor: "#f97316", glowColor: "rgba(249,115,22,0.60)",  animation: "aura-ember"      },
  Green:  { ringColor: "#4ade80", glowColor: "rgba(74,222,128,0.55)",  animation: "aura-breathe"    },
  Blue:   { ringColor: "#4a9eff", glowColor: "rgba(74,158,255,0.55)",  animation: "aura-ripple"     },
  Purple: { ringColor: "#a855f7", glowColor: "rgba(168,85,247,0.55)",  animation: "aura-pulse"      },
  Brown:  { ringColor: "#f59e0b", glowColor: "rgba(245,158,11,0.60)",  animation: "aura-earthpulse" },
  Black:  { ringColor: "#f5d576", glowColor: "rgba(245,213,118,0.85)", animation: "aura-rotate"     },
};

const BELT_PANEL: Record<Belt, { gradient: string; pattern: string; glow: string }> = {
  White:  { gradient: "linear-gradient(to bottom,#e8e8e8,#aaa,#e8e8e8)",          pattern: "solid",  glow: "rgba(255,255,255,0.2)"  },
  Yellow: { gradient: "linear-gradient(to bottom,#f5c518,#d4a800,#f5c518)",        pattern: "dashes", glow: "rgba(245,197,24,0.4)"   },
  Orange: { gradient: "linear-gradient(to bottom,#f97316,#c2410c,#f97316)",        pattern: "dots",   glow: "rgba(249,115,22,0.45)"  },
  Green:  { gradient: "linear-gradient(to bottom,#1e4a1e,#3a8c3a,#1e4a1e)",        pattern: "double", glow: "rgba(58,140,58,0.35)"   },
  Blue:   { gradient: "linear-gradient(to bottom,#0f2548,#2255aa,#0f2548)",         pattern: "double", glow: "rgba(34,85,170,0.4)"    },
  Purple: { gradient: "linear-gradient(to bottom,#2e1065,#7c3aed,#2e1065)",         pattern: "dots",   glow: "rgba(124,58,237,0.4)"   },
  Brown:  { gradient: "linear-gradient(to bottom,#3e2210,#7a4520,#3e2210)",         pattern: "dots",   glow: "rgba(122,69,32,0.4)"    },
  Black:  { gradient: "linear-gradient(to bottom,#111,#444,#c9a84c,#444,#111)",    pattern: "zigzag", glow: "rgba(201,168,76,0.5)"   },
};

// ─────────────────────────────────────────────────────────────────────────────
// Avatar renderer  — uses CosmeticItem.unlockBelt to pick aura/colors
// kanji comes from CosmeticItem.kanji  (defined in cosmetics.ts catalogue)
// ─────────────────────────────────────────────────────────────────────────────
function AvatarRenderer({
  item,
  size = 72,
}: {
  item: CosmeticItem;
  size?: number;
}) {
  // CosmeticItem.unlockBelt → visual system lookup
  const belt = item.unlockBelt;
  const bc   = BELT_COLORS[belt];
  const aura = BELT_AURA[belt];

  return (
    <div style={{
      position: "relative",
      width:  size + 32,
      height: size + 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      {/* Aura rings — your student-page system */}
      {Array.from({ length: 5 }).map((_: unknown, i: number) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width:  size + 12 + i * 9,
          height: size + 12 + i * 9,
          borderRadius: "50%",
          border: `2px solid ${aura.ringColor}`,
          opacity: 0.75 - i * 0.12,
          transform: "translate(-50%,-50%)",
          animationName: i % 2 === 0 ? aura.animation : "aura-counter",
          animationDuration: `${2.8 + i * 0.7}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          boxShadow: `0 0 ${18 + i * 6}px ${aura.glowColor}`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Core circle */}
      <div style={{
        width: size, height: size,
        borderRadius: "50%",
        background: bc.bg,
        border: `3px solid ${bc.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2,
        boxShadow: `inset 0 0 20px ${aura.glowColor}, 0 0 20px 6px rgba(0,0,0,0.7)`,
      }}>
        {/* kanji from CosmeticItem — not hardcoded */}
        <span style={{
          fontFamily: "serif",
          fontSize: size * 0.36,
          fontWeight: 700,
          color: bc.text,
          userSelect: "none",
          letterSpacing: 1,
        }}>
          {item.kanji}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Banner renderer — uses CosmeticItem.unlockBelt + kanji + name + description
// ─────────────────────────────────────────────────────────────────────────────
function BannerRenderer({
  item,
  width  = 340,
  height = 100,
}: {
  item: CosmeticItem;
  width?: number;
  height?: number;
}) {
  const belt  = item.unlockBelt;
  const bc    = BELT_COLORS[belt];
  const aura  = BELT_AURA[belt];
  const panel = BELT_PANEL[belt];
  const PW    = 8; // panel width px

  // Belt panel patterns — your exact student-page SVG patterns
  const patternURL: Record<string, string> = {
    dashes: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='12'><rect x='0' y='0' width='${PW}' height='7' fill='rgba(0,0,0,0.3)'/></svg>`
    )}")`,
    double: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='1'><rect x='1' y='0' width='1' height='1' fill='rgba(255,255,255,0.3)'/><rect x='4' y='0' width='1' height='1' fill='rgba(255,255,255,0.3)'/></svg>`
    )}")`,
    dots: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='8'><circle cx='3' cy='4' r='1.1' fill='rgba(255,255,255,0.3)'/></svg>`
    )}")`,
    zigzag: `url("data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='8'><polyline points='0,4 3,0 6,4 3,8' fill='none' stroke='rgba(201,168,76,0.6)' stroke-width='1'/></svg>`
    )}")`,
    solid: "none",
  };

  // Season name for this item — from SEASONS catalogue
  const season = SEASONS.find((s: typeof SEASONS[0]) => s.id === item.seasonId);

  return (
    <div style={{
      position: "relative",
      width, height,
      borderRadius: 6,
      overflow: "hidden",
      background: "#080808",
      border: `1px solid ${bc.border}`,
      boxShadow: `0 0 18px 3px ${aura.glowColor}, inset 0 0 28px rgba(0,0,0,0.6)`,
    }}>
      {/* Rotating conic glow border — your LegendaryRotatingBorder */}
      <div style={{
        position: "absolute", inset: -20,
        borderRadius: 10,
        background: `conic-gradient(transparent 30%, ${aura.ringColor}, transparent 70%)`,
        animation: `rotateBorder ${belt === "Black" ? "6s" : "9s"} linear infinite`,
        opacity: 0.55, filter: "blur(2px)",
        pointerEvents: "none",
      }} />

      {/* Left accent panel — your BeltPanel */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: PW, height: "100%",
        background: panel.gradient,
        boxShadow: `4px 0 20px 3px ${panel.glow}`,
        zIndex: 2, overflow: "hidden",
      }}>
        {panel.pattern !== "solid" && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: patternURL[panel.pattern] ?? "none",
            backgroundRepeat: "repeat-y",
            backgroundSize: `${PW}px auto`,
            mixBlendMode: "overlay",
          }} />
        )}
        {/* Black belt spark */}
        {belt === "Black" && (
          <div style={{
            position: "absolute", left: 0, width: "100%", height: 36,
            background: "linear-gradient(to bottom,transparent,rgba(245,213,118,0.95),transparent)",
            animation: "panel-spark 2s linear infinite",
          }} />
        )}
      </div>

      {/* Diagonal grid lines */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.035, pointerEvents: "none" }}>
        {Array.from({ length: 14 }).map((_: unknown, i: number) => (
          <div key={i} style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${i * 28}px`, width: 1,
            background: bc.border,
            transform: "skewX(-20deg)",
          }} />
        ))}
      </div>

      {/* Kanji watermark — item.kanji from cosmetics.ts */}
      <div style={{
        position: "absolute", right: 14, top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "serif", fontSize: height * 0.9,
        color: bc.border, opacity: 0.065,
        fontWeight: 700, lineHeight: 1,
        userSelect: "none", pointerEvents: "none",
      }}>
        {item.kanji}
      </div>

      {/* Content — item.name, item.description from cosmetics.ts */}
      <div style={{
        position: "relative", zIndex: 3,
        paddingLeft: PW + 14, paddingRight: 14,
        height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center", gap: 4,
      }}>
        {/* Season label — from SEASONS catalogue via item.seasonId */}
        {season && (
          <p style={{
            fontFamily: "var(--font-montserrat,sans-serif)",
            fontSize: 8, letterSpacing: "2.5px",
            color: aura.ringColor, textTransform: "uppercase",
            opacity: 0.75, margin: 0,
          }}>
            {season.name} · {season.year}
          </p>
        )}
        <p style={{
          fontFamily: "var(--font-cinzel,serif)",
          fontSize: 15, fontWeight: 700,
          color: "#e8e8e8", letterSpacing: "1px",
          margin: 0, lineHeight: 1.2,
        }}>
          {item.name}
        </p>
        <p style={{
          fontFamily: "var(--font-montserrat,sans-serif)",
          fontSize: 9, color: "#555",
          margin: 0, lineHeight: 1.4,
        }}>
          {item.description}
        </p>
      </div>

      {/* Right edge glow */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 70,
        background: `linear-gradient(to left,${aura.glowColor},transparent)`,
        opacity: 0.15, pointerEvents: "none",
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Lock overlay — shows which belt unlocks this CosmeticItem
// ─────────────────────────────────────────────────────────────────────────────
function LockOverlay({ item }: { item: CosmeticItem }) {
  return (
    <div style={{
      position: "absolute", inset: 0, borderRadius: 6, zIndex: 10,
      background: "rgba(0,0,0,0.82)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 5,
      backdropFilter: "blur(2px)",
    }}>
      <span style={{ fontSize: 18, opacity: 0.5 }}>🔒</span>
      <p style={{
        fontFamily: "var(--font-montserrat,sans-serif)",
        fontSize: 8, letterSpacing: "2px",
        color: "#444", textTransform: "uppercase",
        textAlign: "center", margin: 0,
      }}>
        Unlock at
      </p>
      {/* item.unlockBelt — straight from cosmetics.ts CosmeticItem */}
      <p style={{
        fontFamily: "var(--font-cinzel,serif)",
        fontSize: 10, color: "#3a3a3a",
        letterSpacing: "1px", margin: 0,
      }}>
        {item.unlockBelt} Belt
      </p>
      {/* season_belt items also show season name */}
      {item.unlockType === "season_belt" && (
        <p style={{
          fontFamily: "var(--font-montserrat,sans-serif)",
          fontSize: 8, color: "#2a2a2a",
          letterSpacing: "1px", margin: 0,
        }}>
          {SEASONS.find((s: typeof SEASONS[0]) => s.id === item.seasonId)?.name}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cosmetic card — single item card driven entirely by CosmeticItem
// ─────────────────────────────────────────────────────────────────────────────
function CosmeticCard({
  item,
  equipped,
  studentBelt,
  seasonId,
  onEquip,
}: {
  item: CosmeticItem;
  equipped: boolean;
  studentBelt: Belt;
  seasonId: string;
  onEquip: (item: CosmeticItem) => void;
}) {
  const unlocked = isUnlocked(item, studentBelt, seasonId);
  const aura     = BELT_AURA[item.unlockBelt];
  const btnRef   = useRef<HTMLButtonElement>(null);
  const season   = SEASONS.find((s: typeof SEASONS[0]) => s.id === item.seasonId);

  return (
    <div
      className="cosmetic-card"
      style={{
        position: "relative",
        background: "#080808",
        border: `1px solid ${equipped ? "#BE0027" : unlocked ? "#1e1e1e" : "#111"}`,
        borderRadius: 6,
        padding: 14,
        display: "flex", flexDirection: "column", alignItems: "center",
        boxShadow: equipped
          ? "0 0 18px rgba(190,0,39,0.28), inset 0 0 8px rgba(190,0,39,0.08)"
          : unlocked
          ? `0 0 10px ${aura.glowColor}`
          : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        opacity: unlocked ? 1 : 0.6,
      }}
    >
      {/* Equipped tag */}
      {equipped && (
        <div style={{
          position: "absolute", top: 8, right: 10,
          fontFamily: "var(--font-montserrat,sans-serif)",
          fontSize: 8, fontWeight: 700,
          letterSpacing: "1.5px", color: "#BE0027",
          textTransform: "uppercase",
        }}>
          ★ ON
        </div>
      )}

      {/* Season exclusive tag */}
      {item.unlockType === "season_belt" && (
        <div style={{
          position: "absolute", top: 8, left: 14,
          fontFamily: "var(--font-montserrat,sans-serif)",
          fontSize: 7, fontWeight: 700,
          letterSpacing: "1.5px",
          color: aura.ringColor,
          textTransform: "uppercase", opacity: 0.7,
        }}>
          {season?.id} EXCLUSIVE
        </div>
      )}

      {/* Renderer — avatar or banner based on item.type */}
      <div style={{
        width: "100%",
        display: "flex", justifyContent: "center",
        filter: unlocked ? "none" : "grayscale(1) brightness(0.25)",
      }}>
        {item.type === "avatar" ? (
          <AvatarRenderer item={item} size={62} />
        ) : (
          <div style={{ width: "100%", borderRadius: 4, overflow: "hidden" }}>
            <BannerRenderer item={item} width={220} height={68} />
          </div>
        )}
      </div>

      {/* Info — all from CosmeticItem fields */}
      <div style={{ width: "100%", marginTop: 10 }}>
        <p style={{
          fontFamily: "var(--font-cinzel,serif)",
          fontSize: 12, fontWeight: 600,
          color: unlocked ? "#ccc" : "#333",
          margin: 0, lineHeight: 1.25,
        }}>
          {item.name}
        </p>
        <p style={{
          fontFamily: "var(--font-montserrat,sans-serif)",
          fontSize: 8, color: unlocked ? "#4a4a4a" : "#252525",
          margin: "4px 0 0", lineHeight: 1.45,
        }}>
          {item.description}
        </p>
        {/* Unlock belt badge — item.unlockBelt */}
        <p style={{
          fontFamily: "var(--font-montserrat,sans-serif)",
          fontSize: 8, letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: unlocked ? aura.ringColor : "#2a2a2a",
          margin: "6px 0 0", opacity: 0.85,
        }}>
          {item.unlockBelt} Belt
        </p>
      </div>

      {/* Equip button — only if unlocked */}
      {unlocked && (
        <button
          ref={btnRef}
          onClick={() => onEquip(item)}
          onMouseEnter={() => !equipped && gsap.to(btnRef.current, { scale: 1.04, duration: 0.15 })}
          onMouseLeave={() => gsap.to(btnRef.current, { scale: 1, duration: 0.15 })}
          style={{
            marginTop: 10, width: "100%",
            padding: "7px 0",
            border: `1.5px solid ${equipped ? "#BE0027" : "#2a2a2a"}`,
            borderRadius: 3,
            background: equipped ? "#BE0027" : "transparent",
            color: equipped ? "#fff" : "#555",
            fontFamily: "var(--font-montserrat,sans-serif)",
            fontSize: 9, fontWeight: 700,
            letterSpacing: "2px", textTransform: "uppercase",
            cursor: equipped ? "default" : "pointer",
            transition: "background 0.2s, border-color 0.2s, color 0.2s",
          }}
        >
          {equipped ? "✓ Equipped" : "Equip"}
        </button>
      )}

      {/* Lock overlay — passes item so it can show item.unlockBelt */}
      {!unlocked && <LockOverlay item={item} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile preview — shows equipped avatar + banner together
// ─────────────────────────────────────────────────────────────────────────────
function ProfilePreview({
  studentBelt,
  equippedAvatarItem,
  equippedBannerItem,
  firstName,
  lastName,
}: {
  studentBelt: Belt;
  equippedAvatarItem: CosmeticItem;
  equippedBannerItem: CosmeticItem;
  firstName: string;
  lastName: string;
}) {
  const bc = BELT_COLORS[studentBelt];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{
        fontFamily: "var(--font-montserrat,sans-serif)",
        fontSize: 9, letterSpacing: "3px",
        color: "#3a3a3a", textTransform: "uppercase", margin: 0,
      }}>
        Profile Preview
      </p>

      {/* Banner */}
      <div style={{ borderRadius: 6, overflow: "hidden" }}>
        <BannerRenderer item={equippedBannerItem} width={360} height={88} />
      </div>

      {/* Student card */}
      <div style={{
        background: "#0a0a0a",
        border: "1px solid #1a1a1a",
        borderRadius: "0 0 6px 6px",
        padding: "12px 16px",
        display: "flex", gap: 12, alignItems: "center",
        marginTop: -4,
      }}>
        <AvatarRenderer item={equippedAvatarItem} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: "var(--font-cinzel,serif)",
            fontSize: 14, fontWeight: 600,
            color: "#e0e0e0", margin: 0,
          }}>
            {firstName} {lastName}
          </p>
          {/* Belt badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            marginTop: 6, padding: "2px 10px 2px 7px",
            background: bc.bg, color: bc.text,
            border: `1px solid ${bc.border}`,
            borderRadius: 2,
            fontFamily: "var(--font-montserrat,sans-serif)",
            fontSize: 9, fontWeight: 700,
            letterSpacing: "1.5px", textTransform: "uppercase",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: bc.text, opacity: 0.55 }} />
            {studentBelt}
          </div>
        </div>
        {/* Equipped cosmetic names — from CosmeticItem.name */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{
            fontFamily: "var(--font-montserrat,sans-serif)",
            fontSize: 8, color: "#2e2e2e",
            letterSpacing: "1.5px", textTransform: "uppercase", margin: 0,
          }}>Avatar</p>
          <p style={{
            fontFamily: "var(--font-cinzel,serif)",
            fontSize: 10, color: "#555", margin: "2px 0 8px",
          }}>
            {equippedAvatarItem.name}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat,sans-serif)",
            fontSize: 8, color: "#2e2e2e",
            letterSpacing: "1.5px", textTransform: "uppercase", margin: 0,
          }}>Banner</p>
          <p style={{
            fontFamily: "var(--font-cinzel,serif)",
            fontSize: 10, color: "#555", margin: "2px 0 0",
          }}>
            {equippedBannerItem.name}
          </p>
        </div>
      </div>

      <p style={{
        fontFamily: "var(--font-montserrat,sans-serif)",
        fontSize: 8, color: "#2a2a2a",
        letterSpacing: "1px", margin: 0, textAlign: "center",
      }}>
        This is how other students see your profile
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Season tab
// ─────────────────────────────────────────────────────────────────────────────
function SeasonTab({
  season,
  active,
  onClick,
}: {
  season: typeof SEASONS[0];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 18px",
        background: active ? "rgba(190,0,39,0.12)" : "transparent",
        border: `1px solid ${active ? "#BE0027" : "#1e1e1e"}`,
        borderRadius: 3,
        color: active ? "#e8e8e8" : "#444",
        fontFamily: "var(--font-montserrat,sans-serif)",
        fontSize: 9, fontWeight: 700,
        letterSpacing: "2px", textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
      }}
    >
      <span style={{ color: active ? "#BE0027" : "#333", fontSize: 8 }}>{season.id}</span>
      {season.name}
      {season.active && (
        <span style={{ fontSize: 7, color: "#BE0027", letterSpacing: "1.5px" }}>● ACTIVE</span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

// Simulated student — replace with real auth/session
const STUDENT = {
  firstName:   "Arjun",
  lastName:    "Sharma",
  belt:        "Yellow" as Belt,
  memberId:    "BKF-2024-00847",
  seasonId:    "S1",
  // Default equipped IDs — from cosmetics.ts item.id
  equippedAvatarId: "avatar_white_s1",
  equippedBannerId: "banner_white_s1",
};

type Tab = "avatar" | "banner";

export default function CustomizePage() {
  const [studentBelt]     = useState<Belt>(STUDENT.belt);
  const [activeSeason, setActiveSeason] = useState(STUDENT.seasonId);
  const [activeTab, setActiveTab]       = useState<Tab>("avatar");

  // Equipped state — tracked by CosmeticItem.id
  const [equippedAvatarId, setEquippedAvatarId] = useState(STUDENT.equippedAvatarId);
  const [equippedBannerId, setEquippedBannerId] = useState(STUDENT.equippedBannerId);
  // Saved state (what's actually persisted)
  const [savedAvatarId, setSavedAvatarId] = useState(STUDENT.equippedAvatarId);
  const [savedBannerId, setSavedBannerId] = useState(STUDENT.equippedBannerId);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef   = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);

  // Items to show in the grid for current tab + season filter
  // getUnlockedCosmetics tells us what the student HAS unlocked
  // We show ALL items but lock ones not in the unlocked list
  const allItems      = activeTab === "avatar" ? AVATARS : BANNERS;
  const seasonItems   = allItems.filter((i: CosmeticItem) => i.seasonId === activeSeason);

  // Lookup equipped CosmeticItem objects for renderers
  const equippedAvatarItem = AVATARS.find((a: CosmeticItem) => a.id === equippedAvatarId) ?? AVATARS[0];
  const equippedBannerItem = BANNERS.find((b: CosmeticItem) => b.id === equippedBannerId) ?? BANNERS[0];

  const unlockedCount = getUnlockedCosmetics(studentBelt, activeSeason, allItems).length;
  const hasChanges    = equippedAvatarId !== savedAvatarId || equippedBannerId !== savedBannerId;

  // Entrance GSAP — autoAlpha so page never stays black if GSAP errors
  useEffect(() => {
    if (!headerRef.current || !bodyRef.current) return;
    gsap.set([headerRef.current, bodyRef.current], { autoAlpha: 0, y: 16 });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(headerRef.current, { autoAlpha: 1, y: 0, duration: 0.65 })
      .to(bodyRef.current,   { autoAlpha: 1, y: 0, duration: 0.55 }, "-=0.35");
  }, []);

  // Animate grid cards on tab / season change
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".cosmetic-card");
    if (!cards?.length) return;
    gsap.set(cards, { autoAlpha: 0, y: 14, scale: 0.97 });
    gsap.to(cards, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.05, ease: "power2.out" });
  }, [activeTab, activeSeason]);

  const handleEquip = useCallback((item: CosmeticItem) => {
    if (!isUnlocked(item, studentBelt, activeSeason)) return;
    if (item.type === "avatar") setEquippedAvatarId(item.id);
    else                        setEquippedBannerId(item.id);
  }, [studentBelt, activeSeason]);

  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      saveEquipped({ avatarId: equippedAvatarId, bannerId: equippedBannerId });
      setSavedAvatarId(equippedAvatarId);
      setSavedBannerId(equippedBannerId);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 800);
  };

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div style={{ minHeight: "100vh", background: "#050505", paddingTop: 80 }}>

        {/* ── Header ── */}
        <div ref={headerRef} style={{
          borderBottom: "1px solid #111",
          padding: "38px 40px 26px",
          maxWidth: 1120, margin: "0 auto",
        }}>
          <p style={{
            fontFamily: "var(--font-montserrat,sans-serif)",
            fontSize: 10, letterSpacing: "4px",
            color: "#555", textTransform: "uppercase", margin: "0 0 10px",
          }}>
            Bushido Karate Federation · Cosmetic Studio
          </p>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{
                fontFamily: "var(--font-cinzel,serif)",
                fontSize: "clamp(24px,4vw,40px)",
                fontWeight: 700, color: "#e8e8e8",
                letterSpacing: "3px", textTransform: "uppercase",
                margin: 0, lineHeight: 1.1,
              }}>
                Customize
              </h1>
              <p style={{
                fontFamily: "var(--font-montserrat,sans-serif)",
                fontSize: 11, color: "#444",
                margin: "7px 0 0", letterSpacing: "0.5px",
              }}>
                Advance your belt rank to unlock new avatars and banners
              </p>
            </div>

            {/* Student belt + unlock count */}
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{
                  fontFamily: "var(--font-montserrat,sans-serif)",
                  fontSize: 8, color: "#3a3a3a",
                  letterSpacing: "2px", textTransform: "uppercase", margin: 0,
                }}>Your Belt</p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6, marginTop: 4,
                  padding: "3px 12px 3px 8px",
                  background: BELT_COLORS[studentBelt].bg,
                  color: BELT_COLORS[studentBelt].text,
                  border: `1px solid ${BELT_COLORS[studentBelt].border}`,
                  borderRadius: 2,
                  fontFamily: "var(--font-montserrat,sans-serif)",
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: "2px", textTransform: "uppercase",
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: BELT_COLORS[studentBelt].text, opacity: 0.6 }} />
                  {studentBelt}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{
                  fontFamily: "var(--font-montserrat,sans-serif)",
                  fontSize: 8, color: "#3a3a3a",
                  letterSpacing: "2px", textTransform: "uppercase", margin: 0,
                }}>Unlocked</p>
                <p style={{
                  fontFamily: "var(--font-cinzel,serif)",
                  fontSize: 22, fontWeight: 700,
                  color: "#e8e8e8", margin: "3px 0 0", lineHeight: 1,
                }}>
                  {unlockedCount}
                  <span style={{ fontSize: 11, color: "#333" }}>/{seasonItems.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div ref={bodyRef} style={{
          maxWidth: 1120, margin: "0 auto",
          padding: "28px 40px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 28, alignItems: "start",
        }}>

          {/* ── Left: season tabs + type tabs + grid ── */}
          <div>

            {/* Season tabs — from SEASONS in cosmetics.ts */}
            <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
              {SEASONS.map((s) => (
                <SeasonTab
                  key={s.id}
                  season={s}
                  active={activeSeason === s.id}
                  onClick={() => setActiveSeason(s.id)}
                />
              ))}
            </div>

            {/* Type tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 22, borderBottom: "1px solid #181818" }}>
              {(["avatar", "banner"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "9px 22px",
                    background: "none", border: "none",
                    borderBottom: `2px solid ${activeTab === tab ? "#BE0027" : "transparent"}`,
                    color: activeTab === tab ? "#e8e8e8" : "#3a3a3a",
                    fontFamily: "var(--font-montserrat,sans-serif)",
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: "2.5px", textTransform: "uppercase",
                    cursor: "pointer", transition: "color 0.2s",
                    marginBottom: -1,
                  }}
                >
                  {tab === "avatar" ? "🎭 Avatars" : "🏮 Banners"}
                  <span style={{
                    marginLeft: 8, fontSize: 8, color: "#333",
                    fontWeight: 400, letterSpacing: "1px",
                  }}>
                    ({(tab === "avatar" ? AVATARS : BANNERS).filter((i) => i.seasonId === activeSeason).length})
                  </span>
                </button>
              ))}
            </div>

            {/* Unlock progress bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{
                  fontFamily: "var(--font-montserrat,sans-serif)",
                  fontSize: 8, color: "#333", letterSpacing: "2px", textTransform: "uppercase",
                }}>
                  Season Progress
                </span>
                <span style={{
                  fontFamily: "var(--font-montserrat,sans-serif)",
                  fontSize: 8, color: "#444",
                  letterSpacing: "1px",
                }}>
                  {unlockedCount}/{seasonItems.length} unlocked
                </span>
              </div>
              <div style={{ height: 2, background: "#111", borderRadius: 2 }}>
                <div style={{
                  height: "100%",
                  width: `${(unlockedCount / Math.max(seasonItems.length, 1)) * 100}%`,
                  background: "linear-gradient(to right,#BE0027,#ff4060)",
                  borderRadius: 2,
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>

            {/* Cosmetics grid — each CosmeticCard is driven by one CosmeticItem */}
            <div ref={gridRef} style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
              gap: 10,
            }}>
              {seasonItems.map((item: CosmeticItem) => (
                <CosmeticCard
                  key={item.id}
                  item={item}
                  equipped={
                    item.type === "avatar"
                      ? item.id === equippedAvatarId
                      : item.id === equippedBannerId
                  }
                  studentBelt={studentBelt}
                  seasonId={activeSeason}
                  onEquip={handleEquip}
                />
              ))}
            </div>
          </div>

          {/* ── Right: preview + save + unlock tracker ── */}
          <div style={{ position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Profile preview — passes CosmeticItem objects, not belt strings */}
            <ProfilePreview
              studentBelt={studentBelt}
              equippedAvatarItem={equippedAvatarItem}
              equippedBannerItem={equippedBannerItem}
              firstName={STUDENT.firstName}
              lastName={STUDENT.lastName}
            />

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!hasChanges || saveState === "saving"}
              style={{
                width: "100%", padding: "12px 0",
                background:
                  saveState === "saved"   ? "#16a34a" :
                  hasChanges              ? "#BE0027" : "#0d0d0d",
                border: `1px solid ${
                  saveState === "saved"   ? "#16a34a" :
                  hasChanges              ? "#BE0027" : "#1a1a1a"
                }`,
                borderRadius: 3,
                color: hasChanges || saveState === "saved" ? "#fff" : "#2a2a2a",
                fontFamily: "var(--font-montserrat,sans-serif)",
                fontSize: 10, fontWeight: 700,
                letterSpacing: "3px", textTransform: "uppercase",
                cursor: hasChanges && saveState === "idle" ? "pointer" : "default",
                transition: "all 0.25s",
              }}
            >
              {saveState === "saving" ? "Saving…" :
               saveState === "saved"  ? "✓ Saved"  :
               hasChanges             ? "Save Changes" : "No Changes"}
            </button>

            {/* Belt unlock tracker — uses BELT_ORDER + BELT_RANK from cosmetics.ts */}
            <div style={{
              background: "#080808",
              border: "1px solid #111",
              borderRadius: 6, padding: 16,
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat,sans-serif)",
                fontSize: 9, letterSpacing: "2.5px",
                color: "#333", textTransform: "uppercase",
                margin: "0 0 14px",
              }}>
                Unlock Progression
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {BELT_ORDER.map((belt: Belt) => {
                  const unlocked  = BELT_RANK[belt] <= BELT_RANK[studentBelt];
                  const isCurrent = belt === studentBelt;
                  const aura      = BELT_AURA[belt];
                  const bc        = BELT_COLORS[belt];
                  // How many cosmetics does this belt unlock in the current season?
                  const beltItems = seasonItems.filter((i) => i.unlockBelt === belt);

                  return (
                    <div key={belt} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {/* Belt dot */}
                      <div style={{
                        width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                        background: unlocked ? bc.bg : "#181818",
                        border: `1.5px solid ${unlocked ? bc.border : "#222"}`,
                        boxShadow: isCurrent ? `0 0 7px ${aura.glowColor}` : "none",
                      }} />
                      {/* Connector */}
                      <div style={{
                        flex: 1, height: 1,
                        background: unlocked ? bc.border : "#181818",
                        opacity: 0.4,
                      }} />
                      {/* Belt name */}
                      <p style={{
                        fontFamily: "var(--font-montserrat,sans-serif)",
                        fontSize: 9,
                        color: isCurrent ? "#aaa" : unlocked ? "#555" : "#252525",
                        letterSpacing: "1px", textTransform: "uppercase",
                        margin: 0, fontWeight: isCurrent ? 700 : 400,
                        minWidth: 52, textAlign: "right",
                      }}>
                        {belt}
                        {isCurrent && <span style={{ color: "#BE0027" }}> ←</span>}
                      </p>
                      {/* Item count badge */}
                      {beltItems.length > 0 && (
                        <span style={{
                          fontFamily: "var(--font-montserrat,sans-serif)",
                          fontSize: 8, color: unlocked ? aura.ringColor : "#222",
                          letterSpacing: "1px", minWidth: 22, textAlign: "right",
                          opacity: 0.7,
                        }}>
                          +{beltItems.length}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Responsive */}
        <style>{`
          @media (max-width: 860px) {
            .customize-body { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Keyframes — same as your student page
// ─────────────────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes rotateBorder   { from{transform:rotate(0deg)}   to{transform:rotate(360deg)} }
  @keyframes aura-shimmer   { 0%,100%{opacity:.45;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.9;transform:translate(-50%,-50%) scale(1.05)} }
  @keyframes aura-pulse     { 0%,100%{opacity:.9;transform:translate(-50%,-50%) scale(1)}  50%{opacity:.45;transform:translate(-50%,-50%) scale(1.07)} }
  @keyframes aura-ember     { 0%{opacity:.9;transform:translate(-50%,-50%) scale(1) rotate(0deg)} 40%{opacity:.6;transform:translate(-50%,-50%) scale(1.05) rotate(4deg)} 70%{opacity:1;transform:translate(-50%,-50%) scale(0.97) rotate(-3deg)} 100%{opacity:.9;transform:translate(-50%,-50%) scale(1) rotate(0deg)} }
  @keyframes aura-breathe   { 0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.2;transform:translate(-50%,-50%) scale(1.09)} }
  @keyframes aura-ripple    { 0%{opacity:.75;transform:translate(-50%,-50%) scale(1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(1.3)} }
  @keyframes aura-earthpulse{ 0%,100%{opacity:.55;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.9;transform:translate(-50%,-50%) scale(1.05)} }
  @keyframes aura-rotate    { 0%{transform:translate(-50%,-50%) rotate(0deg)} 100%{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes aura-counter   { 0%{transform:translate(-50%,-50%) rotate(0deg);opacity:.35} 50%{opacity:.15} 100%{transform:translate(-50%,-50%) rotate(-360deg);opacity:.35} }
  @keyframes panel-spark    { 0%{transform:translateY(-150%)} 100%{transform:translateY(250%)} }
`;