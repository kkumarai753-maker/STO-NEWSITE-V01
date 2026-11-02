import Image from "next/image";
import { LogoFull } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { careerArtwork, type CareerRole } from "@/lib/careers";
/** Original role-family artwork with Sunrise’s approved identity in selectable HTML. */
export function RoleArtwork({ role }: { role: CareerRole }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white">
      <Image
        src={careerArtwork(role)}
        alt={`${role.function} work illustration`}
        width={800}
        height={600}
        className="aspect-[4/3] w-full object-contain"
      />
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-4">
        <LogoFull className="h-12 w-auto" />
        <div className="text-xs leading-6 text-text-muted">
          <p>{siteConfig.contact.email}</p>
          <p>{siteConfig.contact.phone}</p>
        </div>
      </div>
    </div>
  );
}
