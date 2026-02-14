import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- Types (only allowed values, match src/lib/categories and schema) ---
type EventType = "wedding" | "birthday" | "baptism" | "celebration";

type CategorySlug =
  | "music"
  | "photo_video"
  | "wedding_salon"
  | "cakes"
  | "decoration"
  | "transport"
  | "beauty";

type WeddingSalonDetails = {
  onSiteOnly: boolean;
  capacity: number;
  hasParking: boolean;
  menuFromKM: number;
  indoor: boolean;
  outdoor: boolean;
};

type SeedProvider = {
  name: string;
  category: CategorySlug;
  subcategory: string;
  locationCity: string;
  serviceCities: string[];
  isNationwide: boolean;
  eventTypes: EventType[];
  description: string;
  galleryImages: string[];
  videoLinks: string[];
  phone: string | null;
  email: string | null;
  website: string | null;
  details: WeddingSalonDetails | null;
};

// --- Constants ---
const CITIES = ["Sarajevo", "Mostar", "Banja Luka", "Tuzla", "Zenica"] as const;

const CATEGORY_COUNTS: Record<CategorySlug, number> = {
  music: 4,
  photo_video: 3,
  wedding_salon: 4,
  cakes: 3,
  decoration: 3,
  transport: 3,
  beauty: 3,
};

const SUBCATEGORIES: Record<CategorySlug, readonly string[]> = {
  music: ["bend", "dj", "harmonika", "trubači"],
  photo_video: ["fotograf", "videograf", "foto+video"],
  wedding_salon: ["svadbeni-salon", "hotel", "restoran", "sala-za-proslave"],
  cakes: ["svadbena-torta", "kolači", "slatki-sto"],
  decoration: ["cvijeće", "dekorater", "rasvjeta", "baloni"],
  transport: ["limuzina", "oldtimer", "kombi", "auta-sa-vozačem"],
  beauty: ["šminka", "frizura", "šminka+frizura", "barber"],
};

// Name pools per category (unique, local-sounding)
const NAME_POOLS: Record<CategorySlug, readonly string[]> = {
  music: ["Bend Svjetla", "DJ Master", "Orkestar Most", "Harmonika Stari Grad", "Trubači Neretva"],
  photo_video: ["Foto Studio Snijet", "Video Art", "Kadr Foto", "Lens & Light"],
  wedding_salon: ["Salon Vila", "Hotel Hills", "Restoran Stari Mlini", "Sala Dvorac"],
  cakes: ["Torta Slatki San", "Kolačići Po Meri", "Slatki Stol Sarajevo"],
  decoration: ["Cvijeće i Dekor", "Dekoracija Svadbe", "Ambijent Cvijet"],
  transport: ["Limuzina Elite", "Prevoz Vjenčanja", "Auto Stil"],
  beauty: ["Šminka Studio", "Frizura Salon", "Beauty by Ana"],
};

