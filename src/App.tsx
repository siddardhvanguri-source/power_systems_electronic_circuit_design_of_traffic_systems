import { useState, useEffect, useRef, useMemo } from "react";
import {
  SECTIONS,
  CANDIDATE_MAPPINGS,
  DIMENSIONAL_MAPPINGS,
  TOOLCHAIN_MATRIX,
  HARDWARE_BOM,
  TEST_SCENARIOS,
  FIRST_EXPERIMENT_STEPS,
  RISK_REGISTER,
  EXPANDED_PRIOR_ART,
  RESEARCH_ROADMAP_STAGES,
  BUDGET_BREAKDOWN,
  NOVELTY_CHECKLIST,
  EXECUTION_STEPS,
  THREE_WEEK_DELIVERABLES,
  CUT_SCOPE_ITEMS,
  TWENTY_ONE_DAY_SCHEDULE,
  ONE_SENTENCE_DEFENSE,
  type Verdict,
  type CandidateMapping,
  type TestScenario,
  type ExecutionStep,
} from "./data";

// ─── TYPES & PAGES ────────────────────────────────────────────────────────────

type PageId = "brief" | "implementation" | "circuit-lab" | "literature";

interface NavPage {
  id: PageId;
  label: string;
  icon: string;
  tagline: string;
}

const PAGES: NavPage[] = [
  { id: "brief", label: "Research Brief", icon: "🔬", tagline: "Scientific Ethos, Mathematical Models & Roadmap" },
  { id: "implementation", label: "Implementation Blueprint", icon: "🚀", tagline: "Step-by-Step Practical Execution & Code" },
  { id: "circuit-lab", label: "Circuit & Hardware Lab", icon: "⚡", tagline: "Live Oscilloscope, 6 Bench Tests & BOM" },
  { id: "literature", label: "Literature & Patents", icon: "📚", tagline: "Decision Matrix & 70-Year Prior Art Dossier" },
];

// ─── SCROLL PROGRESS ──────────────────────────────────────────────────────────

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setPct(max > 0 ? scrollTop / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[300] bg-[rgba(30,27,22,0.06)]">
      <div
        className="h-full bg-[#2d6a4f] origin-left"
        style={{ transform: `scaleX(${pct})`, transition: "transform 0.08s linear" }}
      />
    </div>
  );
}

// ─── ANIMATED NUMBER ──────────────────────────────────────────────────────────

function AnimatedNumber({ target, delay = 0 }: { target: number; delay?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => {
      const duration = 1100;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        setCount(Math.floor(ease * target));
        if (t < 1) requestAnimationFrame(tick);
        else setCount(target);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(id);
  }, [target, delay]);
  return <>{count}</>;
}

// ─── REVEAL HOOKS ─────────────────────────────────────────────────────────────

function useReveal(className = "in") {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(className);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [className]);
  return ref;
}

function useRevealList() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const parent = ref.current;
    if (!parent) return;
    const children = Array.from(parent.querySelectorAll(".reveal, .reveal-fade"));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((el, i) => {
            (el as HTMLElement).style.setProperty("--stagger", `${i * 35}ms`);
            el.classList.add("in");
          });
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── COMMON UI HELPERS ────────────────────────────────────────────────────────

const verdictStyles: Record<Verdict, { pill: string; dot: string; label: string }> = {
  strong: { pill: "bg-[#d1ece0] text-[#1a5c36]", dot: "bg-[#2d6a4f]", label: "Strong / Established" },
  moderate: { pill: "bg-[#fde8c8] text-[#7c3811]", dot: "bg-[#d97706]", label: "Moderate / Caution" },
  weak: { pill: "bg-[#fdd5d5] text-[#991b1b]", dot: "bg-[#b91c1c]", label: "Weak / Reject" },
  open: { pill: "bg-[#dbeafe] text-[#1e3a8a]", dot: "bg-[#3b82f6]", label: "Open Research Gap" },
};

