// ClearCut History — rigged animals (side view, facing right, hooves at y=0). Same rig rules as characters:
// every pivot is a translate() wrapper around an animated <g id> whose transform attribute GSAP tweens.
// horse: head with muzzle/eye/ears, arched neck + mane, barrel, tail, 4 legs (upper, knee/hock, lower, hoof).
// camel: long curved neck, one hump, knobby knees, padded feet; optional swivel gun (zamburak) with smoke puffs.
import { INK, shade } from "./rig.mjs";

const leg = (p, id, x, y, len1, len2, col, hoof, far, hind) => {
  const c = far ? shade(col, 0.78) : col;
  const w1 = hind ? 22 : 16, w2 = 10;
  return `<g transform="translate(${x},${y})"><g id="${p}-${id}" transform="rotate(0)">
    <path d="M${-w1},-6 C${-w1},-26 ${w1},-26 ${w1},-6 L${w2 + 2},${len1} L${-w2 - 2},${len1}Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <g transform="translate(0,${len1})"><g id="${p}-${id}-lo" transform="rotate(0)">
      <circle r="${w2 + 1}" fill="${c}" stroke="${INK}" stroke-width="2"/>
      <path d="M${-w2 + 2},0 L${w2 - 2},0 L${w2 - 3},${len2} L${-w2 + 3},${len2}Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
      <path d="M${-w2 + 3},-2 L${w2 - 3},-2" stroke="${c}" stroke-width="5"/>
      <path d="M${-w2},${len2} L${w2 + 2},${len2} L${w2 + 4},${len2 + 16} L${-w2 - 1},${len2 + 16}Z" fill="${hoof}" stroke="${INK}" stroke-width="2"/>
    </g></g></g></g>`;
};

export function horse(p, { col = "#7A5234", mane = "#2E2420", saddle = "#D9822B", tack = "#3A2A1C", rider = "" } = {}) {
  // hooves at y=0: legs 105 + 95 + 16 = 216 below the shoulder/hip line at y=-216; back ~ -290
  const L1 = 100, L2 = 100, Y = -216;
  return `<g id="${p}">
    <g id="${p}-bob" transform="translate(0,0)">
      ${leg(p, "rf", 92, Y, L1, L2, col, "#2B2622", true, false)}${leg(p, "rh", -112, Y, L1, L2, col, "#2B2622", true, true)}
      <g transform="translate(-150,-262)"><g id="${p}-tail" transform="rotate(0)"><path d="M0,0 C-30,10 -46,60 -40,130 C-28,120 -20,80 -8,50 C-4,30 2,12 0,0Z" fill="${mane}" stroke="${INK}" stroke-width="2"/></g></g>
      <path d="M-160,-250 C-170,-300 -120,-312 -40,-306 C40,-300 110,-312 140,-282 C160,-262 150,-200 120,-190 L-130,-186 C-160,-192 -168,-220 -160,-250Z" fill="${col}" stroke="${INK}" stroke-width="2.2"/>
      <path d="M-120,-200 C-60,-188 40,-188 110,-196" stroke="${shade(col, 0.8)}" stroke-width="6" fill="none"/>
      <g transform="translate(118,-282)"><g id="${p}-neck" transform="rotate(0)">
        <path d="M-30,10 C-20,-40 10,-90 50,-120 L86,-96 C70,-60 50,-20 34,26Z" fill="${col}" stroke="${INK}" stroke-width="2.2"/>
        <path d="M-26,0 C-18,-44 10,-92 46,-122 C34,-100 14,-70 0,-30 C-6,-14 -14,-2 -26,0Z" fill="${mane}" stroke="${INK}" stroke-width="2"/>
        <g transform="translate(66,-112)"><g id="${p}-head" transform="rotate(0)">
          <path d="M-16,-14 C0,-30 30,-22 64,6 C78,18 76,34 62,38 C44,42 20,30 -6,18 C-20,10 -24,-4 -16,-14Z" fill="${col}" stroke="${INK}" stroke-width="2.2"/>
          <ellipse cx="62" cy="26" rx="14" ry="11" fill="${shade(col, 0.7)}" stroke="${INK}" stroke-width="2"/>
          <circle cx="66" cy="22" r="2.4" fill="${INK}"/>
          <path d="M-4,-14 L-2,-40 L10,-18Z M8,-18 L14,-42 L22,-16Z" fill="${col}" stroke="${INK}" stroke-width="2"/>
          <circle cx="18" cy="-4" r="4.2" fill="${INK}"/><circle cx="19.4" cy="-5.4" r="1.2" fill="#F4EEE2"/>
          <path d="M4,-12 C24,2 44,14 66,34 M66,34 C40,40 20,34 2,22" stroke="${tack}" stroke-width="3" fill="none"/>
        </g></g>
      </g></g>
      <path d="M-58,-312 C-40,-326 40,-326 58,-312 L52,-280 L-52,-280Z" fill="${saddle}" stroke="${INK}" stroke-width="2"/>
      <path d="M-40,-282 L-40,-250 M40,-282 L40,-250" stroke="${tack}" stroke-width="4"/>
      <path d="M-70,-262 L72,-262" stroke="${tack}" stroke-width="5"/>
      ${leg(p, "lf", 76, Y, L1, L2, col, "#2B2622", false, false)}${leg(p, "lh", -128, Y, L1, L2, col, "#2B2622", false, true)}
      ${rider ? `<g transform="translate(-6,-223)">${rider}</g>` : ""}
    </g>
  </g>`;
}

