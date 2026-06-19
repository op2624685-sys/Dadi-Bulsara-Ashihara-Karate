"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getEquipped, saveEquipped, type EquippedCosmetics } from "@/app/(main)/profile/avatar/cosmeticsStore";

interface CosmeticsContextValue {
  avatarId: string;
  bannerId: string;
  updateCosmetics: (data: EquippedCosmetics) => void;
}

const CosmeticsContext = createContext<CosmeticsContextValue>({
  avatarId: "avatar_white_s1",
  bannerId: "banner_white_s1",
  updateCosmetics: () => {},
});

export function CosmeticsProvider({ children }: { children: ReactNode }) {
  const [avatarId, setAvatarId] = useState("avatar_white_s1");
  const [bannerId, setBannerId] = useState("banner_white_s1");

  // localStorage se initial load
  useEffect(() => {
    const equipped = getEquipped();
    setAvatarId(equipped.avatarId);
    setBannerId(equipped.bannerId);
  }, []);

  const updateCosmetics = useCallback((data: EquippedCosmetics) => {
    saveEquipped(data);
    setAvatarId(data.avatarId);
    setBannerId(data.bannerId);
  }, []);

  return (
    <CosmeticsContext.Provider value={{ avatarId, bannerId, updateCosmetics }}>
      {children}
    </CosmeticsContext.Provider>
  );
}

export const useCosmetics = () => useContext(CosmeticsContext);