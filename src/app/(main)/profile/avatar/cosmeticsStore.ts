// ─────────────────────────────────────────────────────────────────────────────
// cosmeticsStore.ts
// Abhi: localStorage
// Baad mein backend: sirf getEquipped / saveEquipped replace karo — baki sab same
// ─────────────────────────────────────────────────────────────────────────────

export interface EquippedCosmetics {
  avatarId: string;
  bannerId: string;
}

const STORAGE_KEY = "bkf_equipped_cosmetics";

const DEFAULT: EquippedCosmetics = {
  avatarId: "avatar_white_s1",
  bannerId: "banner_white_s1",
};

// ── Read ──────────────────────────────────────────────────────────────────────
export function getEquipped(): EquippedCosmetics {
  if (typeof window === "undefined") return DEFAULT; // SSR safe
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

// ── Write ─────────────────────────────────────────────────────────────────────
export function saveEquipped(data: EquippedCosmetics): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─────────────────────────────────────────────────────────────────────────────
// Jab backend aaye — sirf yeh do functions replace karna:
//
// export async function getEquipped(): Promise<EquippedCosmetics> {
//   const res = await fetch("/api/cosmetics/equipped");
//   return res.json();
// }
//
// export async function saveEquipped(data: EquippedCosmetics): Promise<void> {
//   await fetch("/api/cosmetics/equipped", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }
// ─────────────────────────────────────────────────────────────────────────────