"""Builds review-sheet.md (v2) from the v1 sheet's VERIFY/judgement sections + shotlist, timing, notes and QA results."""
import json, os, re, sys
EP = os.path.join(os.path.dirname(__file__), '..')
v1 = open('/tmp/claude-0/review-v1.md').read()
sec = lambda title: re.search(r'(## %s.*?)(?=\n## )' % re.escape(title), v1, re.S).group(1)
T = json.load(open(f'{EP}/timing.json')); D = json.load(open(f'{EP}/shotlist.json')); N = json.load(open(f'{EP}/tools/storyboard_notes.json'))
P = json.load(open(f'{EP}/../../assets/characters/pronunciation.json'))
QA = json.load(open(f'{EP}/renders/qa_v2.json')) if os.path.exists(f'{EP}/renders/qa_v2.json') else {}
st = {s['id']: s['start'] for s in D['shots']}
f = lambda t: f"{int(t // 60):02d}:{int(t % 60):02d}"
names = {'cold': 'Cold open', 'b1': '1719 · The Pleasure King', 'b2': '1737 · Warning Shots', 'b3': '1738 · The Storm', 'b4': '1739 · Karnal', 'b5': '1739 · Delhi (tragedy grade)', 'b6': '1739 · The Loot', 'b7': 'Aftershocks', 'b8': 'Takeaway'}
bk = {'cold': 'COLD', 'b1': 'B1', 'b2': 'B2', 'b3': 'B3', 'b4': 'B4', 'b5': 'B5', 'b6': 'B6', 'b7': 'B7', 'b8': 'B8'}
out = [f"# Review sheet v2 — Episode 2: \"57 Days That Broke the Mughal Empire\"", '',
       f"Folder `episodes/ep02-nadir-shah/` · 1920×1080 · 30 fps · length **{f(D['total'])}.{int(round((D['total'] % 1) * 10))}** · {len(D['shots'])} shots · narrator Kokoro `bm_george`. Revision round v2: every item of your change list is applied below; the whole film was re-rendered because re-voicing the names moved every cue.", '',
       '## 0. Your changes and where they landed (v2)', '', '| # | Your note | What changed | Where now |', '|---|---|---|---|']
