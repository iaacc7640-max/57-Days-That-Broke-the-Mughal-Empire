// Builds the HyperFrames project for Episode 2 from timing.json + the shared kit.
// Usage: node tools/build.mjs   (writes ./hf/index.html, ./hf/compositions/*.html, ./shotlist.json)
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { RUNTIME } from "../../../assets/kit/anim.mjs";
import { FONT_CSS, UI_CSS } from "../../../assets/kit/ui.mjs";
import { r1 } from "./lib.mjs";
import { shotsA } from "./shots-a.mjs";
import { shotsB } from "./shots-b.mjs";

const EP = new URL("..", import.meta.url).pathname, ROOT = new URL("../../..", import.meta.url).pathname, HF = EP + "hf/";
const T = JSON.parse(readFileSync(EP + "timing.json", "utf8"));
const LINE = Object.fromEntries(T.lines.map((l) => [l.id, l]));
const TOTAL = Math.ceil(T.total * 10) / 10;
const ACTS = ["cold", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"];

// ---- collect shots ----
const list = [];
let OFF = 0; // 0 while registering shots (absolute); the act start while building an act (local times)
const S = {
  L: (id) => LINE[id].start - OFF,
  E: (id) => LINE[id].start + LINE[id].duration - OFF,
  add: (act, id, at, type, fn) => list.push({ act, id, at: r1(at), type, fn }),
};
shotsA(S);
shotsB(S);
list.sort((a, b) => a.at - b.at);
list[0].at = 0;
for (let i = 0; i < list.length; i++) list[i].end = i + 1 < list.length ? list[i + 1].at : TOTAL;
// act windows
const actWin = {};
for (const a of ACTS) {
  const sh = list.filter((s) => s.act === a);
  actWin[a] = { start: sh[0].at, end: sh[sh.length - 1].end };
}

mkdirSync(HF + "compositions", { recursive: true });
mkdirSync(HF + "assets/fonts", { recursive: true });
mkdirSync(HF + "assets/vendor", { recursive: true });
mkdirSync(HF + "assets/img", { recursive: true });
mkdirSync(HF + "assets/audio", { recursive: true });
for (const f of ["bebas-neue-latin-400-normal.woff2", "inter-latin-400-normal.woff2", "inter-latin-600-normal.woff2", "inter-latin-800-normal.woff2", "eb-garamond-latin-500-normal.woff2", "eb-garamond-latin-500-italic.woff2", "eb-garamond-latin-600-normal.woff2"]) copyFileSync(ROOT + "assets/fonts/" + f, HF + "assets/fonts/" + f);
copyFileSync(ROOT + "node_modules/gsap/dist/gsap.min.js", HF + "assets/vendor/gsap.min.js");
if (existsSync(EP + "archival/nader-shah-portrait-c1740.jpg")) copyFileSync(EP + "archival/nader-shah-portrait-c1740.jpg", HF + "assets/img/nader-shah-portrait-c1740.jpg");

const SIL_CSS = `.sil *{fill:#2A2622 !important;stroke:#2A2622 !important}`;
const shotRecords = [];
for (const a of ACTS) {
  const w = actWin[a];
  let body = "", js = "";
  OFF = w.start;
  for (const s of list.filter((x) => x.act === a)) {
    const t0 = r1(s.at - w.start), t1 = r1(s.end - w.start), p = `${a}-${s.id}`;
    const res = s.fn({ p, t0, t1, d: t1 - t0 });
    body += `<div id="${p}" class="clip shot" data-start="${t0}" data-duration="${r1(t1 - t0)}" data-track-index="0" data-layout-allow-overflow data-layout-allow-overlap>
<div id="${p}-cam" class="cam">${res.svg}</div><div class="ov" data-layout-allow-overlap>${res.ov || ""}</div></div>\n`;
    js += `/* ${s.id} ${s.type} */\n${res.js}\n`;
    shotRecords.push({ id: s.id, act: a, type: s.type, start: s.at, end: s.end, dur: r1(s.end - s.at) });
  }
  const html = `<template>
<style>
${FONT_CSS}
#root{position:absolute;inset:0;background:#E9DCC0;overflow:hidden}
${UI_CSS}
${SIL_CSS}
</style>
<div id="root" data-composition-id="${a}" data-width="1920" data-height="1080">
${body}</div>
<script>
${RUNTIME}
(function(){
var tl = gsap.timeline({ paused: true });
${js}
window.__timelines["${a}"] = tl;
})();
</script>
</template>`;
  writeFileSync(HF + `compositions/${a}.html`, html);
}

// ---- root index ----
const hosts = ACTS.map((a, i) => `      <div id="${a}" data-composition-id="${a}" data-composition-src="compositions/${a}.html" data-start="${actWin[a].start}" data-duration="${r1(actWin[a].end - actWin[a].start)}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>`).join("\n");
const index = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>57 Days That Broke the Mughal Empire</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
${FONT_CSS}
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #E9DCC0; }
      #main { position: absolute; inset: 0; }
      #fx { position: absolute; inset: 0; pointer-events: none; z-index: 50; }
      #grain { position: absolute; left: -200px; top: -200px; width: 2320px; height: 1480px; background-image: url("assets/grain.png"); background-repeat: repeat; opacity: 0.035; }
      #vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(20,16,14,0) 62%, rgba(20,16,14,0.12) 100%); }
    </style>
  </head>
  <body>
    <div id="main" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="1920" data-height="1080">
${hosts}
      <div id="fx" data-composition-id="fx" data-composition-src="compositions/fx.html" data-start="0" data-duration="${TOTAL}" data-track-index="2" data-track-kind="graphics" data-width="1920" data-height="1080"></div>
      <audio id="mix" class="clip" src="assets/audio/mix.wav" data-start="0" data-duration="${TOTAL}" data-track-index="3" data-volume="1"></audio>
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
writeFileSync(HF + "index.html", index);
writeFileSync(HF + "compositions/fx.html", `<template>
<style>
#root{position:absolute;inset:0;pointer-events:none;z-index:50}
#fx-grain{position:absolute;left:-200px;top:-200px;width:2320px;height:1480px;background-image:url("assets/grain.png");background-repeat:repeat;opacity:0.035}
#fx-vig{position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(20,16,14,0) 62%, rgba(20,16,14,0.12) 100%)}
</style>
<div id="root" data-composition-id="fx" data-width="1920" data-height="1080">
  <div id="fx-layer" class="clip" data-start="0" data-duration="${TOTAL}" data-track-index="0" data-layout-ignore><div id="fx-grain"></div><div id="fx-vig"></div></div>
</div>
<script>
(function(){
  var tl = gsap.timeline({ paused: true });
  // grain: jumps to a new seeded offset every 1/15 s, driven by the timeline (never CSS animation)
  var g = document.getElementById("fx-grain"), o = { v: 0 };
  function put(t){ var f = Math.floor(t * 15), x = ((f * 7919) % 197) - 98, y = ((f * 104729) % 193) - 96; g.style.transform = "translate(" + x + "px," + y + "px)"; }
  put(0);
  tl.fromTo(o, { v: 0 }, { v: ${TOTAL}, duration: ${TOTAL}, ease: "none", onUpdate: function(){ put(o.v); } }, 0);
  window.__timelines["fx"] = tl;
})();
</script>
</template>`);
writeFileSync(HF + "hyperframes.json", JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry", paths: { blocks: "compositions", components: "compositions/components", assets: "assets" }, media: { autoProxy: true }, authoringSkill: "hyperframes" }, null, 2));
writeFileSync(HF + "meta.json", JSON.stringify({ name: "ep02-nadir-shah", title: "57 Days That Broke the Mughal Empire" }, null, 2));
writeFileSync(EP + "shotlist.json", JSON.stringify({ total: TOTAL, acts: actWin, shots: shotRecords }, null, 1));
const long = shotRecords.filter((s) => s.dur > 12 || s.dur < 1.2);
console.log(`shots ${shotRecords.length}, total ${TOTAL}s`, long.length ? "CHECK: " + JSON.stringify(long) : "all shots 1.2–12 s");
