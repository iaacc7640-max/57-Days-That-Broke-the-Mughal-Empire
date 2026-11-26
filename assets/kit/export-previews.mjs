// Writes standalone SVGs of every rig and set (for browsing the kit; scenes import the modules directly).
import { writeFileSync, mkdirSync } from "node:fs";
import { CAST, character, place } from "./rig.mjs";
import * as SETS from "./sets.mjs";
import { peacockThrone, kohinoor, cart, sarpech, chhatra, handWithGem } from "./props.mjs";
import { horse, camel } from "./animals.mjs";
import { character as ch } from "./rig.mjs";
const R = new URL("../", import.meta.url).pathname;
const wrap = (inner, w = 1920, h = 1080, bg = "#E9DCC0") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${bg}"/>${inner}</svg>`;
for (const k of Object.keys(CAST)) if (!CAST[k].base) writeFileSync(R + `characters/${k}.svg`, wrap(place(character(k, k), k, 300, 760, 1.9), 600, 800));
for (const [k, fn] of Object.entries(SETS)) writeFileSync(R + `sets/${k}.svg`, wrap(fn(k)));
mkdirSync(R + "series/mughals/scenes", { recursive: true });
writeFileSync(R + "series/mughals/scenes/peacock-throne.svg", wrap(`<g transform="translate(500,700) scale(1.4)">${cart("c")}<g transform="translate(0,-150)">${peacockThrone("pt")}</g></g>`, 1000, 800));
writeFileSync(R + "series/mughals/scenes/kohinoor.svg", wrap(`<g transform="translate(300,300) scale(2)">${kohinoor("kn")}</g>`, 600, 600, "#2E3A3E"));
writeFileSync(R + "series/mughals/scenes/sarpech-chhatra.svg", wrap(`<g transform="translate(160,420) scale(1.6)">${sarpech("sp")}</g><g transform="translate(440,560)">${chhatra("ch", 420)}</g>`, 600, 600));
writeFileSync(R + "series/mughals/scenes/kohinoor-in-gauntlet.svg", wrap(`<g transform="translate(300,360) scale(0.9)">${handWithGem("hg")}</g>`, 600, 700, "#6B5E50"));
writeFileSync(R + "characters/horse-with-rider.svg", wrap(`<g transform="translate(330,640)">${horse("h", { rider: ch("bajiRao", "r", { seated: true }) })}</g>`, 700, 700));
writeFileSync(R + "characters/camel-with-gun.svg", wrap(`<g transform="translate(330,560)">${camel("c", { gun: true })}</g>`, 700, 620));
console.log("previews written");
