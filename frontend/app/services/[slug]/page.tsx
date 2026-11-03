import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  serviceCategories,
  getServiceCategory,
  serviceId,
} from "@/data/service-categories";
import { PageHero } from "@/components/ui/page-hero";
import { PageSchema } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams() {
  return serviceCategories.map((c) => ({ slug: c.id }));
}
export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  if (!getServiceCategory(slug)) notFound();
  return pageMetadata(`/services/${slug}`, { ownImage: true });
}
export default async function CategoryPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const c = getServiceCategory(slug);
  if (!c) notFound();
  return (
    <>
      <PageSchema path={`/services/${c.id}`} />
      <PageHero
        path={`/services/${c.id}`}
        eyebrow="Our services"
        title={c.name}
        lead={c.description}
      />
      <section className="section-y-sm">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <Image
              src={c.image}
              alt={c.imageAlt}
              width={640}
              height={800}
              className="w-full rounded-3xl object-contain"
            />
            <Link href="/services" className="mt-6 inline-block underline">
              All service categories
            </Link>
          </div>
          <div>
            <h2 className="text-heading-2">Services in {c.name}</h2>
            <ol className="mt-6 space-y-3">
              {c.items.map((name, i) => (
                <li
                  key={name}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5"
                >
                  <h3 className="max-w-lg font-semibold">
                    <span className="mr-3 text-primary">{i + 1}.</span>
                    {name}
                  </h3>
                  <Link
                    className="rounded-full bg-primary px-5 py-3 text-sm text-white"
                    href={`/build-your-proposal?category=${c.id}&service=${serviceId(c.id, i)}`}
                  >
                    Select service<span className="sr-only">: {name}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link
              href={`/build-your-proposal?category=${c.id}`}
              className="mt-8 inline-block rounded-full bg-primary px-6 py-4 font-semibold text-white"
            >
              Build Your Proposal
            </Link>
            <p className="mt-4 text-sm text-text-muted">
              Choose the services you need. Scope and pricing are confirmed in a
              written quotation.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
