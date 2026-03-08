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
} from 'lucide-react';

/* ─── Data ─── */
const TRUST = [
  { icon: BarChart3, label: '95%+ Accuracy' },
  { icon: Zap, label: 'Sub-2s Inference' },
  { icon: Globe, label: 'Multi-Modal Detection' },
  { icon: Lock, label: 'Privacy First' },
];

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
    desc: 'Vision Transformers and wav2vec models analyze patterns.',
    color: 'text-violet-600 bg-violet-50 border-violet-100',
  },
  {
    num: '03',
    icon: Eye,
    title: 'Get Results',
    desc: 'Receive REAL or FAKE verdict with confidence scores and heatmaps.',
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
  },
];

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
];

const TECH = [
  { name: 'Vision Transformers', tag: 'Image' },
  { name: 'wav2vec 2.0', tag: 'Audio' },
  { name: 'RoBERTa', tag: 'Text' },
  { name: 'Grad-CAM++', tag: 'XAI' },
  { name: 'FastAPI', tag: 'Backend' },
  { name: 'React + Vite', tag: 'Frontend' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-[Inter,sans-serif] selection:bg-blue-200">
      {/* ════════ NAVBAR ════════ */}
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
          </Link>
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-200 active:scale-[0.98]"
          >
            Try Analyzer
            <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-violet-100/40 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={14} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 tracking-wide">
              Powered by Vision Transformers & wav2vec 2.0
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-[Space_Grotesk,sans-serif] font-extrabold tracking-tight leading-[1.1] max-w-3xl">
            Detect AI Manipulation{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>

          <p className="mt-6 text-slate-500 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Upload images, audio, or text and let our AI detect deepfakes and
            synthetic content in seconds.
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

          {/* Product preview */}
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
                    { icon: Type, label: 'Text', active: false },
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

      {/* ════════ HOW IT WORKS ════════ */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-[#2563EB] text-sm font-semibold tracking-widest uppercase mb-3">
              Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight">
              How It Works
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

      {/* ════════ FEATURES ════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-[#7C3AED] text-sm font-semibold tracking-widest uppercase mb-3">
              Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight">
              Multi-Modal Detection
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

      {/* ════════ TECHNOLOGY ════════ */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-[#06B6D4] text-sm font-semibold tracking-widest uppercase mb-3">
              Under the Hood
            </p>
            <h2 className="text-3xl sm:text-4xl font-[Space_Grotesk,sans-serif] font-bold tracking-tight">
              Technology Stack
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {TECH.map((t) => (
              <div
                key={t.name}
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
            Vision Transformers, wav2vec 2.0 & Grad-CAM++.
          </div>
        </div>
      </footer>
    </div>
  );
}
