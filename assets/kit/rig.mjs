// ClearCut History — flat 2D character rigs (about 3.5 heads tall).
// Local units: feet at (0,0), top of head about y=-360. Every pivot is a <g transform="translate(px,py)">
// wrapping an animated <g id="..." transform="rotate(0)">, so GSAP tweens the attr string (no CSS transforms).
// Named parts per instance prefix p: p-walk, p-body, p-torso, p-legL, p-legR, p-armL-upper, p-armL-lower,
// p-armR-upper, p-armR-lower, p-head, p-eyes (p-eyes-open / p-eyes-shut), p-brows, p-mouth (p-m0, p-m1, p-m2).
export const INK = "#2B2622";
const sw = 2; // outline width (skill: no outline heavier than 2 px)

const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, Math.round(((n >> 16) & 255) * f)));
  const g = Math.max(0, Math.min(255, Math.round(((n >> 8) & 255) * f)));
  const b = Math.max(0, Math.min(255, Math.round((n & 255) * f)));
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};
export { shade };

// ---------- costume presets ----------
export const CAST = {
  muhammadShah: {
    name: "Muhammad Shah", skin: "#C8966A", jama: "#F1E3D3", jamaPattern: "#C94F6D", jamaPattern2: "#5E8C5A", sash: "#C9A24A",
    trousers: "#B8362E", shoes: "#C9A24A", head: "turban", headColor: "#F4EBDD", headBand: "#C9A24A", plume: true, jewel: "#3F8F7A",
    beard: "short", hair: "#2A211C", brows: "soft", prop: "rose", pearls: true, age: 35,
  },
  muhammadShahSlumped: { base: "muhammadShah", prop: "none", brows: "worried" },
  nadirShah: {
    name: "Nadir Shah", skin: "#B98458", jama: "#9E2B25", mail: true, breastplate: true, sash: "#2B2622", trousers: "#3A3330",
    shoes: "#2B2622", head: "nadir", headColor: "#B8362E", headBand: "#1E1A17", beard: "full", hair: "#1E1A17", brows: "stern",
    prop: "dagger", gauntlet: true, age: 50, tall: 1.03,
  },
  saadatKhan: {
    name: "Saadat Khan", skin: "#C39069", jama: "#7A4B6B", sash: "#E2C98F", trousers: "#E9DCC0", shoes: "#6B4A2E",
    head: "turban", headColor: "#E9DCC0", headBand: "#7A4B6B", beard: "white", hair: "#E8E2D6", brows: "worried", prop: "none", age: 60,
    wrinkles: true,
  },
  nizam: {
    name: "Nizam-ul-Mulk", skin: "#BE8C62", jama: "#3F7F6A", sash: "#E9DCC0", trousers: "#E9DCC0", shoes: "#2B2622",
    head: "turban", headColor: "#FFFFFF", headBand: "#3F7F6A", beard: "white", hair: "#EDE7DB", brows: "flat", prop: "none", age: 67,
    wrinkles: true,
  },
  bajiRao: {
    name: "Baji Rao I", skin: "#A87449", jama: "#F4EEE2", sash: "#D9822B", trousers: "#F4EEE2", shoes: "#6B4A2E",
    head: "pagadi", headColor: "#D9822B", headBand: "#B8892E", beard: "none", moustache: true, hair: "#1E1A17", brows: "flat", prop: "none", age: 37,
  },
  companyMerchant: {
    name: "Company merchant", skin: "#E3BFA0", jama: "#2B2622", coat: true, sash: "#E9DCC0", trousers: "#2B2622", shoes: "#1E1A17",
    head: "tricorn", headColor: "#1E1A17", headBand: "#1E1A17", beard: "none", hair: "#8A6A4A", brows: "flat", prop: "ledger", age: 40,
  },
  abdali: {
    name: "Ahmad Shah Abdali", skin: "#B98458", jama: "#5B6770", sash: "#C9A24A", trousers: "#3A3330", shoes: "#2B2622",
    head: "turban", headColor: "#E9DCC0", headBand: "#5B6770", beard: "short", hair: "#1E1A17", brows: "stern", prop: "none", age: 25,
  },
};
Object.assign(CAST, {
  persianSoldier: {
    name: "Persian musketeer", skin: "#B98458", jama: "#3E8E8A", sash: "#C9A24A", trousers: "#2E3A3E", shoes: "#2B2622",
    head: "nadir", headColor: "#B8362E", headBand: "#1E1A17", beard: "short", hair: "#1E1A17", brows: "stern", prop: "musket", age: 30,
  },
  poet: {
    name: "court poet", skin: "#C59168", jama: "#E9DCC0", sash: "#4F7A3A", trousers: "#F4EEE2", shoes: "#6B4A2E",
    head: "turban", headColor: "#4F7A3A", headBand: "#C9A24A", beard: "short", hair: "#2A211C", brows: "soft", prop: "scroll", age: 40,
  },
  courtier: {
    name: "Mughal noble", skin: "#BE8C62", jama: "#4F7A3A", sash: "#C9A24A", trousers: "#E9DCC0", shoes: "#2B2622",
    head: "turban", headColor: "#F4EBDD", headBand: "#C9A24A", beard: "short", hair: "#2A211C", brows: "flat", prop: "none", age: 45,
  },
});
export function spec(key, over = {}) {
  let s = CAST[key];
  if (s.base) s = { ...CAST[s.base], ...s };
  return { ...s, ...over };
}

