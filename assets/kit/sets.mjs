// ClearCut History — layered flat sets. Each set returns four parallax layers: <g id="p-sky|p-far|p-mid|p-ground">.
// Canvas 1920x1080; layers extend 240 px either side so the camera can pan. Gradients are flat bands (no blur).
import { INK, shade } from "./rig.mjs";

const T = { // tones; "sepia" = tragedy grade (grey-sepia)
  normal: { sky1: "#F2C98A", sky2: "#E9DCC0", skyDay: "#CFE0D6", sand: "#D9B98A", stone: "#B5523A", stoneD: "#8E3B2A", marble: "#F2ECE0", marbleD: "#D9CFBD", ground: "#C9A877", groundD: "#A8875A", green: "#7F9A5A", greenD: "#5E7A43", dark: "#2B2622", wood: "#7A4A2A" },
  sepia: { sky1: "#CFC6B6", sky2: "#BDB3A2", skyDay: "#CFC6B6", sand: "#A89E8E", stone: "#8E857A", stoneD: "#6B635A", marble: "#C9C0B0", marbleD: "#A89F90", ground: "#9C9384", groundD: "#7E7568", green: "#8E857A", greenD: "#6B635A", dark: "#221F1C", wood: "#5E564D" },
};
const L = (p, id, inner) => `<g id="${p}-${id}" transform="translate(0,0)">${inner}</g>`;
const skyBands = (p, c1, c2, n = 6) => {
  let s = "";
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const mix = (a, b) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const ch = (sh) => Math.round(((A >> sh) & 255) * (1 - t) + ((B >> sh) & 255) * t); return "#" + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1); };
    s += `<rect x="-240" y="${i * 130 - 10}" width="2400" height="${i === n - 1 ? 1100 : 140}" fill="${mix(c1, c2)}"/>`;
  }
  return s;
};

