// ClearCut History — series anchor map for "The Fall of the Mughals".
// Coastlines: Natural Earth via npm world-atlas (land-50m) + topojson-client + d3-geo.
// Historical borders: hand-drawn simplified polygons in lon/lat (MAP SIMPLIFIED).
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoConicConformal, geoPath } from "d3-geo";

const require = createRequire(import.meta.url);
const land50 = JSON.parse(readFileSync(require.resolve("world-atlas/land-50m.json"), "utf8"));
const land = feature(land50, land50.objects.land);
const countries50 = JSON.parse(readFileSync(require.resolve("world-atlas/countries-50m.json"), "utf8"));
const countries = feature(countries50, countries50.objects.countries).features;
// Afsharid Persia shown with real modern borders of Iran and Afghanistan (Natural Earth); Mughal-held Kabul/Ghazni sit on top
const persiaFeature = { type: "FeatureCollection", features: countries.filter((f) => ["364", "004"].includes(String(f.id))) };

export const W = 1920, H = 1080;
// Frame: Persia's eastern edge to Bengal, Kashmir to Cape Comorin.
const frame = { type: "Feature", geometry: { type: "MultiPoint", coordinates: [[58.5, 6.5], [97.5, 6.5], [97.5, 38.2], [58.5, 38.2], [78, 38.6], [78, 6.2]] } };
export const projection = geoConicConformal().parallels([12, 32]).rotate([-79, 0]).fitExtent([[40, 20], [W - 40, H - 20]], frame);
const clipped = geoConicConformal().parallels([12, 32]).rotate([-79, 0]).scale(projection.scale()).translate(projection.translate()).clipExtent([[-300, -300], [W + 300, H + 300]]);
const path = geoPath(clipped).digits(1);
export const P = (lon, lat) => projection([lon, lat]).map((v) => Math.round(v * 10) / 10);
export const landD = path(land);
export const persiaD = path(persiaFeature);

const ring = (pts) => "M" + pts.map(([a, b]) => P(a, b).join(",")).join("L") + "Z";
const line = (pts) => "M" + pts.map(([a, b]) => P(a, b).join(",")).join("L");

