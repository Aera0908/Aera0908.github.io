"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, EASE, SCRUB } from "@/lib/gsap";
import { hudState } from "@/lib/hud-state";
import { Loader } from "@/components/chrome/Loader";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";

// WebGL only ever renders client-side
const SceneCanvas = dynamic(() => import("@/components/webgl/SceneCanvas"), {
  ssr: false,
});

export default function Home() {
  const [entered, setEntered] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  /**
   * Master timeline (spec §4): one scrubbed tween drives a 0→1 proxy;
   * hudState.scrollProgress is the only bridge into the R3F frame loop.
   * The camera path, particle morphs, and progress bar all read it.
   */
  useEffect(() => {
    const proxy = { value: 0 };
    const tween = gsap.to(proxy, {
      value: 1,
      ease: EASE.cam,
      onUpdate: () => {
        hudState.scrollProgress = proxy.value;
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${proxy.value})`;
        }
      },
      scrollTrigger: {
        trigger: "#scroll-space",
        start: "top top",
        end: "bottom bottom",
        scrub: SCRUB,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div id="scroll-space" className="relative">
      <Loader onDone={() => setEntered(true)} />

      <SceneCanvas />

      {/* slim scroll progress along the bottom frame */}
      <div className="fixed bottom-3 left-1/2 z-[70] h-px w-40 -translate-x-1/2 bg-white/15">
        <div
          ref={barRef}
          className="h-px origin-left bg-iris-bright"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <Hero entered={entered} />
      <Experience />
      <Projects />
      <Contact />
    </div>
  );
}
