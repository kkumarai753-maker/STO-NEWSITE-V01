# Careers implementation and activation

The owner-supplied careers PDF defines 13 role profiles. Migration `0003` seeds all profiles as **Draft**, in the supplied category and role order. It never opens a vacancy. Draft and Closed profiles return no public role page; the authenticated admin can preview and edit them. Fixed work mode: **Work from Office — Nagpur, Maharashtra, India**.

Public entry links appear only as the last item in the hamburger menu and in the footer’s Contact & Policies group. Careers categories use separate URLs under `/careers/category/`; role JDs use `/careers/[job-slug]`; `/careers/apply?role=WEB-03` preserves a chosen role. Recruitment is separate from customer enquiries. No applicant account is required.

## What works in the code

- Four category pages and All Roles; function filters, clear filters and empty states.
- Thirteen editable role profiles, publication controls and authenticated previews in `/admin/recruitment`.
- Candidate validation, international phone formatting, experience including zero, required acknowledgements and consent.
- One actual PDF or DOCX up to 5 MB, bounded upload, progress, filename and replace/remove controls. General-interest records allow an optional CV and have their own inbox filter.
- Durable database records, generated private file keys, authenticated CV downloads with a 90-second session-bound download ticket. Private files are served as attachments, never public assets.
- One reference per form retry token; atomic uniqueness and provider idempotency prevent duplicate records and duplicate email submissions. Hiring status, email state, WhatsApp handoff and consent/submission times are distinct.
- Inbox filtering by role, category, date, kind and hiring status; internal notes, individual deletion and retention cleanup.
- WhatsApp handoff requires the candidate to tap Send. Opening a draft is never reported as an application save. Server-side email acceptance is reported as submitted for delivery, never recipient delivery.
- Original role-family SVG compositions, with the approved Sunrise logo and confirmed contacts in HTML. The Pinterest references are not published and their third-party identities or claims are not copied.

## Before activation

Run backend migrations with `alembic upgrade head`, update backend dependencies, and configure the existing frontend `BACKEND_API_URL` and server-only `BACKEND_API_KEY`.

The backend exposes its configuration readiness to authenticated administrators. Collection is disabled unless **all** of these are set:

| Setting | Required action |
| --- | --- |
| `CAREERS_ENABLED=true` | Explicitly activate website collection after readiness review. |
| `CAREERS_STORAGE_DIR` | Absolute, writable directory on a **private persistent volume**, outside the public web root. Docker Compose mounts `careers-private` at `/var/lib/sunrise/careers`. Back up this volume and the database together; restrict backup access and apply the same retention/deletion policy. Do not use an ephemeral Render/Vercel filesystem. |
| `CAREERS_RETENTION_DAYS` | Owner-reviewed positive retention duration. No duration is chosen by default. |
| `CAREERS_PRIVACY_APPROVED=true` | Review `/careers/privacy`, intended candidate use, access policy and contact details. |
| `CAREERS_RETENTION_SCHEDULE_CONFIRMED=true` | Install and verify the scheduled purge described below. |
| Active authenticated administrator | Create an authorised hiring admin using the existing admin CLI. Only trusted hiring staff should have admin access. |

Schedule `python -m app.cli purge-careers` at least daily on the backend host, with the same database and storage environment. For Docker: `docker compose exec -T backend python -m app.cli purge-careers`. The command removes expired records and their files; the admin workspace also provides expiry cleanup and individual deletion. Arrange backup expiration and restoration procedures so deleted profiles are not silently restored.

A path being writable cannot prove that the hosting provider made it durable; the deployment owner must verify the volume and backups. Without reviewed configuration, the public page provides direct hiring contacts and clearly says online collection is inactive. It does not collect details or CVs.

## Email activation and review

Outgoing recruitment email is independently disabled by default. Before enabling it, approve the template below and configure a verified sender on the company domain. Use a controlled, approved test recipient/inbox for any real delivery test; automated tests mock the provider and send nothing externally.

- `CAREERS_EMAIL_ENABLED=true`
- `CAREERS_TEMPLATES_APPROVED=true`
- `CAREERS_RESEND_API_KEY`: server-only Resend credential.
- `CAREERS_SENDER`: verified sending address at `sunrisetechorigin.com`; no invented public HR mailbox is added to the site.
- Destination remains the owner-approved `info@sunrisetechorigin.com`; Reply-To is the candidate’s validated email.

Subject: `Career Application | {job_title} | {candidate_name} | {application_id}`

Body: application reference, role, exact category, Work from Office/Nagpur strip, name, email, phone, city, experience, availability, portfolio and introduction. A private uploaded CV is attached as `resume.pdf` or `resume.docx`. Signature: `Team Sunrise Tech Origin`.

WhatsApp template: `Hello Team Sunrise Tech Origin, I would like to apply for {job_title} in {service_category}. My name is {candidate_name}. My application reference is {application_id}. I have uploaded my resume through your Careers form.` General-interest records without a CV use an accurate profile-only sentence.

No automatic candidate acknowledgement email is sent. A failed email preserves the saved application and offers retry or WhatsApp with the same reference. Provider acceptance does not establish recipient delivery.

## Validation status

Backend tests cover draft publication rules, exact IDs, fixed office details, real PDF/DOCX validation, size limits, required fields, private CV authorisation, expired download tickets, retry deduplication, publication closure, separate general interest, deletion, expiry purge and mocked email success/failure. The production build, frontend lint and 35 backend tests pass. The local browser journey verifies all 13 authenticated draft JDs, category-to-role navigation, prefill, failed-upload input preservation, saved CV access, retries, hiring-status review and deletion. Desktop/mobile screenshots accompany the delivery status; they use a temporary test-only opening that was restored to Draft after verification. No real email or WhatsApp message was sent.

Deployment secrets, owner-approved retention, verified email credentials and notification-template approval are not supplied in the repository. Do not switch these settings on automatically during deployment.
