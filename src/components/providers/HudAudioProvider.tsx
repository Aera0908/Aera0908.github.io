"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { hudAudio, AUDIO_STORAGE_KEY } from "@/lib/audio";

type HudAudioState = {
  /** true once the AudioContext exists (requires a user gesture) */
  booted: boolean;
  muted: boolean;
  /** call from any user gesture — boot overlay, first click, etc. */
  boot: () => void;
  toggleMute: () => void;
  fx: {
    blip: () => void;
    click: () => void;
    confirm: () => void;
    deny: () => void;
  };
};

const HudAudioContext = createContext<HudAudioState | null>(null);

export function HudAudioProvider({ children }: { children: ReactNode }) {
  const [booted, setBooted] = useState(false);
  const [muted, setMuted] = useState(false);

  // hydrate persisted mute preference after mount (SSR-safe)
  useEffect(() => {
    setMuted(localStorage.getItem(AUDIO_STORAGE_KEY) === "muted");
  }, []);

  const boot = useCallback(() => {
    hudAudio.boot();
    setBooted(hudAudio.booted);
    setMuted(hudAudio.isMuted);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !hudAudio.isMuted;
    hudAudio.setMuted(next);
    setMuted(next);
  }, []);

  const value = useMemo<HudAudioState>(
    () => ({
      booted,
      muted,
      boot,
      toggleMute,
      fx: {
        blip: () => hudAudio.blip(),
        click: () => hudAudio.click(),
        confirm: () => hudAudio.confirm(),
        deny: () => hudAudio.deny(),
      },
    }),
    [booted, muted, boot, toggleMute],
  );

  return <HudAudioContext.Provider value={value}>{children}</HudAudioContext.Provider>;
}

export function useHudAudio(): HudAudioState {
  const ctx = useContext(HudAudioContext);
  if (!ctx) throw new Error("useHudAudio must be used within HudAudioProvider");
  return ctx;
}
