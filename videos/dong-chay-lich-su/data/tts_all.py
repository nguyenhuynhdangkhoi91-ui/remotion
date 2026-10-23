"""Tạo giọng đọc cho từng đoạn kịch bản bằng Microsoft Edge TTS (giọng vi-VN-NamMinhNeural)."""
import asyncio, json, os, sys, ssl, subprocess
import certifi
_orig_where = certifi.where
certifi.where = lambda: os.environ.get("SSL_CERT_FILE") or _orig_where()
import edge_tts, edge_tts.communicate as c
if os.environ.get("SSL_CERT_FILE"):
    c._SSL_CTX = ssl.create_default_context(cafile=os.environ["SSL_CERT_FILE"])

VOICE = "vi-VN-NamMinhNeural"
RATE = os.environ.get("TTS_RATE", "+4%")

async def one(seg, outdir, sem):
    out = os.path.join(outdir, seg["id"] + ".mp3")
    if os.path.exists(out) and os.path.getsize(out) > 1000 and not os.environ.get("FORCE"):
        return
    async with sem:
        for i in range(6):
            try:
                com = edge_tts.Communicate(seg["text"], VOICE, rate=RATE, pitch="-2Hz")
                await com.save(out)
                if os.path.getsize(out) > 1000:
                    print("ok", seg["id"], flush=True); return
            except Exception as e:
                print("retry", seg["id"], e, file=sys.stderr, flush=True)
            await asyncio.sleep(2 * (i + 1))
        raise RuntimeError("TTS failed " + seg["id"])

async def main(segfile, outdir):
    segs = json.load(open(segfile))
    sem = asyncio.Semaphore(4)
    await asyncio.gather(*(one(s, outdir, sem) for s in segs))

if __name__ == "__main__":
    asyncio.run(main(sys.argv[1], sys.argv[2]))
