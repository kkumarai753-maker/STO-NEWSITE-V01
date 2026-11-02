import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/brand-icon";
import { cn } from "@/lib/utils";

/** Social profile links from config. Works in Server and Client Components. */
export function SocialLinks({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {siteConfig.socials.filter((social) => social.href).map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${siteConfig.name} on ${social.label} (opens in a new tab)`}
            className={cn(
              "grid place-items-center rounded-full border border-line bg-tint/4 text-text-muted transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white hover:shadow-(--shadow-primary)",
              size === "sm" ? "size-9" : "size-10",
            )}
          >
            <BrandIcon slug={social.icon} className={size === "sm" ? "size-3.5" : "size-4"} />
          </a>
        </li>
      ))}
    </ul>
  );
}
