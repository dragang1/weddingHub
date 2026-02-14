"use client";

import { useState } from "react";

type ProfileContactCardProps = {
  phone: string | null;
  email: string | null;
  website: string | null;
};

export function ProfileContactCard({
  phone,
  email,
  website,
}: ProfileContactCardProps) {
  const [copied, setCopied] = useState(false);

  const copyContact = () => {
    const parts: string[] = [];
    if (phone) parts.push(`Tel: ${phone}`);
    if (email) parts.push(`Email: ${email}`);
    if (website) parts.push(`Web: ${website}`);
    const text = parts.join("\n");
    if (text && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const hasAny = phone || email || website;

  return (
    <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
      <div className="border-b border-border bg-accent-soft/30 px-4 py-3 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
          Kontaktiraj ponuđača
        </p>
      </div>

      <div className="p-4 sm:p-5">
        {hasAny && (
          <ul className="space-y-2.5">
            {phone && (
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/50 px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/30 hover:bg-accent-soft/30"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </span>
                  <span className="truncate">{phone}</span>
                  <span className="ml-auto text-[11px] font-semibold uppercase text-accent">Pozovi</span>
                </a>
              </li>
            )}
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/50 px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/30 hover:bg-accent-soft/30"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <span className="truncate">{email}</span>
                  <span className="ml-auto text-[11px] font-semibold uppercase text-accent">Email</span>
                </a>
              </li>
            )}
            {website && (
              <li>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/50 px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/30 hover:bg-accent-soft/30"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </span>
                  <span className="truncate flex-1 min-w-0">Web stranica</span>
                  <span className="text-[11px] font-semibold uppercase text-accent shrink-0">Otvori</span>
                </a>
              </li>
            )}
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