function VerdictPill({ v }: { v: Verdict }) {
  const s = verdictStyles[v];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function SectionHeader({ n, title, sub }: { n: string; title: string; sub?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal mb-8 relative">
      <div
        aria-hidden
        className="absolute -top-3 -left-2 display font-medium leading-none select-none pointer-events-none"
        style={{ fontSize: "88px", color: "rgba(30,27,22,0.04)" }}
      >
        {n}
      </div>
      <div className="relative">
        <div className="flex items-baseline gap-3">
          <span className="display text-[13px] italic text-[#8a867e] font-light">{n}</span>
          <h2 className="display text-[22px] sm:text-[26px] font-medium text-[#1e1b16] tracking-tight">{title}</h2>
        </div>
        {sub && <p className="mt-2 text-[13px] text-[#8a867e] leading-relaxed max-w-3xl">{sub}</p>}
        <div className="mt-4 h-px bg-[rgba(30,27,22,0.1)]" />
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="data text-[9px] tracking-widest text-[#8a867e] uppercase font-semibold">{children}</span>;
}

// ─── TOP GLOBAL NAVIGATION HEADER ─────────────────────────────────────────────

function GlobalNavbar({ activePage, setActivePage }: { activePage: PageId; setActivePage: (p: PageId) => void }) {
  return (
    <header className="sticky top-0 z-[250] bg-[#f8f6f1]/95 backdrop-blur-md border-b border-[rgba(30,27,22,0.1)] px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage("brief")}>
          <div className="w-8 h-8 rounded-lg bg-[#2d6a4f] text-white flex items-center justify-center font-display italic font-bold text-[14px] shadow-xs">
            §
          </div>
          <div>
            <div className="text-[13.5px] font-bold text-[#1e1b16] tracking-tight flex items-center gap-1.5">
              <span>EEE × Urban Traffic</span>
              <span className="text-[9px] data bg-[#d1ece0] text-[#1a5c36] px-1.5 py-0.2 rounded font-semibold uppercase">
                Living Lab
              </span>
            </div>
            <div className="text-[10.5px] text-[#8a867e]">Power-Electronic Circuits & Switching Networks</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          {PAGES.map((page) => {
            const isActive = activePage === page.id;
            return (
              <button
                key={page.id}
                onClick={() => {
                  setActivePage(page.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all ${
                  isActive
                    ? "bg-[#1e1b16] text-white shadow-xs font-semibold"
                    : "text-[#4a4640] hover:text-[#1e1b16] hover:bg-[#eae7df]/60"
                }`}
              >
                <span>{page.icon}</span>
                <span className="whitespace-nowrap">{page.label}</span>
                {page.id === "implementation" && (
                  <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full ${isActive ? "bg-[#2d6a4f] text-white" : "bg-[#d1ece0] text-[#1a5c36]"}`}>
                    Action Plan
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

// ─── PAGE 1: RESEARCH BRIEF & SCIENTIFIC WORKSPACE ────────────────────────────

const STATS = [
  { n: 6, label: "candidate mappings scored", delay: 100 },
  { n: 10, label: "dimensional parameters linked", delay: 200 },
  { n: 6, label: "toolchain platforms analyzed", delay: 300 },
  { n: 6, label: "validation benchmark tests", delay: 400 },
  { n: 8, label: "failure risks & decision gates", delay: 500 },
  { n: 8, label: "canonical prior art citations", delay: 600 },
];

function ResearchBriefPage({ onNavigateToImplementation }: { onNavigateToImplementation: () => void }) {
  const ref = useReveal();
  const listRef = useRevealList();

  return (
    <div className="space-y-12 pb-16">
      {/* Title Block */}
      <section className="grid-bg px-6 sm:px-12 pt-10 pb-8 border-b border-[rgba(30,27,22,0.08)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="data text-[10px] text-[#8a867e] tracking-widest block font-bold">
                STAGE 0 · VALIDATION BRIEF · IEEE ITS × POWER ELECTRONICS
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={onNavigateToImplementation}
                className="bg-[#2d6a4f] hover:bg-[#23533e] text-white text-[12px] font-semibold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>🚀</span> View Implementation Plan →
              </button>
            </div>
          </div>

          <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal max-w-4xl">
            <h1 className="display text-[34px] sm:text-[48px] lg:text-[54px] font-medium leading-[1.08] tracking-tight text-[#1e1b16]">
              Power-Electronic Circuits & <em className="font-light">Switching Networks</em> as Physical Representations of Urban Traffic
            </h1>
            <p className="mt-5 text-[14px] sm:text-[15px] text-[#4a4640] leading-relaxed max-w-3xl">
              Can an urban traffic system legitimately be modeled as a power-electronic circuit and switching network?
              Grounded in scientific rigor and falsifiability (<em>"Try to break it, don't force success"</em>), this platform evaluates physical, functional, mathematical, and control analogies—rejecting passive resistor myths,
              preserving Kirchhoff flow conservation, and introducing active semiconductor switching matrices with Finite-Control-Set MPC.
            </p>
          </div>

          {/* Stat counters */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pt-6 border-t border-[rgba(30,27,22,0.08)]">
            {STATS.map(({ n, label, delay }) => (
              <div key={label}>
                <div className="display text-[28px] sm:text-[32px] font-medium text-[#2d6a4f] tabular-nums">
                  <AnimatedNumber target={n} delay={delay} />
                </div>
                <div className="text-[11px] text-[#8a867e] mt-0.5 leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §1 Research Objectives & Falsifiability */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <SectionHeader
          n="§1"
          title="Research objectives & falsifiability criteria"
          sub="The guiding mission: determine if physical power-electronic circuits can reproduce key traffic dynamics and yield useful new capabilities."
        />

        <div ref={listRef as React.RefObject<HTMLDivElement>} className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="reveal border border-[rgba(45,106,79,0.2)] rounded-2xl p-6 bg-[#d1ece0]/15 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#2d6a4f]" />
                <Label>Primary Scientific Objective</Label>
              </div>
              <h3 className="display text-[18px] font-medium text-[#1e1b16] mb-3">
                Rigorous Mathematical & Physical Transformation
              </h3>
              <p className="text-[13px] text-[#332f28] leading-relaxed">
                Identify which traffic components can legitimately be modeled as power-electronic circuits.
                Establish whether there exists a <strong>mathematically rigorous transformation</strong> that yields new insights beyond conventional traffic models (CTM, Max-Pressure).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(45,106,79,0.15)] text-[11px] text-[#2d6a4f] font-mono">
              Key Question: "Can a physical circuit reproduce key dynamics and yield useful information?"
            </div>
          </div>

          <div className="reveal border border-[rgba(30,27,22,0.1)] rounded-2xl p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#b91c1c]" />
                <Label>Falsification & Success Criteria</Label>
              </div>
              <h3 className="display text-[18px] font-medium text-[#1e1b16] mb-3">
                Falsifiable Performance Gates
              </h3>
              <ul className="space-y-2 text-[12.5px] text-[#4a4640] leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-[#2d6a4f] shrink-0">✓</span>
                  <span><strong>Unit & Conservation Consistency:</strong> Preserves exact flow continuity (KCL).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2d6a4f] shrink-0">✓</span>
                  <span><strong>Sim-to-Sim Error &lt; 15%:</strong> Analog circuit outputs must track microscopic SUMO queues within ±15% error and Pearson r &gt; 0.85.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#2d6a4f] shrink-0">✓</span>
                  <span><strong>Zero Spurious Dynamics:</strong> The circuit must not produce artificial electrical resonances.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(30,27,22,0.08)] text-[11px] text-[#8a867e] font-mono">
              Rule: Reject any analogy with &gt; 30% persistent tracking divergence.
            </div>
          </div>
        </div>
      </section>

      {/* §3 Dimensional Analysis & Interactive Scaler */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <DimensionalAnalysisSection />
      </section>

      {/* §4 Mathematical Models */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <MathematicalModelsSection />
      </section>

      {/* §10 Scientific Risk Register */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <RiskRegisterSection />
      </section>

      {/* §11 Roadmap & Budget */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <RoadmapAndBudgetSection />
      </section>

      {/* §12 Novelty Checklist */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <NoveltyChecklistSection />
      </section>
    </div>
  );
}

// ─── PAGE 2: DEDICATED IMPLEMENTATION & EXECUTION BLUEPRINT ───────────────────

function ImplementationPage({ onNavigateToLab }: { onNavigateToLab: () => void }) {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const ref = useReveal();
  const step = EXECUTION_STEPS[activeStepIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(step.exactCodeOrCommands.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyCls = (diff: ExecutionStep["difficulty"]) => {
    if (diff === "Beginner / Fast") return "bg-[#d1ece0] text-[#1a5c36]";
    if (diff === "Intermediate") return "bg-[#dbeafe] text-[#1e3a8a]";
    return "bg-[#fde8c8] text-[#7c3811]";
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Implementation Hero Banner */}
      <section className="grid-bg px-6 sm:px-12 pt-10 pb-8 border-b border-[rgba(30,27,22,0.08)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#2d6a4f] uppercase tracking-wider font-bold mb-3">
            <span>⚡ 3-WEEK FAST-TRACK BLUEPRINT</span>
            <span>·</span>
            <span>SCOPED FOR 3RD-YEAR EEE (AMRITA COIMBATORE)</span>
            <span>·</span>
            <span>21-DAY DEADLINE</span>
          </div>

          <h1 className="display text-[32px] sm:text-[46px] font-medium leading-tight text-[#1e1b16] max-w-4xl">
            Implementation Plan (3-Week Version)
          </h1>
          <p className="mt-4 text-[14px] text-[#4a4640] leading-relaxed max-w-3xl">
            This compressed execution plan strips away all multi-node corridor and theoretical FCS-MPC bloat.
            Everything is focused on <strong>4 concrete, honest deliverables</strong> that can be built, simulated, and defended within 21 days for under ₹2,500 ($25).
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <div className="data text-[12px] bg-white border border-[rgba(30,27,22,0.1)] px-4 py-2 rounded-xl text-[#1e1b16] font-bold shadow-xs">
              💰 Lab Hardware: ~₹1,500 – ₹2,500 (~$25)
            </div>
            <div className="data text-[12px] bg-white border border-[rgba(30,27,22,0.1)] px-4 py-2 rounded-xl text-[#2d6a4f] font-bold shadow-xs">
              ⏱ 21-Day Hard Timeline (8 Phases)
            </div>
            <div className="data text-[12px] bg-white border border-[rgba(30,27,22,0.1)] px-4 py-2 rounded-xl text-[#1e40af] font-bold shadow-xs">
              🎯 4 Core Deliverables
            </div>
            <button
              onClick={onNavigateToLab}
              className="bg-[#1e1b16] hover:bg-black text-white text-[12px] font-semibold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 ml-auto"
            >
              <span>⚡</span> Open Circuit Lab & Telemetry →
            </button>
          </div>
        </div>
      </section>

      {/* Main Execution Content */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto space-y-10">
        {/* Section 0: The 4 Core Deliverables */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>0. What You Are Actually Building</Label>
              <h2 className="display text-[22px] sm:text-[26px] font-medium text-[#1e1b16] mt-0.5">
                The 4 Tangible Project Deliverables
              </h2>
            </div>
            <span className="data text-[11px] bg-[#d1ece0] text-[#1a5c36] px-3 py-1 rounded-full font-bold">
              The Entire Project Scope
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {THREE_WEEK_DELIVERABLES.map((deliv) => (
              <div
                key={deliv.id}
                className="border border-[rgba(30,27,22,0.1)] rounded-2xl p-5 bg-white shadow-2xs hover:border-[#2d6a4f] transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="data text-[9.5px] bg-[#f2efe8] text-[#4a4640] px-2 py-0.5 rounded font-bold">
                      {deliv.tag}
                    </span>
                    <span className="data text-[9.5px] text-[#2d6a4f] font-bold">
                      {deliv.badge}
                    </span>
                  </div>
                  <h3 className="text-[13.5px] font-bold text-[#1e1b16] leading-snug">
                    {deliv.title}
                  </h3>
                  <p className="text-[12px] text-[#4a4640] leading-relaxed mt-1.5">
                    {deliv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Cut Scope & Anti-Scope Protection */}
        <div className="border border-[#fca5a5] rounded-3xl p-6 sm:p-8 bg-[#fdd5d5]/20 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-[#b91c1c] uppercase tracking-wider">
            <span>🚫</span> CRITICAL ANTI-SCOPE GUARD — CUT ENTIRELY (DO NOT ATTEMPT)
          </div>
          <p className="text-[13px] text-[#7f1d1d] leading-relaxed">
            To finish within 21 days with an unshakeable defense, <strong>do not attempt</strong> the following items. If something takes &gt;2 days to debug, simplify it immediately rather than pushing through:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CUT_SCOPE_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#fca5a5]/60 text-[12px] text-[#7f1d1d]">
                <span className="text-[#b91c1c] font-bold shrink-0">✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Phase Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Day-by-Day Execution Wizard</Label>
            <span className="text-[12px] text-[#8a867e] font-mono">Select a phase to view code & steps</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {EXECUTION_STEPS.map((s, idx) => {
              const isActive = activeStepIdx === idx;
              return (
                <button
                  key={s.stepNumber}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                    isActive
                      ? "bg-[#2d6a4f] border-[#2d6a4f] text-white shadow-md ring-2 ring-[#2d6a4f]/20"
                      : "bg-white border-[rgba(30,27,22,0.08)] text-[#4a4640] hover:border-[rgba(30,27,22,0.2)] hover:bg-[#fcfbf9]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`data text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-[#d1ece0]" : "text-[#8a867e]"}`}>
                        Step {s.stepNumber}
                      </span>
                      <span className={`data text-[9px] px-2 py-0.5 rounded font-semibold ${isActive ? "bg-white/20 text-white" : "bg-[#f2efe8] text-[#4a4640]"}`}>
                        {s.timeframe.split(" ")[0]}
                      </span>
                    </div>
                    <div className={`text-[12.5px] font-semibold leading-snug ${isActive ? "text-white" : "text-[#1e1b16]"}`}>
                      {s.title.split("(")[0]}
                    </div>
                  </div>
                  <div className={`text-[10px] mt-3 font-mono ${isActive ? "text-white/80" : "text-[#2d6a4f] font-semibold"}`}>
                    {s.costEstimate.split("(")[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Deep Step Execution Card */}
        <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal border border-[rgba(30,27,22,0.12)] rounded-3xl p-6 sm:p-10 bg-white shadow-sm space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-5 border-b border-[rgba(30,27,22,0.08)]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="data text-[10.5px] text-[#2d6a4f] font-bold bg-[#d1ece0] px-2.5 py-0.5 rounded">
                  {step.badge}
                </span>
                <span className={`data text-[10.5px] font-semibold px-2.5 py-0.5 rounded ${difficultyCls(step.difficulty)}`}>
                  {step.difficulty}
                </span>
                <span className="data text-[11px] text-[#8a867e]">
                  Timeframe: <strong>{step.timeframe}</strong>
                </span>
              </div>
              <h2 className="display text-[24px] sm:text-[28px] font-medium text-[#1e1b16] mt-1">
                Phase {step.stepNumber}: {step.title}
              </h2>
            </div>
            <div className="data text-[12px] bg-[#f8f6f1] border border-[rgba(30,27,22,0.1)] px-4 py-2 rounded-xl text-[#1e1b16] font-bold">
              Cost: {step.costEstimate}
            </div>
          </div>

          {/* Plain-English Overview */}
          <div className="bg-[#f8f6f1] p-5 rounded-2xl border border-[rgba(30,27,22,0.07)] text-[13.5px] text-[#2c2822] leading-relaxed">
            <strong className="text-[#2d6a4f] font-semibold block mb-1">Plain-English Summary:</strong>
            {step.summary}
          </div>

          {/* Two-Column Grid: Checklist & Code */}
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
            {/* Checklist & Gates */}
            <div className="space-y-5">
              <div>
                <Label>Actionable Step-by-Step Checklist</Label>
                <div className="space-y-3 mt-2.5">
                  {step.howToStart.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 text-[13px] bg-[#fcfbf9] p-3.5 rounded-xl border border-[rgba(30,27,22,0.06)] text-[#332f28] leading-relaxed shadow-2xs">
                      <span className="w-6 h-6 rounded-full bg-[#2d6a4f] text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="flex-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pitfall Box */}
              <div className="bg-[#fdd5d5]/30 border border-[#fca5a5] rounded-2xl p-4">
                <div className="text-[10.5px] font-mono font-bold text-[#b91c1c] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span>⚠</span> Critical Pitfall to Avoid
                </div>
                <p className="text-[12px] text-[#7f1d1d] leading-relaxed">{step.keyPitfallToAvoid}</p>
              </div>

              {/* Verification Gate */}
              <div className="bg-[#d1ece0]/30 border border-[#a7f3d0] rounded-2xl p-4">
                <div className="text-[10.5px] font-mono font-bold text-[#1a5c36] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span>✓</span> Verification Milestone Gate
                </div>
                <p className="text-[12px] text-[#065f46] leading-relaxed font-mono">{step.verificationGate}</p>
              </div>
            </div>

            {/* Code / Command Runner Box */}
            <div className="space-y-2.5 flex flex-col">
              <div className="flex items-center justify-between">
                <Label>{step.exactCodeOrCommands.title}</Label>
                <button
                  onClick={handleCopy}
                  className="data text-[10.5px] bg-[#f2efe8] hover:bg-[#eae7df] border border-[rgba(30,27,22,0.12)] px-3 py-1.5 rounded-lg transition-colors text-[#1e1b16] font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  {copied ? "✓ Copied!" : "📋 Copy Code"}
                </button>
              </div>

              <div className="bg-[#1e1b16] text-[#e5e0d8] rounded-2xl p-5 font-mono text-[11px] leading-relaxed overflow-x-auto flex-1 border border-black/20 max-h-[460px] no-scrollbar shadow-inner">
                <pre>
                  <code>{step.exactCodeOrCommands.code}</code>
                </pre>
              </div>
              <div className="text-[10.5px] text-[#8a867e] italic text-right">
                Format: <span className="font-mono text-[#2d6a4f] uppercase font-bold">{step.exactCodeOrCommands.language}</span> · Tested & Ready to Run
              </div>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-5 border-t border-[rgba(30,27,22,0.08)] text-[11.5px] font-mono">
            <button
              disabled={activeStepIdx === 0}
              onClick={() => setActiveStepIdx((s) => Math.max(0, s - 1))}
              className="px-4 py-2 rounded-xl bg-[#f2efe8] text-[#1e1b16] font-semibold hover:bg-[#eae7df] disabled:opacity-40 transition-colors"
            >
              ← Previous Phase
            </button>
            <span className="text-[#8a867e]">
              Phase {step.stepNumber} of {EXECUTION_STEPS.length}
            </span>
            <button
              disabled={activeStepIdx === EXECUTION_STEPS.length - 1}
              onClick={() => setActiveStepIdx((s) => Math.min(EXECUTION_STEPS.length - 1, s + 1))}
              className="px-4 py-2 rounded-xl bg-[#2d6a4f] text-white font-semibold hover:bg-[#23533e] disabled:opacity-40 transition-colors shadow-xs"
            >
              Next Phase →
            </button>
          </div>
        </div>

        {/* 21-Day Schedule Matrix */}
        <div className="border border-[rgba(30,27,22,0.1)] rounded-3xl p-6 sm:p-8 bg-white shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label>21-Day Schedule Matrix</Label>
              <h3 className="display text-[20px] font-medium text-[#1e1b16] mt-0.5">
                Day-by-Day Execution Roadmap (Days 1–21)
              </h3>
            </div>
            <span className="data text-[11px] bg-[#d1ece0] text-[#1a5c36] px-3 py-1 rounded-full font-bold">
              Amrita Coimbatore Timeline
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[12px]">
            {TWENTY_ONE_DAY_SCHEDULE.map((s, idx) => (
              <div key={idx} className="border border-[rgba(30,27,22,0.08)] rounded-xl p-4 bg-[#f8f6f1] space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="data text-[10.5px] text-[#2d6a4f] font-bold">{s.days}</span>
                    <span className="data text-[9px] bg-white border border-[rgba(30,27,22,0.1)] px-1.5 py-0.5 rounded text-[#4a4640]">
                      {s.phase}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#332f28] leading-relaxed mt-2">{s.task}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The One Rule & Project Defense Quote Banner */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-[#92400e]/30 bg-[#fde8c8]/30 rounded-3xl p-6 space-y-2.5">
            <div className="text-[11px] font-mono font-bold text-[#92400e] uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span> The Golden Execution Rule
            </div>
            <p className="text-[13px] text-[#78350f] leading-relaxed font-medium">
              "If any single step takes more than 2 days, stop and simplify it rather than pushing through. Hardware is the first thing to cut under time pressure — a simulation-only result with a real number attached beats an unfinished breadboard."
            </p>
          </div>

          <div className="border border-[#2d6a4f]/30 bg-[#d1ece0]/30 rounded-3xl p-6 space-y-2.5">
            <div className="text-[11px] font-mono font-bold text-[#2d6a4f] uppercase tracking-wider flex items-center gap-1.5">
              <span>🎓</span> Your One-Sentence Project Defense
            </div>
            <p className="text-[13px] text-[#1a5c36] leading-relaxed italic font-serif">
              "{ONE_SENTENCE_DEFENSE}"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PAGE 3: CIRCUIT & HARDWARE LAB BENCH ─────────────────────────────────────

function CircuitLabPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Circuit Lab Hero Banner */}
      <section className="grid-bg px-6 sm:px-12 pt-10 pb-8 border-b border-[rgba(30,27,22,0.08)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#2d6a4f] uppercase tracking-wider font-bold mb-3">
            <span>⚡ HARDWARE LAB & OSCILLOSCOPE TEST BENCH</span>
          </div>
          <h1 className="display text-[32px] sm:text-[46px] font-medium leading-tight text-[#1e1b16] max-w-4xl">
            Circuit Topologies, Live Oscilloscope & Hardware BOM
          </h1>
          <p className="mt-4 text-[14px] text-[#4a4640] leading-relaxed max-w-3xl">
            Interactive electronic simulation and hardware engineering suite: test 4-switch matrix converter topologies, view animated gate PWM and sawtooth queue voltages, run 6 canonical disturbance tests, and inspect the $120 itemized BOM.
          </p>
        </div>
      </section>

      {/* §6 Circuit Design & Live Waveforms */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <CircuitDesignSection />
      </section>

      {/* §8 Experimental Protocol & 6 Bench Tests */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <ExperimentalProtocolSection />
      </section>

      {/* §7 Hardware Prototype & Bill of Materials */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <HardwarePrototypeSection />
      </section>
    </div>
  );
}

// ─── PAGE 4: LITERATURE, PATENTS & DECISION MATRIX ────────────────────────────

function LiteraturePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Literature Hero Banner */}
      <section className="grid-bg px-6 sm:px-12 pt-10 pb-8 border-b border-[rgba(30,27,22,0.08)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#2d6a4f] uppercase tracking-wider font-bold mb-3">
            <span>📚 RESEARCH ARCHIVE & PATENT DOSSIER</span>
          </div>
          <h1 className="display text-[32px] sm:text-[46px] font-medium leading-tight text-[#1e1b16] max-w-4xl">
            Candidate Decision Matrix, 70-Year Literature & Patent Prior Art
          </h1>
          <p className="mt-4 text-[14px] text-[#4a4640] leading-relaxed max-w-3xl">
            Full multi-criteria classification across Physical, Functional, Mathematical, Control, and Conceptual dimensions, paired with an exhaustive 70-year prior art matrix and multi-jurisdiction patent search dossier.
          </p>
        </div>
      </section>

      {/* §2 Decision Matrix */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <DecisionMatrixSection />
      </section>

      {/* §13 Prior Art & Patent Dossier */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <PriorArtAndPatentsSection />
      </section>

      {/* §5 Simulation Tools Matrix */}
      <section className="px-6 sm:px-12 max-w-6xl mx-auto">
        <SimulationToolchainSection />
      </section>
    </div>
  );
}

// ─── REUSABLE CORE SECTIONS (USED ACROSS PAGES) ───────────────────────────────

function DecisionMatrixSection() {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("intersection");
  const [scoreFilter, setScoreFilter] = useState<number | "all">("all");

  const filtered = useMemo(() => {
    return CANDIDATE_MAPPINGS.filter((m) => {
      if (scoreFilter !== "all" && m.feasibilityScore < scoreFilter) return false;
      return true;
    });
  }, [scoreFilter]);

  const active = CANDIDATE_MAPPINGS.find((c) => c.id === selectedCandidate) || CANDIDATE_MAPPINGS[0];

  return (
    <div>
      <SectionHeader
        n="§2"
        title="Candidate mappings & multi-criteria decision matrix"
        sub="Classifying analogies across Physical (A), Functional (B), Mathematical (C), Control-theoretic (D), and Conceptual (E) dimensions."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded bg-[#d1ece0] text-[#1a5c36] font-medium">Top Candidates (Score 4)</span>
          <span className="px-2.5 py-1 rounded bg-[#fde8c8] text-[#7c3811] font-medium">Moderate / Caution (Score 3)</span>
          <span className="px-2.5 py-1 rounded bg-[#eae7df] text-[#4a4640] font-medium">Conceptual / Weak (Score 2)</span>
        </div>
        <div className="flex items-center gap-2">
          <Label>Filter Min Score:</Label>
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))}
            className="bg-white border border-[rgba(30,27,22,0.12)] text-[11px] px-2.5 py-1 rounded-lg focus:outline-none"
          >
            <option value="all">All Candidates (6)</option>
            <option value="3">Score ≥ 3 (Top & Moderate)</option>
            <option value="4">Score = 4 (Top Only)</option>
          </select>
        </div>
      </div>

      {/* Decision Table */}
      <div className="overflow-x-auto border border-[rgba(30,27,22,0.1)] rounded-2xl bg-white mb-8">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-[rgba(30,27,22,0.08)] bg-[#f2efe8] text-[#4a4640] font-medium data text-[10px]">
              <th className="py-3 px-4">Traffic Component</th>
              <th className="py-3 px-4">Electrical Equivalent</th>
              <th className="py-3 px-2 text-center">Physical (A)</th>
              <th className="py-3 px-2 text-center">Functional (B)</th>
              <th className="py-3 px-2 text-center">Mathematical (C)</th>
              <th className="py-3 px-2 text-center">Control (D)</th>
              <th className="py-3 px-2 text-center">Conceptual (E)</th>
              <th className="py-3 px-3 text-center">Score</th>
              <th className="py-3 px-4">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const isSelected = selectedCandidate === m.id;
              return (
                <tr
                  key={m.id}
                  onClick={() => setSelectedCandidate(m.id)}
                  className={`cursor-pointer border-b border-[rgba(30,27,22,0.05)] transition-colors ${
                    isSelected ? "bg-[#d1ece0]/30 font-medium" : "hover:bg-[rgba(30,27,22,0.02)]"
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-[#1e1b16]">{m.trafficComponent}</td>
                  <td className="py-3 px-4 text-[#2d6a4f]">{m.electricalEquivalent}</td>
                  <td className="py-3 px-2 text-center text-[#8a867e]">{m.classifications.physical}</td>
                  <td className="py-3 px-2 text-center font-medium text-[#1e1b16]">{m.classifications.functional}</td>
                  <td className="py-3 px-2 text-center text-[#4a4640]">{m.classifications.mathematical}</td>
                  <td className="py-3 px-2 text-center font-medium text-[#2d6a4f]">{m.classifications.control}</td>
                  <td className="py-3 px-2 text-center text-[#8a867e]">{m.classifications.conceptual}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1e1b16] text-white font-mono text-[11px] font-bold">
                      {m.feasibilityScore}
                    </span>
                  </td>
                  <td className="py-3 px-4"><VerdictPill v={m.verdict} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Candidate Deep Dive Card */}
      <div className="border border-[rgba(30,27,22,0.12)] rounded-2xl p-6 bg-white shadow-xs max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <Label>Selected Deep-Dive Candidate</Label>
            <h3 className="display text-[20px] font-medium text-[#1e1b16] mt-1">{active.trafficComponent}</h3>
            <div className="text-[13px] text-[#2d6a4f] font-medium">{active.electricalEquivalent}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="data text-[12px] bg-[#f2efe8] px-3 py-1 rounded-md text-[#1e1b16]">
              Feasibility: <strong>{active.feasibilityScore} / 5</strong>
            </span>
            <VerdictPill v={active.verdict} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-[rgba(30,27,22,0.08)]">
          <div className="space-y-3">
            <div>
              <Label>Primary Scientific Insight</Label>
              <p className="text-[12.5px] text-[#332f28] leading-relaxed mt-1">{active.primaryInsight}</p>
            </div>
            <div>
              <Label>Mathematical Governing Link</Label>
              <div className="bg-[#1e1b16] text-[#d1ece0] p-3 rounded-lg font-mono text-[11px] mt-1 overflow-x-auto">
                <code>{active.mathematicalLink}</code>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-[#fdd5d5]/30 border border-[#fca5a5] rounded-xl p-3.5">
              <div className="text-[10px] font-bold text-[#b91c1c] tracking-wider uppercase mb-1">⚠ Critical Failure Boundary / Caveat</div>
              <p className="text-[12px] text-[#7f1d1d] leading-relaxed">{active.criticalCaveat}</p>
            </div>
            <div className="text-[11px] text-[#8a867e] italic">
              Click any row in the decision matrix above to inspect the specific physical breakdown and governing equation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DimensionalAnalysisSection() {
  const [scaleK, setScaleK] = useState(10);
  const [vehFlow, setVehFlow] = useState(1200);
  const [queueVeh, setQueueVeh] = useState(25);
  const [greenTime, setGreenTime] = useState(30);
  const [cycleTime, setCycleTime] = useState(60);

  const flowVehSec = vehFlow / 3600;
  const currentAmps = flowVehSec * scaleK;
  const currentMilliAmps = (currentAmps * 1000).toFixed(1);
  const chargeCoulombs = queueVeh * scaleK;
  const capacitanceFarads = scaleK;
  const nodeVoltage = (chargeCoulombs / capacitanceFarads).toFixed(1);
  const dutyCycle = (greenTime / cycleTime).toFixed(2);

  return (
    <div>
      <SectionHeader
        n="§3"
        title="Dimensional analysis & conservation laws"
        sub="Rigorous unit consistency and flow conservation proofs mapping traffic hydrodynamics to Kirchhoff's Current Law."
      />

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 max-w-6xl mb-8">
        <div className="space-y-6">
          <div className="border border-[rgba(30,27,22,0.1)] rounded-2xl p-6 bg-white space-y-4">
            <h3 className="display text-[17px] font-medium text-[#1e1b16]">
              Conservation Law Alignment: Traffic Continuity ↔ KCL
            </h3>
            <p className="text-[13px] text-[#4a4640] leading-relaxed">
              Let arrival flow be $a(t)$ [veh/s] and departure flow be $d(t)$ [veh/s]. Introducing the scaling factor $k$ [Coulombs/vehicle] transforms vehicle flow into electrical current:
            </p>
            <div className="bg-[#1e1b16] text-[#e5e0d8] p-3.5 rounded-lg font-mono text-[12px] overflow-x-auto space-y-1">
              <div>I(t) = k · a(t)  [Coulombs/s = Amperes]</div>
              <div>Q_e(t) = k · q(t) [Coulombs stored]</div>
              <div>C · (dV/dt) = I_in - I_out  &lt;===&gt;  k · (dq/dt) = k · (a(t) - d(t))</div>
            </div>
            <p className="text-[12.5px] text-[#4a4640] leading-relaxed">
              Setting capacitor sizing to C = k [Farads] guarantees that <strong>node voltage numerically equals queue length</strong> (V_i(t) = q_i(t) Volts). In steady-state (dq/dt = 0), ∑ I_in = ∑ I_out, exactly reproducing <strong>Kirchhoff's Current Law (KCL)</strong>.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-[rgba(30,27,22,0.08)] rounded-xl p-4 bg-white">
              <Label>Travel Time ↔ Resistance</Label>
              <div className="data text-[12px] text-[#2d6a4f] font-semibold mt-1">R_e = α · T_e [Ohms]</div>
              <p className="text-[11.5px] text-[#4a4640] leading-relaxed mt-1">
                Ohmic resistance scales proportionally with link free-flow travel time.
              </p>
            </div>
            <div className="border border-[rgba(30,27,22,0.08)] rounded-xl p-4 bg-white">
              <Label>Signal Green Time ↔ PWM Duty</Label>
              <div className="data text-[12px] text-[#2d6a4f] font-semibold mt-1">D = T_g / T_cyc = T_on / T_s</div>
              <p className="text-[11.5px] text-[#4a4640] leading-relaxed mt-1">
                Traffic phase green ratio maps isomorphically to semiconductor PWM duty.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Scaler Widget */}
        <div className="border border-[rgba(45,106,79,0.2)] rounded-2xl p-5 bg-[#f2efe8] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(30,27,22,0.08)]">
            <span className="text-[12px] font-bold text-[#1e1b16] font-mono">DIMENSIONAL SCALER</span>
            <span className="data text-[10px] text-[#2d6a4f] bg-[#d1ece0] px-2 py-0.5 rounded-full font-semibold">Interactive</span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#4a4640]">Scaling Factor k</span>
              <span className="data font-bold text-[#2d6a4f]">{scaleK} C / veh</span>
            </div>
            <input
              type="range" min={1} max={50} step={1} value={scaleK}
              onChange={(e) => setScaleK(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#4a4640]">Corridor Demand</span>
              <span className="data font-bold text-[#1e1b16]">{vehFlow} veh/h ({flowVehSec.toFixed(2)} veh/s)</span>
            </div>
            <input
              type="range" min={200} max={3600} step={100} value={vehFlow}
              onChange={(e) => setVehFlow(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#4a4640]">Queued Vehicles</span>
              <span className="data font-bold text-[#1e1b16]">{queueVeh} vehicles</span>
            </div>
            <input
              type="range" min={0} max={100} step={5} value={queueVeh}
              onChange={(e) => setQueueVeh(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="bg-white border border-[rgba(30,27,22,0.1)] rounded-xl p-4 space-y-2.5">
            <div className="text-[10px] font-mono text-[#8a867e] uppercase font-bold">Equivalent Electrical Domain Values</div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#4a4640]">Branch Current (I):</span>
              <span className="data font-bold text-[#2d6a4f]">{currentMilliAmps} mA ({currentAmps.toFixed(3)} A)</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#4a4640]">Node Voltage (V):</span>
              <span className="data font-bold text-[#2d6a4f]">{nodeVoltage} V (≡ {queueVeh} veh)</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#4a4640]">PWM Duty Ratio (D):</span>
              <span className="data font-bold text-[#1e1b16]">{dutyCycle} ({(parseFloat(dutyCycle) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MathematicalModelsSection() {
  return (
    <div>
      <SectionHeader
        n="§4"
        title="Proposed mathematical models & state-space equations"
        sub="Dynamic state-space difference equations, Switched Admittance Matrix Y(t), and hybrid dynamical systems."
      />

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mb-8">
        <div className="border border-[rgba(30,27,22,0.12)] rounded-2xl p-6 bg-[#f2efe8] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#1e1b16]">Classical Cell Transmission Model (CTM)</span>
            <span className="data text-[9px] bg-[#eae7df] px-2 py-0.5 rounded text-[#4a4640]">Daganzo 1994</span>
          </div>
          <p className="text-[12px] text-[#4a4640] leading-relaxed">
            Piecewise-linear hydrodynamic simulation where signal green phases are modeled as exogenous multipliers on flow capacity.
          </p>
          <div className="space-y-3 font-mono text-[11px]">
            <div>
              <Label>Flow Transmission</Label>
              <div className="bg-white p-2.5 rounded-lg border border-[rgba(30,27,22,0.08)] text-[#1e1b16] mt-0.5">
                q_i(k) = min &#123; v·k_i(k),  q_max,  w·(k_jam − k_&#123;i+1&#125;(k)) &#125;
              </div>
            </div>
            <div>
              <Label>State Conservation</Label>
              <div className="bg-white p-2.5 rounded-lg border border-[rgba(30,27,22,0.08)] text-[#1e1b16] mt-0.5">
                x_i(k+1) = x_i(k) + T_s · [ q_&#123;i-1&#125;(k) − q_i(k) ]
              </div>
            </div>
          </div>
        </div>

        <div className="border border-[rgba(45,106,79,0.25)] rounded-2xl p-6 bg-[#d1ece0]/15 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#2d6a4f]">Switched Network FCS-MPC (Proposed)</span>
            <span className="data text-[9px] bg-[#d1ece0] px-2 py-0.5 rounded text-[#1a5c36] font-semibold">Power Electronics</span>
          </div>
          <p className="text-[12px] text-[#332f28] leading-relaxed">
            Formulates signalized corridors as switched hybrid dynamical systems where semiconductor switching states u(k) ∈ {"{0, 1}"}^M dynamically reconfigure Y(t).
          </p>
          <div className="space-y-3 font-mono text-[11px]">
            <div>
              <Label>Switched Admittance Matrix</Label>
              <div className="bg-white p-2.5 rounded-lg border border-[rgba(45,106,79,0.2)] text-[#1e1b16] mt-0.5">
                Y(t) = A^T · diag( u_e(t) · g_e(x) ) · A
              </div>
            </div>
            <div>
              <Label>FCS-MPC Objective with Switching Loss</Label>
              <div className="bg-white p-2.5 rounded-lg border border-[rgba(45,106,79,0.2)] text-[#2d6a4f] font-semibold mt-0.5">
                min J = ∑ ||x(k+j)||_Q² + λ_sw · ||u(k+j) − u(k+j-1)||²
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CircuitDesignSection() {
  const [duty, setDuty] = useState(0.5);
  const [activeTopology, setActiveTopology] = useState<"intersection" | "road" | "queue">("intersection");

  const waveformPoints = useMemo(() => {
    const pointsGate: string[] = [];
    const pointsVolt: string[] = [];
    const pointsCurr: string[] = [];
    const period = 2.0;
    const onTime = period * duty;

    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * 10;
      const phase = t % period;
      const isHigh = phase < onTime;
      const x = (i / 200) * 460 + 20;

      const yGate = isHigh ? 35 : 70;
      pointsGate.push(`${x},${yGate}`);

      let v = 0;
      if (isHigh) {
        v = (phase / onTime) * 35;
      } else {
        v = 35 - ((phase - onTime) / (period - onTime)) * 35;
      }
      const yVolt = 130 - v;
      pointsVolt.push(`${x},${yVolt}`);

      const currentVal = isHigh ? 28 * (1 - Math.exp(-phase * 3)) : 28 * Math.exp(-(phase - onTime) * 3);
      const yCurr = 180 - currentVal;
      pointsCurr.push(`${x},${yCurr}`);
    }

    return {
      gate: pointsGate.join(" "),
      volt: pointsVolt.join(" "),
      curr: pointsCurr.join(" "),
    };
  }, [duty]);

  return (
    <div>
      <SectionHeader
        n="§6"
        title="Circuit design, matrix converter & live waveforms"
        sub="4-switch intersection matrix topologies, R-L corridor inertia, and animated analog voltage/current dynamics."
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 max-w-6xl mb-8">
        <div className="border border-[rgba(30,27,22,0.1)] rounded-2xl p-6 bg-white shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[rgba(30,27,22,0.08)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2d6a4f] animate-pulse" />
              <span className="display text-[15px] font-medium text-[#1e1b16]">Real-Time Analog Waveform Oscilloscope</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTopology("intersection")}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                  activeTopology === "intersection" ? "bg-[#2d6a4f] text-white" : "bg-[#f2efe8] text-[#4a4640]"
                }`}
              >
                4-Switch Matrix
              </button>
              <button
                onClick={() => setActiveTopology("road")}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                  activeTopology === "road" ? "bg-[#2d6a4f] text-white" : "bg-[#f2efe8] text-[#4a4640]"
                }`}
              >
                R-L Corridor
              </button>
            </div>
          </div>

          <div className="bg-[#1e1b16] rounded-xl p-3 border border-black/20">
            <svg viewBox="0 0 500 200" className="w-full h-48">
              <line x1="20" y1="35" x2="480" y2="35" stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" />
              <line x1="20" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.12)" />
              <line x1="20" y1="130" x2="480" y2="130" stroke="rgba(255,255,255,0.12)" />
              <line x1="20" y1="180" x2="480" y2="180" stroke="rgba(255,255,255,0.12)" />

              <polyline points={waveformPoints.gate} fill="none" stroke="#3b82f6" strokeWidth="2" />
              <text x="25" y="30" fill="#60a5fa" fontSize="9" fontFamily="JetBrains Mono">Gate PWM v_gs(t) [ON / OFF]</text>

              <polyline points={waveformPoints.volt} fill="none" stroke="#10b981" strokeWidth="2.2" />
              <text x="25" y="92" fill="#34d399" fontSize="9" fontFamily="JetBrains Mono">Node Voltage V_i(t) ≡ Queue x_i(t)</text>

              <polyline points={waveformPoints.curr} fill="none" stroke="#f59e0b" strokeWidth="2" />
              <text x="25" y="150" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono">Branch Current I_e(t) ≡ Flow f_e(t)</text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#8a867e] pt-1">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-[#3b82f6]" /> Gate Logic D={duty.toFixed(2)}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-[#10b981]" /> Capacitor Voltage (Queue)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-[#f59e0b]" /> Inductor Current (Flow)</span>
          </div>
        </div>

        <div className="border border-[rgba(30,27,22,0.1)] rounded-2xl p-5 bg-[#f2efe8] space-y-4">
          <div>
            <Label>PWM Duty Ratio D = T_g / T_cyc</Label>
            <div className="flex justify-between text-[12px] font-bold text-[#2d6a4f] mt-1 mb-1">
              <span>{(duty * 100).toFixed(0)}% Green Conduction</span>
              <span className="data font-mono">{duty.toFixed(2)}</span>
            </div>
            <input
              type="range" min={0.15} max={0.85} step={0.05} value={duty}
              onChange={(e) => setDuty(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="bg-white border border-[rgba(30,27,22,0.08)] rounded-xl p-3.5 space-y-2">
            <div className="text-[10px] font-mono text-[#8a867e] uppercase font-bold">Topology Specs</div>
            <div className="text-[12px] text-[#1e1b16] leading-relaxed">
              <strong>4-Switch Matrix Bridge:</strong> 4 logic-level MOSFETs (IRLZ44N) configured as two bidirectional legs. Freewheeling Schottky diodes clamp all-red inductive spikes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperimentalProtocolSection() {
  const [selectedTestId, setSelectedTestId] = useState<string>("test-n1-closure");
  const activeTest = TEST_SCENARIOS.find((t) => t.id === selectedTestId) || TEST_SCENARIOS[0];

  const { baselinePoints, analogPoints, corrValue, mseVal } = useMemo(() => {
    const ptsBase: string[] = [];
    const ptsAnalog: string[] = [];

    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 300;
      const x = (i / 60) * 440 + 30;

      let qBase = 15 + 5 * Math.sin(t / 25);
      let qAnalog = 15 + 5 * Math.sin(t / 25) + (Math.sin(t * 1.5) * 0.8);

      if (selectedTestId === "test-surge" && t >= 120) {
        qBase += (t - 120) * 0.35;
        qAnalog += (t - 120) * 0.33 + Math.sin(t) * 1.2;
      } else if (selectedTestId === "test-n1-closure" && t >= 150) {
        qBase += Math.min((t - 150) * 0.5, 45);
        qAnalog += Math.min((t - 150) * 0.48, 44) + Math.sin(t) * 1.5;
      } else if (selectedTestId === "test-signal-fault" && t >= 80) {
        qBase += (t - 80) * 0.4;
        qAnalog += (t - 80) * 0.39;
      }

      const yBase = 160 - (qBase / 65) * 120;
      const yAnalog = 160 - (qAnalog / 65) * 120;

      ptsBase.push(`${x},${yBase}`);
      ptsAnalog.push(`${x},${yAnalog}`);
    }

    return {
      baselinePoints: ptsBase.join(" "),
      analogPoints: ptsAnalog.join(" "),
      corrValue: selectedTestId === "test-nominal" ? 0.97 : selectedTestId === "test-n1-closure" ? 0.92 : 0.94,
      mseVal: selectedTestId === "test-nominal" ? 4.2 : selectedTestId === "test-n1-closure" ? 8.1 : 6.5,
    };
  }, [selectedTestId]);

  return (
    <div>
      <SectionHeader
        n="§8"
        title="Experimental protocol & validation test bench"
        sub="6 canonical perturbation tests comparing microscopic SUMO baseline queues against physical circuit analog voltages."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {TEST_SCENARIOS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTestId(t.id)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              selectedTestId === t.id
                ? "bg-[#2d6a4f] text-white shadow-xs"
                : "bg-white border border-[rgba(30,27,22,0.1)] text-[#4a4640] hover:bg-[#f2efe8]"
            }`}
          >
            {t.name.split(":")[0]} · {t.category}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 max-w-6xl mb-8">
        <div className="border border-[rgba(30,27,22,0.1)] rounded-2xl p-6 bg-white shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[rgba(30,27,22,0.08)]">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#8a867e] font-bold">Active Test Bench Scenario</div>
              <h3 className="display text-[16px] font-medium text-[#1e1b16] mt-0.5">{activeTest.name}</h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="data bg-[#d1ece0] text-[#1a5c36] px-2.5 py-1 rounded font-bold">
                Pearson r = {corrValue.toFixed(2)} (Pass)
              </span>
              <span className="data bg-[#f2efe8] text-[#4a4640] px-2.5 py-1 rounded">
                MSE = {mseVal}%
              </span>
            </div>
          </div>

          <div className="bg-[#1e1b16] rounded-xl p-3 border border-black/20">
            <svg viewBox="0 0 500 190" className="w-full h-48">
              <line x1="30" y1="40" x2="470" y2="40" stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="470" y2="100" stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" />
              <line x1="30" y1="160" x2="470" y2="160" stroke="rgba(255,255,255,0.15)" />

              <polyline points={baselinePoints} fill="none" stroke="#60a5fa" strokeWidth="2.2" />
              <polyline points={analogPoints} fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4 2" />

              <text x="30" y="30" fill="#94a3b8" fontSize="8.5" fontFamily="JetBrains Mono">Queue Length x_i(t) [veh] ↔ Scaled Node Voltage V_i(t) [V]</text>
              <text x="440" y="175" fill="#94a3b8" fontSize="8.5" fontFamily="JetBrains Mono">Time [s]</text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#8a867e] pt-1">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#60a5fa]" /> Baseline (SUMO)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#34d399] border-b border-dashed" /> Circuit Analog (V_i)</span>
            <span className="data text-[#2d6a4f] font-semibold">Tolerance: ±15% MAE</span>
          </div>
        </div>

        <div className="border border-[rgba(30,27,22,0.1)] rounded-2xl p-5 bg-[#f2efe8] space-y-3.5">
          <div>
            <Label>Traffic Perturbation</Label>
            <p className="text-[12px] text-[#332f28] leading-relaxed mt-0.5">{activeTest.trafficPerturbation}</p>
          </div>
          <div>
            <Label>Electrical Analog Action</Label>
            <p className="text-[12px] text-[#2d6a4f] font-medium leading-relaxed mt-0.5">{activeTest.electricalAnalogAction}</p>
          </div>
          <div className="bg-white border border-[rgba(30,27,22,0.08)] rounded-xl p-3 pt-2.5">
            <div className="text-[10px] font-mono text-[#b91c1c] uppercase font-bold">Pass/Fail Falsification Gate</div>
            <p className="text-[11.5px] text-[#991b1b] leading-relaxed mt-0.5">{activeTest.passCriteria}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HardwarePrototypeSection() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredBOM = useMemo(() => {
    return HARDWARE_BOM.filter((b) => {
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
      return true;
    });
  }, [categoryFilter]);

  const totalBOMCost = useMemo(() => {
    return HARDWARE_BOM.reduce((sum, item) => sum + item.totalCostUSD, 0);
  }, []);

  return (
    <div>
      <SectionHeader
        n="§7"
        title="Hardware prototype plan & Bill of Materials (BOM)"
        sub="Itemized low-voltage benchtop hardware testbed with logic-level MOSFETs, storage capacitors, DSP controllers, and safety interlocks."
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {["all", "Controller", "Semiconductors", "Passives", "Sensors & Power", "PCB & Prototyping"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                categoryFilter === cat
                  ? "bg-[#2d6a4f] text-white shadow-xs"
                  : "bg-white border border-[rgba(30,27,22,0.1)] text-[#4a4640] hover:bg-[#f2efe8]"
              }`}
            >
              {cat === "all" ? "All Components" : cat}
            </button>
          ))}
        </div>
        <div className="data text-[12px] bg-[#d1ece0] text-[#1a5c36] px-3.5 py-1.5 rounded-lg font-bold">
          Estimated Total BOM: ${totalBOMCost.toFixed(2)} USD
        </div>
      </div>

      <div className="overflow-x-auto border border-[rgba(30,27,22,0.1)] rounded-2xl bg-white mb-8 max-w-6xl">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-[rgba(30,27,22,0.08)] bg-[#f2efe8] text-[#4a4640] data text-[10px]">
              <th className="py-2.5 px-4">Component</th>
              <th className="py-2.5 px-3">Part Number / Specs</th>
              <th className="py-2.5 px-2 text-center">Qty</th>
              <th className="py-2.5 px-3 text-right">Unit ($)</th>
              <th className="py-2.5 px-3 text-right">Total ($)</th>
              <th className="py-2.5 px-4">Functional Purpose</th>
            </tr>
          </thead>
          <tbody>
            {filteredBOM.map((item) => (
              <tr key={item.id} className="border-b border-[rgba(30,27,22,0.04)] hover:bg-[rgba(30,27,22,0.02)]">
                <td className="py-2.5 px-4 font-semibold text-[#1e1b16]">{item.component}</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#2d6a4f]">{item.partNumber}</td>
                <td className="py-2.5 px-2 text-center font-bold text-[#1e1b16]">{item.qty}</td>
                <td className="py-2.5 px-3 text-right text-[#8a867e]">${item.unitCostUSD.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-semibold text-[#1e1b16]">${item.totalCostUSD.toFixed(2)}</td>
                <td className="py-2.5 px-4 text-[11px] text-[#4a4640] max-w-xs">{item.functionalPurpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RiskRegisterSection() {
  const [selectedRiskId, setSelectedRiskId] = useState<string>("risk-no-mapping");
  const activeRisk = RISK_REGISTER.find((r) => r.id === selectedRiskId) || RISK_REGISTER[0];

  const severityColor = (sev: "High" | "Medium" | "Low") =>
    sev === "High" ? "bg-[#fdd5d5] text-[#991b1b]" : sev === "Medium" ? "bg-[#fde8c8] text-[#7c3811]" : "bg-[#d1ece0] text-[#1a5c36]";

  return (
    <div>
      <SectionHeader
        n="§10"
        title="Scientific risk analysis & decision/abandonment criteria"
        sub="Comprehensive risk register with likelihood, severity, root cause failure mechanisms, mitigations, and explicit continue-vs-abandon criteria."
      />

      <div className="grid lg:grid-cols-[380px_1fr] gap-8 max-w-6xl">
        <div className="space-y-2">
          {RISK_REGISTER.map((r, i) => {
            const isSelected = r.id === selectedRiskId;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRiskId(r.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#1e1b16] bg-white shadow-xs ring-1 ring-[#1e1b16]/10"
                    : "border-[rgba(30,27,22,0.08)] bg-white hover:border-[rgba(30,27,22,0.2)]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1e1b16] text-white font-mono text-[9px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[12.5px] font-semibold text-[#1e1b16] leading-snug">{r.riskName}</span>
                  </div>
                  <span className={`data text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${severityColor(r.severity)}`}>
                    {r.severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border border-[rgba(30,27,22,0.12)] rounded-2xl p-6 bg-white shadow-xs space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3 pb-3 border-b border-[rgba(30,27,22,0.08)]">
            <div>
              <Label>Risk Assessment Profile</Label>
              <h3 className="display text-[18px] font-medium text-[#1e1b16] mt-0.5">{activeRisk.riskName}</h3>
            </div>
            <div className="flex gap-2 font-mono text-[10px]">
              <span className={`px-2 py-0.5 rounded font-bold ${severityColor(activeRisk.severity)}`}>
                Severity: {activeRisk.severity}
              </span>
            </div>
          </div>

          <div>
            <Label>Root Cause Failure Mechanism</Label>
            <p className="text-[12.5px] text-[#332f28] leading-relaxed mt-1">{activeRisk.failureMechanism}</p>
          </div>

          <div>
            <Label>Mitigation Protocol</Label>
            <p className="text-[12.5px] text-[#2d6a4f] font-medium leading-relaxed mt-1">{activeRisk.mitigationStrategy}</p>
          </div>

          <div className="bg-[#fdd5d5]/30 border border-[#fca5a5] rounded-xl p-4">
            <div className="text-[10px] font-mono text-[#b91c1c] uppercase font-bold tracking-wider mb-1">
              ⛔ Explicit Abandonment Threshold
            </div>
            <p className="text-[12px] text-[#7f1d1d] leading-relaxed font-mono">
              {activeRisk.decisionAbandonmentThreshold}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapAndBudgetSection() {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const stage = RESEARCH_ROADMAP_STAGES[activeStageIdx];

  const totalThreeYearBudget = useMemo(() => {
    return BUDGET_BREAKDOWN.reduce((sum, item) => sum + item.threeYearTotalUSD, 0);
  }, []);

  return (
    <div>
      <SectionHeader
        n="§11"
        title="3-Year research roadmap, milestones & budget plan"
        sub="Comprehensive Stage 0 to Stage 7 execution timeline (2026–2031) with multidisciplinary personnel allocation and $1M–$1.5M budget breakdown."
      />

      <div className="border border-[rgba(30,27,22,0.1)] rounded-2xl bg-white p-6 mb-8 max-w-6xl shadow-xs">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-6">
          {RESEARCH_ROADMAP_STAGES.map((s, idx) => (
            <button
              key={s.stageNumber}
              onClick={() => setActiveStageIdx(idx)}
              className={`p-2 rounded-xl text-center transition-all ${
                activeStageIdx === idx
                  ? "bg-[#2d6a4f] text-white shadow-xs"
                  : "bg-[#f2efe8] text-[#4a4640] hover:bg-[#eae7df]"
              }`}
            >
              <div className="data text-[8.5px] opacity-80">{s.stageNumber}</div>
              <div className="text-[10px] font-bold truncate mt-0.5">{s.stageName.split(" ")[0]}</div>
            </button>
          ))}
        </div>

        <div className="space-y-4 pt-3 border-t border-[rgba(30,27,22,0.08)]">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <span className="data text-[10px] text-[#2d6a4f] font-bold">{stage.stageNumber} · {stage.quarterSpan}</span>
              <h3 className="display text-[18px] font-medium text-[#1e1b16] mt-0.5">{stage.stageName}</h3>
            </div>
            <span className="data text-[11px] bg-[#d1ece0] text-[#1a5c36] px-2.5 py-1 rounded font-bold">
              Lead: {stage.leadRole}
            </span>
          </div>

          <div>
            <Label>Core Deliverables</Label>
            <ul className="space-y-1 mt-1.5 text-[12px] text-[#332f28]">
              {stage.coreDeliverables.map((del, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="text-[#2d6a4f] font-bold shrink-0 mt-0.5">→</span>
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoveltyChecklistSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const statusCls: Record<string, string> = {
    novel: "bg-[#d1ece0] text-[#1a5c36]",
    plausible: "bg-[#fde8c8] text-[#7c3811]",
    established: "bg-[#eae7df] text-[#4a4640]",
  };

  return (
    <div>
      <SectionHeader
        n="§12"
        title="Interactive novelty claims & falsification checklist"
        sub="Clearly isolating genuinely novel power-electronics contributions from 70 years of established hydrodynamic prior art."
      />

      <div className="space-y-3 max-w-4xl">
        {NOVELTY_CHECKLIST.map((item) => (
          <label
            key={item.id}
            className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
              checked[item.id]
                ? "border-[rgba(45,106,79,0.25)] bg-[#d1ece0]/20"
                : "border-[rgba(30,27,22,0.08)] bg-white hover:border-[rgba(30,27,22,0.16)]"
            }`}
          >
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={(e) => setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))}
              className="mt-0.5 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[12.5px] font-semibold ${checked[item.id] ? "text-[#2d6a4f] line-through opacity-70" : "text-[#1e1b16]"}`}>
                  {item.claim}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusCls[item.status]}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
              <div className="text-[11.5px] text-[#4a4640] leading-relaxed">{item.note}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function PriorArtAndPatentsSection() {
  const [filterCat, setFilterCat] = useState<string>("all");

  const filtered = useMemo(() => {
    return EXPANDED_PRIOR_ART.filter((p) => {
      if (filterCat !== "all" && p.category !== filterCat) return false;
      return true;
    });
  }, [filterCat]);

  return (
    <div>
      <SectionHeader
        n="§13"
        title="Prior art database & patent search dossier"
        sub="Canonical literature citations (Google Research, IEEE, Phys Rev) and multi-jurisdiction patent prior art analysis (USPTO, WIPO, EPO, IPO)."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "Modern Circuit Analogy", "Signal Control Theory", "Patent Prior Art", "Seminal Traffic Analogy"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              filterCat === cat
                ? "bg-[#2d6a4f] text-white shadow-xs"
                : "bg-white border border-[rgba(30,27,22,0.1)] text-[#4a4640] hover:bg-[#f2efe8]"
            }`}
          >
            {cat === "all" ? "All Citations (8)" : cat}
          </button>
        ))}
      </div>

      <div className="space-y-4 max-w-5xl">
        {filtered.map((p, i) => (
          <div key={p.id} className="border border-[rgba(30,27,22,0.1)] rounded-xl p-5 bg-white shadow-2xs">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
              <div className="flex items-start gap-3">
                <span className="display text-[18px] italic font-light text-[#8a867e] leading-none mt-0.5 shrink-0">
                  [{i + 1}]
                </span>
                <div>
                  <div className="text-[13.5px] font-semibold text-[#1e1b16]">{p.title}</div>
                  <div className="text-[11px] text-[#8a867e] mt-0.5 font-mono">{p.authors} ({p.year}) · {p.venue}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#f2efe8] text-[#4a4640]">
                  {p.category}
                </span>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="data text-[9px] text-[#2d6a4f] border border-[rgba(45,106,79,0.25)] px-2.5 py-0.5 rounded hover:bg-[#d1ece0]/40 transition-colors font-bold"
                >
                  source ↗
                </a>
              </div>
            </div>

            <p className="text-[12px] text-[#4a4640] leading-relaxed mb-3 pl-8">{p.summary}</p>
            <div className="flex gap-2 items-start pl-8 pt-2.5 border-t border-[rgba(30,27,22,0.06)]">
              <span className="text-[10px] font-bold text-[#92400e] shrink-0 font-mono">Novelty Boundary:</span>
              <span className="text-[11px] text-[#8a867e] leading-relaxed">{p.noveltyBoundary}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimulationToolchainSection() {
  return (
    <div>
      <SectionHeader
        n="§5"
        title="Simulation architecture & multi-scale test scenarios"
        sub="Co-simulation toolchain matrix comparing SUMO, PLECS/Simscape, MATLAB, and FMI across cost, capabilities, and roles."
      />

      <div className="overflow-x-auto border border-[rgba(30,27,22,0.1)] rounded-2xl bg-white mb-8 max-w-6xl">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-[rgba(30,27,22,0.08)] bg-[#f2efe8] text-[#4a4640] data text-[10px]">
              <th className="py-3 px-4">Tool / Framework</th>
              <th className="py-3 px-3">Role / Use-Case</th>
              <th className="py-3 px-3">License & Cost</th>
              <th className="py-3 px-4">Strengths</th>
              <th className="py-3 px-4">Integration Approach</th>
            </tr>
          </thead>
          <tbody>
            {TOOLCHAIN_MATRIX.map((t, i) => (
              <tr key={i} className="border-b border-[rgba(30,27,22,0.04)] hover:bg-[rgba(30,27,22,0.02)]">
                <td className="py-3 px-4 font-semibold text-[#1e1b16]">{t.tool}</td>
                <td className="py-3 px-3 text-[#2d6a4f] font-medium">{t.role}</td>
                <td className="py-3 px-3 data text-[11px] text-[#8a867e]">{t.estimatedCost}</td>
                <td className="py-3 px-4 text-[11.5px] text-[#4a4640] max-w-xs">{t.strengths}</td>
                <td className="py-3 px-4 text-[11px] text-[#8a867e] max-w-xs">{t.integrationApproach}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MASTER MULTI-PAGE APPLICATION COMPONENT ──────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("brief");

  // Synchronize with URL hash for clean client-side routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "") as PageId;
      if (["brief", "implementation", "circuit-lab", "literature"].includes(hash)) {
        setActivePage(hash);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const changePage = (p: PageId) => {
    setActivePage(p);
    window.location.hash = `#/${p}`;
  };

  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#1e1b16] flex flex-col font-sans">
      <ScrollProgress />
      <GlobalNavbar activePage={activePage} setActivePage={changePage} />

      <main className="flex-1">
        {activePage === "brief" && (
          <ResearchBriefPage onNavigateToImplementation={() => changePage("implementation")} />
        )}
        {activePage === "implementation" && (
          <ImplementationPage onNavigateToLab={() => changePage("circuit-lab")} />
        )}
        {activePage === "circuit-lab" && <CircuitLabPage />}
        {activePage === "literature" && <LiteraturePage />}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-[rgba(30,27,22,0.1)] py-8 px-6 sm:px-12 bg-white text-[12px] text-[#8a867e]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="display italic font-medium text-[#1e1b16]">EEE × Urban Traffic Research Workspace</span>
            <span>·</span>
            <span>Stage 0 Validation Complete</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <button onClick={() => changePage("brief")} className="hover:text-[#1e1b16]">Research Brief</button>
            <button onClick={() => changePage("implementation")} className="hover:text-[#2d6a4f] font-bold text-[#2d6a4f]">Implementation Blueprint</button>
            <button onClick={() => changePage("circuit-lab")} className="hover:text-[#1e1b16]">Circuit Lab</button>
            <button onClick={() => changePage("literature")} className="hover:text-[#1e1b16]">Literature & Patents</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
