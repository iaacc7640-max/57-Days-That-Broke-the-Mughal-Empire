// Episode 2 shots: B4 Karnal, B5 Delhi (tragedy grade), B6 the loot, B7 aftershocks, B8 takeaway.
import { seated } from "./lib.mjs";
import { camel, camelWalkJS, camelFireJS } from "../../../assets/kit/animals.mjs";
import { actor, talk, rot, tr, mv, cam, camTo, wipe, stampIn, popIn, draw, parallax, symbols, rows, crowd, mapSVG, mapJS, city, P, PW, r1, j } from "./lib.mjs";
import { delhiGate, hall, plain, frontier, tent, street, vault, tradingPost, desk } from "../../../assets/kit/sets.mjs";
import { peacockThrone, cart, kohinoor, crown, coinStack, chest, lamp, banner, scroll, scriptLines, companyFlag, sarpech, throneBack, throneFront } from "../../../assets/kit/props.mjs";
import { INK } from "../../../assets/kit/rig.mjs";
import { chip, nameCard, stamp, tag, mapTag, quote } from "../../../assets/kit/ui.mjs";
import { BASE } from "./shots-a.mjs";

const SVG = (inner) => `<svg viewBox="0 0 1920 1080" width="1920" height="1080">${inner}</svg>`;
const TQ = PW.persia.fill;
const SEPIA_BG = "#CFC6B6";
// Ep 2 end state of the anchor map (saved to anchor-states.json as "ep02")
export const EP02_END = { persiaEdge: { fill: TQ, op: 0.55 }, mughal1707: { fill: PW.mughal.fill }, westOfIndus: { fill: TQ }, hyderabad: { fill: PW.hyderabad.fill, op: 0.85 }, bengal: { fill: PW.bengal.fill, op: 0.85 }, awadh: { fill: PW.awadh.fill, op: 0.85 }, maratha: { fill: PW.marathas.fill, op: 0.85 } };

