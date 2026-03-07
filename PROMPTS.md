Bina satu SvelteKit site untuk wedding invitation (2 versi): /perempuan (fairytale) & /lelaki (Melayu). Requirements lengkap:

1) Struktur & routes:
- Public routes: / (landing selector), /perempuan, /lelaki, /cetak (print-friendly), /invite/[code], /gallery, /admin (protected).
- Environment variables: GOOGLE_FORM_ID, MAP_EMBED_URL, ADMIN_PASS, OTP_SECRET (optional).

2) Theme & UI:
- TailwindCSS with design tokens; theme variables per-route.
- Hero, EventCard, Schedule, MapEmbed, Gallery (lightbox), GuestbookModal (embed Google Form), QRCard, Countdown, PrintableCard component, ShareButtons (WhatsApp, copy link).
- Accessibility: skip-to-content, aria attributes, keyboard nav.

3) RSVP & guest handling:
- Embed Google Form in modal (mobile opens new tab). Include client-side snippet to open modal and focus iframe.
- Plus-one support, dietary, foto (link), attendance field. After submit, show success modal with:
  - Add to Calendar (.ics) button (generate via JS)
  - Download printable invite (PDF via print CSS)
  - Share WhatsApp button with prefilled message.

4) Map & directions:
- MapEmbed component using MAP_EMBED_URL (iframe). Add “Get directions” links for Google Maps & Waze.
- Show parking pins, entrance notes, and distance/time info (static text).

5) QR & invite codes:
- Generate QR (server or client) that points to `/invite/{code}`. Invite code maps to guest name (optional CSV import).
- `invite/[code]` shows personalized message + RSVP quick link.

6) Admin:
- /admin shows responses (via Google Sheets API or fetch from Zapier->serverless). Allow export CSV, mark confirmations, and message guests (mail merge stub).

7) Social & SEO:
- Dynamic meta tags and dynamic OG images generator (on build or serverless) so share preview shows bride/groom + date + theme.
- Prebuilt WhatsApp share texts (formal & casual).

8) Extras & performance:
- PWA manifest + service worker for offline read, image srcset, lazy-loading, font preloading, sitemap.xml, robots.
- reCAPTCHA or Google Form spam settings.
- Analytics (privacy-first) and consent banner.

9) Deliverables:
- File tree, `src/routes/perempuan/+page.svelte` and `/lelaki/+page.svelte` minimal working examples.
- Components: MapEmbed.svelte, GuestbookModal.svelte, QRCard.svelte, IcsGenerator.js, PrintableCard.css.
- README with deploy steps to Vercel and env vars.

Output required: full spec + file tree + sample code for main routes + small snippets:
- QR generation (npm qrcode)
- .ics generation (JS blob)
- iframe embed for Google Form