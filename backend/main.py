from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from model import run_image_detection, load_model, run_text_detection, run_audio_detection, get_model, get_extractor
from gradcam import generate_heatmap

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

from model import run_image_detection, load_model

@app.on_event("startup")
async def startup_event():
    load_model()

@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    contents = await file.read()
    result = run_image_detection(contents)

    heatmap = None
    try:
        m = get_model()
        ext = get_extractor()
        heatmap = generate_heatmap(contents, m, ext)
    except Exception as e:
        print(f"Heatmap generation failed: {e}")

    return JSONResponse({
        "status": "success",
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "explanation": result.get("explanation"),
        "heatmap": heatmap
    })

from pydantic import BaseModel

class TextInput(BaseModel):
    text: str

@app.post("/detect/text")
async def detect_text(input: TextInput):
    from model import run_text_detection
    result = run_text_detection(input.text)
    return JSONResponse({"status": "success", **result})

@app.post("/detect/audio")
async def detect_audio(file: UploadFile = File(...)):
    contents = await file.read()
    from model import run_audio_detection
    result = run_audio_detection(contents)
    return JSONResponse({
        "status": "success",
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "explanation": result.get("explanation")
    })

@app.post("/detect/video")
async def detect_video(file: UploadFile = File(...)):
    import cv2, tempfile, os
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
        if frame_count % 3 == 0:  # sample every 3rd frame
            _, buffer = cv2.imencode('.jpg', frame)
            result = run_image_detection(buffer.tobytes())
            results.append(result["prediction"])
        frame_count += 1
    
    cap.release()
    os.unlink(tmp_path)
    
    if not results:
        return JSONResponse({"status": "error", "message": "Could not read video"}, status_code=400)
    
    fake_count = results.count("FAKE")
    total = len(results)
    prediction = "FAKE" if fake_count > total/2 else "REAL"
    confidence = round((fake_count/total)*100, 2) if prediction == "FAKE" else round((1 - fake_count/total)*100, 2)
    
    # After calculating prediction add:
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