// Simplified historical polygons (lon, lat). They may run into the sea: fills are clipped to land.
export const REGIONS = {
  // Mughal Empire at Aurangzeb's death, 1707 (simplified)
  mughal1707: [[68.2, 36.4], [71.4, 36.6], [73.6, 35.6], [75.6, 35.0], [77.4, 32.8], [78.9, 31.0], [80.6, 30.2], [83.6, 27.9], [86.6, 27.2], [88.4, 26.9], [89.9, 26.3], [91.2, 25.6], [92.6, 25.3], [92.9, 22.6], [92.4, 20.6], [88.5, 20.4], [86.4, 19.2], [84.6, 17.6], [82.4, 16.2], [80.6, 13.4], [80.2, 11.6], [78.6, 11.9], [77.2, 12.4], [76.0, 13.4], [74.9, 14.6], [73.2, 15.6], [71.6, 18.6], [70.6, 20.6], [67.8, 22.6], [66.2, 24.4], [66.4, 26.8], [67.4, 28.6], [66.9, 30.4], [67.2, 31.9], [67.6, 33.0], [67.4, 34.4], [67.7, 35.4]],
  // Lands west of the Indus ceded to Nadir Shah in 1739 (simplified)
  westOfIndus: [[68.2, 36.4], [71.4, 36.6], [72.6, 35.4], [72.3, 34.0], [71.6, 33.2], [71.0, 31.8], [70.6, 30.2], [70.3, 28.9], [69.0, 27.8], [68.3, 26.4], [68.4, 25.3], [67.6, 24.0], [66.2, 24.4], [66.4, 26.8], [67.4, 28.6], [66.9, 30.4], [67.2, 31.9], [67.6, 33.0], [67.4, 34.4], [67.7, 35.4]],
  // Persia's (Afsharid) eastern lands at the frame edge, for context
  persiaEdge: [[58.5, 38.2], [66.0, 38.2], [68.2, 36.4], [68.0, 35.0], [68.8, 33.4], [67.6, 32.2], [66.6, 30.6], [67.4, 28.6], [66.4, 26.8], [66.2, 24.4], [64.0, 23.0], [58.5, 23.0]],
  // Hyderabad (Nizam-ul-Mulk, from 1724), simplified
  hyderabad: [[73.6, 21.2], [76.8, 21.7], [80.6, 21.9], [82.6, 19.4], [81.4, 17.2], [80.2, 13.6], [78.4, 12.6], [77.0, 12.8], [75.6, 14.4], [74.4, 15.6], [73.9, 17.6], [73.5, 19.6]],
  // Bengal, Bihar and Orissa under the Nawabs, simplified
  bengal: [[83.3, 27.4], [86.6, 27.2], [88.4, 26.9], [89.9, 26.3], [91.2, 25.6], [92.6, 25.3], [92.9, 22.6], [92.4, 20.6], [88.5, 20.4], [86.6, 19.5], [85.2, 20.4], [84.2, 21.6], [83.4, 24.2], [82.9, 25.6]],
  // Awadh under Saadat Khan, simplified
  awadh: [[79.2, 28.7], [80.6, 28.9], [82.6, 28.0], [83.9, 27.3], [83.4, 25.9], [82.3, 25.1], [80.8, 25.5], [79.6, 26.3], [79.0, 27.6]],
  // Punjab province, simplified
  punjab: [[72.3, 34.0], [74.4, 33.6], [75.9, 32.6], [77.0, 31.4], [76.4, 30.0], [74.2, 29.6], [72.2, 29.0], [70.3, 28.9], [70.6, 30.2], [71.0, 31.8], [71.6, 33.2]],
  // Maratha heartland, 1737, simplified
  maratha: [[72.8, 21.4], [75.6, 22.6], [78.0, 22.8], [78.6, 21.0], [77.2, 19.6], [76.0, 17.2], [74.6, 15.9], [73.4, 16.0], [72.6, 18.8]],
};
export const RIVERS = {
  indus: [[77.6, 34.9], [75.8, 35.6], [74.4, 35.7], [73.0, 35.1], [72.6, 34.6], [72.2, 33.9], [71.6, 32.9], [71.0, 31.8], [70.6, 30.2], [70.4, 28.9], [69.6, 28.2], [68.9, 27.7], [68.2, 26.4], [68.4, 25.4], [67.9, 24.6], [67.5, 24.0]],
  ganga: [[78.2, 30.0], [78.6, 28.4], [79.8, 27.0], [80.9, 26.0], [82.6, 25.3], [84.6, 25.6], [86.6, 25.3], [87.9, 24.6], [88.4, 23.2], [88.3, 22.2]],
  yamuna: [[77.6, 30.4], [77.2, 29.0], [77.3, 28.0], [78.0, 27.2], [79.4, 26.4], [80.9, 25.7], [81.9, 25.4]],
};
export const CITIES = JSON.parse(readFileSync(new URL("../maps/places.json", import.meta.url), "utf8"));
delete CITIES._about;
const _OLD_CITIES = {
  delhi: [77.21, 28.66], karnal: [76.99, 29.69], lahore: [74.34, 31.55], kabul: [69.17, 34.53], ghazni: [68.42, 33.55],
  kandahar: [65.71, 31.62], peshawar: [71.57, 34.01], calcutta: [88.36, 22.57], murshidabad: [88.27, 24.18],
  hyderabad: [78.47, 17.38], faizabad: [82.13, 26.78], pune: [73.86, 18.52], panipat: [76.97, 29.39], attock: [72.36, 33.89],
};
export const city = (k) => P(...CITIES[k]);
export const regionD = (k) => (k === "persiaEdge" ? persiaD : ring(REGIONS[k]));
export const riverD = (k) => line(RIVERS[k]);
export const routeD = (keys) => "M" + keys.map((k) => city(k).join(",")).join("L");

// Static anchor map (India, 1707, Mughal green) as a standalone SVG with region ids.
export function anchorMapSVG({ colours, prefix = "am", state = null } = {}) {
  const c = colours.powers, b = colours.base;
  const st = state || { mughal1707: c.mughal.fill };
  const fills = Object.entries(st).map(([k, col]) => `<path id="${prefix}-r-${k}" d="${regionD(k)}" fill="${col}" stroke="none"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><clipPath id="${prefix}-landclip"><path d="${landD}"/></clipPath></defs>
<rect width="${W}" height="${H}" fill="${b.sea}"/>
<path d="${landD}" fill="${b.paper}" stroke="${b.ink}" stroke-width="2.5" stroke-linejoin="round"/>
<g clip-path="url(#${prefix}-landclip)">${fills}</g>
<path d="${regionD("mughal1707")}" fill="none" stroke="${b.gold}" stroke-width="3" stroke-linejoin="round"/>
<path d="${landD}" fill="none" stroke="${b.ink}" stroke-width="2.5" stroke-linejoin="round"/>
${Object.keys(RIVERS).map((r) => `<path d="${riverD(r)}" fill="none" stroke="${b.sea}" stroke-width="3" stroke-linecap="round"/>`).join("")}
</svg>`;
}