// ---------- parts ----------
function headwear(s, p) {
  const c = s.headColor, d = shade(c, 0.82), band = s.headBand;
  if (s.head === "turban") {
    return `<g id="${p}-hat">
      <path d="M-50,-74 C-56,-108 -30,-128 0,-128 C30,-128 56,-108 50,-74 C30,-84 -30,-84 -50,-74Z" fill="${c}" stroke="${INK}" stroke-width="${sw}"/>
      <path d="M-48,-88 C-20,-104 22,-110 48,-92" fill="none" stroke="${d}" stroke-width="5"/>
      <path d="M-46,-100 C-18,-116 22,-118 44,-104" fill="none" stroke="${d}" stroke-width="5"/>
      <path d="M-50,-74 C-30,-84 30,-84 50,-74 L50,-68 C30,-77 -30,-77 -50,-68Z" fill="${band}" stroke="${INK}" stroke-width="${sw}"/>
      ${s.jewel ? `<circle cx="6" cy="-102" r="7" fill="${s.jewel}" stroke="${INK}" stroke-width="${sw}"/>` : ""}
      ${s.plume ? `<path d="M8,-108 C2,-140 18,-160 30,-168 C26,-150 22,-128 14,-106Z" fill="#F4EBDD" stroke="${INK}" stroke-width="${sw}"/><path d="M14,-112 L26,-160" stroke="${d}" stroke-width="2"/>` : ""}
    </g>`;
  }
  if (s.head === "nadir") {
    // tall red cap with black lambskin band (kolah-e Naderi, simplified)
    let bumps = "";
    for (let i = -48; i <= 48; i += 12) bumps += `<circle cx="${i}" cy="-84" r="9" fill="${band}"/>`;
    return `<g id="${p}-hat">
      <path d="M-40,-86 L-30,-168 C-16,-182 16,-182 30,-168 L40,-86Z" fill="${c}" stroke="${INK}" stroke-width="${sw}"/>
      <path d="M0,-176 L0,-90 M-18,-172 L-24,-90 M18,-172 L24,-90" stroke="${shade(c, 0.75)}" stroke-width="4"/>
      <rect x="-54" y="-96" width="108" height="22" rx="8" fill="${band}" stroke="${INK}" stroke-width="${sw}"/>${bumps}
      <path d="M-2,-176 C-6,-196 6,-206 14,-212 C10,-196 10,-186 6,-176Z" fill="#F4EBDD" stroke="${INK}" stroke-width="${sw}"/>
    </g>`;
  }
  if (s.head === "pagadi") {
    return `<g id="${p}-hat">
      <path d="M-52,-72 C-58,-112 -26,-130 6,-128 C40,-126 58,-104 52,-72 C30,-82 -30,-82 -52,-72Z" fill="${c}" stroke="${INK}" stroke-width="${sw}"/>
      <path d="M-30,-118 C-10,-140 30,-140 46,-118 C30,-122 0,-122 -30,-118Z" fill="${shade(c, 0.85)}" stroke="${INK}" stroke-width="${sw}"/>
      <path d="M-50,-86 L50,-96 M-48,-100 L46,-110" stroke="${band}" stroke-width="5"/>
      <path d="M40,-112 C58,-118 66,-132 60,-146 C52,-132 46,-124 34,-118Z" fill="${shade(c, 0.85)}" stroke="${INK}" stroke-width="${sw}"/>
    </g>`;
  }
  if (s.head === "tricorn") {
    return `<g id="${p}-hat"><path d="M-62,-80 C-40,-96 40,-96 62,-80 C48,-118 20,-124 0,-124 C-20,-124 -48,-118 -62,-80Z" fill="${c}" stroke="${INK}" stroke-width="${sw}"/>
      <path d="M-62,-80 C-40,-90 40,-90 62,-80" fill="none" stroke="#C9A24A" stroke-width="3"/></g>`;
  }
  return "";
}

