/**
 * Notify IndexNow search engines (Bing, Yandex, Seznam, Naver…) about changed URLs.
 *
 *   npm run indexnow                       # every URL in the live sitemap
 *   npm run indexnow -- /services /faq     # only these paths
 *
 * Run it after a production deploy that adds or changes pages. The key file
 * public/<key>.txt must be live at https://<host>/<key>.txt for the
 * submission to be accepted. Google does not use IndexNow; it reads the sitemap.
 */
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sunrisetechorigin.com").replace(/\/$/, "");
const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public");
const keyFile = readdirSync(publicDir).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file (32 hex characters + .txt) in public/");
const key = keyFile.replace(".txt", "");

const paths = process.argv.slice(2);
let urlList = paths.map((p) => `${SITE}${p.startsWith("/") ? p : `/${p}`}`);
if (urlList.length === 0) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
if (urlList.length === 0) throw new Error("No URLs to submit");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URL(s), response ${res.status} ${res.statusText}`);
// 200 = accepted, 202 = accepted (key validation pending); 4xx = check the key file is live.
if (res.status >= 400) process.exit(1);
