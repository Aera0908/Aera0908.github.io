"use client";

import { useRouter } from "next/navigation";
import { navReturn } from "@/lib/nav-return";
import { useHudAudio } from "@/components/providers/HudAudioProvider";

export function CaseStudyBackButton() {
  const router = useRouter();
  const { fx } = useHudAudio();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    fx.click();

    // Where the case file was opened from (set by the opener). We can't rely on
    // router.back() for the one-pager origin: the scroll-spy only rewrote the
    // URL to /vault, so Next's router tree still points at "/" and going back
    // replays the intro loader and dumps the user at the base URL. (The native
    // browser back button is handled separately, in Home, via the same marker.)
    const ret = navReturn.consume();

    if (ret === "/vault") {
      // deep-link straight back to the vault section (skips the intro)
      router.push("/vault");
      return;
    }

    // Archive-listing origin (or any real pushed route) — history.back()
    // returns there correctly and preserves the listing's scroll position.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/vault/archive");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="nav-link t-label mb-10 inline-block text-periwinkle/70 cursor-pointer"
    >
      ← BACK
    </button>
  );
}
