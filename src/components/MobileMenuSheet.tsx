"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

type ActiveSectionId = "kako-funkcionise" | "kategorije" | null;

type MobileMenuSheetProps = {
  open: boolean;
  onClose: () => void;
  activeSection?: ActiveSectionId;
};

const MENU_ITEMS = [
  { href: "/", label: "Početna" },
  { href: "/#kategorije", label: "Kategorije" },
  { href: "/#kako-funkcionise", label: "Kako funkcioniše" },
  { href: "/postanite-partner", label: "Postanite partner" },
];

const MENU_HREF_TO_SECTION: Record<string, ActiveSectionId> = {
  "/#kategorije": "kategorije",
  "/#kako-funkcionise": "kako-funkcionise",
};

export function MobileMenuSheet({ open, onClose, activeSection = null }: MobileMenuSheetProps) {
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
        className="fixed inset-0 z-[9998] bg-ink/30 dark:bg-black/50 backdrop-blur-sm"
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
        className="fixed inset-y-0 right-0 z-[9999] w-[min(320px,85vw)] bg-white dark:bg-stone-800 shadow-prominent focus:outline-none"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-stone-200 dark:border-stone-600 px-5 py-4">
            <span className="font-serif text-lg font-bold text-ink dark:text-stone-100">Meni</span>
            <button
              type="button"
              onClick={onClose}
              className="-m-2 rounded-lg p-2 text-stone-500 dark:text-stone-400 transition-colors hover:bg-accent-soft/50 dark:hover:bg-stone-700 hover:text-ink dark:hover:text-stone-100"
              aria-label="Zatvori meni"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
            <ul className="space-y-1">
              {MENU_ITEMS.map((item) => {
                const isHashLink = item.href.startsWith("/#");
                const sectionForLink = isHashLink ? MENU_HREF_TO_SECTION[item.href] : null;
                const isActive = isHashLink
                  ? pathname === "/" && sectionForLink != null && activeSection === sectionForLink
                  : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    {isHashLink ? (
                      <a
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                          isActive ? "bg-accent-soft/60 dark:bg-accent/30 text-accent-hover dark:text-amber-200" : "text-ink dark:text-stone-100 hover:bg-accent-soft/40 dark:hover:bg-stone-700"
                        }`}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                          isActive ? "bg-accent-soft/60 dark:bg-accent/30 text-accent-hover dark:text-amber-200" : "text-ink dark:text-stone-100 hover:bg-accent-soft/40 dark:hover:bg-stone-700"
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
