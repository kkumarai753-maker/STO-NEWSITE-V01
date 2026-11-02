import { notFound } from "next/navigation";
import { templates } from "@/data/templates";
import { DemoWebsite } from "@/components/templates/demo-website";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return templates.some((t) => t.slug === slug)
    ? pageMetadata(`/templates/${slug}`)
    : { title: "Template not found" };
}
export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = templates.find((t) => t.slug === slug);
  if (!template) notFound();
  return <DemoWebsite template={template} />;
}
