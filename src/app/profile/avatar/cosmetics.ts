// ─────────────────────────────────────────────────────────────────────────────
// Bushido Karate Federation — Cosmetic Unlock System
// Scalable: add new avatars/banners/seasons without changing existing data
// ─────────────────────────────────────────────────────────────────────────────

export type Belt =
  | "White" | "Yellow" | "Orange" | "Green"
  | "Blue"  | "Purple" | "Brown"  | "Black";

export const BELT_ORDER: Belt[] = [
  "White", "Yellow", "Orange", "Green",
  "Blue",  "Purple", "Brown",  "Black",
];

export const BELT_RANK: Record<Belt, number> = {
  White: 0, Yellow: 1, Orange: 2, Green: 3,
  Blue: 4,  Purple: 5, Brown: 6,  Black: 7,
};

export interface Season {
  id: string;
  name: string;
  year: number;
  active: boolean;
}

export const SEASONS: Season[] = [
  { id: "S1", name: "Dawn of the Dojo",    year: 2024, active: true  },
  { id: "S2", name: "Storm of Steel",      year: 2025, active: false },
];

export type CosmeticType = "avatar" | "banner";

export interface CosmeticItem {
  id: string;
  type: CosmeticType;
  name: string;
  description: string;
  seasonId: string;
  unlockBelt: Belt;
  unlockType: "belt" | "season_belt";
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  kanji: string;
  patternId: string;
}

export const AVATARS: CosmeticItem[] = [
  { id: "avatar_white_s1",  type: "avatar", name: "Blank Slate",     description: "The beginning of every journey.",          seasonId: "S1", unlockBelt: "White",  unlockType: "belt", primaryColor: "#e8e8e8", accentColor: "#aaaaaa", glowColor: "rgba(255,255,255,0.4)",    kanji: "無", patternId: "white_orb" },
  { id: "avatar_yellow_s1", type: "avatar", name: "First Light",     description: "The spark that ignites discipline.",        seasonId: "S1", unlockBelt: "Yellow", unlockType: "belt", primaryColor: "#FBBF24", accentColor: "#D97706", glowColor: "rgba(251,191,36,0.5)",     kanji: "光", patternId: "yellow_flame" },
  { id: "avatar_orange_s1", type: "avatar", name: "Ember Rising",    description: "Controlled fire, focused will.",            seasonId: "S1", unlockBelt: "Orange", unlockType: "belt", primaryColor: "#F97316", accentColor: "#C2410C", glowColor: "rgba(249,115,22,0.55)",    kanji: "炎", patternId: "orange_ember" },
  { id: "avatar_green_s1",  type: "avatar", name: "Still Forest",    description: "Patience rooted deeper than oak.",          seasonId: "S1", unlockBelt: "Green",  unlockType: "belt", primaryColor: "#16A34A", accentColor: "#14532D", glowColor: "rgba(22,163,74,0.5)",      kanji: "森", patternId: "green_forest" },
  { id: "avatar_blue_s1",   type: "avatar", name: "Deep Current",    description: "Unshakeable as the ocean floor.",           seasonId: "S1", unlockBelt: "Blue",   unlockType: "belt", primaryColor: "#2563EB", accentColor: "#1E3A8A", glowColor: "rgba(37,99,235,0.55)",     kanji: "流", patternId: "blue_current" },
  { id: "avatar_purple_s1", type: "avatar", name: "Shadow Veil",     description: "Where technique meets instinct.",           seasonId: "S1", unlockBelt: "Purple", unlockType: "belt", primaryColor: "#7C3AED", accentColor: "#4C1D95", glowColor: "rgba(124,58,237,0.55)",    kanji: "影", patternId: "purple_veil" },
  { id: "avatar_brown_s1",  type: "avatar", name: "Iron Earth",      description: "Hardened by a thousand strikes.",           seasonId: "S1", unlockBelt: "Brown",  unlockType: "belt", primaryColor: "#92400E", accentColor: "#451A03", glowColor: "rgba(146,64,14,0.6)",      kanji: "鉄", patternId: "brown_iron" },
  { id: "avatar_black_s1",  type: "avatar", name: "Void Sovereign",  description: "Mastery forged in the dark.",               seasonId: "S1", unlockBelt: "Black",  unlockType: "belt", primaryColor: "#1a1a1a", accentColor: "#C9A84C", glowColor: "rgba(201,168,76,0.7)",     kanji: "武", patternId: "black_sovereign" },
];

