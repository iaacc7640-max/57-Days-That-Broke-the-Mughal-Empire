// ClearCut History — deterministic animation runtime injected into every HyperFrames scene.
// Everything is a function of timeline time: seeded PRNG, finite repeats, attr-string tweens for SVG rigs.
export const RUNTIME = String.raw`
var CC = (function(){
  function $(id){ return document.getElementById(id); }
  function rng(seed){ var s = (seed>>>0) || 1; return function(){ s = (Math.imul(s,1664525) + 1013904223) >>> 0; return s/4294967296; }; }
  function fmt(kind, v){
    if (kind==='rot') return 'rotate(' + v + ')';
    if (kind==='tr') return 'translate(' + v[0] + ',' + v[1] + ') scale(' + (v[2]==null?1:v[2]) + ',' + (v[3]==null?(v[2]==null?1:v[2]):v[3]) + ')';
    if (kind==='mv') return 'translate(' + v[0] + ',' + v[1] + ')';
    if (kind==='sc') return 'scale(' + v[0] + ',' + v[1] + ')';
    if (kind==='rs') return 'rotate(' + v[0] + ') scale(' + v[1] + ')';
    if (kind==='sk') return 'skewY(' + v + ')';
    return String(v);
  }
  // keys: [[t, value, ease?], ...] ; the value before the first key is the first value.
  function track(tl, id, kind, keys, ease){
    var el = typeof id==='string' ? $(id) : id; if (!el || !keys.length) return;
    tl.set(el, {attr:{transform: fmt(kind, keys[0][1])}}, Math.max(0, keys[0][0]-0.001));
    for (var i=1;i<keys.length;i++){
      var a = keys[i-1], b = keys[i];
      tl.fromTo(el, {attr:{transform: fmt(kind, a[1])}}, {attr:{transform: fmt(kind, b[1])}, duration: Math.max(0.001,b[0]-a[0]), ease: b[2] || ease || 'sine.inOut', immediateRender:false}, a[0]);
    }
  }
  function attr(tl, id, name, keys, ease){
    var el = typeof id==='string' ? $(id) : id; if (!el) return;
    var o = {}; o[name] = keys[0][1]; tl.set(el, {attr:o}, Math.max(0, keys[0][0]-0.001));
    for (var i=1;i<keys.length;i++){
      var f={}, t={}; f[name]=keys[i-1][1]; t[name]=keys[i][1];
      tl.fromTo(el, {attr:f}, {attr:t, duration: Math.max(0.001, keys[i][0]-keys[i-1][0]), ease: keys[i][2] || ease || 'power2.out', immediateRender:false}, keys[i-1][0]);
    }
  }
  function css(tl, id, keys, ease){
    var el = typeof id==='string' ? $(id) : id; if (!el) return;
    tl.set(el, keys[0][1], Math.max(0, keys[0][0]-0.001));
    for (var i=1;i<keys.length;i++){
      var to = Object.assign({}, keys[i][1], {duration: Math.max(0.001, keys[i][0]-keys[i-1][0]), ease: keys[i][2] || ease || 'power2.out', immediateRender:false});
      tl.fromTo(el, Object.assign({}, keys[i-1][1]), to, keys[i-1][0]);
    }
  }
  function show(tl, id, t, on){ var el=$(id); if(el) tl.set(el, {attr:{opacity: on?1:0}}, t); }
  function blink(tl, p, t0, t1, seed){
    var r = rng(seed||7), t = t0 + 0.6 + r()*1.5, o=$(p+'-eyes-open'), s=$(p+'-eyes-shut'); if(!o||!s) return;
    tl.set(o,{attr:{opacity:1}},t0); tl.set(s,{attr:{opacity:0}},t0);
    while (t < t1 - 0.2){ tl.set(o,{attr:{opacity:0}},t); tl.set(s,{attr:{opacity:1}},t); tl.set(o,{attr:{opacity:1}},t+0.13); tl.set(s,{attr:{opacity:0}},t+0.13); t += 3 + r()*2; }
  }
  function talk(tl, p, t0, t1, seed){
    var r = rng(seed||11), t=t0, m=[ $(p+'-m0'), $(p+'-m1'), $(p+'-m2') ]; if(!m[0]) return;
    var last=0;
    while (t < t1){ var k = r()<0.18?0:(r()<0.55?1:2); if(k===last) k=(k+1)%3; for (var j=0;j<3;j++) tl.set(m[j],{attr:{opacity: j===k?1:0}},t); last=k; t += 0.09 + r()*0.07; }
    for (var j=0;j<3;j++) tl.set(m[j],{attr:{opacity: j===0?1:0}},t1);
  }
  function breathe(tl, p, t0, t1, amt){
    var el=$(p+'-body'); if(!el) return; var a = amt||0.018, n = Math.max(1, Math.floor((t1-t0)/1.6));
    tl.fromTo(el,{attr:{transform:'scale(1,1)'}},{attr:{transform:'scale(' + (1+a/3) + ',' + (1+a) + ')'},duration:(t1-t0)/n,ease:'sine.inOut',yoyo:true,repeat:n-1,immediateRender:false},t0);
  }
  // walk cycle: 4 keys per step pair (contact, pass, contact, pass) + bob
  function walk(tl, p, t0, t1, step){
    step = step || 0.5; var L=$(p+'-legL'), R=$(p+'-legR'), W=$(p+'-walk'), aL=$(p+'-armL-upper'), aR=$(p+'-armR-upper');
    var keysL=[], keysR=[], bob=[], kA=[], kB=[], i=0;
    for (var t=t0; t<=t1+0.001; t+=step/2, i++){ var ph = i%4; var a = [22,0,-22,0][ph];
      keysL.push([t, a]); keysR.push([t, -a]); bob.push([t,[0, ph%2? -8:0]]); kA.push([t, 8 - a*0.5]); kB.push([t, -8 + a*0.5]); }
    track(tl,L,'rot',keysL,'sine.inOut'); track(tl,R,'rot',keysR,'sine.inOut'); track(tl,W,'mv',bob,'sine.inOut');
    var KL=$(p+'-legL-lower'), KR=$(p+'-legR-lower');
    if (KL && KR){ var kl=[], kr=[]; keysL.forEach(function(k,j){ var ph=j%4; kl.push([k[0], ph===1?24:(ph===3?4:8)]); kr.push([k[0], ph===3?24:(ph===1?4:8)]); }); track(tl,KL,'rot',kl,'sine.inOut'); track(tl,KR,'rot',kr,'sine.inOut'); }
    if (aL) track(tl,aL,'rot',kA,'sine.inOut'); if (aR) track(tl,aR,'rot',kB,'sine.inOut');
  }
  // crowd: each <use> (or g) bobs with its own phase; rows can march via a separate track.
  function crowd(tl, ids, t0, t1, amp, period, seed){
    var r = rng(seed||3);
    ids.forEach(function(id){ var el=$(id); if(!el) return; var ph = r()*period, n = Math.max(1, Math.floor((t1-t0-ph)/(period/2)));
      var y0 = parseFloat(el.getAttribute('y')||'0');
      tl.fromTo(el,{attr:{y:y0}},{attr:{y:y0-amp},duration:period/2,ease:'sine.inOut',yoyo:true,repeat:n-1,immediateRender:false},t0+ph); });
  }
  function cam(tl, id, t0, t1, a, b, ease){
    var el=$(id); if(!el) return;
    tl.fromTo(el,{scale:a[0],x:a[1]||0,y:a[2]||0},{scale:b[0],x:b[1]||0,y:b[2]||0,duration:t1-t0,ease:ease||'sine.inOut',immediateRender:false},t0);
    tl.set(el,{scale:a[0],x:a[1]||0,y:a[2]||0},Math.max(0,t0-0.001));
  }
  function camTo(px,py,s){ return [s,(960-px)*s,(540-py)*s]; }
  // label chip / name card wipe on + off (hard-edged clip-path wipe)
  function wipe(tl, id, tin, tout){
    var el=$(id); if(!el) return;
    tl.set(el,{clipPath:'inset(0% 100% 0% 0%)'},Math.max(0,tin-0.001));
    tl.fromTo(el,{clipPath:'inset(0% 100% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:0.3,ease:'power3.out',immediateRender:false},tin);
    if (tout!=null) tl.fromTo(el,{clipPath:'inset(0% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 100%)',duration:0.25,ease:'power2.in',immediateRender:false},tout);
  }
  function stampIn(tl, id, t, rot){
    var el=$(id); if(!el) return; rot = rot==null?-6:rot;
    tl.set(el,{opacity:0,scale:1.9,rotation:rot},Math.max(0,t-0.001));
    tl.fromTo(el,{opacity:0,scale:1.9,rotation:rot},{opacity:1,scale:1,rotation:rot,duration:0.16,ease:'power4.in',immediateRender:false},t);
    tl.fromTo(el,{x:0},{x:4,duration:0.05,yoyo:true,repeat:3,ease:'none',immediateRender:false},t+0.16);
  }
  function popIn(tl, id, t, from){
    var el=$(id); if(!el) return; from = from||{y:30};
    tl.set(el, Object.assign({opacity:0}, from), Math.max(0,t-0.001));
    tl.fromTo(el, Object.assign({opacity:0}, from), {opacity:1,x:0,y:0,scale:1,duration:0.3,ease:'back.out(1.6)',immediateRender:false}, t);
  }
  function out(tl, id, t){ var el=$(id); if(!el) return; tl.fromTo(el,{opacity:1},{opacity:0,duration:0.2,immediateRender:false},t); }
  // stroke draw-on for a path (dash offset)
  function draw(tl, id, t, d, ease){
    var el=$(id); if(!el) return; var L = el.getTotalLength ? el.getTotalLength() : 2000;
    el.setAttribute('stroke-dasharray', L + ' ' + L);
    tl.set(el,{attr:{'stroke-dashoffset':L}},Math.max(0,t-0.001));
    tl.fromTo(el,{attr:{'stroke-dashoffset':L}},{attr:{'stroke-dashoffset':0},duration:d,ease:ease||'power1.inOut',immediateRender:false},t);
  }
  // move an icon along a path
  function follow(tl, iconId, pathId, t, d, ease, sc){
    var el=$(iconId), pth=$(pathId); if(!el||!pth) return; var L=pth.getTotalLength(); var o={v:0}; sc = sc||1;
    function put(v){ var q=pth.getPointAtLength(Math.max(0,Math.min(1,v))*L); el.setAttribute('transform','translate(' + q.x.toFixed(1) + ',' + q.y.toFixed(1) + ') scale(' + sc + ')'); }
    put(0);
    tl.fromTo(o,{v:0},{v:1,duration:d,ease:ease||'power1.inOut',immediateRender:false,onUpdate:function(){ put(o.v); }},t);
    tl.set(o,{v:0,onComplete:function(){}} ,Math.max(0,t-0.002));
  }
  // pulsing marker rings (finite repeats)
  function pulse(tl, id, t0, t1, period){
    var el=$(id); if(!el) return; period = period||1; var n=Math.max(1,Math.floor((t1-t0)/period));
    tl.fromTo(el,{attr:{r:10,opacity:1}},{attr:{r:46,opacity:0},duration:period,ease:'power1.out',repeat:n-1,immediateRender:false},t0);
  }
  // hard-edged region wipe: clip rect width grows (direction: 'lr' or 'rl' or 'tb')
  function regionWipe(tl, rectId, t, d, dir){
    var el=$(rectId); if(!el) return;
    if (dir==='rl'){ tl.set(el,{attr:{x:1920,width:0}},Math.max(0,t-0.001)); tl.fromTo(el,{attr:{x:1920,width:0}},{attr:{x:0,width:1920},duration:d,ease:'power2.inOut',immediateRender:false},t); }
    else { tl.set(el,{attr:{width:0}},Math.max(0,t-0.001)); tl.fromTo(el,{attr:{width:0}},{attr:{width:1920},duration:d,ease:'power2.inOut',immediateRender:false},t); }
  }
  return {$:$, rng:rng, track:track, attr:attr, css:css, show:show, blink:blink, talk:talk, breathe:breathe, walk:walk, crowd:crowd, cam:cam, camTo:camTo, wipe:wipe, stampIn:stampIn, popIn:popIn, out:out, draw:draw, follow:follow, pulse:pulse, regionWipe:regionWipe};
})();
`;
