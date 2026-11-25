"""captions.srt from lines.json (correct spellings) + timing.json (measured). One cue per line; long lines split at
natural pauses into cues of at most 2 lines x 42 characters, timed in proportion to their length."""
import json, re, textwrap
T = json.load(open('timing.json'))
def fmt(t):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}"
def fits(s):
    w = textwrap.wrap(s, 42)
    return len(w) <= 2
def split(text):
    if fits(text): return [text]
    # split at sentence ends, then at commas/dashes/colons, then at the word nearest the middle
    for pat in [r'(?<=[.?!…”])\s+', r'(?<=[,;:—])\s+']:
        parts = re.split(pat, text)
        if len(parts) > 1:
            out, cur = [], ''
            for p in parts:
                cand = (cur + ' ' + p).strip()
                if fits(cand): cur = cand
                else:
                    if cur: out.append(cur)
                    cur = p
            if cur: out.append(cur)
            if all(fits(o) for o in out): return out
            return [x for o in out for x in split(o)]
    words = text.split(); mid = len(words) // 2
    return split(' '.join(words[:mid])) + split(' '.join(words[mid:]))
cues = []
for l in T['lines']:
    parts = split(l['text'])
    tot = sum(len(p) for p in parts); t = l['start']
    for p in parts:
        d = l['duration'] * len(p) / tot
        cues.append((t, t + d, '\n'.join(textwrap.wrap(p, 42))))
        t += d
with open('captions.srt', 'w') as f:
    for i, (a, b, s) in enumerate(cues, 1):
        f.write(f"{i}\n{fmt(a)} --> {fmt(max(a + 0.5, b - 0.02))}\n{s}\n\n")
print(len(cues), 'cues; max line', max(len(x) for c in cues for x in c[2].split('\n')))
