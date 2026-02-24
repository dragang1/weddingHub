"use client";

import { useState } from "react";

type ProfileShareButtonProps = {
  title: string;
};

export function ProfileShareButton({ title }: ProfileShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url,
          text: title,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          fallbackCopy(url);
        }
      }
      return;
    }
    fallbackCopy(url);
  }

  function fallbackCopy(url: string) {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-accent/20"
      aria-label={copied ? "Link kopiran" : "Podijeli stranicu"}
    >
      <svg
        className="h-4 w-4 shrink-0 text-stone-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.934-2.185 2.25 2.25 0 00-3.934 2.185z"
        />
      </svg>
      <span>{copied ? "Link kopiran" : "Podijeli"}</span>
    </button>
  );
}
