import { chromium } from "playwright";
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const sources = [
  "bengalasRojo_personas",
  "bengalas_personas",
  "musica1",
  "musica2",
  "musica3",
  "personas",
  "presentadora",
];
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const browser = await chromium.launch({
  headless: true,
  ...(existsSync(edge) ? { executablePath: edge } : {}),
});
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");
const results = [];

try {
  for (const name of sources) {
    const source = new URL(`../images/${name}.jpg`, import.meta.url);
    const destination = new URL(
      `../images/${name}_color_vino.jpg`,
      import.meta.url,
    );
    const original = await readFile(source);
    const { width, height } = await sharp(original).metadata();
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    // Export the approved browser color treatment at the original resolution.
    // Color blending retains the original luminance; no darkening or contrast filter.
    await page.setContent(`<!doctype html><html><head><style>
      *{box-sizing:border-box}html,body{margin:0;padding:0}
      .frame{position:relative;isolation:isolate;width:${width}px;height:${height}px;overflow:hidden}
      img{position:absolute;inset:0;width:100%;height:100%;display:block}
      .color{filter:grayscale(.45) sepia(.08) saturate(.9);mix-blend-mode:color}
      .wine{position:absolute;inset:0;background:#72100f;mix-blend-mode:color;opacity:.16}
      </style></head><body><div class="frame">
      <img src="data:image/jpeg;base64,${original.toString("base64")}" alt="">
      <img class="color" src="data:image/jpeg;base64,${original.toString("base64")}" alt="">
      <span class="wine"></span></div></body></html>`);
    await page.evaluate(async () => {
      for (const image of document.images) await image.decode();
    });
    const rendered = await page.locator(".frame").screenshot({ type: "png" });
    await page.close();
    await sharp(rendered)
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(fileURLToPath(destination));
    const exported = await readFile(destination);
    const info = await sharp(exported).metadata();
    if (info.width !== width || info.height !== height) {
      throw new Error(`${name}: export dimensions differ from the original`);
    }
    if (hash(original) !== hash(await readFile(source))) {
      throw new Error(`${name}: original image changed`);
    }
    const before = await sharp(original)
      .toColourspace("srgb")
      .removeAlpha()
      .raw()
      .toBuffer();
    const after = await sharp(exported)
      .toColourspace("srgb")
      .removeAlpha()
      .raw()
      .toBuffer();
    let totalBefore = 0;
    let totalAfter = 0;
    let absoluteDifference = 0;
    for (let index = 0; index < before.length; index += 3) {
      const a =
        0.3 * before[index] +
        0.59 * before[index + 1] +
        0.11 * before[index + 2];
      const b =
        0.3 * after[index] + 0.59 * after[index + 1] + 0.11 * after[index + 2];
      totalBefore += a;
      totalAfter += b;
      absoluteDifference += Math.abs(a - b);
    }
    const averageChange = (totalAfter - totalBefore) / (width * height);
    const averageAbsoluteDifference = absoluteDifference / (width * height);
    if (Math.abs(averageChange) > 1) {
      throw new Error(
        `${name}: unexpected average luminance change (${averageChange})`,
      );
    }
    results.push({
      source: `${name}.jpg`,
      export: `${name}_color_vino.jpg`,
      width,
      height,
      originalPreserved: true,
      averageLuminanceChange: Number(averageChange.toFixed(3)),
      averageAbsoluteLuminanceDifference: Number(
        averageAbsoluteDifference.toFixed(3),
      ),
    });
    console.log(
      `${name}_color_vino.jpg · ${width}×${height} · color only; original preserved`,
    );
  }
} finally {
  await browser.close();
}
await writeFile(
  new URL("../images/filtro_color_vino.json", import.meta.url),
  JSON.stringify(
    {
      treatment: "Soft wine color only",
      filters: { grayscale: 0.45, sepia: 0.08, saturation: 0.9 },
      wine: { color: "#72100f", opacity: 0.16, blendMode: "color" },
      luminance:
        "Original luminance retained using color blending; no brightness or contrast filter",
      photos: results,
    },
    null,
    2,
  ),
);
