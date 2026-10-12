"use client";

import { useEffect, useRef, useState } from "react";
import type { Design } from "@/lib/types";

const SELECTOR = [
  ".fl-reveal",
  "section h2",
  "section .grid > *",
  "section ul > li",
  "section ol > li",
  "section .space-y-4 > *",
  "section .space-y-5 > *",
  "section .space-y-6 > *",
  "section .space-y-7 > *",
  "section .space-y-8 > *",
  "section .space-y-10 > *",
  "section .flex-wrap > *",
  "section article",
  "section figure",
  "section blockquote",
  "section form",
  "section > div > p",
  "section > p",
  "aside > *",
].join(",");

/**
 * Scroll-reveal engine. Tags elements inside the portfolio with data-rv, then
 * adds .fl-in when they scroll into view. Works with any template layout and
 * keeps working while the editor live-updates the DOM.
 */
export function useReveal(root: React.RefObject<HTMLElement | null>, enabled: boolean, replayKey: number) {
  useEffect(() => {
    const el = root.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const t = e.target as HTMLElement;
            t.classList.add("fl-in");
            io.unobserve(t);
            const cs = getComputedStyle(t);
            const ms = (parseFloat(cs.transitionDuration) + parseFloat(cs.transitionDelay)) * 1000 || 900;
            setTimeout(() => t.classList.add("fl-done"), ms + 80);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    const tag = () => {
      const found = Array.from(el.querySelectorAll<HTMLElement>(SELECTOR));
      for (const node of found) {
        if (node.dataset.rv !== undefined) continue;
        if (node.closest(".fl-norv")) continue;
        // skip if an ancestor (inside root) is already animated
        let a = node.parentElement, nested = false;
        while (a && a !== el) { if (a.dataset.rv !== undefined) { nested = true; break; } a = a.parentElement; }
        if (nested) continue;
        const sibs = node.parentElement ? Array.from(node.parentElement.children).filter((c) => (c as HTMLElement).dataset.rv !== undefined) : [];
        node.dataset.rv = String(sibs.length % 2);
        node.style.setProperty("--i", String(Math.min(sibs.length, 8)));
        io.observe(node);
      }
    };
    tag();
    let t: ReturnType<typeof setTimeout> | undefined;
    const mo = new MutationObserver(() => { clearTimeout(t); t = setTimeout(tag, 60); });
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(t);
      el.querySelectorAll<HTMLElement>("[data-rv]").forEach((n) => { delete n.dataset.rv; n.classList.remove("fl-in", "fl-done"); n.style.removeProperty("--i"); });
    };
  }, [root, enabled, replayKey]);
}

export function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setW(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return <div className="fl-progress" style={{ width: `${w}%` }} aria-hidden />;
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 500);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fl-totop ${show ? "fl-totop-show" : ""}`}>↑</button>
  );
}

export function AnimatedBackground({ mode }: { mode: Design["mode"] }) {
  return (
    <div className={`fl-bgfx ${mode === "dark" ? "fl-bgfx-dark" : ""}`} aria-hidden>
      <span /><span /><span />
    </div>
  );
}

export function useReplay() {
  const [key, setKey] = useState(0);
  const ref = useRef(setKey);
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === "fl-replay") ref.current((k) => k + 1);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);
  return key;
}
