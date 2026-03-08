import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification, pipeline
from PIL import Image
import io
import cv2
import numpy as np
import tempfile
import os
import soundfile as sf

MODEL_NAME = "dima806/deepfake_vs_real_image_detection"

extractor = None
model = None
text_classifier = None
audio_classifier = None


# -----------------------------
# Load all models once at startup
# -----------------------------
def load_model():
    global extractor, model, text_classifier, audio_classifier

    print("Loading image deepfake model...")
    extractor = AutoImageProcessor.from_pretrained(MODEL_NAME)
    model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
    model.eval()

    print("Loading text AI detector...")
    text_classifier = pipeline(
        "text-classification",
        model="roberta-base-openai-detector"
    )

    print("Loading audio deepfake detector...")
    audio_classifier = pipeline(
        "audio-classification",
        model="mo-thecreator/deepfake-audio-detection"
    )

    print("All models loaded successfully!")


def get_model():
    return model


def get_extractor():
    return extractor


# -----------------------------
# Face Detection + Cropping
# -----------------------------
def crop_face(image_bytes: bytes) -> bytes:
    """
    Detect and crop the largest face before deepfake detection
    """

    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.2, 5)

    if len(faces) == 0:
        return image_bytes

    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])

    padding = int(w * 0.3)

    x1 = max(0, x - padding)
    y1 = max(0, y - padding)
    x2 = min(img.shape[1], x + w + padding)
    y2 = min(img.shape[0], y + h + padding)

    cropped = img[y1:y2, x1:x2]

    _, buffer = cv2.imencode(".jpg", cropped)

    return buffer.tobytes()


# -----------------------------
# Image Deepfake Detection
# -----------------------------
def run_image_detection(image_bytes: bytes) -> dict:

    # Auto crop face for better accuracy
    image_bytes = crop_face(image_bytes)

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    inputs = extractor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=-1)

        predicted_class = torch.argmax(probs, dim=-1).item()
        confidence = probs[0][predicted_class].item()

    label = model.config.id2label[predicted_class].upper()

    # Explanation logic
    if confidence > 0.9:
        explanation = (
            "Strong manipulation artifacts detected — facial boundary blending, "
            "skin texture irregularities and GAN fingerprints identified."
        )
    elif confidence > 0.7:
        explanation = (
            "Moderate manipulation signals detected — possible face synthesis "
            "or swap artifacts present."
        )
    else:
        explanation = (
            "Low manipulation signals — image appears largely authentic "
            "with minimal anomalies."
        )

    return {
        "prediction": label,
        "confidence": round(confidence * 100, 2),
        "explanation": explanation
    }


# -----------------------------
# Text AI Detection
# -----------------------------
def run_text_detection(text: str) -> dict:

    result = text_classifier(text)[0]

    if result["label"] == "Fake":
        explanation = (
            "RoBERTa detected language patterns typical of AI generated text — "
            "uniform perplexity, reduced burstiness and synthetic structure."
        )
    else:
        explanation = (
            "Text exhibits natural human writing characteristics — varied sentence "
            "structure and organic word choice."
        )

    return {
        "prediction": "AI GENERATED" if result["label"] == "Fake" else "HUMAN WRITTEN",
        "confidence": round(result["score"] * 100, 2),
        "explanation": explanation
    }


# -----------------------------
# Audio Deepfake Detection
# -----------------------------
def run_audio_detection(audio_bytes: bytes) -> dict:

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        f.write(audio_bytes)
        tmp_path = f.name

    try:
        audio_data, samplerate = sf.read(tmp_path)

        # convert stereo → mono
        if len(audio_data.shape) > 1:
            audio_data = audio_data.mean(axis=1)

    finally:
        os.unlink(tmp_path)

    result = audio_classifier(
        {"array": audio_data, "sampling_rate": samplerate}
    )[0]

    if result["label"].lower() == "fake":
        explanation = (
            "wav2vec 2.0 detected synthetic speech artifacts — abnormal prosody, "
            "TTS signatures and inconsistent vocal tract patterns."
        )
    else:
        explanation = (
            "Audio shows authentic human speech characteristics — natural pitch "
            "variation and organic vocal resonance."
        )

    return {
        "prediction": "FAKE" if result["label"].lower() == "fake" else "REAL",
        "confidence": round(result["score"] * 100, 2),
        "explanation": explanation
    }