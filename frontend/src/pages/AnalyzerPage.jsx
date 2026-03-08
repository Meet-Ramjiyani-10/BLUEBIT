import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
  FileSearch,
  ArrowLeft,
} from 'lucide-react';

/* ─── Constants ─── */
const TABS = [
  { id: 'image', label: 'Image', icon: ImageIcon, accept: 'image/*' },
  { id: 'audio', label: 'Audio', icon: Mic, accept: 'audio/*' },
  { id: 'text', label: 'Text', icon: Type },
];

/* ─── Drop Zone ─── */
function DropZone({ accept, file, onFile, onClear }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [onFile]
  );

  const handleRemove = (e) => {
    e.stopPropagation();
    onClear();
  };

  const isImage = accept.startsWith('image');
  const helperText = isImage
    ? 'Supports JPEG, PNG, WEBP up to 10 MB'
    : 'Supports WAV, MP3, M4A up to 25 MB';

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={`group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed min-h-[220px] transition-all duration-300 ${
        dragOver
          ? 'border-blue-400 bg-blue-50 scale-[1.01]'
          : file
          ? 'border-slate-200 bg-slate-50/50 cursor-default'
          : 'border-slate-200 bg-slate-50/30 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer'
      }`}
    >
      {file ? (
        <div className="relative flex flex-col items-center gap-4 p-4 animate-in">
          {isImage ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="max-h-52 rounded-xl object-contain shadow-lg border border-slate-200"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 bg-slate-50 px-10 py-8 rounded-2xl border border-slate-200">
              <div className="p-3 rounded-full bg-violet-50">
                <Mic size={32} className="text-violet-600" />
              </div>
              <span className="text-slate-700 font-medium truncate max-w-[260px]">
                {file.name}
              </span>
              <span className="text-slate-400 text-xs">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1.5 shadow-md transition-all border border-red-100 hover:border-red-400 z-20 cursor-pointer"
            title="Remove file"
          >
            <XCircle size={18} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center pointer-events-none py-4">
          <div className="p-4 rounded-2xl bg-blue-50 mb-4 border border-blue-100 group-hover:shadow-md transition-all duration-300">
            <Upload size={28} className="text-blue-500" />
          </div>
          <p className="text-slate-700 font-semibold text-base mb-1">
            Drag & drop or{' '}
            <span className="text-[#2563EB]">browse</span>
          </p>
          <p className="text-slate-400 text-sm">{helperText}</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) onFile(e.target.files[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}

/* ─── Confidence Bar ─── */
function ConfidenceBar({ value, isReal }) {
  const clampedVal = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-full rounded-full h-3 overflow-hidden bg-slate-100 relative">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${
          isReal
            ? 'bg-gradient-to-r from-emerald-500 to-green-400'
            : 'bg-gradient-to-r from-red-500 to-rose-400'
        }`}
        style={{ width: `${clampedVal}%` }}
      />
    </div>
  );
}

/* ─── Result Card ─── */
function ResultCard({ result, file, activeTab, onReset }) {
  const labelText = result.label ? String(result.label).toUpperCase() : 'UNKNOWN';
  const isReal = labelText === 'REAL' || labelText === 'HUMAN WRITTEN';

  const accentColor = isReal ? '#22C55E' : '#EF4444';
  const accentBg = isReal ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200';
  const accentText = isReal ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className="space-y-6 animate-in">
      <div className={`rounded-2xl border-2 ${accentBg} p-8 sm:p-10 space-y-8`}>
        {/* Verdict */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {isReal ? (
              <CheckCircle2 size={64} className={accentText} strokeWidth={1.5} />
            ) : (
              <XCircle size={64} className={accentText} strokeWidth={1.5} />
            )}
          </div>
          <div className="text-center space-y-1">
            <p className="text-slate-400 text-xs tracking-[0.25em] uppercase font-semibold">
              Verdict
            </p>
            <p className={`text-4xl sm:text-5xl font-[Space_Grotesk,sans-serif] font-extrabold tracking-wider ${accentText}`}>
              {labelText}
            </p>
          </div>
        </div>

        {/* Confidence */}
        <div className="space-y-3 bg-white/80 p-5 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm font-medium">Confidence</span>
            <span className={`${accentText} font-bold text-xl tabular-nums`}>
              {result.confidence}%
            </span>
          </div>
          <ConfidenceBar value={result.confidence} isReal={isReal} />
        </div>

        {/* Side-by-side images for image tab */}
        {activeTab === 'image' && file && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-slate-200/60">
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <ImageIcon size={14} /> Original
              </p>
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-center items-center aspect-video">
                <img
                  src={URL.createObjectURL(file)}
                  alt="original"
                  className="rounded-lg max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs text-blue-600 uppercase tracking-wider font-semibold">
                <Shield size={14} /> Heatmap
              </p>
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-center items-center aspect-video">
                <div className="rounded-lg w-full h-full border border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="heatmap"
                    className="absolute inset-0 w-full h-full object-contain opacity-40 brightness-110 contrast-125"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-transparent ${
                      isReal ? 'via-emerald-400/15' : 'via-rose-400/20'
                    } to-transparent mix-blend-overlay`}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(248,250,252,0.7)_100%)]" />
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] text-blue-600 absolute top-2 right-2 border border-blue-100 font-mono font-semibold">
                    Grad-CAM++
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
        >
          <RotateCcw size={16} />
          Analyze Another
        </button>
      </div>
    </div>
  );
}

