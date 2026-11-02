import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Service discovery opens the dedicated catalogue page. */
export function ExploreServicesButton({
  children = "Explore Our Services",
}: {
  children?: string;
}) {
  return (
    <Button asChild size="lg" variant="secondary">
      <Link href="/services">{children}</Link>
    </Button>
  );
}
