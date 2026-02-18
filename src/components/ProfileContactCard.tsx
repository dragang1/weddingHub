"use client";

import { useState } from "react";

function nonEmpty(v: string | null | undefined): v is string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > 0;
}

function instagramUrl(v: string): string {
  const s = v.trim();
  if (s.toLowerCase().startsWith("http")) return s;
  const handle = s.replace(/^@/, "").trim();
  return `https://instagram.com/${handle}`;
}

function instagramDisplay(v: string): string {
  const s = v.trim();
  if (s.toLowerCase().startsWith("http")) {
    try {
      const u = new URL(s);
      const path = u.pathname.replace(/^\/|\/$/g, "").split("/")[0];
      return path ? `@${path}` : s;
    } catch {
      return s;
    }
  }
  return `@${s.replace(/^@/, "").trim()}`;
}

function facebookUrl(v: string): string {
  const s = v.trim();
  if (s.toLowerCase().startsWith("http")) return s;
  return `https://facebook.com/${s}`;
}

function facebookDisplay(v: string): string {
  const s = v.trim();
  if (s.toLowerCase().startsWith("http")) {
    try {
      const u = new URL(s);
      const path = u.pathname.replace(/^\/|\/$/g, "").split("/")[0];
      return path || s;
    } catch {
      return s;
    }
  }
  return s;
}

type ProfileContactCardProps = {
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  instagram?: string | null;
  facebook?: string | null;
};

const ICON_SVG = {
  location: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  ),
  phone: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  ),
  email: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  ),
  globe: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  ),
  instagram: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v13.5A2.25 2.25 0 003.75 23h16.5a2.25 2.25 0 002.25-2.25V6.75" />
  ),
  facebook: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  ),
};

type ContactItem = {
  key: string;
  href: string;
  displayText: string;
  ctaText: string;
  icon: keyof typeof ICON_SVG;
  external?: boolean;
};

export function ProfileContactCard({
  phone = null,
  email = null,
  website = null,
  address = null,
  instagram = null,
  facebook = null,
}: ProfileContactCardProps) {
  const [copied, setCopied] = useState(false);

  const items: ContactItem[] = [
    nonEmpty(address) && {
      key: "address",
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      displayText: address,
      ctaText: "Karta",
      icon: "location",
      external: true,
    },
    nonEmpty(phone) && {
      key: "phone",
      href: `tel:${phone.replace(/\s/g, "")}`,
      displayText: phone,
      ctaText: "Pozovi",
      icon: "phone",
    },
    nonEmpty(email) && {
      key: "email",
      href: `mailto:${email}`,
      displayText: email,
      ctaText: "Email",
      icon: "email",
    },
    nonEmpty(website) && {
      key: "website",
      href: website,
      displayText: "Web stranica",
      ctaText: "Otvori",
      icon: "globe",
      external: true,
    },
    nonEmpty(instagram) && {
      key: "instagram",
      href: instagramUrl(instagram),
      displayText: instagramDisplay(instagram),
      ctaText: "Instagram",
      icon: "instagram",
      external: true,
    },
    nonEmpty(facebook) && {
      key: "facebook",
      href: facebookUrl(facebook),
      displayText: facebookDisplay(facebook),
      ctaText: "Facebook",
      icon: "facebook",
      external: true,
    },
  ].filter(Boolean) as ContactItem[];

  const hasAny = items.length > 0;

  const copyContact = () => {
    const parts: string[] = [];
    if (address) parts.push(`Adresa: ${address}`);
    if (phone) parts.push(`Tel: ${phone}`);
    if (email) parts.push(`Email: ${email}`);
    if (website) parts.push(`Web: ${website}`);
    if (instagram) parts.push(`Instagram: ${instagramUrl(instagram)}`);
    if (facebook) parts.push(`Facebook: ${facebookUrl(facebook)}`);
    const text = parts.join("\n");
    if (text && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-elevated">
      <div className="border-b border-border bg-accent-soft/40 px-5 py-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
          Kontaktiraj ponuđača
        </p>
      </div>

      <div className="p-5">
        {hasAny && (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface/40 px-3.5 py-2.5 text-sm text-ink transition-all duration-200 hover:border-accent/25 hover:bg-accent-soft/40 hover:shadow-soft"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      {ICON_SVG[item.icon]}
                    </svg>
                  </span>
                  <span className={item.key === "address" ? "truncate flex-1 min-w-0" : "truncate"}>{item.displayText}</span>
                  <span className={item.key === "address" ? "text-[10px] font-semibold uppercase text-accent/70 shrink-0" : "ml-auto text-[10px] font-semibold uppercase text-accent/70"}>
                    {item.ctaText}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 space-y-2">
          <a href="#upit" className="btn-primary block w-full py-3 text-center text-sm">
            Pošalji upit
          </a>
          {hasAny && (
            <button
              type="button"
              onClick={copyContact}
              className="btn-secondary w-full py-2.5 text-sm"
            >
              {copied ? "✓ Kopirano" : "Kopiraj sve kontakte"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