// 4-beat walk (LH, LF, RH, RF) or gallop. Returns timeline code (CC.track calls) for [t0,t1].
export function horseWalkJS(p, t0, t1, { period = 1.0, gait = "walk" } = {}) {
  const r = (v) => Math.round(v * 1000) / 1000;
  const N = Math.max(2, Math.ceil((t1 - t0) / (period / 8)));
  const ph = gait === "gallop" ? { lh: 0, rh: 0.1, lf: 0.45, rf: 0.55 } : { lh: 0, lf: 0.25, rh: 0.5, rf: 0.75 };
  const amp = gait === "gallop" ? 34 : 20;
  let js = "";
  for (const [leg, o] of Object.entries(ph)) {
    const hind = leg.endsWith("h"), up = [], lo = [];
    for (let i = 0; i <= N; i++) {
      const t = t0 + (i * (t1 - t0)) / N, a = 2 * Math.PI * ((t - t0) / period + o);
      up.push([r(t), r(amp * Math.sin(a))]);
      const lift = Math.max(0, Math.sin(a + Math.PI / 2));
      lo.push([r(t), r((hind ? -1 : 1) * (gait === "gallop" ? 60 : 42) * lift)]);
    }
    js += `CC.track(tl,'${p}-${leg}','rot',${JSON.stringify(up)},'none');CC.track(tl,'${p}-${leg}-lo','rot',${JSON.stringify(lo)},'none');`;
  }
  const bob = [], nod = [], tail = [];
  for (let i = 0; i <= N; i++) {
    const t = t0 + (i * (t1 - t0)) / N, a = 2 * Math.PI * ((t - t0) / period);
    bob.push([r(t), [0, r((gait === "gallop" ? 10 : 4) * Math.sin(2 * a))]]);
    nod.push([r(t), r((gait === "gallop" ? 8 : 5) * Math.sin(2 * a + 0.6))]);
    tail.push([r(t), r(8 * Math.sin(a * 0.5))]);
  }
  js += `CC.track(tl,'${p}-bob','mv',${JSON.stringify(bob)},'none');CC.track(tl,'${p}-neck','rot',${JSON.stringify(nod)},'none');CC.track(tl,'${p}-tail','rot',${JSON.stringify(tail)},'none');`;
  return js;
}