function beard(s) {
  const b = s.beard === "white" ? "#EDE7DB" : s.hair;
  if (s.beard === "short") return `<path d="M-40,-40 C-38,-8 -16,6 0,6 C16,6 38,-8 40,-40 C28,-22 -28,-22 -40,-40Z" fill="${b}" stroke="${INK}" stroke-width="${sw}"/>`;
  if (s.beard === "full") return `<path d="M-44,-44 C-46,0 -20,26 0,28 C20,26 46,0 44,-44 C30,-20 -30,-20 -44,-44Z" fill="${b}" stroke="${INK}" stroke-width="${sw}"/>`;
  if (s.beard === "white") return `<path d="M-42,-44 C-46,2 -18,30 0,34 C18,30 46,2 42,-44 C30,-20 -30,-20 -42,-44Z" fill="${b}" stroke="${INK}" stroke-width="${sw}"/>`;
  return "";
}

function face(s, p) {
  const sk = s.skin, ear = shade(sk, 0.9);
  const browStyles = {
    soft: ["M-27,-70 C-22,-74 -14,-74 -9,-71", "M9,-71 C14,-74 22,-74 27,-70"],
    flat: ["M-27,-71 L-9,-72", "M9,-72 L27,-71"],
    stern: ["M-28,-76 L-8,-68", "M8,-68 L28,-76"],
    worried: ["M-27,-68 L-9,-76", "M9,-76 L27,-68"],
  };
  const [bl, br] = browStyles[s.brows] || browStyles.flat;
  const bcol = s.beard === "white" ? "#CFC8BC" : INK;
  const mustache = (s.beard && s.beard !== "none") || s.moustache
    ? `<path d="M-16,-36 C-8,-42 8,-42 16,-36 C8,-38 -8,-38 -16,-36Z" fill="${s.beard === "white" ? "#EDE7DB" : s.hair}" stroke="${INK}" stroke-width="1.5"/>` : "";
  return `
    <circle cx="-48" cy="-50" r="9" fill="${ear}" stroke="${INK}" stroke-width="${sw}"/>
    <circle cx="48" cy="-50" r="9" fill="${ear}" stroke="${INK}" stroke-width="${sw}"/>
    <circle cx="0" cy="-52" r="48" fill="${sk}" stroke="${INK}" stroke-width="${sw}"/>
    ${s.head === "tricorn" ? `<path d="M-46,-66 C-44,-96 44,-96 46,-66 C30,-80 -30,-80 -46,-66Z" fill="${s.hair}"/>` : ""}
    ${beard(s)}
    ${s.wrinkles ? `<path d="M-30,-86 L-12,-88 M12,-88 L30,-86" stroke="${shade(sk, 0.7)}" stroke-width="2"/>` : ""}
    <g id="${p}-eyes">
      <g id="${p}-eyes-open"><circle cx="-17" cy="-58" r="5.5" fill="${INK}"/><circle cx="17" cy="-58" r="5.5" fill="${INK}"/></g>
      <g id="${p}-eyes-shut" opacity="0"><path d="M-23,-58 L-11,-58 M11,-58 L23,-58" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>
    </g>
    <g id="${p}-brows" transform="translate(0,0)"><path d="${bl}" stroke="${bcol}" stroke-width="4" stroke-linecap="round" fill="none"/><path d="${br}" stroke="${bcol}" stroke-width="4" stroke-linecap="round" fill="none"/></g>
    <path d="M0,-52 C-3,-46 -3,-42 2,-40" stroke="${shade(sk, 0.62)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    ${mustache}
    <g id="${p}-mouth">
      <path id="${p}-m0" d="M-9,-28 C-3,-25 3,-25 9,-28" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse id="${p}-m1" cx="0" cy="-27" rx="7" ry="4" fill="#5A2A24" stroke="${INK}" stroke-width="1.5" opacity="0"/>
      <ellipse id="${p}-m2" cx="0" cy="-26" rx="8" ry="8" fill="#5A2A24" stroke="${INK}" stroke-width="1.5" opacity="0"/>
    </g>`;
}

