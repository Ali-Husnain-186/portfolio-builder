"use client";

import { useEffect, useRef, useState } from "react";
import PortfolioRenderer from "@/components/templates";
import type { Portfolio } from "@/lib/types";

/** Renders a full portfolio at desktop width and scales it down to fit its box. */
export function TemplateThumb({ p, height = 260 }: { p: Portfolio; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1280));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="pointer-events-none relative w-full overflow-hidden select-none" style={{ height }} aria-hidden inert>
      <div style={{ width: 1280, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <PortfolioRenderer p={p} preview still />
      </div>
    </div>
  );
}
