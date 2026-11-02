# Deploy Sunrise Tech Origin to Vercel

The deployable website is in `frontend`. The cloud development environment itself is not deployed to Vercel.

## GitHub import

1. Use the updated source in `kkumarai753-maker/STO-NEWSITE-V01`. Preserve its existing history and uploaded archive.
2. In Vercel, import that GitHub repository.
3. Set **Root Directory** to **frontend** and **Framework Preset** to **Next.js**.
4. Install command: `npm ci`. Build command: `npm run build`. Use the framework's default output directory.
5. Keep the public contact details already included in the source. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain once it is known, then redeploy so canonical URLs and sitemap entries use that origin. Before the final launch, use `SITE_ENV=staging` to disable indexing; production should use `SITE_ENV=production`.
6. Deploy and verify the homepage, service links, enquiry drafts, navigation and mobile layout.

`frontend/vercel.json` records the framework and build commands. Vercel project root selection remains a project setting.

## Contact forms and backend

The frontend works without external delivery credentials: visitors prepare their brief, then open an email or WhatsApp draft and send it themselves.

For direct website submission, configure either the existing FastAPI backend (`BACKEND_API_URL` and matching `BACKEND_API_KEY`), a Resend sender (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`), or `CONTACT_WEBHOOK_URL`. Never put credentials in `NEXT_PUBLIC_*` variables.

The existing PostgreSQL/FastAPI service is a separate deployment. Importing this frontend into Vercel does not provision that service or enable the admin area.

## Agent-managed deployment

The environment has a saved requirement for a personal `VERCEL_TOKEN` scoped to `api.vercel.com`. Enter it securely in environment settings, not in chat or source files. Use an account/team with permission to create or deploy the intended Vercel project. If deploying into an existing team/project, provide its name or public identifier.

## Validation and publishing status

The website passed the local production build and browser checks described in `WEBSITE-UPDATES.md`. GitHub upload and live Vercel deployment status are reported separately in the task handoff; a local build alone does not prove deployment.
