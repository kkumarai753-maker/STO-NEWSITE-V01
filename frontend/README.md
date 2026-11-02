> Updated website: see [WEBSITE-UPDATES.md](../WEBSITE-UPDATES.md) for the current design, contact flow, validation and deployment instructions.

# Sunrise Tech Origin — Website (frontend)

> Part of the Sunrise repo: this folder is the website; the API lives in
> `../backend`. To run everything together with Docker, see the root README.

Marketing site for an AI automation and custom software company, built with
**Next.js 16 (App Router)**, **TypeScript (strict)**, **Tailwind CSS v4**,
**Motion**, **shadcn/ui (Radix)**, **Lucide** and adapted **Aceternity UI** patterns.

> Brand: **Sunrise Tech Origin** (set in `config/site.ts`). The logo is vector
> artwork in `components/brand/logo-art.ts`, shared by the site, the app icon
> and the share image; `app/icon.svg` and `public/brand/*` are generated from it.
>
> Design: "First Light" — every page opens in a night masthead with a sunrise
> on the horizon and moves into warm paper "day" sections. Geist for all text; navy actions with a sun-orange accent.
> The full design system (tokens, type scale, components, states) is in
> [`DESIGN.md`](./DESIGN.md). All copy is written in plain language for
> non-technical readers.

## Quick start

```bash
cd frontend
npm ci
cp .env.example .env.local   # optional — the site runs without any keys
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint
```

## What to edit (no UI changes needed)

| What | Where |
| --- | --- |
| Company name, email, phone, WhatsApp, location, hours, socials | `config/site.ts` (+ `NEXT_PUBLIC_*` env vars) |
| Navigation, footer links, legal links | `config/navigation.ts` |
| Services · automation example · product tabs · process | `data/services.ts`, `data/automation.ts`, `data/products.ts`, `data/process.ts` |
| Case studies | `data/case-studies.ts` (set `isPlaceholder: false` for real projects) |
| Testimonials | `data/testimonials.ts` (set `isPlaceholder: false`; optional `photo`) |
| Statistics | `data/stats.ts` (set `statsArePlaceholders = false` once verified) |
| Why us · industries · FAQ · technologies · contact options | `data/why-us.ts`, `data/industries.ts`, `data/faq.ts`, `data/technologies.ts`, `data/contact.ts` |
| Logo | artwork `components/brand/logo-art.ts`, components `components/brand/logo.tsx`; regenerate files with `scripts/generate-logo-assets.mjs` |
| Design tokens (colours, type scale, motion, radii) | `app/globals.css` (`:root`, `.theme-night`, `@theme`) — see `DESIGN.md` |

Placeholder content is visibly labelled on the site ("Sample project",
"Placeholder testimonial", metrics disclaimer) until you flip the flags above.

## Brand files (`public/brand/`)

All generated from the vector logo with
`node --experimental-strip-types scripts/generate-logo-assets.mjs` (re-run after
changing `components/brand/logo-art.ts` or the brand colours).

| Use | File |
| --- | --- |
| Logo for documents, slides, print (vector) | `sunrise-tech-origin-logo.svg` — on dark backgrounds: `…-logo-white.svg` |
| Logo as an HD image (2400 px, transparent) | `sunrise-tech-origin-logo.png` / `…-logo-white.png` |
| Wide logo (email signatures, headers) | `sunrise-tech-origin-logo-horizontal.svg/.png` — on dark: `…-horizontal-white.svg`, `…-horizontal-dark.png` |
| Instagram / Facebook / LinkedIn profile picture | `sunrise-tech-origin-profile-picture-black.png` (1080×1080, navy, circle-safe). White version: `…-profile-picture-white.png` |
| Facebook / LinkedIn cover | `sunrise-tech-origin-cover.png` (1640×624) |
| The sun on its own | `sunrise-tech-origin-mark.svg`; one colour: `…-mark-black.svg` / `…-mark-white.svg` |

Brand typeface: Geist, used for everything (SIL OFL, files in `assets/fonts/`).

Brand colours: navy `#0A1B38` (dark sections) and `#0B2A55` (actions), paper
`#F6F4EF`, logo blue `#0B4F94` (links, focus), and the sun from yellow `#FFD922`
to orange `#FD8A0B`. The logo's wordmark runs from `#0766B4` to `#05213E`.

## Deploying

- **Vercel:** import the repository and set **Settings → Build and Deployment →
  Root Directory** to `frontend` (the site lives in this folder). No other build
  settings are needed. Add the variables below under **Settings → Environment
  Variables**, then redeploy.
- **Docker:** `frontend/Dockerfile` builds a small production image from the
  standalone output (`output: "standalone"` in `next.config.ts`). The root
  `docker-compose.yml` runs it together with the API and database.

## Environment variables

See `.env.example`. Everything without `NEXT_PUBLIC_` stays on the server.

- `NEXT_PUBLIC_SITE_URL` — canonical URL for metadata, sitemap and JSON-LD.
- `NEXT_PUBLIC_CONTACT_EMAIL` — public email address (defaults to the confirmed Sunrise address).
- `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE_NUMBER` — empty values hide those actions in production (development shows a "not configured" hint).
- `ANTHROPIC_API_KEY` — enables AI answers in the chatbot (Claude via the official SDK). Without it the bot runs in **demo mode** using site content. Optional: `AI_MODEL` (default `claude-opus-5-5`), `AI_MAX_TOKENS` (default 2048).
- Contact delivery — configure one: `RESEND_API_KEY` + `CONTACT_TO_EMAIL`, or `CONTACT_WEBHOOK_URL`. Without a delivery provider or backend, visitors prepare a message and choose email or WhatsApp to send it themselves. The UI never reports a prepared draft as delivered. With a provider or backend configured, the existing server action sends the enquiry and reports delivery failures.

