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
