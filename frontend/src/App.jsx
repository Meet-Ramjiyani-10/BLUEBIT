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

function DropZone({ accept, file, onFile }) {
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

  const preview = file ? (
    accept.startsWith('image') ? (
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        className="max-h-48 rounded-lg object-contain"
      />
    ) : (
      <div className="flex items-center gap-3 text-gray-300">
        <Mic size={28} />
        <span className="truncate max-w-xs">{file.name}</span>
      </div>
    )
  ) : null;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200 ${
        dragOver
          ? 'border-blue-400 bg-blue-500/10'
          : file
          ? 'border-gray-600 bg-gray-800/60'
          : 'border-gray-600 bg-gray-900/50 hover:border-blue-500/60 hover:bg-gray-800/40'
      }`}
    >
      {file ? (
        preview
      ) : (
        <>
          <Upload size={36} className="text-gray-500" />
          <p className="text-gray-400 text-sm">
            Drag & drop or <span className="text-blue-400 underline">browse</span>
          </p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) onFile(e.target.files[0]);
        }}
      />
    </div>
  );
}

function ConfidenceBar({ value }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 to-blue-400"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ResultCard({ result, file, activeTab, onReset }) {
  const isReal = result.label === 'REAL';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-8 space-y-6 backdrop-blur">
        {/* Verdict */}
        <div className="flex flex-col items-center gap-3">
          {isReal ? (
            <CheckCircle2 size={56} className="text-green-400" />
          ) : (
            <XCircle size={56} className="text-red-500" />
          )}
          <span
            className={`text-4xl font-extrabold tracking-wider ${
              isReal ? 'text-green-400' : 'text-red-500'
            }`}
          >
            {result.label}
          </span>
        </div>

        {/* Confidence */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Confidence</span>
            <span className="text-white font-semibold">{result.confidence}%</span>
          </div>
          <ConfidenceBar value={result.confidence} />
        </div>

        {/* Side-by-side images for Image tab */}
        {activeTab === 'image' && file && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider text-center">
                Original
              </p>
              <img
                src={URL.createObjectURL(file)}
                alt="original"
                className="rounded-lg w-full object-contain max-h-64 border border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider text-center">
                Heatmap
              </p>
              <div className="rounded-lg w-full h-64 border border-gray-700 bg-gradient-to-br from-red-900/40 via-yellow-700/30 to-green-900/30 flex items-center justify-center relative overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt="heatmap"
                  className="absolute inset-0 w-full h-full object-contain opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-yellow-500/20 to-transparent mix-blend-overlay" />
                <span className="text-[10px] text-gray-400 absolute bottom-2 right-2">
                  Grad-CAM++
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="mx-auto flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-5 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
      >
        <RotateCcw size={16} />
        Analyze Another
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

  const handleAnalyze = () => {
    setLoading(true);
    setResult(null);
    // Simulate API call
    setTimeout(() => {
      const isReal = Math.random() > 0.5;
      setResult({
        label: isReal ? 'REAL' : 'FAKE',
        confidence: parseFloat((70 + Math.random() * 28).toFixed(1)),
      });
      setLoading(false);
    }, 2200);
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
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Subtle grid background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield size={28} className="text-blue-500" />
            <h1 className="text-xl font-bold tracking-tight">
              Hologram <span className="text-blue-500">Truth Analyzer</span>
            </h1>
          </div>
          <span className="hidden sm:block text-xs text-gray-500 tracking-wider uppercase">
            Deepfake Detection
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 space-y-8">
        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-gray-900 p-1">
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
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        {!result ? (
          <div className="space-y-6">
            {activeTab === 'text' ? (
              <textarea
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste suspicious text here for analysis..."
                className="w-full rounded-xl border border-gray-700 bg-gray-900/70 p-4 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none text-sm leading-relaxed"
              />
            ) : (
              <DropZone
                accept={currentTab.accept}
                file={file}
                onFile={setFile}
              />
            )}

            <button
              disabled={!canAnalyze || loading}
              onClick={handleAnalyze}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                canAnalyze && !loading
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing…
                </>
              ) : (
                'Analyze'
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

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-600 pt-4">
          Powered by Vision Transformers &amp; wav2vec 2.0 · Team TruthGuardians
        </p>
      </main>
    </div>
  );
}

export default App;
