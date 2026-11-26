// Episode 2 thumbnails v2 (A/B) from the series template; 3840x2160 + 320x180 previews.
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { thumbnailHTML } from "../../../assets/series/mughals/thumbnail.mjs";
import { peacockThrone, cart, handWithGem } from "../../../assets/kit/props.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const EP = new URL("..", import.meta.url).pathname;
const INK = "#2B2622";
// B: a bigger, brighter Peacock Throne on its cart, on a flat pale disc (no glow), kept below the words
const throneB = `<circle cx="1190" cy="700" r="250" fill="#F3D58A"/><circle cx="1190" cy="700" r="250" fill="none" stroke="${INK}" stroke-width="4"/>
  <g transform="translate(1190,880) scale(0.72)"><g>${cart("tc")}</g><g transform="translate(-10,-150) rotate(6)">${peacockThrone("tp").replaceAll("#C9A24A", "#E3B54A").replaceAll("#9C7A2E", "#C9A24A")}</g></g>`;
// the gauntlet's fingers wrap the Kohinoor (rising from the bottom edge, in front of Nadir)
const gripB = `<g transform="translate(860,760) rotate(-8) scale(1.05)">${handWithGem("hgb").replace('id="hgb-kn-spark" transform="rotate(0) scale(1)"', 'id="hgb-kn-spark" transform="rotate(20) scale(1.6)"')}</g>`;
// A: flat Delhi skyline with flat smoke shapes; the Kohinoor close-up in a gripping gauntlet
let sky = "";
for (let i = 0; i < 16; i++) { const x = -40 + i * 125, h = 120 + ((i * 53) % 140); sky += `<rect x="${x}" y="${820 - h}" width="112" height="${h + 300}" fill="#7A3A2E" stroke="${INK}" stroke-width="3"/>`; if (i % 3 === 0) sky += `<path d="M${x},${820 - h} C${x},${760 - h} ${x + 112},${760 - h} ${x + 112},${820 - h}Z" fill="#C9B79A" stroke="${INK}" stroke-width="3"/>`; }
const puff = (x, y, k) => [[0, 0, 70], [60, -50, 60], [-40, -90, 55], [30, -150, 65], [-10, -230, 58], [50, -290, 50]].map(([dx, dy, r]) => `<circle cx="${x + dx * k}" cy="${y + dy * k}" r="${r * k}" fill="#5A504A" stroke="${INK}" stroke-width="3"/>`).join("");
const smoke = puff(300, 600, 1.1) + puff(1080, 560, 1.0) + puff(1640, 620, 0.9);
const skylineA = `<rect x="0" y="0" width="1920" height="1080" fill="#D98A4E"/><rect x="0" y="0" width="1920" height="360" fill="#C7703E"/>${smoke}${sky}<rect x="0" y="900" width="1920" height="180" fill="#5A2A22"/>`;
const gripA = `<g transform="translate(520,640) scale(2.1)">${handWithGem("hga").replace('id="hga-kn-spark" transform="rotate(0) scale(1)"', 'id="hga-kn-spark" transform="rotate(20) scale(1.6)"')}</g>`;
const variants = {
  a: { html: thumbnailHTML({ bg: ["#D98A4E", "#D98A4E"], charKey: null, symbol: skylineA, front: gripA, words: ["DELHI", "FELL"], accent: "#F3D58A", textX: 1060, textY: 70, textSize: 260, charX: -2000 }) },
  b: { html: thumbnailHTML({ bg: ["#4A1E1A", "#5E2620"], charKey: "nadirShah", pose: { armL: [10, 8], armR: [-10, -8] }, over: { brows: "stern" }, charX: 520, charY: 1760, charScale: 3.9, symbol: throneB, front: gripB, words: ["DELHI", "FELL"], accent: "#E3B54A", textX: 1040, textY: 40, textSize: 180 }) },
};
const b = await chromium.launch();
for (const [k, v] of Object.entries(variants)) {
  writeFileSync(EP + `tools/thumb-${k}.html`, v.html);
  for (const [dsf, out] of [[2, `thumbnail-${k}.png`], [1 / 6, `thumbnail-${k}-320.png`]]) {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: dsf });
    await p.setContent(v.html, { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: EP + out });
    await p.close();
  }
}
await b.close();
console.log("thumbs v2 done");
