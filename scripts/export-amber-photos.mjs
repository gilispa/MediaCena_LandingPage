import { chromium } from "playwright";
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const variants = [
  {
    id: "05",
    name: "Ámbar profundo",
    saturation: 0.85,
    red: "0.01 0.14 0.56 0.90 1",
    green: "0.025 0.19 0.43 0.70 0.96",
    blue: "0.07 0.24 0.21 0.30 0.58",
    gradeOpacity: 1,
    tint: "#cb8d28",
    opacity: 0.18,
  },
  {
    id: "06",
    name: "Luz cálida equilibrada",
    saturation: 0.85,
    red: "0 0.20 0.52 0.82 1",
    green: "0.015 0.18 0.43 0.71 0.98",
    blue: "0.03 0.14 0.29 0.49 0.80",
    gradeOpacity: 0.45,
    tint: "#daa347",
    opacity: 0.035,
  },
];
const source = new URL("../images/bengalas_personas.jpg", import.meta.url);
const original = await readFile(source);
const { width, height } = await sharp(original).metadata();
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const browser = await chromium.launch({
  headless: true,
  ...(existsSync(edge) ? { executablePath: edge } : {}),
});
const results = [];

try {
  for (const variant of variants) {
    const filename = `bengalas_personas_ambar_${variant.id}.jpg`;
    const destination = new URL(`../images/${filename}`, import.meta.url);
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    // Export the selected color grades while retaining the source luminance.
    // The preview's brightness, contrast and vignette are intentionally omitted.
    await page.setContent(`<!doctype html><html><head><style>
      *{box-sizing:border-box}html,body{margin:0;padding:0}
      .frame{position:relative;isolation:isolate;width:${width}px;height:${height}px;overflow:hidden}
      img{position:absolute;inset:0;width:100%;height:100%;display:block}
      .grade{filter:url(#amber);opacity:${variant.gradeOpacity};mix-blend-mode:color}
      .tint{position:absolute;inset:0;background:${variant.tint};opacity:${variant.opacity};mix-blend-mode:color}
      .defs{position:absolute;width:0;height:0;overflow:hidden}
      </style></head><body>
      <svg class="defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
        <filter id="amber" color-interpolation-filters="sRGB">
          <feColorMatrix type="saturate" values="${variant.saturation}"/>
          <feComponentTransfer>
            <feFuncR type="table" tableValues="${variant.red}"/>
            <feFuncG type="table" tableValues="${variant.green}"/>
            <feFuncB type="table" tableValues="${variant.blue}"/>
          </feComponentTransfer>
        </filter>
      </defs></svg>
      <div class="frame">
        <img src="data:image/jpeg;base64,${original.toString("base64")}" alt="">
        <img class="grade" src="data:image/jpeg;base64,${original.toString("base64")}" alt="">
        <span class="tint"></span>
      </div></body></html>`);
    await page.evaluate(async () => {
      for (const img of document.images) await img.decode();
    });
    const rendered = await page.locator(".frame").screenshot({ type: "png" });
    await page.close();
    await sharp(rendered)
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(fileURLToPath(destination));
    const exported = await readFile(destination);
    const info = await sharp(exported).metadata();
    if (info.width !== width || info.height !== height) {
      throw new Error(`${filename}: incorrect output dimensions`);
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
    let luminanceDifference = 0;
    for (let index = 0; index < before.length; index += 3) {
      luminanceDifference +=
        0.3 * (after[index] - before[index]) +
        0.59 * (after[index + 1] - before[index + 1]) +
        0.11 * (after[index + 2] - before[index + 2]);
    }
    const averageLuminanceChange = luminanceDifference / (width * height);
    if (Math.abs(averageLuminanceChange) > 1) {
      throw new Error(`${filename}: unexpected luminance change`);
    }
    results.push({
      filename,
      name: variant.name,
      width,
      height,
      colorOnly: true,
      averageLuminanceChange: Number(averageLuminanceChange.toFixed(3)),
    });
    console.log(`${filename} · ${width}×${height} · color only`);
  }
} finally {
  await browser.close();
}
if (hash(original) !== hash(await readFile(source))) {
  throw new Error("Original photo changed");
}
await writeFile(
  new URL("../.work/bengalas-ambar/exports.json", import.meta.url),
  JSON.stringify(
    {
      source: "bengalas_personas.jpg",
      originalPreserved: true,
      photos: results,
    },
    null,
    2,
  ),
);
