// Series thumbnail template, "map" style (matches the channel's earlier series look):
// muted map of the subcontinent behind, 3 lines of heavy outlined type on the left (last line gold),
// a gold date ribbon, and one ruler on the right raising his period symbol with a crisp light-edge outline.
// Flat vector, hard shadows only (no blur), authored at 1920x1080, exported at 3840x2160.
import { readFileSync } from "node:fs";
import { character, place } from "../../kit/rig.mjs";
import * as M from "../../kit/map.mjs";

const font = (f) => readFileSync(new URL(`../../fonts/${f}`, import.meta.url)).toString("base64");
const INK = "#2B2622";

export function mapThumbnailHTML({
  lines = [{ text: "57 DAYS" }, { text: "THAT BROKE" }, { text: "THE MUGHALS", gold: true }],
  ribbon = "1738 – 1739",
  focus = "delhi", at = [900, 520], zoom = 1.35,
  regions = { persiaEdge: "#6E9E98", mughal1707: "#5F8253" },
  route = ["kandahar", "ghazni", "kabul", "peshawar", "lahore", "karnal", "delhi"], routeCol = "#2E5A5E",
  dots = ["kabul", "lahore", "karnal"], star = "delhi",
  figure = { key: "nadirShah", over: { prop: "gem", brows: "stern" }, pose: { armL: [10, 8], armR: [-152, -22] }, x: 1330, y: 1180, scale: 2.4 },
  textSize = 150, textX = 58, textY = 36,
} = {}) {
  const [fx, fy] = M.city(focus);
  const tx = at[0] - fx * zoom, ty = at[1] - fy * zoom;
  let grat = "";
  for (let lon = 50; lon <= 110; lon += 5) grat += `<path d="M${M.P(lon, 0).join(",")} L${M.P(lon, 45).join(",")}" stroke="#AFC0BA" stroke-width="1.5" fill="none"/>`;
  for (let lat = 0; lat <= 45; lat += 5) { let d = ""; for (let lon = 50; lon <= 110; lon += 2.5) d += (d ? "L" : "M") + M.P(lon, lat).join(","); grat += `<path d="${d}" stroke="#AFC0BA" stroke-width="1.5" fill="none"/>`; }
  const fills = Object.entries(regions).map(([k, c]) => `<path d="${M.regionD(k)}" fill="${c}" stroke="#F1E6CE" stroke-width="3" stroke-linejoin="round"/>`).join("");
  const routeD = M.routeD(route);
  const last = M.city(route[route.length - 1]), prev = M.city(route[route.length - 2]);
  const ang = (Math.atan2(last[1] - prev[1], last[0] - prev[0]) * 180) / Math.PI;
  const dotSvg = dots.map((k) => { const [x, y] = M.city(k); return `<circle cx="${x}" cy="${y}" r="9" fill="#3E5878" stroke="#F1E6CE" stroke-width="3"/>`; }).join("");
  const [sx, sy] = M.city(star);
  const starPath = Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 9 : 22, a = -Math.PI / 2 + (i * Math.PI) / 5; return `${(sx + r * Math.cos(a)).toFixed(1)},${(sy + r * Math.sin(a)).toFixed(1)}`; }).join(" ");
  const map = `<g transform="translate(${tx.toFixed(1)},${ty.toFixed(1)}) scale(${zoom})">
    <rect x="-2000" y="-2000" width="6000" height="6000" fill="#9FB3AD"/>${grat}
    <defs><clipPath id="land"><path d="${M.landD}"/></clipPath></defs>
    <path d="${M.landD}" fill="#E2D3B4"/>
    <g clip-path="url(#land)">${fills}</g>
    <path d="${M.landD}" fill="none" stroke="#F1E6CE" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="${M.riverD("indus")}" fill="none" stroke="#7E9C98" stroke-width="3"/><path d="${M.riverD("ganga")}" fill="none" stroke="#7E9C98" stroke-width="3"/>
    <path d="${routeD}" fill="none" stroke="#F1E6CE" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${routeD}" fill="none" stroke="${routeCol}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="26 14"/>
    <g transform="translate(${last[0]},${last[1]}) rotate(${ang.toFixed(1)})"><path d="M-6,-26 L34,0 L-6,26 L4,0Z" fill="${routeCol}" stroke="#F1E6CE" stroke-width="4" stroke-linejoin="round"/></g>
    ${dotSvg}<polygon points="${starPath}" fill="#3E5878" stroke="#F1E6CE" stroke-width="3"/>
  </g>`;
  const fig = figure ? character(figure.key, "tf", { pose: figure.pose, over: figure.over }) : "";
  const figSvg = fig ? `<g class="edge">${place(fig.replaceAll('id="', 'data-x="'), "tfE", figure.x, figure.y, figure.scale)}</g>${place(fig, "tf", figure.x, figure.y, figure.scale)}` : "";
  const lh = textSize * 1.02;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"CC Archivo";src:url(data:font/woff2;base64,${font("archivo-black-latin-400-normal.woff2")}) format("woff2")}
@font-face{font-family:"CC Garamond";src:url(data:font/woff2;base64,${font("eb-garamond-latin-600-normal.woff2")}) format("woff2");font-weight:600}
html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#9FB3AD}
.t{position:absolute;left:${textX}px;font-family:"CC Archivo";font-size:${textSize}px;line-height:1;letter-spacing:1px;color:#F6EFE2;-webkit-text-stroke:14px ${INK};paint-order:stroke fill;text-shadow:7px 9px 0 rgba(43,38,34,0.55);white-space:nowrap}
.g{color:#D9A63A}
.rib{position:absolute;left:${textX + 46}px;top:${textY + lh * lines.length + 52}px;height:104px}
.edge *{fill:#F4EEE2 !important;stroke:#F4EEE2 !important;stroke-width:18px !important;stroke-linejoin:round}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 55% 45%, rgba(20,16,14,0) 60%, rgba(20,16,14,0.12) 100%)}
</style></head><body>
<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;left:0;top:0">${map}${figSvg}</svg>
<div class="vig"></div>
${lines.map((l, i) => `<div class="t${l.gold ? " g" : ""}" style="top:${textY + i * lh}px">${l.text}</div>`).join("")}
<svg class="rib" viewBox="0 0 640 104" width="640" height="104">
  <path d="M0,22 L96,22 L96,96 L0,96 L36,59Z" fill="#A9822F" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M640,22 L544,22 L544,96 L640,96 L604,59Z" fill="#A9822F" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <rect x="70" y="4" width="500" height="84" fill="#D9A63A" stroke="${INK}" stroke-width="3"/>
  <rect x="78" y="12" width="484" height="68" fill="none" stroke="#F1E0B0" stroke-width="2"/>
  <text x="320" y="64" text-anchor="middle" font-family="CC Garamond" font-weight="600" font-size="56" fill="${INK}">${ribbon}</text>
</svg>
</body></html>`;
}