function torso(s, p) {
  const j = s.jama, jd = shade(j, 0.8);
  let pat = "";
  if (s.jamaPattern) {
    for (let y = -238; y < -76; y += 26) for (let x = -64; x < 66; x += 26) {
      const xx = x + ((y / 26) % 2 ? 13 : 0);
      const col = (Math.abs(x + y) % 52 < 26) ? s.jamaPattern : s.jamaPattern2;
      pat += `<g transform="translate(${xx},${y})"><circle r="4.5" fill="${col}"/><circle cx="0" cy="-6" r="3" fill="${col}"/><circle cx="6" cy="0" r="3" fill="${col}"/><circle cx="0" cy="6" r="3" fill="${col}"/><circle cx="-6" cy="0" r="3" fill="${col}"/><circle r="2" fill="#F6E7A8"/></g>`;
    }
  }
  let mail = "";
  if (s.mail) {
    for (let y = -244; y < -160; y += 9) for (let x = -40; x <= 40; x += 9) mail += `<circle cx="${x + ((y / 9) % 2 ? 4.5 : 0)}" cy="${y}" r="3.6" fill="none" stroke="#5E6266" stroke-width="1.6"/>`;
  }
  const shape = "M-38,-252 C-20,-258 20,-258 38,-252 L32,-160 C46,-130 58,-100 66,-70 L-66,-70 C-58,-100 -46,-130 -32,-160Z";
  const coatShape = "M-40,-252 C-20,-258 20,-258 40,-252 L42,-150 L50,-74 L-50,-74 L-42,-150Z";
  const body = s.coat ? coatShape : shape;
  return `<g id="${p}-torso">
    <clipPath id="${p}-tclip"><path d="${body}"/></clipPath>
    <path d="${body}" fill="${j}" stroke="${INK}" stroke-width="${sw}"/>
    <g clip-path="url(#${p}-tclip)">
      ${pat}
      ${s.mail ? `<rect x="-46" y="-256" width="92" height="98" fill="#9AA0A4"/>${mail}` : ""}
      <path d="M-66,-70 L-60,-96 L-40,-70Z M66,-70 L60,-96 L40,-70Z" fill="${jd}"/>
      <path d="M14,-160 C26,-126 36,-100 42,-70 L66,-70 C58,-100 46,-130 32,-160Z" fill="${jd}" opacity="0.55"/>
    </g>
    ${s.coat ? `<path d="M0,-250 L0,-80" stroke="#C9A24A" stroke-width="3"/><path d="M-14,-252 L0,-226 L14,-252" fill="#F4EEE2" stroke="${INK}" stroke-width="${sw}"/>` : `<path d="M-14,-254 L4,-214 L14,-252" fill="none" stroke="${jd}" stroke-width="4"/>`}
    ${s.breastplate ? `<circle cx="0" cy="-206" r="24" fill="#B9BEC2" stroke="${INK}" stroke-width="${sw}"/><circle cx="0" cy="-206" r="14" fill="none" stroke="#7E8488" stroke-width="3"/><circle cx="0" cy="-206" r="4" fill="#C9A24A"/>` : ""}
    <rect x="-36" y="-170" width="72" height="16" rx="3" fill="${s.sash}" stroke="${INK}" stroke-width="${sw}"/>
    ${s.coat ? "" : `<path d="M-6,-156 L-12,-104 L4,-104 L6,-156Z" fill="${s.sash}" stroke="${INK}" stroke-width="${sw}"/>`}
    ${s.prop === "dagger" ? `<g transform="translate(18,-166) rotate(28)"><rect x="-4" y="-26" width="8" height="26" rx="2" fill="#C9A24A" stroke="${INK}" stroke-width="${sw}"/><rect x="-11" y="-2" width="22" height="7" rx="2" fill="#C9A24A" stroke="${INK}" stroke-width="${sw}"/><path d="M-6,5 L6,5 L3,38 L0,46 L-3,38Z" fill="#3A3330" stroke="${INK}" stroke-width="${sw}"/></g>` : ""}
    ${s.pearls ? `<path d="M-26,-246 C-20,-200 20,-200 26,-246" fill="none" stroke="#F4EEE2" stroke-width="6" stroke-dasharray="1 7" stroke-linecap="round"/>` : ""}
  </g>`;
}

