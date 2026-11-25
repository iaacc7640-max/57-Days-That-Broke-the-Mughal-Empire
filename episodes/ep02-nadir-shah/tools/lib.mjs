// Shared shot-building helpers for Episode 2 (generates HyperFrames scene markup + timeline code).
import { readFileSync } from "node:fs";
import { character, place, spec, INK, symPersianSoldier, symMughalSoldier, symMusician, symCamelGun, symHorseRider, symCitizen } from "../../../assets/kit/rig.mjs";
import * as M from "../../../assets/kit/map.mjs";

export const COL = JSON.parse(readFileSync(new URL("../../../assets/series/mughals/series-colours.json", import.meta.url), "utf8"));
export const PW = COL.powers;
export const r1 = (v) => Math.round(v * 1000) / 1000;
export const j = (v) => JSON.stringify(v);

// A character instance: svg markup + idle code (breathe + blink) for [t0,t1].
export function actor(p, key, x, y, s, { pose, over, flip = false, sil = false, idle = true, seed = 1 } = {}, t0 = 0, t1 = 10) {
  const svg = `<g${sil ? ' class="sil"' : ""}>${place(character(key, p, { pose, over }), p, x, y, s, flip)}</g>`;
  const js = idle ? `CC.breathe(tl,'${p}',${r1(t0)},${r1(t1)});CC.blink(tl,'${p}',${r1(t0)},${r1(t1)},${seed});` : "";
  return { svg, js };
}
export const talk = (p, a, b, seed = 5) => `CC.talk(tl,'${p}',${r1(a)},${r1(b)},${seed});`;
export const rot = (id, keys, ease) => `CC.track(tl,'${id}','rot',${j(keys.map((k) => [r1(k[0]), k[1], k[2]].filter((v) => v !== undefined)))}${ease ? `,'${ease}'` : ""});`;
export const tr = (id, keys, ease) => `CC.track(tl,'${id}','tr',${j(keys.map((k) => [r1(k[0]), k[1], k[2]].filter((v) => v !== undefined)))}${ease ? `,'${ease}'` : ""});`;
export const mv = (id, keys, ease) => `CC.track(tl,'${id}','mv',${j(keys.map((k) => [r1(k[0]), k[1], k[2]].filter((v) => v !== undefined)))}${ease ? `,'${ease}'` : ""});`;
export const cam = (id, t0, t1, a, b, ease) => `CC.cam(tl,'${id}',${r1(t0)},${r1(t1)},${j(a)},${j(b)}${ease ? `,'${ease}'` : ""});`;
export const camTo = (px, py, s) => [s, Math.round((960 - px) * s), Math.round((540 - py) * s)];
export const wipe = (id, a, b) => `CC.wipe(tl,'${id}',${r1(a)}${b != null ? "," + r1(b) : ""});`;
export const stampIn = (id, t, rotDeg) => `CC.stampIn(tl,'${id}',${r1(t)}${rotDeg != null ? "," + rotDeg : ""});`;
export const popIn = (id, t, from) => `CC.popIn(tl,'${id}',${r1(t)}${from ? "," + j(from) : ""});`;
export const draw = (id, t, d, ease) => `CC.draw(tl,'${id}',${r1(t)},${r1(d)}${ease ? `,'${ease}'` : ""});`;
// parallax pan: layers move by factor * dx over [t0,t1]
export function parallax(p, t0, t1, dx, f = { sky: 0.1, far: 0.3, mid: 0.6, ground: 1, front: 1.3 }) {
  return Object.entries(f).map(([k, v]) => mv(`${p}-${k}`, [[t0, [0, 0]], [t1, [Math.round(-dx * v), 0]]], "none")).join("");
}

export function symbols(p) {
  return `<defs>${symPersianSoldier(p + "-sp")}${symMughalSoldier(p + "-sm")}${symMusician(p + "-mu", "drum")}${symMusician(p + "-mv", "veena")}${symCamelGun(p + "-cg")}${symHorseRider(p + "-hr")}${symHorseRider(p + "-hp", "#1E1A17")}${symCitizen(p + "-ct", "#2E2A26")}</defs>`;
}
// rows of <use> figures; returns svg + ids
export function rows(p, sym, rowsSpec) {
  let svg = "", ids = [], rowIds = [];
  rowsSpec.forEach((r, ri) => {
    const rid = `${p}-row${ri}`; rowIds.push(rid);
    svg += `<g transform="translate(0,${r.y}) scale(${r.s})"><g id="${rid}" transform="translate(0,0)">`;
    for (let i = 0; i < r.n; i++) {
      const id = `${p}-r${ri}u${i}`; ids.push(id);
      svg += `<use id="${id}" href="#${r.sym || sym}" x="${Math.round((r.x0 + i * r.dx + ((i * 37 + ri * 13) % 11) - 5) / r.s)}" y="0"/>`;
    }
    svg += `</g></g>`;
  });
  return { svg, ids, rowIds };
}
export const crowd = (ids, t0, t1, amp = 6, period = 0.6, seed = 3) => `CC.crowd(tl,${j(ids)},${r1(t0)},${r1(t1)},${amp},${period},${seed});`;

