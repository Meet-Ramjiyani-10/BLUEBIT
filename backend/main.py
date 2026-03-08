from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from model import run_image_detection, load_model, run_text_detection, run_audio_detection
import uvicorn
from gradcam import generate_heatmap
from model import get_model, get_extractor

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
    model = get_model()
    extractor = get_extractor()
    heatmap = generate_heatmap(contents, model, extractor)	
    return JSONResponse({
        "status": "success",
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
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
        "confidence": result["confidence"]
    })