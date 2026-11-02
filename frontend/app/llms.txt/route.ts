import { llmsTxt } from "@/lib/llms";

/** /llms.txt: Markdown index of the site for AI assistants, generated at build time. */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