// --------------- maps ---------------
const PAPER = COL.base.paper, SEA = COL.base.sea, GOLD = COL.base.gold;
export function mapSVG(p, o = {}) {
  const regions = o.regions || {};
  let defs = `<clipPath id="${p}-land"><path d="${M.landD}"/></clipPath>`;
  let fills = "";
  for (const [k, v] of Object.entries(regions)) {
    if (v.wipe) {
      defs += `<clipPath id="${p}-wc-${k}"><rect id="${p}-wr-${k}" x="0" y="0" width="${v.wipe ? 0 : 1920}" height="1080"/></clipPath>`;
      fills += `<g clip-path="url(#${p}-wc-${k})"><path id="${p}-rg-${k}" d="${M.regionD(v.shape || k)}" fill="${v.fill}" opacity="${v.op ?? 1}"/></g>`;
    } else fills += `<path id="${p}-rg-${k}" d="${M.regionD(v.shape || k)}" fill="${v.fill}" opacity="${v.op ?? 1}"/>`;
  }
  let borders = (o.borders || []).map((k) => `<path d="${M.regionD(k)}" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="10 7" stroke-linejoin="round"/>`).join("");
  const rivers = Object.keys(M.RIVERS).map((r) => `<path id="${p}-rv-${r}" d="${M.riverD(r)}" fill="none" stroke="${o.indus && r === "indus" ? "#1F5F8C" : SEA}" stroke-width="${o.indus && r === "indus" ? 7 : 3.5}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
  let extra = "";
  // arrows (routes): dashed path drawn on via a mask; arrow head + moving icon
  for (const a of o.arrows || []) {
    const d = a.d || (a.cities ? M.routeD(a.cities) : "M" + a.pts.map((q) => M.P(...q).join(",")).join("L"));
    defs += `<mask id="${p}-mk-${a.id}" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><path id="${p}-ar-${a.id}" d="${d}" fill="none" stroke="#fff" stroke-width="${(a.w || 12) + 30}" stroke-linecap="round" stroke-linejoin="round"/></mask>`;
    extra += `<g mask="url(#${p}-mk-${a.id})"><path d="${d}" fill="none" stroke="${INK}" stroke-width="${(a.w || 12) + 6}" stroke-linecap="round" stroke-linejoin="round" ${a.dash === false ? "" : 'stroke-dasharray="26 16"'}/><path d="${d}" fill="none" stroke="${a.col}" stroke-width="${a.w || 12}" stroke-linecap="round" stroke-linejoin="round" ${a.dash === false ? "" : 'stroke-dasharray="26 16"'}/></g>`;
    extra += `<g id="${p}-ic-${a.id}" transform="translate(-200,-200)" opacity="1"><circle r="20" fill="${a.col}" stroke="${INK}" stroke-width="3"/>${a.icon === "flag" ? "" : `<path d="M-8,8 L-8,-12 L10,-6 L-8,0" fill="#F4EEE2" stroke="${INK}" stroke-width="2"/>`}</g>`;
    extra += `<path id="${p}-tp-${a.id}" d="${d}" fill="none" stroke="none"/>`;
  }
  for (const m of o.markers || []) {
    const [x, y] = m.city ? M.city(m.city) : M.P(...m.ll);
    extra += `<g transform="translate(${x},${y})"><circle id="${p}-pu-${m.id}" r="10" fill="none" stroke="${m.col || "#A8322D"}" stroke-width="6" opacity="0"/><circle r="11" fill="${m.col || "#A8322D"}" stroke="${INK}" stroke-width="3"/></g>`;
  }
  for (const pin of o.pins || []) {
    const [x, y] = pin.city ? M.city(pin.city) : M.P(...pin.ll);
    const dx = pin.side === "l" ? -18 : 18, anchor = pin.side === "l" ? "end" : "start";
    extra += `<g transform="translate(${x},${y})"><g id="${p}-pin-${pin.id}" opacity="${pin.t == null ? 1 : 0}">
      <path d="M0,0 C-14,-20 -16,-30 -16,-38 A16,16 0 1 1 16,-38 C16,-30 14,-20 0,0Z" fill="${pin.col || INK}" stroke="${INK}" stroke-width="2.5"/><circle cx="0" cy="-38" r="6" fill="${PAPER}"/>
      <text x="${dx}" y="${pin.dy ?? -40}" text-anchor="${anchor}" font-family="CC Inter" font-weight="800" font-size="${pin.size || 38}" fill="${INK}" stroke="${PAPER}" stroke-width="9" paint-order="stroke" stroke-linejoin="round">${pin.label}</text></g></g>`;
  }
  for (const f of o.flags || []) {
    const [x, y] = M.city(f.city);
    extra += `<g transform="translate(${x},${y}) scale(${f.s || 1})"><g id="${p}-fl-${f.id}" opacity="${f.op ?? 1}"><path d="M0,0 L0,-64" stroke="${INK}" stroke-width="5"/><rect x="0" y="-64" width="50" height="32" fill="#F4EEE2" stroke="${INK}" stroke-width="2.5"/>${[0, 1, 2, 3].map((k) => `<rect x="0" y="${-64 + k * 8}" width="50" height="4" fill="${PW.company.fill}"/>`).join("")}<rect x="0" y="-64" width="20" height="14" fill="#F4EEE2" stroke="${INK}" stroke-width="1.5"/><path d="M10,-64 L10,-50 M0,-57 L20,-57" stroke="${PW.company.fill}" stroke-width="3"/><rect x="0" y="-64" width="50" height="32" fill="none" stroke="${INK}" stroke-width="2.5"/></g></g>`;
  }
  for (const l of o.labels || []) {
    const [x, y] = l.city ? M.city(l.city) : M.P(...l.ll);
    extra += `<text id="${p}-lb-${l.id}" x="${x + (l.dx || 0)}" y="${y + (l.dy || 0)}" text-anchor="middle" font-family="CC Bebas" font-size="${l.size || 54}" letter-spacing="3" fill="${l.col || INK}" stroke="${PAPER}" stroke-width="10" paint-order="stroke" stroke-linejoin="round" opacity="${l.t == null ? 1 : 0}">${l.text}</text>`;
  }
  const svg = `<svg viewBox="0 0 1920 1080" width="1920" height="1080"><defs>${defs}</defs>
    <rect x="-1000" y="-1000" width="3920" height="3080" fill="${SEA}"/>
    ${Array.from({ length: 16 }, (_, i) => `<path d="M${-200 + (i % 4) * 520 + (i * 61) % 140},${560 + Math.floor(i / 4) * 130} l60,0" stroke="#7FA6A3" stroke-width="4" stroke-linecap="round"/>`).join("")}
    <path d="${M.landD}" fill="${PAPER}"/>
    <g clip-path="url(#${p}-land)">${fills}</g>
    <g clip-path="url(#${p}-land)"><path d="${M.regionD("mughal1707")}" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linejoin="round" opacity="${o.goldBorder === false ? 0 : 1}"/>${borders}</g>
    <path d="${M.landD}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
    ${rivers}${extra}
  </svg>`;
  return svg;
}
export const mapJS = {
  wipe: (p, k, t, d, dir) => `CC.regionWipe(tl,'${p}-wr-${k}',${r1(t)},${r1(d)},'${dir || "lr"}');`,
  arrow: (p, id, t, d, icon = true, sc = 1) => `CC.draw(tl,'${p}-ar-${id}',${r1(t)},${r1(d)});` + (icon ? `CC.follow(tl,'${p}-ic-${id}','${p}-tp-${id}',${r1(t)},${r1(d)},'power1.inOut',${sc});` : ""),
  pin: (p, id, t) => `CC.popIn(tl,'${p}-pin-${id}',${r1(t)},{y:-60});`,
  pulse: (p, id, t0, t1, per) => `CC.pulse(tl,'${p}-pu-${id}',${r1(t0)},${r1(t1)},${per || 1});`,
  label: (p, id, t) => `CC.popIn(tl,'${p}-lb-${id}',${r1(t)},{scale:0.6});`,
};
export const city = M.city;
export const P = M.P;
