// Captures the screenshots the upgrade page and the README show. Run it on demand, never
// in the build:
//
//   npm run screenshots -- --pro ../adminkit-pro   PRO pages -> public/img/screenshots/pro/
//   npm run screenshots -- --free                  this dashboard -> .github/screenshots/
//
// For each checkout it runs `vite build` there (its dependencies must be installed),
// serves dist/ on a free port and captures every shot in light and dark mode at 1440×900
// with devicePixelRatio 2, with reduced motion so cards, numbers and charts show their
// final state. sharp writes WebP at quality 80, at most 1600 pixels wide; the PRO shots
// also get an 800 pixel wide copy for srcset. The browser is Playwright's Chromium
// (npx playwright install chromium).
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, relative, resolve, sep } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const viewport = { width: 1440, height: 900 };
const quality = 80;
const modes = ["light", "dark"];

const editions = {
  pro: {
    output: join(root, "public/img/screenshots/pro"),
    widths: [1600, 800],
    shots: [
      { name: "analytics", page: "index.html" },
      { name: "ecommerce", page: "dashboard-ecommerce.html" },
      { name: "crm", page: "dashboard-crm.html" },
      { name: "crypto", page: "dashboard-crypto.html" },
      { name: "ai-usage", page: "dashboard-ai.html" },
      { name: "ai-chat", page: "pages-chat-ai.html" },
      { name: "calendar", page: "calendar.html" },
      { name: "datatables", page: "tables-datatables-responsive.html" },
      {
        name: "settings",
        page: "index.html",
        async prepare(page) {
          await page.locator(".settings-toggle").click();
          await page.locator("#settings-panel.show").waitFor();
        },
      },
    ],
  },
  free: {
    output: join(root, ".github/screenshots"),
    widths: [1600],
    shots: [{ name: "dashboard", page: "index.html" }],
  },
};

const display = (file) => relative(root, file).split(sep).join("/");

const parseArgs = (args) => {
  const runs = [];
  for (let i = 0; i < args.length; i++) {
    const edition = args[i].match(/^--([a-z]+)$/)?.[1];
    if (!(edition in editions)) {
      throw new Error(
        `Unknown option ${args[i]}; use --pro <checkout> or --free`
      );
    }
    const next = args[i + 1];
    const checkout = next && !next.startsWith("--") ? args[++i] : null;
    if (!checkout && edition !== "free") {
      throw new Error(`--${edition} needs the path of a checkout`);
    }
    runs.push({ edition, checkout: checkout ? resolve(checkout) : root });
  }
  if (!runs.length) {
    throw new Error(
      "Name what to capture: npm run screenshots -- --pro ../adminkit-pro, or --free"
    );
  }
  return runs;
};

const build = (checkout) =>
  new Promise((done, fail) => {
    const vite = join(checkout, "node_modules/vite/bin/vite.js");
    if (!existsSync(vite)) {
      fail(
        new Error(`${checkout} has no node_modules; run npm ci there first`)
      );
      return;
    }
    const child = spawn(
      process.execPath,
      [vite, "build", "--logLevel", "warn"],
      {
        cwd: checkout,
        stdio: "inherit",
      }
    );
    child.on("error", fail);
    child.on("exit", (code) =>
      code === 0 ? done() : fail(new Error(`vite build failed in ${checkout}`))
    );
  });

const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

const serve = (directory) =>
  new Promise((listening) => {
    const server = createServer(async (request, response) => {
      const path = decodeURIComponent(
        new URL(request.url, "http://x").pathname
      );
      const file = join(
        directory,
        normalize(path.endsWith("/") ? `${path}index.html` : path)
      );
      try {
        const body = await readFile(file);
        response.writeHead(200, {
          "content-type": types[extname(file)] ?? "application/octet-stream",
        });
        response.end(body);
      } catch {
        response.writeHead(404);
        response.end();
      }
    });
    server.listen(0, "127.0.0.1", () => listening(server));
  });

const capture = async (browser, base, { output, widths, shots }) => {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  const written = [];

  for (const mode of modes) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 2,
      colorScheme: mode,
      reducedMotion: "reduce",
    });
    // The stored color mode wins over the system one; "visited" keeps the PRO settings
    // panel from opening by itself
    await context.addInitScript((colorMode) => {
      localStorage.setItem("adminkit_config_colorMode", colorMode);
      localStorage.setItem("adminkit_config_visited", "true");
    }, mode);
    const page = await context.newPage();

    for (const shot of shots) {
      await page.goto(`${base}/${shot.page}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page
        .locator('[aria-busy="true"]')
        .first()
        .waitFor({ state: "detached", timeout: 5000 })
        .catch(() => {});
      await shot.prepare?.(page);
      // Charts, the reveal fade and offcanvas transitions settle
      await page.waitForTimeout(1200);
      const png = await page.screenshot();

      for (const width of widths) {
        const suffix = width === widths[0] ? "" : `-${width}`;
        const file = join(output, `${shot.name}-${mode}${suffix}.webp`);
        await writeFile(
          file,
          await sharp(png)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality })
            .toBuffer()
        );
        written.push(file);
      }
    }
    await context.close();
  }
  return written;
};

const runs = parseArgs(process.argv.slice(2));
const browser = await chromium.launch();
try {
  for (const { edition, checkout } of runs) {
    console.log(`Building ${checkout}`);
    await build(checkout);
    const server = await serve(join(checkout, "dist"));
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
      const files = await capture(browser, base, editions[edition]);
      let total = 0;
      for (const file of files) {
        const { size } = await stat(file);
        total += size;
        console.log(`${display(file)}  ${(size / 1024).toFixed(0)} KB`);
      }
      console.log(
        `${edition}: ${files.length} files, ${(total / 1024).toFixed(0)} KB`
      );
    } finally {
      server.close();
    }
  }
} finally {
  await browser.close();
}