export function camel(p, { col = "#C49A62", gun = false, sash = "#3E8E8A" } = {}) {
  const Y = -250, L1 = 120, L2 = 118;
  const cl = (id, x, far) => {
    const c = far ? shade(col, 0.8) : col;
    return `<g transform="translate(${x},${Y})"><g id="${p}-${id}" transform="rotate(0)">
      <path d="M-16,-10 C-16,-30 16,-30 16,-10 L10,${L1} L-10,${L1}Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
      <g transform="translate(0,${L1})"><g id="${p}-${id}-lo" transform="rotate(0)">
        <circle r="12" fill="${shade(c, 0.9)}" stroke="${INK}" stroke-width="2"/>
        <path d="M-8,0 L8,0 L7,${L2} L-7,${L2}Z" fill="${c}" stroke="${INK}" stroke-width="2"/>
        <ellipse cx="4" cy="${L2 + 4}" rx="20" ry="9" fill="${shade(c, 0.7)}" stroke="${INK}" stroke-width="2"/>
      </g></g></g></g>`;
  };
  return `<g id="${p}"><g id="${p}-bob" transform="translate(0,0)">
    ${cl("rf", 96, true)}${cl("rh", -96, true)}
    <path d="M-150,-286 C-160,-250 -150,-226 -120,-220 L110,-222 C140,-230 150,-262 140,-290 C120,-330 60,-330 30,-350 C0,-420 -90,-410 -110,-340 C-130,-330 -146,-310 -150,-286Z" fill="${col}" stroke="${INK}" stroke-width="2.2"/>
    <path d="M-146,-270 C-160,-240 -170,-210 -166,-190" stroke="${INK}" stroke-width="5" fill="none"/>
    <g transform="translate(126,-280)"><g id="${p}-neck" transform="rotate(0)">
      <path d="M-14,0 C20,10 50,10 66,-20 C80,-60 84,-110 104,-130 L130,-118 C112,-96 108,-50 96,-10 C80,34 30,40 -6,28Z" fill="${col}" stroke="${INK}" stroke-width="2.2"/>
      <g transform="translate(116,-126)"><path d="M-14,-14 C10,-26 46,-20 60,-2 C64,8 56,16 44,16 C24,16 4,10 -12,8Z" fill="${col}" stroke="${INK}" stroke-width="2.2"/>
        <circle cx="12" cy="-6" r="3.6" fill="${INK}"/><path d="M-6,-16 L-2,-28 L6,-16Z" fill="${col}" stroke="${INK}" stroke-width="2"/><path d="M42,8 L56,8" stroke="${INK}" stroke-width="2"/></g>
    </g></g>
    <path d="M-80,-372 C-70,-386 10,-386 20,-366 L14,-344 L-74,-344Z" fill="${sash}" stroke="${INK}" stroke-width="2"/>
    ${gun ? `<g transform="translate(-30,-380)"><g id="${p}-gun" transform="rotate(0)"><rect x="-6" y="-30" width="12" height="30" fill="#4A3A2C" stroke="${INK}" stroke-width="2"/><path d="M-10,-34 L96,-50 L98,-38 L-8,-24Z" fill="#5E6266" stroke="${INK}" stroke-width="2"/><circle cx="-6" cy="-30" r="8" fill="#5E6266" stroke="${INK}" stroke-width="2"/></g>
      <g transform="translate(104,-46)"><g id="${p}-smoke" opacity="0" transform="scale(0.2)"><circle cx="0" cy="0" r="22" fill="#E8E2D6" stroke="${INK}" stroke-width="2"/><circle cx="24" cy="-10" r="18" fill="#E8E2D6" stroke="${INK}" stroke-width="2"/><circle cx="20" cy="14" r="16" fill="#E8E2D6" stroke="${INK}" stroke-width="2"/><circle cx="44" cy="2" r="14" fill="#E8E2D6" stroke="${INK}" stroke-width="2"/></g></g></g>` : ""}
    ${cl("lf", 80, false)}${cl("lh", -112, false)}
  </g></g>`;
}