function chhatri(x, y, s, c, cd) {
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-26" y="-40" width="52" height="40" fill="${c}" stroke="${INK}" stroke-width="2"/>
  <path d="M-20,-40 L-20,-8 M0,-40 L0,-8 M20,-40 L20,-8" stroke="${cd}" stroke-width="4"/>
  <path d="M-34,-40 L34,-40 L30,-48 L-30,-48Z" fill="${cd}" stroke="${INK}" stroke-width="2"/>
  <path d="M-26,-48 C-26,-84 26,-84 26,-48Z" fill="#F2ECE0" stroke="${INK}" stroke-width="2"/><path d="M0,-80 L0,-94" stroke="${INK}" stroke-width="3"/></g>`;
}
function skyline(tone, y, col, n = 12, seed = 1) {
  let s = "", x = -240;
  for (let i = 0; i < n * 2; i++) {
    const w = 80 + ((i * 37 + seed * 11) % 90), h = 60 + ((i * 53 + seed * 7) % 120);
    s += `<rect x="${x}" y="${y - h}" width="${w}" height="${h + 40}" fill="${col}"/>`;
    if (i % 3 === 0) s += `<path d="M${x + w / 2 - 30},${y - h} C${x + w / 2 - 30},${y - h - 56} ${x + w / 2 + 30},${y - h - 56} ${x + w / 2 + 30},${y - h}Z" fill="${col}"/>`;
    if (i % 5 === 2) s += `<rect x="${x + w / 2 - 7}" y="${y - h - 120}" width="14" height="120" fill="${col}"/>`;
    x += w + 6;
    if (x > 2160) break;
  }
  return s;
}

// Delhi city gate (red sandstone), dawn by default.
export function delhiGate(p, { tone = "normal", dawn = true } = {}) {
  const c = T[tone];
  const sky = skyBands(p, dawn ? c.sky1 : c.skyDay, c.sky2) + (dawn && tone === "normal" ? `<circle cx="1500" cy="380" r="90" fill="#F6E1A8"/>` : "");
  const far = skyline(tone, 640, tone === "sepia" ? "#A89E8E" : "#D7B48A", 12, 3);
  const st = c.stone, sd = c.stoneD;
  let crenel = "";
  for (let x = -240; x < 2160; x += 40) crenel += `<path d="M${x},430 L${x + 26},430 L${x + 26},414 C${x + 26},400 ${x},400 ${x},414Z" fill="${st}" stroke="${INK}" stroke-width="2"/>`;
  const mid = `
    <rect x="-240" y="430" width="2400" height="320" fill="${st}" stroke="${INK}" stroke-width="2"/>${crenel}
    <path d="M-240,560 L2160,560" stroke="${sd}" stroke-width="5"/>
    <rect x="610" y="250" width="700" height="500" fill="${st}" stroke="${INK}" stroke-width="2.5"/>
    <rect x="560" y="220" width="130" height="530" fill="${sd}" stroke="${INK}" stroke-width="2.5"/>
    <rect x="1230" y="220" width="130" height="530" fill="${sd}" stroke="${INK}" stroke-width="2.5"/>
    ${chhatri(625, 220, 1.4, st, sd)}${chhatri(1295, 220, 1.4, st, sd)}${chhatri(960, 250, 1.2, st, sd)}${chhatri(820, 250, 0.9, st, sd)}${chhatri(1100, 250, 0.9, st, sd)}
    <rect x="640" y="300" width="640" height="20" fill="${c.marble}" stroke="${INK}" stroke-width="2"/>
    <path d="M760,750 L760,470 C760,370 1160,370 1160,470 L1160,750Z" fill="${c.marble}" stroke="${INK}" stroke-width="2.5"/>
    <path id="${p}-arch" d="M790,750 L790,480 C790,400 1130,400 1130,480 L1130,750Z" fill="${c.dark}" stroke="${INK}" stroke-width="2.5"/>
    <path d="M700,340 L700,720 M1220,340 L1220,720" stroke="${c.marbleD}" stroke-width="6"/>`;
  const ground = `<rect x="-240" y="740" width="2400" height="400" fill="${c.ground}"/><path d="M-240,740 L2160,740" stroke="${INK}" stroke-width="2.5"/>
    <path d="M760,740 L420,1080 L1500,1080 L1160,740Z" fill="${c.sand}"/>
    <path d="M-240,880 L2160,880 M-240,980 L2160,980" stroke="${c.groundD}" stroke-width="3" stroke-dasharray="40 60"/>`;
  return L(p, "sky", sky) + L(p, "far", far) + L(p, "mid", mid) + L(p, "ground", ground);
}

// Marble hall (durbar / Diwan-i-Khas). Scalloped arches, pillars, carpet.
export function hall(p, { tone = "normal", warm = true } = {}) {
  const c = T[tone], m = c.marble, md = c.marbleD, g = "#C9A24A";
  let arches = "";
  for (let i = -1; i < 7; i++) {
    const x = i * 300;
    arches += `<rect x="${x}" y="120" width="300" height="660" fill="${m}" stroke="${INK}" stroke-width="2"/>
    <path d="M${x + 40},780 L${x + 40},380 C${x + 40},360 ${x + 60},350 ${x + 70},330 C${x + 80},300 ${x + 110},300 ${x + 120},280 C${x + 135},250 ${x + 165},250 ${x + 180},280 C${x + 190},300 ${x + 220},300 ${x + 230},330 C${x + 240},350 ${x + 260},360 ${x + 260},380 L${x + 260},780Z" fill="${warm ? "#E7C98E" : md}" stroke="${INK}" stroke-width="2.5"/>
    <path d="M${x + 150},300 L${x + 150},330" stroke="${g}" stroke-width="6"/>
    <circle cx="${x + 150}" cy="200" r="22" fill="none" stroke="${g}" stroke-width="5"/>`;
  }
  const far = `<rect x="-240" y="0" width="2400" height="140" fill="${md}"/>${arches}<path d="M-240,120 L2160,120" stroke="${g}" stroke-width="10"/>`;
  let pillars = "";
  for (const x of [-120, 360, 1560, 2040]) pillars += `<rect x="${x - 42}" y="0" width="84" height="860" fill="${m}" stroke="${INK}" stroke-width="2.5"/><rect x="${x - 50}" y="780" width="100" height="80" fill="${md}" stroke="${INK}" stroke-width="2"/><path d="M${x - 26},120 L${x - 26},740 M${x + 26},120 L${x + 26},740" stroke="${md}" stroke-width="5"/><rect x="${x - 50}" y="0" width="100" height="40" fill="${g}" stroke="${INK}" stroke-width="2"/>`;
  const mid = pillars;
  let tiles = "";
  for (let x = -240; x < 2160; x += 120) tiles += `<path d="M${x},860 L${x + 60},1080" stroke="${md}" stroke-width="3"/>`;
  const ground = `<rect x="-240" y="780" width="2400" height="320" fill="${m}"/>${tiles}<path d="M-240,780 L2160,780" stroke="${INK}" stroke-width="2.5"/>
    <path d="M460,830 L1460,830 L1600,1080 L320,1080Z" fill="${tone === "sepia" ? "#7E7568" : "#9E2B25"}" stroke="${INK}" stroke-width="2.5"/>
    <path d="M520,860 L1400,860 L1510,1060 L410,1060Z" fill="none" stroke="${g}" stroke-width="6"/>`;
  return L(p, "sky", `<rect x="-240" y="-40" width="2400" height="1160" fill="${md}"/>`) + L(p, "far", far) + L(p, "mid", "") + L(p, "ground", ground) + `<g id="${p}-front" transform="translate(0,0)">${mid}</g>`;
}

// Open plain (Karnal / horizon). Optional Mughal tent city.
export function plain(p, { tone = "normal", tents = false, dusk = false, trees = true } = {}) {
  const c = T[tone];
  const sky = skyBands(p, dusk ? "#E6A26A" : c.skyDay, dusk ? "#F2D7A6" : "#EAE3CF");
  let far = `<path d="M-240,600 C200,560 500,590 900,570 C1300,550 1700,585 2160,565 L2160,640 L-240,640Z" fill="${tone === "sepia" ? "#A89E8E" : "#AFC09A"}"/>`;
  if (trees) for (let x = -200; x < 2160; x += 70 + (x % 50)) far += `<circle cx="${x}" cy="${590 - (x % 30)}" r="${24 + (x % 14)}" fill="${c.greenD}"/>`;
  let mid = `<rect x="-240" y="620" width="2400" height="60" fill="${c.green}"/>`;
  if (tents) {
    const cols = ["#F4EEE2", "#2F5D3A", "#B8362E", "#E9DCC0", "#C9A24A"];
    for (let r = 0; r < 3; r++) for (let i = 0; i < 16; i++) {
      const x = -200 + i * 150 + r * 60 + ((i * 31) % 40), y = 640 + r * 26, s = 0.7 + r * 0.22, col = cols[(i + r) % 5];
      mid += `<g transform="translate(${x},${y}) scale(${s})"><path d="M-60,0 L0,-70 L60,0Z" fill="${col}" stroke="${INK}" stroke-width="2"/><path d="M0,-70 L0,-96" stroke="${INK}" stroke-width="3"/><path d="M0,-96 L22,-90 L0,-84Z" fill="#2F5D3A"/><path d="M-10,0 L0,-40 L10,0Z" fill="${shade(col, 0.6)}"/></g>`;
    }
  }
  const ground = `<rect x="-240" y="680" width="2400" height="420" fill="${c.ground}"/><path d="M-240,680 L2160,680" stroke="${INK}" stroke-width="2"/>
    ${Array.from({ length: 26 }, (_, i) => `<path d="M${-220 + i * 92},${760 + (i * 47) % 260} l14,-22 l14,22" fill="none" stroke="${c.groundD}" stroke-width="4"/>`).join("")}`;
  return L(p, "sky", sky) + L(p, "far", far) + L(p, "mid", mid) + L(p, "ground", ground);
}

