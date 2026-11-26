// Episode 2 shots: cold open, B1, B2, B3.
import { P, seated, miniMap } from "./lib.mjs";
import { horse, horseWalkJS, camel, camelWalkJS, camelFireJS, symHorseRiderSmall } from "../../../assets/kit/animals.mjs";
import { actor, talk, rot, tr, mv, cam, camTo, wipe, stampIn, popIn, draw, parallax, symbols, rows, crowd, mapSVG, mapJS, city, PW, r1, j } from "./lib.mjs";
import { delhiGate, hall, plain, frontier, tent, street, vault, tradingPost, desk, palace, deccanFort, persianCamp } from "../../../assets/kit/sets.mjs";
import { peacockThrone, cart, kohinoor, gauntletHand, crown, coinStack, chest, lamp, banner, scroll, scriptLines, rose, companyFlag, sarpech, chhatra, throneBack, throneFront, handWithGem } from "../../../assets/kit/props.mjs";
import { character, place, INK } from "../../../assets/kit/rig.mjs";
import { chip, nameCard, stamp, tag, mapTag } from "../../../assets/kit/ui.mjs";

const SVG = (inner) => `<svg viewBox="0 0 1920 1080" width="1920" height="1080">${inner}</svg>`;
const TQ = PW.persia.fill;

// Map states (anchor map). Ep 1 not built yet: open on 1707 Mughal green + crimson Company pin at Calcutta.
export const BASE = { persiaEdge: { fill: TQ, op: 0.55 }, mughal1707: { fill: PW.mughal.fill } };

