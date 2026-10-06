import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import assert from "node:assert/strict";

await mkdir(".work", { recursive: true });
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const browser = await chromium.launch({
  headless: true,
  ...(existsSync(edge) ? { executablePath: edge } : {}),
});
const results = [];
const siteUrl = process.env.SITE_URL || "http://127.0.0.1:5173";
try {
  for (const width of [375, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(siteUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `.work/hero-${width}.png` });
    // Reveal all sections and force lazy images to load before checking the document.
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      for (const image of document.images) {
        image.loading = "eager";
        await image.decode();
      }
      for (const node of document.querySelectorAll(".reveal"))
        node.classList.add("is-visible");
    });
    await page.waitForTimeout(1000);
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      images: [...document.images].map((image) => ({
        source: image.currentSrc,
        loaded: image.complete && image.naturalWidth > 0,
      })),
      overflow: [...document.querySelectorAll("body *")]
        .filter((node) => {
          if (node.closest(".hero, .transition")) return false;
          const rect = node.getBoundingClientRect();
          return (
            rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1)
          );
        })
        .map((node) => node.className),
    }));
    assert.ok(
      layout.documentWidth <= width,
      `Horizontal overflow at ${width}: ${JSON.stringify(layout)}`,
    );
    assert.ok(
      layout.images.every((image) => image.loaded),
      `Broken image at ${width}`,
    );
    assert.equal(errors.length, 0, `Browser errors: ${errors.join("; ")}`);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.equal(
      axe.violations.length,
      0,
      JSON.stringify(
        axe.violations.map(({ id, nodes }) => ({
          id,
          nodes: nodes.map((node) => node.target),
        })),
        null,
        2,
      ),
    );
    await page.evaluate(() => {
      document.activeElement?.blur();
      scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({ path: `.work/full-${width}.png`, fullPage: true });
    if (width === 375) {
      const toggle = page.locator(".menu-toggle");
      await toggle.click();
      assert.equal(await toggle.getAttribute("aria-expanded"), "true");
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "La noche" })
        .focus();
      await page.keyboard.press("Escape");
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      await toggle.click();
    }
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "La noche" })
      .click();
    await page.waitForTimeout(1200);
    assert.equal(new URL(page.url()).hash, "#la-noche");
    assert.ok(
      await page
        .locator("#la-noche")
        .evaluate(
          (node) => Math.abs(node.getBoundingClientRect().top - 100) < 35,
        ),
      "Anchor offset",
    );
    if (width === 375)
      await page.getByRole("button", { name: "Abrir menú" }).click();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "La causa" })
      .click();
    await page.waitForTimeout(1200);
    assert.equal(new URL(page.url()).hash, "#la-causa");
    await page.locator("#boletos").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Comprar boletos" }).click();
    await page
      .getByRole("status")
      .getByText("La venta de boletos estará disponible próximamente.")
      .waitFor();
    results.push({
      width,
      ...layout,
      errors,
      accessibilityViolations: axe.violations.length,
      interactions: "passed",
    });
    console.log(
      `${width}px: passed responsive, images, accessibility, and interactions.`,
    );
    await context.close();
  }
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
    reducedMotion: "reduce",
  });
  await page.goto(siteUrl, { waitUntil: "networkidle" });
  const motion = await page
    .locator(".hero-background")
    .evaluate((node) => getComputedStyle(node).animationName);
  assert.equal(motion, "none");
  await page.locator("#la-causa").scrollIntoViewIfNeeded();
  assert.equal(
    await page
      .locator(".cause-copy")
      .evaluate((node) => getComputedStyle(node).opacity),
    "1",
  );
  results.push({ reducedMotion: "passed" });
  await writeFile(".work/verification.json", JSON.stringify(results, null, 2));
  console.log(
    "Passed: five responsive widths, local images, no overflow or console errors, anchors, menu, tickets, WCAG AA axe audit, reduced motion.",
  );
} finally {
  await browser.close();
}
