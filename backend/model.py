import torch
from transformers import AutoFeatureExtractor, AutoModelForImageClassification, pipeline
from PIL import Image
import io

MODEL_NAME = "dima806/deepfake_vs_real_image_detection"

extractor = None
model = None
text_classifier = None
audio_classifier = None


def load_model():
    global extractor, model, text_classifier, audio_classifier

    print("Loading image deepfake model...")
    extractor = AutoFeatureExtractor.from_pretrained(MODEL_NAME)
    model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
    model.eval()

    print("Loading text AI detector...")
    text_classifier = pipeline("text-classification",
                               model="roberta-base-openai-detector")

    print("Loading audio deepfake detector...")
    audio_classifier = pipeline("audio-classification",
                                model="mo-thecreator/deepfake-audio-detection")

    print("All models loaded successfully!")

def run_image_detection(image_bytes: bytes) -> dict:

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
        "prediction": label,
        "confidence": round(confidence * 100, 2)
    }
def run_text_detection(text: str) -> dict:

    result = text_classifier(text)[0]

    return {
        "prediction": "AI GENERATED" if result["label"] == "Fake" else "HUMAN WRITTEN",
        "confidence": round(result["score"] * 100, 2)
    }
def run_audio_detection(audio_bytes: bytes) -> dict:
    import io, tempfile, os
    # import librosa
    import soundfile as sf


    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
        f.write(audio_bytes)
        tmp_path = f.name

    try:
        audio_data, samplerate = sf.read(tmp_path)

        # convert stereo → mono
        if len(audio_data.shape) > 1:
            audio_data = audio_data.mean(axis=1)
    finally:
        os.unlink(tmp_path)

    # Pass as dict — bypasses ffmpeg completely
    result = audio_classifier({"array": audio_data, "sampling_rate": 16000})[0]

    return {
        "prediction": "FAKE" if result["label"].lower() == "fake" else "REAL",
        "confidence": round(result["score"] * 100, 2)
    }