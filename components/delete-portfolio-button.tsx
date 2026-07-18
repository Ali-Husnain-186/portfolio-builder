"use client";

import { useState, useTransition } from "react";
import { deletePortfolio } from "@/app/dashboard/actions";

export function DeletePortfolioButton() {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      const res = await deletePortfolio();
      if (res?.error) {
        setError(res.error);
        setConfirming(false);
      }
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60"
      >
        {pending
          ? "Deleting…"
          : confirming
            ? "Click again to confirm delete"
            : "Delete portfolio"}
      </button>
      {confirming && !pending && (
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="ml-2 text-sm text-[var(--muted)] underline-offset-2 hover:underline"
        >
          Cancel
        </button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
