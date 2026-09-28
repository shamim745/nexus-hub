"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { restoreSession } from "@/store/slices/authSlice";
import { selectTheme, setTheme } from "@/store/slices/uiSlice";

export function AppProviders({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    void dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  return <>{children}</>;
}

export function ThemeListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const hasStoredPreference = () => Boolean(window.localStorage.getItem("nexus-hub:ui:v1"));

    if (!hasStoredPreference()) {
      dispatch(setTheme(media.matches ? "dark" : "light"));
    }

    const onChange = (event: MediaQueryListEvent) => {
      if (!hasStoredPreference()) dispatch(setTheme(event.matches ? "dark" : "light"));
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [dispatch]);

  return null;
}
