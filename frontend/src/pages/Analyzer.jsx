import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/download.png';
import {
  Shield,
  Upload,
  Image as ImageIcon,
  Mic,
  Type,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Video as VideoIcon,
  FileSearch,
  Activity,
  ArrowLeft,
} from 'lucide-react';

const TABS = [
  { id: 'image', label: 'Image', icon: ImageIcon, accept: 'image/*' },
  { id: 'audio', label: 'Audio', icon: Mic, accept: 'audio/*' },
  { id: 'video', label: 'Video', icon: VideoIcon, accept: 'video/*' },
  { id: 'text', label: 'Text', icon: Type },
];

/* ─── Drop Zone ─── */
function DropZone({ accept, file, onFile, loading }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      if (loading) return;
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [onFile, loading]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!loading) setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => { if (!loading) inputRef.current?.click(); }}
      className={`relative flex flex-col justify-center items-center min-h-[260px] w-full rounded-xl border-2 border-dashed transition-all duration-200 ${loading ? 'cursor-default opacity-60' : 'cursor-pointer'
        } ${dragOver
          ? 'border-[#2563EB] bg-blue-50/60'
          : file
            ? 'border-[#CBD5E1] bg-[#F8FAFC]'
            : 'border-[#CBD5E1] bg-[#FAFBFC] hover:border-[#93C5FD] hover:bg-blue-50/30'
        }`}
    >
      {file ? (
        <div className="flex flex-col items-center gap-4 p-6">
          {accept.startsWith('image') ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="max-h-44 rounded-xl object-contain shadow-lg border border-[#E2E8F0]"
            />
          ) : accept.startsWith('video') ? (
            <div className="w-20 h-20 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center">
              <VideoIcon size={32} className="text-[#7C3AED]" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center">
              <Mic size={32} className="text-[#2563EB]" />
            </div>
          )}
          <div className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 shadow-sm">
            <span className="text-sm font-medium text-[#0F172A] max-w-[180px] truncate">{file.name}</span>
            <span className="text-xs text-[#94A3B8]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            <CheckCircle2 size={16} className="text-[#22C55E]" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 pointer-events-none p-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dragOver ? 'bg-[#2563EB]/10' : 'bg-[#F1F5F9]'} transition-colors`}>
            <Upload size={24} className={dragOver ? 'text-[#2563EB]' : 'text-[#94A3B8]'} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#0F172A]">
              {dragOver ? 'Drop to upload' : 'Drag & drop or click to browse'}
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">
              {accept.startsWith('image') ? 'JPEG, PNG, WebP up to 10 MB' :
                accept.startsWith('video') ? 'MP4, AVI, MOV up to 50 MB' :
                  'WAV, MP3, M4A up to 25 MB'}
            </p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={loading}
        onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]); }}
      />
    </div>
  );
}