export const BANNERS: CosmeticItem[] = [
  { id: "banner_white_s1",  type: "banner", name: "Morning Mist",    description: "Clarity before the first kata.",            seasonId: "S1", unlockBelt: "White",  unlockType: "belt", primaryColor: "#d1d5db", accentColor: "#9ca3af", glowColor: "rgba(255,255,255,0.2)",    kanji: "始", patternId: "mist" },
  { id: "banner_yellow_s1", type: "banner", name: "Golden Dawn",     description: "The horizon breaks for the determined.",    seasonId: "S1", unlockBelt: "Yellow", unlockType: "belt", primaryColor: "#FBBF24", accentColor: "#78350F", glowColor: "rgba(251,191,36,0.3)",     kanji: "朝", patternId: "dawn" },
  { id: "banner_orange_s1", type: "banner", name: "Forge Fire",      description: "Tempered in heat, sharp as steel.",         seasonId: "S1", unlockBelt: "Orange", unlockType: "belt", primaryColor: "#F97316", accentColor: "#7C2D12", glowColor: "rgba(249,115,22,0.35)",    kanji: "鍛", patternId: "forge" },
  { id: "banner_green_s1",  type: "banner", name: "Ancient Grove",   description: "Where warriors have trained for centuries.", seasonId: "S1", unlockBelt: "Green",  unlockType: "belt", primaryColor: "#16A34A", accentColor: "#052E16", glowColor: "rgba(22,163,74,0.3)",      kanji: "道", patternId: "grove" },
  { id: "banner_blue_s1",   type: "banner", name: "Tidal Force",     description: "Overwhelming, inevitable, precise.",        seasonId: "S1", unlockBelt: "Blue",   unlockType: "belt", primaryColor: "#2563EB", accentColor: "#0C1A4E", glowColor: "rgba(37,99,235,0.35)",     kanji: "潮", patternId: "tidal" },
  { id: "banner_purple_s1", type: "banner", name: "Eclipse",         description: "Power concealed. Presence undeniable.",     seasonId: "S1", unlockBelt: "Purple", unlockType: "belt", primaryColor: "#7C3AED", accentColor: "#1E003A", glowColor: "rgba(124,58,237,0.35)",    kanji: "蝕", patternId: "eclipse" },
  { id: "banner_brown_s1",  type: "banner", name: "Broken Mountain", description: "Nothing remains unbeaten by patience.",     seasonId: "S1", unlockBelt: "Brown",  unlockType: "belt", primaryColor: "#92400E", accentColor: "#1C0A00", glowColor: "rgba(146,64,14,0.4)",      kanji: "山", patternId: "mountain" },
  { id: "banner_black_s1",  type: "banner", name: "Void Banner",     description: "The final mark. Worn by the few.",          seasonId: "S1", unlockBelt: "Black",  unlockType: "belt", primaryColor: "#0a0a0a", accentColor: "#C9A84C", glowColor: "rgba(201,168,76,0.5)",     kanji: "武", patternId: "void" },
];

export function getUnlockedCosmetics(
  studentBelt: Belt,
  seasonId: string,
  allItems: CosmeticItem[]
): CosmeticItem[] {
  const rank = BELT_RANK[studentBelt];
  return allItems.filter((item) => {
    const itemRank = BELT_RANK[item.unlockBelt];
    if (item.unlockType === "season_belt") {
      return item.seasonId === seasonId && itemRank <= rank;
    }
    return itemRank <= rank;
  });
}

export function isUnlocked(
  item: CosmeticItem,
  studentBelt: Belt,
  seasonId: string
): boolean {
  return getUnlockedCosmetics(studentBelt, seasonId, [item]).length > 0;
}