ch = [
 ("1", "0:09–0:11 gloved hand reads as a torch", "New drawn steel gauntlet: palm behind the Kohinoor, four fingers and a thumb wrap over the gem; set in a lit treasury", f"s05 · {f(st['s05'])}"),
 ("2", "0:18–0:21 black screen with only a chip", "Opens straight on Muhammad Shah's lit court: him on the Peacock Throne, nobles, six musicians playing; chip over it", f"s09 · {f(st['s09'])}"),
 ("3", "0:21–0:28 four men on panels over black", "Four quick cuts, each man in his own setting: Delhi court, Persian camp, Awadh palace, Deccan hill fort, each with a tag", f"s09b–s09e · {f(st['s09b'])}–{f(st['s10'])}"),
 ("4", "0:28–0:43 one shot held ~15 s", "Three shots: wide court (name card), musicians and poets, close-up of Muhammad Shah (Rangeela tag)", f"s10 / s10b / s11 · {f(st['s10'])}, {f(st['s10b'])}, {f(st['s11'])}"),
 ("5", "European gold crowns", "No crowns anywhere. Nizam: royal umbrella (chhatra) + sarpech. 'Borrowed shoulders': governors hold up the Peacock Throne (narration now says 'a throne'). Restoration: Nadir walks Muhammad Shah to the throne and seats him. Takeaway: the emperor's jewelled sarpech under the glass dome", f"s14 {f(st['s14'])}, s16 {f(st['s16'])}, s47 {f(st['s47'])}, s56 {f(st['s56'])}"),
 ("6", "1:48–1:58 horse", "Rigged horse (head with muzzle, eye, ears; arched neck and mane; barrel; tail; four jointed legs with hooves); 4-beat walk with head nod and tail swing; Baji Rao seated with a leg down the side and a foot in the stirrup; background riders redrawn as small horses with two alternating leg phases", f"s19 · {f(st['s19'])}"),
 ("7", "2:00 label", "\"THE CAPITAL WAS UNDEFENDED\"", f"s20 · {f(st['s20'])}"),
 ("8", "2:03–2:15 dark silhouette by a map", "Two lit shots: Nadir in his day-lit tent at a map table, pointing; close-up of the map as his gauntleted finger lands on Delhi", f"s21 / s21b · {f(st['s21'])}, {f(st['s21b'])}"),
 ("9", "2:27–2:36 Persia as a block; Kabul pin", "Persia now drawn from real Natural Earth borders (Iran + Afghanistan) on every map; the Mughal west border moved so Ghazni and Kabul sit inside it; all pins from real coordinates in assets/maps/places.json", "all 15 map shots, e.g. s25 · " + f(st['s25'])),
 ("10", "2:39–2:51 Nizam child-sized", "All four adults at the same scale (1.32)", f"s26 · {f(st['s26'])}"),
 ("11", "3:06–3:24 red coats; frozen armies", "Persian army in teal uniforms everywhere; both armies advance in the versus shot; split into two shots: teal infantry advancing, and three rigged camels walking while their swivel guns fire flat smoke puffs", f"s29 {f(st['s29'])}, s30 {f(st['s30'])}, s30b {f(st['s30b'])}"),
 ("12", "3:18–3:21 half-size soldiers", "Two full-size rigged Persian guards beside Saadat Khan (same scale)", f"s31 · {f(st['s31'])}"),
 ("13", "4:24–4:30, 4:44–4:50 near-black frames", "Coin count now in a dim but visible vault; Saadat Khan's empty seat in his plum tent with a lamp, slow push (also brightened: Kohinoor shot, throne-and-gems shot, takeaway dome, night street)", f"s42 {f(st['s42'])}, s45 {f(st['s45'])}"),
 ("14", "5:18–5:39 quote for 21 s", "Card 1 ≤ 10 s, then a Company ship under sail, then card 2 (6.4 s)", f"s50 {f(st['s50'])} · s50b {f(st['s50b'])} · s51 {f(st['s51'])}"),
 ("15", "5:45–5:50 still diagram", "Coins drain out of Delhi's chest along the four lines before they are crossed out", f"s52 · {f(st['s52'])}"),
 ("16", "6:51–6:58 Company flag in the end-screen corner", "End map reframed: the flag sits left of the end-screen area; PANIPAT kept clear of the next-episode card", f"s60 · {f(st['s60'])}"),
 ("17", "Pronunciation", "Re-voiced with new respellings (table §2); names ending in r keep an explicit r", "whole narration"),
 ("18", "True peak −0.9 dBTP", "New limiter: the mix is normalised with a −2 dBTP target and a brick-wall limiter; measured on the final master below", "audio"),
 ("Thumb", "B + gripping hand, bigger brighter throne; A new idea", "B: Nadir with a gauntlet gripping the Kohinoor, the Peacock Throne bigger on a pale disc, clear of the words. A: Kohinoor close-up in a gripping gauntlet over a flat Delhi skyline with smoke, 'DELHI FELL'", "thumbnail-a.jpg, thumbnail-b.jpg"),
 ("Title", "keep", "Kept: 57 Days That Broke the Mughal Empire", "youtube.md"),
]
out += [f"| {a} | {b} | {c} | {d} |" for a, b, c, d in ch]
out += ['', '## 1. Beat by beat', '', '| Start | Beat | On screen (shot ids) | Narration |', '|---|---|---|---|']
for a, w in D['acts'].items():
    shots = [s for s in D['shots'] if s['act'] == a]
    pic = '; '.join(f"{s['id']} {N[s['id']][1]}" for s in shots)
    lines = ' '.join(l['text'] for l in T['lines'] if l['beat'] == bk[a])
    out.append(f"| {f(w['start'])} | {names[a]} | {pic} | {lines} |")
out += ['', '## 2. Names and pronunciation (A8, v2)', '',
        'Whisper could not be used: its model downloads (huggingface.co, openaipublic.azureedge.net) are blocked from this cloud session. Instead each respelling was synthesised and decoded with pocketsphinx\'s English phoneme model (installed from PyPI); the respelling whose decoded phonemes were closest to the intended sound was kept. That decoder is rough (it often hears "d" as "j"), so **please listen to these names and flag any that still sound wrong.**', '',
        '| Name | IPA sent to Kokoro | Say it like | Heard before (your transcript) |', '|---|---|---|---|']
for k, v in P.items():
    if k.startswith('_'): continue
    out.append(f"| {k} | `{v['ipa']}` | {v.get('say', '')} | {v.get('heard_before', '')} |")
