"use client";

import type { CSSProperties } from "react";
import { fontHref, themeVars } from "@/lib/design";
import type { Portfolio, TemplateId } from "@/lib/types";
import Classic from "./classic";
import Creative from "./creative";
import Developer from "./developer";
import Glass from "./glass";
import Minimal from "./minimal";
import Modern from "./modern";

const MAP: Record<TemplateId, (props: { p: Portfolio; preview?: boolean }) => React.ReactNode> = {
  modern: Modern,
  minimal: Minimal,
  developer: Developer,
  creative: Creative,
  classic: Classic,
  glass: Glass,
};

export default function PortfolioRenderer({ p, preview }: { p: Portfolio; preview?: boolean }) {
  const T = MAP[p.design.template] ?? Modern;
  return (
    <div style={themeVars(p.design) as CSSProperties} className={p.design.animations ? "fl-anim" : ""} data-mode={p.design.mode}>
      <link rel="stylesheet" href={fontHref([p.design.font, p.design.headingFont])} />
      <T p={p} preview={preview} />
    </div>
  );
}
