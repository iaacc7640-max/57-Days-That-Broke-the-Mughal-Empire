// ClearCut History — on-screen text kit (label chip, name card, stamp, trust tags, stat/versus cards, quote card,
// MAP SIMPLIFIED tag). All text >= 36 px at 1080p. Fonts are local woff2 files from npm @fontsource.
export const FONT_CSS = `
@font-face{font-family:"CC Bebas";src:url("assets/fonts/bebas-neue-latin-400-normal.woff2") format("woff2");font-weight:400}
@font-face{font-family:"CC Inter";src:url("assets/fonts/inter-latin-400-normal.woff2") format("woff2");font-weight:400}
@font-face{font-family:"CC Inter";src:url("assets/fonts/inter-latin-600-normal.woff2") format("woff2");font-weight:600}
@font-face{font-family:"CC Inter";src:url("assets/fonts/inter-latin-800-normal.woff2") format("woff2");font-weight:800}
@font-face{font-family:"CC Garamond";src:url("assets/fonts/eb-garamond-latin-500-normal.woff2") format("woff2");font-weight:500}
@font-face{font-family:"CC Garamond";src:url("assets/fonts/eb-garamond-latin-500-italic.woff2") format("woff2");font-weight:500;font-style:italic}
@font-face{font-family:"CC Garamond";src:url("assets/fonts/eb-garamond-latin-600-normal.woff2") format("woff2");font-weight:600}`;

export const UI_CSS = `
.shot{position:absolute;inset:0;overflow:hidden;background:#E9DCC0}
.cam{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:50% 50%}
.cam svg{position:absolute;left:0;top:0;overflow:visible}
.ov{position:absolute;inset:0;pointer-events:none}
.chip{position:absolute;left:96px;top:66px;display:flex;align-items:stretch;font-family:"CC Bebas";color:#F4EEE2;clip-path:inset(0 100% 0 0)}
.chip .a{background:#2B2622;padding:10px 22px 4px;font-size:48px;letter-spacing:2px;line-height:1}
.chip .b{background:#C9A24A;color:#2B2622;padding:10px 20px 4px;font-size:48px;letter-spacing:2px;line-height:1}
.ncard{position:absolute;left:96px;bottom:84px;display:flex;align-items:stretch;font-family:"CC Inter";clip-path:inset(0 100% 0 0)}
.ncard .yr{background:var(--c,#2F5D3A);color:#F4EEE2;font-family:"CC Bebas";font-size:54px;padding:14px 18px 6px;display:flex;align-items:center;border:3px solid #2B2622;border-right:none}
.ncard .tx{background:#F4EEE2;border:3px solid #2B2622;padding:10px 26px 12px;display:flex;flex-direction:column;justify-content:center}
.ncard .nm{font-weight:800;font-size:46px;color:#2B2622;line-height:1.05}
.ncard .rl{font-weight:600;font-size:36px;color:#5A5048;line-height:1.15}
.stamp{position:absolute;font-family:"CC Bebas";font-size:150px;line-height:1;color:#A8322D;border:10px solid #A8322D;padding:14px 34px 0;letter-spacing:6px;background:rgba(244,238,226,0.92);transform-origin:50% 50%}
.tag{position:absolute;font-family:"CC Inter";font-weight:800;font-size:36px;letter-spacing:1px;color:#2B2622;background:#F2C14E;border:3px solid #2B2622;padding:8px 18px;box-shadow:6px 6px 0 #2B2622}
.maptag{position:absolute;right:96px;bottom:66px;font-family:"CC Inter";font-weight:800;font-size:36px;color:#F4EEE2;background:#2B2622;padding:6px 16px;letter-spacing:1px}
.maptag.left{right:auto;left:96px}
.card{position:absolute;background:#F4EEE2;border:4px solid #2B2622;box-shadow:12px 12px 0 #2B2622;font-family:"CC Inter";color:#2B2622}
.big{font-family:"CC Bebas";line-height:0.95}
.quote{position:absolute;left:220px;top:170px;width:1480px;font-family:"CC Garamond";font-weight:500;font-size:66px;line-height:1.28;color:#2B2622}
.quote .w{display:inline-block;opacity:0;margin-right:0.26em}
.quote .k{color:#A8322D;font-weight:600}
.lbl{position:absolute;font-family:"CC Inter";font-weight:800;color:#2B2622;font-size:40px;background:#F4EEE2;border:3px solid #2B2622;padding:4px 14px}
`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
export const chip = (id, a, b) => `<div id="${id}" class="chip"><span class="a">${esc(a)}</span>${b ? `<span class="b">${esc(b)}</span>` : ""}</div>`;
export const nameCard = (id, yr, nm, rl, col = "#2F5D3A", style = "") => `<div id="${id}" class="ncard" style="--c:${col};${style}"><div class="yr">${esc(yr)}</div><div class="tx"><div class="nm">${esc(nm)}</div><div class="rl">${esc(rl)}</div></div></div>`;
export const stamp = (id, text, x, y, style = "") => `<div id="${id}" class="stamp" style="left:${x}px;top:${y}px;opacity:0;${style}">${esc(text)}</div>`;
export const tag = (id, text, x, y, style = "") => `<div id="${id}" class="tag" style="left:${x}px;top:${y}px;opacity:0;${style}">${esc(text)}</div>`;
export const mapTag = (id, left = false) => `<div id="${id}" class="maptag${left ? " left" : ""}">MAP SIMPLIFIED</div>`;
export const quote = (id, words, keys = []) => `<div id="${id}" class="quote">${words.map((w, i) => `<span id="${id}-w${i}" class="w${keys.includes(i) ? " k" : ""}">${esc(w)}</span>`).join("")}</div>`;
