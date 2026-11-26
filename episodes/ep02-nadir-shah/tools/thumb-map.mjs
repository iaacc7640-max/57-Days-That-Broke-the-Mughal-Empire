// Episode 2 thumbnail in the channel's map style (reference: the earlier series' "France Almost Won India" thumbnail).
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { mapThumbnailHTML } from "../../../assets/series/mughals/thumbnail-map.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const EP = new URL("..", import.meta.url).pathname;
const html = mapThumbnailHTML({ at: [870, 575], zoom: 1.02, textSize: 146, figure: { key: "nadirShah", over: { prop: "gem", brows: "stern" }, pose: { armL: [10, 8], armR: [-152, -22] }, x: 1520, y: 1170, scale: 2.25 } });
writeFileSync(EP + "tools/thumb-map.html", html);
const b = await chromium.launch();
for (const [dsf, out] of [[2, "thumbnail-map.png"], [1 / 6, "thumbnail-map-320.png"], [1 / 1.5, "thumbnail-map-1280.png"]]) {
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: dsf });
  await p.setContent(html, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: EP + out });
  await p.close();
}
await b.close();
console.log("map thumbnail done");
