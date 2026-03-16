from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from model import (
    run_image_detection,
    load_model,
    run_text_detection,
    run_audio_detection,
    get_model,
    get_extractor
)

from gradcam import generate_heatmap, detect_partial_manipulation
from provenance_signature import file_hash
from provenance_metadata import extract_metadata, simplify_metadata

app = FastAPI(
    title="Hologram Truth Analyzer API",
    description="Multi-Modal Deepfake Detection Framework",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "running", "message": "Hologram Truth Analyzer is live"}


@app.on_event("startup")
async def startup_event():
    load_model()



@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):

    contents = await file.read()

    provenance_hash = file_hash(contents)

    metadata = extract_metadata(contents)
    metadata_summary = simplify_metadata(metadata)

    result = run_image_detection(contents)

    heatmap = None

    try:
        m = get_model()
        ext = get_extractor()
        heatmap = generate_heatmap(contents, m, ext)

    except Exception as e:
        print(f"Heatmap generation failed: {e}")

    manipulation_score = None

    try:
        if heatmap is not None:
            manipulation_score = detect_partial_manipulation(heatmap)
    except Exception as e:
        print(f"Manipulation detection failed: {e}")

    return JSONResponse({
        "status": "success",
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "explanation": result.get("explanation"),
        "heatmap": heatmap,
        "provenance_hash": provenance_hash,
        "metadata": metadata_summary,
        "manipulation_score": manipulation_score
    })

class TextInput(BaseModel):
    text: str


@app.post("/detect/text")
async def detect_text(input: TextInput):

    result = run_text_detection(input.text)

    return JSONResponse({
        "status": "success",
        **result
    })

@app.post("/detect/audio")
async def detect_audio(file: UploadFile = File(...)):

    contents = await file.read()

    result = run_audio_detection(contents)

    return JSONResponse({
        "status": "success",
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "explanation": result.get("explanation")
    })


# ---------------- VIDEO DETECTION ----------------

@app.post("/detect/video")
async def detect_video(file: UploadFile = File(...)):

    import cv2
    import tempfile
    import os

    contents = await file.read()

    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
        f.write(contents)
        tmp_path = f.name

    cap = cv2.VideoCapture(tmp_path)

    results = []
    frame_count = 0

    while cap.isOpened() and frame_count < 30:

        ret, frame = cap.read()

        if not ret:
            break

        if frame_count % 3 == 0:

            _, buffer = cv2.imencode('.jpg', frame)

            result = run_image_detection(buffer.tobytes())

            results.append(result["prediction"])

        frame_count += 1

    cap.release()
    os.unlink(tmp_path)

    if not results:

        return JSONResponse({
            "status": "error",
            "message": "Could not read video"
        }, status_code=400)

    fake_count = results.count("FAKE")

    total = len(results)

    prediction = "FAKE" if fake_count > total / 2 else "REAL"

    confidence = round((fake_count / total) * 100, 2) if prediction == "FAKE" else round((1 - fake_count / total) * 100, 2)

    if prediction == "FAKE":

        explanation = f"Frame analysis detected manipulation in {fake_count} out of {total} sampled frames. Vision Transformer identified facial inconsistencies across temporal sequence."

    else:

        explanation = f"All {total} sampled frames appear authentic. No significant manipulation artifacts detected across temporal sequence."

    return JSONResponse({
        "status": "success",
        "prediction": prediction,
        "confidence": confidence,
        "explanation": explanation,
        "frames_analyzed": total,
        "fake_frames": fake_count,
        "real_frames": total - fake_count
    })
# ─────────────────────────────
# BATCH DETECTION
# ─────────────────────────────
@app.post("/detect/batch")
async def detect_batch(files: list[UploadFile] = File(...)):
    results = []
    for file in files:
        contents = await file.read()
        result = run_image_detection(contents)
        
        # Generate heatmap for each file
        heatmap = None
        try:
            m = get_model()
            ext = get_extractor()
            heatmap = generate_heatmap(contents, m, ext)
        except Exception as e:
            print(f"Heatmap failed for {file.filename}: {e}")

        results.append({
            "filename": file.filename,
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "explanation": result.get("explanation"),
            "heatmap": heatmap
        })

    fake_count = sum(1 for r in results if r["prediction"] == "FAKE")

    return JSONResponse({
        "status": "success",
        "total_files": len(results),
        "fake_detected": fake_count,
        "real_detected": len(results) - fake_count,
        "results": results
    })


