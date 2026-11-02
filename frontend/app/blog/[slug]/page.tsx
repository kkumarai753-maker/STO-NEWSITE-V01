import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/blog";
import { PageHero } from "@/components/ui/page-hero";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return articles.some((a) => a.slug === slug)
    ? pageMetadata(`/blog/${slug}`)
    : { title: "Article not found" };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <>
      <PageHero
        path={`/blog/${slug}`}
        eyebrow={a.category}
        title={a.title}
        lead={a.intro}
        size="md"
      />
      <article className="container-page max-w-3xl py-12">
        {a.sections.map((s) => (
          <section key={s.title} className="mb-10">
            <h2 className="text-2xl font-semibold text-text">{s.title}</h2>
            <p className="mt-4 text-base leading-8 text-text-muted">{s.body}</p>
          </section>
        ))}
        <div className="mt-12 flex flex-wrap gap-5 border-t border-line pt-7">
          <Link href="/blog" className="text-sm font-medium text-primary">
            ← Back to the notebook
          </Link>
          <Link href="/inquiry" className="text-sm font-medium text-primary">
            Discuss your project →
          </Link>
        </div>
      </article>
    </>
  );
}
