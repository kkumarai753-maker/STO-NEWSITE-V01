import { brandIcons, type BrandIconSlug } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";

/** Monochrome brand glyph from simple-icons path data. Decorative by default. */
export function BrandIcon({
  slug,
  className,
  colored = false,
  title,
}: {
  slug: BrandIconSlug;
  className?: string;
  /** Use the brand's own colour instead of currentColor. */
  colored?: boolean;
  title?: string;
}) {
  const icon = brandIcons[slug];
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", className)}
      fill={colored ? `#${icon.hex}` : "currentColor"}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={icon.path} />
    </svg>
  );
}