// camel pace: both legs on one side move together; body sways
export function camelWalkJS(p, t0, t1, { period = 1.3 } = {}) {
  const r = (v) => Math.round(v * 1000) / 1000;
  const N = Math.max(2, Math.ceil((t1 - t0) / (period / 8)));
  const ph = { lh: 0, lf: 0, rh: 0.5, rf: 0.5 };
  let js = "";
  for (const [leg, o] of Object.entries(ph)) {
    const up = [], lo = [];
    for (let i = 0; i <= N; i++) {
      const t = t0 + (i * (t1 - t0)) / N, a = 2 * Math.PI * ((t - t0) / period + o);
      up.push([r(t), r(16 * Math.sin(a))]);
      lo.push([r(t), r((leg.endsWith("h") ? -1 : 1) * 30 * Math.max(0, Math.sin(a + Math.PI / 2)))]);
    }
    js += `CC.track(tl,'${p}-${leg}','rot',${JSON.stringify(up)},'none');CC.track(tl,'${p}-${leg}-lo','rot',${JSON.stringify(lo)},'none');`;
  }
  const bob = [], nod = [];
  for (let i = 0; i <= N; i++) {
    const t = t0 + (i * (t1 - t0)) / N, a = 2 * Math.PI * ((t - t0) / period);
    bob.push([r(t), [0, r(5 * Math.sin(2 * a))]]);
    nod.push([r(t), r(6 * Math.sin(a))]);
  }
  return js + `CC.track(tl,'${p}-bob','mv',${JSON.stringify(bob)},'none');CC.track(tl,'${p}-neck','rot',${JSON.stringify(nod)},'none');`;
}

// gun fires: recoil + flat smoke puff that grows and fades (crisp shapes, no blur)
export function camelFireJS(p, t) {
  const r = (v) => Math.round(v * 1000) / 1000;
  return `CC.track(tl,'${p}-gun','rot',[[${r(t)},0],[${r(t + 0.08)},-7],[${r(t + 0.5)},0]]);` +
    `tl.set(CC.$('${p}-smoke'),{attr:{opacity:0,transform:'scale(0.2)'}},${r(Math.max(0, t - 0.01))});` +
    `tl.fromTo(CC.$('${p}-smoke'),{attr:{opacity:1,transform:'scale(0.3)'}},{attr:{opacity:0,transform:'scale(1.6)'},duration:1.1,ease:'power2.out',immediateRender:false},${r(t)});`;
}

// small background horse-and-rider with a readable silhouette (head, neck, legs); two leg phases to alternate
export function symHorseRiderSmall(id, { turban = "#D9822B", col = "#6B4A2E", coat = "#F4EEE2", phase = 0 } = {}) {
  const legs = phase === 0
    ? "M-56,-60 L-66,-4 M-40,-60 L-34,-4 M36,-60 L46,-4 M52,-62 L60,-4"
    : "M-56,-60 L-46,-4 M-40,-60 L-50,-4 M36,-60 L28,-4 M52,-62 L44,-4";
  return `<symbol id="${id}" overflow="visible">
    <path d="${legs}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
    <path d="M-70,-62 C-74,-92 -40,-100 0,-96 L40,-98 C56,-92 62,-70 56,-58 L-60,-56Z" fill="${col}" stroke="${INK}" stroke-width="2"/>
    <path d="M44,-90 C54,-110 64,-128 78,-138 L94,-128 C84,-116 72,-100 60,-78Z" fill="${col}" stroke="${INK}" stroke-width="2"/>
    <path d="M78,-140 C90,-146 108,-138 112,-128 C114,-120 106,-116 98,-118 L84,-124Z" fill="${col}" stroke="${INK}" stroke-width="2"/>
    <path d="M80,-142 L82,-154 L88,-142Z" fill="${col}" stroke="${INK}" stroke-width="1.5"/>
    <path d="M-70,-80 C-90,-74 -96,-56 -92,-36" stroke="#2E2420" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M-14,-96 L-8,-146 L14,-146 L18,-96Z" fill="${coat}" stroke="${INK}" stroke-width="2"/>
    <path d="M4,-98 L18,-70 L14,-62" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="4" cy="-160" r="14" fill="#A87449" stroke="${INK}" stroke-width="2"/>
    <path d="M-12,-166 C-12,-184 20,-186 20,-166Z" fill="${turban}" stroke="${INK}" stroke-width="2"/>
    <path d="M14,-130 L30,-196" stroke="#4A3A2C" stroke-width="4"/>
  </symbol>`;
}
