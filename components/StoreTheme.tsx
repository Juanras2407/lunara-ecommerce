"use client";

import { useEffect } from "react";

const PALETTE: Record<string, string> = {
  "--background": "#f7f3ec",
  "--surface": "#ffffff",
  "--foreground": "#14161c",
  "--primary": "#c68b3e",
  "--accent": "#cca567",
  "--on-primary": "#14161c",
  "--navy": "#1b2941",
  "--beige": "#e2d8ca",
  "--taupe": "#aa9e8d",
  "--brown": "#52402b",
  "--muted": "#615e56",
  "--muted-2": "#8b8c94",
};

export default function StoreTheme() {
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(PALETTE)) {
      root.style.setProperty(key, value);
    }
  }, []);

  return null;
}
