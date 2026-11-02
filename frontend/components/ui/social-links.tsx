import { Globe, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { BrandIcon } from "@/components/ui/brand-icon";
import { cn } from "@/lib/utils";

/** Official brand/contact destinations, with crisp icons and keyboard labels. */
export function SocialLinks({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <ul
      aria-label="Sunrise social profiles and contact links"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {siteConfig.socials
        .filter((social) => social.href)
        .map((social) => {
          const email = social.icon === "email";
          const iconClass = size === "sm" ? "size-4" : "size-[1.125rem]";
          return (
            <li key={social.label}>
              <a
                href={social.href}
                target={email ? undefined : "_blank"}
                rel={email ? undefined : "noopener noreferrer"}
                title={social.label}
                aria-label={
                  email
                    ? `Email ${siteConfig.name}`
                    : `${siteConfig.name}: ${social.label} (opens in a new tab)`
                }
                className={cn(
                  "grid min-h-11 min-w-11 place-items-center rounded-full border border-line bg-tint/4 text-text-muted transition-[background-color,border-color,color,transform] duration-[250ms] hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus motion-reduce:transform-none motion-reduce:transition-none",
                  size === "sm" ? "size-11" : "size-12",
                )}
              >
                {social.icon === "website" ? (
                  <Globe className={iconClass} aria-hidden />
                ) : social.icon === "email" ? (
                  <Mail className={iconClass} aria-hidden />
                ) : (
                  <BrandIcon slug={social.icon} className={iconClass} />
                )}
              </a>
            </li>
          );
        })}
    </ul>
  );
}