// mitten hand with a thumb (drawn at the wrist, pointing down the forearm); `front` adds fingers that wrap a held prop
function hand(col, side, gripped) {
  const t = side === "L" ? -1 : 1; // thumb toward the body's front
  return `<g class="hand"><path d="M-10,0 C-12,10 -10,20 0,21 C10,20 12,10 10,0Z" fill="${col}" stroke="${INK}" stroke-width="${sw}"/>
    <path d="M${8 * t},3 C${17 * t},2 ${19 * t},11 ${11 * t},13Z" fill="${col}" stroke="${INK}" stroke-width="${sw}"/>
    ${gripped ? "" : `<path d="M-5,14 L-5,19 M0,15 L0,20 M5,14 L5,19" stroke="${shade(col, 0.7)}" stroke-width="1.6"/>`}</g>`;
}
const fingersOver = (col) => `<path d="M-11,6 C-11,13 11,13 11,6 L11,12 C11,19 -11,19 -11,12Z" fill="${col}" stroke="${INK}" stroke-width="${sw}"/><path d="M-4,8 L-4,16 M3,8 L3,16" stroke="${shade(col, 0.7)}" stroke-width="1.6"/>`;

function arm(s, p, side, pose) {
  // side: "L" = screen-left shoulder (x=-38), "R" = screen-right (x=+38). Tapered upper and lower arm, elbow joint, mitten hand.
  const x = side === "L" ? -38 : 38;
  const sleeve = s.mail ? "#9AA0A4" : s.coat ? s.jama : shade(s.jama, side === "L" ? 0.88 : 1);
  const hc = s.gauntlet ? "#6E7478" : s.skin;
  const [u, l] = pose || [side === "L" ? 8 : -8, side === "L" ? 6 : -6];
  let prop = "", grip = false;
  if (side === "R" && s.prop === "rose") { grip = true; prop = `<g transform="translate(0,58)"><path d="M0,14 L-4,-40" stroke="#4F7A3A" stroke-width="4"/><path d="M-3,-18 C-15,-24 -17,-14 -5,-12Z" fill="#4F7A3A"/><g transform="translate(-4,-46)"><circle r="12" fill="#C0392B" stroke="${INK}" stroke-width="${sw}"/><path d="M-6,-2 C-2,-8 4,-6 6,0 M-3,4 C0,0 4,2 5,5" stroke="#7E1F18" stroke-width="2" fill="none"/></g></g>`; }
  if (side === "R" && s.prop === "ledger") { grip = true; prop = `<g transform="translate(-2,66) rotate(-10)"><rect x="-18" y="-14" width="36" height="46" rx="3" fill="#7A2A22" stroke="${INK}" stroke-width="${sw}"/><rect x="-14" y="-10" width="4" height="38" fill="#C9A24A"/></g>`; }
  if (side === "R" && s.prop === "musket") { grip = true; prop = `<g transform="translate(0,62) rotate(-8)"><path d="M-4,-150 L4,-150 L6,40 L12,70 L-6,70 L-4,40Z" fill="#5A3E2A" stroke="${INK}" stroke-width="${sw}"/><rect x="-2.5" y="-170" width="5" height="40" fill="#7E8488" stroke="${INK}" stroke-width="1.5"/></g>`; }
  if (side === "R" && s.prop === "gem") { grip = true; prop = `<g transform="translate(0,84) rotate(180) scale(0.42)"><path d="M-90,-30 L-50,-70 L50,-70 L90,-30 L0,80Z" fill="#DCEAF0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-90,-30 L90,-30 M-50,-70 L-30,-30 L0,-70 L30,-30 L50,-70 M-30,-30 L0,80 L30,-30" fill="none" stroke="${INK}" stroke-width="3"/><path d="M30,-30 L90,-30 L0,80Z" fill="#8FA9B4"/><path d="M-30,-30 L0,80 L-90,-30Z" fill="#B9CCD4"/><path d="M0,-70 L30,-30 L-30,-30Z" fill="#FFFFFF"/><path d="M-40,-150 L-30,-112 L8,-102 L-30,-92 L-40,-54 L-50,-92 L-88,-102 L-50,-112Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/></g>`; }
  if (side === "R" && s.prop === "scroll") { grip = true; prop = `<g transform="translate(0,66) rotate(-20)"><rect x="-30" y="-8" width="60" height="16" rx="8" fill="#EFE3C8" stroke="${INK}" stroke-width="${sw}"/><rect x="-34" y="-10" width="8" height="20" rx="3" fill="#8A5A3A"/><rect x="26" y="-10" width="8" height="20" rx="3" fill="#8A5A3A"/></g>`; }
  return `<g transform="translate(${x},-242)"><g id="${p}-arm${side}-upper" transform="rotate(${u})">
      <path d="M-13,-4 C-13,-14 13,-14 13,-4 L10,60 L-10,60Z" fill="${sleeve}" stroke="${INK}" stroke-width="${sw}"/>
      <g transform="translate(0,58)"><g id="${p}-arm${side}-lower" transform="rotate(${l})">
        <circle cx="0" cy="0" r="10" fill="${sleeve}" stroke="${INK}" stroke-width="${sw}"/>
        <path d="M-10,0 L10,0 L8,46 L-8,46Z" fill="${sleeve}" stroke="${INK}" stroke-width="${sw}"/>
        <path d="M-9,-2 L9,-2" stroke="${sleeve}" stroke-width="5"/>
        ${s.gauntlet ? `<path d="M-11,30 L11,30 L10,50 L-10,50Z" fill="#6E7478" stroke="${INK}" stroke-width="${sw}"/>` : `<rect x="-9" y="40" width="18" height="7" fill="${s.sash}" stroke="${INK}" stroke-width="1.5"/>`}
        <g transform="translate(0,46)"><g id="${p}-arm${side}-hand">${hand(hc, side, grip)}</g></g>
        ${prop}
        ${grip ? `<g transform="translate(0,46)">${fingersOver(hc)}</g>` : ""}
      </g></g>
    </g></g>`;
}