/* ─── Confidence Bar ─── */
function ConfidenceBar({ value, isReal }) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-full h-3 rounded-full bg-[#F1F5F9] overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${isReal ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
          }`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* ─── Result Card ─── */
function ResultCard({ result, file, activeTab, onReset }) {
  const isReal = result.label.includes("REAL") || result.label.includes("HUMAN");

  return (
    <div className="animate-fade-in space-y-6">
      {/* Main result card */}
      <div className={`bg-white rounded-2xl border overflow-hidden shadow-lg ${isReal ? 'border-[#BBF7D0] shadow-green-500/5' : 'border-[#FECACA] shadow-red-500/5'
        }`}>
        {/* Status bar */}
        <div className={`h-1.5 w-full ${isReal ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />

        <div className="p-8 space-y-8">
          {/* Verdict */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isReal ? 'bg-[#22C55E]/10' : 'bg-[#EF4444]/10'
                }`}>
                {isReal ? (
                  <CheckCircle2 size={28} className="text-[#22C55E]" />
                ) : (
                  <XCircle size={28} className="text-[#EF4444]" />
                )}
              </div>
              <div>
                <p className={`text-3xl font-bold tracking-tight ${isReal ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {result.label}
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">Processed in &lt;2s · Model: ViT-Base</p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-4 py-2 rounded-full ${isReal ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
              }`}>
              {isReal ? 'AUTHENTIC' : 'HIGH RISK'}
            </span>
          </div>

          {/* Confidence */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#475569]">Confidence Score</span>
              <span className={`text-lg font-bold ${isReal ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {result.confidence.toFixed(1)}%
              </span>
            </div>
            <ConfidenceBar value={result.confidence} isReal={isReal} />
          </div>

          {/* Explanation */}
          {result.explanation && (
            <div className={`p-4 rounded-xl border-l-4 bg-[#F8FAFC] ${isReal ? 'border-l-[#22C55E]' : 'border-l-[#EF4444]'
              }`}>
              <p className="text-sm text-[#475569] leading-relaxed">
                <span className={`font-semibold ${isReal ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {isReal ? '✓ ' : '⚠ '}
                </span>
                {result.explanation}
              </p>
            </div>
          )}

          {/* Frame Analysis for Video */}
          {activeTab === 'video' && result.frames_analyzed && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-sm font-medium text-[#475569]">Frame Analysis</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[#475569]">{result.frames_analyzed} frames</span>
                <span className="text-[#EF4444] font-semibold">{result.fake_frames} fake</span>
                <span className="text-[#22C55E] font-semibold">{result.real_frames} real</span>
              </div>
            </div>
          )}

          {/* Voice Pattern for Audio */}
          {activeTab === 'audio' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
                <Activity size={16} className="text-[#475569]" />
                <h3 className="text-sm font-semibold text-[#0F172A]">Voice Pattern Analysis</h3>
              </div>
              <div className="h-20 w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center overflow-hidden gap-[2px] px-4">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-[#2563EB]/30 rounded-full"
                    style={{ height: `${Math.max(15, Math.random() * 80)}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Text Analysis */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
                <FileSearch size={16} className="text-[#475569]" />
                <h3 className="text-sm font-semibold text-[#0F172A]">Textual Analysis</h3>
              </div>
              <div className={`p-4 rounded-xl border text-sm leading-relaxed ${isReal ? 'bg-green-50/50 border-[#BBF7D0] text-[#166534]' : 'bg-red-50/50 border-[#FECACA] text-[#991B1B]'
                }`}>
                Analysis complete. {isReal ? 'No structural anomalies detected.' : 'AI generation patterns detected in text.'}
              </div>
            </div>
          )}

          {/* Forensic Analysis — Image & Video */}
          {(activeTab === 'image' || activeTab === 'video') && file && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
                <FileSearch size={16} className="text-[#475569]" />
                <h3 className="text-sm font-semibold text-[#0F172A]">Forensic Analysis</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2 aspect-square sm:aspect-auto sm:h-56 flex items-center justify-center overflow-hidden">
                    {activeTab === 'image' ? (
                      <img src={URL.createObjectURL(file)} alt="original" className="w-full h-full object-contain" />
                    ) : (
                      <VideoIcon size={40} className="text-[#CBD5E1]" />
                    )}
                  </div>
                  <p className="text-xs text-center text-[#94A3B8] font-medium">Original</p>
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2 aspect-square sm:aspect-auto sm:h-56 flex items-center justify-center overflow-hidden">
                    {result.heatmap ? (
                      <img src={`data:image/png;base64,${result.heatmap}`} alt="heatmap overlay" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-[#94A3B8]">No heatmap available</span>
                    )}
                  </div>
                  <p className="text-xs text-center text-[#94A3B8] font-medium">Grad-CAM++ Overlay</p>
                </div>
              </div>

              {result.heatmap && (
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500" />
                  <div className="flex justify-between text-[10px] text-[#94A3B8] font-medium">
                    <span>Authentic</span>
                    <span>Suspicious</span>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#475569] leading-relaxed">
                <span className="text-[#EF4444] font-semibold">Red regions:</span> Heavily weighted spatial features triggering manipulation classification. High probability of synthetic alteration or GAN-generated artifacts.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset button */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 border border-[#E2E8F0] bg-white text-[#475569] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw size={16} />
          Analyze Another
        </button>
      </div>
    </div>
  );
}

/* ═══════ ANALYZER PAGE ═══════ */
export default function Analyzer() {
  const [activeTab, setActiveTab] = useState('image');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  /* ── API Logic — UNCHANGED ── */
  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      let response;

      if (activeTab === "image") {
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch("http://127.0.0.1:8000/detect/image", {
          method: "POST",
          body: formData,
        });
      }

      if (activeTab === "audio") {
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch("http://127.0.0.1:8000/detect/audio", {
          method: "POST",
          body: formData,
        });
      }

      if (activeTab === "video") {
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch("http://127.0.0.1:8000/detect/video", {
          method: "POST",
          body: formData,
        });
      }

      if (activeTab === "text") {
        response = await fetch("http://127.0.0.1:8000/detect/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });
      }

      const data = await response.json();

      setResult({
        label: data.prediction,
        confidence: data.confidence,
        heatmap: data.heatmap ?? null,
        explanation: data.explanation ?? null,
        frames_analyzed: data.frames_analyzed ?? null,
        fake_frames: data.fake_frames ?? null,
        real_frames: data.real_frames ?? null,
      });

    } catch (error) {
      console.error(error);
      alert("Backend connection error");
    }

    setLoading(false);
  };

  const reset = () => {
    setFile(null);
    setText('');
    setResult(null);
    setLoading(false);
  };

  const canAnalyze =
    (activeTab === 'text' && text.trim().length > 0) ||
    ((activeTab === 'image' || activeTab === 'audio' || activeTab === 'video') && file);

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-[#475569] hover:text-[#0F172A] transition-colors text-sm font-medium">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="h-6 w-px bg-[#E2E8F0]" />
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="Hologram Truth Analyzer" className="h-16 w-16 rounded-lg object-cover" />
              <span className="font-bold text-[15px] tracking-tight">Hologram Truth Analyzer</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
            </span>
            <span className="text-xs font-semibold text-[#22C55E]">System Online</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* ── Page header ── */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A]">
            Media Authenticity Analyzer
          </h1>
          <p className="text-[#475569]">Upload media to detect AI manipulation.</p>
        </div>

        {/* ── Analyzer workspace ── */}
        {!result ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl shadow-black/[0.03] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#E2E8F0]">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (!loading) {
                        setActiveTab(tab.id);
                        reset();
                      }
                    }}
                    className={`flex-1 relative flex items-center justify-center gap-2.5 py-4 text-sm font-semibold transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      } ${active ? 'text-[#2563EB] bg-blue-50/50' : 'text-[#94A3B8] hover:text-[#475569] hover:bg-[#FAFBFC]'
                      }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                    {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB]" />}
                  </button>
                );
              })}
            </div>

            {/* Input area */}
            <div className="p-6">
              {activeTab === 'text' ? (
                <textarea
                  value={text}
                  disabled={loading}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste text for AI detection analysis..."
                  rows={8}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#93C5FD] focus:ring-2 focus:ring-blue-500/10 resize-none text-sm leading-relaxed transition-all"
                />
              ) : (
                <DropZone
                  accept={currentTab.accept}
                  file={file}
                  onFile={setFile}
                  loading={loading}
                />
              )}
            </div>

            {/* Analyze button */}
            <div className="px-6 pb-6">
              <button
                disabled={!canAnalyze || loading}
                onClick={handleAnalyze}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-semibold transition-all ${canAnalyze && !loading
                  ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/20 cursor-pointer'
                  : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Analyzing with {activeTab === 'image' ? 'Vision Transformer' : activeTab === 'audio' ? 'wav2vec 2.0' : activeTab === 'video' ? 'Video Processor' : 'RoBERTa'}...</span>
                  </>
                ) : (
                  'Execute Analysis'
                )}
              </button>
            </div>
          </div>
        ) : (
          <ResultCard
            result={result}
            file={file}
            activeTab={activeTab}
            onReset={reset}
          />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E2E8F0] bg-white mt-auto py-6">
        <p className="text-center text-sm text-[#94A3B8]">
          TruthGuardians &middot; BlueBit Hackathon 4.0
        </p>
      </footer>
    </div>
  );
}
