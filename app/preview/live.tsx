"use client";

import { useEffect, useState } from "react";
import PortfolioRenderer from "@/components/templates";
import type { Portfolio } from "@/lib/types";

export function LivePreview({ initial }: { initial: Portfolio }) {
  const [p, setP] = useState(initial);
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "fl-preview" && e.data.portfolio) setP(e.data.portfolio);
      if (e.data?.type === "fl-scroll" && e.data.section) document.getElementById(e.data.section)?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("message", onMsg);
    window.parent?.postMessage({ type: "fl-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMsg);
  }, []);
  return <PortfolioRenderer p={p} preview />;
}