// Description fragments (BHS) – 2–4 sentences, index-based for uniqueness
const DESC_TEMPLATES: Record<CategorySlug, readonly string[]> = {
  music: [
    "Profesionalni bend za svadbe i proslave. Muzika za sve generacije. Veliki repertoar i iskustvo. Kontaktirajte nas za demo i ponudu.",
    "DJ set za nezaboravnu atmosferu. Moderan i klasičan repertoar. Oprema uključena. Dostupni u cijeloj BiH.",
    "Živa muzika za vaš poseban dan. Harmonika i trubači za tradicionalnu i modernu zabavu. Fleksibilni paketi.",
    "Bend s dugogodišnjim iskustvom. Svadbe, rođendani i proslave. Dogovor za probu i cijene.",
  ],
  photo_video: [
    "Fotografija i video za svadbe. Prirodan stil i emocije. Iskustvo preko 100 vjenčanja. Besplatna konzultacija.",
    "Video snimanje i montaža vjenčanja. Kreativan pristup i brza isporuka. Dostupni u više gradova.",
    "Foto i video paketi za sve prilike. Dron snimke uključene. Profesionalna oprema i iskustvo.",
  ],
  wedding_salon: [
    "Elegantan prostor za do 200 gostiju. Vrt za ceremoniju i fotografije. Kuhinja i catering na zahtjev.",
    "Hotel s salom za proslave. Noćenje za mladence i goste. Parkir i pristupačnost.",
    "Restoran s prekrasnim pogledom. Kapacitet 80–120 osoba. Cvijeće i dekor na dogovor.",
    "Sala za proslave u centru grada. Klimatizacija, ozvučenje, rasvjeta. Fleksibilni termini.",
  ],
  cakes: [
    "Svadbene torte po narudžbi. Degustacija i dizajn po želji. Dostava na adresu. Iskustvo 10+ godina.",
    "Kolači i slatki stol za vjenčanja. Tradicionalni i moderni ukusi. Bez glutena moguće.",
    "Torte za sve prilike — vjenčanje, krštenje, rođendan. Kreativni dizajn i kvalitetni sastojci.",
  ],
  decoration: [
    "Cvijeće i dekoracija za svadbe. Aranžmani i buketi. Kompletna dekoracija prostora po dogovoru.",
    "Dekorater za proslave. Baloni, rasvjeta, stolovi. Besplatna procjena i ponuda.",
    "Cvijeće svježe i vještačko. Dekor za ceremoniju i banket. Dostava i postava uključeni.",
  ],
  transport: [
    "Limuzina i luksuzni automobili za mladence. Vozač, dekoracija. Cijene po dogovoru.",
    "Oldtimer i klasični automobili za vjenčanja. Do 6 putnika. Dostupni vikendom.",
    "Kombi za prevoz gostiju. Udoban i klimatiziran. Cijene po ruti i broju putnika.",
  ],
  beauty: [
    "Šminka i frizura za vjenčanja. Probni termin uključen. Putujem na lokaciju.",
    "Profesionalna šminka za sve prilike. Trajna i prirodna. Iskustvo s nevestama i svadbama.",
    "Frizura i šminka u jednom. Briga o kosama i šminki za vaš dan. Koristim kvalitetne proizvode.",
  ],
};