export function shotsA(S) {
  const { L, E, add } = S;

  // ---------------- COLD OPEN ----------------
  add("cold", "s01", 0, "crowd", (c) => {
    const p = c.p, g = delhiGate(p + "-set");
    const r = rows(p, p + "-sp", [{ y: 820, s: 0.75, n: 26, x0: -300, dx: 92 }, { y: 920, s: 0.9, n: 22, x0: -360, dx: 112 }, { y: 1040, s: 1.1, n: 18, x0: -420, dx: 140 }]);
    const flags = [300, 760, 1200, 1640].map((x, i) => `<g transform="translate(${x},${1000 + (i % 2) * 30})">${banner(p + "-bn" + i, TQ, 330)}</g>`).join("");
    const svg = SVG(symbols(p) + g + `<g id="${p}-army" transform="translate(0,0)">${r.svg}${flags}</g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.08]) + parallax(p + "-set", c.t0, c.t1, 60) + crowd(r.ids, c.t0, c.t1, 7, 0.5, 4);
    js += r.rowIds.map((id, i) => mv(id, [[c.t0, [0, 0]], [c.t1, [140 + i * 50, 0]]], "none")).join("");
    js += [0, 1, 2, 3].map((i) => rot(`${p}-bn${i}-cloth`.replace("-cloth", "-cloth"), [[c.t0, 0], [c.t0 + 0.6, -4], [c.t0 + 1.2, 3], [c.t0 + 1.8, -3], [c.t1, 2]])).join("").replace(/'rot'/g, "'sk'");
    return { svg, ov: "", js };
  });
  add("cold", "s02", 2.55, "character", (c) => {
    const p = c.p, g = delhiGate(p + "-set");
    const n = actor(p + "-nd", "nadirShah", 960, 980, 1.25, { pose: { armL: [8, 6], armR: [-30, 60] } }, c.t0, c.t1);
    const r = rows(p, p + "-sp", [{ y: 790, s: 0.7, n: 12, x0: 80, dx: 160 }]);
    const svg = SVG(symbols(p) + g + `<g>${r.svg}</g>` + `<g id="${p}-ndw" transform="translate(0,0)">${n.svg}</g>`);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.12], [1.04], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.04], [1.1]) + n.js;
    js += `CC.walk(tl,'${p}-nd',${r1(c.t0)},${r1(c.t1)},0.55);` + tr(`${p}-nd-root`, [[c.t0, [760, 980, 1.25]], [c.t1, [1080, 1000, 1.3]]], "none");
    js += crowd(r.ids, c.t0, c.t1, 4, 0.55, 9);
    return { svg, ov: "", js };
  });
  add("cold", "s03", 5.15, "crowd", (c) => {
    // leaving Delhi: soldiers carry chests out of the city on carts
    const p = c.p, g = plain(p + "-set", { trees: true });
    const city = `<g>${[0, 1, 2, 3].map((i) => `<path d="M${1380 + i * 170},420 C${1380 + i * 170},350 ${1500 + i * 170},350 ${1500 + i * 170},420Z" fill="#F2ECE0" stroke="${INK}" stroke-width="2"/><rect x="${1436 + i * 170}" y="300" width="8" height="60" fill="${INK}"/>`).join("")}<rect x="1260" y="420" width="1000" height="230" fill="#B5523A" stroke="${INK}" stroke-width="2.5"/>${Array.from({ length: 24 }, (_, i) => `<path d="M${1260 + i * 40},420 L${1286 + i * 40},420 L${1286 + i * 40},404 C${1286 + i * 40},392 ${1260 + i * 40},392 ${1260 + i * 40},404Z" fill="#B5523A" stroke="${INK}" stroke-width="2"/>`).join("")}<path d="M1420,650 L1420,540 C1420,480 1540,480 1540,540 L1540,650Z" fill="#2B2622"/><text x="1700" y="560" font-family="CC Bebas" font-size="60" fill="#F4EEE2" letter-spacing="3">DELHI</text></g>`;
    const carts = [0, 1, 2].map((i) => `<g id="${p}-ct${i}" transform="translate(${1500 - i * 620},${900 + i * 20}) scale(${0.7 + i * 0.12})">${cart(p + "-cart" + i)}<g transform="translate(-120,-140)">${chest(p + "-ch" + i)}</g><g transform="translate(110,-140)">${chest(p + "-chb" + i)}</g></g>`).join("");
    const r = rows(p, p + "-sp", [{ y: 980, s: 0.95, n: 14, x0: -200, dx: 150 }]);
    const svg = SVG(symbols(p) + g + city + carts + r.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.05, 0, 0], [1.1, -40, 0]) + parallax(p + "-set", c.t0, c.t1, -80);
    js += [0, 1, 2].map((i) => tr(`${p}-ct${i}`, [[c.t0, [1500 - i * 620, 900 + i * 20, 0.7 + i * 0.12]], [c.t1, [1140 - i * 620, 900 + i * 20, 0.7 + i * 0.12]]], "none") + rot(`${p}-cart${i}-wheel`, [[c.t0, 0], [c.t1, -200]], "none") + rot(`${p}-cart${i}-wheel2`, [[c.t0, 0], [c.t1, -200]], "none")).join("");
    js += r.rowIds.map((id) => mv(id, [[c.t0, [0, 0]], [c.t1, [-260, 0]]], "none")).join("") + crowd(r.ids, c.t0, c.t1, 6, 0.5, 2);
    return { svg, ov: "", js };
  });
  add("cold", "s04", 8.0, "object", (c) => {
    // the Peacock Throne lifted onto a cart (ropes, tilt, wheel turns)
    const p = c.p, g = hall(p + "-set");
    const svg = SVG(g + `<g transform="translate(980,1010)"><g id="${p}-cartg" transform="translate(0,0)">${cart(p + "-cart")}</g></g>
      <g id="${p}-thr" transform="translate(960,700) scale(1.1,1.1)"><g id="${p}-tilt" transform="rotate(0)">${peacockThrone(p + "-pt")}</g></g>
      <path id="${p}-rope1" d="M760,0 L800,330" stroke="#8A6A4A" stroke-width="8"/><path id="${p}-rope2" d="M1160,0 L1120,330" stroke="#8A6A4A" stroke-width="8"/>`);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.18, 0, -40], [1.08, 0, -20], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.08, 0, -20], [1.14, 0, -30]);
    js += tr(`${p}-thr`, [[c.t0, [960, 640, 1.1]], [c.t0 + 1.1, [960, 860, 1.1], "power2.inOut"], [c.t1, [930, 872, 1.1]]]);
    js += rot(`${p}-tilt`, [[c.t0, 0], [c.t0 + 0.7, -4], [c.t0 + 1.1, 2], [c.t1, -1]]);
    js += mv(`${p}-cartg`, [[c.t0 + 1.0, [0, 0]], [c.t1, [-30, 0]]], "none") + rot(`${p}-cart-wheel`, [[c.t0 + 1.0, 0], [c.t1, -30]], "none") + rot(`${p}-cart-wheel2`, [[c.t0 + 1.0, 0], [c.t1, -30]], "none");
    js += `CC.attr(tl,'${p}-rope1','d',[[${r1(c.t0)},'M760,0 L800,270'],[${r1(c.t0 + 1.1)},'M760,0 L800,490']]);CC.attr(tl,'${p}-rope2','d',[[${r1(c.t0)},'M1160,0 L1120,270'],[${r1(c.t0 + 1.1)},'M1160,0 L1120,490']]);`;
    return { svg, ov: "", js };
  });
  add("cold", "s05", 9.4, "object", (c) => {
    // a drawn steel gauntlet whose fingers grip the Kohinoor, in a lit treasury
    const p = c.p, g = vault(p + "-set");
    const svg = SVG(g + `<g transform="translate(960,640)"><g id="${p}-hand" transform="translate(0,0) scale(1.15,1.15)">${handWithGem(p + "-hg")}</g></g>`);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.2], [1.05], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.05], [1.12]) + parallax(p + "-set", c.t0, c.t1, 30);
    js += tr(`${p}-hand`, [[c.t0, [0, 70, 1.15]], [c.t1, [0, 0, 1.2]]]);
    js += `CC.track(tl,'${p}-hg-kn-spark','rs',[[${r1(c.t0)},[0,0.4]],[${r1(c.t0 + 0.4)},[45,1.2]],[${r1(c.t0 + 0.8)},[90,0.6]],[${r1(c.t1)},[180,1.1]]]);`;
    return { svg, ov: "", js };
  });
  add("cold", "s06", L("c3") - 0.15, "map", (c) => {
    const p = c.p, kb = city("kabul"), dl = city("delhi");
    const svg = mapSVG(p, { regions: BASE, flags: [{ id: "co", city: "calcutta", s: 1 }], arrows: [{ id: "inv", cities: ["kandahar", "ghazni", "kabul", "peshawar", "lahore", "karnal", "delhi"], col: TQ, w: 16 }] });
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], camTo(940, 330, 1.25)) + mapJS.arrow(p, "inv", c.t0 + 0.3, Math.max(1.5, c.t1 - c.t0 - 0.6), true, 1.1);
    return { svg, ov: mapTag(p + "-mt"), js };
  });
  add("cold", "s07", L("c3") + 2.75, "map", (c) => {
    const p = c.p, [cx, cy] = city("calcutta");
    const svg = mapSVG(p, { regions: BASE, flags: [{ id: "co", city: "calcutta", s: 2.2 }], labels: [{ id: "lc", city: "calcutta", text: "A TRADING COMPANY", dy: 70, size: 52, col: "#A8322D" }] });
    let js = cam(p + "-cam", c.t0, c.t1, camTo(cx - 100, cy - 60, 1.5), camTo(cx - 60, cy - 80, 1.9));
    const t = c.t0;
    js += `tl.set(CC.$('${p}-fl-co'),{attr:{opacity:0}},${r1(t)});` + [0.3, 0.6, 0.9, 1.3, 1.6].map((dt, i) => `tl.set(CC.$('${p}-fl-co'),{attr:{opacity:${i % 2 ? 0 : 1}}},${r1(t + dt)});`).join("") + `tl.set(CC.$('${p}-fl-co'),{attr:{opacity:1}},${r1(t + 1.9)});`;
    js += mapJS.label(p, "lc", t + 0.4);
    return { svg: mapSVG(p, { regions: BASE, flags: [{ id: "co", city: "calcutta", s: 2.2 }], labels: [{ id: "lc", city: "calcutta", text: "A TRADING COMPANY", dy: 80, dx: -60, size: 52, col: "#A8322D", t: 1 }] }), ov: mapTag(p + "-mt"), js };
  });
  add("cold", "s08", L("c4") - 0.15, "object", (c) => {
    const p = c.p, g = hall(p + "-set", { warm: false });
    const svg = SVG(g + `<g transform="translate(960,900) scale(1.25)"><rect x="-230" y="-30" width="460" height="30" fill="#D9CFBD" stroke="${INK}" stroke-width="2"/><rect x="-200" y="-60" width="400" height="30" fill="#E7DFD0" stroke="${INK}" stroke-width="2"/><path d="M-160,-60 L-160,-62 M160,-60 L160,-62" stroke="${INK}"/></g>
      <path d="M700,824 L760,790 M1180,830 L1230,800" stroke="#B9AF9E" stroke-width="6"/>`);
    const js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], [1.1, 0, -40], "power1.out") + parallax(p + "-set", c.t0, c.t1, 30);
    return { svg, ov: "", js };
  });

  // ---------------- B1 · 1719 · THE PLEASURE KING ----------------
  add("b1", "s09", L("b1a") - 0.3, "crowd", (c) => {
    // open straight on Muhammad Shah's lit court: musicians play in front, the emperor on the throne behind
    const p = c.p, g = hall(p + "-set");
    const ms = seated(p + "-ms", "muhammadShah", 960, 800, 0.9, { pose: { armL: [14, 10], armR: [-30, -50] } }, c.t0, c.t1);
    const cs = [[420, "courtier", {}], [600, "poet", {}], [1320, "courtier", { jama: "#7A4B6B" }], [1500, "courtier", { jama: "#2F5D3A", beard: "white", hair: "#E8E2D6" }]].map(([x, k, over], i) => actor(`${p}-c${i}`, k, x, 860, 0.9, { over, seed: 30 + i }, c.t0, c.t1));
    const mus = rows(p, p + "-mu", [{ y: 1060, s: 1.5, n: 3, x0: 200, dx: 260 }, { y: 1060, s: 1.5, n: 3, x0: 1200, dx: 260, sym: p + "-mv" }]);
    const svg = SVG(symbols(p) + g + ms.svg + cs.map((a) => a.svg).join("") + mus.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], [1.06, 0, 10]) + parallax(p + "-set", c.t0, c.t1, 30) + ms.js + cs.map((a) => a.js).join("") + crowd(mus.ids, c.t0, c.t1, 12, 0.42, 6);
    const ov = chip(p + "-chip", "DELHI · 1719", "THE PLEASURE KING");
    return { svg, ov, js: js + wipe(p + "-chip", c.t0 + 0.2) };
  });
  add("b1", "s09b", L("b1a") + 2.0, "character", (c) => {
    const p = c.p, g = hall(p + "-set");
    const a = actor(p + "-a", "muhammadShah", 960, 1180, 2.1, { pose: { armL: [14, 10], armR: [-30, -50] } }, c.t0, c.t1);
    const svg = SVG(g + a.svg);
    const js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], [1.05, 0, 20]) + a.js + rot(`${p}-a-head`, [[c.t0, -4], [c.t1, 4]]);
    return { svg, ov: tag(p + "-tg", "THE EMPEROR · DELHI", 96, 66, "font-size:44px"), js: js + popIn(p + "-tg", c.t0 + 0.1) };
  });
  add("b1", "s09c", L("b1a") + 4.2, "crowd", (c) => {
    const p = c.p, g = persianCamp(p + "-set");
    const a = actor(p + "-a", "nadirShah", 1040, 1060, 1.6, { pose: { armL: [8, 6], armR: [-30, 60] } }, c.t0, c.t1);
    const r = rows(p, p + "-sp", [{ y: 760, s: 0.75, n: 14, x0: -60, dx: 150 }]);
    const svg = SVG(symbols(p) + g + r.svg + a.svg);
    const js = cam(p + "-cam", c.t0, c.t1, [1.04, 30, 0], [1.1, -20, 10]) + parallax(p + "-set", c.t0, c.t1, 40) + a.js + crowd(r.ids, c.t0, c.t1, 5, 0.5, 4) + rot(`${p}-a-head`, [[c.t0, 3], [c.t1, -3]]);
    return { svg, ov: tag(p + "-tg", "THE CONQUEROR · PERSIA", 96, 66, "font-size:44px"), js: js + popIn(p + "-tg", c.t0 + 0.1) };
  });
  add("b1", "s09d", L("b1a") + 6.3, "character", (c) => {
    const p = c.p, g = palace(p + "-set");
    const a = actor(p + "-a", "saadatKhan", 980, 1060, 1.6, { pose: { armL: [-10, -70], armR: [10, 70] } }, c.t0, c.t1);
    const svg = SVG(g + a.svg);
    const js = cam(p + "-cam", c.t0, c.t1, [1.04, -20, 0], [1.1, 20, 10]) + parallax(p + "-set", c.t0, c.t1, -40) + a.js + rot(`${p}-a-head`, [[c.t0, -6], [c.t0 + 1, 5], [c.t1, -3]]);
    return { svg, ov: tag(p + "-tg", "THE GOVERNOR · AWADH", 96, 66, "font-size:44px"), js: js + popIn(p + "-tg", c.t0 + 0.1) };
  });
  add("b1", "s09e", L("b1a") + 8.3, "set", (c) => {
    const p = c.p, g = deccanFort(p + "-set");
    const a = actor(p + "-a", "nizam", 1460, 1040, 1.3, { pose: { armL: [20, -110], armR: [-20, 110] } }, c.t0, c.t1);
    const svg = SVG(g + a.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.02, 0, 0], [1.08, -30, 0]) + parallax(p + "-set", c.t0, c.t1, 60) + a.js + rot(`${p}-a-head`, [[c.t0, 0], [c.t1, -8]]);
    js += `CC.track(tl,'${p}-set-flagcloth','sk',${j(Array.from({ length: 10 }, (_, i) => [r1(c.t0 + i * (c.t1 - c.t0) / 9), i % 2 ? 7 : -5]))});`;
    return { svg, ov: tag(p + "-tg", "THE MINISTER · THE DECCAN", 96, 66, "font-size:44px"), js: js + popIn(p + "-tg", c.t0 + 0.1) };
  });
  add("b1", "s10", L("b1b") - 0.15, "crowd", (c) => {
    // wide court: the emperor on the Peacock Throne, nobles in rows
    const p = c.p, g = hall(p + "-set");
    const ms = seated(p + "-ms", "muhammadShah", 960, 820, 1.0, { pose: { armL: [14, 10], armR: [-30, -50] } }, c.t0, c.t1);
    const nob = [[300, {}], [520, { jama: "#7A4B6B" }], [1400, { jama: "#2F5D3A" }], [1620, { jama: "#8A5A3A", beard: "white", hair: "#E8E2D6" }]].map(([x, over], i) => actor(`${p}-n${i}`, "courtier", x, 1000, 1.0, { over, seed: 40 + i, pose: { armL: [-10, -70], armR: [10, 70] } }, c.t0, c.t1));
    const svg = SVG(g + ms.svg + nob.map((a) => a.svg).join(""));
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.12], [1.0], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.0], [1.08, 0, 20]) + ms.js + nob.map((a) => a.js).join("") + talk(p + "-ms", L("b1b") + 0.6, L("b1b") + 4.0, 5);
    js += rot(`${p}-ms-armR-upper`, [[c.t0, -30], [c.t0 + 2.5, -60], [c.t1, -35]]);
    return { svg, ov: nameCard(p + "-nc", "1719", "Muhammad Shah", "Mughal emperor, 1719–1748", PW.mughal.fill), js: js + wipe(p + "-nc", c.t0 + 0.6, c.t1 - 0.4) };
  });
  add("b1", "s10b", L("b1c") - 0.15, "crowd", (c) => {
    // musicians and poets: a poet recites from a scroll, musicians play
    const p = c.p, g = hall(p + "-set", { warm: true });
    const po = actor(p + "-po", "poet", 760, 1000, 1.35, { pose: { armL: [10, 8], armR: [-70, -40] } }, c.t0, c.t1);
    const po2 = actor(p + "-pq", "poet", 1180, 1000, 1.35, { over: { headColor: "#B8362E", jama: "#F4E3D3", beard: "white", hair: "#E8E2D6" }, pose: { armL: [30, 20], armR: [-20, -10] }, seed: 8 }, c.t0, c.t1);
    const mus = rows(p, p + "-mu", [{ y: 1060, s: 1.5, n: 2, x0: 120, dx: 260 }, { y: 1060, s: 1.5, n: 2, x0: 1520, dx: 260, sym: p + "-mv" }]);
    const svg = SVG(symbols(p) + g + po.svg + po2.svg + mus.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.02, 40, 0], [1.08, -30, 0]) + parallax(p + "-set", c.t0, c.t1, 40) + po.js + po2.js + talk(p + "-po", c.t0 + 0.2, c.t1 - 0.3, 7) + crowd(mus.ids, c.t0, c.t1, 12, 0.42, 6);
    js += rot(`${p}-po-armR-upper`, [[c.t0, -70], [c.t0 + 1.2, -90], [c.t0 + 2.4, -65], [c.t1, -85]]) + rot(`${p}-pq-head`, [[c.t0, 0], [c.t1, -8]]);
    return { svg, ov: tag(p + "-tg", "MUSIC · POETRY · LUXURY", 96, 66), js: js + popIn(p + "-tg", c.t0 + 0.6) };
  });
  add("b1", "s11", L("b1c") + 3.4, "character", (c) => {
    // close-up: Muhammad Shah, rose in hand, swaying
    const p = c.p, g = hall(p + "-set");
    const ms = actor(p + "-ms", "muhammadShah", 960, 1500, 3.0, { pose: { armL: [14, 10], armR: [-60, -50] } }, c.t0, c.t1);
    let petals = "";
    for (let i = 0; i < 18; i++) petals += `<g id="${p}-pe${i}" transform="translate(${(i * 113) % 1920},-40)"><path d="M0,0 C8,-10 18,-4 12,8 C4,14 -6,8 0,0Z" fill="${i % 3 ? "#C94F6D" : "#E9A0B0"}" stroke="${INK}" stroke-width="1.5"/></g>`;
    const svg = SVG(g + ms.svg + petals);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], [1.06, 0, 30]) + ms.js + rot(`${p}-ms-head`, [[c.t0, -4], [c.t0 + 1.2, 5], [c.t0 + 2.4, -4], [c.t1, 4]]);
    for (let i = 0; i < 18; i++) js += mv(`${p}-pe${i}`, [[c.t0, [(i * 113) % 1920, -40 - (i % 5) * 100]], [c.t1, [((i * 113) % 1920) + 50, 700 - (i % 5) * 100]]], "none");
    const ov = tag(p + "-tg", "RANGEELA = “THE COLOURFUL ONE”", 96, 66, "font-size:40px");
    return { svg, ov, js: js + popIn(p + "-tg", c.t0 + 0.1) };
  });
  add("b1", "s12", L("b1d") - 0.15, "concept", (c) => {
    // puppet-strings: kingmaker hands work an emperor puppet; the strings snap ("got free of them")
    const p = c.p, cut = L("b1d") + 6.2;
    const pup = actor(p + "-pp", "muhammadShah", 960, 980, 1.25, { pose: { armL: [40, 20], armR: [-40, -20] }, over: { prop: "none" } }, c.t0, c.t1);
    const hand = (x, f) => `<g transform="translate(${x},120) scale(${f},1)"><path d="M-120,-200 L-60,-40 C-40,0 40,0 60,-30 L120,-200Z" fill="#7A5A44" stroke="${INK}" stroke-width="3"/><rect x="-150" y="-10" width="300" height="20" fill="#5A3E26" stroke="${INK}" stroke-width="3"/></g>`;
    const strings = [[800, 600], [760, 720], [1160, 600], [1120, 720], [960, 560]].map(([x2, y2], i) => `<path id="${p}-st${i}" d="M${x2 < 960 ? 760 : 1160},130 L${x2},${y2}" stroke="#2B2622" stroke-width="3"/>`).join("");
    const svg = SVG(`<rect x="-200" y="-200" width="2320" height="1480" fill="#D8C7A3"/><rect x="-200" y="900" width="2320" height="400" fill="#B5523A"/><path d="M-200,900 L2120,900" stroke="${INK}" stroke-width="3"/>` + `<g id="${p}-hands" transform="translate(0,0)">${hand(760, 1)}${hand(1160, -1)}</g>` + `<g id="${p}-strs">${strings}</g>` + `<g id="${p}-pj" transform="translate(0,0)">${pup.svg}</g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.06]) + pup.js;
    js += mv(`${p}-pj`, [[c.t0, [0, -60]], [c.t0 + 0.7, [0, -20]], [c.t0 + 1.4, [0, -70]], [c.t0 + 2.1, [0, -30]], [c.t0 + 2.8, [0, -70]], [c.t0 + 3.5, [0, -20]], [c.t0 + 4.2, [0, -60]], [cut, [0, -40]], [cut + 0.35, [0, 0], "bounce.out"]]);
    js += rot(`${p}-pp-armL-upper`, [[c.t0, 40], [c.t0 + 0.7, 80], [c.t0 + 1.4, 30], [c.t0 + 2.1, 90], [c.t0 + 2.8, 35], [c.t0 + 3.5, 85], [cut, 40], [cut + 0.5, 10]]);
    js += rot(`${p}-pp-armR-upper`, [[c.t0, -40], [c.t0 + 0.7, -85], [c.t0 + 1.4, -30], [c.t0 + 2.1, -90], [c.t0 + 2.8, -35], [c.t0 + 3.5, -80], [cut, -40], [cut + 0.5, -10]]);
    js += mv(`${p}-hands`, [[c.t0, [0, 0]], [c.t0 + 0.7, [0, 20]], [c.t0 + 1.4, [0, -10]], [c.t0 + 2.1, [0, 20]], [c.t0 + 2.8, [0, 0]], [cut, [0, 0]], [cut + 0.6, [0, -260], "power2.in"]]);
    js += `tl.set(CC.$('${p}-strs'),{attr:{opacity:1}},${r1(c.t0)});tl.set(CC.$('${p}-strs'),{attr:{opacity:0}},${r1(cut)});`;
    js += rot(`${p}-pp-head`, [[cut + 0.3, 0], [cut + 0.8, -8], [cut + 1.6, 4], [c.t1, 0]]);
    const ov = stamp(p + "-stp", "KINGMAKERS", 560, 150, "font-size:120px");
    return { svg, ov, js: js + stampIn(p + "-stp", L("b1d") + 1.2) + `CC.out(tl,'${p}-stp',${r1(cut - 0.3)});` };
  });
  add("b1", "s12b", L("b1d") + 6.5, "object", (c) => {
    // the throne never fully recovered its authority: a crack runs across the empty throne
    const p = c.p, g = hall(p + "-set", { warm: false });
    const svg = SVG(g + `<g transform="translate(960,960) scale(1.15)">${peacockThrone(p + "-pt", { empty: true })}<path id="${p}-ck" d="M-150,-330 L-110,-250 L-140,-190 L-80,-120 L-100,-60 L-40,0" fill="none" stroke="${INK}" stroke-width="7"/></g>`);
    const js = cam(p + "-cam", c.t0, c.t1, [1.02, 0, 40], [1.1, 0, 80]) + parallax(p + "-set", c.t0, c.t1, 30) + draw(p + "-ck", c.t0 + 1.0, 1.6, "power2.in");
    return { svg, ov: "", js };
  });
  add("b1", "s13", L("b1e") - 0.15, "map", (c) => {
    const p = c.p;
    const svg = mapSVG(p, { regions: BASE, flags: [{ id: "co", city: "calcutta", s: 1.3 }], pins: [{ id: "dl", city: "delhi", label: "Delhi" }], labels: [{ id: "me", ll: [78.5, 22.6], text: "MUGHAL EMPIRE", size: 66, col: "#F4EEE2" }] });
    const js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.12, 0, 0], [1.0, 0, 0], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.0, 0, 0], camTo(1000, 520, 1.12)) + wipe(p + "-chip", c.t0 + 0.2, c.t1 - 0.4);
    return { svg: svg.replace('stroke="#E9DCC0" stroke-width="10"', 'stroke="#2F5D3A" stroke-width="10"'), ov: mapTag(p + "-mt") + chip(p + "-chip", "INDIA · 1720s", "STATES WITHIN THE STATE"), js };
  });
  add("b1", "s14", L("b1f") - 0.15, "character", (c) => {
    // Nizam-ul-Mulk under a royal umbrella (chhatra): a ruler in all but name
    const p = c.p, g = deccanFort(p + "-set");
    const nz = actor(p + "-nz", "nizam", 1180, 1000, 1.6, { pose: { armL: [20, -110], armR: [-20, 110] } }, c.t0, c.t1);
    const svg = SVG(g + `<g transform="translate(1250,1000)"><g id="${p}-ch" transform="scale(1,0)">${chhatra(p + "-cht", 640)}</g></g>` + nz.svg + `<g transform="translate(560,600) scale(1.4)">${sarpech(p + "-sp")}</g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.04, 60, 0], [1.1, -20, 10]) + parallax(p + "-set", c.t0, c.t1, -50) + nz.js + talk(p + "-nz", L("b1f") + 1.2, L("b1f") + 4.8, 8);
    js += rot(`${p}-nz-head`, [[c.t0, 0], [c.t0 + 2, -6], [c.t0 + 4, 4], [c.t1, -3]]);
    js += `CC.track(tl,'${p}-ch','sc',[[${r1(c.t0)},[1,0]],[${r1(L("b1f") + 1.4)},[1,0]],[${r1(L("b1f") + 2.0)},[1,1],'back.out(1.6)']]);`;
    return { svg, ov: nameCard(p + "-nc", "1724", "Nizam-ul-Mulk", "Founder of Hyderabad state", PW.hyderabad.fill), js: js + wipe(p + "-nc", c.t0 + 0.5, c.t1 - 0.4) };
  });
  add("b1", "s15", L("b1g") - 0.15, "map", (c) => {
    const p = c.p, t = c.t0;
    const regions = { ...BASE, hyderabad: { fill: PW.hyderabad.fill, op: 0.9 }, bengal: { fill: PW.bengal.fill, wipe: true }, awadh: { fill: PW.awadh.fill, wipe: true }, punjab: { fill: "#7C8F55", wipe: true } };
    const svg = mapSVG(p, { regions, borders: ["hyderabad", "bengal", "awadh", "punjab"], flags: [{ id: "co", city: "calcutta", s: 1.2 }], labels: [{ id: "hy", ll: [78, 17.6], text: "HYDERABAD", size: 48, col: "#F4EEE2" }, { id: "bg", ll: [87.2, 24.2], text: "BENGAL", t: 1, col: "#F4EEE2" }, { id: "aw", ll: [81.4, 27.0], text: "AWADH", t: 1, col: "#F4EEE2" }, { id: "pj", ll: [73.6, 31.4], text: "PUNJAB", t: 1, col: "#F4EEE2" }] });
    let js = cam(p + "-cam", c.t0, c.t1, camTo(1000, 480, 1.15), camTo(1040, 440, 1.3));
    js += mapJS.wipe(p, "bengal", t + 0.3, 0.6, "rl") + mapJS.label(p, "bg", t + 0.7) + mapJS.wipe(p, "awadh", t + 1.0, 0.6) + mapJS.label(p, "aw", t + 1.4) + mapJS.wipe(p, "punjab", t + 1.7, 0.6) + mapJS.label(p, "pj", t + 2.1);
    return { svg: svg.replace(/stroke="#E9DCC0" stroke-width="10"/g, 'stroke="#2B2622" stroke-width="10"'), ov: mapTag(p + "-mt") + tag(p + "-tg", "TAXES AND ARMIES KEPT AT HOME", 96, 66), js: js + popIn(p + "-tg", L("b1g") + 4.2) };
  });
  add("b1", "s16", L("b1h") - 0.15, "concept", (c) => {
    // a throne resting on borrowed shoulders: three governors hold up the Peacock Throne, wobbling
    const p = c.p, g = hall(p + "-set", { warm: true });
    const gov = [["nizam", 640], ["saadatKhan", 960], ["abdali", 1280]].map(([k, x], i) => actor(`${p}-g${i}`, k, x, 1000, 1.2, { pose: { armL: [150, 20], armR: [-150, -20] }, over: k === "abdali" ? { jama: "#6F7A3A", headBand: "#6F7A3A", beard: "short", brows: "flat" } : {}, seed: 20 + i }, c.t0, c.t1));
    const svg = SVG(g + gov.map((a) => a.svg).join("") + `<g transform="translate(960,590)"><g id="${p}-cw" transform="rotate(0)"><g transform="scale(0.62)">${peacockThrone(p + "-pt", { empty: true })}</g></g></g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 60], [1.08, 0, 90]) + gov.map((a) => a.js).join("");
    js += rot(`${p}-cw`, [[c.t0, -3], [c.t0 + 1, 4], [c.t0 + 2, -5], [c.t0 + 3, 3], [c.t0 + 4.2, -6], [c.t0 + 5.4, 5], [c.t0 + 6.6, -4], [c.t1, 3]]);
    const ov = tag(p + "-tg", "MUGHAL EMPIRE, 1730s", 96, 66, "font-size:40px");
    return { svg, ov, js: js + popIn(p + "-tg", c.t0 + 0.4) };
  });
  add("b2", "s17", L("b2a") - 0.3, "set", (c) => {
    const p = c.p, g = frontier(p + "-set");
    const svg = SVG(g);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.12], [1.02], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.02], [1.1, -60, 0]) + parallax(p + "-set", c.t0, c.t1, 70);
    js += `CC.track(tl,'${p}-set-flagcloth','sk',${j(Array.from({ length: 16 }, (_, i) => [r1(c.t0 + i * (c.t1 - c.t0) / 15), i % 2 ? 8 : -6]))});`;
    const ov = chip(p + "-chip", "NORTH-WEST FRONTIER · 1737", "WARNING SHOTS") + tag(p + "-tg", "FORTS UNPAID · PASSES UNWATCHED", 96, 160);
    return { svg, ov, js: js + wipe(p + "-chip", c.t0 + 0.2, c.t1 - 0.4) + popIn(p + "-tg", c.t0 + 2.2) };
  });
  add("b2", "s18", L("b2b") - 0.2, "map", (c) => {
    const p = c.p, t = c.t0;
    const svg = mapSVG(p, { regions: { ...BASE, maratha: { fill: PW.marathas.fill, op: 0.9 } }, flags: [{ id: "co", city: "calcutta", s: 1.1 }], arrows: [{ id: "br", cities: ["pune", "delhi"], col: PW.marathas.fill, w: 16 }], markers: [{ id: "dl", city: "delhi", col: "#A8322D" }], pins: [{ id: "pu", city: "pune", label: "Pune", side: "l" }, { id: "dlp", city: "delhi", label: "Delhi", t: 1 }], labels: [{ id: "mr", ll: [78.6, 20.4], dy: 0, text: "MARATHAS", size: 44, col: "#D9822B" }] });
    let js = cam(p + "-cam", c.t0, c.t1, camTo(900, 560, 1.15), camTo(940, 400, 1.35)) + mapJS.arrow(p, "br", L("b2c") + 1.2, 4.2, true, 1.1) + mapJS.pin(p, "dlp", L("b2c") + 5.2) + mapJS.pulse(p, "dl", L("b2c") + 5.4, c.t1, 0.9);
    return { svg, ov: mapTag(p + "-mt"), js };
  });
  add("b2", "s19", L("b2d") - 0.15, "character", (c) => {
    // Baji Rao on a rigged horse (4-beat walk), seated with a foot in the stirrup; riders on the horizon
    const p = c.p, g = plain(p + "-set", { dusk: true });
    const sky = `<g>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${1300 + i * 70}" y="${560 - (i % 3) * 26}" width="60" height="${80 + (i % 3) * 26}" fill="#8E6E5A"/>`).join("")}</g>`;
    const rider = character("bajiRao", p + "-br", { seated: true, pose: { armL: [-30, -50], armR: [-60, -40] } });
    const defs = `<defs>${symHorseRiderSmall(p + "-h0")}${symHorseRiderSmall(p + "-h1", { phase: 1 })}</defs>`;
    const riderRow = (ph) => `<g id="${p}-rr${ph}" opacity="${ph ? 0 : 1}"><g transform="translate(0,760) scale(0.55)"><g id="${p}-rm${ph}" transform="translate(0,0)">${Array.from({ length: 14 }, (_, i) => `<use href="#${p}-h${ph}" x="${-200 + i * 260}" y="0"/>`).join("")}</g></g></g>`;
    const svg = SVG(defs + g + sky + riderRow(0) + riderRow(1) + `<g transform="translate(820,1010) scale(1.05)">${horse(p + "-hs", { rider })}</g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.02, 0, 0], [1.08, 30, 10]) + parallax(p + "-set", c.t0, c.t1, 160);
    js += horseWalkJS(p + "-hs", c.t0, c.t1, { period: 1.0 }) + `CC.blink(tl,'${p}-br',${r1(c.t0)},${r1(c.t1)},5);` + talk(p + "-br", L("b2d") + 0.2, L("b2d") + 2.6, 12);
    js += rot(`${p}-br-armR-upper`, [[c.t0, -60], [c.t0 + 1.5, -120], [c.t0 + 3, -110], [c.t0 + 4.5, -60], [c.t1, -70]]);
    for (let k = 0, t = c.t0; t < c.t1; t += 0.25, k++) js += `tl.set(CC.$('${p}-rr0'),{attr:{opacity:${k % 2 ? 0 : 1}}},${r1(t)});tl.set(CC.$('${p}-rr1'),{attr:{opacity:${k % 2 ? 1 : 0}}},${r1(t)});`;
    js += [0, 1].map((ph) => mv(`${p}-rm${ph}`, [[c.t0, [0, 0]], [c.t1, [300, 0]]], "none")).join("");
    const ov = nameCard(p + "-nc", "1737", "Baji Rao I", "Maratha Peshwa (chief minister)", PW.marathas.fill) + nameCard(p + "-na", "BOOK", "Rajiv Ahir", "A Brief History of Modern India", "#2B2622") +
      `<div id="${p}-vs" class="card" style="left:1060px;top:150px;width:760px;padding:24px 30px;opacity:0"><div style="font-family:'CC Bebas';font-size:56px;line-height:1">AHIR: “JUST 500 HORSEMEN”</div><div style="height:4px;background:#2B2622;margin:12px 0"></div><div style="font-family:'CC Bebas';font-size:56px;line-height:1">OTHER ACCOUNTS: A FAR LARGER ARMY</div></div>` +
      tag(p + "-tg", "HISTORIANS DISAGREE · SOURCES BELOW", 1060, 420);
    js += wipe(p + "-nc", c.t0 + 0.4, L("b2d") + 3.4) + wipe(p + "-na", L("b2d") + 3.8, c.t1 - 0.3) + popIn(p + "-vs", L("b2d") + 1.0, { x: 60 }) + popIn(p + "-tg", L("b2d") + 5.0);
    return { svg, ov, js };
  });
  add("b2", "s20", L("b2e") - 0.15, "map", (c) => {
    // the message: Delhi could not protect itself (Maratha arrow at the gates, Delhi pulses)
    const p = c.p, [dx, dy] = city("delhi");
    const svg = mapSVG(p, { regions: { ...BASE, maratha: { fill: PW.marathas.fill, op: 0.9 } }, arrows: [{ id: "br", cities: ["pune", "delhi"], col: PW.marathas.fill, w: 16 }], markers: [{ id: "dl", city: "delhi", col: "#A8322D" }], pins: [{ id: "dlp", city: "delhi", label: "Delhi" }] });
    const js = cam(p + "-cam", c.t0, c.t1, camTo(dx, dy + 120, 2.0), camTo(dx, dy + 80, 2.4), "power1.out") + mapJS.arrow(p, "br", c.t0, 0.6, false) + mapJS.pulse(p, "dl", c.t0 + 0.2, c.t1, 0.8);
    return { svg, ov: mapTag(p + "-mt") + stamp(p + "-stp", "UNDEFENDED", 1060, 640, "font-size:120px") + tag(p + "-tg", "THE CAPITAL WAS UNDEFENDED", 96, 66), js: js + stampIn(p + "-stp", L("b2e") + 2.2) + popIn(p + "-tg", L("b2e") + 0.8) };
  });
  add("b2", "s21", L("b2f") - 0.15, "character", (c) => {
    // Nadir Shah in his lit tent, studying a map of India and pointing at it
    const p = c.p, g = tent(p + "-set", { night: false });
    const nd = actor(p + "-nd", "nadirShah", 1380, 980, 1.5, { pose: { armL: [8, 6], armR: [-75, -20] } }, c.t0, c.t1);
    const table = `<g transform="translate(700,880)"><rect x="-360" y="-30" width="720" height="40" fill="#7A4A2A" stroke="${INK}" stroke-width="3"/><path d="M-330,10 L-330,120 M330,10 L330,120" stroke="#5A3E26" stroke-width="16"/></g>`;
    const mp = miniMap(p + "-mp", 380, 420, 640, 440, { regions: BASE, pins: [{ id: "dl", city: "delhi", label: "Delhi" }] });
    const svg = SVG(g + table + `<rect x="370" y="410" width="660" height="460" fill="#E9DCC0" stroke="${INK}" stroke-width="4"/>` + mp + nd.svg + `<g transform="translate(860,880)">${lamp(p + "-lp")}</g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], [1.08, 60, 20]) + nd.js + rot(`${p}-nd-head`, [[c.t0, 4], [c.t0 + 1.5, 10], [c.t1, 8]]) + rot(`${p}-nd-armR-upper`, [[c.t0, -60], [c.t0 + 1.0, -82], [c.t0 + 2.2, -76], [c.t1, -84]]);
    js += `CC.track(tl,'${p}-lp-flame','sc',${j(Array.from({ length: 10 }, (_, i) => [r1(c.t0 + i * (c.t1 - c.t0) / 9), [1, i % 2 ? 1.15 : 0.93]]))});`;
    return { svg, ov: "", js };
  });
  add("b2", "s21b", L("b2g") - 0.15, "map", (c) => {
    // close on the map: a gauntleted finger comes to rest on Delhi
    const p = c.p, g = tent(p + "-set", { night: false });
    const [dx, dy] = city("delhi");
    const mx = 240, my = 90, mw = 1440, mh = 810, k = mw / 1920;
    const mp = miniMap(p + "-mp", mx, my, mw, mh, { regions: BASE, markers: [{ id: "dl", city: "delhi", col: "#A8322D" }], pins: [{ id: "dlp", city: "delhi", label: "Delhi" }] });
    const fx = mx + dx * k, fy = my + dy * k;
    const finger = `<g id="${p}-fg" transform="translate(${fx + 700},${fy + 520})"><g transform="scale(0.55)"><path d="M0,0 L-60,-40 L-70,-20 L-30,10Z" fill="#8A9094" stroke="${INK}" stroke-width="3"/><path d="M-60,-40 C-40,-60 60,-40 160,20 L130,90 C60,60 -20,40 -70,-20Z" fill="#8A9094" stroke="${INK}" stroke-width="3"/><path d="M140,40 L700,560 L560,620 L110,90Z" fill="#6E7478" stroke="${INK}" stroke-width="4"/></g></g>`;
    const svg = SVG(g + `<rect x="${mx - 14}" y="${my - 14}" width="${mw + 28}" height="${mh + 28}" fill="#E9DCC0" stroke="${INK}" stroke-width="4"/>` + mp + finger);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], [1.12, (960 - fx) * 0.12, (540 - fy) * 0.12]) + tr(`${p}-fg`, [[c.t0, [fx + 700, fy + 520, 1]], [c.t0 + 1.6, [fx + 6, fy + 4, 1], "power2.out"], [c.t1, [fx, fy, 1]]]);
    js += `CC.pulse(tl,'${p}-mp-pu-dl',${r1(c.t0 + 1.6)},${r1(c.t1)},0.8);`;
    return { svg, ov: mapTag(p + "-mt"), js };
  });
  add("b3", "s22", L("b3a") - 0.3, "character", (c) => {
    const p = c.p, g = tent(p + "-set", { night: false });
    const nd = actor(p + "-nd", "nadirShah", 960, 990, 1.75, { pose: { armL: [8, 6], armR: [-30, 60] } }, c.t0, c.t1);
    const svg = SVG(g + nd.svg);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.25, 0, 120], [1.08, 0, 60], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.08, 0, 60], [1.16, 0, 110]) + nd.js + talk(p + "-nd", L("b3b") + 0.2, c.t1 - 0.2, 21);
    js += `CC.track(tl,'${p}-nd-brows','mv',[[${r1(c.t0)},[0,0]],[${r1(c.t0 + 1.2)},[0,3]],[${r1(c.t0 + 2.4)},[0,0]]]);` + rot(`${p}-nd-head`, [[c.t0, 4], [c.t0 + 1.5, -3], [c.t1, 2]]);
    const ov = chip(p + "-chip", "PERSIA · 1738", "THE STORM") + nameCard(p + "-nc", "1736", "Nadir Shah", "Shah of Persia from 1736", PW.persia.fill);
    return { svg, ov, js: js + wipe(p + "-chip", c.t0 + 0.2, c.t1 - 0.5) + wipe(p + "-nc", c.t0 + 1.0, c.t1 - 0.3) };
  });
  add("b3", "s23", L("b3b") + 4.6, "archival", (c) => {
    const p = c.p;
    const svg = `<svg viewBox="0 0 1920 1080" width="1920" height="1080"><rect x="-200" y="-200" width="2320" height="1480" fill="#6E4A32"/>${Array.from({ length: 30 }, (_, i) => `<path d="M-200,${i * 40} C400,${i * 40 + 12} 1200,${i * 40 - 10} 2120,${i * 40 + 6}" stroke="#5E3E2A" stroke-width="4" fill="none"/>`).join("")}
      <g transform="translate(960,520)"><g id="${p}-frame" transform="rotate(0) scale(1)"><rect x="-330" y="-410" width="660" height="820" fill="#F2E8D2" stroke="${INK}" stroke-width="4"/><rect x="-330" y="-410" width="660" height="820" fill="none" stroke="#2B2622" stroke-width="4" transform="translate(14,14)"/>
      <image href="assets/img/nader-shah-portrait-c1740.jpg" x="-286" y="-366" width="572" height="722" preserveAspectRatio="xMidYMid slice"/></g></g></svg>`;
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], [1.12, 0, 30], "none") + `CC.track(tl,'${p}-frame','rs',[[${r1(c.t0)},[-2,1]],[${r1(c.t1)},[1,1.04]]],'none');`;
    const ov = `<div class="lbl" style="left:96px;bottom:66px;font-size:36px;font-weight:600;max-width:1100px">Portrait of Nadir Shah, Iran, c. 1740 · artist unknown · British Library · Public domain</div>`;
    return { svg, ov, js };
  });
  add("b3", "s24", L("b3c") - 0.15, "map", (c) => {
    const p = c.p;
    const coins = [[77.2, 28.7], [88, 23.6], [82, 26.5], [78.5, 17.5], [73, 22.5], [74.3, 31.5]].map((q, i) => ({ id: "cn" + i, ll: q }));
    let svg = mapSVG(p, { regions: { ...BASE, hyderabad: { fill: PW.hyderabad.fill, op: 0.8 }, bengal: { fill: PW.bengal.fill, op: 0.8 }, awadh: { fill: PW.awadh.fill, op: 0.8 }, punjab: { fill: "#7C8F55", op: 0.8 } }, borders: ["hyderabad", "bengal", "awadh", "punjab"] });
    let extra = "";
    coins.forEach((q, i) => { const [x, y] = P(...q.ll); extra += `<g transform="translate(${x},${y})"><g id="${p}-cn${i}" opacity="0"><circle r="26" fill="#C9A24A" stroke="${INK}" stroke-width="3"/><circle r="15" fill="none" stroke="#9C7A2E" stroke-width="4"/></g></g>`; });
    const cracks = `<path id="${p}-ck1" d="M${P(76.5, 33).join(",")} L${P(77.6, 29.5).join(",")} L${P(76.8, 26).join(",")} L${P(78.2, 22.5).join(",")} L${P(76.6, 19).join(",")}" fill="none" stroke="${INK}" stroke-width="5"/><path id="${p}-ck2" d="M${P(80, 30).join(",")} L${P(82.5, 25).join(",")} L${P(84.5, 22).join(",")}" fill="none" stroke="${INK}" stroke-width="5"/>`;
    svg = svg.replace("</svg>", extra + cracks + "</svg>");
    var js0 = coins.map((q, i) => `CC.popIn(tl,'${p}-cn${i}',${r1(c.t0 + 0.2 + i * 0.25)},{scale:0.3});`).join("") + draw(p + "-ck1", c.t0 + 1.2, 1.4) + draw(p + "-ck2", c.t0 + 1.6, 1.2);
    return { svg, ov: mapTag(p + "-mt") + tag(p + "-tg", "RICH · BUT DIVIDED", 96, 66, "font-size:44px"), js: js0 + cam(p + "-cam", c.t0, c.t1, camTo(1000, 520, 1.1), camTo(900, 400, 1.22)) + popIn(p + "-tg", c.t0 + 0.4) };
  });
  add("b3", "s25", L("b3d") - 0.15, "map", (c) => {
    const p = c.p, t = L("b3d");
    const svg = mapSVG(p, { regions: BASE, flags: [{ id: "co", city: "calcutta", s: 1.1 }], arrows: [{ id: "inv", cities: ["kandahar", "ghazni", "kabul", "peshawar", "lahore"], col: TQ, w: 16 }], pins: [{ id: "kb", city: "kabul", label: "Kabul · 1738", side: "l", t: 1 }, { id: "lh", city: "lahore", label: "Lahore · 1739", t: 1 }] });
    let js = cam(p + "-cam", c.t0, c.t1, camTo(760, 360, 1.5), camTo(860, 330, 1.75)) + mapJS.arrow(p, "inv", t + 0.4, 6.2, true, 1.1) + mapJS.pin(p, "kb", t + 2.4) + mapJS.pin(p, "lh", t + 6.6);
    return { svg, ov: mapTag(p + "-mt"), js };
  });
  add("b3", "s26", L("b3e") - 0.15, "character", (c) => {
    const p = c.p, g = hall(p + "-set");
    const S0 = 1.32;
    const ms = actor(p + "-ms", "muhammadShah", 960, 980, S0, { pose: { armL: [14, 10], armR: [-20, -40] }, over: { brows: "worried" } }, c.t0, c.t1);
    const n1 = actor(p + "-n1", "courtier", 560, 980, S0, { pose: { armL: [60, 40], armR: [-30, -20] }, over: { jama: "#4F7A3A" }, seed: 4 }, c.t0, c.t1);
    const n2 = actor(p + "-n2", "courtier", 1360, 980, S0, { pose: { armL: [30, 20], armR: [-70, -50] }, over: { jama: "#8A5A3A", beard: "white", hair: "#E8E2D6" }, seed: 6 }, c.t0, c.t1);
    const nz = actor(p + "-nz", "nizam", 1720, 980, S0, { pose: { armL: [20, -110], armR: [-20, 110] }, seed: 9 }, c.t0, c.t1);
    const svg = SVG(g + ms.svg + n1.svg + n2.svg + nz.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.02, 0, 0], [1.1, -80, 20]) + parallax(p + "-set", c.t0, c.t1, 50) + ms.js + n1.js + n2.js + nz.js;
    js += talk(p + "-n1", c.t0 + 0.2, c.t0 + 2.6, 2) + talk(p + "-n2", c.t0 + 2.4, c.t0 + 4.6, 3);
    js += rot(`${p}-n1-armL-upper`, [[c.t0, 60], [c.t0 + 0.6, 110], [c.t0 + 1.2, 70], [c.t0 + 1.8, 120], [c.t0 + 2.6, 60]]) + rot(`${p}-n2-armR-upper`, [[c.t0 + 2.4, -70], [c.t0 + 3, -120], [c.t0 + 3.6, -80], [c.t0 + 4.2, -125], [c.t0 + 4.8, -70]]);
    js += rot(`${p}-ms-head`, [[c.t0, -8], [c.t0 + 2.4, -8], [c.t0 + 2.8, 8], [c.t1, 6]]) + rot(`${p}-nz-head`, [[c.t0 + 4.2, 0], [c.t0 + 4.8, -10], [c.t1, -10]]);
    return { svg, ov: tag(p + "-tg", "THE NIZAM: HEARD, NOT TRUSTED", 96, 66), js: js + popIn(p + "-tg", c.t0 + 3.4) };
  });
  add("b3", "s27", L("b3f") - 0.15, "character", (c) => {
    const p = c.p, g = hall(p + "-set");
    const ms = actor(p + "-ms", "muhammadShah", 960, 960, 1.6, { pose: { armL: [14, 10], armR: [-20, -40] }, over: { brows: "worried", prop: "none" } }, c.t0, c.t1);
    const drums = rows(p, p + "-mu", [{ y: 1000, s: 1.2, n: 2, x0: 260, dx: 1380 }]);
    const svg = SVG(symbols(p) + g + drums.svg + ms.svg + `<g id="${p}-rs" transform="translate(1080,640) scale(0.7,0.7)">${rose(p + "-ro")}</g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.05, 0, 40], [1.16, 0, 70]) + ms.js + crowd(drums.ids, c.t0 + 1.2, c.t1, 14, 0.3, 4);
    js += tr(`${p}-rs`, [[c.t0, [1085, 660, 0.7]], [c.t0 + 1.4, [1085, 660, 0.7]], [c.t0 + 2.4, [1150, 1010, 0.7], "power2.in"], [c.t1, [1150, 1010, 0.7]]]);
    js += `CC.track(tl,'${p}-ro','rot',[[${r1(c.t0 + 1.4)},0],[${r1(c.t0 + 2.4)},80]]);`;
    js += rot(`${p}-ms-armR-lower`, [[c.t0, -40], [c.t0 + 1.4, -40], [c.t0 + 2, 20]]) + rot(`${p}-ms-head`, [[c.t0 + 1.4, 0], [c.t0 + 2.4, 10], [c.t1, 6]]);
    return { svg, ov: stamp(p + "-stp", "WAR", 1220, 160), js: js + stampIn(p + "-stp", L("b3f") + 4.2) };
  });
}
