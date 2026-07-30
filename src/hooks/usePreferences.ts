import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { subscribeMediaQuery } from "@/utils/mediaQuery";
import {
  isAppearance,
  isVisualStyle,
  type Appearance,
  type VisualStyle,
} from "@/utils/themeSettings";

type ResolvedAppearance = "light" | "dark";
const APPEARANCE_STORAGE_KEY = "appearance";
const APPEARANCE_DEFAULT_STORAGE_KEY = "appearance_default";
const VISUAL_STYLE_STORAGE_KEY = "komaritheme:visual-style";
const VISUAL_STYLE_DEFAULT_STORAGE_KEY = "komaritheme:visual-style-default";
const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

interface PrefsState {
  appearance: Appearance;
  resolvedAppearance: ResolvedAppearance;
  visualStyle: VisualStyle;
  followsDefaultVisualStyle: boolean;
}

const DEFAULTS: PrefsState = {
  appearance: "system",
  resolvedAppearance: "dark",
  visualStyle: "pastoral",
  followsDefaultVisualStyle: true,
};

let themeFlipTimer: number | null = null;
let hasExplicitAppearancePreference = false;
let systemAppearanceMediaQuery: MediaQueryList | null = null;

function getSystemAppearanceMediaQuery() {
  if (typeof window === "undefined" || !window.matchMedia) return null;
  systemAppearanceMediaQuery ??= window.matchMedia(SYSTEM_DARK_QUERY);
  return systemAppearanceMediaQuery;
}

function resolveAppearance(a: Appearance): ResolvedAppearance {
  if (a === "system") {
    return getSystemAppearanceMediaQuery()?.matches ? "dark" : "light";
  }
  return a;
}

