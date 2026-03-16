import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import logo from '../assets/download.png';
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
  Layers,
  Crosshair,
  Lightbulb,
  Fingerprint,
  Scissors,
  Timer,
  Sun,
  Moon,
} from 'lucide-react';

/* ─── Logos as simple text/icons for tech stack ─── */
/* CHANGE 11 — 3 new pills appended */
const TECH = [
  { name: 'React', color: 'var(--clr-accent)' },
  { name: 'Python', color: 'var(--clr-primary)' },
  { name: 'JavaScript', color: 'var(--clr-accent)' },
  { name: 'Deep Learning', color: 'var(--clr-danger)' },
  { name: 'FastAPI', color: 'var(--clr-success)' },
  { name: 'Vision Transformer', color: 'var(--clr-primary)' },
  { name: 'wav2vec 2.0', color: 'var(--clr-accent)' },
  { name: 'C2PA', color: 'var(--clr-success)' },
];

/* ─── Section navigation config ─── */
const SECTIONS = [
  { id: 'section-overview', label: 'Overview' },
  { id: 'section-how-it-works', label: 'How It Works' },
  { id: 'section-capabilities', label: 'Capabilities' },
  { id: 'section-technology', label: 'Technology' },
];

export default function Landing() {
  const [activeSection, setActiveSection] = useState('section-overview');
  const containerRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();

  const showSection = (id) => {
    setActiveSection(id);
    window.scrollTo(0, 0);
  };

  /* ─── Scroll-reveal Intersection Observer ─── */
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Reset all reveal targets so they animate fresh on section switch
    const targets = root.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    targets.forEach((el) => el.classList.remove('revealed'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    // Slight delay so display:block has taken effect
    const timer = setTimeout(() => {
      targets.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeSection]);

  /* ─── Auto-advance to next tab on scroll-to-bottom ─── */
  const activeSectionRef = useRef(activeSection);
  activeSectionRef.current = activeSection;

  useEffect(() => {
    const SECTION_ORDER = [
      'section-overview',
      'section-how-it-works',
      'section-capabilities',
      'section-technology',
    ];
    let cooldown = false;

    const handleScroll = () => {
      if (cooldown) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Check if at absolute bottom (within 5px threshold)
      if (scrollTop + windowHeight >= docHeight - 5) {
        const currentIdx = SECTION_ORDER.indexOf(activeSectionRef.current);
        if (currentIdx < SECTION_ORDER.length - 1) {
          cooldown = true;
          // Brief pause at the bottom before gliding to the next section
          setTimeout(() => {
            setActiveSection(SECTION_ORDER[currentIdx + 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Cooldown to prevent re-triggering during scroll-to-top
            setTimeout(() => { cooldown = false; }, 1000);
          }, 300);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans antialiased">
      {/* ═══════ NAVBAR ═══════ */}
      {/* CHANGE 1 — added "Multi-Modal", "Provenance" links + v2.0 badge */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-nav)] backdrop-blur-lg border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Hologram Truth Analyzer" className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-bold text-[15px] tracking-tight">Hologram Truth Analyzer</span>
            <span className="text-[10px] font-semibold text-[var(--clr-primary)] bg-[var(--clr-primary-subtle-bg)] border border-[var(--clr-primary-subtle-border)] px-2 py-0.5 rounded-full whitespace-nowrap">
              v2.0 · 5 new capabilities
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm text-[var(--text-secondary)] font-medium">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-raised)] hover:border-[var(--border-emphasis)] transition-colors text-[var(--text-secondary)]"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link
              to="/analyzer"
              className="bg-[var(--clr-primary)] text-[var(--clr-primary-text)] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--clr-primary-hover)] transition-colors shadow-sm shadow-[var(--clr-primary)]/20"
            >
              Launch Analyzer
            </Link>
          </div>
          {/* Mobile CTA */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-raised)] text-[var(--text-secondary)]"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link
              to="/analyzer"
              className="bg-[var(--clr-primary)] text-[var(--clr-primary-text)] px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Launch Analyzer
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════ SECTION NAVIGATION ═══════ */}
      <div className="sticky top-16 z-40 bg-[var(--bg-nav)] backdrop-blur-xl border-b border-[var(--border-subtle)]/60">
        <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-center">
          <div className="inline-flex items-center bg-[var(--bg-surface)] rounded-xl p-1 gap-0.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                data-section={s.id}
                onClick={() => showSection(s.id)}
                className={`section-nav-btn relative px-5 py-2 rounded-[10px] text-[13px] font-semibold transition-all duration-200 cursor-pointer border-none outline-none ${activeSection === s.id
                  ? 'bg-[var(--clr-primary-subtle-bg)] text-[var(--clr-primary)] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]'
                  : 'bg-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                  }`}
              >
                {activeSection === s.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-[var(--clr-primary)]" />
                )}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 1 — Overview                       */}
      {/* ══════════════════════════════════════════ */}
      <div key={activeSection === 'section-overview' ? 'overview-active' : 'overview'} id="section-overview" className={activeSection === 'section-overview' ? 'section-panel-active' : 'section-panel-hidden'}>

        {/* ═══════ HERO ═══════ */}
        <section data-reveal className="relative overflow-hidden">
          {/* Subtle gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--gradient-hero-from)] via-[var(--gradient-hero-via)] to-[var(--gradient-hero-to)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--clr-primary)]/[0.04] blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-16 md:pt-16 md:pb-24">
            <div className="max-w-3xl mx-auto text-center">
              {/* CHANGE 2 — hero badge text */}
              <div className="inline-flex items-center gap-2 bg-[var(--clr-primary-subtle-bg)] border border-[var(--clr-primary-subtle-border)] rounded-full px-4 py-1.5 mb-6">
                <Zap size={14} className="text-[var(--clr-primary)]" />
                <span className="text-xs font-semibold text-[var(--clr-primary)]">AI-Powered · Multi-Modal · Forensic Platform</span>
              </div>

              <h1 className="text-3xl md:text-[46px] font-extrabold tracking-tight leading-[1.1] text-[var(--text-primary)]">
                Detect Deepfakes and Synthetic Media{' '}
                <span className="bg-gradient-to-r from-[var(--clr-primary)] to-[var(--clr-accent)] bg-clip-text text-transparent">Instantly</span>
              </h1>

              {/* CHANGE 3 — hero subtext */}
              <p className="mt-6 text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
                Hologram Truth Analyzer detects manipulated images, audio, video, and AI-generated text — with cross-modal lip-sync verification, provenance tracking, partial edit detection, and frame-by-frame forensic analysis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Link
                  to="/analyzer"
                  className="group flex items-center gap-2 bg-[var(--clr-primary)] text-[var(--clr-primary-text)] font-semibold px-7 py-3.5 rounded-xl hover:bg-[var(--clr-primary-hover)] transition-all shadow-lg shadow-[var(--clr-primary)]/25 hover:shadow-[var(--clr-primary)]/40"
                >
                  Launch Analyzer
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 text-[var(--text-primary)] font-semibold px-7 py-3.5 rounded-xl border border-[var(--border-default)] hover:border-[var(--border-emphasis)] hover:bg-[var(--bg-raised)] transition-all"
                >
                  Learn How It Works
                </a>
              </div>
            </div>

            {/* Product preview */}
            {/* CHANGE 5 — added Batch tab */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-2xl shadow-black/[0.04] overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-shell-bar)]">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                  <span className="ml-4 text-xs text-[var(--text-tertiary)] font-mono">analyzer — hologram-truth-analyzer</span>
                </div>
                <div className="p-6 md:p-10 bg-gradient-to-br from-[var(--bg-inset)] to-[var(--bg-surface)]">
                  <div className="grid grid-cols-5 gap-3 mb-6">
                    {[
                      { icon: ImageIcon, label: 'Image' },
                      { icon: Mic, label: 'Audio' },
                      { icon: Video, label: 'Video' },
                      { icon: Type, label: 'Text' },
                      { icon: Layers, label: 'Batch' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)] font-medium">
                        <Icon size={16} />
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border-2 border-dashed border-[var(--border-default)] bg-[var(--bg-inset)] py-14 flex flex-col items-center gap-3">
                    <Upload size={28} className="text-[var(--text-tertiary)]" />
                    <p className="text-sm text-[var(--text-tertiary)]">Drop file to scan or click to browse</p>
                  </div>
                  <div className="mt-4 h-12 rounded-lg bg-gradient-to-r from-[var(--clr-primary)] to-[var(--clr-primary-hover)] flex items-center justify-center text-[var(--clr-primary-text)] font-semibold text-sm">
                    Execute Analysis
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ TRUST INDICATORS ═══════ */}
        {/* CHANGE 4 — features strip: 6 badges total */}
        <section data-reveal className="py-12 border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-x-10 gap-y-4">
            {[
              'Multi-Modal Detection',
              'Privacy-First Processing',
              'Explainable AI Heatmaps',
              'Provenance Tracking',
              'Real-Time Analysis',
              'Batch Processing',
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[var(--clr-success)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ CHANGE 6 — "How We Verify It" ═══════ */}
        <section data-reveal className="py-20 md:py-28 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-[var(--clr-accent)] mb-2">5 New Capabilities</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How We Verify It</h2>
              <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
                Every addition built for the final round — from cross-modal sync to forensic provenance.
              </p>
            </div>

            <div data-reveal-stagger className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: Crosshair, title: 'Cross-Modal Verification', desc: 'Checks if audio phonemes match video lip movements frame by frame using wav2vec 2.0 and facial landmark tracking.', color: 'var(--clr-primary)' },
                { icon: Lightbulb, title: 'Explainability Engine', desc: 'Visual heatmaps, bounding boxes, and plain-language explanations show exactly why content was flagged.', color: 'var(--clr-accent)' },
                { icon: Fingerprint, title: 'Provenance Tracking', desc: 'Verifies digital signatures, EXIF metadata, and camera PRNU fingerprints to trace content origin.', color: 'var(--clr-success)' },
                { icon: Scissors, title: 'Partial Manipulation Detection', desc: 'Finds subtle edits including removed frames, audio splices, and color grading shifts invisible to the naked eye.', color: 'var(--clr-danger)' },
                { icon: Timer, title: 'Real-Time & Batch Processing', desc: 'Analyzes images in under 1 second, processes 30-second videos in under 60 seconds, and supports multi-file batch queues.', color: 'var(--clr-success)' },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-5 p-6 rounded-2xl border border-[var(--border-default)] hover:border-[var(--border-emphasis)] hover:shadow-lg hover:shadow-black/[0.02] transition-all bg-[var(--bg-raised)]">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${f.color}10` }}
                    >
                      <Icon size={20} style={{ color: f.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[15px] mb-1">{f.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
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
      <div key={activeSection === 'section-how-it-works' ? 'howitworks-active' : 'howitworks'} id="section-how-it-works" className={activeSection === 'section-how-it-works' ? 'section-panel-active' : 'section-panel-hidden'}>

        {/* ═══════ WHAT IS A DEEPFAKE ═══════ */}
        <section data-reveal id="about-detection" className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Deepfakes */}
              <div>
                <div className="inline-flex items-center gap-2 bg-[var(--clr-danger-subtle-bg)] border border-[var(--clr-danger-subtle-border)] rounded-full px-4 py-1.5 mb-5">
                  <Eye size={14} className="text-[var(--clr-danger)]" />
                  <span className="text-xs font-semibold text-[var(--clr-danger)]">Manipulation</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">What is a Deepfake?</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  Deepfakes are synthetic media where a person's face, voice, or actions are digitally manipulated using artificial intelligence. These techniques use deep learning models to create realistic but fabricated content that can mislead viewers.
                </p>
                <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                  <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[var(--clr-danger)] mt-0.5 shrink-0" /> Face swaps in videos</li>
                  <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[var(--clr-danger)] mt-0.5 shrink-0" /> Synthetic voice cloning</li>
                  <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[var(--clr-danger)] mt-0.5 shrink-0" /> Manipulated images of real people</li>
                </ul>
                <p className="mt-4 text-sm text-[var(--text-tertiary)] leading-relaxed">
                  Deepfakes pose serious threats to information integrity—they are increasingly used in misinformation campaigns, financial fraud, identity theft, and political manipulation.
                </p>
              </div>

              {/* AI Generated Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-[var(--clr-accent-subtle-bg)] border border-[var(--clr-accent-subtle-border)] rounded-full px-4 py-1.5 mb-5">
                  <Cpu size={14} className="text-[var(--clr-accent)]" />
                  <span className="text-xs font-semibold text-[var(--clr-accent)]">Synthetic</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">What is AI-Generated Content?</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  AI-generated content refers to media created entirely by artificial intelligence systems rather than captured from the real world. Unlike deepfakes, these are fully synthetic—no original source was manipulated.
                </p>
                <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                  <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[var(--clr-accent)] mt-0.5 shrink-0" /> AI-written text (ChatGPT, etc.)</li>
                  <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[var(--clr-accent)] mt-0.5 shrink-0" /> AI-generated images (Midjourney, DALL·E)</li>
                  <li className="flex items-start gap-2"><ChevronRight size={16} className="text-[var(--clr-accent)] mt-0.5 shrink-0" /> Synthetic audio and video</li>
                </ul>
                <p className="mt-4 text-sm text-[var(--text-tertiary)] leading-relaxed">
                  AI-generated content isn't inherently harmful, but it can be misused to deceive when presented as real.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ COMPARISON TABLE ═══════ */}
        <section data-reveal className="py-16 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-10">Deepfakes vs AI-Generated Media</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[var(--clr-danger-subtle-border)] bg-[var(--clr-danger-subtle-bg)] p-8">
                <div className="w-12 h-12 rounded-xl bg-[var(--clr-danger-icon-bg)] flex items-center justify-center mb-4">
                  <Eye size={22} className="text-[var(--clr-danger)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Deepfake</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Manipulates <strong>real content</strong> — takes existing media and alters it.</p>
                <div className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-lg px-4 py-3">
                  <span className="font-semibold text-[var(--clr-danger)]">Example:</span> Face-swapped video of a public figure saying something they never said.
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--clr-accent-subtle-border)] bg-[var(--clr-accent-subtle-bg)] p-8">
                <div className="w-12 h-12 rounded-xl bg-[var(--clr-accent-subtle-bg)] flex items-center justify-center mb-4">
                  <Cpu size={22} className="text-[var(--clr-accent)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">AI-Generated</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Creates <strong>entirely synthetic content</strong> — no real source is needed.</p>
                <div className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-raised)] border border-[var(--border-default)] rounded-lg px-4 py-3">
                  <span className="font-semibold text-[var(--clr-accent)]">Example:</span> Photorealistic image created by a diffusion model like Stable Diffusion.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ HOW IT WORKS ═══════ */}
        {/* CHANGE 8 & 9 — updated Step 2 and Step 3 descriptions */}
        <section data-reveal id="how-it-works" className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-[var(--clr-primary)] mb-2">Process</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How the Analyzer Works</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-[var(--border-default)]" />

              {[
                {
                  step: '01',
                  icon: Upload,
                  title: 'Upload Media',
                  desc: 'Upload an image, audio file, video, or paste text into the analyzer.',
                  color: 'var(--clr-primary)',
                },
                {
                  step: '02',
                  icon: Cpu,
                  title: 'AI Analysis',
                  desc: 'Vision Transformers, wav2vec 2.0, and RoBERTa analyze each modality independently, then cross-verify audio against video lip movements for multi-modal deepfake detection.',
                  color: 'var(--clr-accent)',
                },
                {
                  step: '03',
                  icon: FileSearch,
                  title: 'Get Forensic Report',
                  desc: 'Receive a REAL or FAKE verdict with confidence score, Grad-CAM++ heatmap, provenance report, partial edit markers, and a plain-language explanation of every manipulation found.',
                  color: 'var(--clr-success)',
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
                    <span className="text-xs font-bold text-[var(--text-tertiary)] mb-2">STEP {item.step}</span>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════ ANALYZER FLOW DEMO ═══════ */}
        {/* CHANGE 12 — includes Steps 5, 6, 7 */}
        <section data-reveal className="py-20 md:py-28 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-[var(--clr-success)] mb-2">End-to-End Flow</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">See the Analyzer in Action</h2>
              <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
                A complete walkthrough of how Hologram detects manipulated media — from upload to forensic report.
              </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Step 1 — Choose media type */}
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-raised)] overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--clr-primary-subtle-bg)] text-[var(--clr-primary)] font-bold text-xs flex items-center justify-center">1</span>
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
                        className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border text-center transition-all ${active
                          ? 'border-[var(--clr-primary-subtle-border)] bg-[var(--clr-primary-subtle-bg)] shadow-sm'
                          : 'border-[var(--border-default)] bg-[var(--bg-surface)]'
                          }`}
                      >
                        <Icon size={20} className={active ? 'text-[var(--clr-primary)]' : 'text-[var(--text-tertiary)]'} />
                        <span className={`text-sm font-semibold ${active ? 'text-[var(--clr-primary)]' : 'text-[var(--text-secondary)]'}`}>{label}</span>
                        <span className="text-[10px] text-[var(--text-tertiary)]">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2 — Upload */}
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-raised)] overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--clr-accent-subtle-bg)] text-[var(--clr-accent)] font-bold text-xs flex items-center justify-center">2</span>
                  <h3 className="font-semibold text-[15px]">Upload your file via drag-and-drop or file picker</h3>
                </div>
                <div className="p-6">
                  <div className="rounded-xl border-2 border-dashed border-[var(--border-default)] bg-[var(--bg-surface)] py-10 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--bg-raised)] flex items-center justify-center">
                      <Upload size={22} className="text-[var(--text-tertiary)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Drag & drop or click to browse</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Supported: JPEG, PNG, WebP up to 10 MB</p>
                  </div>
                  <div className="mt-4 flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg px-4 py-2.5 w-fit mx-auto">
                    <ImageIcon size={16} className="text-[var(--clr-primary)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">sample_portrait.jpg</span>
                    <span className="text-xs text-[var(--text-tertiary)]">2.4 MB</span>
                    <CheckCircle2 size={14} className="text-[var(--clr-success)]" />
                  </div>
                </div>
              </div>

              {/* Step 3 — Model runs */}
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-raised)] overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--clr-success-subtle-bg)] text-[var(--clr-success)] font-bold text-xs flex items-center justify-center">3</span>
                  <h3 className="font-semibold text-[15px]">AI model processes the media</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {[
                      { model: 'Vision Transformer (ViT)', task: 'Image Classification', media: 'Image', color: 'var(--clr-primary)' },
                      { model: 'wav2vec 2.0', task: 'Audio Classification', media: 'Audio', color: 'var(--clr-accent)' },
                      { model: 'RoBERTa', task: 'Text Classification', media: 'Text', color: 'var(--clr-success)' },
                    ].map((m) => (
                      <div key={m.model} className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu size={14} style={{ color: m.color }} />
                          <span className="text-xs font-semibold" style={{ color: m.color }}>{m.media}</span>
                        </div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{m.model}</p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">{m.task}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-[var(--clr-primary-subtle-bg)] border border-[var(--clr-primary-subtle-border)] rounded-xl">
                    <div className="w-5 h-5 rounded-full border-2 border-[var(--clr-primary)] border-t-transparent animate-spin" />
                    <span className="text-sm text-[var(--clr-primary)] font-medium">Analyzing with Vision Transformer...</span>
                  </div>
                </div>
              </div>

              {/* Step 4 — Forensic Result */}
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-raised)] overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--clr-danger-subtle-bg)] text-[var(--clr-danger)] font-bold text-xs flex items-center justify-center">4</span>
                  <h3 className="font-semibold text-[15px]">Receive verdict, confidence score & forensic heatmap</h3>
                </div>
                <div className="p-6 space-y-4">
                  {/* Mock result */}
                  <div className="rounded-xl border border-[var(--clr-danger-subtle-border)] bg-[var(--bg-surface)] overflow-hidden">
                    <div className="h-1 bg-[var(--clr-danger)]" />
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[var(--clr-danger-icon-bg)] flex items-center justify-center">
                            <XCircle size={20} className="text-[var(--clr-danger)]" />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-[var(--clr-danger)]">FAKE</p>
                            <p className="text-[10px] text-[var(--text-tertiary)]">Model: ViT-Base</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--clr-danger-subtle-bg)] text-[var(--clr-danger)]">HIGH RISK</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-secondary)] font-medium">Confidence</span>
                          <span className="text-[var(--clr-danger)] font-bold">94.7%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[var(--border-default)] overflow-hidden">
                          <div className="h-full rounded-full bg-[var(--clr-danger)]" style={{ width: '94.7%' }} />
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border-l-4 border-l-[var(--clr-danger)] bg-[var(--clr-danger-subtle-bg)] text-xs text-[var(--text-secondary)] leading-relaxed">
                        <span className="text-[var(--clr-danger)] font-semibold">⚠ </span>
                        Strong manipulation artifacts detected — facial boundary blending, skin texture irregularities and GAN fingerprints identified.
                      </div>
                    </div>
                  </div>

                  {/* Heatmap visual */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3 flex flex-col items-center gap-2">
                      <div className="w-full h-28 rounded-lg bg-gradient-to-br from-[var(--bg-raised)] to-[var(--bg-inset)] flex items-center justify-center">
                        <ImageIcon size={28} className="text-[var(--text-disabled)]" />
                      </div>
                      <span className="text-[10px] text-[var(--text-tertiary)] font-medium">Original</span>
                    </div>
                    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3 flex flex-col items-center gap-2">
                      <div className="w-full h-28 rounded-lg bg-gradient-to-br from-blue-100 via-yellow-100 to-red-200 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/30 via-yellow-300/40 to-red-500/50 mix-blend-overlay" />
                        <Eye size={28} className="text-white/80 relative z-10" />
                      </div>
                      <span className="text-[10px] text-[var(--text-tertiary)] font-medium">Grad-CAM++ Overlay</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500" />
                    <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] font-medium">
                      <span>Authentic</span>
                      <span>Suspicious</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CHANGE 12 — Step 5 */}
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-raised)] overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--clr-primary-subtle-bg)] text-[var(--clr-primary)] font-bold text-xs flex items-center justify-center">5</span>
                  <h3 className="font-semibold text-[15px]">View cross-modal verification</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    See lip-sync scores, frame-by-frame desync markers, and audio waveform alignment — automatically shown when both video and audio streams are detected.
                  </p>
                </div>
              </div>

              {/* CHANGE 12 — Step 6 */}
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-raised)] overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--clr-accent-subtle-bg)] text-[var(--clr-accent)] font-bold text-xs flex items-center justify-center">6</span>
                  <h3 className="font-semibold text-[15px]">Check provenance</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Inspect EXIF metadata, digital signature status, camera fingerprint match, and chain of custody verification for the submitted file.
                  </p>
                </div>
              </div>

              {/* CHANGE 12 — Step 7 */}
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-raised)] overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <span className="w-7 h-7 rounded-lg bg-[var(--clr-success-subtle-bg)] text-[var(--clr-success)] font-bold text-xs flex items-center justify-center">7</span>
                  <h3 className="font-semibold text-[15px]">Review partial edits</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Compare before/after views, inspect the audio splice waveform, and see every subtle manipulation marked on a timeline with severity levels.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-4">
                <Link
                  to="/analyzer"
                  className="inline-flex items-center gap-2 bg-[var(--clr-primary)] text-[var(--clr-primary-text)] font-semibold px-7 py-3.5 rounded-xl hover:bg-[var(--clr-primary-hover)] transition-all shadow-lg shadow-[var(--clr-primary)]/25"
                >
                  Try It Yourself
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
      {/* END SECTION 2 */}

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 3 — Capabilities                   */}
      {/* ══════════════════════════════════════════ */}
      <div key={activeSection === 'section-capabilities' ? 'capabilities-active' : 'capabilities'} id="section-capabilities" className={activeSection === 'section-capabilities' ? 'section-panel-active' : 'section-panel-hidden'}>

        {/* ═══════ FEATURES ═══════ */}
        {/* CHANGE 7 — 4 new cards appended */}
        <section data-reveal className="py-20 bg-[var(--bg-surface)] border-y border-[var(--border-subtle)]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-[var(--clr-accent)] mb-2">Capabilities</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Detection Features</h2>
            </div>

            <div data-reveal-stagger className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: ImageIcon, title: 'Deepfake Image Detection', desc: 'Identify AI-manipulated and GAN-generated images using Vision Transformer analysis.', color: 'var(--clr-primary)' },
                { icon: Mic, title: 'Audio Authenticity Analysis', desc: 'Detect synthetic voices and cloned audio using wav2vec 2.0 feature extraction.', color: 'var(--clr-accent)' },
                { icon: Type, title: 'AI-Generated Text Detection', desc: 'Identify machine-written content using RoBERTa-based language analysis.', color: 'var(--clr-success)' },
                { icon: Eye, title: 'Explainable AI Heatmaps', desc: 'Grad-CAM++ overlays show exactly which regions triggered the detection model.', color: 'var(--clr-danger)' },
                { icon: Crosshair, title: 'Cross-Modal Lip Sync', desc: 'Verifies audio-video coherence using phoneme-to-viseme alignment scoring across every frame.', color: 'var(--clr-primary)' },
                { icon: Fingerprint, title: 'Provenance & Signatures', desc: 'Extracts EXIF data, validates C2PA digital signatures, and checks camera sensor fingerprints.', color: 'var(--clr-accent)' },
                { icon: Scissors, title: 'Partial Edit Detection', desc: 'Detects removed frames, audio splices, object removal, and color grading with before/after comparison.', color: 'var(--clr-danger)' },
                { icon: Layers, title: 'Batch Processing', desc: 'Queue multiple files across media types and process them simultaneously with a live status dashboard.', color: 'var(--clr-success)' },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-5 p-6 rounded-2xl border border-[var(--border-default)] hover:border-[var(--border-emphasis)] hover:shadow-lg hover:shadow-black/[0.02] transition-all bg-[var(--bg-raised)]">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${f.color}10` }}
                    >
                      <Icon size={20} style={{ color: f.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[15px] mb-1">{f.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════ CHANGE 10 — Performance stats bar ═══════ */}
        <section data-reveal className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
              {[
                { number: '< 1s', label: 'Real-time image analysis' },
                { number: '< 60s', label: '30-second video processing' },
                { number: '4', label: 'Detection modalities' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--clr-primary)]">
                    {stat.number}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] font-medium mt-2">{stat.label}</p>
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
      <div key={activeSection === 'section-technology' ? 'technology-active' : 'technology'} id="section-technology" className={activeSection === 'section-technology' ? 'section-panel-active' : 'section-panel-hidden'}>

        {/* ═══════ TECH STACK ═══════ */}
        <section data-reveal className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-[var(--clr-success)] mb-2">Technology</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built With Modern Stack</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {TECH.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-raised)] hover:shadow-lg hover:shadow-black/[0.03] transition-all"
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                  <span className="font-semibold text-sm text-[var(--text-primary)]">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ CTA ═══════ */}
        <section data-reveal className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-3xl bg-gradient-to-br from-[var(--clr-primary)] to-[var(--clr-accent)] p-12 md:p-16 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Try the Hologram Truth Analyzer</h2>
                <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                  Upload any media and get instant AI-powered forensic analysis.
                </p>
                <Link
                  to="/analyzer"
                  className="inline-flex items-center gap-2 bg-white text-[var(--clr-primary)] font-bold px-8 py-4 rounded-xl hover:bg-[var(--clr-primary-subtle-bg)] hover:text-[var(--clr-primary)] transition-colors shadow-lg"
                >
                  Launch Analyzer
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="Hologram Truth Analyzer" className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-bold text-sm text-[var(--text-primary)]">Hologram Truth Analyzer</span>
            </div>
            <p className="text-sm text-[var(--text-tertiary)]">
              Team TruthGuardians &middot; BlueBit Hackathon 4.0
            </p>
          </div>
        </footer>

      </div>
      {/* END SECTION 4 */}

    </div>
  );
}
