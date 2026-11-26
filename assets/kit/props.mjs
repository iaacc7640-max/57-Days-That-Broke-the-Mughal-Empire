// ClearCut History — props and series scenes for "The Fall of the Mughals" (flat vector, crisp, no glow).
import { INK, shade } from "./rig.mjs";
const GOLD = "#C9A24A", GOLD_D = "#9C7A2E", GOLD_L = "#E3C77A";

// peacock-throne: gold platform, canopy on pillars, two jewelled peacocks. Origin = centre of the base, at the floor.
export function peacockThrone(p, { empty = false } = {}) {
  const peacock = (sx) => {
    let fan = "";
    for (let i = 0; i < 9; i++) {
      const a = (-80 + i * 20) * Math.PI / 180, r = 62;
      const x = Math.cos(a - Math.PI / 2) * r * 0.9, y = Math.sin(a - Math.PI / 2) * r;
      fan += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="#2E7D6B" stroke="${INK}" stroke-width="2"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#2B4E9E"/>`;
    }
    return `<g transform="translate(${sx * 120},-372) scale(${sx},1)">${fan}
      <path d="M-8,10 C-14,-20 -6,-40 4,-46 C10,-50 16,-44 12,-36 C6,-28 8,-10 14,10Z" fill="#2B4E9E" stroke="${INK}" stroke-width="2"/>
      <circle cx="9" cy="-42" r="2.5" fill="#F4EEE2"/><path d="M14,-44 L22,-42 L14,-40Z" fill="${GOLD}"/>
      <path d="M6,-50 L4,-60 M9,-50 L10,-60" stroke="${INK}" stroke-width="2"/></g>`;
  };
  let jewels = "";
  for (let x = -150; x <= 150; x += 30) jewels += `<circle cx="${x}" cy="-118" r="7" fill="${(x / 30) % 2 ? "#B8362E" : "#2E7D6B"}" stroke="${INK}" stroke-width="1.5"/>`;
  return `<g id="${p}">
    <rect x="-200" y="-40" width="400" height="40" fill="${GOLD_D}" stroke="${INK}" stroke-width="2"/>
    <path d="M-190,-40 L-170,-90 L170,-90 L190,-40Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
    <rect x="-180" y="-130" width="360" height="40" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>${jewels}
    <rect x="-180" y="-310" width="14" height="180" fill="${GOLD_L}" stroke="${INK}" stroke-width="2"/>
    <rect x="166" y="-310" width="14" height="180" fill="${GOLD_L}" stroke="${INK}" stroke-width="2"/>
    <path d="M-200,-310 C-120,-360 120,-360 200,-310 L200,-296 L-200,-296Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
    <path d="M-200,-296 L200,-296 L190,-280 L-190,-280Z" fill="#B8362E" stroke="${INK}" stroke-width="2"/>
    <path d="M-140,-280 C-140,-200 140,-200 140,-280" fill="none" stroke="${GOLD_D}" stroke-width="4"/>
    ${empty ? "" : `<path d="M-110,-130 C-110,-160 110,-160 110,-130Z" fill="#B8362E" stroke="${INK}" stroke-width="2"/><rect x="-60" y="-200" width="120" height="70" rx="20" fill="#B8362E" stroke="${INK}" stroke-width="2"/>`}
    ${peacock(-1)}${peacock(1)}
    <circle cx="0" cy="-330" r="12" fill="#B8362E" stroke="${INK}" stroke-width="2"/>
  </g>`;
}

// ox-cart with a turning wheel (p-wheel). Origin = centre of the bed, ground at y=0.
export function cart(p) {
  let spokes = "";
  for (let i = 0; i < 8; i++) spokes += `<path d="M0,0 L${(Math.cos(i * Math.PI / 4) * 52).toFixed(1)},${(Math.sin(i * Math.PI / 4) * 52).toFixed(1)}" stroke="${INK}" stroke-width="5"/>`;
  const wheel = (x, id) => `<g transform="translate(${x},-60)"><g id="${id}" transform="rotate(0)"><circle r="58" fill="none" stroke="#5A3E26" stroke-width="12"/><circle r="58" fill="none" stroke="${INK}" stroke-width="2"/>${spokes}<circle r="11" fill="#5A3E26" stroke="${INK}" stroke-width="2"/></g></g>`;
  return `<g id="${p}">
    <rect x="-260" y="-140" width="520" height="34" fill="#8A5A3A" stroke="${INK}" stroke-width="2"/>
    <path d="M-260,-140 L-260,-170 M260,-140 L260,-170" stroke="#5A3E26" stroke-width="10"/>
    <path d="M260,-124 L420,-110" stroke="#5A3E26" stroke-width="10" stroke-linecap="round"/>
    ${wheel(-170, p + "-wheel")}${wheel(170, p + "-wheel2")}
  </g>`;
}

