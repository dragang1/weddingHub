ProjectSpec — WeddingHub (Muzika / Foto / Dekor)

1. Sažetak

Web aplikacija (marketplace/directory) gdje korisnici (mladenci/organizatori) mogu brzo pronaći i kontaktirati provjerene pružaoce usluga za svadbe: muzika (bend/DJ), foto/video, dekoracija. Platforma prikazuje profile, galeriju, cijene/range, lokaciju i dostupnost (MVP: ručno / “na upit”), te omogućava slanje upita (lead) prema izvođaču.

2. Ciljevi

Omogućiti korisnicima da u 2–3 klika pronađu izvođača po gradu + datumu + budžetu + tipu usluge.

Izvođačima dati mjesto gdje mogu prikazati rad (video/foto), cijenu i dobiti upite.

MVP koji se može pustiti sa prvih 30–50 profila (ručno uneseno) i već tada ima vrijednost.

Monetizacija kroz: Premium listing / Featured / Plaćeni upiti (AdSense sekundarno).

3. Ne-ciljevi (za MVP)

Nema online plaćanja rezervacije.

Nema kompleksnog kalendara sinhronizacije.

Nema chat sistema u realnom vremenu (može kasnije).

Nema automatske provjere dostupnosti (MVP: “Provjera termina na upit”).

4. Personae

Korisnik (mladenci/organizator)
Traži po gradu i datumu, želi realne snimke i jasnu cijenu/range, šalje 1–3 upita.

Pružalac usluge (bend/DJ/foto/dekor)
Želi profil, isticanje, dobijanje upita. Njemu je bitno da upiti budu kvalitetni (datum/lokacija/budžet).

Admin
Dodaje/uređuje profile, moderira recenzije (kasnije), podešava featured/premium.

5. Funkcionalnosti
   5.1 MVP (must-have)

A) Public

Landing page (value prop + kategorije + top featured + CTA).

Browse/listing po kategoriji (muzika, foto/video, dekor).

Filteri:

Lokacija (grad / regija)

Datum događaja (za upit)

Budžet range

Podkategorija (npr. bend/DJ; fotograf/video; dekor/cvijeće)

Sort: Featured prvo, zatim rating (ako postoji), zatim random/novi

Profil pružaoca usluge:

naziv, lokacija, opis

galerija (foto) / embed video (YouTube/Vimeo) ili upload link

usluge + stil/žanr

cijena ili raspon cijena + šta je uključeno

kontakt forma “Pošalji upit”

Slanje upita (lead):

ime i prezime

telefon (obavezno)

email (opciono)

datum i mjesto

budžet (opciono)

poruka

potvrda + anti-spam (rate limit + honeypot)

Email notifikacija:

izvođaču (ako ima email) i adminu (kopija)

B) Admin

Admin panel (minimalno):

CRUD profila (create/edit/delete)

upload/unos galerije, linkovi videa

označi profil kao Featured / Premium

pregled upita (leadova)

Napomena: Admin može biti jednostavan “admin route” u aplikaciji (za MVP) ili CMS (npr. Strapi). Pošto već radiš Strapi ranije, CMS opcija je realna.

5.2 V1 (nice-to-have)

Recenzije (moderirane).

“Paketi” (kombinacije: bend + fotograf).

Registracija izvođača i samostalno uređivanje profila.

Dodatni filteri: “putni troškovi”, “oprema uključena”, “trajanje nastupa”.

5.3 V2 (kasnije)

Napredni kalendar dostupnosti + sync (Google Calendar).

In-app chat.

Online depozit / plaćanje.

Ugovor/ponuda PDF generator.

6. Monetizacija

Premium profil: više medija, bolja pozicija u listi, badge.

Featured: istaknuto na homepage i vrhu kategorije.

Plaćeni upiti: npr. X besplatno mjesečno, dalje naplata po upitu.

Direktni sponzori (zlatari, saloni vjenčanica, sale za svadbe).

AdSense/oglasi: tek kad bude veliki traffic (sekundarno).

7. Tehnički prijedlog (preporuka za Cursor implementaciju)
   7.1 Stack (preporučeno)

Next.js 14 (App Router)

PostgreSQL

Prisma ORM

Zod (validacije)

Nodemailer (email) ili Resend (lakše)

Upload:

MVP: linkovi (YouTube, Google Drive, Instagram) + image URLs

V1: S3/R2 ili Cloudinary za slike

7.2 Alternativa (ako želiš CMS)

Strapi (CMS + admin) + Postgres

Next.js front (fetch iz Strapi)

Upiti idu kroz Next API route (da sakriješ email i radiš anti-spam)

8. Data model (minimalan)
   Provider (puzalac usluge)

id (uuid)

name

category: music | photo_video | decor

subcategory: string (npr. dj/band/photographer/videographer/decorator/florist)

locationCity, locationRegion

description

priceFrom, priceTo (nullable)

tags (string[])

media:

galleryImages (string[] URLs)

videoLinks (string[] URLs)

isFeatured (bool)

isPremium (bool)

contactEmail (nullable)

contactPhone (nullable)

createdAt, updatedAt

Lead (upit)

id

providerId

customerName

customerPhone

customerEmail (nullable)

eventDate

eventCity

budget (nullable)

message

status: new | replied | closed

createdAt

(V1) Review

id, providerId, rating 1–5, text, authorName, isApproved, createdAt

9. API rute (Next.js Route Handlers)

GET /api/providers?category=&city=&date=&priceMin=&priceMax=&subcategory=&q=

GET /api/providers/:id

POST /api/leads (kreira lead + šalje email)

(Admin) POST/PUT/DELETE /api/admin/providers (zaštićeno)

(Admin) GET /api/admin/leads

10. UI stranice (App Router)

/ landing

/kategorija/[category] listing + filter

/profil/[id] profil + forma

/admin (login)

/admin/providers CRUD

/admin/leads lista upita

11. UX detalji (bitno za konverziju)

Na listingu: kartice sa mini galerijom, grad, starting price, “Pošalji upit”.

Na profilu: media iznad fold-a + CTA sticky button.

Forma upita: minimalna, telefon obavezan.

“Similar providers” sekcija.

12. Non-functional zahtjevi

SEO: server-rendered listing/profili, clean URLs, meta tags.

Performance: lazy load galerije, image optimization.

Security: rate limiting za POST leads, honeypot, basic admin auth.

Logging: basic audit za leads + email errors.

13. Acceptance criteria (MVP)

Korisnik može filtrirati i otvoriti profil za sve 3 kategorije.

Korisnik može poslati upit i dobija potvrdu.

Upit se snimi u bazu i email se pošalje izvođaču i adminu.

Admin može dodati/izmijeniti profil i označiti Featured/Premium.

Featured profili se prikazuju na vrhu listi i na landing-u.

14. Milestones

Setup projekta + DB + Prisma (Provider/Lead)

Listing + filter + profil stranica

Lead forma + API + email + anti-spam

Admin CRUD (minimalno)

Seed sadržaja (30–50 profila) + osnovni SEO

Launch + analytics (GA4 opcionalno)

15. Seed plan (za start)

10 muzika (5 bendova + 5 DJ)

10 foto/video

10 dekor

Svaki: 6–10 slika + 2 video linka + price range + grad
