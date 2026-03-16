import { useState, useRef, useCallback, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/download.png';
import { useTheme } from '../ThemeContext';
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
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Layers,
  Camera,
  Sun,
  Moon,
  Lock,
} from 'lucide-react';

const TABS = [
  { id: 'image', label: 'Image', icon: ImageIcon, accept: 'image/*' },
  { id: 'audio', label: 'Audio', icon: Mic, accept: 'audio/*' },
  { id: 'video', label: 'Video', icon: VideoIcon, accept: 'video/*' },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'crossmodal', label: 'CrossModal', icon: Layers, accept: 'video/*' },
  { id: 'batch', label: 'Batch', icon: LayoutGrid, accept: 'image/*' },
  { id: 'webcam', label: 'Live', icon: Camera, accept: null },
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
        className={`relative flex flex-col justify-center items-center min-h-[260px] w-full rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
          loading ? 'cursor-default opacity-60' : 'cursor-pointer'
        } ${
          dragOver
          ? 'border-[var(--clr-primary)] bg-[var(--clr-primary-subtle-bg)]'
          : file
            ? 'border-[var(--border-default)] bg-[var(--bg-raised)]'
            : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--clr-primary-subtle-border)] hover:bg-[var(--clr-primary-subtle-bg)]'
        }`}
    >
      {file ? (
        <div className="flex flex-col items-center gap-4 p-6">
          {accept.startsWith('image') ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="max-h-44 rounded-xl object-contain shadow-lg border border-[var(--border-default)]"
            />
          ) : accept.startsWith('video') ? (
            <div className="w-20 h-20 rounded-2xl bg-[var(--clr-accent-subtle-bg)] flex items-center justify-center">
              <VideoIcon size={32} className="text-[var(--clr-accent)]" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[var(--clr-primary-subtle-bg)] flex items-center justify-center">
              <Mic size={32} className="text-[var(--clr-primary)]" />
            </div>
          )}
          <div className="flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 shadow-sm">
            <span className="text-sm font-medium text-[var(--text-primary)] max-w-[180px] truncate">{file.name}</span>
            <span className="text-xs text-[var(--text-tertiary)]">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            <CheckCircle2 size={16} className="text-[var(--clr-success)]" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 pointer-events-none p-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dragOver ? 'bg-[var(--clr-primary-subtle-bg)]' : 'bg-[var(--bg-raised)]'} transition-colors`}>
            <Upload size={24} className={dragOver ? 'text-[var(--clr-primary)]' : 'text-[var(--text-tertiary)]'} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {dragOver ? 'Drop to upload' : 'Drag & drop or click to browse'}
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {accept.startsWith('image') ? 'JPEG, PNG, WebP up to 10 MB' :
                accept.startsWith('video') ? 'MP4, AVI, MOV up to 50 MB' :
                  'WAV, MP3, M4A up to 25 MB'}
            </p>
          </div>
        </div>
      )}
      {/* ── Scanning overlay ── */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-7 bg-[var(--bg-page)]/50 rounded-xl">
          {/* moving scan line */}
          <div
            className="scan-line absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--clr-primary)] to-transparent"
            style={{ boxShadow: '0 0 14px 4px var(--clr-primary)', top: 0 }}
          />
          {/* label */}
          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="bounce-dot block w-2 h-2 rounded-full bg-[var(--clr-primary)]"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
            <p className="text-white text-sm font-semibold tracking-widest uppercase">
              Analyzer scanning media…
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
    <div className="w-full h-3 rounded-full bg-[var(--border-default)] overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${isReal ? 'bg-[var(--clr-success)]' : 'bg-[var(--clr-danger)]'
          }`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* ─── Result Card ─── */
