import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Upload,
  Brain,
  Eye,
  Zap,
  Lock,
  BarChart3,
  Globe,
  ArrowRight,
  ImageIcon,
  Mic,
  Type,
  Sparkles,
  ChevronRight,
  ScanSearch,
  AudioWaveform,
  FileText,
  Flame,
  Video,
  Layers,
  CheckCircle2,
  Crosshair,
  Lightbulb,
  Fingerprint,
  Scissors,
  Timer,
  Search,
  FileCheck,
  GitCompare,
} from 'lucide-react';

/* ─── Data ─── */
const TRUST = [
  { icon: BarChart3, label: '95%+ Accuracy' },
  { icon: Zap, label: 'Sub-2s Inference' },
  { icon: Globe, label: 'Multi-Modal Detection' },
  { icon: Lock, label: 'Privacy First' },
];

/* CHANGE 8 & 9 — updated Step 2 and Step 3 descriptions */
const STEPS = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload Media',
    desc: 'Drag and drop an image, audio clip, or paste text.',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    num: '02',
    icon: Brain,
    title: 'AI Analysis',
    desc: 'Vision Transformers, wav2vec 2.0, and RoBERTa analyze each modality independently, then cross-verify audio against video lip movements for multi-modal deepfake detection.',
    color: 'text-violet-600 bg-violet-50 border-violet-100',
  },
  {
    num: '03',
    icon: Eye,
    title: 'Get Forensic Report',
    desc: 'Receive a REAL or FAKE verdict with confidence score, Grad-CAM++ heatmap, provenance report, partial edit markers, and a plain-language explanation of every manipulation found.',
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
  },
];

/* CHANGE 7 — 4 new cards appended */
const FEATURES = [
  {
    icon: ScanSearch,
    title: 'Deepfake Image Detection',
    desc: 'Detect AI-generated or manipulated images using Vision Transformers trained on large-scale deepfake datasets.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: AudioWaveform,
    title: 'Audio Authenticity Analysis',
    desc: 'Identify synthetic or cloned voice audio with wav2vec 2.0 feature extraction and classification.',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: FileText,
    title: 'AI-Generated Text Detection',
    desc: 'Distinguish human-written text from AI-generated content using fine-tuned RoBERTa classifiers.',
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    icon: Flame,
    title: 'Explainable AI Heatmaps',
    desc: 'Visualize manipulation regions with Grad-CAM++ overlays to understand model decisions.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: Crosshair,
    title: 'Cross-Modal Lip Sync',
    desc: 'Verifies audio-video coherence using phoneme-to-viseme alignment scoring across every frame.',
    color: 'text-rose-600 bg-rose-50',
  },
  {
    icon: Fingerprint,
    title: 'Provenance & Signatures',
    desc: 'Extracts EXIF data, validates C2PA digital signatures, and checks camera sensor fingerprints.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: Scissors,
    title: 'Partial Edit Detection',
    desc: 'Detects removed frames, audio splices, object removal, and color grading with before/after comparison.',
    color: 'text-orange-600 bg-orange-50',
  },
  {
    icon: Layers,
    title: 'Batch Processing',
    desc: 'Queue multiple files across media types and process them simultaneously with a live status dashboard.',
    color: 'text-indigo-600 bg-indigo-50',
  },
];

/* CHANGE 11 — 3 new pills appended */
const TECH = [
  { name: 'Vision Transformers', tag: 'Image' },
  { name: 'wav2vec 2.0', tag: 'Audio' },
  { name: 'RoBERTa', tag: 'Text' },
  { name: 'Grad-CAM++', tag: 'XAI' },
  { name: 'FastAPI', tag: 'Backend' },
  { name: 'React + Vite', tag: 'Frontend' },
  { name: 'Vision Transformer', tag: 'Model' },
  { name: 'wav2vec 2.0', tag: 'Speech' },
  { name: 'C2PA', tag: 'Provenance' },
];

/* CHANGE 6 — "How We Verify It" capability cards data */
const VERIFY_CARDS = [
  {
    icon: Crosshair,
    title: 'Cross-Modal Verification',
    desc: 'Checks if audio phonemes match video lip movements frame by frame using wav2vec 2.0 and facial landmark tracking.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Lightbulb,
    title: 'Explainability Engine',
    desc: 'Visual heatmaps, bounding boxes, and plain-language explanations show exactly why content was flagged.',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: Fingerprint,
    title: 'Provenance Tracking',
    desc: 'Verifies digital signatures, EXIF metadata, and camera PRNU fingerprints to trace content origin.',
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    icon: Scissors,
    title: 'Partial Manipulation Detection',
    desc: 'Finds subtle edits including removed frames, audio splices, and color grading shifts invisible to the naked eye.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: Timer,
    title: 'Real-Time & Batch Processing',
    desc: 'Analyzes images in under 1 second, processes 30-second videos in under 60 seconds, and supports multi-file batch queues.',
    color: 'text-emerald-600 bg-emerald-50',
  },
];