// kohinoor: a cut gem with a flat four-point sparkle (p-spark) that rotates. Origin = gem centre.
export function kohinoor(p, { col = "#DCEAF0", size = 1 } = {}) {
  const d = shade(col, 0.78), dd = shade(col, 0.6);
  return `<g id="${p}" transform="scale(${size})">
    <path d="M-90,-30 L-50,-70 L50,-70 L90,-30 L0,80Z" fill="${col}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-90,-30 L90,-30 M-50,-70 L-30,-30 L0,-70 L30,-30 L50,-70 M-30,-30 L0,80 L30,-30 M-90,-30 L0,80 L90,-30" fill="none" stroke="${INK}" stroke-width="2"/>
    <path d="M-50,-70 L-30,-30 L-90,-30Z" fill="${d}"/><path d="M30,-30 L90,-30 L0,80Z" fill="${dd}"/><path d="M-30,-30 L0,80 L-90,-30Z" fill="${d}"/>
    <path d="M0,-70 L30,-30 L-30,-30Z" fill="#FFFFFF"/>
    <g transform="translate(-40,-48)"><g id="${p}-spark" transform="rotate(0) scale(1)">
      <path d="M0,-34 L7,-7 L34,0 L7,7 L0,34 L-7,7 L-34,0 L-7,-7Z" fill="#FFFFFF" stroke="${INK}" stroke-width="2"/>
    </g></g>
  </g>`;
}

export function gauntletHand(p) {
  return `<g id="${p}">
    <path d="M-260,120 L-60,40 L-40,110 L-250,190Z" fill="#6E7478" stroke="${INK}" stroke-width="3"/>
    <path d="M-250,130 L-70,60 M-245,150 L-62,80 M-240,170 L-55,100" stroke="#55595C" stroke-width="5"/>
    <path d="M-70,30 C-40,-10 40,-20 70,10 C90,30 80,80 40,100 L-50,120Z" fill="#7E8488" stroke="${INK}" stroke-width="3"/>
    <path d="M60,6 C90,-6 110,10 100,30 C96,40 80,40 70,34" fill="#7E8488" stroke="${INK}" stroke-width="3"/>
  </g>`;
}

export function crown(p, s = 1) {
  return `<g id="${p}" transform="scale(${s})">
    <path d="M-80,0 L-90,-80 L-50,-40 L-25,-100 L0,-50 L25,-100 L50,-40 L90,-80 L80,0Z" fill="${GOLD}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <rect x="-82" y="-14" width="164" height="22" fill="${GOLD_D}" stroke="${INK}" stroke-width="3"/>
    <circle cx="-40" cy="-3" r="6" fill="#B8362E"/><circle cx="0" cy="-3" r="7" fill="#2E7D6B"/><circle cx="40" cy="-3" r="6" fill="#B8362E"/>
    <circle cx="-25" cy="-100" r="7" fill="${GOLD_L}" stroke="${INK}" stroke-width="2"/><circle cx="25" cy="-100" r="7" fill="${GOLD_L}" stroke="${INK}" stroke-width="2"/>
  </g>`;
}

export function coinStack(p, n, x = 0) {
  let c = "";
  for (let i = 0; i < n; i++) c += `<g id="${p}-c${i}"><ellipse cx="0" cy="${-i * 12}" rx="40" ry="11" fill="${i % 2 ? GOLD : GOLD_L}" stroke="${INK}" stroke-width="2"/></g>`;
  return `<g id="${p}" transform="translate(${x},0)">${c}</g>`;
}

export function chest(p, { open = false, gold = true } = {}) {
  return `<g id="${p}">
    <rect x="-90" y="-90" width="180" height="90" fill="#7A4A2A" stroke="${INK}" stroke-width="2.5"/>
    <rect x="-90" y="-90" width="180" height="16" fill="${GOLD_D}" stroke="${INK}" stroke-width="2"/>
    <rect x="-12" y="-60" width="24" height="26" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
    ${open ? `${gold ? `<path d="M-84,-92 C-60,-120 60,-120 84,-92Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>` : ""}<path d="M-90,-92 L-100,-170 L80,-170 L90,-92Z" fill="#8A5A3A" stroke="${INK}" stroke-width="2.5"/>`
      : `<path d="M-90,-90 C-90,-130 90,-130 90,-90Z" fill="#8A5A3A" stroke="${INK}" stroke-width="2.5"/>`}
  </g>`;
}