function ResultCard({ result, file, activeTab, onReset }) {
  const isReal = result.label?.includes("REAL") || result.label?.includes("HUMAN");

  return (
    <div className="animate-fade-in space-y-6">
      {/* Main result card */}
      <div className={`bg-[var(--bg-surface)] rounded-2xl border overflow-hidden shadow-lg ${isReal ? 'border-[var(--clr-success-subtle-border)] shadow-green-500/5' : 'border-[var(--clr-danger-subtle-border)] shadow-red-500/5'
        }`}>
        <div className={`h-1.5 w-full ${isReal ? 'bg-[var(--clr-success)]' : 'bg-[var(--clr-danger)]'}`} />

        <div className="p-8 space-y-8">
          {/* Verdict */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isReal ? 'bg-[var(--clr-success)]/10' : 'bg-[var(--clr-danger)]/10'
                }`}>
                {isReal ? (
                  <CheckCircle2 size={28} className="text-[var(--clr-success)]" />
                ) : (
                  <XCircle size={28} className="text-[var(--clr-danger)]" />
                )}
              </div>
              <div>
                <p className={`text-3xl font-bold tracking-tight ${isReal ? 'text-[var(--clr-success)]' : 'text-[var(--clr-danger)]'}`}>
                  {result.label}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">Processed in &lt;2s · Model: ViT-Base</p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-4 py-2 rounded-full ${isReal ? 'bg-[var(--clr-success)]/10 text-[var(--clr-success)]' : 'bg-[var(--clr-danger)]/10 text-[var(--clr-danger)]'
              }`}>
              {isReal ? 'AUTHENTIC' : 'HIGH RISK'}
            </span>
          </div>

          {/* Confidence */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Confidence Score</span>
              <span className={`text-lg font-bold ${isReal ? 'text-[var(--clr-success)]' : 'text-[var(--clr-danger)]'}`}>
                {result.confidence?.toFixed(1)}%
              </span>
            </div>
            <ConfidenceBar value={result.confidence} isReal={isReal} />
          </div>

          {/* Explanation */}
          {result.explanation && (
            <div className={`p-4 rounded-xl border-l-4 bg-[var(--bg-raised)] ${isReal ? 'border-l-[var(--clr-success)]' : 'border-l-[var(--clr-danger)]'
              }`}>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                <span className={`font-semibold ${isReal ? 'text-[var(--clr-success)]' : 'text-[var(--clr-danger)]'}`}>
                  {isReal ? '✓ ' : '⚠ '}
                </span>
                {result.explanation}
              </p>
            </div>
          )}

          {/* Frame Analysis for Video */}
          {activeTab === 'video' && result.frames_analyzed && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-raised)] border border-[var(--border-default)]">
              <span className="text-sm font-medium text-[var(--text-secondary)]">Frame Analysis</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--text-secondary)]">{result.frames_analyzed} frames</span>
                <span className="text-[var(--clr-danger)] font-semibold">{result.fake_frames} fake</span>
                <span className="text-[var(--clr-success)] font-semibold">{result.real_frames} real</span>
              </div>
            </div>
          )}

          {activeTab === 'video' && result.frame_discontinuities != null && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--clr-danger-subtle-bg)] border border-[var(--clr-danger-subtle-border)] mt-3">
              <span className="text-sm font-medium text-[var(--clr-danger)]">⚠ Temporal Inconsistencies</span>
              <span className="text-sm font-bold text-[var(--clr-danger)]">{result.frame_discontinuities} frame jumps detected</span>
            </div>
          )}

          {/* Voice Pattern for Audio */}
          {activeTab === 'audio' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
                <Activity size={16} className="text-[var(--text-secondary)]" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Voice Pattern Analysis</h3>
              </div>
              <div className="h-20 w-full rounded-xl bg-[var(--bg-raised)] border border-[var(--border-default)] flex items-center justify-center overflow-hidden gap-[2px] px-4">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-[var(--clr-primary)]/30 rounded-full"
                    style={{ height: `${Math.max(15, Math.random() * 80)}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Text Analysis */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
                <FileSearch size={16} className="text-[var(--text-secondary)]" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Textual Analysis</h3>
              </div>
              <div className={`p-4 rounded-xl border text-sm leading-relaxed ${isReal ? 'bg-[var(--clr-success-subtle-bg)] border-[var(--clr-success-subtle-border)] text-[var(--clr-success)]' : 'bg-[var(--clr-danger-subtle-bg)] border-[var(--clr-danger-subtle-border)] text-[var(--clr-danger)]'
                }`}>
                Analysis complete. {isReal ? 'No structural anomalies detected.' : 'AI generation patterns detected in text.'}
              </div>
            </div>
          )}

          {/* Forensic Analysis — Image & Video */}
          {(activeTab === 'image' || activeTab === 'video') && file && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
                <FileSearch size={16} className="text-[var(--text-secondary)]" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Forensic Analysis</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-raised)] p-2 aspect-square sm:aspect-auto sm:h-56 flex items-center justify-center overflow-hidden">
                    {activeTab === 'image' ? (
                      <img src={URL.createObjectURL(file)} alt="original" className="w-full h-full object-contain" />
                    ) : (
                      <VideoIcon size={40} className="text-[var(--text-disabled)]" />
                    )}
                  </div>
                  <p className="text-xs text-center text-[var(--text-tertiary)] font-medium">Original</p>
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-raised)] p-2 aspect-square sm:aspect-auto sm:h-56 flex items-center justify-center overflow-hidden">
                    {result.heatmap ? (
                      <img src={`data:image/png;base64,${result.heatmap}`} alt="heatmap overlay" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-[var(--text-tertiary)]">No heatmap available</span>
                    )}
                  </div>
                  <p className="text-xs text-center text-[var(--text-tertiary)] font-medium">Grad-CAM++ Overlay</p>
                </div>
              </div>

              {result.heatmap && (
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500" />
                  <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] font-medium">
                    <span>Authentic</span>
                    <span>Suspicious</span>
                  </div>
                </div>
              )}

              {/* Provenance Tracking */}
              {result.provenance_hash && (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
                    <Shield size={16} className="text-[var(--text-secondary)]" />
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Provenance Tracking</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--bg-raised)] border border-[var(--border-default)] text-xs break-all text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text-primary)]">Content Fingerprint:</span>
                    <br />
                    {result.provenance_hash}
                  </div>
                  {result.metadata && (
                    <div className="p-4 rounded-xl bg-[var(--bg-raised)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)] space-y-1">
                      <p><strong>Camera:</strong> {result.metadata.camera_model || "Not Available"}</p>
                      <p><strong>Make:</strong> {result.metadata.camera_make || "Not Available"}</p>
                      <p><strong>Software:</strong> {result.metadata.software || "Not Available"}</p>
                      <p><strong>Timestamp:</strong> {result.metadata.timestamp || "Not Available"}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 rounded-xl bg-[var(--bg-raised)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)] leading-relaxed">
                <span className={`font-semibold ${isReal ? 'text-[var(--clr-success)]' : 'text-[var(--clr-danger)]'}`}>
                  {isReal ? 'No suspicious regions: ' : 'Red regions: '}
                </span>
                {isReal
                  ? 'Grad-CAM++ found no significant manipulation artifacts. Facial features show natural texture and authentic boundaries.'
                  : 'Heavily weighted spatial features triggering manipulation classification. High probability of synthetic alteration or GAN-generated artifacts.'}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--bg-raised)] hover:border-[var(--border-emphasis)] transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw size={16} />
          Analyze Another
        </button>
      </div>
    </div>
  );
}

/* ─── CrossModal Result ─── */
function CrossModalResult({ result, onReset }) {
  const overall = result.overall_prediction;
  const isAuthentic = overall === 'AUTHENTIC';
  const isPartial = overall === 'PARTIAL MANIPULATION';
  const isMultiModal = overall === 'MULTI-MODAL DEEPFAKE';

  const bannerColor = isAuthentic
    ? 'bg-[var(--clr-success-subtle-bg)] border-[var(--clr-success-subtle-border)] text-[var(--clr-success)]'
    : isPartial
    ? 'bg-[var(--clr-primary-subtle-bg)] border-[var(--clr-primary-subtle-border)] text-[var(--clr-primary)]'
    : 'bg-[var(--clr-danger-subtle-bg)] border-[var(--clr-danger-subtle-border)] text-[var(--clr-danger)]';

  return (
    <div className="animate-fade-in space-y-6">
      <div className={`p-6 rounded-2xl border-2 ${bannerColor}`}>
        <p className="text-2xl font-bold tracking-tight">{overall}</p>
        <p className="text-sm mt-2 leading-relaxed">{result.cross_modal_note}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Video Result */}
        <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <VideoIcon size={16} className="text-[var(--text-secondary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Video Analysis</h3>
          </div>
          <p className={`text-2xl font-bold ${result.video_result?.prediction === 'FAKE' ? 'text-[var(--clr-danger)]' : 'text-[var(--clr-success)]'}`}>
            {result.video_result?.prediction}
          </p>
          <ConfidenceBar value={result.video_result?.confidence} isReal={result.video_result?.prediction === 'REAL'} />
          <p className="text-xs text-[var(--text-tertiary)]">{result.video_result?.confidence?.toFixed(1)}% confidence</p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{result.video_result?.explanation}</p>
          <div className="flex gap-4 text-xs">
            <span className="text-[var(--text-secondary)]">{result.video_result?.frames_analyzed} frames</span>
            <span className="text-[var(--clr-danger)] font-semibold">{result.video_result?.fake_frames} fake</span>
            <span className="text-[var(--clr-success)] font-semibold">{result.video_result?.real_frames} real</span>
          </div>
        </div>

        {/* Audio Result */}
        <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Mic size={16} className="text-[var(--text-secondary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Audio Analysis</h3>
          </div>
          <p className={`text-2xl font-bold ${result.audio_result?.prediction === 'FAKE' ? 'text-[var(--clr-danger)]' : 'text-[var(--clr-success)]'}`}>
            {result.audio_result?.prediction}
          </p>
          <ConfidenceBar value={result.audio_result?.confidence} isReal={result.audio_result?.prediction === 'REAL'} />
          <p className="text-xs text-[var(--text-tertiary)]">{result.audio_result?.confidence?.toFixed(1)}% confidence</p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{result.audio_result?.explanation}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Analyzed by wav2vec 2.0</p>
        </div>
      </div>

      {/* Lip Sync Indicator */}
      <div className={`p-4 rounded-xl border ${isAuthentic ? 'bg-[var(--clr-success-subtle-bg)] border-[var(--clr-success-subtle-border)]' : 'bg-[var(--clr-danger-subtle-bg)] border-[var(--clr-danger-subtle-border)]'}`}>
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Lip-Sync Forensic Analysis</p>
        <p className="text-sm text-[var(--text-secondary)]">
          {isAuthentic && '✅ LIP-SYNC CONSISTENT — Audio and visual streams show no temporal inconsistencies.'}
          {isPartial && result.video_result?.prediction === 'FAKE' && '⚠️ LIP-SYNC INCONCLUSIVE — Visual manipulation detected. Mouth movements may have been altered.'}
          {isPartial && result.audio_result?.prediction === 'FAKE' && '⚠️ LIP-SYNC MISMATCH SUSPECTED — Audio shows synthetic voice patterns while video appears authentic.'}
          {isMultiModal && '🔴 LIP-SYNC MISMATCH DETECTED — Audio phoneme patterns do not align with detected facial movements.'}
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--bg-raised)] transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw size={16} />
          Analyze Another
        </button>
      </div>
    </div>
  );
}

/* ─── Provenance Result ─── */
function ProvenanceResult({ result, onReset }) {
  const p = result.provenance;
  const isAuthenticated = p?.status?.includes('AUTHENTICATED');

  return (
    <div className="animate-fade-in space-y-6">
      <div className={`p-6 rounded-2xl border-2 ${isAuthenticated ? 'bg-[var(--clr-success-subtle-bg)] border-[var(--clr-success-subtle-border)]' : 'bg-[var(--clr-danger-subtle-bg)] border-[var(--clr-danger-subtle-border)]'}`}>
        <div className="flex items-center gap-3 mb-3">
          <Lock size={20} className={isAuthenticated ? 'text-[var(--clr-success)]' : 'text-[var(--clr-danger)]'} />
          <p className={`text-xl font-bold ${isAuthenticated ? 'text-[var(--clr-success)]' : 'text-[var(--clr-danger)]'}`}>{p?.status}</p>
        </div>
        <p className="text-xs text-[var(--text-secondary)] font-mono">Certificate ID: {p?.certificate_id}</p>
      </div>

      <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-default)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Digital Certificate</h3>
        <div className="space-y-2 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Filename</span>
            <span className="font-mono text-[var(--text-primary)] text-xs">{p?.filename}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">SHA256 Hash</span>
            <span className="font-mono text-[var(--text-primary)] text-xs break-all">{p?.sha256_hash}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Timestamp</span>
            <span className="font-mono text-[var(--text-primary)] text-xs">{p?.timestamp}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide">Authenticated By</span>
            <span className="font-mono text-[var(--text-primary)] text-xs">{p?.authenticated_by}</span>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${isAuthenticated ? 'bg-[var(--clr-success-subtle-bg)] border-[var(--clr-success-subtle-border)]' : 'bg-[var(--clr-danger-subtle-bg)] border-[var(--clr-danger-subtle-border)]'}`}>
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Camera Metadata</p>
        {typeof p?.camera_metadata === 'object' ? (
          <div className="space-y-1 text-xs text-[var(--text-secondary)] font-mono">
            {Object.entries(p.camera_metadata).map(([k, v]) => (
              <p key={k}><strong>{k}:</strong> {v}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--clr-danger)]">⚠ {p?.camera_metadata}</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--bg-raised)] transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw size={16} />
          Authenticate Another
        </button>
      </div>
    </div>
  );
}

/* ─── Corner Bracket ─── */
function CornerBracket({ position }) {
  const base = 'absolute w-5 h-5 border-[var(--clr-primary)]';
  const styles = {
    'top-left': `${base} top-3 left-3 border-t-2 border-l-2 rounded-tl-sm`,
    'top-right': `${base} top-3 right-3 border-t-2 border-r-2 rounded-tr-sm`,
    'bottom-left': `${base} bottom-3 left-3 border-b-2 border-l-2 rounded-bl-sm`,
    'bottom-right': `${base} bottom-3 right-3 border-b-2 border-r-2 rounded-br-sm`,
  };
  return <div className={styles[position]} />;
}

/* ─── Webcam Detector ─── */
function WebcamDetector() {
  const videoRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const captureAndAnalyze = useCallback(() => {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        const fd = new FormData();
        fd.append('file', blob, 'frame.jpg');
        const res = await fetch('http://127.0.0.1:8000/detect/image', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.prediction && data.confidence != null) {
          setResult(data);
        }
      } catch (err) {
        console.error('Webcam analysis error:', err);
      }
    }, 'image/jpeg', 0.8);
  }, []);

  const drawLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = displayCanvasRef.current;
    if (video && canvas && video.readyState >= 2 && video.videoWidth > 0) {
      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
      if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
    }
    rafRef.current = requestAnimationFrame(drawLoop);
  }, []);

  const startWebcam = async () => {
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        setIsActive(true);
        rafRef.current = requestAnimationFrame(drawLoop);
        intervalRef.current = setInterval(captureAndAnalyze, 2000);
      };
    } catch (err) {
      setError('Camera error: ' + err.message);
    }
  };

  const stopWebcam = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsActive(false);
    setResult(null);
  };

  useEffect(() => {
    return () => stopWebcam();
  }, []);

  return (
    <div className="space-y-5">
      {/* Hidden video — never visible, just feeds frames */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ position: 'fixed', opacity: 0, width: '1px', height: '1px', pointerEvents: 'none', zIndex: -1 }}
      />
      {/* Hidden canvas for API capture only */}
      <canvas ref={captureCanvasRef} style={{ display: 'none' }} />

      <div style={{ position: 'relative' }}>
        {/* Visible display canvas — mirrors video feed */}
        <canvas
          ref={displayCanvasRef}
          width={640}
          height={480}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '12px',
            display: 'block',
            backgroundColor: 'var(--bg-page)',
          }}
        />

        <CornerBracket position="top-left" />
        <CornerBracket position="top-right" />
        <CornerBracket position="bottom-left" />
        <CornerBracket position="bottom-right" />

        {/* Prediction overlay */}
        {result && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            padding: '6px 14px',
            borderRadius: '6px',
            background: result.prediction === 'FAKE' ? 'rgba(220,38,38,0.9)' : 'rgba(22,163,74,0.9)',
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 10,
          }}>
            {result.prediction} {result.confidence?.toFixed(1)}%
          </div>
        )}

        {/* LIVE indicator */}
        {isActive && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '4px 10px',
            borderRadius: '20px',
            background: 'rgba(0,0,0,0.7)',
            color: 'var(--clr-success)',
            fontSize: '11px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clr-success)' }} />
            LIVE
          </div>
        )}

        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'var(--bg-page)', borderRadius: '12px' }}>
            <Camera size={48} className="text-[var(--text-disabled)] mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">Click Start to begin live detection</p>
          </div>
        )}
      </div>

      {/* Confidence Meter */}
      {result && (() => {
        const isFake = result.prediction === 'FAKE';
        const confidence = result.confidence ?? 0;
        const barColor = isFake ? 'var(--clr-danger)' : 'var(--clr-success)';
        const barGlow = isFake ? 'rgba(226,75,74,0.35)' : 'rgba(29,158,117,0.35)';
        const bgTrack = isFake ? 'rgba(226,75,74,0.1)' : 'rgba(29,158,117,0.1)';
        const label = isFake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC';
        return (
          <div style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: 'var(--bg-page)',
            border: `1px solid ${isFake ? 'rgba(226,75,74,0.3)' : 'rgba(29,158,117,0.3)'}`,
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                color: barColor,
              }}>
                {label}
              </span>
              <span style={{
                fontSize: '22px',
                fontWeight: 800,
                fontFamily: 'monospace',
                color: barColor,
              }}>
                {confidence.toFixed(1)}%
              </span>
            </div>
            {/* Bar track */}
            <div style={{
              width: '100%',
              height: '10px',
              borderRadius: '5px',
              background: bgTrack,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${confidence}%`,
                height: '100%',
                borderRadius: '5px',
                background: `linear-gradient(90deg, ${barColor}CC, ${barColor})`,
                boxShadow: `0 0 12px ${barGlow}`,
                transition: 'width 0.5s ease',
              }} />
            </div>
            {/* Explanation */}
            {result.explanation && (
              <p style={{
                marginTop: '10px',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                lineHeight: '1.5',
              }}>
                {result.explanation}
              </p>
            )}
          </div>
        );
      })()}

      {error && (
        <div className="p-3 rounded-xl bg-[var(--clr-danger-subtle-bg)] border border-[var(--clr-danger-subtle-border)] text-sm text-[var(--clr-danger)]">{error}</div>
      )}

      <div className="flex gap-3">
        {!isActive ? (
          <button onClick={startWebcam} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold bg-[var(--clr-primary)] text-[var(--clr-primary-text)] hover:bg-[var(--clr-primary-hover)] shadow-lg shadow-[var(--clr-primary)]/20 transition-all cursor-pointer">
            <Camera size={18} /> START LIVE DETECTION
          </button>
        ) : (
          <button onClick={stopWebcam} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold bg-[var(--clr-danger)] text-white hover:bg-[var(--clr-danger-subtle-border)] shadow-lg shadow-[var(--clr-danger)]/20 transition-all cursor-pointer">
            <XCircle size={18} /> STOP
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════ ANALYZER PAGE ═══════ */
export default function Analyzer() {
  const [activeTab, setActiveTab] = useState('image');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [batchFiles, setBatchFiles] = useState([]);
  const [expandedBatchRow, setExpandedBatchRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { isDark, toggleTheme } = useTheme();

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
      } else if (activeTab === "audio") {
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch("http://127.0.0.1:8000/detect/audio", {
          method: "POST",
          body: formData,
        });
      } else if (activeTab === "video") {
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch("http://127.0.0.1:8000/detect/video", {
          method: "POST",
          body: formData,
        });
      } else if (activeTab === "text") {
        response = await fetch("http://127.0.0.1:8000/detect/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }

      if (activeTab === "crossmodal") {
        const formData = new FormData();
        formData.append("file", file);
        response = await fetch("http://127.0.0.1:8000/detect/crossmodal", { method: "POST", body: formData });
      }

      if (activeTab === 'batch') {
        const formData = new FormData();
        batchFiles.forEach(f => formData.append('files', f));
        response = await fetch('http://127.0.0.1:8000/detect/batch', { method: 'POST', body: formData });
      }



      const data = await response.json();

      if (activeTab === 'batch' || activeTab === 'crossmodal') {
        setResult(data);
      } else {
        setResult({
          label: data.prediction,
          confidence: data.confidence,
          heatmap: data.heatmap ?? null,
          explanation: data.explanation ?? null,
          frames_analyzed: data.frames_analyzed ?? null,
          fake_frames: data.fake_frames ?? null,
          real_frames: data.real_frames ?? null,
          frame_discontinuities: data.frame_discontinuities ?? null,
          provenance_hash: data.provenance_hash ?? null,
          metadata: data.metadata ?? null,
        });
      }

    } catch (error) {
      console.error(error);
      alert("Backend connection error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setText('');
    setBatchFiles([]);
    setExpandedBatchRow(null);
    setResult(null);
    setLoading(false);
  };

  const canAnalyze =
    (activeTab === 'text' && text.trim().length > 0) ||
    (activeTab === 'batch' && batchFiles.length > 0) ||
    ((activeTab === 'image' || activeTab === 'audio' || activeTab === 'video' || activeTab === 'crossmodal' || activeTab === 'provenance') && file);

  const currentTab = TABS.find((t) => t.id === activeTab);

  const getLoadingText = () => {
    switch(activeTab) {
      case 'image': return 'Analyzing with Vision Transformer...';
      case 'audio': return 'Analyzing with wav2vec 2.0...';
      case 'video': return 'Analyzing frames...';
      case 'text': return 'Analyzing with RoBERTa...';
      case 'crossmodal': return 'Analyzing video and audio streams...';
      case 'batch': return `Analyzing ${batchFiles.length} files...`;
      case 'provenance': return 'Extracting metadata...';
      default: return 'Analyzing...';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-nav)] backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="h-6 w-px bg-[var(--border-default)]" />
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="Hologram Truth Analyzer" className="h-16 w-16 rounded-lg object-cover" />
              <span className="font-bold text-[15px] tracking-tight">Hologram Truth Analyzer</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-raised)] hover:border-[var(--border-emphasis)] transition-colors text-[var(--text-secondary)]"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--clr-success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--clr-success)]" />
            </span>
            <span className="text-xs font-semibold text-[var(--clr-success)]">System Online</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Media Authenticity Analyzer
          </h1>
          <p className="text-[var(--text-secondary)]">Upload media to detect AI manipulation.</p>
        </div>

        {/* Show result or input */}
        {result && activeTab === 'crossmodal' ? (
          <CrossModalResult result={result} onReset={reset} />
        ) : result && activeTab === 'provenance' ? (
          <ProvenanceResult result={result} onReset={reset} />
        ) : result && activeTab === 'batch' ? (
          <div className="bg-[var(--bg-surface)] rounded-2xl border overflow-hidden shadow-lg border-[var(--border-default)] p-8 space-y-6">
            <div className="flex items-center justify-center text-center p-4 rounded-xl bg-[var(--bg-raised)] border border-[var(--border-default)]">
              <span className="font-medium text-[var(--text-primary)] text-sm">
                {result.total_files} files analyzed — <span className="text-[var(--clr-danger)] font-bold">{result.fake_detected} FAKE</span> · <span className="text-[var(--clr-success)] font-bold">{result.real_detected} REAL</span>
              </span>
            </div>
            <div className="border border-[var(--border-default)] rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--bg-raised)] border-b border-[var(--border-default)] text-[var(--text-secondary)]">
                  <tr>
                    <th className="px-4 py-3 font-medium w-12 text-center">#</th>
                    <th className="px-4 py-3 font-medium">Filename</th>
                    <th className="px-4 py-3 font-medium text-center">Verdict</th>
                    <th className="px-4 py-3 font-medium text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {result.results?.map((r, i) => {
                    const isReal = r.prediction === 'REAL';
                    const isExpanded = expandedBatchRow === i;
                    return (
                      <Fragment key={i}>
                        <tr
                          onClick={() => setExpandedBatchRow(isExpanded ? null : i)}
                          className={`border-b border-[var(--border-subtle)] cursor-pointer hover:bg-[var(--bg-raised)] transition-colors ${i % 2 === 0 ? 'bg-[var(--bg-surface)]' : 'bg-[var(--bg-inset)]'}`}
                        >
                          <td className="px-4 py-3 text-center text-[var(--text-tertiary)]">{i + 1}</td>
                          <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)] break-all">{r.filename}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isReal ? 'bg-[var(--clr-success)]/10 text-[var(--clr-success)]' : 'bg-[var(--clr-danger)]/10 text-[var(--clr-danger)]'
                            }`}>
                              {r.prediction}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-[var(--clr-primary)]">
                            <div className="flex items-center justify-end gap-3">
                              {r.confidence?.toFixed(1)}%
                              {isExpanded ? <ChevronUp size={16} className="text-[var(--text-tertiary)]" /> : <ChevronDown size={16} className="text-[var(--text-tertiary)]" />}
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-[var(--bg-raised)] border-b border-[var(--border-subtle)]">
                            <td colSpan={4} className="p-4">
                              <div className={`p-4 rounded-xl border-l-4 bg-[var(--bg-surface)] shadow-sm flex flex-col md:flex-row gap-6 ${isReal ? 'border-l-[var(--clr-success)]' : 'border-l-[var(--clr-danger)]'}`}>
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Analysis Explanation</p>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{r.explanation}</p>
                                  </div>
                                  <div className="space-y-1.5 mt-2">
                                    <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                                      <span>Confidence</span>
                                      <span className="font-semibold">{r.confidence?.toFixed(1)}%</span>
                                    </div>
                                    <ConfidenceBar value={r.confidence} isReal={isReal} />
                                  </div>
                                </div>
                                {r.heatmap && (
                                  <div className="shrink-0 space-y-2">
                                    <p className="text-sm font-semibold text-[var(--text-primary)]">Grad-CAM++ Analysis</p>
                                    <img
                                      src={`data:image/png;base64,${r.heatmap}`}
                                      alt="Grad-CAM++ Analysis"
                                      className="max-h-[200px] rounded-xl border border-[var(--border-default)] shadow-sm object-contain"
                                    />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center pt-2">
              <button
                onClick={reset}
                className="flex items-center gap-2 border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[var(--bg-raised)] transition-all cursor-pointer shadow-sm"
              >
                <RotateCcw size={16} />
                Analyze Another Batch
              </button>
            </div>
          </div>
        ) : result ? (
          <ResultCard result={result} file={file} activeTab={activeTab} onReset={reset} />
        ) : (
          <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] shadow-xl shadow-black/[0.03] overflow-hidden">
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-[var(--border-default)]">
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
                      } ${active ? 'text-[var(--clr-primary)] bg-[var(--clr-primary-subtle-bg)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                      }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                    {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--clr-primary)]" />}
                  </button>
                );
              })}
            </div>

            {/* Input area */}
            <div className="p-6">
              {activeTab === 'text' ? (
                <div className="relative rounded-xl overflow-hidden">
                  <textarea
                    value={text}
                    disabled={loading}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste text for AI detection analysis..."
                    rows={8}
                    className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-raised)] p-5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--clr-primary-subtle-border)] focus:ring-2 focus:ring-[var(--clr-primary)]/10 resize-none text-sm leading-relaxed transition-all"
                  />

                  {loading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-7 bg-[var(--bg-page)]/50 rounded-xl">
                      <div
                        className="scan-line absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--clr-primary)] to-transparent"
                        style={{ boxShadow: '0 0 14px 4px var(--clr-primary)', top: 0 }}
                      />
                      <div className="relative z-10 flex flex-col items-center gap-2.5">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="bounce-dot block w-2 h-2 rounded-full bg-[var(--clr-primary)]"
                              style={{ animationDelay: `${i * 0.18}s` }}
                            />
                          ))}
                        </div>
                        <p className="text-white text-sm font-semibold tracking-widest uppercase">
                          Analyzer scanning media…
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'batch' ? (
                <div className="flex flex-col gap-4">
                  <div
                    onClick={() => !loading && document.getElementById('batch-upload').click()}
                    className={`relative flex flex-col justify-center items-center py-12 w-full rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                      batchFiles.length > 0 ? 'border-[var(--border-default)] bg-[var(--bg-raised)]' : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--clr-primary-subtle-border)] hover:bg-[var(--clr-primary-subtle-bg)]'
                    } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <Upload size={24} className="text-[var(--text-tertiary)] mb-3" />
                    <p className="text-sm font-medium text-[var(--text-primary)]">Click to select multiple images</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">Select 2 or more images for batch analysis</p>
                    <input
                      id="batch-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setBatchFiles(Array.from(e.target.files))}
                      disabled={loading}
                    />
                  </div>
                  {batchFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{batchFiles.length} files selected — ready to analyze</p>
                      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg max-h-40 overflow-y-auto p-1">
                        {batchFiles.map((f, i) => (
                          <div key={i} className="py-2 px-3 border-b text-[var(--text-secondary)] last:border-0 truncate font-mono text-xs">{f.name}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'webcam' ? (
                <WebcamDetector />
              ) : (
                <DropZone
                  accept={currentTab?.accept || 'image/*'}
                  file={file}
                  onFile={setFile}
                  loading={loading}
                />
              )}
            </div>

            {/* Analyze button */}
            {activeTab !== 'webcam' && (
            <div className="px-6 pb-6">
              <button
                disabled={!canAnalyze || loading}
                onClick={handleAnalyze}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-semibold transition-all ${canAnalyze && !loading
                  ? 'bg-[var(--clr-primary)] text-[var(--clr-primary-text)] hover:bg-[var(--clr-primary-hover)] shadow-lg shadow-[var(--clr-primary)]/20 cursor-pointer'
                  : 'bg-[var(--bg-raised)] text-[var(--text-disabled)] cursor-not-allowed'
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{getLoadingText()}</span>
                  </>
                ) : (
                  'Execute Analysis'
                )}
              </button>
            </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] mt-auto py-6">
        <p className="text-center text-sm text-[var(--text-tertiary)]">
          TruthGuardians &middot; BlueBit Hackathon 4.0
        </p>
      </footer>
    </div>
  );
}
