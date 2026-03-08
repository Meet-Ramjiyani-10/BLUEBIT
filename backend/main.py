from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import io
from model import run_image_detection

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

@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    """
    Accepts an image file and returns deepfake detection result
    with confidence score and Grad-CAM heatmap.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    result = run_image_detection(contents)
    
    return JSONResponse({
    "status": "success",
    "filename": file.filename,
    "prediction": result["prediction"],
    "confidence": result["confidence"],
    "heatmap": None
    })

# @app.post("/detect/audio")
# async def detect_audio(file: UploadFile = File(...)):
#     """
#     Accepts an audio file and returns deepfake detection result.
#     """
#     if not file.content_type.startswith("audio/"):
#         raise HTTPException(status_code=400, detail="File must be an audio file")
    
#     contents = await file.read()
#     # TODO: Pass to model.py for audio inference
#     # result = run_audio_detection(contents)
    
#     return JSONResponse({
#         "status": "success",
#         "filename": file.filename,
#         "prediction": "pending",  # will be "REAL" or "FAKE"
#         "confidence": 0.0,
#     })

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)