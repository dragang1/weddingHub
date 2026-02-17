"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

type MobileMenuSheetProps = {
  open: boolean;
  onClose: () => void;
};

const MENU_ITEMS = [
  { href: "/", label: "Početna" },
  { href: "/#kategorije", label: "Kategorije" },
  { href: "/#kako-funkcionise", label: "Kako funkcioniše" },
  { href: "/postanite-partner", label: "Postanite partner" },
];

export function MobileMenuSheet({ open, onClose }: MobileMenuSheetProps) {
  const pathname = usePathname();
  const focusRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const el = document.getElementById("mobile-menu-drawer");
      if (!el) return;
      const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    focusRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [open, handleKeyDown]);

  function handleLinkClick() {
    onClose();
  }

  if (!open) return null;

  const content = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        id="mobile-menu-drawer"
        ref={focusRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigacija"
        tabIndex={-1}
        className="fixed inset-y-0 right-0 z-[9999] w-[min(320px,85vw)] bg-white shadow-2xl focus:outline-none"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
            <span className="font-serif text-lg font-bold text-ink">Meni</span>
            <button
              type="button"
              onClick={onClose}
              className="-m-2 rounded-lg p-2 text-muted transition-colors hover:bg-accent-soft/50 hover:text-ink"
              aria-label="Zatvori meni"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
            <ul className="space-y-1">
              {MENU_ITEMS.map((item) => {
                const isHashLink = item.href.startsWith("/#");
                const isActive = isHashLink
                  ? pathname === "/"
                  : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    {isHashLink ? (
                      <a
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                          isActive ? "bg-accent-soft/60 text-accent-hover" : "text-ink hover:bg-accent-soft/40"
                        }`}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                          isActive ? "bg-accent-soft/60 text-accent-hover" : "text-ink hover:bg-accent-soft/40"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
