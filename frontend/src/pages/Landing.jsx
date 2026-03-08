import { Link } from 'react-router-dom';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Upload,
  Cpu,
  FileSearch,
  Image as ImageIcon,
  Mic,
  Video,
  Type,
  ArrowRight,
  Zap,
  Eye,
  Lock,
  ChevronRight,
} from 'lucide-react';

/* ─── Logos as simple text/icons for tech stack ─── */
const TECH = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Python', color: '#3776AB' },
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'Deep Learning', color: '#EF4444' },
  { name: 'FastAPI', color: '#009688' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* ═══════ NAVBAR ═══════ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold text-[15px] tracking-tight">Hologram Truth Analyzer</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#475569] font-medium">
            <a href="#how-it-works" className="hover:text-[#0F172A] transition-colors">How it Works</a>
            <a href="#about-detection" className="hover:text-[#0F172A] transition-colors">About Detection</a>
            <Link
              to="/analyzer"
              className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm shadow-blue-500/20"
            >
              Launch Analyzer
            </Link>
          </div>
          {/* Mobile CTA */}
          <Link
            to="/analyzer"
            className="md:hidden bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Launch Analyzer
          </Link>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/40 to-[#F8FAFC] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#2563EB]/[0.04] blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6">
              <Zap size={14} className="text-[#2563EB]" />
              <span className="text-xs font-semibold text-[#2563EB]">AI-Powered Detection Platform</span>
            </div>

            <h1 className="text-4xl md:text-[56px] font-extrabold tracking-tight leading-[1.1] text-[#0F172A]">
              Detect Deepfakes and Synthetic Media{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">Instantly</span>
            </h1>

            <p className="mt-6 text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto">
              Hologram Truth Analyzer is an AI-powered detection platform that identifies manipulated images, audio, video, and AI-generated text using advanced deep learning models.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link
                to="/analyzer"
                className="group flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Launch Analyzer
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 text-[#475569] font-semibold px-7 py-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white transition-all"
              >
                Learn How It Works
              </a>
            </div>
          </div>

          {/* Product preview */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl shadow-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#F1F5F9] bg-[#FAFBFC]">
                <span className="w-3 h-3 rounded-full bg-[#FCA5A5]" />
                <span className="w-3 h-3 rounded-full bg-[#FDE68A]" />
                <span className="w-3 h-3 rounded-full bg-[#86EFAC]" />
                <span className="ml-4 text-xs text-[#94A3B8] font-mono">analyzer — hologram-truth-analyzer</span>
              </div>
              <div className="p-6 md:p-10 bg-gradient-to-br from-[#F8FAFC] to-white">
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { icon: ImageIcon, label: 'Image' },
                    { icon: Mic, label: 'Audio' },
                    { icon: Video, label: 'Video' },
                    { icon: Type, label: 'Text' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white border border-[#E2E8F0] text-sm text-[#475569] font-medium">
                      <Icon size={16} />
                      {label}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] py-14 flex flex-col items-center gap-3">
                  <Upload size={28} className="text-[#94A3B8]" />
                  <p className="text-sm text-[#94A3B8]">Drop file to scan or click to browse</p>
                </div>
                <div className="mt-4 h-12 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-semibold text-sm">
                  Execute Analysis
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TRUST INDICATORS ═══════ */}
      <section className="py-12 border-y border-[#E2E8F0] bg-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {[
            'Multi-Modal Detection',
            'Privacy-First Processing',
          ].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#22C55E]" />
              <span className="text-sm font-medium text-[#475569]">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ WHAT IS A DEEPFAKE ═══════ */}
      <section id="about-detection" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Deepfakes */}
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-5">
                <Eye size={14} className="text-[#EF4444]" />
                <span className="text-xs font-semibold text-[#EF4444]">Manipulation</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">What is a Deepfake?</h2>
              <p className="text-[#475569] leading-relaxed mb-4">
                Deepfakes are synthetic media where a person's face, voice, or actions are digitally manipulated using artificial intelligence. These techniques use deep learning models to create realistic but fabricated content that can mislead viewers.
              </p>
              <ul className="space-y-2 text-[#475569] text-sm">
                <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[#EF4444] mt-0.5 shrink-0" /> Face swaps in videos</li>
                <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[#EF4444] mt-0.5 shrink-0" /> Synthetic voice cloning</li>
                <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[#EF4444] mt-0.5 shrink-0" /> Manipulated images of real people</li>
              </ul>
              <p className="mt-4 text-sm text-[#64748B] leading-relaxed">
                Deepfakes pose serious threats to information integrity—they are increasingly used in misinformation campaigns, financial fraud, identity theft, and political manipulation.
              </p>
            </div>

            {/* AI Generated Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-5">
                <Cpu size={14} className="text-[#7C3AED]" />
                <span className="text-xs font-semibold text-[#7C3AED]">Synthetic</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">What is AI-Generated Content?</h2>
              <p className="text-[#475569] leading-relaxed mb-4">
                AI-generated content refers to media created entirely by artificial intelligence systems rather than captured from the real world. Unlike deepfakes, these are fully synthetic—no original source was manipulated.
              </p>
              <ul className="space-y-2 text-[#475569] text-sm">
                <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[#7C3AED] mt-0.5 shrink-0" /> AI-written text (ChatGPT, etc.)</li>
                <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[#7C3AED] mt-0.5 shrink-0" /> AI-generated images (Midjourney, DALL·E)</li>
                <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[#7C3AED] mt-0.5 shrink-0" /> Synthetic audio and video</li>
              </ul>
              <p className="mt-4 text-sm text-[#64748B] leading-relaxed">
                AI-generated content isn't inherently harmful, but it can be misused to deceive when presented as real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ COMPARISON TABLE ═══════ */}
      <section className="py-16 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-10">Deepfakes vs AI-Generated Media</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[#FECACA] bg-red-50/50 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 flex items-center justify-center mb-4">
                <Eye size={22} className="text-[#EF4444]" />
              </div>
              <h3 className="font-bold text-lg mb-2">Deepfake</h3>
              <p className="text-sm text-[#475569] mb-4">Manipulates <strong>real content</strong> — takes existing media and alters it.</p>
              <div className="text-xs text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-4 py-3">
                <span className="font-semibold text-[#EF4444]">Example:</span> Face-swapped video of a public figure saying something they never said.
              </div>
            </div>
            <div className="rounded-2xl border border-[#C4B5FD] bg-purple-50/50 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center mb-4">
                <Cpu size={22} className="text-[#7C3AED]" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI-Generated</h3>
              <p className="text-sm text-[#475569] mb-4">Creates <strong>entirely synthetic content</strong> — no real source is needed.</p>
              <div className="text-xs text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-4 py-3">
                <span className="font-semibold text-[#7C3AED]">Example:</span> Photorealistic image created by a diffusion model like Stable Diffusion.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#2563EB] mb-2">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How the Analyzer Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-[#E2E8F0]" />

            {[
              {
                step: '01',
                icon: Upload,
                title: 'Upload Media',
                desc: 'Upload an image, audio file, video, or paste text into the analyzer.',
                color: '#2563EB',
              },
              {
                step: '02',
                icon: Cpu,
                title: 'AI Analysis',
                desc: 'Advanced models like Vision Transformers, wav2vec 2.0, and RoBERTa analyze patterns and detect manipulation artifacts.',
                color: '#7C3AED',
              },
              {
                step: '03',
                icon: FileSearch,
                title: 'Get Forensic Report',
                desc: 'Receive a REAL or FAKE verdict, confidence score, and Grad-CAM++ heatmap explanation.',
                color: '#06B6D4',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative flex flex-col items-center text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg relative z-10"
                    style={{ background: `${item.color}10`, boxShadow: `0 4px 20px ${item.color}15` }}
                  >
                    <Icon size={22} style={{ color: item.color }} />
                  </div>
                  <span className="text-xs font-bold text-[#94A3B8] mb-2">STEP {item.step}</span>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed max-w-xs">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ ANALYZER FLOW DEMO ═══════ */}
      <section className="py-20 md:py-28 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#06B6D4] mb-2">End-to-End Flow</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">See the Analyzer in Action</h2>
            <p className="text-[#475569] mt-4 max-w-2xl mx-auto">
              A complete walkthrough of how Hologram detects manipulated media — from upload to forensic report.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Step 1 — Choose media type */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAFBFC] overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F1F5F9] bg-white">
                <span className="w-7 h-7 rounded-lg bg-[#2563EB]/10 text-[#2563EB] font-bold text-xs flex items-center justify-center">1</span>
                <h3 className="font-semibold text-[15px]">Select the media type you want to analyze</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: ImageIcon, label: 'Image', desc: 'JPG, PNG, WebP', active: true },
                    { icon: Mic, label: 'Audio', desc: 'WAV, MP3, M4A', active: false },
                    { icon: Video, label: 'Video', desc: 'MP4, AVI, MOV', active: false },
                    { icon: Type, label: 'Text', desc: 'Paste directly', active: false },
                  ].map(({ icon: Icon, label, desc, active }) => (
                    <div
                      key={label}
                      className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border text-center transition-all ${
                        active
                          ? 'border-[#2563EB] bg-blue-50/60 shadow-sm'
                          : 'border-[#E2E8F0] bg-white'
                      }`}
                    >
                      <Icon size={20} className={active ? 'text-[#2563EB]' : 'text-[#94A3B8]'} />
                      <span className={`text-sm font-semibold ${active ? 'text-[#2563EB]' : 'text-[#475569]'}`}>{label}</span>
                      <span className="text-[10px] text-[#94A3B8]">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2 — Upload */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAFBFC] overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F1F5F9] bg-white">
                <span className="w-7 h-7 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="font-semibold text-[15px]">Upload your file via drag-and-drop or file picker</h3>
              </div>
              <div className="p-6">
                <div className="rounded-xl border-2 border-dashed border-[#CBD5E1] bg-white py-10 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                    <Upload size={22} className="text-[#94A3B8]" />
                  </div>
                  <p className="text-sm font-medium text-[#0F172A]">Drag & drop or click to browse</p>
                  <p className="text-xs text-[#94A3B8]">Supported: JPEG, PNG, WebP up to 10 MB</p>
                </div>
                <div className="mt-4 flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 w-fit mx-auto">
                  <ImageIcon size={16} className="text-[#2563EB]" />
                  <span className="text-sm font-medium text-[#0F172A]">sample_portrait.jpg</span>
                  <span className="text-xs text-[#94A3B8]">2.4 MB</span>
                  <CheckCircle2 size={14} className="text-[#22C55E]" />
                </div>
              </div>
            </div>

            {/* Step 3 — Model runs */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAFBFC] overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F1F5F9] bg-white">
                <span className="w-7 h-7 rounded-lg bg-[#06B6D4]/10 text-[#06B6D4] font-bold text-xs flex items-center justify-center">3</span>
                <h3 className="font-semibold text-[15px]">AI model processes the media</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {[
                    { model: 'Vision Transformer (ViT)', task: 'Image Classification', media: 'Image', color: '#2563EB' },
                    { model: 'wav2vec 2.0', task: 'Audio Classification', media: 'Audio', color: '#7C3AED' },
                    { model: 'RoBERTa', task: 'Text Classification', media: 'Text', color: '#06B6D4' },
                  ].map((m) => (
                    <div key={m.model} className="flex-1 rounded-xl border border-[#E2E8F0] bg-white p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu size={14} style={{ color: m.color }} />
                        <span className="text-xs font-semibold" style={{ color: m.color }}>{m.media}</span>
                      </div>
                      <p className="text-sm font-bold text-[#0F172A]">{m.model}</p>
                      <p className="text-xs text-[#94A3B8] mt-1">{m.task}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                  <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                  <span className="text-sm text-[#2563EB] font-medium">Analyzing with Vision Transformer...</span>
                </div>
              </div>
            </div>

            {/* Step 4 — Forensic Result */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAFBFC] overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F1F5F9] bg-white">
                <span className="w-7 h-7 rounded-lg bg-[#EF4444]/10 text-[#EF4444] font-bold text-xs flex items-center justify-center">4</span>
                <h3 className="font-semibold text-[15px]">Receive verdict, confidence score & forensic heatmap</h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Mock result */}
                <div className="rounded-xl border border-[#FECACA] bg-white overflow-hidden">
                  <div className="h-1 bg-[#EF4444]" />
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
                          <XCircle size={20} className="text-[#EF4444]" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-[#EF4444]">FAKE</p>
                          <p className="text-[10px] text-[#94A3B8]">Model: ViT-Base</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#EF4444]/10 text-[#EF4444]">HIGH RISK</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#475569] font-medium">Confidence</span>
                        <span className="text-[#EF4444] font-bold">94.7%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div className="h-full rounded-full bg-[#EF4444]" style={{ width: '94.7%' }} />
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border-l-4 border-l-[#EF4444] bg-[#F8FAFC] text-xs text-[#475569] leading-relaxed">
                      <span className="text-[#EF4444] font-semibold">⚠ </span>
                      Strong manipulation artifacts detected — facial boundary blending, skin texture irregularities and GAN fingerprints identified.
                    </div>
                  </div>
                </div>

                {/* Heatmap visual */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#E2E8F0] bg-white p-3 flex flex-col items-center gap-2">
                    <div className="w-full h-28 rounded-lg bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center">
                      <ImageIcon size={28} className="text-[#CBD5E1]" />
                    </div>
                    <span className="text-[10px] text-[#94A3B8] font-medium">Original</span>
                  </div>
                  <div className="rounded-xl border border-[#E2E8F0] bg-white p-3 flex flex-col items-center gap-2">
                    <div className="w-full h-28 rounded-lg bg-gradient-to-br from-blue-100 via-yellow-100 to-red-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/30 via-yellow-300/40 to-red-500/50 mix-blend-overlay" />
                      <Eye size={28} className="text-white/80 relative z-10" />
                    </div>
                    <span className="text-[10px] text-[#94A3B8] font-medium">Grad-CAM++ Overlay</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500" />
                  <div className="flex justify-between text-[10px] text-[#94A3B8] font-medium">
                    <span>Authentic</span>
                    <span>Suspicious</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <Link
                to="/analyzer"
                className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-500/25"
              >
                Try It Yourself
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section className="py-20 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#7C3AED] mb-2">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Detection Features</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: ImageIcon, title: 'Deepfake Image Detection', desc: 'Identify AI-manipulated and GAN-generated images using Vision Transformer analysis.', color: '#2563EB' },
              { icon: Mic, title: 'Audio Authenticity Analysis', desc: 'Detect synthetic voices and cloned audio using wav2vec 2.0 feature extraction.', color: '#7C3AED' },
              { icon: Type, title: 'AI-Generated Text Detection', desc: 'Identify machine-written content using RoBERTa-based language analysis.', color: '#06B6D4' },
              { icon: Eye, title: 'Explainable AI Heatmaps', desc: 'Grad-CAM++ overlays show exactly which regions triggered the detection model.', color: '#EF4444' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex gap-5 p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-lg hover:shadow-black/[0.02] transition-all bg-[#FAFBFC]">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${f.color}10` }}
                  >
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px] mb-1">{f.title}</h3>
                    <p className="text-sm text-[#475569] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ TECH STACK ═══════ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#06B6D4] mb-2">Technology</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built With Modern Stack</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {TECH.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-3 px-6 py-4 rounded-xl border border-[#E2E8F0] bg-white hover:shadow-lg hover:shadow-black/[0.03] transition-all"
              >
                <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                <span className="font-semibold text-sm text-[#0F172A]">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Try the Hologram Truth Analyzer</h2>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                Upload any media and get instant AI-powered forensic analysis.
              </p>
              <Link
                to="/analyzer"
                className="inline-flex items-center gap-2 bg-white text-[#2563EB] font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Launch Analyzer
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-[#E2E8F0] bg-white py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm text-[#0F172A]">Hologram Truth Analyzer</span>
          </div>
          <p className="text-sm text-[#94A3B8]">
            Team TruthGuardians &middot; BlueBit Hackathon 4.0
          </p>
        </div>
      </footer>
    </div>
  );
}
