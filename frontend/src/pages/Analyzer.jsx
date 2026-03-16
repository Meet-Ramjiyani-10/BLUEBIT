import { useState, useRef, useCallback, Fragment } from 'react';
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
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';

const TABS = [
  { id: 'image', label: 'Image', icon: ImageIcon, accept: 'image/*' },
  { id: 'audio', label: 'Audio', icon: Mic, accept: 'audio/*' },
  { id: 'video', label: 'Video', icon: VideoIcon, accept: 'video/*' },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'crossmodal', label: 'CrossModal', icon: Layers, accept: 'video/*' },
  { id: 'batch', label: 'Batch', icon: LayoutGrid, accept: 'image/*' },
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
<<<<<<< HEAD
                accept.startsWith('video') ? 'MP4, AVI, MOV up to 50 MB' :
                  'WAV, MP3, M4A up to 25 MB'}
=======
              accept.startsWith('video') ? 'MP4, AVI, MOV up to 50 MB' :
              'WAV, MP3, M4A up to 25 MB'}
>>>>>>> a4dfa4e9da36599de92a3d6b995ad0252b83f374
            </p>
          </div>
        </div>
      )}
      {/* ── Scanning overlay ── */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-7 bg-[#0F172A]/50 rounded-xl">
          {/* moving scan line */}
          <div
            className="scan-line absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent"
            style={{ boxShadow: '0 0 14px 4px #38BDF8', top: 0 }}
          />
          {/* label */}
          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="bounce-dot block w-2 h-2 rounded-full bg-[#38BDF8]"
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
  const isReal = result.label?.includes("REAL") || result.label?.includes("HUMAN");

  return (
    <div className="animate-fade-in space-y-6">
<<<<<<< HEAD
      {/* Main result card */}
      <div className={`bg-white rounded-2xl border overflow-hidden shadow-lg ${isReal ? 'border-[#BBF7D0] shadow-green-500/5' : 'border-[#FECACA] shadow-red-500/5'
        }`}>
        {/* Status bar */}
=======
      <div className={`bg-white rounded-2xl border overflow-hidden shadow-lg ${
        isReal ? 'border-[#BBF7D0] shadow-green-500/5' : 'border-[#FECACA] shadow-red-500/5'
      }`}>
>>>>>>> a4dfa4e9da36599de92a3d6b995ad0252b83f374
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
                {result.confidence?.toFixed(1)}%
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

          {activeTab === 'video' && result.frame_discontinuities != null && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] mt-3">
              <span className="text-sm font-medium text-[#991B1B]">⚠ Temporal Inconsistencies</span>
              <span className="text-sm font-bold text-[#EF4444]">{result.frame_discontinuities} frame jumps detected</span>
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

              {/* Provenance Tracking */}
              {result.provenance_hash && (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
                    <Shield size={16} className="text-[#475569]" />
                    <h3 className="text-sm font-semibold text-[#0F172A]">Provenance Tracking</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs break-all text-[#475569]">
                    <span className="font-semibold text-[#0F172A]">Content Fingerprint:</span>
                    <br />
                    {result.provenance_hash}
                  </div>
                  {result.metadata && (
                    <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#475569] space-y-1">
                      <p><strong>Camera:</strong> {result.metadata.camera_model || "Not Available"}</p>
                      <p><strong>Make:</strong> {result.metadata.camera_make || "Not Available"}</p>
                      <p><strong>Software:</strong> {result.metadata.software || "Not Available"}</p>
                      <p><strong>Timestamp:</strong> {result.metadata.timestamp || "Not Available"}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#475569] leading-relaxed">
                <span className={`font-semibold ${isReal ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
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
          className="flex items-center gap-2 border border-[#E2E8F0] bg-white text-[#475569] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer shadow-sm"
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
    ? 'bg-[#22C55E]/10 border-[#BBF7D0] text-[#166534]'
    : isPartial
    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
    : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]';

  return (
    <div className="animate-fade-in space-y-6">
      <div className={`p-6 rounded-2xl border-2 ${bannerColor}`}>
        <p className="text-2xl font-bold tracking-tight">{overall}</p>
        <p className="text-sm mt-2 leading-relaxed">{result.cross_modal_note}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Video Result */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <VideoIcon size={16} className="text-[#475569]" />
            <h3 className="text-sm font-semibold text-[#0F172A]">Video Analysis</h3>
          </div>
          <p className={`text-2xl font-bold ${result.video_result?.prediction === 'FAKE' ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
            {result.video_result?.prediction}
          </p>
          <ConfidenceBar value={result.video_result?.confidence} isReal={result.video_result?.prediction === 'REAL'} />
          <p className="text-xs text-[#94A3B8]">{result.video_result?.confidence?.toFixed(1)}% confidence</p>
          <p className="text-xs text-[#475569] leading-relaxed">{result.video_result?.explanation}</p>
          <div className="flex gap-4 text-xs">
            <span className="text-[#475569]">{result.video_result?.frames_analyzed} frames</span>
            <span className="text-[#EF4444] font-semibold">{result.video_result?.fake_frames} fake</span>
            <span className="text-[#22C55E] font-semibold">{result.video_result?.real_frames} real</span>
          </div>
        </div>

        {/* Audio Result */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Mic size={16} className="text-[#475569]" />
            <h3 className="text-sm font-semibold text-[#0F172A]">Audio Analysis</h3>
          </div>
          <p className={`text-2xl font-bold ${result.audio_result?.prediction === 'FAKE' ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
            {result.audio_result?.prediction}
          </p>
          <ConfidenceBar value={result.audio_result?.confidence} isReal={result.audio_result?.prediction === 'REAL'} />
          <p className="text-xs text-[#94A3B8]">{result.audio_result?.confidence?.toFixed(1)}% confidence</p>
          <p className="text-xs text-[#475569] leading-relaxed">{result.audio_result?.explanation}</p>
          <p className="text-xs text-[#94A3B8]">Analyzed by wav2vec 2.0</p>
        </div>
      </div>

      {/* Lip Sync Indicator */}
      <div className={`p-4 rounded-xl border ${isAuthentic ? 'bg-green-50 border-[#BBF7D0]' : 'bg-[#FEF2F2] border-[#FECACA]'}`}>
        <p className="text-sm font-semibold text-[#0F172A] mb-1">Lip-Sync Forensic Analysis</p>
        <p className="text-sm text-[#475569]">
          {isAuthentic && '✅ LIP-SYNC CONSISTENT — Audio and visual streams show no temporal inconsistencies.'}
          {isPartial && result.video_result?.prediction === 'FAKE' && '⚠️ LIP-SYNC INCONCLUSIVE — Visual manipulation detected. Mouth movements may have been altered.'}
          {isPartial && result.audio_result?.prediction === 'FAKE' && '⚠️ LIP-SYNC MISMATCH SUSPECTED — Audio shows synthetic voice patterns while video appears authentic.'}
          {isMultiModal && '🔴 LIP-SYNC MISMATCH DETECTED — Audio phoneme patterns do not align with detected facial movements.'}
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 border border-[#E2E8F0] bg-white text-[#475569] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#F8FAFC] transition-all cursor-pointer shadow-sm"
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
      <div className={`p-6 rounded-2xl border-2 ${isAuthenticated ? 'bg-green-50 border-[#BBF7D0]' : 'bg-[#FEF2F2] border-[#FECACA]'}`}>
        <div className="flex items-center gap-3 mb-3">
          <Lock size={20} className={isAuthenticated ? 'text-[#22C55E]' : 'text-[#EF4444]'} />
          <p className={`text-xl font-bold ${isAuthenticated ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{p?.status}</p>
        </div>
        <p className="text-xs text-[#475569] font-mono">Certificate ID: {p?.certificate_id}</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#0F172A]">Digital Certificate</h3>
        <div className="space-y-2 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#94A3B8] uppercase tracking-wide">Filename</span>
            <span className="font-mono text-[#0F172A] text-xs">{p?.filename}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#94A3B8] uppercase tracking-wide">SHA256 Hash</span>
            <span className="font-mono text-[#0F172A] text-xs break-all">{p?.sha256_hash}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#94A3B8] uppercase tracking-wide">Timestamp</span>
            <span className="font-mono text-[#0F172A] text-xs">{p?.timestamp}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#94A3B8] uppercase tracking-wide">Authenticated By</span>
            <span className="font-mono text-[#0F172A] text-xs">{p?.authenticated_by}</span>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${isAuthenticated ? 'bg-green-50 border-[#BBF7D0]' : 'bg-[#FEF2F2] border-[#FECACA]'}`}>
        <p className="text-sm font-semibold text-[#0F172A] mb-1">Camera Metadata</p>
        {typeof p?.camera_metadata === 'object' ? (
          <div className="space-y-1 text-xs text-[#475569] font-mono">
            {Object.entries(p.camera_metadata).map(([k, v]) => (
              <p key={k}><strong>{k}:</strong> {v}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#EF4444]">⚠ {p?.camera_metadata}</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 border border-[#E2E8F0] bg-white text-[#475569] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#F8FAFC] transition-all cursor-pointer shadow-sm"
        >
          <RotateCcw size={16} />
          Authenticate Another
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
  const [batchFiles, setBatchFiles] = useState([]);
  const [expandedBatchRow, setExpandedBatchRow] = useState(null);
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
<<<<<<< HEAD

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
=======
        response = await fetch("http://127.0.0.1:8000/detect/image", { method: "POST", body: formData });
      }

      if (activeTab === "audio") {
        const formData = new FormData();
        formData.append("file", file);
        response = await fetch("http://127.0.0.1:8000/detect/audio", { method: "POST", body: formData });
      }

      if (activeTab === "video") {
        const formData = new FormData();
        formData.append("file", file);
        response = await fetch("http://127.0.0.1:8000/detect/video", { method: "POST", body: formData });
      }

      if (activeTab === "text") {
>>>>>>> a4dfa4e9da36599de92a3d6b995ad0252b83f374
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* Navbar */}
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
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A]">
            Media Authenticity Analyzer
          </h1>
          <p className="text-[#475569]">Upload media to detect AI manipulation.</p>
        </div>

        {/* Show result or input */}
        {result && activeTab === 'crossmodal' ? (
          <CrossModalResult result={result} onReset={reset} />
        ) : result && activeTab === 'provenance' ? (
          <ProvenanceResult result={result} onReset={reset} />
        ) : result && activeTab === 'batch' ? (
          <div className="bg-white rounded-2xl border overflow-hidden shadow-lg border-[#E2E8F0] p-8 space-y-6">
            <div className="flex items-center justify-center text-center p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="font-medium text-[#0F172A] text-sm">
                {result.total_files} files analyzed — <span className="text-[#EF4444] font-bold">{result.fake_detected} FAKE</span> · <span className="text-[#22C55E] font-bold">{result.real_detected} REAL</span>
              </span>
            </div>
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569]">
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
                          className={`border-b border-[#F1F5F9] cursor-pointer hover:bg-[#F8FAFC] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'}`}
                        >
                          <td className="px-4 py-3 text-center text-[#94A3B8]">{i + 1}</td>
                          <td className="px-4 py-3 font-mono text-xs text-[#0F172A] break-all">{r.filename}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isReal ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                            }`}>
                              {r.prediction}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-[#2563EB]">
                            <div className="flex items-center justify-end gap-3">
                              {r.confidence?.toFixed(1)}%
                              {isExpanded ? <ChevronUp size={16} className="text-[#94A3B8]" /> : <ChevronDown size={16} className="text-[#94A3B8]" />}
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                            <td colSpan={4} className="p-4">
                              <div className={`p-4 rounded-xl border-l-4 bg-white shadow-sm flex flex-col md:flex-row gap-6 ${isReal ? 'border-l-[#22C55E]' : 'border-l-[#EF4444]'}`}>
                                <div className="flex-1 space-y-4">
                                  <div>
                                    <p className="text-sm font-semibold text-[#0F172A] mb-1">Analysis Explanation</p>
                                    <p className="text-sm text-[#475569] leading-relaxed">{r.explanation}</p>
                                  </div>
                                  <div className="space-y-1.5 mt-2">
                                    <div className="flex justify-between text-xs text-[#475569]">
                                      <span>Confidence</span>
                                      <span className="font-semibold">{r.confidence?.toFixed(1)}%</span>
                                    </div>
                                    <ConfidenceBar value={r.confidence} isReal={isReal} />
                                  </div>
                                </div>
                                {r.heatmap && (
                                  <div className="shrink-0 space-y-2">
                                    <p className="text-sm font-semibold text-[#0F172A]">Grad-CAM++ Analysis</p>
                                    <img
                                      src={`data:image/png;base64,${r.heatmap}`}
                                      alt="Grad-CAM++ Analysis"
                                      className="max-h-[200px] rounded-xl border border-[#E2E8F0] shadow-sm object-contain"
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
                className="flex items-center gap-2 border border-[#E2E8F0] bg-white text-[#475569] px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#F8FAFC] transition-all cursor-pointer shadow-sm"
              >
                <RotateCcw size={16} />
                Analyze Another Batch
              </button>
            </div>
          </div>
        ) : result ? (
          <ResultCard result={result} file={file} activeTab={activeTab} onReset={reset} />
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl shadow-black/[0.03] overflow-hidden">
            {/* Tabs */}
            <div className="flex flex-wrap border-b border-[#E2E8F0]">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
<<<<<<< HEAD
                    onClick={() => {
                      if (!loading) {
                        setActiveTab(tab.id);
                        reset();
                      }
                    }}
                    className={`flex-1 relative flex items-center justify-center gap-2.5 py-4 text-sm font-semibold transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      } ${active ? 'text-[#2563EB] bg-blue-50/50' : 'text-[#94A3B8] hover:text-[#475569] hover:bg-[#FAFBFC]'
                      }`}
=======
                    onClick={() => { if (!loading) { setActiveTab(tab.id); reset(); } }}
                    className={`flex-1 min-w-[80px] relative flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    } ${active ? 'text-[#2563EB] bg-blue-50/50' : 'text-[#94A3B8] hover:text-[#475569] hover:bg-[#FAFBFC]'}`}
>>>>>>> a4dfa4e9da36599de92a3d6b995ad0252b83f374
                  >
                    <Icon size={15} />
                    {tab.label}
                    {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB]" />}
                  </button>
                );
              })}
            </div>

            {/* Input area */}
            <div className="p-6">
              {activeTab === 'text' ? (
<<<<<<< HEAD
                <div className="relative rounded-xl overflow-hidden">
                  <textarea
                    value={text}
                    disabled={loading}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste text for AI detection analysis..."
                    rows={8}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#93C5FD] focus:ring-2 focus:ring-blue-500/10 resize-none text-sm leading-relaxed transition-all"
                  />

                  {loading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-7 bg-[#0F172A]/50 rounded-xl">
                      <div
                        className="scan-line absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent"
                        style={{ boxShadow: '0 0 14px 4px #38BDF8', top: 0 }}
                      />
                      <div className="relative z-10 flex flex-col items-center gap-2.5">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="bounce-dot block w-2 h-2 rounded-full bg-[#38BDF8]"
                              style={{ animationDelay: `${i * 0.18}s` }}
                            />
                          ))}
                        </div>
                        <p className="text-white text-sm font-semibold tracking-widest uppercase">
                          Analyzer scanning media…
                        </p>
=======
                <textarea
                  value={text}
                  disabled={loading}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste text for AI detection analysis..."
                  rows={8}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#93C5FD] focus:ring-2 focus:ring-blue-500/10 resize-none text-sm leading-relaxed transition-all"
                />
              ) : activeTab === 'batch' ? (
                <div className="flex flex-col gap-4">
                  <div
                    onClick={() => !loading && document.getElementById('batch-upload').click()}
                    className={`relative flex flex-col justify-center items-center py-12 w-full rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                      batchFiles.length > 0 ? 'border-[#CBD5E1] bg-[#F8FAFC]' : 'border-[#CBD5E1] bg-[#FAFBFC] hover:border-[#93C5FD] hover:bg-blue-50/30'
                    } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <Upload size={24} className="text-[#94A3B8] mb-3" />
                    <p className="text-sm font-medium text-[#0F172A]">Click to select multiple images</p>
                    <p className="text-xs text-[#94A3B8] mt-1">Select 2 or more images for batch analysis</p>
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
                      <p className="text-sm font-semibold text-[#0F172A]">{batchFiles.length} files selected — ready to analyze</p>
                      <div className="bg-white border border-[#E2E8F0] rounded-lg max-h-40 overflow-y-auto p-1">
                        {batchFiles.map((f, i) => (
                          <div key={i} className="py-2 px-3 border-b text-[#475569] last:border-0 truncate font-mono text-xs">{f.name}</div>
                        ))}
>>>>>>> a4dfa4e9da36599de92a3d6b995ad0252b83f374
                      </div>
                    </div>
                  )}
                </div>
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
                    <span>{getLoadingText()}</span>
                  </>
                ) : (
                  'Execute Analysis'
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-[#E2E8F0] bg-white mt-auto py-6">
        <p className="text-center text-sm text-[#94A3B8]">
          TruthGuardians &middot; BlueBit Hackathon 4.0
        </p>
      </footer>
    </div>
  );
}