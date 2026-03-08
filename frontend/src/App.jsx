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
} from 'lucide-react';

const TABS = [
  { id: 'image', label: 'Image', icon: ImageIcon, accept: 'image/*' },
  { id: 'audio', label: 'Audio', icon: Mic, accept: 'audio/*' },
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
    accept.startsWith('image') ? (
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        className="max-h-56 rounded border border-[#1e2433] object-contain relative z-10"
      />
    ) : (
      <div className="flex flex-col items-center gap-3 text-gray-300 relative z-10">
        <Mic size={32} className="text-[#2563EB]" />
        <span className="truncate max-w-xs font-mono text-sm">{file.name}</span>
        <span className="text-xs text-gray-500 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        <CheckCircle2 size={20} className="text-[#22c55e] mt-2" />
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
      className={`relative flex justify-center items-center min-h-[280px] w-full p-8 transition-all duration-300 overflow-hidden ${loading ? 'cursor-default opacity-80' : 'cursor-pointer hover:bg-[#0f1117]'
        }`}
    >
      {/* Target Corner Brackets */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${dragOver ? 'border-[#2563EB]' : 'border-[#1e2433]'} transition-colors duration-300`} />
      <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${dragOver ? 'border-[#2563EB]' : 'border-[#1e2433]'} transition-colors duration-300`} />
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${dragOver ? 'border-[#2563EB]' : 'border-[#1e2433]'} transition-colors duration-300`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${dragOver ? 'border-[#2563EB]' : 'border-[#1e2433]'} transition-colors duration-300`} />

      {/* Dotted border wrapper */}
      <div className={`absolute inset-4 border border-dashed rounded-sm transition-colors duration-300 z-0 ${dragOver ? 'border-[#2563EB] bg-[#2563EB]/5' : file ? 'border-[#1e2433]' : 'border-[#1e2433]'
        }`} />

      {/* Scanner Animation */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#2563EB] shadow-[0_0_20px_#2563EB] animate-[scan_2s_ease-in-out_infinite] z-20" />
      )}

      {file ? (
        <div className="relative z-10 flex flex-col items-center">
          {preview}
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Upload size={36} className={`${dragOver ? 'text-[#2563EB]' : 'text-[#64748b]'} transition-colors`} />
          <div className="text-center space-y-1">
            <p className="text-sm text-[#f1f5f9] font-medium tracking-wide">
              {dragOver ? "Drop to analyze" : "Click or drag file to analyze"}
            </p>
            <p className="text-xs text-[#64748b] font-mono">
              AWAITING INPUT...
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
  const segments = 20;
  const activeSegments = Math.round((value / 100) * segments);
  const color = isReal ? "bg-[#22c55e]" : "bg-[#ef4444]";
  const dimColor = isReal ? "bg-[#22c55e]/10" : "bg-[#ef4444]/10";

  return (
    <div className="flex items-center gap-[2px] w-full h-3">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-full rounded-[1px] ${i < activeSegments ? color + " shadow-[0_0_8px_" + (isReal ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)") + "]" : dimColor
            }`}
        />
      ))}
    </div>
  );
}

function ResultCard({ result, file, activeTab, onReset }) {
  const isReal = result.label.includes("REAL") || result.label.includes("HUMAN");

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <div className={`relative rounded-sm border p-8 space-y-8 bg-[#0f1117] overflow-hidden ${isReal ? "border-l-4 border-[#1e2433] border-l-[#22c55e] shadow-[inset_4px_0_20px_-10px_rgba(34,197,94,0.3)]" : "border-l-4 border-[#1e2433] border-l-[#ef4444] shadow-[inset_4px_0_20px_-10px_rgba(239,68,68,0.3)]"
        }`}>

        {/* Verdict Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-sm ${isReal ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#ef4444]/10 text-[#ef4444]"}`}>
              {isReal ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#64748b] tracking-widest uppercase font-bold">Analysis Verdict</span>
              <h2 className={`font-mono text-3xl font-bold tracking-tight ${isReal ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                {result.label}
              </h2>
            </div>
          </div>

          {/* Confidence Display */}
          <div className="w-full sm:w-48 space-y-2">
            <div className="flex justify-between items-baseline font-mono text-sm">
              <span className="text-[#64748b]">CONFIDENCE</span>
              <span className="text-[#f1f5f9] font-bold">{result.confidence.toFixed(1)}%</span>
            </div>
            <SegmentedConfidenceBar value={result.confidence} isReal={isReal} />
          </div>
        </div>

        {/* Technical Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#64748b] border-t border-[#1e2433] pt-4">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#64748b]" /> Model: ViT-based</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#64748b]" /> Processing: &lt;2s</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#64748b]" /> Framework: PyTorch</span>
        </div>

        {/* Heatmap Section */}
        {activeTab === 'image' && file && (
          <div className="pt-6 border-t border-[#1e2433]">
            <h3 className="text-xs text-[#a1a1aa] uppercase tracking-widest font-bold mb-4">Forensic Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <span className="text-[10px] text-[#64748b] font-mono tracking-wider ml-1">ORIGINAL_MEDIA</span>
                <div className="bg-[#050505] border border-[#1e2433] rounded-sm p-1">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="original"
                    className="w-full object-contain max-h-[300px] border border-[#1e2433]/50"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] text-[#64748b] font-mono tracking-wider ml-1">GRAD-CAM++_OVERLAY</span>
                <div className="bg-[#050505] border border-[#1e2433] rounded-sm p-1">
                  {result.heatmap ? (
                    <div className="flex flex-col w-full">
                      <img
                        src={`data:image/png;base64,${result.heatmap}`}
                        alt="heatmap"
                        className="w-full object-contain max-h-[300px] border border-[#1e2433]/50"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[200px] flex items-center justify-center font-mono text-xs text-[#64748b]">
                      GENERATING_ANALYSIS...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {result.heatmap && (
              <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-6 p-4 rounded-sm bg-[#050505] border border-[#1e2433]">
                <div className="flex-grow w-full md:w-auto">
                  <div className="h-2 w-full rounded-sm bg-gradient-to-r from-blue-600 via-green-500 via-yellow-500 to-red-600" />
                  <div className="flex justify-between text-[10px] text-[#64748b] mt-2 font-mono tracking-wide">
                    <span>AUTHENTIC_REGION</span>
                    <span>SUSPICIOUS_REGION</span>
                  </div>
                </div>
                <div className="md:max-w-xs text-[11px] text-[#64748b] leading-relaxed font-mono">
                  <span className="text-[#f1f5f9]">Analysis parameters:</span> Warm regions denote spatial features heavily weighted by the model towards manipulation class. Cool regions align with authentic source data distribution.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full sm:w-auto mx-auto flex justify-center items-center gap-2 rounded-sm border border-[#1e2433] bg-[#0f1117] px-6 py-3 text-xs font-mono text-[#f1f5f9] hover:bg-[#1e2433] transition-colors cursor-pointer"
      >
        <RotateCcw size={14} />
        INITIALIZE_NEW_SCAN
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
    ((activeTab === 'image' || activeTab === 'audio') && file);

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f1f5f9] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Background styling for scanner effect */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(280px); opacity: 0; }
        }
      `}} />

      {/* Navbar - Glassmorphism, subtle border */}
      <nav className="relative z-10 border-b border-[#1e2433] bg-[#050505]/80 backdrop-blur-md sticky top-0">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-[#f1f5f9]" />
            <div>
              <h1 className="text-base font-bold tracking-tight text-[#f1f5f9]">
                Hologram Truth Analyzer
              </h1>
              <p className="text-[10px] text-[#64748b] tracking-widest uppercase font-semibold">
                Multi-Modal Deepfake Detection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]"></span>
            </div>
            <span className="hidden sm:block text-[11px] font-mono text-[#64748b]">SYSTEM ONLINE</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12 space-y-10">

        {/* Minimal Hero Section */}
        {!result && (
          <div className="text-center">
            <h2 className="text-[#a1a1aa] text-sm tracking-wide">
              Detect AI-manipulated media with highest forensic confidence
            </h2>
          </div>
        )}

        {/* Tab Switcher - Pill Shaped */}
        <div className="mx-auto max-w-md flex justify-center gap-2">
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
                className={`relative px-5 py-2 text-sm font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${active ? "text-white" : "text-[#64748b] hover:text-[#f1f5f9]"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </div>
                {active && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] rounded-t-full shadow-[0_-2px_8px_rgba(37,99,235,0.4)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Workspace */}
        <div className="mx-auto max-w-2xl w-full transition-all">
          {!result ? (
            <div className="space-y-6">

              {/* Input Area */}
              <div className="bg-[#0f1117] border border-[#1e2433] rounded-sm relative overflow-hidden">
                {activeTab === 'text' ? (
                  <div className="p-1">
                    <textarea
                      rows={10}
                      value={text}
                      disabled={loading}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste suspicious text buffer here for analysis..."
                      className="w-full bg-[#050505] p-6 text-[#f1f5f9] placeholder:text-[#334155] focus:outline-none focus:ring-1 focus:ring-[#2563EB] resize-none text-sm font-mono transition-shadow border border-[#1e2433]"
                    />
                  </div>
                ) : (
                  <DropZone
                    accept={currentTab.accept}
                    file={file}
                    onFile={setFile}
                    loading={loading}
                  />
                )}
              </div>

              {/* Analysis Button */}
              <button
                disabled={!canAnalyze || loading}
                onClick={handleAnalyze}
                className={`w-full relative flex items-center justify-center gap-3 overflow-hidden rounded-sm py-3.5 text-sm tracking-widest font-bold uppercase transition-all duration-300 ${canAnalyze && !loading
                    ? 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] cursor-pointer'
                    : 'bg-[#1e2433] text-[#64748b] cursor-not-allowed'
                  }`}
              >
                {loading ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_1.5s_infinite]" />
                    <Loader2 size={16} className="animate-spin" />
                    <span>Analyzing via <span className="font-mono">{activeTab === 'image' ? 'Vision Transformer' : activeTab === 'audio' ? 'wav2vec 2.0' : 'RoBERTa'}...</span></span>
                  </>
                ) : (
                  <span>Execute Analysis</span>
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

        {/* Minimal Footer */}
        <footer className="pt-20 pb-8 text-center">
          <p className="text-[10px] text-[#64748b]/60 font-mono tracking-widest">
            POWERED BY VISION TRANSFORMERS · WAV2VEC 2.0 · ROBERTA · TEAM TRUTHGUARDIANS
          </p>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}

export default App;
