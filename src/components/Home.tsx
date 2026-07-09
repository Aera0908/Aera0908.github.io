"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, EASE, SCRUB } from "@/lib/gsap";
import { hudState } from "@/lib/hud-state";
import { Loader } from "@/components/chrome/Loader";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Credentials } from "@/components/sections/Credentials";
import { Contact } from "@/components/sections/Contact";

// WebGL only ever renders client-side
const SceneCanvas = dynamic(() => import("@/components/webgl/SceneCanvas"), {
  ssr: false,
});

const SECTION_IDS = ["journey", "vault", "credentials", "contact"];

interface LenisWindow extends Window {
  lenis?: {
    stop: () => void;
    start: () => void;
    scrollTo: (target: unknown, options: unknown) => void;
  };
}

/**
 * The scrollytelling one-pager. `initialSection` comes from the route
 * (/contact, /projects, …): deep links skip the intro loader entirely and
 * land scrolled to their section — only the bare "/" plays the boot intro.
 */
export function Home({ initialSection = null }: { initialSection?: string | null }) {
  const [entered, setEntered] = useState(!!initialSection);
  const [mountCanvas, setMountCanvas] = useState(!!initialSection);

  const handleLoaderWaiting = () => {
    setMountCanvas(true);
  };

  const handleLoaderDone = () => {
    setEntered(true);
    setMountCanvas(true);
  };

  const barRef = useRef<HTMLDivElement>(null);
  // the scroll-spy stays muzzled on deep links until the jump lands —
  // otherwise its first toggle rewrites the restored URL while the pinned
  // layout is still settling (breaks back-navigation targets)
  const spyArmedRef = useRef(!initialSection);

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

  /**
   * Hard scroll lock during the intro (spec §4): while the loader is up we
   * pin the page to the very top so the master ScrollTrigger can't advance —
   * otherwise a stray wheel/keypress scrubs the camera into later sections
   * before the Hero has revealed. `lenis.stop()` alone isn't enough (native
   * scroll still moves the position), so we also swallow the raw scroll inputs
   * and snap back to top. The lock lifts only once `entered` is true.
   */
  useEffect(() => {
    if (entered) return;

    const html = document.documentElement;
    const body = document.body;
    const lenis = () => (window as unknown as LenisWindow).lenis;

    html.classList.add("overflow-hidden");
    body.classList.add("overflow-hidden");
    lenis()?.stop();

    // reloads must not restore a mid-page scroll position under the loader
    const prevRestoration = history.scrollRestoration;
    try {
      history.scrollRestoration = "manual";
    } catch {}

    const snapTop = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
      lenis()?.scrollTo(0, { immediate: true, force: true });
    };
    snapTop();

    const swallow = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const SCROLL_KEYS = new Set([
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
      "Spacebar",
    ]);
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };

    window.addEventListener("wheel", swallow, { passive: false, capture: true });
    window.addEventListener("touchmove", swallow, { passive: false, capture: true });
    window.addEventListener("keydown", onKey, { capture: true });
    window.addEventListener("scroll", snapTop, { passive: true });

    return () => {
      window.removeEventListener("wheel", swallow, { capture: true } as EventListenerOptions);
      window.removeEventListener("touchmove", swallow, { capture: true } as EventListenerOptions);
      window.removeEventListener("keydown", onKey, { capture: true } as EventListenerOptions);
      window.removeEventListener("scroll", snapTop);
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
      try {
        history.scrollRestoration = prevRestoration;
      } catch {}
      lenis()?.start();
      ScrollTrigger.refresh();
    };
  }, [entered]);

  /* deep link: jump once the pins exist, then re-assert after the late
     ScrollTrigger refresh grows the pinned layout (spacer heights land
     asynchronously — a single early jump strands short of the target) */
  useEffect(() => {
    if (!initialSection) return;
    try {
      history.scrollRestoration = "manual";
    } catch {}
    // The visible URL is the source of truth, NOT the route param: a
    // back-navigation restores a history entry whose path the scroll-spy
    // rewrote (e.g. /vault), while Next still hands us the param of the
    // originally-requested route (e.g. credentials). Capture it NOW,
    // synchronously — this effect runs before the scroll-spy effect, whose
    // very first toggle would clobber the restored path back to "/" while
    // the pinned layout is still shorter than the restored scroll offset.
    const restoredSeg = window.location.pathname.replace(/^\/+|\/+$/g, "");
    const target = SECTION_IDS.includes(restoredSeg)
      ? restoredSeg
      : restoredSeg === ""
        ? null // restored to "/" — stay at the top
        : initialSection;

    const jump = () => {
      if (!target) {
        spyArmedRef.current = true;
        return;
      }
      const el = document.getElementById(target);
      if (!el) return;
      const lenis = (window as unknown as LenisWindow).lenis;
      if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
      else el.scrollIntoView({ behavior: "auto" });
      // restore the path the spy may have transiently overwritten, then
      // let it take over again
      window.history.replaceState(null, "", `/${target}`);
      spyArmedRef.current = true;
    };
    const t1 = setTimeout(() => {
      ScrollTrigger.refresh();
      jump();
    }, 700);
    const t2 = setTimeout(() => {
      jump();
      ScrollTrigger.refresh();
    }, 1500);
    const t3 = setTimeout(() => {
      jump();
      ScrollTrigger.refresh();
    }, 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [initialSection]);

  /* back/forward between section paths keeps working without reloads */
  useEffect(() => {
    const onPop = () => {
      const seg = window.location.pathname.replace(/^\/+|\/+$/g, "");
      const lenis = (window as unknown as LenisWindow).lenis;
      if (!seg) {
        if (lenis) lenis.scrollTo(0, {});
        else window.scrollTo(0, 0);
        return;
      }
      if (SECTION_IDS.includes(seg)) {
        const el = document.getElementById(seg);
        if (!el) return;
        if (lenis) lenis.scrollTo(el, {});
        else el.scrollIntoView({ behavior: "auto" });
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  /* scroll spy: synchronize browser URL path on scroll */
  useEffect(() => {
    if (!entered) return;

    const sections = [
      { id: "", selector: "#top" },
      { id: "journey", selector: "#journey" },
      { id: "vault", selector: "#vault" },
      { id: "credentials", selector: "#credentials" },
      { id: "contact", selector: "#contact" },
    ];

    // paths the one-pager owns; anything else (/vault/archive, case files)
    // was navigated to and must NOT be clobbered by a stray scroll event
    // firing during the route transition.
    const OWNED = new Set(["/", "/journey", "/vault", "/credentials", "/contact"]);

    const scrollTriggers = sections.map((sec) => {
      return ScrollTrigger.create({
        trigger: sec.selector,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (!self.isActive) return;
          if (!spyArmedRef.current) return; // deep-link jump hasn't landed yet
          const cur = window.location.pathname;
          if (!OWNED.has(cur)) return; // we've left the one-pager
          const targetPath = sec.id ? `/${sec.id}` : "/";
          if (cur !== targetPath) {
            window.history.replaceState(null, "", targetPath);
          }
        },
      });
    });

    return () => {
      scrollTriggers.forEach((st) => st.kill());
    };
  }, [entered]);

  return (
    <div id="scroll-space" className="relative">
       {!initialSection && (
        <Loader onDone={handleLoaderDone} onWaiting={handleLoaderWaiting} />
      )}

      {mountCanvas && <SceneCanvas />}

      {/* slim scroll progress along the bottom frame */}
      <div className="fixed bottom-3 left-1/2 z-[70] h-px w-40 -translate-x-1/2 bg-white/15">
        <div
          ref={barRef}
          className="h-px origin-left bg-iris-bright"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <Hero entered={entered} />
      <Experience entered={entered} />
      <Projects />
      <Credentials />
      <Contact />
    </div>
  );
}
