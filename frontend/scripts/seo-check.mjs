/**
 * SEO and AI-visibility checks against a running site.
 *
 *   node scripts/seo-check.mjs [baseUrl] [--canonical-origin=https://sunrisetechorigin.com]
 *
 * Reads /sitemap.xml and fetches every page as a browser, search crawlers and
 * AI crawlers, then checks: 200 status and identical text for every user agent
 * (no cloaking), one <h1>, title and description present, unique and in range,
 * canonical and og:url pointing at the page itself, indexability, JSON-LD that
 * parses, FAQPage answers that are visible on the page, Open Graph images and
 * internal links that resolve, and robots.txt / llms.txt sanity.
 * Exits 1 when any error is found; warnings don't fail the run.
 */
import { createHash } from "node:crypto";

const args = process.argv.slice(2);
const BASE = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const ORIGIN = (args.find((a) => a.startsWith("--canonical-origin="))?.split("=")[1] ?? BASE).replace(/\/$/, "");

const USER_AGENTS = {
  Browser: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  Bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  "OAI-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
  "ChatGPT-User": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
  "Claude-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-SearchBot/1.0; +Claude-SearchBot@anthropic.com)",
  "Claude-User": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +Claude-User@anthropic.com)",
  PerplexityBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
};

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const decode = (s = "") =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));

const text = (html) =>
  decode(
    (html.split(/<body[^>]*>/i)[1] ?? html)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

const meta = (head, re) => decode(head.match(re)?.[1]);

async function get(path, ua = USER_AGENTS.Browser) {
  const res = await fetch(BASE + path, { headers: { "user-agent": ua }, redirect: "manual" });
  return { status: res.status, headers: res.headers, body: await res.text() };
}

// 1. robots.txt and sitemap
const robots = await get("/robots.txt");
if (robots.status !== 200) fail(`robots.txt returned ${robots.status}`);
if (/Disallow:\s*\/\s*$/m.test(robots.body.split(/User-Agent:\s*\*/i)[1] ?? "")) fail("robots.txt disallows everything for *");
if (!/Sitemap:/i.test(robots.body)) fail("robots.txt has no Sitemap line");
for (const bot of ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot"]) {
  if (!robots.body.includes(`User-Agent: ${bot}`)) warn(`robots.txt has no explicit group for ${bot}`);
}

const sitemap = await get("/sitemap.xml");
if (sitemap.status !== 200) fail(`sitemap.xml returned ${sitemap.status}`);
const entries = [...sitemap.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1],
  lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
}));
if (entries.length === 0) fail("sitemap.xml lists no URLs");
const paths = entries.map((e) => {
  if (!e.loc?.startsWith(ORIGIN)) fail(`sitemap URL not on ${ORIGIN}: ${e.loc}`);
  if (!e.lastmod) warn(`sitemap URL without lastmod: ${e.loc}`);
  return e.loc.slice(ORIGIN.length) || "/";
});

const llms = await get("/llms.txt");
if (llms.status !== 200) warn(`llms.txt returned ${llms.status}`);
else if (!llms.body.startsWith("# ")) warn("llms.txt does not start with an H1");

// 2. Every sitemap page, as every user agent
const seen = { title: new Map(), description: new Map() };
const links = new Set();
const images = new Set();

for (const path of paths) {
  const url = ORIGIN + (path === "/" ? "" : path);
  const hashes = new Set();
  let page;
  for (const [name, ua] of Object.entries(USER_AGENTS)) {
    const r = await get(path, ua);
    if (r.status !== 200) fail(`${path} returned ${r.status} for ${name}`);
    hashes.add(createHash("sha1").update(text(r.body)).digest("hex"));
    if (name === "Browser") page = r;
  }
  if (hashes.size > 1) fail(`${path} serves different text to different user agents`);

  const html = page.body;
  const head = html.split(/<\/head>/i)[0];
  const title = meta(head, /<title>([^<]*)<\/title>/i);
  const description = meta(head, /<meta name="description" content="([^"]*)"/i);
  const canonical = meta(head, /<link rel="canonical" href="([^"]*)"/i);
  const robotsMeta = meta(head, /<meta name="robots" content="([^"]*)"/i);
  const ogUrl = meta(head, /<meta property="og:url" content="([^"]*)"/i);
  const ogImage = meta(head, /<meta property="og:image" content="([^"]*)"/i);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];

  if (!title) fail(`${path}: missing <title>`);
  else if (title.length > 65 || title.length < 25) warn(`${path}: title is ${title.length} chars: "${title}"`);
  if (!description) fail(`${path}: missing meta description`);
  else if (description.length > 165 || description.length < 110)
    warn(`${path}: description is ${description.length} chars`);
  if (canonical !== url) fail(`${path}: canonical ${canonical} ≠ ${url}`);
  if (ogUrl !== url) fail(`${path}: og:url ${ogUrl} ≠ ${url}`);
  if (!ogImage) fail(`${path}: no og:image`);
  else images.add(ogImage);
  if (robotsMeta && /noindex/.test(robotsMeta)) fail(`${path} is in the sitemap but noindex`);
  if (page.headers.get("x-robots-tag")?.includes("noindex")) fail(`${path} sends X-Robots-Tag noindex`);
  if (h1s.length !== 1) fail(`${path}: ${h1s.length} <h1> elements`);

  for (const [key, value] of [["title", title], ["description", description]]) {
    if (!value) continue;
    seen[key].set(value, [...(seen[key].get(value) ?? []), path]);
  }

  // JSON-LD: parses, and FAQ answers are visible on the page
  const visible = text(html);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch {
      fail(`${path}: JSON-LD does not parse`);
      continue;
    }
    const nodes = data["@graph"] ?? [data];
    for (const node of nodes) {
      if (!node["@type"]) fail(`${path}: JSON-LD node without @type`);
      if (node["@type"] === "FAQPage") {
        for (const q of node.mainEntity ?? []) {
          if (!visible.includes(q.name)) fail(`${path}: FAQ question not visible: "${q.name}"`);
          if (!visible.includes(q.acceptedAnswer?.text)) fail(`${path}: FAQ answer not visible for "${q.name}"`);
        }
      }
    }
  }

  for (const m of html.matchAll(/<a\b[^>]*href="([^"#]+)/gi)) {
    const href = decode(m[1]);
    if (href.startsWith("/") && !href.startsWith("//")) links.add(href.split("#")[0]);
  }
}

for (const [key, map] of Object.entries(seen)) {
  for (const [value, ps] of map) if (ps.length > 1) fail(`duplicate ${key} on ${ps.join(", ")}: "${value}"`);
}

// 3. Internal links and Open Graph images resolve
for (const href of links) {
  const r = await fetch(BASE + href, { redirect: "manual" });
  if (r.status >= 400) fail(`broken internal link ${href} (${r.status})`);
  else if (r.status >= 300) warn(`internal link redirects: ${href} → ${r.headers.get("location")}`);
}
for (const img of images) {
  const r = await fetch(img.replace(ORIGIN, BASE));
  if (r.status !== 200 || !r.headers.get("content-type")?.startsWith("image/")) fail(`OG image failed: ${img} (${r.status})`);
}

console.log(`Checked ${paths.length} sitemap pages × ${Object.keys(USER_AGENTS).length} user agents, ${links.size} internal links, ${images.size} OG images.`);
for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(errors.length ? `\n${errors.length} error(s)` : "\nNo errors.");
process.exit(errors.length ? 1 : 0);
