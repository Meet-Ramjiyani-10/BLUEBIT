# 🔍 Hologram Truth Analyzer
### Multi-Modal Deepfake Detection Framework
> **Team TruthGuardians** | BlueBit Hackathon 4.0 — The Foundation | PS3

---

## 🚀 Problem Statement
Deepfakes have grown **1,500%** in just 2 years, costing businesses **$547M** in H1 2025 alone. Existing detection tools focus on single modalities and fail against sophisticated AI-generated content, leaving critical gaps in cross-modal inconsistency detection.

## 💡 Our Solution
**Hologram Truth Analyzer** is an AI-powered platform that detects manipulated media across multiple modalities — image, audio, video, and text — using state-of-the-art Vision Transformers, cross-modal attention fusion, and Explainable AI (Grad-CAM++ heatmaps).

---

## ✨ Key Features
- 🖼️ **Image Deepfake Detection** — ViT/EfficientNet with 90%+ accuracy
- 🎵 **Audio Deepfake Detection** — wav2vec 2.0 based spoofing detection
- 🔥 **Explainable AI** — Grad-CAM++ heatmaps highlighting manipulated regions
- 📊 **Confidence Scoring** — Real/Fake label with probability score
- ⚡ **Fast Inference** — Results in under 2 seconds
- 🌐 **REST API** — FastAPI backend for programmatic access

---

## 🏗️ Architecture

```
Input (Image/Audio/Video)
        ↓
  Preprocessing Layer
  (Face Detection, Spectrogram Generation)
        ↓
  Feature Extraction
  (ViT, EfficientNet, wav2vec 2.0)
        ↓
  Detection Layer
  (Ensemble Classifier)
        ↓
  XAI Layer
  (Grad-CAM++ Heatmaps, SHAP Values)
        ↓
  Output: Real/Fake + Confidence + Visual Explanation
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| ML Models | ViT, EfficientNet, wav2vec 2.0 |
| XAI | Grad-CAM++, SHAP |
| Backend | Python, FastAPI |
| Frontend | React.js |
| Deep Learning | PyTorch, HuggingFace Transformers |

---

## 📁 Project Structure

```
BLUEBIT/
├── backend/
├── frontend/
├── models/             
├── tests/        
├── requirements.txt
└── README.md
```





## 👥 Team TruthGuardians
Built with ❤️ at BlueBit Hackathon 4.0 — *"May the truth be with you."*