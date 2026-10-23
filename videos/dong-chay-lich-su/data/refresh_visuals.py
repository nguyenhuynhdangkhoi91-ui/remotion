"""Chạy lại script.py nhưng giữ thời lượng giọng đọc (dur) của các đoạn không đổi lời."""
import json, os, subprocess, sys
d = os.path.dirname(os.path.abspath(__file__))
seg = os.path.join(d, sys.argv[1], "segments.json")
old = {s["id"]: s for s in json.load(open(seg))}
subprocess.run([sys.executable, os.path.join(d, sys.argv[1], "script.py")], check=True)
new = json.load(open(seg))
for s in new:
    o = old.get(s["id"])
    if not o or o["text"] != s["text"]:
        sys.exit(f"lời đọc {s['id']} đã đổi, cần tạo lại giọng đọc")
    s["dur"] = o["dur"]
json.dump(new, open(seg, "w"), ensure_ascii=False, indent=1)
print("ok", len(new))