// --- Helpers (deterministic, no Math.random) ---
function slugify(s: string): string {
  const map: Record<string, string> = { č: "c", ć: "c", đ: "d", š: "s", ž: "z" };
  return s
    .toLowerCase()
    .replace(/[čćđšž]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeGallery(slug: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${slug}-${i}/800/600`
  );
}

function makeVideos(slug: string, count: number): string[] {
  if (count <= 0) return [];
  const links: string[] = [];
  if (count >= 1) links.push(`https://www.youtube.com/watch?v=${slug.slice(0, 11).padEnd(11, "0")}`);
  if (count >= 2) links.push(`https://vimeo.com/${(parseInt(slug.slice(0, 6).replace(/\D/g, "0") || "0", 36) % 999999)}`);
  return links.slice(0, count);
}

function pickServiceCities(locationCity: string, isNationwide: boolean, index: number): string[] {
  if (isNationwide) return [];
  const others = CITIES.filter((c) => c !== locationCity);
  const n = index % 4;
  if (n === 0) return [locationCity];
  const take = Math.min(n, others.length);
  return [locationCity, ...others.slice(0, take)];
}

function pickEventTypes(category: CategorySlug, index: number): EventType[] {
  const all: EventType[] = ["wedding", "birthday", "baptism", "celebration"];
  const byCategory: Partial<Record<CategorySlug, EventType[]>> = {
    music: ["wedding", "birthday", "celebration"],
    photo_video: ["wedding", "baptism", "celebration"],
    wedding_salon: ["wedding", "celebration"],
    cakes: ["wedding", "birthday", "baptism", "celebration"],
    decoration: ["wedding", "birthday", "baptism", "celebration"],
    transport: ["wedding", "birthday", "celebration"],
    beauty: ["wedding", "birthday", "baptism", "celebration"],
  };
  const pool = byCategory[category] ?? all;
  const size = 1 + (index % 3);
  const out = pool.slice(0, Math.min(size, pool.length));
  return out.includes("wedding") ? out : ["wedding", ...out];
}

const PHONE_PREFIXES = ["61", "62", "63", "65", "66"];
function makePhone(globalIndex: number): string {
  const pre = PHONE_PREFIXES[globalIndex % PHONE_PREFIXES.length];
  const num = String(100000 + (globalIndex * 12345) % 900000);
  return `+387 ${pre} ${num.slice(0, 3)} ${num.slice(3)}`;
}

function makeEmail(slug: string, globalIndex: number): string {
  const domains = ["example.com", "mail.ba", "kontakt.ba"];
  const domain = domains[globalIndex % domains.length];
  return `${slug.slice(0, 20).replace(/-/g, ".")}@${domain}`;
}

function makeWebsite(slug: string, globalIndex: number): string | null {
  if (globalIndex % 3 === 0) return null;
  return `https://${slug.slice(0, 15)}.ba`;
}

// Različite vrijednosti za svaki salon (deterministički, ali raznoliko)
const WEDDING_SALON_DETAILS_POOL: WeddingSalonDetails[] = [
  { onSiteOnly: true, capacity: 60, hasParking: true, menuFromKM: 18, indoor: true, outdoor: false },
  { onSiteOnly: true, capacity: 150, hasParking: true, menuFromKM: 28, indoor: true, outdoor: true },
  { onSiteOnly: true, capacity: 220, hasParking: false, menuFromKM: 35, indoor: true, outdoor: false },
  { onSiteOnly: false, capacity: 90, hasParking: true, menuFromKM: 22, indoor: true, outdoor: true },
];

function makeWeddingSalonDetails(salonIndexInCategory: number): WeddingSalonDetails {
  return WEDDING_SALON_DETAILS_POOL[salonIndexInCategory % WEDDING_SALON_DETAILS_POOL.length];
}

// --- Build provider list (deterministic) ---
function buildProviders(): SeedProvider[] {
  const out: SeedProvider[] = [];
  let globalIndex = 0;

  const categories: CategorySlug[] = [
    "music", "photo_video", "wedding_salon", "cakes", "decoration", "transport", "beauty",
  ];

  for (const category of categories) {
    const count = CATEGORY_COUNTS[category];
    const names = NAME_POOLS[category];
    const descs = DESC_TEMPLATES[category];
    const subs = SUBCATEGORIES[category];

    for (let k = 0; k < count; k++) {
      const name = names[k % names.length] + (k >= names.length ? ` ${k + 1}` : "");
      const subcategory = subs[k % subs.length];
      const locationCity = CITIES[globalIndex % CITIES.length];
      const isNationwide = category === "photo_video" && k === 0;
      const serviceCities = pickServiceCities(locationCity, isNationwide, globalIndex);
      const eventTypes = pickEventTypes(category, globalIndex);
      const desc = descs[k % descs.length];
      const slug = slugify(name);
      const galleryCount = 8 + (globalIndex % 3);
      const videoCount = globalIndex % 3 === 0 ? 0 : (globalIndex % 2) + 1;

      out.push({
        name: name.trim(),
        category,
        subcategory,
        locationCity,
        serviceCities,
        isNationwide,
        eventTypes,
        description: desc,
        galleryImages: makeGallery(slug, galleryCount),
        videoLinks: makeVideos(slug, videoCount),
        phone: makePhone(globalIndex),
        email: makeEmail(slug, globalIndex),
        website: makeWebsite(slug, globalIndex),
        details: category === "wedding_salon" ? makeWeddingSalonDetails(k) : null,
      });
      globalIndex++;
    }
  }

  return out;
}

const SEED_PROVIDERS = buildProviders();

async function main() {
  await prisma.provider.deleteMany({});
  await prisma.lead.deleteMany({});

  for (const p of SEED_PROVIDERS) {
    await prisma.provider.create({
      data: {
        name: p.name,
        category: p.category,
        subcategory: p.subcategory,
        locationCity: p.locationCity,
        serviceCities: p.serviceCities,
        isNationwide: p.isNationwide,
        eventTypes: p.eventTypes,
        description: p.description,
        galleryImages: p.galleryImages,
        videoLinks: p.videoLinks,
        phone: p.phone,
        email: p.email,
        website: p.website,
        details: p.details,
      } as unknown as Parameters<typeof prisma.provider.create>[0]["data"],
    });
  }

  const byCategory: Record<string, number> = {};
  const byCity: Record<string, number> = {};
  for (const p of SEED_PROVIDERS) {
    byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
    byCity[p.locationCity] = (byCity[p.locationCity] ?? 0) + 1;
  }

  console.log("Seed completed: %d providers created.", SEED_PROVIDERS.length);
  console.log("By category:", byCategory);
  console.log("By city:", byCity);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
