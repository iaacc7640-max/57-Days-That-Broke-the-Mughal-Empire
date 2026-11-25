// Episode 2 thumbnails (A/B) from the series template; exported at 3840x2160 + 320x180 previews.
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { thumbnailHTML } from "../../../assets/series/mughals/thumbnail.mjs";
import { peacockThrone, cart, kohinoor } from "../../../assets/kit/props.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const EP = new URL("..", import.meta.url).pathname;
const throne = (x, y, s, tilt) => `<g transform="translate(${x},${y}) scale(${s})"><g transform="translate(0,0)">${cart("tc")}</g><g transform="translate(-10,-150) rotate(${tilt})">${peacockThrone("tp")}</g></g>`;
const gem = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})">${kohinoor("tg").replace('id="tg-spark" transform="rotate(0) scale(1)"', 'id="tg-spark" transform="rotate(20) scale(1.5)"')}</g>`;
const pose = { armL: [10, 8], armR: [-150, -25] };
const variants = {
  a: { bg: ["#1F3A3E", "#27494D"], words: ["HE TOOK", "EVERYTHING"], accent: "#E3B54A", sym: throne(1330, 760, 0.66, -9), textSize: 190 },
  b: { bg: ["#4A1E1A", "#5E2620"], words: ["DELHI", "FELL"], accent: "#E3B54A", sym: throne(1330, 760, 0.66, 8), textSize: 205 },
};
const b = await chromium.launch();
for (const [k, v] of Object.entries(variants)) {
  // the gem sits in Nadir's raised gauntlet; drawn after the figure so it reads first
  const html = thumbnailHTML({ bg: v.bg, charKey: "nadirShah", pose, over: { brows: "stern" }, charX: 560, charY: 1700, charScale: 3.9, symbol: v.sym, words: v.words, accent: v.accent, textX: 1010, textY: 40, textSize: v.textSize || 230 })
    .replace("</svg>", gem(905, 250, 1.25) + "</svg>");
  writeFileSync(EP + `tools/thumb-${k}.html`, html);
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  await p.setContent(html, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: EP + `thumbnail-${k}.png` });
  await p.close();
  const q = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 / 6 });
  await q.setContent(html, { waitUntil: "load" });
  await q.evaluate(() => document.fonts.ready);
  await q.screenshot({ path: EP + `thumbnail-${k}-320.png` });
  await q.close();
}
await b.close();
console.log("thumbs done");
