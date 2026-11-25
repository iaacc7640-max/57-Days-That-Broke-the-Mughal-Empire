// Writes standalone SVGs of every rig and set (for browsing the kit; scenes import the modules directly).
import { writeFileSync, mkdirSync } from "node:fs";
import { CAST, character, place } from "./rig.mjs";
import * as SETS from "./sets.mjs";
import { peacockThrone, kohinoor, cart, crown } from "./props.mjs";
const R = new URL("../", import.meta.url).pathname;
const wrap = (inner, w = 1920, h = 1080, bg = "#E9DCC0") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${bg}"/>${inner}</svg>`;
for (const k of Object.keys(CAST)) if (!CAST[k].base) writeFileSync(R + `characters/${k}.svg`, wrap(place(character(k, k), k, 300, 760, 1.9), 600, 800));
for (const [k, fn] of Object.entries(SETS)) writeFileSync(R + `sets/${k}.svg`, wrap(fn(k)));
mkdirSync(R + "series/mughals/scenes", { recursive: true });
writeFileSync(R + "series/mughals/scenes/peacock-throne.svg", wrap(`<g transform="translate(500,700) scale(1.4)">${cart("c")}<g transform="translate(0,-150)">${peacockThrone("pt")}</g></g>`, 1000, 800));
writeFileSync(R + "series/mughals/scenes/kohinoor.svg", wrap(`<g transform="translate(300,300) scale(2)">${kohinoor("kn")}</g>`, 600, 600, "#2E3A3E"));
writeFileSync(R + "series/mughals/scenes/durbar-crown.svg", wrap(`<g transform="translate(300,400) scale(2)">${crown("cr")}</g>`, 600, 500));
console.log("previews written");
