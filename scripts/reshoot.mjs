import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";
const OUT = "C:/Users/Admin/AppData/Local/Temp/opencode/shots";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

const shots = [
  { route: "/login", slug: "login", auth: false, viewport: { width: 1440, height: 900 }, theme: "light" },
  { route: "/login", slug: "login", auth: false, viewport: { width: 390, height: 844 }, theme: "light" },
  { route: "/users", slug: "users", auth: true, viewport: { width: 1440, height: 900 }, theme: "light" },
  { route: "/analytics", slug: "analytics", auth: true, viewport: { width: 390, height: 844 }, theme: "light" },
  { route: "/overview", slug: "overview", auth: true, viewport: { width: 390, height: 844 }, theme: "light" },
  { route: "/data-pipeline", slug: "pipeline", auth: true, viewport: { width: 1440, height: 900 }, theme: "light" },
  { route: "/users", slug: "users", auth: true, viewport: { width: 1440, height: 900 }, theme: "dark" },
  { route: "/access-control", slug: "access", auth: true, viewport: { width: 1440, height: 900 }, theme: "dark" },
];

for (const shot of shots) {
  const context = await browser.newContext({ viewport: shot.viewport });
  if (shot.auth) {
    const res = await context.request.post(`${BASE}/api/auth/login`, {
      data: { email: "admin@nexus.io", password: "demo1234" },
    });
    if (!res.ok()) console.log(`login failed ${shot.slug}`);
  }
  await context.addInitScript((theme) => {
    window.localStorage.setItem("nexus-hub:ui:v1", JSON.stringify({ theme }));
  }, shot.theme);

  const page = await context.newPage();
  await page.goto(`${BASE}${shot.route}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(700);

  const vp = `${shot.viewport.width}${shot.viewport.width < 500 ? "-m" : "-d"}`;
  await page.screenshot({ path: `${OUT}/v2-${shot.slug}-${vp}-${shot.theme}.png`, fullPage: true });
  await context.close();
}

await browser.close();
console.log("done");
