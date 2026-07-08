"use client";

import { useRouter } from "next/navigation";
import { useHudAudio } from "@/components/providers/HudAudioProvider";

export function CaseStudyBackButton() {
  const router = useRouter();
  const { fx } = useHudAudio();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    fx.click();

    // Check if there is local window history (meaning they came from another page on the site)
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
