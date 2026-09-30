"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/** Mirrors --background in globals.css (:root and .dark) and viewport.themeColor. */
const THEME_COLOR = { light: "#fbfaf7", dark: "#111612" } as const;

/**
 * Keeps the browser chrome (theme-color) in step with the theme the visitor
 * chose. The server always emits the light paper colour — light is the
 * default for every first visit — and this retints it once a stored dark
 * choice is resolved on the client, and whenever the toggle changes it.
 */
export function ThemeColor() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = resolvedTheme === "dark" ? THEME_COLOR.dark : THEME_COLOR.light;
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute("content", color));
  }, [resolvedTheme]);

  return null;
}