// Empty Delhi street (tragedy grade by default): shut doors, jharokha balconies, flat smoke shapes.
export function street(p, { tone = "sepia", night = false } = {}) {
  const c = T[tone];
  const sky = skyBands(p, night ? "#7A7268" : c.sky1, night ? "#958C80" : c.sky2);
  let far = "";
  for (let i = 0; i < 6; i++) far += `<g id="${p}-smoke${i}" transform="translate(${-100 + i * 400},${430 - (i % 2) * 60})"><path d="M0,0 C-30,-40 10,-80 -10,-130 C30,-120 60,-160 50,-210 C90,-170 80,-110 110,-90 C120,-50 80,-10 60,0Z" fill="${night ? "#6B635A" : "#9C9384"}" stroke="${INK}" stroke-width="2"/></g>`;
  far += skyline(tone, 520, night ? "#5A534B" : "#8E857A", 12, 5);
  let mid = "";
  const houses = [[-240, 380], [140, 340], [520, 400], [940, 360], [1340, 390], [1740, 350]];
  houses.forEach(([x, w], i) => {
    const top = 260 + (i % 3) * 40, col = i % 2 ? c.stone : c.sand;
    mid += `<rect x="${x}" y="${top}" width="${w}" height="${780 - top}" fill="${col}" stroke="${INK}" stroke-width="2.5"/>
      <rect x="${x}" y="${top - 18}" width="${w}" height="18" fill="${shade(col, 0.8)}" stroke="${INK}" stroke-width="2"/>
      <g id="${p}-door${i}"><path d="M${x + w / 2 - 60},780 L${x + w / 2 - 60},600 C${x + w / 2 - 60},560 ${x + w / 2 + 60},560 ${x + w / 2 + 60},600 L${x + w / 2 + 60},780Z" fill="${c.wood}" stroke="${INK}" stroke-width="2.5"/>
      <path d="M${x + w / 2},572 L${x + w / 2},780" stroke="${INK}" stroke-width="3"/>
      <circle cx="${x + w / 2 - 14}" cy="690" r="5" fill="${INK}"/><circle cx="${x + w / 2 + 14}" cy="690" r="5" fill="${INK}"/>
      <path d="M${x + w / 2 - 60},640 L${x + w / 2 + 60},640 M${x + w / 2 - 60},720 L${x + w / 2 + 60},720" stroke="${shade(c.wood, 0.75)}" stroke-width="4"/></g>
      <path d="M${x + 40},${top + 70} L${x + w - 40},${top + 70} L${x + w - 56},${top + 170} L${x + 56},${top + 170}Z" fill="${shade(col, 0.85)}" stroke="${INK}" stroke-width="2"/>
      <path d="M${x + 70},${top + 170} L${x + 70},${top + 100} C${x + 70},${top + 84} ${x + w - 70},${top + 84} ${x + w - 70},${top + 100} L${x + w - 70},${top + 170}" fill="${night ? "#1E1A17" : shade(col, 0.55)}" stroke="${INK}" stroke-width="2"/>`;
  });
  const ground = `<rect x="-240" y="780" width="2400" height="320" fill="${c.ground}"/><path d="M-240,780 L2160,780" stroke="${INK}" stroke-width="2.5"/>
    ${Array.from({ length: 14 }, (_, i) => `<path d="M${-240 + i * 180},${880 + (i % 3) * 60} L${-150 + i * 180},${880 + (i % 3) * 60}" stroke="${c.groundD}" stroke-width="4"/>`).join("")}`;
  return L(p, "sky", sky) + L(p, "far", far) + L(p, "mid", mid) + L(p, "ground", ground);
}

