import fs from 'fs';
const {landD, posts} = JSON.parse(fs.readFileSync('geo.json'));
const P = Object.fromEntries(posts.map(p=>[p.id,p]));
const INK='#2B2622', PAPER='#E9DCC0';
const flags = {
 pt:`<rect width="36" height="24" fill="#F4EFE3"/><path d="M13 6h10v8q0 5-5 6q-5-1-5-6z" fill="#1F4E9C" stroke="${INK}" stroke-width="1"/><circle cx="18" cy="11" r="2" fill="#F4EFE3"/>`,
 nl:`<rect width="36" height="8" fill="#E07A1F"/><rect y="8" width="36" height="8" fill="#F4EFE3"/><rect y="16" width="36" height="8" fill="#1F4E9C"/>`,
 en:`<rect width="36" height="24" fill="#F4EFE3"/>${[0,1,2,3,4,5].map(i=>i%2?'' :`<rect y="${i*4}" width="36" height="4" fill="#B8362E"/>`).join('')}<rect width="15" height="12" fill="#F4EFE3"/><rect x="6" width="3" height="12" fill="#B8362E"/><rect y="4.5" width="15" height="3" fill="#B8362E"/>`,
 fr:`<rect width="36" height="24" fill="#F4EFE3"/>${[[9,7],[18,7],[27,7],[13.5,16],[22.5,16]].map(([x,y])=>`<path d="M${x} ${y-3.5}q2.2 2.5 0 6q-2.2-3.5 0-6zM${x-3} ${y+0.5}h6" fill="#C9A24A" stroke="#C9A24A" stroke-width="1.2"/>`).join('')}`,
 dk:`<rect width="36" height="24" fill="#C8102E"/><rect x="11" width="4.5" height="24" fill="#F4EFE3"/><rect y="9.75" width="36" height="4.5" fill="#F4EFE3"/>`,
};
const flag=(id,x,y,s=1)=>`<g transform="translate(${x},${y}) scale(${s})"><g>${flags[id]}</g><rect width="36" height="24" fill="none" stroke="${INK}" stroke-width="${1.6/s}"/></g>`;
// flat East Indiaman; origin at waterline centre, facing right
function ship(id,x,y,s,flip=false){
 const f = flip?-1:1;
 return `<g transform="translate(${x},${y}) scale(${s*f},${s})">
  <path d="M-150 -6 Q-150 40 -110 52 L105 52 Q150 30 168 -14 L120 -4 L-110 -4 Z" fill="#6B3F24" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M-146 14 L150 14" stroke="#C9A24A" stroke-width="5"/>
  ${[-90,-50,-10,30,70].map(px=>`<rect x="${px}" y="22" width="14" height="11" fill="${INK}"/>`).join('')}
  <path d="M-150 -6 L-150 -40 L-112 -40 L-108 -4" fill="#7E4B2B" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M150 -10 L235 -60" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  ${[[-95,-160,58],[10,-230,70],[105,-175,58]].map(([mx,top,w])=>`
    <path d="M${mx} -4 L${mx} ${top}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
    <path d="M${mx-w} ${top+22} Q${mx} ${top+14} ${mx+w} ${top+22} Q${mx+w+10} ${top+58} ${mx+w-4} ${top+88} Q${mx} ${top+80} ${mx-w+4} ${top+88} Q${mx-w-10} ${top+58} ${mx-w} ${top+22}Z" fill="#F4EBD6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M${mx-w+6} ${top+100} Q${mx} ${top+92} ${mx+w-6} ${top+100} Q${mx+w+4} ${top+130} ${mx+w-10} ${top+160} Q${mx} ${top+152} ${mx-w+10} ${top+160} Q${mx-w-4} ${top+130} ${mx-w+6} ${top+100}Z" fill="#F4EBD6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M${mx-w+14} ${top+40} Q${mx} ${top+46} ${mx+w-14} ${top+40}" stroke="#D8C9A6" stroke-width="3" fill="none"/>`).join('')}
  <path d="M235 -60 L150 -30 L105 -60" fill="none" stroke="${INK}" stroke-width="2"/>
  <path d="M235 -60 Q200 -40 168 -14 L195 -62 Z" fill="#F4EBD6" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <g transform="scale(${f},1)">${flag(id, f>0?10:-46, -282, 1.6)}</g>
  <path d="M10 -230 L10 -284" stroke="${INK}" stroke-width="4"/>
 </g>`;
}
const wave=(x,y,w)=>`<path d="M${x} ${y} q${w/4} -8 ${w/2} 0 t${w/2} 0" fill="none" stroke="#F4EBD6" stroke-width="3" stroke-linecap="round" opacity=".55"/>`;
const routes = [
 // from west/south-west across Arabian Sea
 ['pt', `M560 610 C 700 560, 800 440, ${P.pt.x-8} ${P.pt.y+4}`],
 ['en', `M560 470 C 680 420, 790 300, ${P.en.x-8} ${P.en.y+2}`],
 ['nl', `M760 715 C 900 690, 1120 640, 1110 560 C 1100 500, 1070 440, ${P.nl.x+6} ${P.nl.y}`],
 ['fr', `M820 735 C 980 720, 1150 680, 1140 590 C 1130 530, 1070 470, ${P.fr.x+6} ${P.fr.y}`],
 ['dk', `M900 760 C 1040 740, 1200 700, 1180 610 C 1165 545, 1080 495, ${P.dk.x+6} ${P.dk.y}`],
];
const legend = [
 ['pt','PORTUGUESE','1498'],['nl','DUTCH','1596'],['en','ENGLISH','1600'],['dk','DANES','1616'],['fr','FRENCH','1664'],
];
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Bebas;src:url(node_modules/@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff2)}
@font-face{font-family:Garamond;font-weight:700;font-style:italic;src:url(node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-700-italic.woff2)}
@font-face{font-family:Inter;font-weight:800;src:url(node_modules/@fontsource/inter/files/inter-latin-800-normal.woff2)}
@font-face{font-family:Inter;font-weight:600;src:url(node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2)}
html,body{margin:0;background:${PAPER}}
svg{display:block}
.bebas{font-family:Bebas}.gar{font-family:Garamond;font-style:italic;font-weight:700}.inter{font-family:Inter}
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
 <defs>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .17 0 0 0 0 .15 0 0 0 0 .13 0 0 0 .9 0"/></filter>
  <radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="62%" stop-color="${INK}" stop-opacity="0"/><stop offset="100%" stop-color="${INK}" stop-opacity=".12"/></radialGradient>
  <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0V10" stroke="#C9B48C" stroke-width="2"/></pattern>
  <clipPath id="sea"><rect x="500" y="0" width="780" height="720"/></clipPath>
 </defs>
 <!-- sea + map -->
 <rect width="1280" height="720" fill="#5E8C8A"/>
 <g clip-path="url(#sea)"><g transform="translate(36,0)">
  ${Array.from({length:14},(_,i)=>wave(520+((i*137)%700), 90+((i*211)%600), 46)).join('')}
  <path d="${landD}" fill="#E3D2AE" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="${landD}" fill="url(#hatch)" opacity=".35"/>
  ${routes.map(([id,d])=>`<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-dasharray="1 0" opacity=".0"/><path d="${d}" fill="none" stroke="#F4EBD6" stroke-width="4" stroke-dasharray="12 9" stroke-linecap="round"/>`).join('')}
  ${posts.map(p=>`<g><circle cx="${p.x}" cy="${p.y}" r="10" fill="${p.col}" stroke="${INK}" stroke-width="3.5"/><circle cx="${p.x}" cy="${p.y}" r="3" fill="#F4EBD6"/></g>`).join('')}
  ${posts.map(p=>{const tx=p.x+p.dx, ty=p.y+p.dy; const w=p.name.length*12.5+16; const x0=p.anchor==='end'?tx-w:tx;
    return `<g><rect x="${x0}" y="${ty-17}" width="${w}" height="26" rx="3" fill="${INK}"/><text x="${x0+w/2}" y="${ty+3.5}" text-anchor="middle" class="bebas" font-size="24" letter-spacing="1" fill="#F4EBD6">${p.name}</text></g>`}).join('')}
 </g></g>
 <!-- big ship in Arabian Sea -->
 ${ship('en', 760, 612, 0.86)}
 <path d="M590 642 Q760 630 930 646" stroke="#F4EBD6" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
 ${wave(650,672,70)}${wave(820,664,60)}
 <!-- left paper panel -->
 <path d="M0 0 H572 L520 720 H0 Z" fill="${PAPER}"/>
 <path d="M572 0 L520 720" stroke="${INK}" stroke-width="6"/>
 <g transform="translate(46,0)">
  <text x="0" y="74" class="inter" font-weight="800" font-size="19" letter-spacing="4" fill="#B8362E">CLEARCUT HISTORY · 5-PART SERIES</text>
  <text x="0" y="142" class="gar" font-size="60" fill="${INK}">Advent of the</text>
  <text x="-3" y="276" class="bebas" font-size="142" letter-spacing="0" fill="${INK}">EUROPEANS</text>
  <g transform="translate(0,304)">
   <rect width="226" height="78" fill="#B8362E" stroke="${INK}" stroke-width="4"/>
   <text x="113" y="66" text-anchor="middle" class="bebas" font-size="80" fill="#F4EBD6">IN INDIA</text>
  </g>
  <g transform="translate(244,309) rotate(-6)">
   <rect width="168" height="62" fill="none" stroke="${INK}" stroke-width="4"/>
   <text x="84" y="48" text-anchor="middle" class="bebas" font-size="46" fill="${INK}">1498–1961</text>
  </g>
  ${legend.map(([id,n,y],i)=>`<g transform="translate(0,${432+i*52})">${flag(id,0,2,1.25)}<text x="62" y="30" class="bebas" font-size="40" letter-spacing="1" fill="${INK}">${n}</text><text x="292" y="30" class="inter" font-weight="600" font-size="22" fill="#6B5E4E">${y}</text></g>`).join('')}
 </g>
 <!-- MAP SIMPLIFIED -->
 <g transform="translate(1124,688)"><rect width="140" height="22" fill="${INK}" opacity=".85"/><text x="70" y="16" text-anchor="middle" class="inter" font-weight="800" font-size="12" letter-spacing="2" fill="#F4EBD6">MAP SIMPLIFIED</text></g>
 <rect width="1280" height="720" fill="url(#vig)"/>
 <rect width="1280" height="720" filter="url(#grain)" opacity=".04"/>
</svg></body></html>`;
fs.writeFileSync('thumb.html', html);