/* CHANGE 12 — walkthrough steps (existing 4 + 3 new) */
const WALKTHROUGH = [
  {
    num: 1,
    title: 'Select media type',
    desc: 'Choose from Image, Audio, Video, Text, or Batch tabs in the analyzer interface.',
  },
  {
    num: 2,
    title: 'Upload your file',
    desc: 'Drag and drop your file or click to browse. Supports JPEG, PNG, WEBP, WAV, MP3, MP4, and plain text.',
  },
  {
    num: 3,
    title: 'Run analysis',
    desc: 'Click "Analyze" and watch the AI process your media through multiple detection models simultaneously.',
  },
  {
    num: 4,
    title: 'Read the verdict',
    desc: 'See the REAL or FAKE classification, confidence percentage, and Grad-CAM++ heatmap overlay on your media.',
  },
  {
    num: 5,
    title: 'View cross-modal verification',
    desc: 'See lip-sync scores, frame-by-frame desync markers, and audio waveform alignment — automatically shown when both video and audio streams are detected.',
  },
  {
    num: 6,
    title: 'Check provenance',
    desc: 'Inspect EXIF metadata, digital signature status, camera fingerprint match, and chain of custody verification for the submitted file.',
  },
  {
    num: 7,
    title: 'Review partial edits',
    desc: 'Compare before/after views, inspect the audio splice waveform, and see every subtle manipulation marked on a timeline with severity levels.',
  },
];