// Treasury vault: dark stone arches, iron door, chests.
export function vault(p) {
  const st = "#6B5E50", sd = "#4E443A";
  let arches = "";
  for (let i = -1; i < 7; i++) { const x = i * 320; arches += `<path d="M${x + 30},800 L${x + 30},360 C${x + 30},220 ${x + 290},220 ${x + 290},360 L${x + 290},800Z" fill="${sd}" stroke="${INK}" stroke-width="2.5"/>`; }
  let bricks = "";
  for (let y = 40; y < 800; y += 60) for (let x = -240 + ((y / 60) % 2) * 60; x < 2160; x += 120) bricks += `<rect x="${x}" y="${y}" width="120" height="60" fill="none" stroke="${sd}" stroke-width="3"/>`;
  const far = `<rect x="-240" y="0" width="2400" height="820" fill="${st}"/>${bricks}${arches}`;
  const ground = `<rect x="-240" y="800" width="2400" height="300" fill="#5A4E42"/><path d="M-240,800 L2160,800" stroke="${INK}" stroke-width="2.5"/>`;
  return L(p, "sky", "") + L(p, "far", far) + L(p, "mid", "") + L(p, "ground", ground);
}

// Mountains + neglected frontier fort.
export function frontier(p, { fort = true, dusk = false } = {}) {
  const sky = skyBands(p, dusk ? "#D99A6A" : "#CFE0D6", "#EFE6D2");
  const far = `<path d="M-240,620 L80,300 L300,470 L560,220 L860,520 L1120,260 L1420,500 L1700,240 L2160,560 L2160,700 L-240,700Z" fill="#9AA6A0" stroke="${INK}" stroke-width="2"/>
    <path d="M560,220 L620,290 L590,300 L560,270 L530,300 L500,280Z M1120,260 L1170,320 L1140,330 L1120,300 L1090,330 L1060,316Z M1700,240 L1756,300 L1726,312 L1700,282 L1670,310Z" fill="#F4EEE2"/>`;
  let mid = `<path d="M-240,760 L120,540 L420,640 L760,500 L1100,660 L1500,520 L2160,700 L2160,800 L-240,800Z" fill="#8A7A62" stroke="${INK}" stroke-width="2"/>`;
  if (fort) {
    mid += `<g transform="translate(1180,600)">
      <rect x="-260" y="-150" width="520" height="160" fill="#B08A64" stroke="${INK}" stroke-width="2.5"/>
      <path d="M-260,-150 L-230,-150 L-230,-170 L-200,-170 L-200,-150 L-140,-150 L-140,-172 L-110,-172 L-110,-150 L-60,-150 L-40,-128 L-10,-150 L60,-150 L60,-170 L90,-170 L90,-150 L170,-150 L170,-166 L200,-166 L200,-150 L260,-150" fill="none" stroke="${INK}" stroke-width="2.5"/>
      <path d="M-60,-150 L-40,-128 L-10,-150 L-30,-90 L-70,-110Z" fill="#8A7A62" stroke="${INK}" stroke-width="2"/>
      <path d="M120,10 L140,-60 L180,-40 L170,10Z" fill="#8A7A62"/>
      <rect x="-330" y="-300" width="100" height="310" fill="#9C7A56" stroke="${INK}" stroke-width="2.5"/>
      <path d="M-340,-300 L-220,-300 L-230,-320 L-330,-320Z" fill="#8A6A4A" stroke="${INK}" stroke-width="2"/>
      <rect x="-300" y="-270" width="40" height="50" fill="#2B2622"/>
      <path d="M-280,-320 L-280,-420" stroke="#4A3A2C" stroke-width="6"/>
      <g id="${p}-flag" transform="translate(-280,-420)"><g id="${p}-flagcloth" transform="skewY(0)"><path d="M0,0 L80,10 L60,24 L78,40 L30,36 L44,52 L0,46Z" fill="#2F5D3A" stroke="${INK}" stroke-width="2"/></g></g>
      <path d="M-120,10 L-120,-60 C-120,-90 -60,-90 -60,-60 L-60,10Z" fill="#2B2622"/>
    </g>`;
  }
  const ground = `<path d="M-240,800 L2160,800 L2160,1100 L-240,1100Z" fill="#A08A68"/><path d="M-240,800 L2160,800" stroke="${INK}" stroke-width="2"/>
    <path d="M400,1080 C600,960 900,900 1240,800 L1320,800 C1040,920 900,980 760,1080Z" fill="#C2A77E"/>`;
  return L(p, "sky", sky) + L(p, "far", far) + L(p, "mid", mid) + L(p, "ground", ground);
}

