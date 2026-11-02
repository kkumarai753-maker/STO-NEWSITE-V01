## Official social and contact links

The footer social row now links to the owner-supplied Instagram, Facebook, LinkedIn, X/Twitter, Threads and WhatsApp Channel destinations, plus email and the official website. Exact supplied URLs are preserved, including the Threads handle. The direct WhatsApp chat remains in the floating dock and footer contact list. Icons are accessible vector glyphs, wrap on narrow screens and have descriptive names and tooltips.

The default canonical origin is https://sunrisetechorigin.com; an explicit NEXT_PUBLIC_SITE_URL still overrides it. Owner-confirmed social destinations are also included in Organization sameAs metadata. Public account ownership and remote page availability are based on the owner's supplied details and have not been independently authenticated in this task.

## Service artwork update

The four main service cards display the owner's supplied social-media, website-development, AI-agent and custom-software artwork. Graphics use object-contain and matching backgrounds so no lettering is cropped. Each image opens its matching service-options section. Service order, package wording and all five supplied demo destinations are unchanged. Provider logos within the supplied AI illustration are not claims of official partnerships.

# Latest approved frontend refresh

The homepage now uses the approved image hero, left hamburger/right-logo header, callback popup and four service categories in the owner's requested order. The template gallery links to the five owner-supplied demos: Aaranya Salon, BNP Wellness, SR Wonder Travels, Sunrise Global Life School and Sunrise Gold Gym. Each demo opens in a new tab.

The gallery uses owner-supplied illustrative graphics for salon, wellness, travel and gym; the school card uses generated illustrative campus artwork. These graphics are labelled illustrative and are not claimed to be screenshots of the remote websites. Earlier local concept recordings are not attached to the owner-supplied destinations. The business-growth graphic appears in the social-media service card.

Public email: **info@sunrisetechorigin.com**. Prices remain subject to scoping; no unapproved rates have been added. The small amounts shown in old, separately labelled local concept storefronts are demonstration product amounts, not Sunrise service prices.

Blog, Feedback, policy links, industry filters and service enquiry links are included. The callback form can use the existing backend/email/webhook when configured, or explicitly offers visitor-sent email/WhatsApp drafts otherwise. A draft is never described as delivered.

Validation: production build, TypeScript, lint, browser checks and scoped homepage/menu/callback accessibility checks passed. Exact supplied external URL mappings and mobile gallery behavior were checked locally. Remote demo uptime could not be verified because this environment's network proxy rejected the HTTPS tunnels with 403.

GitHub commit and deployment status are reported separately; a successful local build or Git push alone does not establish a completed Vercel deployment.

---

# Sunrise Tech Origin — website update

This version builds on the supplied `sunrise-main.zip`. The original logo, detailed service pages, legal pages, FastAPI backend and admin area are retained.

## Confirmed business details

- Brand: Sunrise Tech Origin
- Email: kkumarai753@gmail.com
- Phone: +91 87668 03990
- WhatsApp: 918766803990
- Location: Chitnis Nagar, Nagpur, Maharashtra, India
- Hours: Monday–Saturday, 9:00–19:00 IST

These are the details confirmed by the owner in this conversation. No additional saved brand memory was available. Public contact overrides live in `frontend/config/site.ts` and the `NEXT_PUBLIC_*` variables in the environment examples.

## What changed

- A focused homepage: clear business offer, four service paths, interactive software concepts, project process, FAQs and an enquiry form.
- Blue and navy with orange sunrise accents; the supplied brand logo is preserved.
- Consultation calls to action and service-specific enquiry links.
- Responsive desktop, 390px mobile and 320px small-phone layouts.
- Self-hosted, licensed Geist fonts. The website no longer downloads five font families from Google during a build.
- Software examples are explicitly described as concepts. Placeholder testimonials remain hidden.
- Contact delivery is selected at request time, including when Docker injects settings at runtime.
- Without a backend or delivery provider, the form validates the visitor’s details and prepares email/WhatsApp drafts. The visitor reviews and sends the message in their chosen app; the website does not claim it was received.
- With the existing backend, a Resend configuration or a webhook, the form submits through the server and shows actual delivery success/failure.
- Removed the development-only behavior that reported success merely after logging a submission.
- Public phone, WhatsApp and email defaults are consistent across the source and Docker examples. Empty phone/WhatsApp overrides hide those channels.
- Improved footer wordmark contrast and cleared the unused-import lint warnings.

## Run locally

Use the existing project folder; an additional Git worktree is unnecessary.

```bash
cd frontend
npm ci
npm run dev
```

An `.env.local` file is optional. Without delivery settings, use the visitor-sent email/WhatsApp flow. If copying `.env.example`, replace its example website URL and leave `BACKEND_API_URL` empty unless the API is running.

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

The existing Next.js configuration produces standalone output for Docker. `npm start` serves the local production build but Next.js emits a standalone-mode recommendation. The existing Docker image runs the generated standalone server directly and copies its static assets as required.

## Deployment

See [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md) for the Vercel project settings. `frontend/vercel.json` records the framework and build commands.

- **Vercel:** deploy with the project root set to `frontend`. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS website domain before building. The owner has not confirmed a live domain in this conversation.
- **Docker:** use the existing root `docker-compose.yml`. Rebuild the frontend after changing any `NEXT_PUBLIC_*` setting. Docker configuration was updated but a container build was not run in this task.
- **Contact submissions:** the email/WhatsApp draft flow works without a backend. For direct website delivery, configure the existing FastAPI backend and matching API key, or `RESEND_API_KEY` plus `CONTACT_TO_EMAIL` and an approved sender, or `CONTACT_WEBHOOK_URL`.
- **Staging:** use `SITE_ENV=staging` to prevent indexing; use `SITE_ENV=production` only for the real published website. Vercel also supplies its deployment stage automatically.
- **Admin:** requires the existing FastAPI/PostgreSQL service and a created administrator; the backend and admin workflows were not changed or exercised here.
- The existing policy and commercial pages remain subject to owner review, including their payment terms.

## Verification

- Production Next.js build and TypeScript passed. A clean development-server restart also passed menu and enquiry-prefill checks.
- ESLint passed without warnings.
- Homepage checked at 1440px, 390px and 320px with one H1 and no horizontal overflow.
- Checked 13 additional public routes for HTTP 200 responses.
- Service links prefill the enquiry form.
- Invalid forms show field errors and focus the first invalid field.
- Email and WhatsApp draft recipients and contents checked; editing preserves the visitor’s input.
- Mobile menu opens, Escape closes it and focus returns to its trigger.
- Product tabs support mouse and arrow keys; FAQ disclosures work.
- Production contact success and provider-failure behavior exercised using a temporary local webhook, with zero external messages sent.
- axe-core WCAG A/AA automated checks returned no violations on the homepage and enquiry page. This is a scoped automated check, not a claim of full accessibility compliance.

## GitHub and publication

The target repository is `kkumarai753-maker/STO-NEWSITE-V01`, associated with the confirmed account. The updated source preserves the original uploaded ZIP and repository history. The supplied patch is also applicable directly to the original source archive. A local build is not proof of a live deployment; see the task handoff for the actual GitHub and Vercel result.