/* ─── Section navigation config ─── */
const SECTIONS = [
  { id: 'section-overview', label: 'Overview' },
  { id: 'section-how-it-works', label: 'How It Works' },
  { id: 'section-capabilities', label: 'Capabilities' },
  { id: 'section-technology', label: 'Technology' },
];

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('section-overview');

  const showSection = (id) => {
    setActiveSection(id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-[Inter,sans-serif] selection:bg-blue-200">
      {/* ════════ NAVBAR ════════ */}
      {/* CHANGE 1 — added "Multi-Modal", "Provenance" links + v2.0 badge */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
              <Shield size={20} className="text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-[15px] font-bold tracking-tight text-slate-900">
                Hologram Truth Analyzer
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                Restoring Digital Trust
              </span>
            </div>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              v2.0 · 5 new capabilities
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium">How it Works</a>
            <a href="#about-detection" className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium">About Detection</a>
            <a href="#multi-modal" className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium">Multi-Modal</a>
            <a href="#provenance" className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium">Provenance</a>
          </div>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-200 active:scale-[0.98]"
          >
            Try Analyzer
            <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* ════════ SECTION NAVIGATION ════════ */}
      <div className="sticky top-[57px] z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
        <div className="mx-auto max-w-6xl px-6 py-2 flex items-center justify-center gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              data-section={s.id}
              onClick={() => showSection(s.id)}
              className={`section-nav-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeSection === s.id
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400 hover:text-slate-600'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 1 — Overview                       */}
      {/* ══════════════════════════════════════════ */}
      <div id="section-overview" style={{ display: activeSection === 'section-overview' ? 'block' : 'none' }}>

        {/* ════════ HERO ════════ */}
        <section className="relative overflow-hidden">
          {/* Subtle gradient orbs */}
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-violet-100/40 blur-[100px] pointer-events-none" />

          <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 flex flex-col items-center text-center">
            {/* CHANGE 2 — hero badge text */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
              <Sparkles size={14} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 tracking-wide">
                AI-Powered · Multi-Modal · Forensic Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-[Space_Grotesk,sans-serif] font-extrabold tracking-tight leading-[1.1] max-w-3xl">
              Detect AI Manipulation{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>

            {/* CHANGE 3 — hero subtext */}
            <p className="mt-6 text-slate-500 text-lg sm:text-xl max-w-2xl leading-relaxed">
              Hologram Truth Analyzer detects manipulated images, audio, video, and AI-generated text — with cross-modal lip-sync verification, provenance tracking, partial edit detection, and frame-by-frame forensic analysis.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link
                to="/analyzer"
                className="group inline-flex items-center gap-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-200/60 active:scale-[0.98]"
              >
                Try Analyzer
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
              >
                Learn how it works
                <ChevronRight size={16} />
              </a>
            </div>

            {/* CHANGE 4 — features strip: 6 badges total */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {[
                'Multi-Modal Detection',
                'Privacy-First Processing',
                'Explainable AI Heatmaps',
                'Provenance Tracking',
                'Real-Time Analysis',
                'Batch Processing',
              ].map((label) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1"
                >
                  <CheckCircle2 size={12} className="text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            {/* Product preview — analyzer shell */}
            {/* CHANGE 5 — added Batch tab */}
            <div className="mt-16 w-full max-w-4xl">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-slate-400 font-mono">analyzer</span>
                </div>
                <div className="p-6 sm:p-10 bg-gradient-to-br from-slate-50 to-white">
                  <div className="flex gap-3 mb-6">
                    {[
                      { icon: ImageIcon, label: 'Image', active: true },
                      { icon: Mic, label: 'Audio', active: false },
                      { icon: Video, label: 'Video', active: false },
                      { icon: Type, label: 'Text', active: false },
                      { icon: Layers, label: 'Batch', active: false },
                    ].map((t) => {
                      const Icon = t.icon;
                      return (
                        <div
                          key={t.label}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            t.active
                              ? 'bg-[#2563EB] text-white shadow-sm'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <Icon size={16} />
                          {t.label}
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center py-12">
                    <div className="p-4 rounded-xl bg-blue-50 mb-4">
                      <Upload size={28} className="text-blue-500" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                      Drag & drop or <span className="text-blue-600">browse</span>
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Supports JPEG, PNG, WEBP up to 10 MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ TRUST INDICATORS ════════ */}
        <section className="border-y border-slate-100 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-8 flex flex-wrap justify-center gap-x-10 gap-y-4">
            {TRUST.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="flex items-center gap-2.5 text-slate-500 text-sm font-medium">
                  <Icon size={18} className="text-blue-500" />
                  {t.label}
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════ CHANGE 6 — "How We Verify It" ════════ */}
        <section className="py-24 px-6 bg-white">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-[#2563EB] text-sm font-semibold tracking-widest uppercase mb-3">
                5 New Capabilities
              </p>
              <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight">
                How We Verify It
              </h2>
              <p className="mt-4 text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
                Every addition built for the final round — from cross-modal sync to forensic provenance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VERIFY_CARDS.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group rounded-2xl border border-slate-100 bg-white p-7 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/80 transition-all duration-300 flex gap-5"
                  >
                    <div className={`p-3 rounded-xl ${f.color} h-fit shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold mb-1.5">{f.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
      {/* END SECTION 1 */}

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 2 — How It Works                   */}
      {/* ══════════════════════════════════════════ */}
      <div id="section-how-it-works" style={{ display: activeSection === 'section-how-it-works' ? 'block' : 'none' }}>

        {/* ════════ What is a Deepfake? / AI-Generated Content? ════════ */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-[#2563EB] text-sm font-semibold tracking-widest uppercase mb-3">
                Understanding the Threat
              </p>
              <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight">
                Know What You&apos;re Fighting
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group rounded-2xl border border-slate-100 bg-white p-7 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/80 transition-all duration-300">
                <div className="p-3 rounded-xl text-blue-600 bg-blue-50 h-fit w-fit mb-4">
                  <Eye size={22} />
                </div>
                <h3 className="text-base font-bold mb-1.5">What is a Deepfake?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  A deepfake is AI-manipulated media — typically a face swap, lip-sync dub, or voice clone — designed to make someone appear to say or do something they never did. These use generative adversarial networks (GANs) or autoencoders trained on real footage.
                </p>
              </div>
              <div className="group rounded-2xl border border-slate-100 bg-white p-7 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/80 transition-all duration-300">
                <div className="p-3 rounded-xl text-violet-600 bg-violet-50 h-fit w-fit mb-4">
                  <Sparkles size={22} />
                </div>
                <h3 className="text-base font-bold mb-1.5">What is AI-Generated Content?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  AI-generated content is fully synthetic media — images, text, or audio created from scratch by models like Stable Diffusion, GPT, or VALL-E. Unlike deepfakes, there is no original source being manipulated; the content is entirely machine-produced.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ Deepfakes vs AI-Generated Media ════════ */}
        <section className="py-24 px-6 bg-white">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-[#7C3AED] text-sm font-semibold tracking-widest uppercase mb-3">
                Comparison
              </p>
              <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight">
                Deepfakes vs AI-Generated Media
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group rounded-2xl border border-slate-100 bg-white p-7 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/80 transition-all duration-300">
                <h3 className="text-base font-bold mb-3 text-blue-600">Deepfakes</h3>
                <ul className="space-y-2 text-slate-500 text-sm leading-relaxed">
                  <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Manipulates existing real media</li>
                  <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Face swaps, lip-sync dubbing, voice cloning</li>
                  <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Uses GANs, autoencoders, diffusion</li>
                  <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span> Detected by temporal inconsistencies</li>
                </ul>
              </div>
              <div className="group rounded-2xl border border-slate-100 bg-white p-7 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/80 transition-all duration-300">
                <h3 className="text-base font-bold mb-3 text-violet-600">AI-Generated Media</h3>
                <ul className="space-y-2 text-slate-500 text-sm leading-relaxed">
                  <li className="flex items-start gap-2"><span className="text-violet-500 mt-0.5">•</span> Creates entirely new synthetic content</li>
                  <li className="flex items-start gap-2"><span className="text-violet-500 mt-0.5">•</span> Synthetic images, text, audio from scratch</li>
                  <li className="flex items-start gap-2"><span className="text-violet-500 mt-0.5">•</span> Uses diffusion models, LLMs, TTS</li>
                  <li className="flex items-start gap-2"><span className="text-violet-500 mt-0.5">•</span> Detected by statistical fingerprints</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ HOW IT WORKS (3-step process) ════════ */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-[#2563EB] text-sm font-semibold tracking-widest uppercase mb-3">
                Process
              </p>
              <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight">
                How the Analyzer Works
              </h2>
            </div>

            {/* Horizontal timeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-cyan-200" />

              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="relative flex flex-col items-center text-center group">
                    <div className={`relative z-10 w-24 h-24 rounded-2xl border-2 ${step.color} flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                      <Icon size={32} />
                    </div>
                    <span className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-2">
                      Step {step.num}
                    </span>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════ See the Analyzer in Action (walkthrough) ════════ */}
        {/* CHANGE 12 — includes Steps 5, 6, 7 */}
        <section className="py-24 px-6 bg-white">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-[#06B6D4] text-sm font-semibold tracking-widest uppercase mb-3">
                Walkthrough
              </p>
              <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight">
                See the Analyzer in Action
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {WALKTHROUGH.map((w) => (
                <div
                  key={w.num}
                  className="group rounded-2xl border border-slate-100 bg-white p-7 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/80 transition-all duration-300 flex gap-5"
                >
                  <div className="p-3 rounded-xl text-blue-600 bg-blue-50 h-fit shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-sm font-bold">{String(w.num).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1.5">{w.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      {/* END SECTION 2 */}

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 3 — Capabilities                   */}
      {/* ══════════════════════════════════════════ */}
      <div id="section-capabilities" style={{ display: activeSection === 'section-capabilities' ? 'block' : 'none' }}>

        {/* ════════ FEATURES ════════ */}
        <section className="py-24 px-6 bg-white">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-[#7C3AED] text-sm font-semibold tracking-widest uppercase mb-3">
                Capabilities
              </p>
              <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight">
                Detection Features
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group rounded-2xl border border-slate-100 bg-white p-7 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/80 transition-all duration-300 flex gap-5"
                  >
                    <div className={`p-3 rounded-xl ${f.color} h-fit shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold mb-1.5">{f.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════ CHANGE 10 — Performance stats bar ════════ */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
              {[
                { number: '< 1s', label: 'Real-time image analysis' },
                { number: '< 60s', label: '30-second video processing' },
                { number: '4', label: 'Detection modalities' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight text-[#2563EB]">
                    {stat.number}
                  </p>
                  <p className="text-slate-500 text-sm font-medium mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      {/* END SECTION 3 */}

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 4 — Technology                     */}
      {/* ══════════════════════════════════════════ */}
      <div id="section-technology" style={{ display: activeSection === 'section-technology' ? 'block' : 'none' }}>

        {/* ════════ TECHNOLOGY ════════ */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <p className="text-[#06B6D4] text-sm font-semibold tracking-widest uppercase mb-3">
                Under the Hood
              </p>
              <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight">
                Built With Modern Stack
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {TECH.map((t, idx) => (
                <div
                  key={`${t.name}-${idx}`}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3.5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  <span className="text-sm font-bold text-slate-800">{t.name}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {t.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ DEMO CTA ════════ */}
        <section className="py-24 px-6 bg-white">
          <div className="mx-auto max-w-3xl text-center">
            <div className="rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-10 sm:p-16 text-white relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-white/10 blur-xl" />

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight mb-4">
                  Ready to Verify Authenticity?
                </h2>
                <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-lg mx-auto">
                  Try our multi-modal deepfake detection tool — no signup required.
                </p>
                <Link
                  to="/analyzer"
                  className="inline-flex items-center gap-2.5 bg-white text-[#2563EB] font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/20 active:scale-[0.98]"
                >
                  Launch Analyzer
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ FOOTER ════════ */}
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
                  <Shield size={18} className="text-white" />
                </div>
                <div className="leading-tight">
                  <span className="text-sm font-bold text-slate-800">Hologram Truth Analyzer</span>
                  <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                    Restoring Digital Trust
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Team TruthGuardians &middot; BlueBit Hackathon 4.0
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
              &copy; {new Date().getFullYear()} Hologram Truth Analyzer. Built with
              Vision Transformers, wav2vec 2.0 &amp; Grad-CAM++.
            </div>
          </div>
        </footer>

      </div>
      {/* END SECTION 4 */}

    </div>
  );
}
