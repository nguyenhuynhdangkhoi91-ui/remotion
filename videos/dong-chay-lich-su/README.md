# Dòng Chảy Lịch Sử: dựng video bằng Remotion

Video 1: ba lần kháng chiến chống Nguyên Mông (1258, 1285, 1287–1288), 16:9, khoảng 18 phút.

## Quy trình
1. Kịch bản: `data/video01/script.py` (lời đọc + hình cho từng đoạn). Chạy để xuất `segments.json`.
2. Giọng đọc: `SSL_CERT_FILE=... python3 data/tts_all.py data/video01/segments.json public/video01/voice` (edge-tts, vi-VN-NamMinhNeural), cắt khoảng lặng vào `build/video01/voice/`.
3. Dòng thời gian: `python3 data/build_timeline.py video01` → `src/video01/timeline.json`, `build/video01/voice.wav`, phụ đề `.srt`.
   Đổi hình mà không đổi lời: `python3 data/refresh_visuals.py video01` rồi chạy lại bước 3.
4. Nhạc: `python3 data/mix_audio.py video01 <thư mục nhạc>` theo `data/video01/music.json` (Kevin MacLeod, CC BY 4.0).
5. Render: `bash data/render.sh video01 Video01 6` → `build/video01/video01.mp4`.
6. Tranh thumbnail: `npx remotion still src/index.ts Thumb01Art out.png`.

Ảnh tư liệu đặt ở `public/video01/img/<khóa>.jpg`, nguồn và giấy phép trong `src/video01/credits.ts`.
Font tự host trong `public/fonts` (OFL) để render không cần mạng.
