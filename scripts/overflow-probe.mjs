import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });

const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
await context.request.post(`${BASE}/api/auth/login`, {
  data: { email: "admin@nexus.io", password: "demo1234" },
});

async function probe(pageContext, route) {
  const page = await pageContext.newPage();
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const result = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    inner: window.innerWidth,
  }));
  const status = result.doc > result.inner + 2 ? `OVERFLOW ${result.doc}` : "ok";
  console.log(`${route.padEnd(18)} ${status}`);
  await page.close();
}

console.log("--- mobile 390 (authed) ---");
for (const route of ["/overview", "/users", "/analytics", "/data-pipeline", "/access-control"]) {
  await probe(context, route);
}
await context.close();

const anon = await browser.newContext({ viewport: { width: 390, height: 844 } });
console.log("--- mobile 390 (anon) ---");
await probe(anon, "/login");
await probe(anon, "/");
await anon.close();

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await desktop.request.post(`${BASE}/api/auth/login`, {
  data: { email: "admin@nexus.io", password: "demo1234" },
});
console.log("--- desktop 1440 (authed) ---");
for (const route of ["/overview", "/users", "/analytics", "/data-pipeline"]) {
  await probe(desktop, route);
}
await desktop.close();

await browser.close();
