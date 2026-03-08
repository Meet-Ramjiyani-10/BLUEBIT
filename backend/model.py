import torch
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from PIL import Image
import io
import numpy as np

# Load pretrained deepfake detection model from HuggingFace
MODEL_NAME = "dima806/deepfake_vs_real_image_detection"

extractor = None
model = None

def load_model():
    global extractor, model
    print("Loading deepfake detection model...")
    extractor = AutoFeatureExtractor.from_pretrained(MODEL_NAME)
    model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
    model.eval()
    print("Model loaded successfully!")

def run_image_detection(image_bytes: bytes) -> dict:
    """
    Run deepfake detection on image bytes.
    Returns prediction label and confidence score.
    """
    if model is None:
        load_model()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    inputs = extractor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=-1)
        predicted_class = torch.argmax(probs, dim=-1).item()
        confidence = probs[0][predicted_class].item()

    label = model.config.id2label[predicted_class].upper()

    return {
        "prediction": label,       # "REAL" or "FAKE"
        "confidence": round(confidence * 100, 2),
        "raw_probs": probs[0].tolist()
    }