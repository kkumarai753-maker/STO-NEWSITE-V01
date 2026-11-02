import { TemplateGallery } from "@/components/templates/template-gallery";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/templates");
export default function TemplatesPage() {
  return (
    <div className="pt-[var(--nav-height)]">
      <h1 className="sr-only">Explore Sunrise website templates by industry</h1>
      <TemplateGallery standalone />
    </div>
  );
}
