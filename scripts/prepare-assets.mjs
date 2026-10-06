import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const output = new URL("../public/assets/", import.meta.url);
await mkdir(output, { recursive: true });
const photos = {
  curtains: "fondoCortinasRojas.jpg",
  roses: "fondoRosasRojas.jpg",
  table: "katie-puzatova-w9hsioE2Zc4-unsplash.jpg",
  candles: "klara-kulikova-rYzppyjo4DQ-unsplash.jpg",
  community: "tanya-prodaan-7LVZt5YG69g-unsplash.jpg",
};
const manifest = {};
for (const [name, file] of Object.entries(photos)) {
  const input = fileURLToPath(new URL(`../images/${file}`, import.meta.url));
  const { width, height } = await sharp(input).metadata();
  manifest[name] = { source: file, width, height };
  await Promise.all(
    [640, 960, 1440, 1920].map((size) =>
      sharp(input)
        .rotate()
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(fileURLToPath(new URL(`${name}-${size}.webp`, output))),
    ),
  );
}
// Preserve the original lettering and transparency; trim only empty margins.
await sharp(
  fileURLToPath(new URL("../images/tonightForTomorrow.png", import.meta.url)),
)
  .trim()
  .resize({ width: 1800, withoutEnlargement: true })
  .webp({ quality: 94, alphaQuality: 100 })
  .toFile(fileURLToPath(new URL("tonight-for-tomorrow.webp", output)));
await writeFile(
  new URL("manifest.json", output),
  JSON.stringify(manifest, null, 2),
);
console.log("Six original assets prepared as local WebP images.");
