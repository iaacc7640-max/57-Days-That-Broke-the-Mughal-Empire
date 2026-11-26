import fs from 'fs';
import {feature} from 'topojson-client';
import {geoMercator, geoPath} from 'd3-geo';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const land = feature(topo, topo.objects.land);
const W=1280,H=720;
// India + Indian Ocean framed on the right half
const proj = geoMercator().center([74,16]).scale(1250).translate([905,360]);
const path = geoPath(proj);
const landD = path(land);
// trading posts, real lat/lon
const posts = [
 {id:'pt', name:'GOA', lat:15.4909, lon:73.8278, col:'#C9A24A', yr:'1510', dx:-18, dy:4, anchor:'end'},
 {id:'nl', name:'PULICAT', lat:13.4167, lon:80.3167, col:'#E07A1F', yr:'1610', dx:16, dy:-6, anchor:'start'},
 {id:'en', name:'SURAT', lat:21.1702, lon:72.8311, col:'#B8362E', yr:'1612', dx:-18, dy:4, anchor:'end'},
 {id:'fr', name:'PONDICHERRY', lat:11.9416, lon:79.8083, col:'#2F4E8C', yr:'1674', dx:16, dy:10, anchor:'start'},
 {id:'dk', name:'TRANQUEBAR', lat:11.0247, lon:79.8547, col:'#C8102E', yr:'1620', dx:16, dy:26, anchor:'start'},
];
for (const p of posts){ [p.x,p.y]=proj([p.lon,p.lat]); }
fs.writeFileSync('geo.json', JSON.stringify({landD, posts}));
console.log(posts.map(p=>`${p.name} ${p.x.toFixed(0)},${p.y.toFixed(0)}`).join('\n'));