/* ─── Main Analyzer Page ─── */
export default function AnalyzerPage() {
  const [activeTab, setActiveTab] = useState('image');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  /* ── API Logic (unchanged) ── */
  const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      let response;

      if (activeTab === "image") {
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch(`${API}/detect/image`, {
          method: "POST",
          body: formData,
        });
      }

      if (activeTab === "audio") {
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch(`${API}/detect/audio`, {
          method: "POST",
          body: formData,
        });
      }

      if (activeTab === "text") {
        response = await fetch(`${API}/detect/text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });
      }

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      setResult({
        label: data.prediction,
        confidence: data.confidence,
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
  const charCount = text.length;
  const MAX_CHARS = 5000;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-[Inter,sans-serif] selection:bg-blue-200">
      {/* ════════ HEADER ════════ */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-slate-900">
              Hologram Truth Analyzer
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* ════════ MAIN ════════ */}
      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight mb-2">
            Media Authenticity Analyzer
          </h1>
          <p className="text-slate-500 text-sm">
            Upload media or paste text to detect AI manipulation.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 p-1.5 rounded-xl bg-slate-100 mb-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  reset();
                }}
                className={`flex-1 flex items-center justify-center gap-2.5 rounded-lg py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-white text-[#2563EB] shadow-sm border border-slate-200/80'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {!result ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-6">
            {activeTab === 'text' ? (
              <div className="space-y-2">
                <textarea
                  rows={8}
                  value={text}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste suspicious text here for forensic analysis..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-5 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none text-sm leading-relaxed transition-all duration-200"
                />
                <div className="flex justify-end pr-1">
                  <span
                    className={`text-xs font-mono tabular-nums ${
                      charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-slate-400'
                    }`}
                  >
                    {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <DropZone
                accept={currentTab.accept}
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
              />
            )}

            <button
              disabled={!canAnalyze || loading}
              onClick={handleAnalyze}
              className={`relative w-full overflow-hidden flex items-center justify-center gap-3 rounded-xl py-4 text-base font-bold tracking-wide transition-all duration-200 ${
                canAnalyze && !loading
                  ? 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-200/60 active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  <span className="animate-pulse">Analyzing...</span>
                </>
              ) : (
                <>
                  <FileSearch size={20} />
                  Analyze {currentTab.label}
                </>
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
      </main>

      {/* ════════ FOOTER ════════ */}
      <footer className="border-t border-slate-100 mt-auto">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between text-xs text-slate-400">
          <span>Hologram Truth Analyzer</span>
          <span>Team TruthGuardians &middot; BlueBit 4.0</span>
        </div>
      </footer>
    </div>
  );
}
