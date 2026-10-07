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
  "event-sparklers-red": "bengalasRojo_personas_color_vino.jpg",
  "event-sparklers": "bengalas_personas_color_vino.jpg",
  "event-sparklers-amber-05": "bengalas_personas_ambar_05.jpg",
  "event-music-1": "musica1_color_vino.jpg",
  "event-music-2": "musica2_color_vino.jpg",
  "event-music-3": "musica3_color_vino.jpg",
  "event-community": "personas_color_vino.jpg",
  "event-presenter": "presentadora_color_vino.jpg",
  "cause-celebration": "IMG_0006.jpg",
  "manifesto-sparklers": "bengala002.jpeg",
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
// Use the supplied star artwork throughout the page, preserving its transparency.
for (const variant of [1, 2, 3]) {
  await sharp(
    fileURLToPath(new URL(`../images/estrella${variant}.png`, import.meta.url)),
  )
    .trim()
    .resize({
      width: 256,
      height: 256,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ lossless: true })
    .toFile(fileURLToPath(new URL(`star-${variant}.webp`, output)));
}
await sharp(fileURLToPath(new URL("../images/estrella2.png", import.meta.url)))
  .trim()
  .resize({ width: 48, height: 48, fit: "contain", background: "#40110b" })
  .extend({ top: 8, bottom: 8, left: 8, right: 8, background: "#40110b" })
  .flatten({ background: "#40110b" })
  .png()
  .toFile(fileURLToPath(new URL("../public/favicon.png", import.meta.url)));
// Trim empty margins while retaining the official artwork and transparency.
for (const [name, source, width] of [
  ["logo-tec", "logo_Tec.png", 600],
  ["logo-lideres", "logo_lideres.png", 400],
]) {
  const info = await sharp(
    fileURLToPath(new URL(`../images/${source}`, import.meta.url)),
  )
    .trim()
    .resize({ width, withoutEnlargement: true })
    .webp({ lossless: true })
    .toFile(fileURLToPath(new URL(`${name}.webp`, output)));
  manifest[name] = { source, width: info.width, height: info.height };
}
await writeFile(
  new URL("manifest.json", output),
  JSON.stringify(manifest, null, 2),
);
console.log(
  "Assets prepared, including past-event photos, amber 05, supplied stars, official logos, and favicon.",
);
