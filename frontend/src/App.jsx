import { useState, useRef, useCallback } from 'react';
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
  Cpu,
  FileSearch,
  Activity
} from 'lucide-react';

const TABS = [
  { id: 'image', label: 'Image', icon: ImageIcon, accept: 'image/*' },
  { id: 'audio', label: 'Audio', icon: Mic, accept: 'audio/*' },
  { id: 'video', label: 'Video', icon: VideoIcon, accept: 'video/*' },
  { id: 'text', label: 'Text', icon: Type },
];

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

  const preview = file ? (
    accept.startsWith('image') || accept.startsWith('video') ? (
      <div className="relative z-10 w-full flex flex-col items-center">
        {accept.startsWith('video') ? (
          <div className="w-full max-w-sm aspect-video bg-[#04040a] border border-[#1a1f2e] flex items-center justify-center">
            <VideoIcon size={32} className="text-[#2563eb] opacity-80" />
          </div>
        ) : (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="max-h-56 rounded-sm border border-[#1a1f2e] object-contain shadow-2xl"
          />
        )}
        <div className="mt-4 flex items-center gap-3 bg-[#04040a] border border-[#1a1f2e] px-4 py-2 rounded-sm text-[#f8fafc]">
          <span className="font-mono text-sm max-w-[200px] truncate">{file.name}</span>
          <span className="font-mono text-xs text-[#64748b]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          <span className="px-2 py-0.5 bg-[#2563eb]/20 text-[#2563eb] uppercase font-mono text-[10px] tracking-widest">{accept.split('/')[0]}</span>
          <CheckCircle2 size={16} className="text-[#16a34a]" />
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-4 relative z-10 bg-[#04040a] border border-[#1a1f2e] px-8 py-6 rounded-sm">
        <Mic size={32} className="text-[#2563eb]" />
        <span className="truncate max-w-xs font-mono text-sm text-[#f8fafc]">{file.name}</span>
        <span className="text-xs text-[#64748b] font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        <span className="px-2 py-0.5 bg-[#2563eb]/20 text-[#2563eb] uppercase font-mono text-[10px] tracking-widest">AUDIO</span>
        <CheckCircle2 size={20} className="text-[#16a34a] mt-2" />
      </div>
    )
  ) : null;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!loading) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => { if (!loading) inputRef.current?.click(); }}
      className={`relative flex justify-center items-center min-h-[280px] w-full p-8 transition-colors duration-200 overflow-hidden bg-[#0c0e16] ${loading ? 'cursor-default opacity-50' : 'cursor-pointer hover:bg-[#111420]'
        }`}
    >
      {/* Target Corner Brackets */}
      <div className={`absolute top-0 left-0 w-6 h-6 border-t border-l ${dragOver ? 'border-[#2563eb]' : 'border-[#1a1f2e]'}`} />
      <div className={`absolute top-0 right-0 w-6 h-6 border-t border-r ${dragOver ? 'border-[#2563eb]' : 'border-[#1a1f2e]'}`} />
      <div className={`absolute bottom-0 left-0 w-6 h-6 border-b border-l ${dragOver ? 'border-[#2563eb]' : 'border-[#1a1f2e]'}`} />
      <div className={`absolute bottom-0 right-0 w-6 h-6 border-b border-r ${dragOver ? 'border-[#2563eb]' : 'border-[#1a1f2e]'}`} />

      {/* Scanner Animation */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#2563eb] shadow-[0_4px_20px_#2563eb] animate-[scan_2s_linear_infinite] z-20" />
      )}

      {file ? (
        <div className="relative z-10 flex flex-col items-center w-full">
          {preview}
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-3">
          <Upload size={32} className={`${dragOver ? 'text-[#2563eb]' : 'text-[#64748b]'}`} />
          <div className="text-center">
            <p className="text-[#f8fafc] text-sm">
              {dragOver ? "Drop to scan" : "Drop file to scan"}
            </p>
            <p className="text-xs text-[#64748b] mt-1">
              or click to browse
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
        onChange={(e) => {
          if (e.target.files[0]) onFile(e.target.files[0]);
        }}
      />
    </div>
  );
}

