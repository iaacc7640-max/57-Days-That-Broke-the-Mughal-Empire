# ClearCut History studio kit

Shared, committed kit reused by every episode (sessions start fresh, so everything lives here).

```
assets/
  kit/        code that draws the kit: rig.mjs (characters + crowd symbols), sets.mjs (layered parallax sets),
              props.mjs (throne, Kohinoor, cart, crown, coins, chest, lamp, banner, scroll, ensign),
              map.mjs (anchor map: Natural Earth land via world-atlas + topojson-client + d3-geo; hand-drawn
              simplified historical polygons), ui.mjs (chip, name card, stamp, tags, cards, quote; fonts),
              anim.mjs (deterministic GSAP runtime: blink/talk/breathe/walk/crowd/camera/wipes/map draws),
              export-previews.mjs, make-anchor-states.mjs
  characters/ preview SVG per character + characters.md (narrator voice recorded there)
  sets/       preview SVG per set (delhiGate, hall, plain, street, vault, frontier, tent, tradingPost, desk)
  ui/         grain.png (timeline-driven grain tile, used at 3.5 %)
  audio/      ccaudio.py — every score voice and sound effect, synthesised in code (no downloaded audio)
  fonts/      Bebas Neue, Inter, EB Garamond (woff2 from npm @fontsource)
  palette.json
  series/mughals/  series-colours.json, anchor-map.svg (India 1707, Mughal green), anchor-states.json,
                   thumbnail.mjs (series thumbnail template), scenes/ (peacock-throne, kohinoor, crown previews)
```

Episodes live in `episodes/epNN-<slug>/` with a `tools/` folder (narrate.py → timing.json, build.mjs →
HyperFrames project in `hf/`, mix.py → audio, captions.py, thumbs.mjs, render.sh). Renders, mp4 and wav files
are never committed (`.gitignore`).

Rules baked in: no blur/glow/haze anywhere, hard-edged offset shadows only, grain ≤ 4 % driven by the
timeline, vignette ≤ 12 %, MAP SIMPLIFIED on every map, text ≥ 36 px.
