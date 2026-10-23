"""Từ segments.json (đã có thời lượng giọng đọc) tạo:
- timeline.json cho Remotion (khung hình bắt đầu/kéo dài của từng cảnh, phụ đề)
- voice.wav: toàn bộ lời đọc ghép đúng mốc thời gian
- phụ đề .srt để tải lên YouTube

Cách chạy: python3 data/build_timeline.py video01
"""
import json, os, re, subprocess, sys

FPS = 30
LEAD_IN = 1.2      # giây mở đầu trước câu đầu tiên
TAIL = 6.0         # giây sau câu cuối (màn hình kết)
MIN_PAUSE = 0.5
TITLE_EXTRA = 0.6  # cảnh tiêu đề chương giữ lâu hơn một chút

vid = sys.argv[1]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
segs = json.load(open(f"{root}/data/{vid}/segments.json"))
build = f"{root}/build/{vid}"
os.makedirs(build, exist_ok=True)


def chunks(text, max_len=78):
    parts = re.split(r"(?<=[.?!:])\s+", text)
    out = []
    for p in parts:
        while len(p) > max_len:
            cut = max((m.end() for m in re.finditer(r",\s", p[:max_len + 1])), default=0)
            if cut < 25:
                cut = p.rfind(" ", 0, max_len)
            out.append(p[:cut].strip().rstrip(","))
            p = p[cut:].strip()
        if p:
            out.append(p)
    return out


t = LEAD_IN
scenes, subs = [], []
for s in segs:
    pause = max(s["pause"], MIN_PAUSE) + (TITLE_EXTRA if s["visual"]["type"] == "title" else 0)
    start, dur = t, s["dur"]
    cs = chunks(s["text"])
    total_chars = sum(len(c) for c in cs)
    ct = start
    for c in cs:
        cd = dur * len(c) / total_chars
        subs.append({"from": round(ct * FPS), "to": round((ct + cd) * FPS), "text": c})
        ct += cd
    scenes.append({"id": s["id"], "from": round(start * FPS), "voiceDur": round(dur * FPS),
                   "visual": s["visual"], "text": s["text"]})
    t = start + dur + pause

# mỗi cảnh kéo dài tới khi cảnh sau bắt đầu
for i, sc in enumerate(scenes):
    nxt = scenes[i + 1]["from"] if i + 1 < len(scenes) else round((t + TAIL) * FPS)
    sc["duration"] = nxt - sc["from"]
scenes[0]["duration"] += scenes[0]["from"]
scenes[0]["from"] = 0
total = round((t + TAIL) * FPS)
json.dump({"fps": FPS, "durationInFrames": total, "scenes": scenes, "subs": subs},
          open(f"{root}/src/{vid}/timeline.json", "w"), ensure_ascii=False)

# ghép giọng đọc theo mốc thời gian
inputs, filters = [], []
for i, (s, sc) in enumerate(zip(segs, scenes)):
    inputs += ["-i", f"{build}/voice/{s['id']}.wav"]
    start_ms = round(LEAD_IN * 1000) if i == 0 else round(sc["from"] / FPS * 1000)
    filters.append(f"[{i}:a]adelay={start_ms}:all=1[a{i}]")
mix = "".join(f"[a{i}]" for i in range(len(segs)))
fc = ";".join(filters) + f";{mix}amix=inputs={len(segs)}:normalize=0,apad,atrim=0:{total / FPS:.3f}[out]"
open(f"{build}/voice_filter.txt", "w").write(fc)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex_script", f"{build}/voice_filter.txt",
                "-map", "[out]", "-ar", "48000", "-ac", "1", f"{build}/voice.wav"], check=True)


def ts(f):
    ms = round(f / FPS * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


with open(f"{build}/{vid}.vi.srt", "w") as f:
    for i, sb in enumerate(subs, 1):
        f.write(f"{i}\n{ts(sb['from'])} --> {ts(sb['to'])}\n{sb['text']}\n\n")

print(f"{len(scenes)} cảnh, {len(subs)} dòng phụ đề, tổng {total / FPS / 60:.2f} phút")