## Architecture

```
app/
  layout.tsx            fonts, metadata, Organization/WebSite JSON-LD, shell
  page.tsx              home — composes server-rendered sections
  actions/contact.ts    Server Action: validation, honeypot, timing, rate limit, delivery
  api/chat/route.ts     chatbot endpoint: NDJSON streaming, origin check, rate limit
  privacy|terms|cookies legal templates (review with counsel)
  robots.ts sitemap.ts manifest.ts opengraph-image.tsx apple-icon.tsx icon.svg
components/<section>/   one folder per section (see below)
config/                 business configuration
data/                   business content
lib/
  validation/           zod/mini schemas shared by client and server
  server/               server-only modules (rate limiter, delivery, chat knowledge)
  seo.ts                schema.org builders
  brand-icons.ts        generated by scripts/generate-brand-icons.mjs
hooks/                  useMediaQuery / usePrefersReducedMotion
```

### Admin dashboard (`/admin`)

Sign in at `/admin/login` (create the account with `python -m app.cli create-admin`
in `../backend`; needs `BACKEND_API_URL` + `BACKEND_API_KEY`).

| Route | What it shows |
| --- | --- |
| `/admin` | live counts (total, today, this week/month, last 7/30 days, by status and source), 14-day chart, latest submissions |
| `/admin/records` | all submissions with search, status/date filters and pagination (filters live in the URL) |
| `/admin/settings` | account details and change password |

- `proxy.ts` redirects to the login page when there is no session cookie (optimistic);
  every admin page re-verifies the session with the backend (`lib/server/admin-session.ts`).
- The session cookie (`admin_session`) is httpOnly, SameSite=Lax, scoped to `/admin`.
  Sign-in attempts are rate-limited (10 per 15 minutes per client).
- The site navbar, footer, floating dock and design tool are hidden on `/admin`
  (`components/providers/site-chrome.tsx`); admin UI lives in `components/admin/`.

### Server vs Client Components

Every section is a **Server Component**; interactivity lives in small client
islands. The home page is prerendered as static HTML.

| Client component | Why it needs the client |
| --- | --- |
| `effects/page-effects` | One IntersectionObserver + delegated pointer listener for scroll reveals (`data-reveal`), card spotlight (`data-spotlight`) and magnetic buttons (`data-magnetic`) — so sections stay server-rendered |
| `navbar/navbar`, `navbar/mobile-menu` | Scroll state, active-section tracking, Radix dialog menu |
| `hero/flip-words` | Timed word rotation (CSS-animated, no Motion) |
| `ai-automation/automation-demo` | Timed workflow state machine with Pause/Replay, pauses off-screen |
| `products/container-scroll`, `products/product-showcase` | Scroll-linked tilt; accessible tabs (mockups server-rendered) |
| `case-studies/case-study-carousel` | Carousel controls + Radix dialog |
| `testimonials/animated-testimonials` | Slide state and stacked-card animation |
| `about/number-ticker` | Count-up on view (final value server-rendered) |
| `contact/contact-form` | Instant validation, pending/success/error states, focus management |
| `floating-actions/floating-dock`, `chatbot/chat-panel` | Dock state; chat window is code-split and loaded on first open |
| `ui/accordion` | Radix accordion |

### Aceternity UI usage

Adapted (not copied wholesale) to fit the brand and performance budget:
Flip Words (CSS rewrite) · Infinite Moving
Cards (server-rendered CSS marquee) · Bento Grid (services) · Card Spotlight /
Glowing Effect (CSS-only pointer glow) · Container Scroll Animation (product
mockups) · Apple Cards Carousel + Animated Modal (case studies) · Animated
Testimonials (deterministic, no autoplay) · Resizable Navbar (condensing nav) ·
Floating Dock concept (action dock).

## Quality

- **Accessibility:** WCAG 2.2 AA target — semantic landmarks, skip link, visible
  focus, labelled forms with inline errors, Radix dialogs (focus trap, Esc),
  ARIA tabs, live regions for chat and form status, Pause/Replay for the
  automation demo, full `prefers-reduced-motion` support. axe-core reports no
  violations on the home and legal pages (desktop and mobile).
- **Performance:** static prerendering, Server Components by default, Motion via
  `LazyMotion` (features loaded async), chat bundle loaded on demand, CSS-driven
  decorative animation, `next/font`, no external scripts or images on the
  critical path.
- **SEO:** metadata, Open Graph/Twitter cards, canonical URLs, sitemap, robots,
  manifest, JSON-LD (Organization, WebSite, Service list, FAQPage, Breadcrumbs).
- **Security:** secrets only on the server, input validation on every server
  entry point, honeypot + timing + rate limiting, same-origin check on
  `/api/chat`, CSP and security headers (`next.config.ts`).

### Production notes

- The in-memory rate limiter suits a single Node process. For serverless or
  multiple instances, back `lib/server/rate-limit.ts` with Redis/Upstash.
- Set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` for self-hosted multi-instance deploys.
- Adding analytics or embeds? Extend the CSP in `next.config.ts`.
