import { llmsFullTxt } from "@/lib/llms";

/** /llms-full.txt: the site's key facts, services and FAQs as clean text. */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