// Tent interior (Nadir's camp): striped canvas, map table.
export function tent(p, { night = true, col = null, col2 = null } = {}) {
  let stripes = "";
  const c1 = col || (night ? "#7A2E28" : "#B8362E"), c2 = col2 || (night ? "#5E2420" : "#9E2B25");
  for (let x = -240; x < 2160; x += 160) stripes += `<rect x="${x}" y="0" width="80" height="900" fill="${c2}"/>`;
  const far = `<rect x="-240" y="0" width="2400" height="900" fill="${c1}"/>${stripes}
    <path d="M-240,0 L960,-60 L2160,0 L2160,120 C1500,200 420,200 -240,120Z" fill="${night ? "#3A1A17" : "#7A2E28"}" stroke="${INK}" stroke-width="2"/>
    <path d="M960,-60 L960,880" stroke="#4A3A2C" stroke-width="18"/>`;
  const ground = `<rect x="-240" y="860" width="2400" height="260" fill="#5A3E2A"/><path d="M-240,860 L2160,860" stroke="${INK}" stroke-width="2.5"/>
    <path d="M300,900 L1620,900 L1720,1080 L200,1080Z" fill="#3E5E6E" stroke="${INK}" stroke-width="2"/>`;
  return L(p, "sky", "") + L(p, "far", far) + L(p, "mid", "") + L(p, "ground", ground);
}