function leg(s, p, side, seated) {
  // hip pivot at (x,-84); thigh 40, knee joint, shin 34 + shoe. `seated`: thigh forward, shin down (riders, throne).
  const x = side === "L" ? -16 : 16, dir = side === "L" ? -1 : 1;
  const [hu, kl] = seated ? [-80, 80] : [0, 0];
  const shoe = `<path d="M-10,34 L10,34 C${dir > 0 ? 24 : -4},34 ${dir > 0 ? 30 : -30},38 ${dir > 0 ? 28 : -28},44 L${dir > 0 ? 26 : -26},48 L-10,48Z" fill="${s.shoes}" stroke="${INK}" stroke-width="${sw}"/>`;
  return `<g transform="translate(${x},-84)"><g id="${p}-leg${side}" transform="rotate(${hu})">
    <path d="M-12,0 L12,0 L10,40 L-10,40Z" fill="${s.trousers}" stroke="${INK}" stroke-width="${sw}"/>
    <g transform="translate(0,38)"><g id="${p}-leg${side}-lower" transform="rotate(${kl})">
      <circle r="10" fill="${s.trousers}" stroke="${INK}" stroke-width="${sw}"/><path d="M-10,0 L10,0 L8,36 L-8,36Z" fill="${s.trousers}" stroke="${INK}" stroke-width="${sw}"/><path d="M-9,-2 L9,-2" stroke="${s.trousers}" stroke-width="5"/>
      ${shoe}
      ${seated && side === "R" ? `<path d="M-14,40 L14,40 L14,50 L-14,50Z" fill="none" stroke="#8A6A3A" stroke-width="3"/><path d="M0,40 L0,-40" stroke="#8A6A3A" stroke-width="3"/>` : ""}
    </g></g>
  </g></g>`;
}

