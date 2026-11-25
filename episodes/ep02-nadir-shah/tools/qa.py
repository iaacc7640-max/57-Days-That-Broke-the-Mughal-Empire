"""Frame QA on a rendered file: a frame every 2 s (contact sheets), motion in every 2-s window, grain moves
(two frames 1/15 s apart differ), darkest pixels per normal frame. Usage: qa.py video.mp4 outdir"""
import sys, os, subprocess, json
import numpy as np
from PIL import Image
v, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", v]).decode())
# frames at 1 fps (small) for motion; every 2 s for sheets
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", v, "-vf", "fps=1,scale=480:270", f"{out}/m_%04d.png"], check=True)
fr = sorted(f for f in os.listdir(out) if f.startswith("m_"))
arr = [np.asarray(Image.open(f"{out}/{f}").convert("L"), dtype=np.int16) for f in fr]
still = []
for i in range(1, len(arr)):
    d = np.mean(np.abs(arr[i] - arr[i - 1]))
    if d < 0.35: still.append((i, round(float(d), 3)))
# 2-s windows: a window is "still" only if both 1-s diffs inside it are tiny
stillw = [i for i, _ in still if (i - 1, ) and any(j == i - 1 for j, _ in still)]
# darkest pixel per sampled frame (full res every 10 s)
dark = []
for t in np.arange(1, dur, 10):
    raw = subprocess.check_output(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", f"{t}", "-i", v, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-"])
    a = np.frombuffer(raw, np.uint8)
    dark.append((round(float(t), 1), int(np.percentile(a, 0.05))))
# grain: two frames 1/15 s apart
def grab(t):
    raw = subprocess.check_output(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", f"{t}", "-i", v, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-"])
    return np.frombuffer(raw, np.uint8).astype(np.int16)
g = float(np.mean(np.abs(grab(min(dur - 1, 46.0)) - grab(min(dur - 1, 46.0) + 1 / 15))))
# contact sheets every 2 s
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", v, "-vf", "fps=0.5,scale=384:216,tile=5x4", f"{out}/sheet_%02d.png"], check=True)
res = {"duration": dur, "still_1s_pairs": still, "still_2s_windows": stillw, "darkest_0.05pct": dark, "grain_diff_1_15s": round(g, 3)}
json.dump(res, open(f"{out}/qa.json", "w"), indent=1)
print(json.dumps({k: (v if k != "darkest_0.05pct" else [d for d in v if d[1] >= 35]) for k, v in res.items()}))
