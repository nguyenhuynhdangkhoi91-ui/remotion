"""Trộn giọng đọc với nhạc nền theo chương, tự hạ nhạc khi có lời, chuẩn hóa -14 LUFS.

Cách chạy: python3 data/mix_audio.py video01 <thư mục nhạc>
"""
import json, os, subprocess, sys
import numpy as np

SR = 48000
vid, music_dir = sys.argv[1], sys.argv[2]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
build = f"{root}/build/{vid}"
plan = json.load(open(f"{root}/data/{vid}/music.json"))
tl = json.load(open(f"{root}/src/{vid}/timeline.json"))
total = tl["durationInFrames"] / tl["fps"]
n = int(total * SR)


def decode(path, seconds=None, loop=False):
    cmd = ["ffmpeg", "-v", "error"] + (["-stream_loop", "-1"] if loop else []) + ["-i", path]
    if seconds:
        cmd += ["-t", f"{seconds:.3f}"]
    cmd += ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2)


def fade(x, fin, fout):
    a, b = int(fin * SR), int(fout * SR)
    x = x.copy()
    x[:a] *= np.linspace(0, 1, a)[:, None]
    x[-b:] *= np.linspace(1, 0, b)[:, None]
    return x


voice = decode(f"{build}/voice.wav")[:n]
voice = np.pad(voice, ((0, n - len(voice)), (0, 0)))

music = np.zeros((n, 2), np.float32)
for i, sec in enumerate(plan):
    start = sec["start"]
    end = plan[i + 1]["start"] if i + 1 < len(plan) else total
    length = end - start + (2.5 if i + 1 < len(plan) else 0)
    clip = decode(f"{music_dir}/{sec['track']}.mp3", length, loop=True)
    clip = fade(clip, 1.5, 3.0 if i + 1 < len(plan) else 5.0) * 10 ** (sec.get("gain", 0) / 20)
    s = int(start * SR)
    clip = clip[: n - s]
    music[s : s + len(clip)] += clip

# Đường bao hạ nhạc: theo năng lượng giọng đọc từng khung 10 ms.
hop = SR // 100
rms = np.sqrt(np.mean(voice[: len(voice) // hop * hop, 0].reshape(-1, hop) ** 2, axis=1))
active = rms > 0.01
# giữ trạng thái "đang nói" thêm 0,4 giây để nhạc không bơm lên giữa các câu
hold = np.convolve(active.astype(float), np.ones(40), mode="full")[: len(active)] > 0
target = np.where(hold, 10 ** (-21 / 20), 10 ** (-12 / 20))
env = np.empty_like(target)
g = target[0]
for k, t in enumerate(target):
    coef = 0.25 if t < g else 0.04  # hạ nhanh, nâng chậm
    g += (t - g) * coef
    env[k] = g
env = np.repeat(env, hop)
env = np.pad(env, (0, n - len(env)), mode="edge")[:n]

mix = voice + music * env[:, None]
raw = f"{build}/mix_raw.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", raw], input=mix.astype(np.float32).tobytes(), check=True)

# Chuẩn hóa độ lớn 2 lượt theo EBU R128.
probe = subprocess.run(["ffmpeg", "-hide_banner", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(probe[probe.rindex("{") :])
af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", af, "-ar", str(SR), f"{build}/mix.wav"], check=True)
print("mix.wav", round(total, 2), "giây, đo trước chuẩn hóa:", m["input_i"], "LUFS")
