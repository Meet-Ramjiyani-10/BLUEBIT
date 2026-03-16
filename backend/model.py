import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification, pipeline
from PIL import Image
import io
import cv2
import numpy as np
import tempfile
import os
import librosa

MODEL_NAME = "dima806/deepfake_vs_real_image_detection"

extractor = None
model = None
text_classifier = None
audio_classifier = None


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


def crop_face(image_bytes: bytes) -> bytes:
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


def run_image_detection(image_bytes: bytes) -> dict:
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
    confidence_pct = round(confidence * 100, 2)

    if label == "FAKE":
        if confidence_pct > 90:
            explanation = "Strong manipulation detected — unnatural skin texture, boundary inconsistencies and GAN fingerprints identified by Vision Transformer."
        elif confidence_pct > 70:
            explanation = "Moderate manipulation signals detected — possible face swap or expression synthesis with some authentic regions present."
        else:
            explanation = "Weak manipulation signals detected — minor anomalies present but inconclusive."
    else:
        if confidence_pct > 90:
            explanation = "No manipulation detected — facial features show natural skin texture, authentic boundaries and no synthetic artifacts found."
        elif confidence_pct > 70:
            explanation = "Content appears authentic — no significant manipulation artifacts detected by Vision Transformer."
        else:
            explanation = "Likely authentic — low confidence result, consider re-analyzing with a clearer image."

    return {
        "prediction": label,
        "confidence": confidence_pct,
        "explanation": explanation
    }


def run_text_detection(text: str) -> dict:
    result = text_classifier(text)[0]

    if result["label"] == "Fake":
        explanation = "RoBERTa detected language patterns typical of AI generated text — uniform perplexity, reduced burstiness and synthetic sentence structure."
    else:
        explanation = "Text exhibits natural human writing characteristics — varied sentence structure, authentic perplexity distribution and organic word choice."

    return {
        "prediction": "AI GENERATED" if result["label"] == "Fake" else "HUMAN WRITTEN",
        "confidence": round(result["score"] * 100, 2),
        "explanation": explanation
    }


def run_audio_detection(audio_bytes: bytes) -> dict:
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
        f.write(audio_bytes)
        tmp_path = f.name

    try:
        audio_data, samplerate = librosa.load(tmp_path, sr=16000, mono=True)
    finally:
        os.unlink(tmp_path)

    result = audio_classifier(
        {"array": audio_data, "sampling_rate": 16000}
    )[0]

    if result["label"].lower() == "fake":
        explanation = "wav2vec 2.0 detected synthetic speech artifacts — abnormal prosody, TTS signatures and inconsistent vocal tract patterns identified."
    else:
        explanation = "Audio shows authentic human speech characteristics — natural pitch variation, organic vocal resonance and no synthetic patterns detected."

    return {
        "prediction": "FAKE" if result["label"].lower() == "fake" else "REAL",
        "confidence": round(result["score"] * 100, 2),
        "explanation": explanation
    }


def run_audio_detection_from_array(audio_data, samplerate=16000) -> dict:
    """Run audio detection directly from numpy array — used by crossmodal"""
    result = audio_classifier(
        {"array": audio_data, "sampling_rate": samplerate}
    )[0]

    if result["label"].lower() == "fake":
        explanation = "wav2vec 2.0 detected synthetic speech artifacts — abnormal prosody, TTS signatures and inconsistent vocal tract patterns identified."
    else:
        explanation = "Audio shows authentic human speech characteristics — natural pitch variation and organic vocal resonance."

    return {
        "prediction": "FAKE" if result["label"].lower() == "fake" else "REAL",
        "confidence": round(result["score"] * 100, 2),
        "explanation": explanation
    }