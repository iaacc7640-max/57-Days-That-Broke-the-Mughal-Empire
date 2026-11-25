"""Kokoro (bm_george) narration: per-line wavs, timing.json, narration.wav.
Phonetic overrides go only into the TTS input (A8)."""
import json, re, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
k = Kokoro('/root/.cache/hyperframes/tts/models/kokoro-v1.0.onnx', '/root/.cache/hyperframes/tts/voices/voices-v1.0.bin')
VOICE, SPEED, LANG = 'bm_george', 0.97, 'en-gb'
# name -> IPA used for Kokoro (espeak gets everything else)
IPA = {
 "Nizam-ul-Mulk": "nɪzˈɑːm ʊl mˈʊlk", "Darya-i-Noor": "dˈɑːɹjɑː iː nˈʊə", "Kohinoor": "kˈəʊɪnʊə",
 "Rangeela": "ɹʌŋɡˈiːlɑː", "Indus": "ˈɪndəs", "Awadh": "ɐwˈʌd", "Abdali": "ɐbdˈɑːliː",
 "Mughal": "mˈuːɡʌl", "Nadir": "nˈɑːdiə", "Nader": "nˈɑːdiə", "Nadir's": "nˈɑːdiəz", "Panipat": "pˈɑːniːpʌt",
 "Baji": "bˈɑːdʒiː", "Saadat": "sɐˈɑːdʌt", "Ahir's": "ɑːhˈiəz", "Ahir": "ɑːhˈiə", "Karnal": "kˈɑːnʌl",
 "Peshwa": "pˈeɪʃwɑː", "Jahan": "dʒɐhˈɑːn", "Ahmad": "ˈɑːmʌd", "Rajiv": "ɹˈɑːdʒiːv", "Kabul": "kˈɑːbʊl", "Maratha": "mɐɹˈɑːtə", "Marathas": "mɐɹˈɑːtəz", "Punjab": "pʌndʒˈɑːb",
}
NUM = {"1739": "seventeen thirty-nine", "1719": "seventeen nineteen", "1724": "seventeen twenty-four",
       "1730s": "seventeen-thirties", "1737": "seventeen thirty-seven", "1736": "seventeen thirty-six",
       "1738": "seventeen thirty-eight"}
def to_phonemes(text):
    t = text.replace('“', '').replace('”', '').replace('—', ',').replace('…', '.').replace(' ,', ',')
    for n, w in NUM.items(): t = re.sub(r'\b' + n + r'\b', w, t)
    pat = re.compile(r"\b(" + "|".join(sorted(map(re.escape, IPA), key=len, reverse=True)) + r")(?![\w-])")
    out, pos = [], 0
    for m in pat.finditer(t):
        seg = t[pos:m.start()]
        if seg.strip(): out.append(k.tokenizer.phonemize(seg, LANG).strip())
        out.append(IPA[m.group(1)])
        pos = m.end()
    seg = t[pos:]
    if seg.strip(): out.append(k.tokenizer.phonemize(seg, LANG).strip())
    # re-attach punctuation spacing
    s = " ".join(out)
    s = re.sub(r"\s+([.,!?;:])", r"\1", s)
    return s, t
lines = json.load(open(f'{ROOT}/lines.json'))
SR = 24000
GAP_LINE, GAP_BEAT, GAP_STAR = 0.40, 0.85, 1.35
audio, timing, t = [np.zeros(int(0.12 * SR), dtype=np.float32)], [], 0.12
for i, L in enumerate(lines):
    ph, tts = to_phonemes(L['text'])
    s, sr = k.create(ph, voice=VOICE, speed=(1.0 if L['beat']=='COLD' else SPEED), lang=LANG, is_phonemes=True)
    s = s.astype(np.float32)
    # trim leading/trailing silence
    nz = np.where(np.abs(s) > 0.01)[0]
    s = s[max(0, nz[0] - 240): nz[-1] + 480]
    sf.write(f'{ROOT}/audio/voice/{L["id"]}.wav', s, SR)
    d = len(s) / SR
    timing.append({"id": L['id'], "beat": L['beat'], "start": round(t, 3), "duration": round(d, 3), "text": L['text'], "tts": tts, "phonemes": ph})
    audio.append(s); t += d
    nxt = lines[i + 1] if i + 1 < len(lines) else None
    g = GAP_STAR if L.get('star') else (GAP_BEAT if (nxt and nxt['beat'] != L['beat']) else GAP_LINE)
    if L['beat'] == 'COLD' and L['id'] != 'c4': g = 0.22
    if L['id'] == 'c4': g = 0.9
    if nxt is None: g = 3.2
    audio.append(np.zeros(int(g * SR), dtype=np.float32)); t += g
    print(L['id'], round(timing[-1]['start'], 2), round(d, 2), flush=True)
full = np.concatenate(audio)
sf.write(f'{ROOT}/audio/narration.wav', full, SR)
beats = {}
for x in timing: beats.setdefault(x['beat'], x['start'])
json.dump({"voice": VOICE, "speed": SPEED, "sample_rate": SR, "total": round(len(full) / SR, 3), "beats": beats, "lines": timing}, open(f'{ROOT}/timing.json', 'w'), indent=1, ensure_ascii=False)
print('TOTAL', len(full) / SR)
