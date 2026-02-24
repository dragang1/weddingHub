"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

type ActiveSectionId = "kako-funkcionise" | "kategorije" | null;

const ActiveSectionContext = createContext<ActiveSectionId>(null);

const SECTION_IDS: { id: "kako-funkcionise" | "kategorije" }[] = [
  { id: "kako-funkcionise" },
  { id: "kategorije" },
];

export function ActiveSectionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<ActiveSectionId>(null);
  const isHome = pathname === "/";

  const updateActive = useCallback(() => {
    if (!isHome || typeof window === "undefined") return;
    const viewportMid = window.scrollY + window.innerHeight / 2;
    let current: ActiveSectionId = null;
    for (const { id } of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = top + rect.height;
      if (viewportMid >= top && viewportMid < bottom) {
        current = id;
        break;
      }
    }
    setActiveSection(current);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) {
      setActiveSection(null);
      return;
    }
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [isHome, updateActive]);

  return (
    <ActiveSectionContext.Provider value={activeSection}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}
