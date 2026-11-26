// Series thumbnail template ("The Fall of the Mughals"): a dedicated flat-vector scene, three elements only:
// (1) one character with an expressive face and a crisp light-edge outline, (2) one high-stakes symbol or map,
// (3) 2-4 words in Bebas Neue with a dark stroke. Authored at 1920x1080, exported at 3840x2160 (device scale 2).
// Bottom-right 25% stays clear for YouTube's timestamp badge.
import { readFileSync } from "node:fs";
import { character, place } from "../../kit/rig.mjs";

const font = (f) => readFileSync(new URL(`../../fonts/${f}`, import.meta.url)).toString("base64");

export function thumbnailHTML({ bg = ["#1F3A3E", "#2E5A5E"], charKey, pose, over, charX = 640, charY = 1740, charScale = 4.6, symbol = "", words = ["HE TOOK", "EVERYTHING"], wordCol = "#F4EEE2", accent = "#C9A24A", textX = 1060, textY = 70, textSize = 230 }) {
  const fig = charKey ? character(charKey, "th", { pose, over }) : "";
  const rays = Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8, b = a + 0.2; return `<path d="M${charX},420 L${charX + Math.cos(a) * 3000},${420 + Math.sin(a) * 3000} L${charX + Math.cos(b) * 3000},${420 + Math.sin(b) * 3000}Z" fill="${bg[1]}"/>`; }).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"CC Bebas";src:url(data:font/woff2;base64,${font("bebas-neue-latin-400-normal.woff2")}) format("woff2")}
html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:${bg[0]}}
.w{position:absolute;left:${textX}px;font-family:"CC Bebas";font-size:${textSize}px;line-height:0.9;letter-spacing:4px;color:${wordCol};-webkit-text-stroke:5px #1E1A17;paint-order:stroke fill;text-shadow:10px 10px 0 #1E1A17}
.edge *{fill:#F4EEE2 !important;stroke:#F4EEE2 !important;stroke-width:16px !important;stroke-linejoin:round}
</style></head><body>
<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;left:0;top:0">
<rect width="1920" height="1080" fill="${bg[0]}"/>${rays}
${symbol}
${fig ? `<g class="edge">${place(fig.replaceAll('id="', 'data-x="'), "thE", charX, charY, charScale)}</g>${place(fig, "th", charX, charY, charScale)}` : ""}
${arguments[0].front || ""}
</svg>
${words.map((w, i) => `<div class="w" style="top:${textY + i * textSize * 0.92}px;${i === words.length - 1 ? `color:${accent}` : ""}">${w}</div>`).join("")}
</body></html>`;
}