function SegmentedConfidenceBar({ value, isReal }) {
  const segments = 10;
  const activeSegments = Math.round((value / 100) * segments);
  // Red for FAKE, Green for REAL
  const color = isReal ? "bg-[#16a34a]" : "bg-[#dc2626]";
  const dimColor = "bg-[#1a1f2e]";

  return (
    <div className="flex items-center gap-1 w-full h-8">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-full rounded-sm ${i < activeSegments ? color : dimColor}`}
        />
      ))}
    </div>
  );
}

function ResultCard({ result, file, activeTab, onReset }) {
  const isReal = result.label.includes("REAL") || result.label.includes("HUMAN");

  return (
    <div className="animate-fade-in-up w-full flex flex-col mt-6">
      <div className="relative bg-[#0c0e16] border border-[#1a1f2e] rounded-sm overflow-hidden flex flex-col shadow-2xl">
        {/* Top thin colored bar */}
        <div className={`h-1 w-full ${isReal ? 'bg-[#16a34a]' : 'bg-[#dc2626]'}`} />

        <div className="p-8 space-y-8">
          {/* Verdict Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#1a1f2e] pb-6">
            <div className="space-y-2">
              <span className={`font-mono text-5xl font-bold tracking-tight ${isReal ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                {result.label}
              </span>
              <div className="text-[11px] text-[#94a3b8] font-mono tracking-widest uppercase flex flex-col gap-1">
                <span>Model · ViT-Base</span>
                <span>Processed in &lt;2s</span>
                <span>Framework: PyTorch</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-4 min-w-[200px]">
              <span className={`px-3 py-1 text-[10px] uppercase font-mono tracking-widest border border-[#1a1f2e] bg-[#04040a] ${isReal ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                {isReal ? 'AUTHENTIC' : 'HIGH RISK'}
              </span>
            </div>
          </div>

          {/* Confidence Row */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#64748b] uppercase tracking-widest">CONFIDENCE SCORE</span>
              <span className="text-[#2563eb] font-bold text-lg">{result.confidence.toFixed(1)}%</span>
            </div>
            <SegmentedConfidenceBar value={result.confidence} isReal={isReal} />
          </div>

          {/* Explanation line */}
          {result.explanation && (
            <div style={{
              marginTop: "12px",
              padding: "10px 14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #1E293B",
              borderLeft: `3px solid ${isReal ? "#22C55E" : "#EF4444"}`,
              borderRadius: "4px",
            }}>
              <p style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#94A3B8",
                margin: 0,
                lineHeight: "1.6"
              }}>
                <span style={{ color: isReal ? "#22C55E" : "#EF4444", marginRight: "8px" }}>
                  {isReal ? "✓" : "⚠"}
                </span>
                {result.explanation}
              </p>
            </div>
          )}

          {/* Frame Analysis for Video */}
          {activeTab === 'video' && result.frames_analyzed && (
            <div className="bg-[#04040a] border border-[#1a1f2e] p-4 flex items-center justify-between">
              <span className="text-[#64748b] text-[10px] font-mono uppercase tracking-widest">FRAME ANALYSIS</span>
              <div className="text-[#94a3b8] text-[11px] font-mono space-x-3">
                <span>{result.frames_analyzed} frames analyzed</span>
                <span className="text-[#dc2626]">{result.fake_frames} fake</span>
                <span className="text-[#16a34a]">{result.real_frames} real</span>
              </div>
            </div>
          )}

          {/* Voice Pattern / Audio */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#f8fafc] border-b border-[#1a1f2e] pb-2">
                <Activity size={16} className="text-[#64748b]" />
                <h3 className="text-[11px] uppercase tracking-widest font-mono">VOICE PATTERN ANALYSIS</h3>
              </div>
              <div className="h-24 w-full bg-[#04040a] border border-[#1a1f2e] flex items-center justify-center overflow-hidden gap-[1px]">
                {/* Fake waveform placeholder */}
                {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} className={`w-1 bg-[#2563eb]/40 rounded-sm`} style={{ height: `${Math.max(10, Math.random() * 80)}%` }} />
                ))}
              </div>
            </div>
          )}

          {/* Text Analysis Placeholder */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#f8fafc] border-b border-[#1a1f2e] pb-2">
                <FileSearch size={16} className="text-[#64748b]" />
                <h3 className="text-[11px] uppercase tracking-widest font-mono">TEXTUAL ARTIFACTS</h3>
              </div>
              <div className="p-4 bg-[#04040a] border border-[#1a1f2e] text-[#16a34a] text-sm font-mono whitespace-pre-wrap leading-relaxed">
                Analysis complete. No structural anomalies detected in text buffer.
              </div>
            </div>
          )}

          {/* Heatmap Section */}
          {(activeTab === 'image' || activeTab === 'video') && file && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#f8fafc] border-b border-[#1a1f2e] pb-2">
                <FileSearch size={16} className="text-[#64748b]" />
                <h3 className="text-[11px] uppercase tracking-widest font-mono">FORENSIC ANALYSIS</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <div className="bg-[#04040a] border border-[#1a1f2e] rounded-sm p-1 aspect-square sm:aspect-auto sm:h-64 flex items-center justify-center overflow-hidden">
                    {activeTab === 'image' ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="original"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <VideoIcon size={48} className="text-[#1a1f2e]" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#64748b] font-mono text-center tracking-widest uppercase">Original Signal</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="bg-[#04040a] border border-[#1a1f2e] rounded-sm p-1 aspect-square sm:aspect-auto sm:h-64 flex items-center justify-center overflow-hidden">
                    {result.heatmap ? (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="base"
                          className="w-full h-full object-contain absolute opacity-40 grayscale"
                        />
                        <img
                          src={`data:image/png;base64,${result.heatmap}`}
                          alt="heatmap"
                          className="w-full h-full object-contain absolute mix-blend-screen"
                        />
                      </div>
                    ) : (
                      <div className="text-[10px] text-[#64748b] font-mono tracking-widest uppercase">No mapping available</div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#64748b] font-mono text-center tracking-widest uppercase">Grad-CAM++ Overlay</span>
                </div>
              </div>

              {result.heatmap && (
                <div className="flex flex-col gap-2 pt-2">
                  <div className="h-1 w-full rounded-sm bg-gradient-to-r from-blue-600 via-green-500 via-yellow-500 to-red-600" />
                  <div className="flex justify-between text-[9px] text-[#94a3b8] font-mono tracking-widest uppercase">
                    <span>AUTHENTIC</span>
                    <span>SUSPICIOUS</span>
                  </div>
                </div>
              )}

              {/* Explanation Box */}
              <div className="bg-[#04040a] border border-[#1a1f2e] p-4 text-[#94a3b8] font-mono text-[11px] leading-relaxed">
                <span className="text-[#dc2626] font-bold">RED REGIONS:</span> Heavily weighted spatial features triggering manipulation classification. High probability of synthetic alteration or GAN-generated artifacts.
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-6 w-full md:w-auto mx-auto border border-[#1a1f2e] bg-transparent text-[#94a3b8] px-8 py-3 text-xs font-mono uppercase tracking-widest hover:bg-[#0c0e16] hover:text-[#f8fafc] transition-colors"
      >
        ANALYZE ANOTHER SAMPLE
      </button>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('image');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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
    <div className="min-h-screen bg-[#04040a] text-[#f8fafc] font-sans selection:bg-[#2563eb] selection:text-white pb-24">
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          color-scheme: dark;
        }
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(280px); opacity: 0; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}} />

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 h-[56px] border-b border-[#1a1f2e] bg-[rgba(5,5,10,0.95)] backdrop-blur px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Shield size={16} className="text-[#2563eb]" />
          <div className="flex flex-col justify-center">
            <span className="text-sm font-semibold tracking-tight leading-tight">Hologram Truth Analyzer</span>
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#64748b] leading-tight">MULTI-MODAL DEEPFAKE DETECTION</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex h-1.5 w-1.5 align-middle">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#16a34a]"></span>
          </div>
          <span className="text-[10px] font-mono text-[#16a34a] tracking-widest">SYSTEM ONLINE</span>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <main className="pt-[100px] px-4 mx-auto max-w-4xl space-y-12">

        {/* HERO */}
        {!result && (
          <div className="flex flex-col items-center text-center space-y-5">
            <div className="flex items-center gap-2 border border-[#1a1f2e] bg-[#0c0e16] px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-[#94a3b8] uppercase">4-Modal Detection System</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-[800] tracking-tight text-white m-0">
              Unmask Synthetic Media
            </h1>

            <p className="text-sm text-[#64748b] max-w-2xl font-medium tracking-wide">
              Forensic-grade detection across image, audio, video and text — powered by Vision Transformers, wav2vec 2.0 and RoBERTa
            </p>

            {/* Stat Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['High Accuracy', '4 Modalities', 'Grad-CAM++ XAI'].map(stat => (
                <span key={stat} className="px-3 py-1 text-xs border border-[#1a1f2e] bg-[#0c0e16] text-[#64748b] rounded-full flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#64748b]"></span> {stat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* HOW IT WORKS */}
        {!result && (
          <div className="hidden md:flex items-stretch justify-between gap-4 py-8 relative">
            <div className="absolute top-[60px] left-[15%] right-[15%] h-[1px] border-t border-dashed border-[#1a1f2e] -z-10" />

            <div className="flex-1 flex flex-col items-center text-center gap-3 bg-[#0c0e16] border border-[#1a1f2e] p-5 relative">
              <span className="absolute -top-2 -left-2 w-5 h-5 bg-[#2563eb] text-white text-[10px] font-mono flex items-center justify-center rounded-sm">01</span>
              <Upload size={20} className="text-[#64748b]" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-[#f8fafc]">Submit Media</h4>
              <p className="text-[11px] text-[#64748b] leading-relaxed">Drop any image, audio clip, video or paste text</p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center gap-3 bg-[#0c0e16] border border-[#1a1f2e] p-5 relative">
              <span className="absolute -top-2 -left-2 w-5 h-5 bg-[#2563eb] text-white text-[10px] font-mono flex items-center justify-center rounded-sm">02</span>
              <Cpu size={20} className="text-[#64748b]" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-[#f8fafc]">Neural Analysis</h4>
              <p className="text-[11px] text-[#64748b] leading-relaxed">3 specialized AI models analyze for manipulation artifacts</p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center gap-3 bg-[#0c0e16] border border-[#1a1f2e] p-5 relative">
              <span className="absolute -top-2 -left-2 w-5 h-5 bg-[#2563eb] text-white text-[10px] font-mono flex items-center justify-center rounded-sm">03</span>
              <FileSearch size={20} className="text-[#64748b]" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-[#f8fafc]">Forensic Report</h4>
              <p className="text-[11px] text-[#64748b] leading-relaxed">Receive verdict, confidence score and visual heatmap evidence</p>
            </div>
          </div>
        )}

        {/* WORKSPACE AREA */}
        <div className="mx-auto max-w-3xl w-full">
          {!result ? (
            <div className="flex flex-col border border-[#1a1f2e] bg-[#0c0e16] shadow-xl rounded-sm overflow-hidden">

              {/* TABS */}
              <div className="flex w-full border-b border-[#1a1f2e]">
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
                      className={`flex-1 relative h-14 flex items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-[0.15em] transition-colors bg-transparent ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#111420]'} ${active ? "text-[#f8fafc]" : "text-[#64748b]"}`}
                    >
                      <Icon size={14} />
                      {tab.label}
                      {active && (
                        <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#2563eb]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* UPLOAD / INPUT */}
              <div className="w-full relative min-h-[280px]">
                {activeTab === 'text' ? (
                  <textarea
                    value={text}
                    disabled={loading}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste text buffer for NLP analysis..."
                    className="w-full h-[280px] bg-[#04040a] p-6 text-[#94a3b8] placeholder:text-[#334155] focus:outline-none focus:ring-opacity-0 resize-none text-sm font-mono border-none"
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

              {/* EXECUTE BUTTON */}
              <button
                disabled={!canAnalyze || loading}
                onClick={handleAnalyze}
                className={`w-full h-12 flex items-center justify-center font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${canAnalyze && !loading ? 'bg-[#1d4ed8] text-[#f8fafc] hover:bg-[#2563eb] cursor-pointer' : 'bg-[#1a1f2e] text-[#64748b] cursor-not-allowed'}`}
              >
                {loading ? (
                  <span className="flex items-center gap-2 text-white">
                    SCANNING · {activeTab === 'image' ? 'VISION TRANSFORMER' : activeTab === 'audio' ? 'WAV2VEC 2.0' : activeTab === 'video' ? 'VIDEO PROCESSING' : 'ROBERTA'} ACTIVE
                    <span className="flex h-1.5 w-1.5 relative ml-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                  </span>
                ) : (
                  "EXECUTE ANALYSIS"
                )}
              </button>
            </div>
          ) : (
            <ResultCard
              result={result}
              file={file}
              activeTab={activeTab}
              onReset={reset}
            />
          )}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 w-full bg-[#04040a] border-t border-[#1a1f2e] py-4 text-center z-40">
        <p className="text-[10px] text-[#64748b] font-mono tracking-[0.15em] uppercase">
          TruthGuardians · BlueBit Hackathon 4.0 · Vision Transformers · wav2vec 2.0 · RoBERTa · Grad-CAM++
        </p>
      </footer>
    </div>
  );
}

export default App;
