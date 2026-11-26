# Sources — 57 Days That Broke the Mughal Empire

## Book (series spine)
- Rajiv Ahir, *A Brief History of Modern India* (Spectrum), Ch. 4, pp. 64–65, 68, 76. **The PDF (`ahir.pdf`) was not
  in this repository**, so the book facts and the Jon Wilson quote are used exactly as written in the episode brief.
  Used for: Muhammad Shah 1719–48 and the name "Rangeela"; states forming in his reign (Hyderabad 1724, Bengal,
  Awadh, Punjab); neglect of the north-west frontier; Baji Rao I reaching Delhi in 1737 "with just 500 horsemen";
  Nadir Shah's 1738–39 invasion, Lahore, Karnal, capture of Muhammad Shah, the sack of Delhi; the Peacock Throne and
  Kohinoor; "seventy crore rupees" by one estimate; lands west of the Indus incl. Kabul; Saadat Khan's suicide under
  Nadir's demands (p. 76); the Jon Wilson quote (p. 65).
- Jon Wilson, *India Conquered: Britain's Raj and the Chaos of Empire* (Simon & Schuster, 2016; US title *The
  Chaos of Empire*, PublicAffairs 2016) — quoted via Ahir p. 65. The "57 days" figure is Wilson's and is always
  attributed to him. Publication details: https://simonandschuster.co.uk/books/India-Conquered/Jon-Wilson/9781471101274 ·
  https://www.publishersweekly.com/9781610392938

## Cross-checks (fetched/searched this session)
- Wikipedia, "Nader Shah's invasion of India" (https://en.wikipedia.org/wiki/Nader_Shah%27s_invasion_of_India):
  Nadir marched on Kabul from 21 May 1738 (Kabul surrendered); crossed the Indus at Attock; Karnal; rumour on the night
  of 21 March 1739 that Nadir had been killed and attacks on his troops; massacre on 22 March 1739 — "approximately
  20,000 to 30,000" killed (estimate); a fine of 20 million rupees on Delhi; Koh-i-Noor and Darya-i-Noor taken;
  **left Delhi on 16 May 1739**, ceding back lands east of the Indus to Muhammad Shah; annexation west of the Indus.
- Wikipedia, "Battle of Karnal" (https://en.wikipedia.org/wiki/Battle_of_Karnal): Karnal ~110–120 km north of Delhi;
  Mughal war-camp of about 300,000 including non-combatants; Persian musketeers uniformed and drilled; zamburaks
  (light swivel guns on camels); Saadat Khan rode out, was ambushed and taken prisoner; the Nizam advised but was not
  trusted with command. Gives the battle date as **24 February 1739 (New Style)** = 13 February (Old Style).
- Wikipedia, "Nader Shah" (https://en.wikipedia.org/wiki/Nader_Shah): crowned Shah of Iran 8 March 1736; reigned to
  his assassination on 20 June 1747 (→ "eight years later, Nadir Shah was dead").
- Wikipedia, "Saadat Ali Khan I" (https://en.wikipedia.org/wiki/Saadat_Ali_Khan_I): first Nawab of Awadh 1722–1739,
  died 19 March 1739; accounts of his death differ (poison/suicide vs. other versions).
- Wikipedia, "Sayyid brothers" (https://en.wikipedia.org/wiki/Sayyid_brothers) and "Muhammad Shah"
  (https://en.wikipedia.org/wiki/Muhammad_Shah): the brothers made and unmade emperors 1713–1719; Muhammad Shah, with
  Nizam-ul-Mulk, broke their power in 1720 (Hussain Ali Khan killed Oct 1720; Hassan Ali defeated 1720–22).
- Wikipedia, "Battle of Delhi (1737)" (https://en.wikipedia.org/wiki/Battle_of_Delhi_(1737)) and "Bajirao I":
  Maratha raid to the outskirts of Delhi, 28 March 1737; other accounts give a Maratha field force in the tens of
  thousands (50,000–70,000 cited) — hence the on-screen "HISTORIANS DISAGREE" tag against the book's 500.
- Swarajya, "Nadir Shah: the raider who ravaged Delhi" (https://swarajyamag.com/culture/nadir-shah-the-raider-who-ravaged-delhi):
  durbar of 12 May 1739 at which Nadir re-crowned Muhammad Shah; departure 16 May 1739.

## Images (archival, via web-media-getter → Wikimedia Commons)
| Shot | Image | Maker / date | Licence | Source |
|---|---|---|---|---|
| s23 (02:22) | *Contemporary portrait of Nader Shah* (cropped) — "Nadir Shah of Persia… in an oval cartouche" | Artist unknown, Iran, c. 1740 · British Library, Foster 44 | **Public domain** (PD-old / PDM 1.0) | https://commons.wikimedia.org/wiki/File:Contemporary_portrait_of_Nader_Shah._Artist_unknown,_created_in_ca._1740_in_Iran_(cropped).jpg |

Second candidate *Nadir Shah on the Peacock Throne after his defeat of Muhammad Shah* (c. 1850, San Diego Museum of
Art, public domain) could not be downloaded: Wikimedia returned HTTP 429 (rate limit) for 15+ minutes; skipped and
replaced by a drawn scene (s43). Every other picture in the film is original flat-vector art drawn in code.
Coastlines and the borders used for Persia (modern Iran + Afghanistan): Natural Earth (public domain) via npm
`world-atlas` (land-50m, countries-50m). Mughal and regional borders are hand-drawn simplified polygons. Every pin is
placed from real coordinates in `assets/maps/places.json`.

## Audio
All narration is local Kokoro-82M (`bm_george`). v2 name respellings are in `assets/characters/pronunciation.json`;
they were checked with pocketsphinx phoneme decoding (PyPI) because Whisper models could not be downloaded
(huggingface.co and openaipublic.azureedge.net are blocked from this cloud session). All music and sound effects are synthesised in code
(`assets/audio/ccaudio.py`, `tools/mix.py`); no downloaded audio.