// Bengal river trading post: ships, warehouse, small fort with company flag.
export function tradingPost(p) {
  const sky = skyBands(p, "#CFE0D6", "#EFE6D2");
  let far = `<rect x="-240" y="560" width="2400" height="80" fill="#7F9A5A"/>`;
  for (let x = -200; x < 2160; x += 150) far += `<path d="M${x},580 C${x - 10},520 ${x + 4},480 ${x + 10},450" stroke="#5A4A3A" stroke-width="7" fill="none"/><path d="M${x + 10},450 l-50,20 m50,-20 l40,24 m-40,-24 l-20,-40 m20,40 l30,-34" stroke="#4F7A3A" stroke-width="12" stroke-linecap="round"/>`;
  const mid = `<g transform="translate(560,640)">
      <rect x="-300" y="-150" width="600" height="150" fill="#E9DCC0" stroke="${INK}" stroke-width="2.5"/>
      <path d="M-320,-150 L320,-150 L300,-190 L-300,-190Z" fill="#B5523A" stroke="${INK}" stroke-width="2"/>
      ${[-220, -100, 20, 140].map((x) => `<rect x="${x}" y="-110" width="70" height="110" fill="#7A4A2A" stroke="${INK}" stroke-width="2"/>`).join("")}
    </g>
    <g transform="translate(1180,640)">
      <path d="M-200,0 L-200,-170 L-170,-170 L-170,-190 L-140,-190 L-140,-170 L-60,-170 L-60,-190 L-30,-190 L-30,-170 L40,-170 L40,-190 L70,-190 L70,-170 L200,-170 L200,0Z" fill="#C9B79A" stroke="${INK}" stroke-width="2.5"/>
      <path d="M-40,0 L-40,-70 C-40,-100 40,-100 40,-70 L40,0Z" fill="#2B2622"/>
      <path d="M150,-170 L150,-300" stroke="${INK}" stroke-width="6"/>
      <g id="${p}-flag" transform="translate(150,-300)"><g id="${p}-flagcloth" transform="skewY(0)"><rect x="0" y="0" width="100" height="64" fill="#F4EEE2"/>${[0, 1, 2, 3, 4, 5, 6].map((k) => k % 2 ? "" : `<rect x="0" y="${k * 9.14}" width="100" height="9.14" fill="#A8322D"/>`).join("")}<rect x="0" y="0" width="42" height="28" fill="#F4EEE2" stroke="${INK}" stroke-width="1.5"/><path d="M21,0 L21,28 M0,14 L42,14" stroke="#A8322D" stroke-width="6"/><rect x="0" y="0" width="100" height="64" fill="none" stroke="${INK}" stroke-width="2"/></g></g>
    </g>`;
  const ship = (x, s, id) => `<g id="${id}" transform="translate(${x},800) scale(${s})"><path d="M-160,0 L160,0 L130,60 L-130,60Z" fill="#5A3E2A" stroke="${INK}" stroke-width="2.5"/>
      <path d="M-40,0 L-40,-260 M60,0 L60,-220" stroke="#4A3A2C" stroke-width="8"/>
      <path d="M-36,-250 L-36,-60 L-130,-70 C-110,-150 -110,-200 -36,-250Z M64,-210 L64,-60 L150,-70 C140,-130 130,-170 64,-210Z" fill="#F4EEE2" stroke="${INK}" stroke-width="2"/>
      <path d="M-40,-260 L-40,-300 L0,-288 L-40,-276Z" fill="#A8322D"/></g>`;
  const ground = `<rect x="-240" y="680" width="2400" height="420" fill="#5E8C8A"/><path d="M-240,680 L2160,680" stroke="${INK}" stroke-width="2.5"/>
    ${Array.from({ length: 18 }, (_, i) => `<path d="M${-220 + i * 140},${760 + (i % 4) * 70} l60,0" stroke="#8FB3B0" stroke-width="5" stroke-linecap="round"/>`).join("")}
    ${ship(380, 0.9, p + "-ship1")}${ship(1560, 1.1, p + "-ship2")}`;
  return L(p, "sky", sky) + L(p, "far", far) + L(p, "mid", mid) + L(p, "ground", ground);
}