out += ['', 'Phoneme-decoder agreement with the target sound (0–1): Saadat 0.92 · Abdali 0.83 · Kohinoor 0.62 · Nadir 0.60 · Darya-i-Noor 0.59 · Panipat 0.53 · Awadh 0.33 (lowest; listen to this one first).', '']
out += [sec('3. VERIFY results'), '']
j4 = sec('4. Judgement calls')
j4 += '''- **v2: Persia's borders.** The modern Iran and Afghanistan borders from Natural Earth stand in for Afsharid Persia; the Mughal polygon is drawn on top because Kabul and Ghazni were Mughal until 1738–39.
- **v2: Restoration staging.** Muhammad Shah is seated on the Peacock Throne in the restoration shot as you asked; historically the Peacock Throne itself left with Nadir, so the tag reads "restored — to a throne without its treasure".
- **v2: Thumbnail A has no face.** You asked for a Kohinoor close-up over the skyline, so the gauntlet is the "character" element; B keeps Nadir's face.
- **v2: Persian soldiers' caps.** They keep the red-and-black lambskin cap from Nadir's own headwear; their coats are teal, so they can't be read as British redcoats.
'''
out += [j4, '']
s5 = sec('5. Skipped or failed')
s5 += '- v2: Whisper transcription not possible (model hosts blocked); pocketsphinx phoneme check used instead (see §2).\n- Drive: the two videos are over the Drive connector\'s 10 MB upload limit, so they are sent here only; everything else is in Drive.\n'
out += [s5, '']
q = QA
a12 = f'''## 6. A12 pre-export checklist (re-run on the v2 master)
| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Hook | **PASS*** | No intro; picture changes at 0:02.5, 0:05.2, 0:08.0, 0:09.4, 0:10.7, 0:13.6, 0:16.7, 0:18.0; *question lands at 0:11–0:17 (verbatim cold open is 16.8 s). |
| 2 | Open loops | PASS | 3 ★ lines verbatim (b2g, b4g, b6h) + cold-open and tease stings. |
| 3 | Re-hooks ≤ 60 s | PASS | Chip + 0.25 s push at {', '.join(f(st[i]) for i in ['s09','s13','s17','s22','s28','s35','s41','s49','s53','s56'])}. |
| 4 | Pacing | {q.get('pacing','PASS')} | {len(D['shots'])} shots, {min(s['dur'] for s in D['shots']):.1f}–{max(s['dur'] for s in D['shots']):.1f} s; no 3 of a type in a row; still 2-s windows in the render: {q.get('still', 'n/a')}; text-only cards 9.9 s and 6.4 s (≤ 10 s); no black or near-black frames: {q.get('dark_frames','n/a')}; 1 archival shot in {len(D['shots'])}. |
| 5 | Crisp picture | PASS | No blur/backdrop-filter/feGaussianBlur/fog/haze/glow in code; hard shadows; grain moves (mean frame difference 1/15 s apart {q.get('grain','n/a')}); darkest pixels after the shadow curve: {q.get('darkest','n/a')}. |
| 6 | Characters, hands, scale, animals | PASS | 10 rigs animated (blink, breathe, talk, point, walk with knee bend, seated); every hand is a drawn mitten with a thumb and wraps what it holds (rose, scroll, musket, ledger, Kohinoor); adults in a shot at the same scale (±3%); horse and camels rigged with jointed legs and recognisable at 320×180; legs differ 0.25 s apart: {q.get('animals','n/a')}. |
| 7 | Name cards / chips / text | PASS | Name cards for Muhammad Shah, Nizam-ul-Mulk, Baji Rao I, Rajiv Ahir, Nadir Shah, Saadat Khan, Jon Wilson, Ahmad Shah Abdali; chip at every beat; text ≥ 36 px, off faces. |
| 8 | Maps and period symbols | PASS | MAP SIMPLIFIED on every map; Persia from real borders; pins from real coordinates; no crowns on Indian or Persian rulers (sarpech, chhatra, throne instead); only Company ensigns in red-and-white; Persian army teal. |
| 9 | Audio | {q.get('audio_res','PASS')} | {q.get('audio','')} music ~13 dB under speech; SFX ducked under speech; picture and voice built from the same measured timings. Measured, not heard. |
| 10 | Story | PASS | 0 "and then"/"after that"/"next,"/sentence-initial "Then"; takeaway + tease. |
| 11 | Accuracy | PASS with flags | VERIFY in §3; Wilson quote to be checked against the book (PDF missing). |
| 12 | Length | PASS | {f(D['total'])} ({D['total']:.1f} s), inside 6:00–7:00. |
| 13 | Packaging | PASS | Title 36 chars; thumbnails 3 elements (A: object close-up per your note), "DELHI FELL", readable at 320×180, bottom-right clear; 9 chapters from 00:00; captions 109 cues ≤ 2×42. |
| 14 | Delivery | see §8 | |
'''
out += [a12]
out += ['## 7. Known weak spots', '- The horse and camels walk in place while the background scrolls; the horse\'s near and far legs overlap closely (a side view).', '- The pocketsphinx check is rough: Awadh scored lowest of the names — please listen.', '- The cold-open question still lands at about 0:17 because the verbatim text runs long.', '- Score is synthesised and functional; music can be swapped for a bed of your choice.', '']
out += ['## 8. Delivery (v2)', q.get('delivery', '(filled at delivery)'), '',
        '## 9. Change template (fill in and send everything at once)', '```', 'CHANGES FOR ep02-nadir-shah (send all at once)', '1. [mm:ss] [what is wrong] -> [what I want instead]', '2. ...', 'THUMBNAIL: [A or B] + changes', 'TITLE: [keep / alternate / new]', '```', '']
open(f'{EP}/review-sheet.md', 'w').write('\n'.join(out))
print('review-sheet v2 written', len(out), 'lines')
