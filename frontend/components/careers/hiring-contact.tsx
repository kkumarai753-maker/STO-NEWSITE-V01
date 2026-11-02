import { siteConfig } from "@/config/site";
export function HiringContact() {
  return (
    <aside className="rounded-3xl border border-line bg-primary-light p-6 sm:p-8">
      <p className="preview-kicker">Hiring team</p>
      <h2 className="mt-3 text-heading-2">Have a question?</h2>
      <p className="mt-3 text-text-muted">
        Work from Office · Nagpur, Maharashtra, India
      </p>
      <div className="mt-5 flex flex-wrap gap-4">
        <a
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white"
          href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent("Hello Team Sunrise Tech Origin, I have a question about careers.")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat with Hiring Team
        </a>
        <a
          className="rounded-full border border-line-strong bg-white px-5 py-3 text-sm font-semibold"
          href={`mailto:${siteConfig.contact.email}?subject=Careers%20enquiry`}
        >
          Email Hiring Team
        </a>
      </div>
      <p className="mt-4 text-sm text-text-muted">
        {siteConfig.contact.phone} · {siteConfig.contact.email}
      </p>
      <p className="mt-3 text-sm text-text-muted">
        These links open a conversation or email draft. They do not submit a
        website application. For an email draft, attach your CV manually before
        sending.
      </p>
    </aside>
  );
}