export function shotsB(S) {
  const { L, E, add } = S;

  // ---------------- B4 · 1739 · KARNAL ----------------
  add("b4", "s28", L("b4a") - 0.3, "set", (c) => {
    const p = c.p, g = plain(p + "-set", { tents: true });
    const flags = [220, 700, 1240, 1700].map((x, i) => `<g transform="translate(${x},${720 + (i % 2) * 20})">${banner(p + "-bn" + i, PW.mughal.fill, 230)}</g>`).join("");
    const svg = SVG(g + flags);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.12], [1.02], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.02], [1.12, -40, 30]) + parallax(p + "-set", c.t0, c.t1, 120);
    js += [0, 1, 2, 3].map((i) => `CC.track(tl,'${p}-bn${i}-cloth','sk',${j(Array.from({ length: 12 }, (_, k) => [r1(c.t0 + k * (c.t1 - c.t0) / 11), (k + i) % 2 ? 6 : -5]))});`).join("");
    const ov = chip(p + "-chip", "KARNAL · FEBRUARY 1739", "THE BATTLE") + tag(p + "-tg", "≈120 KM NORTH OF DELHI", 96, 160);
    return { svg, ov, js: js + wipe(p + "-chip", c.t0 + 0.2, c.t1 - 0.4) + popIn(p + "-tg", L("b4a") + 3.4) };
  });
  add("b4", "s29", L("b4b") - 0.15, "stat", (c) => {
    const p = c.p;
    const ra = rows(p, p + "-sm", [{ y: 900, s: 0.62, n: 20, x0: 40, dx: 40 }, { y: 960, s: 0.62, n: 20, x0: 60, dx: 40 }, { y: 1020, s: 0.62, n: 20, x0: 40, dx: 40 }]);
    const rb = rows(p, p + "-sp", [{ y: 960, s: 0.62, n: 9, x0: 1330, dx: 52, sym: p + "-sp" }, { y: 1020, s: 0.62, n: 9, x0: 1350, dx: 52, sym: p + "-sp" }]);
    const svg = SVG(symbols(p) + `<rect x="-200" y="-200" width="2320" height="1480" fill="#E9DCC0"/><rect x="960" y="-200" width="1200" height="1480" fill="#DCE8E2"/><path d="M960,-200 L960,1300" stroke="${INK}" stroke-width="6"/>` + ra.svg + rb.svg);
    const ov = `<div id="${p}-a" class="card" style="left:96px;top:110px;width:780px;padding:26px 32px;opacity:0"><div class="big" style="font-size:44px;color:#2F5D3A">MUGHAL CAMP</div><div class="big" style="font-size:150px">≈300,000</div><div style="font-size:36px;font-weight:600">people, incl. servants &amp; camp followers</div></div>
      <div id="${p}-b" class="card" style="left:1040px;top:110px;width:780px;padding:26px 32px;opacity:0"><div class="big" style="font-size:44px;color:${TQ}">NADIR'S ARMY</div><div class="big" style="font-size:110px">SMALLER</div><div style="font-size:36px;font-weight:600">faster · drilled · uniformed musketeers</div></div>` + tag(p + "-tg", "ESTIMATE · ONE CONTEMPORARY COUNT", 96, 560);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.05]) + crowd(ra.ids.concat(rb.ids), c.t0, c.t1, 5, 0.5, 5) + popIn(p + "-a", c.t0 + 0.3, { x: -60 }) + popIn(p + "-b", c.t0 + 2.6, { x: 60 }) + popIn(p + "-tg", c.t0 + 1.3);
    js += ra.rowIds.map((id, i) => mv(id, [[c.t0, [0, 0]], [c.t1, [70 + i * 10, 0]]], "none")).join("") + rb.rowIds.map((id, i) => mv(id, [[c.t0, [0, 0]], [c.t1, [-160 - i * 20, 0]]], "none")).join("");
    return { svg, ov, js };
  });
  add("b4", "s30", L("b4c") - 0.15, "crowd", (c) => {
    // the Persian infantry (teal) advances
    const p = c.p, g = plain(p + "-set", { trees: false });
    const r = rows(p, p + "-sp", [{ y: 760, s: 0.6, n: 34, x0: -400, dx: 72 }, { y: 860, s: 0.78, n: 30, x0: -460, dx: 92 }, { y: 990, s: 1.0, n: 24, x0: -520, dx: 118 }]);
    const svg = SVG(symbols(p) + g + r.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.02, 0, 0], [1.1, -60, 0]) + parallax(p + "-set", c.t0, c.t1, 80) + crowd(r.ids, c.t0, c.t1, 9, 0.46, 8);
    js += r.rowIds.map((id, i) => mv(id, [[c.t0, [0, 0]], [c.t1, [260 + i * 70, 0]]], "none")).join("");
    return { svg, ov: tag(p + "-tg", "UNIFORMED, DRILLED MUSKETEERS", 96, 66), js: js + popIn(p + "-tg", c.t0 + 0.8) };
  });
  add("b4", "s30b", L("b4c") + 4.1, "crowd", (c) => {
    // camels walk; the light swivel guns on their backs fire (flat smoke puffs)
    const p = c.p, g = plain(p + "-set", { trees: false });
    const cams = [[300, 1000, 0.95], [880, 1010, 1.0], [1480, 1000, 0.95]];
    const svg = SVG(g + cams.map(([x, y, s], i) => `<g transform="translate(${x},${y}) scale(${s})">${camel(`${p}-c${i}`, { gun: true })}</g>`).join(""));
    let js = cam(p + "-cam", c.t0, c.t1, [1.02, 0, 0], [1.08, -40, 0]) + parallax(p + "-set", c.t0, c.t1, 140);
    cams.forEach((_, i) => { js += camelWalkJS(`${p}-c${i}`, c.t0, c.t1, { period: 1.3 + i * 0.07 }) + camelFireJS(`${p}-c${i}`, c.t0 + 0.6 + i * 0.9); });
    return { svg, ov: tag(p + "-tg", "LIGHT GUNS ON CAMELS", 96, 66), js: js + popIn(p + "-tg", c.t0 + 0.3) };
  });
  add("b4", "s31", L("b4d") - 0.15, "character", (c) => {
    // Saadat Khan, captured, between two full-size Persian guards
    const p = c.p, g = plain(p + "-set", { trees: true });
    const sk = actor(p + "-sk", "saadatKhan", 960, 1000, 1.55, { pose: { armL: [-10, -70], armR: [10, 70] } }, c.t0, c.t1);
    const g1 = actor(p + "-g1", "persianSoldier", 560, 1000, 1.55, { seed: 3 }, c.t0, c.t1);
    const g2 = actor(p + "-g2", "persianSoldier", 1360, 1000, 1.55, { seed: 6, flip: true }, c.t0, c.t1);
    const svg = SVG(g + g1.svg + g2.svg + sk.svg);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.12], [1.02], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.02], [1.08, 0, 40]) + sk.js + g1.js + g2.js + talk(p + "-sk", L("b4d") + 0.1, L("b4d") + 2.4, 31);
    js += rot(`${p}-sk-head`, [[c.t0, 0], [c.t0 + 1.4, -8], [c.t0 + 2.8, 6], [c.t1, -4]]);
    const ov = nameCard(p + "-nc", "1722", "Saadat Khan", "Governor (Nawab) of Awadh", PW.awadh.fill) + stamp(p + "-stp", "CAPTURED", 1100, 150, "font-size:120px");
    return { svg, ov, js: js + wipe(p + "-nc", c.t0 + 0.4, c.t1 - 0.3) + stampIn(p + "-stp", E("b4d") - 0.9) };
  });
  add("b4", "s32", L("b4e") - 0.15, "map", (c) => {
    const p = c.p, [kx, ky] = city("karnal");
    const svg = mapSVG(p, { regions: BASE, markers: [{ id: "kr", city: "karnal", col: "#A8322D" }], pins: [{ id: "krp", city: "karnal", label: "Karnal", side: "l" }, { id: "dl", city: "delhi", label: "Delhi", dy: 40 }] });
    const js = cam(p + "-cam", c.t0, c.t1, camTo(kx + 40, ky + 60, 1.7), camTo(kx + 40, ky + 60, 1.95), "power1.out") + mapJS.pulse(p, "kr", c.t0 + 0.1, c.t1, 0.7);
    return { svg, ov: mapTag(p + "-mt") + stamp(p + "-stp", "DEFEATED", 1080, 170, "font-size:120px"), js: js + stampIn(p + "-stp", c.t0 + 1.0) };
  });
  add("b4", "s33", L("b4f") - 0.15, "character", (c) => {
    const p = c.p, g = tent(p + "-set", { night: false });
    const nd = actor(p + "-nd", "nadirShah", 640, 990, 1.45, { pose: { armL: [8, 6], armR: [-80, -30] } }, c.t0, c.t1);
    const ms = actor(p + "-ms", "muhammadShah", 1320, 990, 1.45, { pose: { armL: [6, 4], armR: [-6, -4] }, over: { prop: "none", brows: "worried" }, seed: 12 }, c.t0, c.t1);
    const svg = SVG(g + nd.svg + ms.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.02, 0, 20], [1.1, -40, 40]) + nd.js + ms.js + talk(p + "-ms", L("b4f") + 0.1, L("b4f") + 1.5, 4);
    js += rot(`${p}-nd-armR-upper`, [[c.t0, -60], [c.t0 + 0.8, -95], [c.t0 + 3.5, -95], [c.t0 + 4.2, -30]]) + rot(`${p}-ms-head`, [[c.t0, 0], [c.t0 + 1.2, 12], [c.t1, 14]]);
    js += `CC.track(tl,'${p}-ms-body','sc',[[${r1(c.t0)},[1,1]],[${r1(c.t0 + 1.6)},[1.02,0.96]],[${r1(c.t1)},[1.02,0.95]]]);`;
    return { svg, ov: tag(p + "-tg", "AN EMPEROR WHO COULD NOT LEAVE", 96, 66), js: js + popIn(p + "-tg", L("b4f") + 3.6) };
  });
  add("b4", "s34", L("b4g") - 0.15, "set", (c) => {
    const p = c.p, g = plain(p + "-set", { trees: false });
    const skyline = `<g>${[0, 1, 2, 3, 4].map((i) => `<path d="M${560 + i * 200},560 C${560 + i * 200},480 ${700 + i * 200},480 ${700 + i * 200},560Z" fill="#F2ECE0" stroke="${INK}" stroke-width="2"/><rect x="${626 + i * 200}" y="430" width="8" height="60" fill="${INK}"/>`).join("")}<rect x="380" y="560" width="1300" height="110" fill="#B5523A" stroke="${INK}" stroke-width="2.5"/>${Array.from({ length: 32 }, (_, i) => `<path d="M${380 + i * 40},560 L${406 + i * 40},560 L${406 + i * 40},546 C${406 + i * 40},536 ${380 + i * 40},536 ${380 + i * 40},546Z" fill="#B5523A" stroke="${INK}" stroke-width="2"/>`).join("")}<path d="M980,670 L980,610 C980,580 1060,580 1060,610 L1060,670Z" fill="#2B2622"/><text x="1240" y="640" font-family="CC Bebas" font-size="54" fill="#F4EEE2" letter-spacing="3">DELHI</text></g>`;
    const ban = [0, 1, 2, 3, 4, 5].map((i) => `<g id="${p}-bw${i}" transform="translate(${-200 - i * 160},${980 - (i % 2) * 40})"><g transform="scale(${0.9 + (i % 3) * 0.1})">${banner(p + "-bn" + i, TQ, 300)}</g></g>`).join("");
    const svg = SVG(g + skyline + ban);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.08, 0, 30]) + parallax(p + "-set", c.t0, c.t1, 40);
    js += [0, 1, 2, 3, 4, 5].map((i) => mv(`${p}-bw${i}`, [[c.t0, [-200 - i * 160, 980 - (i % 2) * 40]], [c.t1, [620 - i * 150, 980 - (i % 2) * 40]]], "none") + `CC.track(tl,'${p}-bn${i}-cloth','sk',${j(Array.from({ length: 10 }, (_, k) => [r1(c.t0 + k * (c.t1 - c.t0) / 9), (k + i) % 2 ? 7 : -5]))});`).join("");
    return { svg, ov: tag(p + "-tg", "NEXT STOP: DELHI", 96, 66), js: js + popIn(p + "-tg", c.t0 + 2.2) };
  });

  // ---------------- B5 · 1739 · DELHI (tragedy grade: grey-sepia, silhouettes) ----------------
  add("b5", "s35", L("b5a") - 0.3, "character", (c) => {
    const p = c.p, g = delhiGate(p + "-set", { tone: "sepia", dawn: false });
    const nd = actor(p + "-nd", "nadirShah", 760, 990, 1.3, { pose: { armL: [8, 6], armR: [-8, -6] }, sil: true }, c.t0, c.t1);
    const r = rows(p, p + "-ct", [{ y: 1000, s: 1.0, n: 6, x0: 1300, dx: 110 }]);
    const svg = SVG(symbols(p) + g + `<g class="sil">${r.svg}</g>` + nd.svg);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.12], [1.02], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.02], [1.08]) + nd.js + `CC.walk(tl,'${p}-nd',${r1(c.t0)},${r1(c.t1)},0.6);` + tr(`${p}-nd-root`, [[c.t0, [620, 990, 1.3]], [c.t1, [1000, 990, 1.3]]], "none");
    js += r.rowIds.map((id) => mv(id, [[c.t0, [0, 0]], [c.t1, [300, 0]]], "power1.in")).join("");
    const ov = chip(p + "-chip", "DELHI · 20 MARCH 1739", "THE CITY");
    return { svg, ov, js: js + wipe(p + "-chip", c.t0 + 0.2, c.t1 - 0.3) };
  });
  add("b5", "s36", L("b5b") - 0.15, "crowd", (c) => {
    const p = c.p, g = street(p + "-set", { night: true });
    const r = rows(p, p + "-ct", [{ y: 1000, s: 1.1, n: 7, x0: -300, dx: 260 }]);
    const svg = SVG(symbols(p) + g + `<g class="sil">${r.svg}</g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.02], [1.1, 40, 0]) + parallax(p + "-set", c.t0, c.t1, -60) + r.rowIds.map((id) => mv(id, [[c.t0, [0, 0]], [c.t1, [900, 0]]], "power1.in")).join("") + crowd(r.ids, c.t0, c.t1, 10, 0.32, 3);
    js += [0, 1, 2, 3, 4, 5].map((i) => mv(`${p}-set-smoke${i}`, [[c.t0, [-100 + i * 400, 430 - (i % 2) * 60]], [c.t1, [-80 + i * 400, 380 - (i % 2) * 60]]], "none")).join("");
    return { svg, ov: tag(p + "-tg", "A RUMOUR: “NADIR IS DEAD”", 96, 66), js: js + popIn(p + "-tg", c.t0 + 0.6) };
  });
  add("b5", "s37", L("b5c") - 0.15, "character", (c) => {
    const p = c.p, g = street(p + "-set", { night: false });
    const nd = actor(p + "-nd", "nadirShah", 960, 520, 1.25, { pose: { armL: [8, 6], armR: [-8, -6] }, sil: true }, c.t0, c.t1);
    const roof = `<rect x="560" y="520" width="800" height="600" fill="#6B635A" stroke="#221F1C" stroke-width="3"/><rect x="540" y="500" width="840" height="24" fill="#4A443E"/>`;
    const svg = SVG(g + roof + nd.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 80], [1.08, 0, 120]) + nd.js + rot(`${p}-nd-armR-upper`, [[c.t0, -8], [c.t0 + 1.8, -8], [c.t0 + 2.4, -150], [c.t1, -150]]) + rot(`${p}-nd-armR-lower`, [[c.t0 + 1.8, -6], [c.t0 + 2.4, -20]]);
    return { svg, ov: "", js };
  });
  add("b5", "s38", L("b5d") - 0.15, "set", (c) => {
    const p = c.p, g = street(p + "-set", { night: false });
    const svg = SVG(g);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 60, 0], [1.06, -40, 0], "none") + parallax(p + "-set", c.t0, c.t1, 60);
    js += [0, 1, 2, 3, 4, 5].map((i) => mv(`${p}-set-smoke${i}`, [[c.t0, [-100 + i * 400, 430 - (i % 2) * 60]], [c.t1, [-60 + i * 400, 360 - (i % 2) * 60]]], "none")).join("");
    const ov = `<div id="${p}-st" class="card" style="left:96px;top:120px;padding:24px 34px;opacity:0;background:#E3DCCF"><div class="big" style="font-size:44px;color:#4A443E">AN ESTIMATED</div><div class="big" style="font-size:140px;color:#221F1C">20,000–30,000</div><div class="big" style="font-size:52px;color:#221F1C">PEOPLE KILLED IN A FEW HOURS</div></div>` + tag(p + "-tg", "ESTIMATE · TRUE NUMBER UNKNOWN", 96, 560, "background:#D8CFBF");
    return { svg, ov, js: js + popIn(p + "-st", L("b5d") + 0.8) + popIn(p + "-tg", L("b5d") + 4.4) };
  });
  add("b5", "s39", L("b5e") - 0.15, "set", (c) => {
    const p = c.p, g = street(p + "-set", { night: false });
    const svg = SVG(g);
    let js = cam(p + "-cam", c.t0, c.t1, camTo(700, 650, 1.6), camTo(900, 660, 1.75), "none");
    // doors swing shut one by one (scaleX toward the hinge line)
    js += [1, 2, 3].map((i, k) => `tl.fromTo(CC.$('${p}-set-door${i}'),{opacity:0.25},{opacity:1,duration:0.18,ease:'power3.in',immediateRender:false},${r1(c.t0 + 0.4 + k * 0.7)});tl.set(CC.$('${p}-set-door${i}'),{opacity:0.25},${r1(c.t0)});`).join("");
    return { svg, ov: "", js };
  });
  add("b5", "s40", L("b5f") - 0.15, "stamp", (c) => {
    const p = c.p;
    const svg = SVG(`<rect x="-200" y="-200" width="2320" height="1480" fill="#8E857A"/>` + `<g transform="translate(960,560)"><g id="${p}-sc" transform="translate(0,0)">${scroll(p + "-scr", 760, 640, "#E3DCCF")}${scriptLines(p + "-sl", 600, 9, -300, -230, 52, "#4A443E")}</g></g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.08]) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => draw(`${p}-sl-l${i}`, c.t0 + 0.1 + i * 0.22, 0.4)).join("");
    const ov = stamp(p + "-stp", "A HUGE FINE", 560, 600, "color:#5A2E28;border-color:#5A2E28");
    return { svg, ov, js: js + stampIn(p + "-stp", L("b5f") + 2.4) };
  });

  // ---------------- B6 · 1739 · THE LOOT ----------------
  add("b6", "s41", L("b6a") - 0.3, "crowd", (c) => {
    const p = c.p, g = vault(p + "-set");
    const chests = [0, 1, 2, 3].map((i) => `<g id="${p}-cw${i}" transform="translate(${300 + i * 420},${880})">${chest(p + "-ch" + i, { open: i % 2 === 0 })}</g>`).join("");
    const r = rows(p, p + "-sp", [{ y: 1000, s: 1.2, n: 8, x0: -200, dx: 300 }]);
    const svg = SVG(symbols(p) + g + chests + r.svg);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.12], [1.02], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.02], [1.1, -50, 20]) + parallax(p + "-set", c.t0, c.t1, 40);
    js += [0, 1, 2, 3].map((i) => mv(`${p}-cw${i}`, [[c.t0 + 1 + i * 0.4, [300 + i * 420, 880]], [c.t1, [300 + i * 420 + 500, 880]]], "power1.in")).join("") + r.rowIds.map((id) => mv(id, [[c.t0, [0, 0]], [c.t1, [520, 0]]], "none")).join("") + crowd(r.ids, c.t0, c.t1, 7, 0.45, 6);
    const ov = chip(p + "-chip", "DELHI · 1739", "THE LOOT");
    return { svg, ov, js: js + wipe(p + "-chip", c.t0 + 0.2, c.t1 - 0.4) };
  });
  add("b6", "s42", L("b6c") - 0.15, "stat", (c) => {
    // treasure-count in a dim but visible vault: coin stacks rise
    const p = c.p, g = vault(p + "-set");
    const stacks = [0, 1, 2, 3, 4, 5, 6].map((i) => `<g transform="translate(${1060 + i * 110},${1000 - (i % 2) * 20})">${coinStack(p + "-k" + i, 14 + (i * 5) % 9)}</g>`).join("");
    const svg = SVG(g + stacks);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.06, -30, 0]) + parallax(p + "-set", c.t0, c.t1, 30);
    for (let i = 0; i < 7; i++) { const n = 14 + (i * 5) % 9; for (let k = 0; k < n; k++) js += `tl.set(CC.$('${p}-k${i}-c${k}'),{attr:{opacity:0}},${r1(c.t0)});tl.set(CC.$('${p}-k${i}-c${k}'),{attr:{opacity:1}},${r1(c.t0 + 0.2 + i * 0.12 + k * 0.11)});`; }
    const ov = `<div id="${p}-st" class="card" style="left:96px;top:150px;width:860px;padding:28px 36px;opacity:0"><div class="big" style="font-size:200px;color:#9C7A2E">70 CRORE</div><div class="big" style="font-size:64px">RUPEES · ONE ESTIMATE</div><div style="font-size:38px;font-weight:600;margin-top:10px">1 crore = 10 million</div></div>` + tag(p + "-tg", "ESTIMATE · RAJIV AHIR'S HISTORY", 96, 700);
    return { svg, ov, js: js + popIn(p + "-st", L("b6c") + 1.6, { x: -60 }) + popIn(p + "-tg", L("b6c") + 2.4) };
  });
  add("b6", "s43", L("b6d") - 0.15, "object", (c) => {
    const p = c.p, b = L("b6d"), g = vault(p + "-set");
    const svg = SVG(g + `<rect x="-200" y="880" width="2320" height="400" fill="#7A2E28"/>` +
      `<g transform="translate(620,880) scale(1.05)"><g id="${p}-th" opacity="0">${peacockThrone(p + "-pt")}</g></g>` +
      `<g transform="translate(1260,560)"><g id="${p}-g1" opacity="0">${kohinoor(p + "-kn", { size: 1.1 })}</g></g>` +
      `<g transform="translate(1600,620)"><g id="${p}-g2" opacity="0">${kohinoor(p + "-dn", { col: "#F2C6CF", size: 1.1 })}</g></g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.06]) + popIn(p + "-th", b + 0.6, { y: 60 }) + popIn(p + "-g1", b + 3.0, { scale: 0.4 }) + popIn(p + "-g2", b + 5.0, { scale: 0.4 });
    js += `CC.track(tl,'${p}-kn-spark','rs',[[${r1(b + 3)},[0,0.4]],[${r1(b + 3.6)},[60,1.2]],[${r1(c.t1)},[180,0.9]]]);CC.track(tl,'${p}-dn-spark','rs',[[${r1(b + 5)},[0,0.4]],[${r1(b + 5.6)},[60,1.2]],[${r1(c.t1)},[150,0.9]]]);`;
    const ov = `<div id="${p}-l1" class="lbl" style="left:330px;top:150px;opacity:0">PEACOCK THRONE</div><div id="${p}-l2" class="lbl" style="left:1120px;top:330px;opacity:0">KOHINOOR</div><div id="${p}-l3" class="lbl" style="left:1340px;top:820px;opacity:0">DARYA-I-NOOR · “SEA OF LIGHT”</div>`;
    return { svg, ov, js: js + popIn(p + "-l1", b + 1.0) + popIn(p + "-l2", b + 3.3) + popIn(p + "-l3", b + 5.4) };
  });
  add("b6", "s44", L("b6e") - 0.15, "stamp", (c) => {
    // demands on the nobles: a scroll of sums, coins dropping
    const p = c.p;
    const svg = SVG(`<rect x="-200" y="-200" width="2320" height="1480" fill="#6E4A32"/>` + `<g transform="translate(760,560)">${scroll(p + "-scr", 700, 700)}${scriptLines(p + "-sl", 520, 10, -270, -260, 54)}</g>` + [0, 1, 2].map((i) => `<g transform="translate(${1380 + i * 140},${980})">${coinStack(p + "-k" + i, 10 - i * 3)}</g>`).join(""));
    let js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.08, 40, 0]) + [...Array(10).keys()].map((i) => draw(`${p}-sl-l${i}`, c.t0 + 0.1 + i * 0.25, 0.4)).join("");
    for (let i = 0; i < 3; i++) for (let k = 10 - i * 3 - 1; k >= 0; k--) js += `tl.set(CC.$('${p}-k${i}-c${k}'),{attr:{opacity:1}},${r1(c.t0)});tl.set(CC.$('${p}-k${i}-c${k}'),{attr:{opacity:0}},${r1(c.t0 + 1.2 + i * 0.4 + (10 - k) * 0.12)});`;
    return { svg, ov: stamp(p + "-stp", "DEMANDS", 1180, 170, "font-size:120px"), js: js + stampIn(p + "-stp", c.t0 + 1.0) };
  });
  add("b6", "s45", L("b6e") + 4.4, "object", (c) => {
    // Saadat Khan's death is spoken gently; on screen only his empty seat in his tent, dim but visible, slow push
    const p = c.p, g = tent(p + "-set", { night: false, col: "#8E6A7E", col2: "#7A566C" });
    const svg = SVG(g + `<g transform="translate(900,880)"><rect x="-280" y="-96" width="560" height="96" rx="20" fill="#7A4B6B" stroke="${INK}" stroke-width="3"/><rect x="-240" y="-270" width="480" height="180" rx="40" fill="#9A6A8C" stroke="${INK}" stroke-width="3"/><circle cx="-200" cy="-96" r="34" fill="#C9A24A" stroke="${INK}" stroke-width="3"/><circle cx="200" cy="-96" r="34" fill="#C9A24A" stroke="${INK}" stroke-width="3"/></g>
      <g transform="translate(1380,880) scale(1.6)">${lamp(p + "-lp")}</g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], [1.08, 0, 30], "none") + `CC.track(tl,'${p}-lp-flame','sc',${j(Array.from({ length: 16 }, (_, i) => [r1(c.t0 + i * (c.t1 - c.t0) / 15), [1, i % 2 ? 1.12 : 0.94]]))});`;
    return { svg, ov: "", js };
  });
  add("b6", "s46", L("b6f") - 0.15, "map", (c) => {
    const p = c.p, [kx, ky] = city("kabul");
    const svg = mapSVG(p, { regions: { ...BASE, westOfIndus: { fill: TQ, wipe: true } }, indus: true, flags: [{ id: "co", city: "calcutta", s: 1.1 }], pins: [{ id: "kb", city: "kabul", label: "Kabul", side: "l" }], labels: [{ id: "in", ll: [70.2, 29.6], text: "RIVER INDUS", size: 44, col: "#1F5F8C", t: 1 }, { id: "ps", ll: [66.2, 31], text: "TO PERSIA", size: 60, col: "#F4EEE2", t: 1 }] });
    const js = cam(p + "-cam", c.t0, c.t1, camTo(760, 420, 1.45), camTo(760, 420, 1.6)) + mapJS.wipe(p, "westOfIndus", c.t0 + 0.6, 1.0, "lr") + mapJS.label(p, "ps", c.t0 + 1.5) + mapJS.label(p, "in", c.t0 + 0.3);
    return { svg, ov: mapTag(p + "-mt"), js };
  });
  add("b6", "s47", L("b6g") - 0.15, "character", (c) => {
    // Nadir "restores" Muhammad Shah by seating him on the throne, then strides away
    const p = c.p, g = hall(p + "-set"), b = L("b6g");
    const S0 = 1.42, tx = 700, ty = 990;
    const nd = actor(p + "-nd", "nadirShah", 1500, ty, S0, { pose: { armL: [8, 6], armR: [-80, -20] } }, c.t0, c.t1);
    const ms = actor(p + "-ms", "muhammadShah", 1080, ty, S0, { pose: { armL: [6, 4], armR: [-6, -4] }, over: { prop: "none" }, seed: 14 }, c.t0, c.t1);
    const st = seated(p + "-mt", "muhammadShah", tx, ty, S0, { over: { prop: "none" }, pose: { armL: [14, 10], armR: [-14, -10] }, seed: 15 }, c.t0, c.t1);
    const svg = SVG(g + `<g id="${p}-seat" opacity="0">${st.svg}</g><g transform="translate(${tx},${ty}) scale(${S0})"><g id="${p}-empty">${throneBack(p + "-eb")}${throneFront(p + "-ef")}</g></g><g id="${p}-stand">${ms.svg}</g>` + nd.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 30], [1.06, 40, 40]) + nd.js + ms.js + st.js;
    js += rot(`${p}-nd-armR-upper`, [[c.t0, -60], [b + 0.6, -95], [b + 2.4, -95], [b + 3.0, -10]]);
    js += `CC.walk(tl,'${p}-ms',${r1(b + 0.8)},${r1(b + 2.4)},0.55);` + tr(`${p}-ms-root`, [[b + 0.8, [1080, ty, S0]], [b + 2.4, [tx + 10, ty, S0]]], "none");
    js += `CC.show(tl,'${p}-stand',${r1(c.t0)},1);CC.show(tl,'${p}-seat',${r1(c.t0)},0);CC.show(tl,'${p}-empty',${r1(c.t0)},1);CC.show(tl,'${p}-stand',${r1(b + 2.45)},0);CC.show(tl,'${p}-empty',${r1(b + 2.45)},0);CC.show(tl,'${p}-seat',${r1(b + 2.45)},1);`;
    js += tr(`${p}-nd-root`, [[b + 3.4, [1500, ty, S0]], [c.t1, [1760, ty, S0]]]) + `CC.walk(tl,'${p}-nd',${r1(b + 3.4)},${r1(c.t1)},0.55);` + rot(`${p}-mt-head`, [[b + 2.5, 0], [c.t1, 10]]);
    return { svg, ov: tag(p + "-tg", "RESTORED — TO A THRONE WITHOUT ITS TREASURE", 96, 66, "font-size:40px"), js: js + popIn(p + "-tg", b + 3.6) };
  });
  add("b6", "s48", L("b6h") - 0.15, "map", (c) => {
    const p = c.p, b = L("b6h");
    const svg = mapSVG(p, { regions: { ...BASE, westOfIndus: { fill: TQ } }, flags: [{ id: "co", city: "calcutta", s: 1.6 }],
      arrows: [{ id: "home", cities: ["delhi", "lahore", "kabul", "kandahar"], col: TQ, w: 14 }, { id: "af", pts: [[66, 33.5], [70, 32.5], [74.4, 30.8], [76.6, 29.3]], col: PW.afghans.fill, w: 14, dash: false }, { id: "mr", pts: [[74.6, 19.4], [76, 23], [76.9, 27.6]], col: PW.marathas.fill, w: 14, dash: false }, { id: "co", pts: [[88.2, 22.9], [85, 25.2], [81, 27.2], [78, 28.6]], col: PW.company.fill, w: 14, dash: false }],
      markers: [{ id: "dl", city: "delhi", col: "#A8322D" }], labels: [{ id: "a", ll: [66.6, 34.4], text: "AFGHANS", col: "#F4EEE2", t: 1 }, { id: "m", ll: [74.4, 18.2], text: "MARATHAS", col: "#F4EEE2", t: 1 }, { id: "c", ll: [89.6, 21.2], text: "A COMPANY OF MERCHANTS", size: 46, col: "#A8322D", t: 1 }] });
    let js = cam(p + "-cam", c.t0, c.t1, camTo(980, 520, 1.05), camTo(980, 470, 1.15)) + mapJS.arrow(p, "home", c.t0 + 0.2, 2.2, true, 1);
    js += mapJS.label(p, "a", b + 3.4) + mapJS.arrow(p, "af", b + 3.5, 1.0, false) + mapJS.label(p, "m", b + 4.3) + mapJS.arrow(p, "mr", b + 4.4, 1.0, false) + mapJS.label(p, "c", b + 5.3) + mapJS.arrow(p, "co", b + 5.4, 1.2, false) + mapJS.pulse(p, "dl", b + 6.4, c.t1, 0.8);
    return { svg, ov: mapTag(p + "-mt"), js };
  });

  // ---------------- B7 · AFTERSHOCKS ----------------
  add("b7", "s49", L("b7a") - 0.3, "title", (c) => {
    const p = c.p, g = desk(p + "-set");
    const book = `<g transform="translate(1180,560) rotate(-6)"><g id="${p}-bk" transform="translate(0,0) scale(1,1)"><rect x="-260" y="-360" width="520" height="720" fill="#1F3A4A" stroke="${INK}" stroke-width="4"/><rect x="-260" y="-360" width="40" height="720" fill="#152A36"/><rect x="-200" y="-300" width="400" height="6" fill="#C9A24A"/><rect x="-200" y="280" width="400" height="6" fill="#C9A24A"/>
      <text x="20" y="-120" text-anchor="middle" font-family="CC Bebas" font-size="92" fill="#F4EEE2" letter-spacing="3">INDIA</text><text x="20" y="-20" text-anchor="middle" font-family="CC Bebas" font-size="92" fill="#F4EEE2" letter-spacing="3">CONQUERED</text><text x="20" y="200" text-anchor="middle" font-family="CC Inter" font-weight="800" font-size="40" fill="#C9A24A">JON WILSON</text></g></g>`;
    const svg = SVG(g + book);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.12], [1.02], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.02], [1.1, -60, 0]) + tr(`${p}-bk`, [[c.t0, [0, 40, 0.96]], [c.t1, [0, 0, 1]]]);
    const ov = chip(p + "-chip", "INDIA · AFTER 1739", "AFTERSHOCKS") + nameCard(p + "-nc", "2016", "Jon Wilson", "Historian · author of India Conquered", "#1F3A4A") + `<div class="lbl" style="left:96px;top:160px;font-size:36px;font-weight:600;opacity:1">Book cover drawn for illustration</div>`;
    return { svg, ov, js: js + wipe(p + "-chip", c.t0 + 0.2, c.t1 - 0.4) + wipe(p + "-nc", c.t0 + 0.8, c.t1 - 0.2) };
  });
  // quote cards: at most 10 s each; a Company ship shot sits between the halves
  const quoteCard = (id, at, end, lid, words, keys, revealEnd, short) => add("b7", id, at, "quote", (c) => {
    const p = c.p, a = L(lid), stop = Math.min(E(lid), revealEnd != null ? a + revealEnd : E(lid));
    const svg = SVG(`<rect x="-200" y="-200" width="2320" height="1480" fill="#6E4A32"/>${Array.from({ length: 30 }, (_, i) => `<path d="M-200,${i * 40} C400,${i * 40 + 12} 1200,${i * 40 - 10} 2120,${i * 40 + 6}" stroke="#5E3E2A" stroke-width="4" fill="none"/>`).join("")}<rect x="150" y="90" width="1620" height="${short ? 760 : 860}" fill="#F2E8D2" stroke="${INK}" stroke-width="4"/><rect x="164" y="104" width="1620" height="${short ? 760 : 860}" fill="none" stroke="${INK}" stroke-width="3"/>`);
    const totalChars = words.reduce((s, w) => s + w.length + 1, 0);
    let acc = 0, js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.04]);
    words.forEach((w, i) => { const t = Math.max(c.t0 + 0.05, a + (acc / totalChars) * (stop - a)); acc += w.length + 1; js += `tl.set(CC.$('${p}-q-w${i}'),{opacity:0},${r1(c.t0)});tl.fromTo(CC.$('${p}-q-w${i}'),{opacity:0,y:14},{opacity:1,y:0,duration:0.16,ease:'power2.out',immediateRender:false},${r1(t - 0.05)});`; });
    const ov = quote(p + "-q", words, keys) + `<div class="lbl" style="left:220px;top:${short ? 720 : 830}px;font-size:38px">— Jon Wilson, <i>India Conquered</i> (quoted in Ahir, p. 65)</div>`;
    return { svg, ov, js };
  });
  const q1 = "“Nader Shah was Mughal emperor for only fifty-seven days, in 1739, but those days created aftershocks that transformed India's politics…".split(" ");
  const q2 = "Those fifty-seven days laid the ground which allowed the East India Company to conquer territory in India for the first time.”".split(" ");
  quoteCard("s50", L("b7b") - 0.15, null, "b7b", q1, [7, 8, 14], 9.3, false);
  add("b7", "s50b", L("b7b") + 9.7, "set", (c) => {
    // between the two halves of the quote: a Company ship under sail
    const p = c.p, g = tradingPost(p + "-set");
    const ship = `<g id="${p}-sh" transform="translate(900,860)"><g transform="scale(1.9)"><path d="M-160,0 L160,0 L130,60 L-130,60Z" fill="#5A3E2A" stroke="${INK}" stroke-width="2.5"/><path d="M-40,0 L-40,-260 M60,0 L60,-220" stroke="#4A3A2C" stroke-width="8"/><path d="M-36,-250 L-36,-60 L-130,-70 C-110,-150 -110,-200 -36,-250Z M64,-210 L64,-60 L150,-70 C140,-130 130,-170 64,-210Z" fill="#F4EEE2" stroke="${INK}" stroke-width="2"/>${companyFlag(p + "-fl", 1).replace('<g id="' + p + '-fl"', '<g id="' + p + '-fl" transform="translate(-40,-260)"')}</g></g>`;
    const svg = SVG(g + ship);
    let js = cam(p + "-cam", c.t0, c.t1, [1.05, 0, 0], [1.1, -40, 0]) + parallax(p + "-set", c.t0, c.t1, 60) + tr(`${p}-sh`, [[c.t0, [820, 860, 1]], [c.t1, [980, 866, 1]]], "none");
    js += `CC.track(tl,'${p}-set-flagcloth','sk',${j(Array.from({ length: 8 }, (_, i) => [r1(c.t0 + i * (c.t1 - c.t0) / 7), i % 2 ? 6 : -5]))});`;
    return { svg, ov: tag(p + "-tg", "THE EAST INDIA COMPANY", 96, 66), js: js + popIn(p + "-tg", c.t0 + 0.3) };
  });
  quoteCard("s51", L("b7c") + 2.0, null, "b7c", q2, [1, 2, 9, 10, 11, 13, 14], null, true);
  add("b7", "s52", L("b7d") - 0.15, "stat", (c) => {
    // coins drain out of Delhi's chest toward the governors and the army, then the lines are cut
    const p = c.p, b = L("b7e");
    const node = (x, y, col, txt) => `<g transform="translate(${x},${y})"><circle r="92" fill="${col}" stroke="${INK}" stroke-width="4"/><text y="14" text-anchor="middle" font-family="CC Bebas" font-size="46" fill="#F4EEE2">${txt}</text></g>`;
    const ends = [[420, 300], [1500, 300], [420, 850], [1500, 850]];
    let coins = "";
    ends.forEach(([x, y], i) => { for (let k = 0; k < 3; k++) coins += `<g id="${p}-cf${i}${k}" transform="translate(960,560)" opacity="0"><ellipse rx="22" ry="8" fill="#E3C77A" stroke="${INK}" stroke-width="2"/></g>`; });
    const svg = SVG(`<rect x="-200" y="-200" width="2320" height="1480" fill="#E9DCC0"/>` +
      ends.map(([x, y], i) => `<path id="${p}-l${i + 1}" d="M960,560 L${x},${y}" stroke="${INK}" stroke-width="10" stroke-dasharray="30 18"/>`).join("") +
      node(420, 300, PW.hyderabad.fill, "HYDERABAD") + node(1500, 300, PW.awadh.fill, "AWADH") + node(420, 850, PW.bengal.fill, "BENGAL") + node(1500, 850, PW.mughal.fill, "ARMY") +
      `<g transform="translate(960,640) scale(1.4)">${chest(p + "-ch", { open: true, gold: false })}<g transform="translate(0,-96)">${coinStack(p + "-k", 9)}</g></g><text x="960" y="760" text-anchor="middle" font-family="CC Bebas" font-size="64" fill="${INK}">DELHI'S TREASURY</text>` + coins +
      [1, 2, 3, 4].map((i) => `<g transform="translate(${i % 2 ? 690 : 1230},${i < 3 ? 430 : 705})"><g id="${p}-x${i}" opacity="0"><path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke="#A8322D" stroke-width="14" stroke-linecap="round"/></g></g>`).join(""));
    let js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.06]) + [1, 2, 3, 4].map((i) => draw(`${p}-l${i}`, c.t0 + 0.2 + i * 0.25, 0.6)).join("");
    // coins leave the chest one by one along the lines; the stack drains
    for (let k = 8; k >= 0; k--) js += `tl.set(CC.$('${p}-k-c${k}'),{attr:{opacity:1}},${r1(c.t0)});tl.set(CC.$('${p}-k-c${k}'),{attr:{opacity:0}},${r1(c.t0 + 0.6 + (8 - k) * 0.42)});`;
    ends.forEach(([x, y], i) => { for (let k = 0; k < 3; k++) { const t = c.t0 + 0.7 + (i * 3 + k) * 0.3; js += `CC.show(tl,'${p}-cf${i}${k}',${r1(t)},1);` + `CC.track(tl,'${p}-cf${i}${k}','mv',[[${r1(t)},[960,560]],[${r1(t + 0.9)},[${x},${y}],'power1.in']]);` + `CC.show(tl,'${p}-cf${i}${k}',${r1(t + 0.92)},0);`; } });
    js += [1, 2, 3, 4].map((i) => `CC.popIn(tl,'${p}-x${i}',${r1(b + 0.6 + i * 0.5)},{scale:0.3});`).join("");
    return { svg, ov: stamp(p + "-stp", "EMPTY", 1290, 480, "font-size:110px"), js: js + stampIn(p + "-stp", L("b7e") + 0.4) };
  });
  add("b7", "s53", L("b7f") - 0.15, "map", (c) => {
    const p = c.p, b = L("b7f");
    const regions = { ...BASE, westOfIndus: { fill: TQ }, hyderabad: { fill: PW.hyderabad.fill, wipe: true }, bengal: { fill: PW.bengal.fill, wipe: true }, awadh: { fill: PW.awadh.fill, wipe: true }, maratha: { fill: PW.marathas.fill } };
    const svg = mapSVG(p, { regions, borders: ["hyderabad", "bengal", "awadh"], flags: [{ id: "co", city: "calcutta", s: 1.3 }], arrows: [{ id: "m1", pts: [[75.6, 21.4], [76.4, 24.8], [77, 27.6]], col: PW.marathas.fill, w: 16, dash: false }, { id: "m2", pts: [[77.4, 21.6], [80.4, 23.8], [83.2, 25.4]], col: PW.marathas.fill, w: 16, dash: false }], labels: [{ id: "hy", ll: [78, 17.6], text: "HYDERABAD", size: 48, col: "#F4EEE2", t: 1 }, { id: "bg", ll: [87.2, 24.2], text: "BENGAL", col: "#F4EEE2", t: 1 }, { id: "aw", ll: [81.4, 27.0], text: "AWADH", col: "#F4EEE2", t: 1 }] });
    let js = cam(p + "-cam", c.t0, c.t1, camTo(1020, 540, 1.12), camTo(1040, 500, 1.25)) + mapJS.wipe(p, "hyderabad", b + 2.6, 0.6, "lr") + mapJS.label(p, "hy", b + 2.9) + mapJS.wipe(p, "bengal", b + 3.3, 0.6, "rl") + mapJS.label(p, "bg", b + 3.6) + mapJS.wipe(p, "awadh", b + 3.9, 0.6) + mapJS.label(p, "aw", b + 4.2) + mapJS.arrow(p, "m1", b + 5.4, 1.4, false) + mapJS.arrow(p, "m2", b + 5.6, 1.4, false);
    js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.24, 0, 0], camTo(1020, 540, 1.12), "power3.out") + js.replace(`CC.cam(tl,'${p}-cam',${r1(c.t0)},`, `CC.cam(tl,'${p}-cam',${r1(c.t0 + 0.25)},`);
    return { svg, ov: mapTag(p + "-mt") + chip(p + "-chip", "INDIA · 1740s", "THE SCRAMBLE") + tag(p + "-tg", "NO LONGER WAITING FOR DELHI", 96, 160), js: js + wipe(p + "-chip", c.t0 + 0.2, c.t1 - 0.4) + popIn(p + "-tg", b + 1.0) };
  });
  add("b7", "s54", L("b7g") - 0.15, "character", (c) => {
    const p = c.p, g = tradingPost(p + "-set");
    const cm = actor(p + "-cm", "companyMerchant", 1560, 1000, 1.45, { pose: { armL: [10, 8], armR: [-90, -20] } }, c.t0, c.t1);
    const svg = SVG(g + cm.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], [1.08, -50, 10]) + parallax(p + "-set", c.t0, c.t1, 50) + cm.js + talk(p + "-cm", L("b7g") + 0.3, L("b7g") + 3.4, 44);
    js += rot(`${p}-cm-armR-upper`, [[c.t0, -60], [c.t0 + 1, -110], [c.t0 + 3.5, -100], [c.t0 + 4.5, -20], [c.t1, -25]]) + rot(`${p}-cm-head`, [[c.t0, 0], [c.t0 + 1, 6], [c.t1, -4]]);
    js += `CC.track(tl,'${p}-set-flagcloth','sk',${j(Array.from({ length: 16 }, (_, i) => [r1(c.t0 + i * (c.t1 - c.t0) / 15), i % 2 ? 6 : -5]))});` + mv(`${p}-set-ship1`, [[c.t0, [380, 800]], [c.t1, [460, 806]]], "none");
    const ov = tag(p + "-tg", "SHIPS · GUNS · HIRED SOLDIERS", 96, 66);
    return { svg, ov, js: js + popIn(p + "-tg", L("b7g") + 1.6) };
  });
  add("b7", "s55", L("b7h") - 0.15, "split", (c) => {
    const p = c.p;
    const svg = SVG(`<rect x="-200" y="-200" width="1160" height="1480" fill="#D9E3DE"/><rect x="960" y="-200" width="1160" height="1480" fill="#E9DCC0"/><path d="M960,-200 L960,1300" stroke="${INK}" stroke-width="8"/>
      <g transform="translate(480,700)"><g id="${p}-cl" transform="scale(1,1)"><circle r="170" fill="#F4EEE2" stroke="${INK}" stroke-width="6"/><path id="${p}-hand" d="M0,0 L0,-130" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><text y="80" text-anchor="middle" font-family="CC Bebas" font-size="80">57 DAYS</text></g></g>
      <g transform="translate(1440,780)">${[0, 1, 2, 3, 4].map((i) => `<rect id="${p}-b${i}" x="${-250 + i * 104}" y="${-80 - i * 70}" width="80" height="${80 + i * 70}" fill="#2F5D3A" stroke="${INK}" stroke-width="4" opacity="1"/>`).join("")}<path d="M-280,0 L280,0" stroke="${INK}" stroke-width="5"/></g>`);
    let js = cam(p + "-cam", c.t0, c.t1, [1.0], [1.04]);
    js += `tl.set(CC.$('${p}-hand'),{attr:{transform:'rotate(0)'}},${r1(c.t0)});tl.fromTo(CC.$('${p}-hand'),{attr:{transform:'rotate(0)'}},{attr:{transform:'rotate(330)'},duration:${r1(c.t1 - c.t0)},ease:'none',immediateRender:false},${r1(c.t0)});`;
    js += [0, 1, 2, 3, 4].map((i) => `tl.set(CC.$('${p}-b${i}'),{attr:{fill:'#2F5D3A'}},${r1(c.t0)});tl.to(CC.$('${p}-b${i}'),{attr:{fill:'#B5A27E'},duration:0.4},${r1(c.t0 + 2.5 + i * 0.5)});`).join("");
    const ov = `<div id="${p}-a" class="card" style="left:96px;top:110px;width:760px;padding:20px 28px;opacity:0"><div class="big" style="font-size:44px;color:#1F3A4A">ONE VIEW · WILSON</div><div class="big" style="font-size:64px">A FEW WEEKS CHANGED EVERYTHING</div></div>
      <div id="${p}-b" class="card" style="left:1064px;top:110px;width:760px;padding:20px 28px;opacity:0"><div class="big" style="font-size:44px;color:#2F5D3A">ANOTHER VIEW</div><div class="big" style="font-size:64px">THE DECLINE BEGAN LONG BEFORE</div></div>` + tag(p + "-tg", "HISTORIANS DISAGREE · SOURCES BELOW", 600, 960);
    return { svg, ov, js: js + popIn(p + "-a", c.t0 + 0.4, { x: -60 }) + popIn(p + "-b", c.t0 + 2.4, { x: 60 }) + popIn(p + "-tg", c.t0 + 4.2) };
  });

  // ---------------- B8 · TAKEAWAY ----------------
  add("b8", "s56", L("b8a") - 0.3, "concept", (c) => {
    // the belief that it cannot be touched: the emperor's jewelled sarpech under a glass dome; the dome cracks and falls away
    const p = c.p, b = L("b8b"), g = hall(p + "-set", { warm: false });
    const shards = [[-200, -60, -120, -260, -40, -120], [-40, -120, -120, -260, 40, -300], [40, -300, 120, -250, 30, -110], [30, -110, 120, -250, 200, -60], [-200, -60, -40, -120, -60, 10], [-60, 10, -40, -120, 30, -110], [30, -110, 60, 10, -60, 10], [60, 10, 30, -110, 200, -60]];
    const dome = shards.map((s, i) => `<g id="${p}-sh${i}"><path d="M${s[0]},${s[1]} L${s[2]},${s[3]} L${s[4]},${s[5]}Z" fill="#CFE0D6" fill-opacity="0.55" stroke="${INK}" stroke-width="3"/></g>`).join("");
    const svg = SVG(g + `<rect x="-200" y="820" width="2320" height="400" fill="#7A2E28"/>` +
      `<g transform="translate(960,820) scale(2.2)"><rect x="-230" y="0" width="460" height="40" fill="#B8362E" stroke="${INK}" stroke-width="3"/><path d="M-160,0 C-160,-30 160,-30 160,0Z" fill="#9E2B25" stroke="${INK}" stroke-width="3"/><g transform="translate(0,-110) scale(0.9)">${sarpech(p + "-sp")}</g>${dome}<path id="${p}-ck" d="M-20,-290 L-5,-220 L-40,-170 L10,-120 L-10,-60" fill="none" stroke="#F4EEE2" stroke-width="5"/></g>`);
    let js = cam(p + "-cam", c.t0, c.t0 + 0.25, [1.12, 0, 60], [1.02, 0, 40], "power3.out") + cam(p + "-cam", c.t0 + 0.25, c.t1, [1.02, 0, 40], [1.1, 0, 80]) + draw(p + "-ck", b + 2.6, 0.5);
    shards.forEach((s, i) => { const dx = (s[0] + s[2] + s[4]) / 3; js += `tl.set(CC.$('${p}-sh${i}'),{x:0,y:0,rotation:0},${r1(c.t0)});tl.fromTo(CC.$('${p}-sh${i}'),{x:0,y:0,rotation:0},{x:${Math.round(dx * 0.6)},y:${260 + i * 18},rotation:${(i % 2 ? 1 : -1) * (20 + i * 6)},duration:0.9,ease:'power2.in',immediateRender:false},${r1(b + 3.4)});`; });
    js += `tl.set(CC.$('${p}-ck'),{attr:{opacity:1}},${r1(c.t0)});tl.set(CC.$('${p}-ck'),{attr:{opacity:0}},${r1(b + 3.4)});`;
    const ov = chip(p + "-chip", "DELHI · 1739", "THE TAKEAWAY") + stamp(p + "-stp", "UNTOUCHABLE?", 520, 150, "font-size:120px");
    return { svg, ov, js: js + wipe(p + "-chip", c.t0 + 0.2, c.t0 + 3.6) + stampIn(p + "-stp", b + 2.2) };
  });
  add("b8", "s57", L("b8c") - 0.15, "map", (c) => {
    const p = c.p, b = L("b8c");
    const svg = mapSVG(p, { regions: EP02_END, borders: ["hyderabad", "bengal", "awadh"], flags: [{ id: "co", city: "calcutta", s: 1.5 }], markers: [{ id: "dl", city: "delhi" }],
      arrows: [{ id: "af", pts: [[66, 33.5], [70.5, 32.6], [74.6, 30.6], [76.6, 29.3]], col: PW.afghans.fill, w: 16, dash: false }, { id: "mr", pts: [[75.4, 20.4], [76.5, 24], [77, 27.5]], col: PW.marathas.fill, w: 16, dash: false }, { id: "co", pts: [[88.2, 22.9], [85, 25.2], [81, 27.2], [78, 28.5]], col: PW.company.fill, w: 16, dash: false }, { id: "aw", pts: [[81.4, 26.6], [79.6, 27.6], [78.1, 28.4]], col: PW.awadh.fill, w: 14, dash: false }, { id: "hy", pts: [[78.4, 18.6], [78.6, 23], [77.6, 27.4]], col: PW.hyderabad.fill, w: 14, dash: false }] });
    let js = cam(p + "-cam", c.t0, c.t1, camTo(1000, 500, 1.1), camTo(980, 420, 1.3)) + mapJS.pulse(p, "dl", c.t0, c.t1, 0.8);
    ["af", "mr", "co", "aw", "hy"].forEach((id, i) => { js += mapJS.arrow(p, id, b + 5.2 + i * 0.12, 1.4, false); });
    return { svg, ov: mapTag(p + "-mt") + stamp(p + "-stp", "EVERY RIVAL AT ONCE", 470, 860, "font-size:96px"), js: js + stampIn(p + "-stp", b + 6.4, -4) };
  });
  add("b8", "s58", L("b8d") - 0.15, "title", (c) => {
    const p = c.p, g = desk(p + "-set", { col: "#5E3E2A" });
    const svg = SVG(g + `<g id="${p}-pp" transform="translate(0,0) rotate(0)"><rect x="200" y="150" width="1300" height="620" fill="#F2E8D2" stroke="${INK}" stroke-width="5"/><rect x="214" y="164" width="1300" height="620" fill="none" stroke="${INK}" stroke-width="3"/></g>`);
    const ov = `<div id="${p}-q" style="position:absolute;left:270px;top:210px;width:1160px;font-family:'CC Garamond';font-weight:600;font-size:80px;line-height:1.15;color:#2B2622;opacity:0">Was Nadir Shah's invasion the real beginning of <span style="color:#A8322D">British India?</span></div>
      <div id="${p}-c" class="tag" style="left:270px;top:640px;opacity:0;font-size:44px">TELL ME IN THE COMMENTS</div>`;
    const js = cam(p + "-cam", c.t0, c.t1, [1.0, 0, 0], [1.05, 30, 10]) + popIn(p + "-q", c.t0 + 0.3, { y: 40 }) + popIn(p + "-c", L("b8d") + 4.4);
    return { svg, ov, js };
  });
  add("b8", "s59", L("b8e") - 0.15, "character", (c) => {
    const p = c.p, g = frontier(p + "-set", { fort: false, dusk: true });
    const ab = actor(p + "-ab", "abdali", 900, 960, 1.5, { pose: { armL: [10, 8], armR: [-40, -30] } }, c.t0, c.t1);
    const svg = SVG(g + ab.svg);
    let js = cam(p + "-cam", c.t0, c.t1, [1.02, 0, 0], [1.1, 30, 30]) + parallax(p + "-set", c.t0, c.t1, 50) + ab.js + `CC.walk(tl,'${p}-ab',${r1(c.t0 + 2.6)},${r1(c.t1)},0.6);` + tr(`${p}-ab-root`, [[c.t0 + 2.6, [900, 960, 1.5]], [c.t1, [1180, 960, 1.5]]], "none");
    const ov = nameCard(p + "-nc", "1747", "Ahmad Shah Abdali", "Afghan commander, later king of Afghanistan", PW.afghans.fill);
    return { svg, ov, js: js + wipe(p + "-nc", L("b8e") + 2.4, c.t1 - 0.2) };
  });
  add("b8", "s60", L("b8e") + 5.9, "map", (c) => {
    // framed so the Company flag sits left of the end-screen corner
    const p = c.p, [px, py] = city("panipat"), [cx, cy] = city("calcutta");
    const mx = (px + cx) / 2 + 60, my = (py + cy) / 2 + 40;
    const svg = mapSVG(p, { regions: EP02_END, borders: ["hyderabad", "bengal", "awadh"], flags: [{ id: "co", city: "calcutta", s: 1.2 }], markers: [{ id: "pp", city: "panipat", col: "#A8322D" }], arrows: [{ id: "ab", pts: [[66.4, 33.4], [70.4, 33.6], [73.6, 31.6], [76.97, 29.39]], col: PW.afghans.fill, w: 16 }], pins: [{ id: "pp", city: "panipat", label: "PANIPAT", side: "l", t: 1, size: 48 }] });
    const js = cam(p + "-cam", c.t0, c.t1, camTo(1136, 388, 1.3), camTo(1116, 382, 1.45), "power1.out") + mapJS.arrow(p, "ab", c.t0 + 0.1, 2.4, true, 1.1) + mapJS.pin(p, "pp", c.t0 + 2.6) + mapJS.pulse(p, "pp", c.t0 + 2.8, c.t1, 0.8);
    const ov = mapTag(p + "-mt", true) + `<div id="${p}-nx" class="card" style="left:96px;top:66px;padding:18px 28px;opacity:0"><div class="big" style="font-size:44px;color:#A8322D">NEXT EPISODE</div><div class="big" style="font-size:72px">WHY INDIA'S FATE WAS DECIDED AT PANIPAT</div></div>`;
    return { svg, ov, js: js + popIn(p + "-nx", c.t0 + 3.4, { y: -30 }) };
  });
}
