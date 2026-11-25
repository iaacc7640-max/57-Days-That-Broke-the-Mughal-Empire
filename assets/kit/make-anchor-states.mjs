import { writeFileSync, readFileSync } from "node:fs";
import { anchorMapSVG, REGIONS, CITIES } from "./map.mjs";
const R = new URL("../../", import.meta.url).pathname;
const colours = JSON.parse(readFileSync(R + "assets/series/mughals/series-colours.json", "utf8"));
const P = colours.powers;
writeFileSync(R + "assets/series/mughals/anchor-map.svg", anchorMapSVG({ colours, state: { persiaEdge: P.persia.fill + "8C", mughal1707: P.mughal.fill } }));
const states = {
  "_about": "Anchor-map states for 'The Fall of the Mughals'. Region keys refer to REGIONS in assets/kit/map.mjs (simplified polygons, lon/lat). Each episode's first map beat opens on the previous episode's end state, then saves its own end state here.",
  "_order": ["base_1707", "ep01", "ep02"],
  "base_1707": { "label": "India at Aurangzeb's death, 1707", "regions": { "persiaEdge": { "fill": P.persia.fill, "op": 0.55 }, "mughal1707": { "fill": P.mughal.fill } }, "pins": [], "flags": [] },
  "ep01": { "label": "NOT YET BUILT. Episode 2 (released first) assumed Episode 1 ends on base_1707 plus a crimson Company pin at Calcutta.", "assumed": true, "regions": { "persiaEdge": { "fill": P.persia.fill, "op": 0.55 }, "mughal1707": { "fill": P.mughal.fill } }, "flags": [{ "id": "company", "city": "calcutta" }] },
  "ep02": { "label": "After Nadir Shah, May 1739: lands west of the Indus (incl. Kabul) to Persia; Hyderabad, Bengal and Awadh run their own affairs; Marathas expanding; Company pin at Calcutta.", "regions": { "persiaEdge": { "fill": P.persia.fill, "op": 0.55 }, "mughal1707": { "fill": P.mughal.fill }, "westOfIndus": { "fill": P.persia.fill }, "hyderabad": { "fill": P.hyderabad.fill, "op": 0.85 }, "bengal": { "fill": P.bengal.fill, "op": 0.85 }, "awadh": { "fill": P.awadh.fill, "op": 0.85 }, "maratha": { "fill": P.marathas.fill, "op": 0.85 } }, "flags": [{ "id": "company", "city": "calcutta" }], "markers": [{ "id": "panipat", "city": "panipat" }] },
};
writeFileSync(R + "assets/series/mughals/anchor-states.json", JSON.stringify(states, null, 2));
console.log("anchor ok", Object.keys(REGIONS).length, "regions", Object.keys(CITIES).length, "cities");
