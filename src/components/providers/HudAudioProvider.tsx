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
  /** pulse timestamp/counter for audio waveform visualizers */
  activePulse: number;
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
  const [activePulse, setActivePulse] = useState(0);

  const triggerPulse = useCallback(() => {
    setActivePulse((p) => (p + 1) % 10000);
  }, []);

  // hydrate persisted mute preference after mount (SSR-safe)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMuted(localStorage.getItem(AUDIO_STORAGE_KEY) === "muted");
    }, 0);
    return () => clearTimeout(timer);
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
      activePulse,
      boot,
      toggleMute,
      fx: {
        blip: () => {
          hudAudio.blip();
          if (!hudAudio.isMuted) triggerPulse();
        },
        click: () => {
          hudAudio.click();
          if (!hudAudio.isMuted) triggerPulse();
        },
        confirm: () => {
          hudAudio.confirm();
          if (!hudAudio.isMuted) triggerPulse();
        },
        deny: () => {
          hudAudio.deny();
          if (!hudAudio.isMuted) triggerPulse();
        },
      },
    }),
    [booted, muted, activePulse, boot, toggleMute, triggerPulse],
  );

  return <HudAudioContext.Provider value={value}>{children}</HudAudioContext.Provider>;
}

export function useHudAudio(): HudAudioState {
  const ctx = useContext(HudAudioContext);
  if (!ctx) throw new Error("useHudAudio must be used within HudAudioProvider");
  return ctx;
}