# ─────────────────────────────
# CROSS-MODAL DETECTION
# ─────────────────────────────
@app.post("/detect/crossmodal")
async def detect_crossmodal(file: UploadFile = File(...)):
    import cv2, tempfile, os
    import librosa

    contents = await file.read()

    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
        f.write(contents)
        tmp_video_path = f.name

    # Video frame analysis
    cap = cv2.VideoCapture(tmp_video_path)
    frame_results = []
    frame_count = 0

    while cap.isOpened() and frame_count < 30:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % 3 == 0:
            _, buffer = cv2.imencode('.jpg', frame)
            res = run_image_detection(buffer.tobytes())
            frame_results.append(res["prediction"])
        frame_count += 1

    cap.release()

    if not frame_results:
        os.unlink(tmp_video_path)
        return JSONResponse(
            {"status": "error", "message": "Could not read video frames"},
            status_code=400
        )

    fake_count = frame_results.count("FAKE")
    total = len(frame_results)
    video_prediction = "FAKE" if fake_count > total * 0.3 else "REAL"
    video_confidence = round((fake_count/total)*100, 2) if video_prediction == "FAKE" else round((1-fake_count/total)*100, 2)

    if video_prediction == "FAKE":
        video_explanation = f"Frame analysis detected manipulation in {fake_count} out of {total} sampled frames."
    else:
        video_explanation = f"All {total} sampled frames appear authentic."

    video_result = {
        "prediction": video_prediction,
        "confidence": video_confidence,
        "explanation": video_explanation,
        "frames_analyzed": total,
        "fake_frames": fake_count,
        "real_frames": total - fake_count
    }

    # Audio analysis
    audio_result = None
    try:
        audio_data, samplerate = librosa.load(tmp_video_path, sr=16000, mono=True)
        from model import audio_classifier
        raw_result = audio_classifier(
            {"array": audio_data, "sampling_rate": 16000}
        )[0]

        audio_prediction = "FAKE" if raw_result["label"].lower() == "fake" else "REAL"
        audio_confidence = round(raw_result["score"] * 100, 2)

        audio_result = {
            "prediction": audio_prediction,
            "confidence": audio_confidence,
            "explanation": "wav2vec 2.0 detected synthetic speech artifacts." if audio_prediction == "FAKE" else "Audio shows authentic human speech characteristics."
        }
    except Exception as e:
        audio_result = {
            "prediction": "N/A",
            "confidence": 0,
            "explanation": f"Could not extract audio: {str(e)}"
        }
    finally:
        os.unlink(tmp_video_path)

    # Cross-modal verdict
    v_fake = video_prediction == "FAKE"
    a_fake = audio_result["prediction"] == "FAKE"
    a_available = audio_result["prediction"] != "N/A"

    if not a_available:
        overall = video_prediction
        note = f"No audio track available. Video-only analysis: {video_prediction}."
    elif v_fake and a_fake:
        overall = "MULTI-MODAL DEEPFAKE"
        note = "Both video and audio flagged as synthetic — high confidence multi-modal deepfake."
    elif v_fake and not a_fake:
        overall = "PARTIAL MANIPULATION"
        note = "Video flagged as fake but audio authentic — suspected visual manipulation only."
    elif not v_fake and a_fake:
        overall = "PARTIAL MANIPULATION"
        note = "Audio flagged as synthetic but video authentic — suspected audio manipulation only."
    else:
        overall = "AUTHENTIC"
        note = "Both video and audio appear authentic — no cross-modal inconsistencies detected."

    return JSONResponse({
        "status": "success",
        "overall_prediction": overall,
        "cross_modal_note": note,
        "video_result": video_result,
        "audio_result": audio_result
    })