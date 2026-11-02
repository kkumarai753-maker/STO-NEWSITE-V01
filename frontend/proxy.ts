import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin";

/** AI crawlers and assistant fetchers worth recording (search, live fetch and training). */
const AI_AGENT = /GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|CCBot/;
/** Visitors arriving from AI assistants (referrer header or utm_source tag). */
const AI_SOURCE = /chatgpt\.com|chat\.openai\.com|claude\.ai|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com/;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return adminGate(request, pathname, search);

  logAiTraffic(request, pathname);
  return NextResponse.next();
}

/**
 * Optimistic admin check: no session cookie → straight to the login page.
 * The cookie is only verified with the backend in the pages themselves
 * (lib/server/admin-session.ts), so this never touches the database.
 */
function adminGate(request: NextRequest, pathname: string, search: string) {
  if (pathname === "/admin/login" || request.cookies.has(ADMIN_COOKIE)) return NextResponse.next();

  const url = new URL("/admin/login", request.url);
  if (pathname !== "/admin") url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

/**
 * One JSON line per AI crawler hit or AI-referred visit, visible in the host's
 * runtime logs (Vercel → Logs, filter "ai-traffic"). Observation only: the
 * response is never blocked or changed.
 */
function logAiTraffic(request: NextRequest, path: string) {
  const ua = request.headers.get("user-agent") ?? "";
  const referer = request.headers.get("referer") ?? "";
  const utm = request.nextUrl.searchParams.get("utm_source") ?? "";
  const agent = ua.match(AI_AGENT)?.[0];
  const source = (referer.match(AI_SOURCE) ?? utm.match(AI_SOURCE))?.[0];
  if (!agent && !source) return;
  console.log(
    JSON.stringify({
      event: "ai-traffic",
      kind: agent ? "crawler" : "referral",
      agent: agent ?? null,
      source: source ?? null,
      path,
      at: new Date().toISOString(),
    }),
  );
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    // Matcher values must be literals (statically analysed at build time).
    {
      source: "/((?!_next/static|_next/image).*)",
      has: [{ type: "header", key: "user-agent", value: ".*(GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|CCBot).*" }],
    },
    {
      source: "/((?!_next/static|_next/image).*)",
      has: [{ type: "header", key: "referer", value: ".*(chatgpt\\.com|chat\\.openai\\.com|claude\\.ai|perplexity\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com).*" }],
    },
    {
      source: "/((?!_next/static|_next/image).*)",
      has: [{ type: "query", key: "utm_source", value: ".*(chatgpt\\.com|chat\\.openai\\.com|claude\\.ai|perplexity\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com).*" }],
    },
  ],
};
