"use client";

import { useRef, type CSSProperties } from "react";
import { fontHref, themeVars, withAnimDefaults } from "@/lib/design";
import type { Portfolio, TemplateId } from "@/lib/types";
import Classic from "./classic";
import Creative from "./creative";
import Developer from "./developer";
import Glass from "./glass";
import Minimal from "./minimal";
import Modern from "./modern";
import { AnimCtx } from "./shared";
import { AnimatedBackground, BackToTop, ScrollProgress, useReplay, useReveal } from "./motion";

const MAP: Record<TemplateId, (props: { p: Portfolio; preview?: boolean }) => React.ReactNode> = {
  modern: Modern,
  minimal: Minimal,
  developer: Developer,
  creative: Creative,
  classic: Classic,
  glass: Glass,
};

/**
 * Renders a portfolio with its template, theme and motion settings.
 * `still` renders a static version (no animation, no overlays) for thumbnails.
 */
export default function PortfolioRenderer({ p, preview, still }: { p: Portfolio; preview?: boolean; still?: boolean }) {
  const T = MAP[p.design.template] ?? Modern;
  const d = withAnimDefaults(p.design);
  const animated = !still && d.animation !== "none";
  const root = useRef<HTMLDivElement>(null);
  const replay = useReplay();
  useReveal(root, animated, replay);
  const cls = [
    animated ? `fl-js fl-a-${d.animation}` : "",
    !still && d.hoverEffects ? "fl-hover" : "fl-nohover",
  ].join(" ");
  return (
    <AnimCtx.Provider value={still ? null : d}>
      <div ref={root} style={themeVars(d) as CSSProperties} className={cls} data-mode={d.mode} data-anim={still ? "off" : d.animation}>
        <link rel="stylesheet" href={fontHref([d.font, d.headingFont])} />
        {!still && d.progressBar && <ScrollProgress />}
        {!still && d.bgFx && <AnimatedBackground mode={d.mode} />}
        <T p={p} preview={preview} />
        {!still && d.backToTop && <BackToTop />}
      </div>
    </AnimCtx.Provider>
  );
}
