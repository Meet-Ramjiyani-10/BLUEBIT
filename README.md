# 🔍 Hologram Truth Analyzer
### Multi-Modal Deepfake Detection Framework

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.9+-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-3.1-orange)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

**Team TruthGuardians · BlueBit Hackathon 4.0 — The Foundation · PS3**

*"May the truth be with you."*

</div>

---

## 🚨 The Problem

Deepfakes have grown **1,500%** in just 2 years. In H1 2025 alone, **$547M** was lost to deepfake fraud globally. **73%** of people cannot distinguish real from AI-generated content, and **96%** of deepfakes are non-consensual.

Existing detection tools focus on **single modalities** — analyzing only image OR audio — missing critical cross-modal inconsistencies like lip-sync errors and unnatural audio-visual correlations. They operate as black boxes with no explainability, eroding user trust.

---

## 💡 Our Solution

**Hologram Truth Analyzer** is an AI-powered forensic platform that detects manipulated media across **4 modalities** — image, audio, video and text — using state-of-the-art models with full **Explainable AI (Grad-CAM++ heatmaps)**.

> "Not just a label — visual forensic evidence of exactly what was manipulated."

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🖼️ **Image Detection** | Vision Transformer (ViT) detects facial manipulation, GAN artifacts and synthetic skin texture |
| 🎵 **Audio Detection** | wav2vec 2.0 identifies voice cloning, TTS synthesis and unnatural prosody patterns |
| 🎬 **Video Detection** | Frame-by-frame ViT analysis with temporal voting across sampled frames |
| 📝 **Text Detection** | RoBERTa detects AI-generated writing through perplexity and statistical analysis |
| 🔥 **Grad-CAM++ Heatmaps** | Visual heatmaps highlighting suspicious regions in red — full forensic evidence |
| 🧠 **Auto Face Crop** | OpenCV auto-detects and crops faces for optimal model performance |
| ⚡ **Fast Processing** | Real-time inference with FastAPI backend |
| 💬 **AI Explanations** | Every result comes with a human-readable explanation of why it was flagged |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        INPUT LAYER                          │
│              Image · Audio · Video · Text                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   PREPROCESSING                             │
│   Face Detection (OpenCV) · Spectrogram · Frame Extraction  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                FEATURE EXTRACTION                           │
│   ViT (Image/Video) · wav2vec 2.0 (Audio) · RoBERTa (Text) │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  DETECTION LAYER                            │
│          Ensemble Classifier → REAL / FAKE + Score          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    XAI LAYER                                │
│         Grad-CAM++ Heatmaps · Text Explanations             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    OUTPUT                                   │
│       REAL/FAKE · Confidence Score · Visual Evidence        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### AI/ML
| Model | Purpose | 
|-------|---------|
| `dima806/deepfake_vs_real_image_detection` | Image deepfake detection | 
| `facebook/wav2vec2-base` + `mo-thecreator/deepfake-audio-detection` | Audio deepfake detection | 
| `roberta-base-openai-detector` | AI-generated text detection | 
| OpenCV Haar Cascade | Auto face detection & crop | 
| Grad-CAM++ | Visual explainability heatmaps | 

### Backend
- **Python** — Core language
- **FastAPI** — REST API framework
- **PyTorch** — Deep learning inference
- **HuggingFace Transformers** — Pretrained model loading
- **OpenCV** — Image processing & face detection
- **Librosa** — Audio processing

### Frontend
- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Lucide React** — Icons

---

## 📁 Project Structure

```
BLUEBIT/
├── backend/
│   ├── main.py          # FastAPI app — all 4 detection endpoints
│   ├── model.py         # Model loading & inference (image/audio/text)
│   └── gradcam.py       # Grad-CAM++ heatmap generation
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Main React app with all UI components
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   └── package.json
├── requirements.txt
└── README.md
```

---

## 📡 API Endpoints

| Method | Endpoint | Input | Output |
|--------|----------|-------|--------|
| `GET` | `/health` | — | System status |
| `POST` | `/detect/image` | `multipart/form-data` image file | prediction, confidence, heatmap, explanation |
| `POST` | `/detect/audio` | `multipart/form-data` audio file | prediction, confidence, explanation |
| `POST` | `/detect/video` | `multipart/form-data` video file | prediction, confidence, frames_analyzed, fake_frames, real_frames |
| `POST` | `/detect/text` | `application/json` `{"text": "..."}` | prediction, confidence, explanation |

### Example Response (Image Detection)
```json
{
  "status": "success",
  "filename": "photo.jpg",
  "prediction": "FAKE",
  "confidence": 92.02,
  "heatmap": "base64encodedPNGstring...",
  "explanation": "Strong manipulation detected — unnatural skin texture, boundary inconsistencies and GAN fingerprints identified by Vision Transformer."
}
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 
- Node.js 18+
- pip
- 4GB+ RAM (for model loading)

### Backend Setup
```bash
# Clone the repo
git clone https://github.com/Meet-Ramjiyani-10/BLUEBIT.git
cd BLUEBIT

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start the backend
cd backend
uvicorn main:app --reload
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 🎯 How to Use

1. Open `http://localhost:5173`
2. Select a modality tab — **Image · Audio · Video · Text**
3. Upload your file or paste text
4. Click **"Execute Analysis"**
5. View:
   - ✅ REAL or ❌ FAKE verdict
   - Confidence score (0-100%)
   - **Grad-CAM++ heatmap** showing suspicious regions (image/video)
   - AI explanation of why the result was flagged
   - Frame-by-frame breakdown (video only)

---

## 🔬 Explainability — How Grad-CAM++ Works

Grad-CAM++ (Gradient-weighted Class Activation Mapping++) generates visual explanations by:

1. Running a forward pass through the Vision Transformer
2. Computing gradients of the predicted class score w.r.t. feature maps
3. Weighting feature maps by their gradient importance
4. Producing a heatmap where:
   - 🔴 **Red/Yellow regions** = High suspicion — manipulation artifacts detected
   - 🔵 **Blue regions** = Authentic — no significant anomalies

This makes every detection **transparent and trustworthy** — not a black box.

---

## 📊 MODALITY

| Modality | Model |
|----------|-------|
| Image (deepfake face) | ViT | 
| Image (real photo) | ViT | 
| Audio (cloned voice) | wav2vec 2.0 | 
| Text (AI generated) | RoBERTa | 

---

## 🚀 What We Built in 12 Hours

- ✅ 4-modal deepfake detection (image, audio, video, text)
- ✅ Real Grad-CAM++ heatmap generation and overlay
- ✅ Auto face detection and cropping pipeline
- ✅ AI-powered explanation for every detection
- ✅ FastAPI REST backend with 5 endpoints
- ✅ React frontend with professional forensic UI
- ✅ Frame-by-frame video analysis with temporal voting
- ✅ Full CORS support for local development

---

## 👥 Team TruthGuardians

Built with ❤️ at **BlueBit Hackathon 4.0 — The Foundation**
by **MLSC PCCOE**

> *"Ideas are powerful, but true impact begins when ideas take shape."*

---

## Acknowledgements

- [HuggingFace](https://huggingface.co) — Pretrained models
- [dima806](https://huggingface.co/dima806) — Deepfake image detection model
- [PyTorch](https://pytorch.org) — Deep learning framework
- [FastAPI](https://fastapi.tiangolo.com) — Backend framework
