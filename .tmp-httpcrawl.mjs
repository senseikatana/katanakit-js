import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "docs/.vitepress/dist/en/docs";
const ORIGIN = "http://localhost:4173";
const BASE = "/en/docs";
const CONCURRENCY = 24;

/** Every internal URL a user can click, from every built page. */
const urls = new Set();
const html = [];
(function walk(d){ for (const e of readdirSync(d)) { const p = join(d,e); if (statSync(p).isDirectory()) walk(p); else if (p.endsWith(".html")) html.push(p); } })(DIST);

for (const f of html) {
  let page = "/" + relative(DIST, f).replace(/\.html$/, "").replace(/\/index$/, "");
  if (page === "") page = "/";
  urls.add(page);
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/href="(\/[^"#?]*)/g)) {
    let href = m[1];
    if (href.startsWith("//")) continue;
    if (href.startsWith(BASE)) href = href.slice(BASE.length) || "/";
    if (!href || href.startsWith("/assets/")) continue;
    urls.add(href.endsWith("/") && href !== "/" ? href.slice(0, -1) : href);
  }
}

// Legacy URLs that must 301 into the new tree.
for (const legacy of ["/docs/", "/docs/guides/getting-started", "/", "/guides/getting-started", "/changelog", "/api/", "/ui-kit/"]) urls.add(legacy);

const list = [...urls];
console.log(`checking ${list.length} URLs against ${ORIGIN} …`);

const bad = [];
let done = 0;
async function checkOne(path) {
  const res = await fetch(`${ORIGIN}${path}`, { redirect: "follow" });
  if (res.status >= 400) bad.push(`${res.status} ${path} -> ${res.url.replace(ORIGIN, "")}`);
  done++;
}
async function worker(queue) {
  while (queue.length) await checkOne(queue.pop());
}
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker([...list])));

console.log(`checked ${done} URLs | failures: ${bad.length}`);
for (const line of bad.slice(0, 40)) console.log("  ✖", line);
