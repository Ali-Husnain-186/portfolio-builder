"use client";

import { useEffect } from "react";

export function ViewPing({ username }: { username: string }) {
  useEffect(() => {
    const key = "fl_viewed_" + username;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch {}
    fetch(`/api/views/${username}`, { method: "POST" }).catch(() => {});
  }, [username]);
  return null;
}