// pose: { armL:[u,l], armR:[u,l], headTilt }
export function character(key, p, opts = {}) {
  const s = typeof key === "string" ? spec(key, opts.over || {}) : key;
  const pose = opts.pose || {};
  const k = (s.tall || 1);
  return `<g id="${p}-walk" transform="translate(0,0)"><g transform="scale(${k})">
    ${opts.seated ? leg(s, p, "R", true) : leg(s, p, "L") + leg(s, p, "R")}
    <g transform="translate(0,-84)"><g id="${p}-body" transform="scale(1,1)"><g transform="translate(0,84)">
      ${arm(s, p, "L", pose.armL)}
      ${torso(s, p)}
      <g transform="translate(0,-254)"><g id="${p}-head" transform="rotate(${pose.headTilt || 0})">
        <rect x="-12" y="-14" width="24" height="18" fill="${shade(s.skin, 0.85)}" stroke="${INK}" stroke-width="${sw}"/>
        ${face(s, p)}
        ${headwear(s, p)}
      </g></g>
      ${arm(s, p, "R", pose.armR)}
    </g></g></g>
  </g></g>`;
}

// Placement wrapper: the outer group carries position/scale; id p-root is tweened for moves.
export function place(inner, p, x, y, sc = 1, flip = false) {
  return `<g id="${p}-root" transform="translate(${x},${y}) scale(${flip ? -sc : sc},${sc})">${inner}</g>`;
}