export function lamp(p) {
  return `<g id="${p}">
    <path d="M-40,0 C-40,-24 40,-24 40,0 L30,8 L-30,8Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
    <path d="M30,-6 L52,-14 L46,-4Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
    <g transform="translate(50,-16)"><g id="${p}-flame" transform="scale(1,1)"><path d="M0,0 C-10,-10 -6,-26 0,-40 C6,-26 10,-10 0,0Z" fill="#E8A33A" stroke="${INK}" stroke-width="2"/><path d="M0,-4 C-4,-10 -2,-18 0,-24 C2,-18 4,-10 0,-4Z" fill="#F6E7A8"/></g></g>
  </g>`;
}

export function banner(p, col = "#3E8E8A", h = 220) {
  return `<g id="${p}"><path d="M0,0 L0,-${h}" stroke="#4A3A2C" stroke-width="7"/>
    <g transform="translate(0,-${h - 6})"><g id="${p}-cloth" transform="skewY(0)"><path d="M0,0 L110,10 L92,40 L112,72 L0,66Z" fill="${col}" stroke="${INK}" stroke-width="2"/>
    <path d="M22,22 L64,26 M22,44 L58,46" stroke="${shade(col, 0.75)}" stroke-width="5"/></g></g>
    <circle cx="0" cy="-${h}" r="7" fill="${GOLD}" stroke="${INK}" stroke-width="2"/></g>`;
}