// Paper desk (quotes, book, cards).
export function desk(p, { col = "#6E4A32" } = {}) {
  let grain = "";
  for (let y = 0; y < 1100; y += 34) grain += `<path d="M-240,${y} C300,${y + 10} 900,${y - 8} 2160,${y + 6}" stroke="${shade(col, 0.85)}" stroke-width="4" fill="none"/>`;
  return L(p, "sky", `<rect x="-240" y="-40" width="2400" height="1160" fill="${col}"/>${grain}`) + L(p, "far", "") + L(p, "mid", "") + L(p, "ground", "");
}

// Palace by a river (Awadh, plum by default): arcaded facade, domes, garden, river band.
export function palace(p, { wall = "#E8D3C9", accent = "#7A4B6B", dome = "#F2ECE0", tone = "normal", dim = false } = {}) {
  const c = T[tone];
  const sky = skyBands(p, dim ? "#B99A8E" : "#F2D2A8", dim ? "#9E8478" : "#EFE6D2");
  let arch = "";
  for (let i = 0; i < 9; i++) { const x = 340 + i * 140; arch += `<path d="M${x},620 L${x},520 C${x},480 ${x + 100},480 ${x + 100},520 L${x + 100},620Z" fill="${accent}" stroke="${INK}" stroke-width="2"/>`; }
  const far = `<path d="M-240,560 C300,540 700,560 1100,548 C1500,536 1900,556 2160,548 L2160,640 L-240,640Z" fill="${dim ? "#8A7A6A" : "#B9C6A0"}"/>`;
  const mid = `<rect x="300" y="380" width="1320" height="260" fill="${wall}" stroke="${INK}" stroke-width="2.5"/>${arch}
    <rect x="300" y="360" width="1320" height="26" fill="${accent}" stroke="${INK}" stroke-width="2"/>
    ${[460, 960, 1460].map((x, i) => `<path d="M${x - (i === 1 ? 150 : 90)},362 C${x - (i === 1 ? 150 : 90)},${i === 1 ? 200 : 270} ${x + (i === 1 ? 150 : 90)},${i === 1 ? 200 : 270} ${x + (i === 1 ? 150 : 90)},362Z" fill="${dome}" stroke="${INK}" stroke-width="2.5"/><path d="M${x},${i === 1 ? 206 : 274} L${x},${i === 1 ? 160 : 240}" stroke="${INK}" stroke-width="4"/><circle cx="${x}" cy="${i === 1 ? 156 : 236}" r="7" fill="#C9A24A"/>`).join("")}
    ${[300, 1620].map((x) => `<rect x="${x - 26}" y="250" width="52" height="390" fill="${wall}" stroke="${INK}" stroke-width="2.5"/><path d="M${x - 34},250 C${x - 34},200 ${x + 34},200 ${x + 34},250Z" fill="${dome}" stroke="${INK}" stroke-width="2"/>`).join("")}`;
  const ground = `<rect x="-240" y="640" width="2400" height="120" fill="${dim ? "#7E8E6A" : "#9DB07A"}"/><path d="M-240,640 L2160,640" stroke="${INK}" stroke-width="2"/>
    ${Array.from({ length: 16 }, (_, i) => `<circle cx="${-200 + i * 150}" cy="${700 + (i % 2) * 20}" r="${26 + (i % 3) * 6}" fill="${dim ? "#5E6E4A" : "#6F8A4A"}" stroke="${INK}" stroke-width="2"/>`).join("")}
    <rect x="-240" y="760" width="2400" height="340" fill="${dim ? "#4E6E70" : "#5E8C8A"}"/><path d="M-240,760 L2160,760" stroke="${INK}" stroke-width="2"/>
    ${Array.from({ length: 14 }, (_, i) => `<path d="M${-200 + i * 170},${830 + (i % 3) * 70} l70,0" stroke="#8FB3B0" stroke-width="5" stroke-linecap="round"/>`).join("")}`;
  return L(p, "sky", sky) + L(p, "far", far) + L(p, "mid", mid) + L(p, "ground", ground);
}

// Deccan hill fort: rocky boulders, bastioned walls on a granite hill, banner.
export function deccanFort(p, { flag = "#3F7F6A" } = {}) {
  const sky = skyBands(p, "#E9C996", "#EFE6D2");
  const far = `<path d="M-240,640 L100,520 L380,600 L700,480 L1000,580 L1300,470 L1640,590 L2160,500 L2160,700 L-240,700Z" fill="#B7A98C" stroke="${INK}" stroke-width="2"/>`;
  let rocks = "";
  [[200, 760, 90], [380, 720, 120], [1520, 740, 110], [1720, 780, 80], [880, 700, 70], [1080, 690, 80]].forEach(([x, y, r]) => { rocks += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="#9C8E74" stroke="${INK}" stroke-width="2"/><path d="M${x - r * 0.4},${y - r * 0.2} l${r * 0.3},${-r * 0.2}" stroke="#7E7058" stroke-width="4"/>`; });
  const mid = `<path d="M560,700 L760,420 L1160,420 L1360,700Z" fill="#A89878" stroke="${INK}" stroke-width="2"/>
    <rect x="700" y="300" width="520" height="140" fill="#B8A07A" stroke="${INK}" stroke-width="2.5"/>
    ${[700, 860, 1060, 1220].map((x) => `<path d="M${x - 40},440 L${x - 40},270 C${x - 40},240 ${x + 40},240 ${x + 40},270 L${x + 40},440Z" fill="#A88E68" stroke="${INK}" stroke-width="2.5"/>`).join("")}
    ${Array.from({ length: 13 }, (_, i) => `<rect x="${704 + i * 40}" y="286" width="22" height="16" fill="#B8A07A" stroke="${INK}" stroke-width="2"/>`).join("")}
    <path d="M920,440 L920,370 C920,340 1000,340 1000,370 L1000,440Z" fill="#2B2622"/>
    <path d="M960,300 L960,170" stroke="${INK}" stroke-width="6"/><g id="${p}-flag" transform="translate(960,170)"><g id="${p}-flagcloth" transform="skewY(0)"><path d="M0,0 L96,10 L80,30 L96,52 L0,48Z" fill="${flag}" stroke="${INK}" stroke-width="2"/></g></g>${rocks}`;
  const ground = `<rect x="-240" y="760" width="2400" height="340" fill="#B49A72"/><path d="M-240,760 L2160,760" stroke="${INK}" stroke-width="2"/>`;
  return L(p, "sky", sky) + L(p, "far", far) + L(p, "mid", mid) + L(p, "ground", ground);
}