// ---------- crowd symbols (reused with <use>) ----------
export function symPersianSoldier(id) {
  // ~150 units tall; origin at feet; turquoise sash, red-and-black cap, musket on shoulder
  return `<symbol id="${id}" overflow="visible">
    <path d="M-10,-56 L-14,0 L-4,0 L0,-40 L4,0 L14,0 L10,-56Z" fill="#3A3330" stroke="${INK}" stroke-width="2"/>
    <path d="M-20,-112 L20,-112 L24,-50 L-24,-50Z" fill="#3E8E8A" stroke="${INK}" stroke-width="2"/>
    <rect x="-24" y="-80" width="48" height="10" fill="#C9A24A" stroke="${INK}" stroke-width="1.5"/>
    <path d="M16,-108 L44,-170" stroke="#4A3A2C" stroke-width="6" stroke-linecap="round"/><path d="M40,-160 L48,-176" stroke="#7E8488" stroke-width="4"/>
    <circle cx="0" cy="-126" r="17" fill="#B98458" stroke="${INK}" stroke-width="2"/>
    <path d="M-9,-117 C-6,-106 6,-106 9,-117 C4,-114 -4,-114 -9,-117Z" fill="#1E1A17"/><circle cx="-6" cy="-128" r="2.4" fill="#1E1A17"/><circle cx="6" cy="-128" r="2.4" fill="#1E1A17"/>
    <path d="M-14,-138 L-10,-170 C-4,-176 4,-176 10,-170 L14,-138Z" fill="#B8362E" stroke="${INK}" stroke-width="2"/>
    <rect x="-19" y="-144" width="38" height="9" rx="3" fill="#1E1A17"/>
  </symbol>`;
}
export function symMughalSoldier(id) {
  return `<symbol id="${id}" overflow="visible">
    <path d="M-10,-56 L-14,0 L-4,0 L0,-40 L4,0 L14,0 L10,-56Z" fill="#E9DCC0" stroke="${INK}" stroke-width="2"/>
    <path d="M-18,-112 L18,-112 L28,-48 L-28,-48Z" fill="#2F5D3A" stroke="${INK}" stroke-width="2"/>
    <rect x="-20" y="-82" width="40" height="8" fill="#C9A24A"/>
    <path d="M-22,-104 L-30,-190" stroke="#4A3A2C" stroke-width="4"/><path d="M-30,-190 L-34,-206 L-26,-192Z" fill="#7E8488"/>
    <circle cx="0" cy="-126" r="17" fill="#C39069" stroke="${INK}" stroke-width="2"/>
    <path d="M-17,-132 C-18,-150 18,-150 17,-132Z" fill="#F4EBDD" stroke="${INK}" stroke-width="2"/>
  </symbol>`;
}
export function symCitizen(id, col = "#8E857A") {
  return `<symbol id="${id}" overflow="visible">
    <path d="M-16,-100 L16,-100 L24,0 L-24,0Z" fill="${col}"/><circle cx="0" cy="-116" r="15" fill="${col}"/>
  </symbol>`;
}
export function symMusician(id, kind = "drum") {
  const inst = kind === "drum"
    ? `<ellipse cx="0" cy="-40" rx="22" ry="12" fill="#C9A24A" stroke="${INK}" stroke-width="2"/><rect x="-22" y="-40" width="44" height="22" fill="#9E2B25" stroke="${INK}" stroke-width="2"/>`
    : `<path d="M-30,-70 L26,-40 L22,-32 L-34,-62Z" fill="#8A5A3A" stroke="${INK}" stroke-width="2"/><circle cx="-26" cy="-62" r="14" fill="#8A5A3A" stroke="${INK}" stroke-width="2"/>`;
  return `<symbol id="${id}" overflow="visible">
    <path d="M-34,0 C-34,-30 -24,-70 0,-76 C24,-70 34,-30 34,0Z" fill="#E7D7BD" stroke="${INK}" stroke-width="2"/>
    <circle cx="0" cy="-92" r="16" fill="#BE8C62" stroke="${INK}" stroke-width="2"/>
    <path d="M-16,-98 C-16,-118 16,-118 16,-98Z" fill="#B8362E" stroke="${INK}" stroke-width="2"/>${inst}
  </symbol>`;
}
export function symCamelGun(id) {
  // camel carrying a light swivel gun (zamburak), simplified
  return `<symbol id="${id}" overflow="visible">
    <path d="M-60,-60 C-60,-100 -30,-120 -10,-100 C0,-130 30,-130 36,-96 L60,-110 L74,-128 L84,-126 L80,-104 L56,-70 L40,-56 L-40,-56Z" fill="#C49A62" stroke="${INK}" stroke-width="2"/>
    <path d="M-50,-58 L-54,0 M-34,-58 L-30,0 M30,-58 L26,0 M44,-62 L48,0" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
    <rect x="-24" y="-124" width="34" height="12" rx="4" fill="#3E8E8A" stroke="${INK}" stroke-width="2"/>
    <path d="M-12,-128 L36,-142" stroke="#5E6266" stroke-width="9" stroke-linecap="round"/>
  </symbol>`;
}
export function symHorseRider(id, turban = "#D9822B") {
  return `<symbol id="${id}" overflow="visible">
    <path d="M-70,-60 C-74,-90 -40,-100 0,-96 L40,-98 L66,-130 L84,-124 L76,-100 L60,-72 L50,-58 L-56,-56Z" fill="#6B4A2E" stroke="${INK}" stroke-width="2"/>
    <path d="M-60,-58 L-70,0 M-44,-58 L-38,0 M36,-60 L30,0 M50,-60 L58,0" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <path d="M-70,-84 C-90,-80 -96,-60 -92,-40" stroke="#3A2A1C" stroke-width="7" fill="none"/>
    <path d="M-14,-96 L-6,-150 L14,-150 L18,-96Z" fill="#F4EEE2" stroke="${INK}" stroke-width="2"/>
    <circle cx="4" cy="-164" r="14" fill="#A87449" stroke="${INK}" stroke-width="2"/>
    <path d="M-12,-170 C-12,-188 20,-190 20,-170Z" fill="${turban}" stroke="${INK}" stroke-width="2"/>
    <path d="M14,-130 L34,-200" stroke="#4A3A2C" stroke-width="4"/>
  </symbol>`;
}
