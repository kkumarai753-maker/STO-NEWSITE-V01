import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles } from "@/data/blog";
import { PageHero } from "@/components/ui/page-hero";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/blog");
export default function BlogPage() {
  return (
    <>
      <PageHero
        path="/blog"
        eyebrow="The Sunrise notebook"
        title={
          <>
            A little clarity.
            <br />
            <em>A better next step.</em>
          </>
        }
        lead="Practical starting points for websites, digital marketing and connected business tools."
      />
      <section className="section-y-sm">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <article
              key={a.slug}
              className="flex flex-col rounded-3xl border border-line bg-white p-7"
            >
              <p className="preview-kicker">{a.category}</p>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-text">
                <Link href={`/blog/${a.slug}`}>{a.title}</Link>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                {a.intro}
              </p>
              <Link
                href={`/blog/${a.slug}`}
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-8 text-sm font-semibold text-primary"
              >
                Read the guide
                <ArrowUpRight className="size-4" aria-hidden />
                <span className="sr-only">: {a.title}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