function parseStoredAppearance(raw: string | null): Appearance | null {
  if (raw == null) {
    return null;
  }

  if (isAppearance(raw)) {
    return raw;
  }

  try {
    const parsed = JSON.parse(raw);
    return isAppearance(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function readStoredAppearance() {
  const parsed = parseStoredAppearance(readStorageItem(APPEARANCE_STORAGE_KEY));
  const fallback =
    parseStoredAppearance(readStorageItem(APPEARANCE_DEFAULT_STORAGE_KEY)) ??
    DEFAULTS.appearance;
  return {
    appearance: parsed ?? fallback,
    hasExplicitPreference: parsed != null,
  };
}

function persistAppearance(value: Appearance) {
  // 存成 JSON 字符串，以兼容会解析这个 key 的旧主题包。
  writeStorageItem(APPEARANCE_STORAGE_KEY, JSON.stringify(value));
}

function persistDefaultAppearance(value: Appearance) {
  writeStorageItem(APPEARANCE_DEFAULT_STORAGE_KEY, JSON.stringify(value));
}

function parseStoredVisualStyle(raw: string | null): VisualStyle | null {
  if (raw == null) return null;
  if (isVisualStyle(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return isVisualStyle(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readStoredVisualStyle() {
  const explicit = parseStoredVisualStyle(readStorageItem(VISUAL_STYLE_STORAGE_KEY));
  const fallback =
    parseStoredVisualStyle(readStorageItem(VISUAL_STYLE_DEFAULT_STORAGE_KEY)) ??
    DEFAULTS.visualStyle;
  return {
    visualStyle: explicit ?? fallback,
    followsDefaultVisualStyle: explicit == null,
  };
}

function persistDefaultVisualStyle(value: VisualStyle) {
  writeStorageItem(VISUAL_STYLE_DEFAULT_STORAGE_KEY, value);
}

function persistVisualStyle(value: VisualStyle) {
  writeStorageItem(VISUAL_STYLE_STORAGE_KEY, value);
}

function clearStoredVisualStyle() {
  try {
    localStorage.removeItem(VISUAL_STYLE_STORAGE_KEY);
  } catch {}
}

const listeners = new Set<() => void>();
let snapshot: PrefsState = { ...DEFAULTS };

function emit() {
  for (const l of listeners) l();
}

function markThemeFlip() {
  const root = document.documentElement;
  root.classList.add("theme-flip");
  if (themeFlipTimer != null) {
    window.clearTimeout(themeFlipTimer);
  }
  themeFlipTimer = window.setTimeout(() => {
    root.classList.remove("theme-flip");
    themeFlipTimer = null;
  }, 140);
}

function applyResolvedAppearance(resolvedAppearance: ResolvedAppearance) {
  const root = document.documentElement;
  root.dataset.appearance = resolvedAppearance;
  root.style.colorScheme = resolvedAppearance;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.content = resolvedAppearance === "dark" ? "#000000" : "#F5F5F7";
  }
}

function applyVisualStyle(visualStyle: VisualStyle) {
  document.documentElement.dataset.visualStyle = visualStyle;
}

function commit(next: Partial<PrefsState>) {
  const merged: PrefsState = { ...snapshot, ...next };
  if (next.appearance) {
    merged.resolvedAppearance = resolveAppearance(merged.appearance);
  }
  if (
    snapshot.appearance === merged.appearance &&
    snapshot.resolvedAppearance === merged.resolvedAppearance &&
    snapshot.visualStyle === merged.visualStyle &&
    snapshot.followsDefaultVisualStyle === merged.followsDefaultVisualStyle
  ) {
    return;
  }
  if (
    snapshot.resolvedAppearance !== merged.resolvedAppearance ||
    snapshot.visualStyle !== merged.visualStyle
  ) {
    markThemeFlip();
  }
  snapshot = merged;
  applyResolvedAppearance(merged.resolvedAppearance);
  applyVisualStyle(merged.visualStyle);
  emit();
}

function refreshSystemAppearance() {
  if (snapshot.appearance === "system") {
    commit({ appearance: "system" });
  }
}

function handleVisibilityChange() {
  if (!document.hidden) refreshSystemAppearance();
}

let systemListenersAttached = false;
let mediaUnsubscribe: (() => void) | null = null;

function ensureSystemListeners() {
  if (systemListenersAttached || typeof window === "undefined") return;
  systemListenersAttached = true;
  const mediaQuery = getSystemAppearanceMediaQuery();
  if (mediaQuery) {
    mediaUnsubscribe = subscribeMediaQuery(mediaQuery, refreshSystemAppearance);
  }
  window.addEventListener("focus", refreshSystemAppearance);
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

function clearSystemListeners() {
  if (!systemListenersAttached || typeof window === "undefined") return;
  systemListenersAttached = false;
  mediaUnsubscribe?.();
  mediaUnsubscribe = null;
  window.removeEventListener("focus", refreshSystemAppearance);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
}

function initializeAppearance() {
  const stored = readStoredAppearance();
  const storedVisualStyle = readStoredVisualStyle();
  hasExplicitAppearancePreference = stored.hasExplicitPreference;
  if (stored.hasExplicitPreference) {
    persistAppearance(stored.appearance);
  }
  snapshot = {
    appearance: stored.appearance,
    resolvedAppearance: resolveAppearance(stored.appearance),
    ...storedVisualStyle,
  };
  applyResolvedAppearance(snapshot.resolvedAppearance);
  applyVisualStyle(snapshot.visualStyle);
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  initializeAppearance();
}

function subscribe(l: () => void) {
  const wasEmpty = listeners.size === 0;
  listeners.add(l);
  if (wasEmpty) ensureSystemListeners();
  return () => {
    listeners.delete(l);
    if (listeners.size === 0) clearSystemListeners();
  };
}

function getSnapshot() {
  return snapshot;
}

export function usePreferences() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const themeSettings = useThemeSettings();

  useEffect(() => {
    if (!themeSettings.isReady) return;
    if (hasExplicitAppearancePreference) return;
    const defaultAppearance = themeSettings.defaultAppearance;
    persistDefaultAppearance(defaultAppearance);
    commit({ appearance: defaultAppearance });
  }, [themeSettings.defaultAppearance, themeSettings.isReady]);

  useEffect(() => {
    if (!themeSettings.isReady) return;
    // 站点首次访问固定使用当前代码默认（星露谷），不再让 Komari 中遗留的
    // lumina/cavern 默认值覆盖它。用户主动切换会写入个人存储，因此仍可使用其他风格。
    const defaultVisualStyle = DEFAULTS.visualStyle;
    persistDefaultVisualStyle(defaultVisualStyle);
    if (!snapshot.followsDefaultVisualStyle) return;
    commit({ visualStyle: defaultVisualStyle });
  }, [themeSettings.isReady]);

  const setAppearance = useCallback((a: Appearance) => {
    hasExplicitAppearancePreference = true;
    persistAppearance(a);
    commit({ appearance: a });
  }, []);

  const setVisualStyle = useCallback((visualStyle: VisualStyle) => {
    persistVisualStyle(visualStyle);
    commit({ visualStyle, followsDefaultVisualStyle: false });
  }, []);

  const followDefaultVisualStyle = useCallback(() => {
    clearStoredVisualStyle();
    const visualStyle =
      parseStoredVisualStyle(readStorageItem(VISUAL_STYLE_DEFAULT_STORAGE_KEY)) ??
      DEFAULTS.visualStyle;
    commit({ visualStyle, followsDefaultVisualStyle: true });
  }, []);

  return {
    appearance: state.appearance,
    resolvedAppearance: state.resolvedAppearance,
    visualStyle: state.visualStyle,
    followsDefaultVisualStyle: state.followsDefaultVisualStyle,
    setAppearance,
    setVisualStyle,
    followDefaultVisualStyle,
  };
}