export function scroll(p, w = 520, h = 620, col = "#EFE3C8") {
  return `<g id="${p}">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${col}" stroke="${INK}" stroke-width="3"/>
    <rect x="${-w / 2 - 20}" y="${-h / 2 - 22}" width="${w + 40}" height="26" rx="13" fill="#8A5A3A" stroke="${INK}" stroke-width="2.5"/>
    <rect x="${-w / 2 - 20}" y="${h / 2 - 4}" width="${w + 40}" height="26" rx="13" fill="#8A5A3A" stroke="${INK}" stroke-width="2.5"/>
  </g>`;
}
// stylised script lines (no real Persian text on screen, per A7)
export function scriptLines(p, w, n, x0, y0, gap = 46, col = INK) {
  let s = "";
  for (let i = 0; i < n; i++) {
    let d = `M${x0},${y0 + i * gap}`, x = x0;
    while (x < x0 + w - 30) { const seg = 18 + ((i * 7 + x) % 23); d += ` q${seg / 2},${-10 - ((x + i) % 9)} ${seg},0`; x += seg + 6; d += ` m6,0`; }
    s += `<path id="${p}-l${i}" d="${d}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return `<g id="${p}">${s}</g>`;
}

export function rose(p) {
  return `<g id="${p}"><path d="M0,0 L-6,-120" stroke="#4F7A3A" stroke-width="8"/><path d="M-4,-60 C-34,-70 -38,-46 -8,-44Z" fill="#4F7A3A" stroke="${INK}" stroke-width="2"/>
    <g transform="translate(-6,-130)"><circle r="30" fill="#C0392B" stroke="${INK}" stroke-width="2.5"/><path d="M-16,-4 C-6,-20 10,-16 16,0 M-8,10 C0,0 10,4 12,12 M-20,10 C-14,22 4,26 14,20" stroke="#7E1F18" stroke-width="3" fill="none"/></g></g>`;
}

// flat East India Company ensign (red-and-white stripes, St George canton), simplified
export function companyFlag(p, s = 1) {
  return `<g id="${p}" transform="scale(${s})"><path d="M0,0 L0,-90" stroke="${INK}" stroke-width="5"/>
    <g id="${p}-cloth"><rect x="0" y="-90" width="60" height="40" fill="#F4EEE2"/>${[0, 2, 4, 6].map((k) => `<rect x="0" y="${-90 + k * 5.7}" width="60" height="5.7" fill="#A8322D"/>`).join("")}<rect x="0" y="-90" width="24" height="17" fill="#F4EEE2" stroke="${INK}" stroke-width="1.2"/><path d="M12,-90 L12,-73 M0,-81.5 L24,-81.5" stroke="#A8322D" stroke-width="3"/><rect x="0" y="-90" width="60" height="40" fill="none" stroke="${INK}" stroke-width="2"/></g></g>`;
}

// sarpech / jigha: jewelled turban ornament (period symbol of Mughal royalty)
export function sarpech(p, s = 1) {
  return `<g id="${p}" transform="scale(${s})">
    <path d="M0,40 C-6,0 -4,-60 8,-120 C20,-80 18,-20 10,40Z" fill="#F4EEE2" stroke="${INK}" stroke-width="3"/>
    <path d="M6,-110 C2,-60 4,-10 8,30" stroke="#D9CFBD" stroke-width="3" fill="none"/>
    <path d="M-44,40 C-30,10 30,10 44,40 L36,58 L-36,58Z" fill="${GOLD}" stroke="${INK}" stroke-width="3"/>
    <circle cx="0" cy="36" r="14" fill="#2E7D6B" stroke="${INK}" stroke-width="3"/><circle cx="-26" cy="44" r="7" fill="#B8362E" stroke="${INK}" stroke-width="2"/><circle cx="26" cy="44" r="7" fill="#B8362E" stroke="${INK}" stroke-width="2"/>
    ${[-30, -15, 0, 15, 30].map((x) => `<circle cx="${x}" cy="66" r="5" fill="#F4EEE2" stroke="${INK}" stroke-width="1.5"/>`).join("")}
  </g>`;
}
// chhatra: royal umbrella (pole at x=0, canopy top at y=-h)
export function chhatra(p, h = 300, col = "#B8362E") {
  let fringe = "";
  for (let x = -110; x <= 110; x += 20) fringe += `<path d="M${x},${-h + 70} L${x + 10},${-h + 92} L${x + 20},${-h + 70}" fill="${GOLD}" stroke="${INK}" stroke-width="1.5"/>`;
  return `<g id="${p}"><path d="M0,0 L0,${-h}" stroke="#5A3E26" stroke-width="10"/>
    <path d="M-120,${-h + 70} C-110,${-h - 10} 110,${-h - 10} 120,${-h + 70}Z" fill="${col}" stroke="${INK}" stroke-width="3"/>
    <path d="M-120,${-h + 70} L120,${-h + 70}" stroke="${GOLD}" stroke-width="8"/>${fringe}
    <circle cx="0" cy="${-h - 14}" r="12" fill="${GOLD}" stroke="${INK}" stroke-width="2"/></g>`;
}
// throne split in two so a character can be seated between them: back (canopy, peacocks, bolster) and front (seat edge, base)
export function throneBack(p) {
  const full = peacockThrone(p, { empty: true });
  return full.replace(/<rect x="-200" y="-40"[^>]*\/>/, "").replace(/<path d="M-190,-40 L-170,-90 L170,-90 L190,-40Z"[^>]*\/>/, "");
}
export function throneFront(p) {
  let jewels = "";
  for (let x = -150; x <= 150; x += 30) jewels += `<circle cx="${x}" cy="-70" r="7" fill="${(x / 30) % 2 ? "#B8362E" : "#2E7D6B"}" stroke="${INK}" stroke-width="1.5"/>`;
  return `<g id="${p}"><rect x="-200" y="-40" width="400" height="40" fill="${GOLD_D}" stroke="${INK}" stroke-width="2"/>
    <path d="M-190,-40 L-176,-96 L176,-96 L190,-40Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>${jewels}
    <path d="M-150,-96 C-150,-120 150,-120 150,-96Z" fill="#B8362E" stroke="${INK}" stroke-width="2"/></g>`;
}
// a steel-gauntleted hand whose fingers wrap around the Kohinoor (palm behind the gem, fingers and thumb in front)
export function handWithGem(p, { gem = "#DCEAF0" } = {}) {
  const steel = "#8A9094", steelD = "#6E7478";
  const finger = (x, y, r) => `<g transform="translate(${x},${y}) rotate(${r})"><path d="M-14,0 C-16,-30 -12,-60 0,-66 C12,-60 16,-30 14,0Z" fill="${steel}" stroke="${INK}" stroke-width="3"/><path d="M-12,-26 L12,-26 M-10,-48 L10,-48" stroke="${steelD}" stroke-width="3"/></g>`;
  return `<g id="${p}">
    <path d="M-120,320 L-70,120 L70,120 L120,320Z" fill="${steelD}" stroke="${INK}" stroke-width="4"/>
    <path d="M-104,260 L104,260 M-90,200 L90,200 M-78,150 L78,150" stroke="#55595C" stroke-width="6"/>
    <path d="M-90,130 C-110,40 -80,-30 0,-40 C80,-30 110,40 90,130Z" fill="${steel}" stroke="${INK}" stroke-width="4"/>
    <g transform="translate(0,-28)">${kohinoor(p + "-kn", { col: gem, size: 1.25 })}</g>
    ${finger(-66, 14, -14)}${finger(-22, 4, -4)}${finger(22, 4, 4)}${finger(66, 14, 14)}
    <g transform="translate(96,70) rotate(-58)"><path d="M-16,0 C-18,-34 -12,-70 2,-76 C16,-70 18,-34 16,0Z" fill="${steel}" stroke="${INK}" stroke-width="3"/></g>
  </g>`;
}