// Persian camp: teal and red tents, Persian banners, a plain under a high sky.
export function persianCamp(p) {
  const sky = skyBands(p, "#D6E4DC", "#EFE6D2");
  let far = `<path d="M-240,600 L200,470 L520,560 L900,430 L1260,560 L1640,450 L2160,580 L2160,640 L-240,640Z" fill="#A9B4A6" stroke="${INK}" stroke-width="2"/>`;
  let mid = "";
  const cols = ["#3E8E8A", "#B8362E", "#E9DCC0", "#2E5A5E"];
  for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) {
    const x = -160 + i * 270 + r * 130, y = 660 + r * 60, s = 0.9 + r * 0.35, col = cols[(i + r) % 4];
    mid += `<g transform="translate(${x},${y}) scale(${s})"><path d="M-90,0 L-70,-80 L0,-120 L70,-80 L90,0Z" fill="${col}" stroke="${INK}" stroke-width="2"/><path d="M-14,0 L0,-60 L14,0Z" fill="${shade(col, 0.55)}"/><path d="M0,-120 L0,-150" stroke="${INK}" stroke-width="3"/><path d="M0,-150 L26,-142 L0,-134Z" fill="#3E8E8A" stroke="${INK}" stroke-width="1.5"/></g>`;
  }
  const ground = `<rect x="-240" y="640" width="2400" height="460" fill="#CDB88E"/><path d="M-240,640 L2160,640" stroke="${INK}" stroke-width="2"/>`;
  return L(p, "sky", sky) + L(p, "far", far) + L(p, "mid", mid) + L(p, "ground", ground);
}
