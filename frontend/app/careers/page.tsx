import Link from "next/link";
import { ArrowUpRight, Bot, Code2, Monitor, Megaphone } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { HiringContact } from "@/components/careers/hiring-contact";
import { serviceCategories } from "@/data/service-categories";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/careers");
const icons = [Monitor, Code2, Bot, Megaphone];
export default function CareersPage() {
  return (
    <>
      <PageHero
        path="/careers"
        eyebrow="Work from Office · Nagpur, Maharashtra, India"
        title={
          <>
            Build your career.
            <br />
            <em>Create real business impact.</em>
          </>
        }
        lead="Join a team working across websites, business software, AI automation and social media. Explore opportunities in sales, operations, development and marketing, and bring your skills to work that helps businesses move forward."
        actions={
          <Link
            href="/careers/roles"
            className="rounded-full bg-primary px-6 py-4 font-semibold text-white"
          >
            Explore Open Roles
          </Link>
        }
      />
      <section className="section-y-sm">
        <div className="container-page">
          <p className="preview-kicker">Find your team</p>
          <h2 className="mt-4 text-heading-1">
            Four teams.
            <br />
            <em>Choose your direction.</em>
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {serviceCategories.map((c, i) => {
              const Icon = icons[i];
              return (
                <Link
                  href={`/careers/category/${c.id}`}
                  key={c.id}
                  className="group rounded-3xl border border-line bg-white p-7 transition-colors hover:border-primary"
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      className="size-10 rounded-xl bg-primary-light p-2 text-primary"
                      aria-hidden
                    />
                    <span className="text-xs text-text-muted">
                      0{i + 1} / TEAM
                    </span>
                  </div>
                  <h3 className="mt-7 text-heading-2">{c.name}</h3>
                  <p className="mt-4 text-text-muted">
                    Explore the available roles and full job descriptions in
                    this team.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                    View roles <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-12">
            <HiringContact />
          </div>
        </div>
      </section>
    </>
  );
}
