import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const OUT = process.env.AUDIT_OUT ?? "C:/Users/Admin/AppData/Local/Temp/opencode/shots";

const ROUTES = [
  ["/", "landing"],
  ["/login", "login"],
  ["/overview", "overview"],
  ["/users", "users"],
  ["/analytics", "analytics"],
  ["/data-pipeline", "pipeline"],
  ["/access-control", "access-control"],
  ["/access-denied", "access-denied"],
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const THEMES = ["light", "dark"];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const issues = [];

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });

  const login = await context.request.post(`${BASE}/api/auth/login`, {
    data: { email: "admin@nexus.io", password: "demo1234" },
  });
  if (!login.ok()) issues.push(`login failed: ${login.status()}`);

  for (const theme of THEMES) {
    await context.addInitScript((value) => {
      window.localStorage.setItem("nexus-hub:ui:v1", JSON.stringify({ theme: value }));
    }, theme);

    for (const [route, slug] of ROUTES) {
      const page = await context.newPage();
      const errors = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text().slice(0, 220));
      });
      page.on("pageerror", (error) => errors.push(String(error).slice(0, 220)));

      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(600);

      const file = `${OUT}/${slug}-${viewport.name}-${theme}.png`;
      await page.screenshot({ path: file, fullPage: true });

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        return docWidth > window.innerWidth + 2 ? docWidth : 0;
      });
      if (overflow) issues.push(`${slug} ${viewport.name}/${theme}: horizontal overflow ${overflow}px`);
      for (const error of errors) issues.push(`${slug} ${viewport.name}/${theme}: console ${error}`);

      await page.close();
    }
  }

  await context.close();
}

await browser.close();

console.log(issues.length ? issues.join("\n") : "NO ISSUES DETECTED");
console.log(`screenshots -> ${OUT}`);
