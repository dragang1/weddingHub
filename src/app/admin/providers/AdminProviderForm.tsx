"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Provider } from "@prisma/client";
import { CATEGORIES } from "@/lib/categories";
import type { CategorySlug } from "@/lib/categories";
import { EVENT_TYPES } from "@/lib/events";
import type { EventTypeSlug } from "@/lib/events";
import { normalizeCityForDb, parseCityList } from "@/lib/cities";

type AdminProviderFormProps = {
  provider: Provider | null;
};

export function AdminProviderForm({ provider }: AdminProviderFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "music" as CategorySlug,
    subcategory: "",
    locationCity: "",
    serviceCities: "",
    isNationwide: false,
    isActive: true,
    eventTypes: ["wedding"] as EventTypeSlug[],
    description: "",
    galleryImages: "",
    videoLinks: "",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    if (provider) {
      setForm({
        name: provider.name,
        category: provider.category as CategorySlug,
        subcategory: provider.subcategory,
        locationCity: provider.locationCity,
        serviceCities: (provider.serviceCities ?? []).join(", "),
        isNationwide: provider.isNationwide ?? false,
        isActive: provider.isActive ?? true,
        eventTypes: (provider.eventTypes ?? ["wedding"]) as EventTypeSlug[],
        description: provider.description,
        galleryImages: (provider.galleryImages ?? []).join("\n"),
        videoLinks: (provider.videoLinks ?? []).join("\n"),
        phone: provider.phone ?? "",
        email: provider.email ?? "",
        website: provider.website ?? "",
      });
    }
  }, [provider]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const locationCity = normalizeCityForDb(form.locationCity);
    if (!locationCity) {
      setError("Grad (baza) je obavezan.");
      setLoading(false);
      return;
    }
    let serviceCities = parseCityList(form.serviceCities);
    if (!form.isNationwide) {
      if (serviceCities.length === 0) {
        serviceCities = [locationCity];
      } else if (!serviceCities.some((c) => c.toLowerCase() === locationCity.toLowerCase())) {
        serviceCities = [locationCity, ...serviceCities];
      }
    }

    if (form.eventTypes.length === 0) {
      setError("Odaberite barem jednu vrstu događaja.");
      setLoading(false);
      return;
    }
    const payload = {
      name: form.name,
      category: form.category,
      subcategory: form.subcategory,
      locationCity,
      serviceCities,
      isNationwide: form.isNationwide,
      isActive: form.isActive,
      eventTypes: form.eventTypes,
      description: form.description,
      galleryImages: form.galleryImages.split("\n").map((s) => s.trim()).filter(Boolean),
      videoLinks: form.videoLinks.split("\n").map((s) => s.trim()).filter(Boolean),
      phone: form.phone || undefined,
      email: form.email || undefined,
      website: form.website || undefined,
    };

    try {
      const url = provider ? `/api/admin/providers/${provider.id}` : "/api/admin/providers";
      const method = provider ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Greška pri spremanju");
        setLoading(false);
        return;
      }
      router.push("/admin/providers");
      router.refresh();
    } catch {
      setError("Greška u mreži");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!provider) return;
    if (!confirm("Jesi li siguran da želiš obrisati ovog pružatelja? Ova radnja se ne može poništiti.")) return;
    setError("");
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/providers/${provider.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Greška pri brisanju");
        setDeleteLoading(false);
        return;
      }
      router.push("/admin/providers");
      router.refresh();
    } catch {
      setError("Greška u mreži");
      setDeleteLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-6">
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink">Naziv *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
          className="input-field w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Kategorija *</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as CategorySlug }))}
            className="input-field w-full"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Podkategorija *</label>
          <input
            type="text"
            value={form.subcategory}
            onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))}
            required
            className="input-field w-full"
            placeholder="npr. bend, dj, fotograf"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink">Grad (baza) *</label>
        <input
          type="text"
          value={form.locationCity}
          onChange={(e) => setForm((f) => ({ ...f, locationCity: e.target.value }))}
          required
          className="input-field w-full"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink">
          Gradovi u kojima radi (zarez ili novi red)
        </label>
        <textarea
          value={form.serviceCities}
          onChange={(e) => setForm((f) => ({ ...f, serviceCities: e.target.value }))}
          rows={2}
          className="input-field w-full"
          placeholder="Sarajevo, Mostar, Zenica"
        />
        <p className="mt-1 text-xs text-muted">
          Unesi gradove odvojene zarezom ili novim redom. Primjer: Sarajevo, Mostar, Banja Luka
        </p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink">Vrste događaja *</label>
        <div className="flex flex-wrap gap-4">
          {EVENT_TYPES.map((ev) => (
            <label key={ev.slug} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.eventTypes.includes(ev.slug)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setForm((f) => ({ ...f, eventTypes: [...f.eventTypes, ev.slug] }));
                  } else {
                    setForm((f) => ({
                      ...f,
                      eventTypes: f.eventTypes.filter((s) => s !== ev.slug),
                    }));
                  }
                }}
                className="rounded"
              />
              <span className="text-sm text-ink">{ev.icon} {ev.label}</span>
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted">Odaberite barem jednu vrstu.</p>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isNationwide}
            onChange={(e) => setForm((f) => ({ ...f, isNationwide: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm text-ink">Radi u cijeloj BiH</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            className="rounded"
          />
          <span className="text-sm text-ink">Aktivan (vidljiv na sajtu)</span>
        </label>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink">Opis *</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          required
          rows={4}
          className="input-field w-full"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink">Galerija (URL-ovi, jedan po retku)</label>
        <textarea
          value={form.galleryImages}
          onChange={(e) => setForm((f) => ({ ...f, galleryImages: e.target.value }))}
          rows={3}
          className="input-field w-full"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink">Video linkovi (jedan po retku)</label>
        <textarea
          value={form.videoLinks}
          onChange={(e) => setForm((f) => ({ ...f, videoLinks: e.target.value }))}
          rows={2}
          className="input-field w-full"
          placeholder="https://youtube.com/..."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Telefon</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Web stranica</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            className="input-field w-full"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={loading || deleteLoading}
          className="btn-primary"
        >
          {loading ? "Spremanje…" : "Spremi"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={deleteLoading}
          className="btn-secondary"
        >
          Odustani
        </button>
        {provider && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || deleteLoading}
            className="ml-auto rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {deleteLoading ? "Brisanje…" : "Obriši pružatelja"}
          </button>
        )}
      </div>
    </form>
  );
}
