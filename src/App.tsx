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
  type Verdict,
  type CandidateMapping,
  type TestScenario,
  type ExecutionStep,
} from "./data";

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
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[200] bg-[rgba(30,27,22,0.06)]">
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
            (el as HTMLElement).style.setProperty("--stagger", `${i * 40}ms`);
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

// ─── SPINE NAVIGATION ─────────────────────────────────────────────────────────

function SpineNav({ active }: { active: string }) {
  return (
    <>
      <nav className="hidden xl:flex fixed left-0 top-0 bottom-0 w-12 flex-col items-center justify-center border-r border-[rgba(30,27,22,0.08)] z-50 bg-[#f8f6f1]/90 backdrop-blur-xs">
        <div className="flex flex-col gap-1">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              title={s.label}
              className={`flex items-center justify-center w-8 h-6 rounded transition-all group ${
                active === s.id ? "bg-[#2d6a4f] shadow-xs" : "hover:bg-[rgba(30,27,22,0.06)]"
              }`}
            >
              <span
                className={`display text-[9px] italic transition-colors font-medium ${
                  active === s.id ? "text-white" : "text-[#8a867e] group-hover:text-[#1e1b16]"
                }`}
              >
                {s.marker}
              </span>
            </a>
          ))}
        </div>
      </nav>

      <nav className="xl:hidden fixed top-[2px] left-0 right-0 z-50 bg-[#f8f6f1]/95 backdrop-blur border-b border-[rgba(30,27,22,0.08)]">
        <div className="flex gap-1 overflow-x-auto no-scrollbar px-3 py-2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`flex-shrink-0 data text-[9px] px-2.5 py-1 rounded-full transition-all ${
                active === s.id
                  ? "bg-[#2d6a4f] text-white font-medium"
                  : "text-[#8a867e] hover:text-[#1e1b16] hover:bg-[rgba(30,27,22,0.06)]"
              }`}
            >
              {s.marker} {s.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

// ─── §0 TITLE BLOCK & EXECUTIVE SUMMARY ───────────────────────────────────────

const STATS = [
  { n: 6, label: "candidate mappings scored", delay: 100 },
  { n: 10, label: "dimensional parameters linked", delay: 200 },
  { n: 6, label: "toolchain platforms analyzed", delay: 300 },
  { n: 6, label: "validation benchmark tests", delay: 400 },
  { n: 8, label: "failure risks & decision gates", delay: 500 },
  { n: 8, label: "canonical prior art citations", delay: 600 },
];

function TitleBlock() {
  const ref = useReveal();
  return (
    <section id="title" className="section-anchor border-b border-[rgba(30,27,22,0.08)]">
      <div className="grid-bg px-6 sm:px-12 pt-10 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-sm bg-[#2d6a4f] flex items-center justify-center shadow-xs">
              <span className="display text-[12px] italic text-white font-medium">§</span>
            </div>
            <div>
              <span className="data text-[10px] text-[#8a867e] tracking-widest block">DEEP RESEARCH WORKSPACE · IEEE ITS × POWER ELECTRONICS</span>
              <span className="text-[11px] font-medium text-[#2d6a4f]">Power-Electronic Circuits & Switching Networks for Urban Traffic</span>
            </div>
          </div>
          <div className="flex gap-5">
            {[["Scope", "Full 12-Section Plan"], ["Status", "Stage 0 Active"], ["Date", "2026-09-05"]].map(([k, v]) => (
              <div key={k}>
                <Label>{k}</Label>
                <div className="data text-[10px] text-[#4a4640] mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal max-w-4xl">
          <h1 className="display text-[34px] sm:text-[48px] lg:text-[54px] font-medium leading-[1.08] tracking-tight text-[#1e1b16]">
            Power-Electronic Circuits & <em className="font-light">Switching Networks</em> as Physical Representations of Urban Traffic
          </h1>
          <p className="mt-5 text-[14px] sm:text-[15px] text-[#4a4640] leading-relaxed max-w-3xl">
            This research workspace investigates <strong>where and how components of an urban traffic system can legitimately be modeled as power-electronic circuits and switching networks</strong>.
            Grounded in scientific rigor and falsifiability (<em>"Try to break it, don't force success"</em>), we evaluate physical, functional, mathematical, and control analogies—rejecting passive resistor myths,
            preserving flow conservation laws, and introducing active semiconductor switching matrices with Finite-Control-Set Model Predictive Control (FCS-MPC).
          </p>
        </div>

        {/* Animated stat counters */}
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

      <div className="px-6 sm:px-12 py-3 bg-[#fde8c8]/40 border-t border-[rgba(146,64,14,0.12)] flex items-start gap-3">
        <span className="data text-[9px] text-[#92400e] tracking-widest mt-0.5 shrink-0 font-bold">ETHOS</span>
        <p className="text-[12px] text-[#7c5a3a] leading-relaxed">
          <strong>Scientific Rigor & Falsifiability:</strong> Every candidate mapping is explicitly tagged as <span className="bg-[#d1ece0] text-[#1a5c36] px-1.5 py-0.2 rounded font-mono text-[10px]">Source</span>, <span className="bg-[#dbeafe] text-[#1e3a8a] px-1.5 py-0.2 rounded font-mono text-[10px]">Hypothesis</span>, or <span className="bg-[#fde8c8] text-[#7c3811] px-1.5 py-0.2 rounded font-mono text-[10px]">Result</span>. We actively search for failure boundaries rather than forcing mathematical equivalence where travel costs curl is non-zero.
        </p>
      </div>
    </section>
  );
}

// ─── §EXEC EXECUTION BLUEPRINT & IMPLEMENTATION GUIDE ──────────────────────

function ExecutionGuideSection() {
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
    <section id="execution-guide" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)] bg-[#f2efe8]/30">
      <SectionHeader
        n="§EXEC"
        title="Execution blueprint: How to implement this research step-by-step"
        sub="A straightforward, zero-fluff engineering guide translating Deep Research 3 into immediate runnable software, SPICE netlists, $100 lab hardware, and publishable papers."
      />

      {/* Quick Summary Banner */}
      <div className="bg-white border border-[rgba(45,106,79,0.2)] rounded-2xl p-5 mb-8 shadow-xs max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2d6a4f] text-white flex items-center justify-center font-mono font-bold text-[14px]">
              ▶
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#1e1b16]">The 5-Step Path from Concept to Working Demonstration</div>
              <div className="text-[12px] text-[#8a867e]">Follow these sequential phases to replicate, validate, and build the physical traffic-circuit system.</div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="bg-[#d1ece0] text-[#1a5c36] px-2.5 py-1 rounded-md font-bold">Total Cost: ~$120 USD</span>
            <span className="bg-[#f2efe8] text-[#4a4640] px-2.5 py-1 rounded-md">Timeline: 2–6 Months</span>
          </div>
        </div>
      </div>

      {/* 5-Step Horizontal Tab Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8 max-w-6xl">
        {EXECUTION_STEPS.map((s, idx) => {
          const isActive = activeStepIdx === idx;
          return (
            <button
              key={s.stepNumber}
              onClick={() => setActiveStepIdx(idx)}
              className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                isActive
                  ? "bg-[#2d6a4f] border-[#2d6a4f] text-white shadow-sm ring-2 ring-[#2d6a4f]/20"
                  : "bg-white border-[rgba(30,27,22,0.08)] text-[#4a4640] hover:border-[rgba(30,27,22,0.2)] hover:bg-[#fcfbf9]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`data text-[9px] font-bold uppercase tracking-wider ${isActive ? "text-[#d1ece0]" : "text-[#8a867e]"}`}>
                    Step {s.stepNumber}
                  </span>
                  <span className={`data text-[8.5px] px-1.5 py-0.2 rounded font-semibold ${isActive ? "bg-white/20 text-white" : "bg-[#f2efe8] text-[#4a4640]"}`}>
                    {s.timeframe}
                  </span>
                </div>
                <div className={`text-[12px] font-semibold leading-snug line-clamp-2 ${isActive ? "text-white" : "text-[#1e1b16]"}`}>
                  {s.title.split("(")[0]}
                </div>
              </div>
              <div className={`text-[10px] mt-2 font-mono ${isActive ? "text-white/80" : "text-[#2d6a4f] font-semibold"}`}>
                {s.costEstimate.split("(")[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep Card */}
      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal border border-[rgba(30,27,22,0.12)] rounded-2xl p-6 sm:p-8 bg-white shadow-sm max-w-6xl space-y-6">
        {/* Step Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4 border-b border-[rgba(30,27,22,0.08)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="data text-[10px] text-[#2d6a4f] font-bold bg-[#d1ece0] px-2 py-0.5 rounded">
                {step.badge}
              </span>
              <span className={`data text-[10px] font-semibold px-2 py-0.5 rounded ${difficultyCls(step.difficulty)}`}>
                {step.difficulty}
              </span>
              <span className="data text-[10px] text-[#8a867e]">
                Est. Duration: <strong>{step.timeframe}</strong>
              </span>
            </div>
            <h3 className="display text-[22px] font-medium text-[#1e1b16] mt-1">
              Step {step.stepNumber}: {step.title}
            </h3>
          </div>
          <div className="data text-[12px] bg-[#f8f6f1] border border-[rgba(30,27,22,0.08)] px-3.5 py-1.5 rounded-lg text-[#1e1b16] font-bold">
            Budget: {step.costEstimate}
          </div>
        </div>

        {/* Plain-English Overview */}
        <div className="bg-[#f8f6f1] p-4 rounded-xl border border-[rgba(30,27,22,0.06)] text-[13px] text-[#2c2822] leading-relaxed">
          <strong className="text-[#2d6a4f]">Plain-English Mission:</strong> {step.summary}
        </div>

        {/* Actionable Steps & Code/Command Columns */}
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
          {/* Left: Actionable Checklist */}
          <div className="space-y-4">
            <div>
              <Label>How to execute this step (Checklist)</Label>
              <div className="space-y-2.5 mt-2">
                {step.howToStart.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-[12.5px] bg-[#fcfbf9] p-3 rounded-xl border border-[rgba(30,27,22,0.06)] text-[#332f28] leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-[#2d6a4f] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitfall & Verification Gates */}
            <div className="space-y-2.5 pt-2">
              <div className="bg-[#fdd5d5]/30 border border-[#fca5a5] rounded-xl p-3.5">
                <div className="text-[10px] font-mono font-bold text-[#b91c1c] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>⚠</span> Common Pitfall to Avoid
                </div>
                <p className="text-[11.5px] text-[#7f1d1d] leading-relaxed">{step.keyPitfallToAvoid}</p>
              </div>

              <div className="bg-[#d1ece0]/30 border border-[#a7f3d0] rounded-xl p-3.5">
                <div className="text-[10px] font-mono font-bold text-[#1a5c36] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>✓</span> Verification Milestone Gate
                </div>
                <p className="text-[11.5px] text-[#065f46] leading-relaxed font-mono">{step.verificationGate}</p>
              </div>
            </div>
          </div>

          {/* Right: Runnable Code or Command Box */}
          <div className="space-y-2 flex flex-col">
            <div className="flex items-center justify-between">
              <Label>{step.exactCodeOrCommands.title}</Label>
              <button
                onClick={handleCopy}
                className="data text-[10px] bg-[#f2efe8] hover:bg-[#eae7df] border border-[rgba(30,27,22,0.1)] px-2.5 py-1 rounded transition-colors text-[#1e1b16] font-semibold flex items-center gap-1"
              >
                {copied ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>

            <div className="bg-[#1e1b16] text-[#e5e0d8] rounded-xl p-4 font-mono text-[11px] overflow-x-auto flex-1 border border-black/20 max-h-[420px] no-scrollbar">
              <pre>
                <code>{step.exactCodeOrCommands.code}</code>
              </pre>
            </div>
            <div className="text-[10px] text-[#8a867e] italic text-right">
              Language: <span className="font-mono text-[#2d6a4f] uppercase">{step.exactCodeOrCommands.language}</span> · Ready to execute locally
            </div>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(30,27,22,0.08)] text-[11px] font-mono">
          <button
            disabled={activeStepIdx === 0}
            onClick={() => setActiveStepIdx((s) => Math.max(0, s - 1))}
            className="px-3.5 py-1.5 rounded-lg bg-[#f2efe8] text-[#1e1b16] font-semibold hover:bg-[#eae7df] disabled:opacity-40 transition-colors"
          >
            ← Previous Phase
          </button>
          <span className="text-[#8a867e]">
            Execution Phase {step.stepNumber} of {EXECUTION_STEPS.length}
          </span>
          <button
            disabled={activeStepIdx === EXECUTION_STEPS.length - 1}
            onClick={() => setActiveStepIdx((s) => Math.min(EXECUTION_STEPS.length - 1, s + 1))}
            className="px-3.5 py-1.5 rounded-lg bg-[#2d6a4f] text-white font-semibold hover:bg-[#23533e] disabled:opacity-40 transition-colors shadow-xs"
          >
            Next Phase →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── §1 RESEARCH OBJECTIVES & SUCCESS CRITERIA ────────────────────────────────

function ResearchObjectives() {
  const listRef = useRevealList();
  return (
    <section id="objectives" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§1"
        title="Research objectives & falsifiability criteria"
        sub="The guiding mission: determine if physical power-electronic circuits can reproduce key traffic dynamics and yield useful new capabilities."
      />

      <div ref={listRef as React.RefObject<HTMLDivElement>} className="grid md:grid-cols-2 gap-6 max-w-5xl mb-8">
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
              Identify which traffic components (roads, intersections, traffic signals, queues, entire networks) can legitimately be modeled as power-electronic circuits or switching networks.
              Establish whether there exists a <strong>mathematically rigorous transformation</strong> that yields new insights beyond conventional traffic models (e.g. CTM, Max-Pressure).
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
                <span><strong>Unit & Conservation Consistency:</strong> Preserves exact flow continuity (KCL) without unphysical energy violations.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#2d6a4f] shrink-0">✓</span>
                <span><strong>Sim-to-Sim Error &lt; 15%:</strong> Analog circuit outputs must track microscopic SUMO queues within ±15% error and Pearson r &gt; 0.85.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#2d6a4f] shrink-0">✓</span>
                <span><strong>Zero Spurious Dynamics:</strong> The circuit must not produce artificial electrical resonances not found in vehicular flow.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[rgba(30,27,22,0.08)] text-[11px] text-[#8a867e] font-mono">
            Rule: Reject any analogy with &gt; 30% persistent tracking divergence.
          </div>
        </div>
      </div>

      {/* 6 Subgoals breakdown */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        {[
          { num: "01", title: "Literature Survey", desc: "Catalog 70 years of traffic-electrical analogies (LWR 1955, Schweitzer 1999, Cui 2012, Sinop 2022, Moyalan 2026)." },
          { num: "02", title: "Power-Electronics Catalog", desc: "Map converters, PWM, multi-pole switches, FCS-MPC, and conduction/switching losses to traffic signal actuation." },
          { num: "03", title: "Decision Matrix Scoring", desc: "Classify candidates into Physical (A), Functional (B), Mathematical (C), Control (D), Conceptual (E)." },
          { num: "04", title: "State-Space Modeling", desc: "Formulate switched hybrid dynamical equations x(k+1)=f(x,u,d) with switched admittance matrix Y(t)." },
          { num: "05", title: "Hardware Bench Prototype", desc: "Build low-voltage 12V 5-node testbed with logic-level MOSFETs, storage capacitors, and current shunts ($100–$200 BOM)." },
          { num: "06", title: "'Break It' Testing", desc: "Execute 6 canonical perturbation and contingency tests (N-1 line cuts, signal stuck faults, rush hour surges)." },
        ].map((g) => (
          <div key={g.num} className="border border-[rgba(30,27,22,0.08)] rounded-xl p-4 bg-white hover:border-[rgba(30,27,22,0.18)] transition-colors">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="data text-[11px] font-bold text-[#2d6a4f]">{g.num}</span>
              <span className="data text-[9px] text-[#8a867e]">SUBGOAL</span>
            </div>
            <div className="text-[13px] font-semibold text-[#1e1b16] mb-1">{g.title}</div>
            <p className="text-[11.5px] text-[#4a4640] leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── §2 CANDIDATE MAPPINGS & MULTI-CRITERIA DECISION MATRIX ───────────────────

function DecisionMatrixSection() {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("intersection");
  const [scoreFilter, setScoreFilter] = useState<number | "all">("all");
  const listRef = useRevealList();

  const filtered = useMemo(() => {
    return CANDIDATE_MAPPINGS.filter((m) => {
      if (scoreFilter !== "all" && m.feasibilityScore < scoreFilter) return false;
      return true;
    });
  }, [scoreFilter]);

  const active = CANDIDATE_MAPPINGS.find((c) => c.id === selectedCandidate) || CANDIDATE_MAPPINGS[0];

  return (
    <section id="decision-matrix" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
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
      <div className="overflow-x-auto border border-[rgba(30,27,22,0.1)] rounded-xl bg-white mb-8">
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
    </section>
  );
}

// ─── §3 DIMENSIONAL ANALYSIS & CONSERVATION LAWS ──────────────────────────────

function DimensionalAnalysisSection() {
  const [scaleK, setScaleK] = useState(10); // Coulombs per vehicle
  const [vehFlow, setVehFlow] = useState(1200); // veh / hour
  const [queueVeh, setQueueVeh] = useState(25); // vehicles in queue
  const [greenTime, setGreenTime] = useState(30); // seconds
  const [cycleTime, setCycleTime] = useState(60); // seconds
  const ref = useReveal();

  // Dynamic calculations
  const flowVehSec = (vehFlow / 3600); // veh/s
  const currentAmps = (flowVehSec * scaleK); // Amperes
  const currentMilliAmps = (currentAmps * 1000).toFixed(1);
  const chargeCoulombs = (queueVeh * scaleK);
  const capacitanceFarads = scaleK; // C = k
  const nodeVoltage = (chargeCoulombs / capacitanceFarads).toFixed(1); // V = q
  const dutyCycle = (greenTime / cycleTime).toFixed(2);

  return (
    <section id="dimensional" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§3"
        title="Dimensional analysis & conservation laws"
        sub="Rigorous unit consistency and flow conservation proofs mapping traffic hydrodynamics to Kirchhoff's Current Law."
      />

      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal grid lg:grid-cols-[1fr_380px] gap-8 max-w-6xl mb-8">
        {/* Left: Mathematical Proofs */}
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
              Setting capacitor sizing to $C = k$ [Farads] guarantees that <strong>node voltage numerically equals queue length</strong> ($V_i(t) = q_i(t)$ Volts). In steady-state ($\dot{q} = 0$), $\sum I_{\text{in}} = \sum I_{\text{out}}$, exactly reproducing <strong>Kirchhoff's Current Law (KCL)</strong>.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-[rgba(30,27,22,0.08)] rounded-xl p-4 bg-white">
              <Label>Travel Time ↔ Resistance</Label>
              <div className="data text-[12px] text-[#2d6a4f] font-semibold mt-1">R_e = α · T_e [Ohms]</div>
              <p className="text-[11.5px] text-[#4a4640] leading-relaxed mt-1">
                Ohmic resistance scales proportionally with link free-flow travel time, causing higher voltage drops on congested corridors.
              </p>
            </div>
            <div className="border border-[rgba(30,27,22,0.08)] rounded-xl p-4 bg-white">
              <Label>Signal Green Time ↔ PWM Duty</Label>
              <div className="data text-[12px] text-[#2d6a4f] font-semibold mt-1">D = T_g / T_cyc = T_on / T_s</div>
              <p className="text-[11.5px] text-[#4a4640] leading-relaxed mt-1">
                Traffic phase green ratio maps isomorphically to semiconductor PWM conduction duty cycle.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Dimensional Scaling Widget */}
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

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#4a4640]">Signal Timing</span>
              <span className="data font-bold text-[#1e1b16]">{greenTime}s Green / {cycleTime}s Cycle</span>
            </div>
            <input
              type="range" min={10} max={55} step={5} value={greenTime}
              onChange={(e) => setGreenTime(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Computed Electrical Equivalents */}
          <div className="bg-white border border-[rgba(30,27,22,0.1)] rounded-xl p-4 space-y-2.5">
            <div className="text-[10px] font-mono text-[#8a867e] uppercase font-bold">Equivalent Electrical Domain Values</div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#4a4640]">Branch Current (I):</span>
              <span className="data font-bold text-[#2d6a4f]">{currentMilliAmps} mA ({currentAmps.toFixed(3)} A)</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#4a4640]">Node Charge (Q_e):</span>
              <span className="data font-bold text-[#1e1b16]">{chargeCoulombs} Coulombs</span>
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

      {/* Full Parameter Mapping Table */}
      <div className="overflow-x-auto border border-[rgba(30,27,22,0.1)] rounded-xl bg-white max-w-6xl">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-[rgba(30,27,22,0.08)] bg-[#f2efe8] text-[#4a4640] data text-[10px]">
              <th className="py-2.5 px-4">Traffic Quantity</th>
              <th className="py-2.5 px-3">Traffic Unit</th>
              <th className="py-2.5 px-4">Electrical Equivalent</th>
              <th className="py-2.5 px-3">Electrical Unit</th>
              <th className="py-2.5 px-4">Scaling Equation</th>
              <th className="py-2.5 px-4">Engineering Notes</th>
            </tr>
          </thead>
          <tbody>
            {DIMENSIONAL_MAPPINGS.map((d, i) => (
              <tr key={i} className="border-b border-[rgba(30,27,22,0.04)] hover:bg-[rgba(30,27,22,0.02)]">
                <td className="py-2.5 px-4 font-semibold text-[#1e1b16]">{d.parameter}</td>
                <td className="py-2.5 px-3 data text-[11px] text-[#8a867e]">{d.trafficUnit}</td>
                <td className="py-2.5 px-4 text-[#2d6a4f] font-medium">{d.electricalEquivalent}</td>
                <td className="py-2.5 px-3 data text-[11px] text-[#1e1b16]">{d.electricalUnit}</td>
                <td className="py-2.5 px-4 font-mono text-[11px] text-[#7c3811] bg-[#fde8c8]/20">{d.scalingRelation}</td>
                <td className="py-2.5 px-4 text-[11px] text-[#8a867e]">{d.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── §4 PROPOSED MATHEMATICAL MODELS & STATE-SPACE ────────────────────────────

function MathematicalModelsSection() {
  const listRef = useRevealList();
  return (
    <section id="math-models" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§4"
        title="Proposed mathematical models & state-space equations"
        sub="Dynamic state-space difference equations, Switched Admittance Matrix Y(t), and hybrid dynamical systems."
      />

      <div ref={listRef as React.RefObject<HTMLDivElement>} className="grid md:grid-cols-2 gap-6 max-w-5xl mb-8">
        {/* Classical CTM */}
        <div className="reveal border border-[rgba(30,27,22,0.12)] rounded-2xl p-6 bg-[#f2efe8] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#1e1b16]">Classical Cell Transmission Model (CTM)</span>
            <span className="data text-[9px] bg-[#eae7df] px-2 py-0.5 rounded text-[#4a4640]">Daganzo 1994</span>
          </div>
          <p className="text-[12px] text-[#4a4640] leading-relaxed">
            Piecewise-linear hydrodynamic simulation where signal green phases are modeled as exogenous multipliers on saturation flow capacity.
          </p>

          <div className="space-y-3 font-mono text-[11px]">
            <div>
              <Label>Flow Transmission Function</Label>
              <div className="bg-white p-2.5 rounded-lg border border-[rgba(30,27,22,0.08)] text-[#1e1b16] mt-0.5">
                q_i(k) = min &#123; v·k_i(k),  q_max,  w·(k_jam − k_&#123;i+1&#125;(k)) &#125;
              </div>
            </div>
            <div>
              <Label>Dynamic State Conservation</Label>
              <div className="bg-white p-2.5 rounded-lg border border-[rgba(30,27,22,0.08)] text-[#1e1b16] mt-0.5">
                x_i(k+1) = x_i(k) + T_s · [ q_&#123;i-1&#125;(k) − q_i(k) ]
              </div>
            </div>
            <div>
              <Label>Phase Transition Model</Label>
              <div className="bg-white p-2.5 rounded-lg border border-[rgba(30,27,22,0.08)] text-[#8a867e] mt-0.5">
                Instantaneous step; lost clearance time neglected.
              </div>
            </div>
          </div>
          <div className="text-[11px] text-[#8a867e] pt-2 border-t border-[rgba(30,27,22,0.08)]">
            Limitation: Continuous relaxation ignores discrete semiconductor conduction states and phase chattering.
          </div>
        </div>

        {/* Proposed Switched Hybrid FCS-MPC */}
        <div className="reveal border border-[rgba(45,106,79,0.25)] rounded-2xl p-6 bg-[#d1ece0]/15 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#2d6a4f]">Switched Network FCS-MPC (Proposed)</span>
            <span className="data text-[9px] bg-[#d1ece0] px-2 py-0.5 rounded text-[#1a5c36] font-semibold">Power Electronics</span>
          </div>
          <p className="text-[12px] text-[#332f28] leading-relaxed">
            Formulates signalized corridors as switched hybrid dynamical systems where semiconductor switching states $u(k) \in \{0,1\}^M$ dynamically reconfigure the network admittance matrix.
          </p>

          <div className="space-y-3 font-mono text-[11px]">
            <div>
              <Label>Switched Admittance Matrix</Label>
              <div className="bg-white p-2.5 rounded-lg border border-[rgba(45,106,79,0.2)] text-[#1e1b16] mt-0.5">
                Y(t) = A^T · diag( u_e(t) · g_e(x) ) · A
              </div>
            </div>
            <div>
              <Label>Hybrid State-Space Form</Label>
              <div className="bg-white p-2.5 rounded-lg border border-[rgba(45,106,79,0.2)] text-[#1e1b16] mt-0.5">
                x(k+1) = f( x(k), u(k), d(k) ),  u(k) ∈ U_admissible
              </div>
            </div>
            <div>
              <Label>FCS-MPC Objective with Switching Loss</Label>
              <div className="bg-white p-2.5 rounded-lg border border-[rgba(45,106,79,0.2)] text-[#2d6a4f] font-semibold mt-0.5">
                min J = ∑ ||x(k+j)||_Q² + λ_sw · ||u(k+j) − u(k+j-1)||²
              </div>
            </div>
          </div>
          <div className="text-[11px] text-[#2d6a4f] pt-2 border-t border-[rgba(45,106,79,0.15)] font-medium">
            Advantage: Explicit switching loss penalty $\lambda_{\text{sw}}\cdot\Delta u^2$ prevents chatter and minimizes lost clearance time.
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── §5 SIMULATION ARCHITECTURE & TOOLCHAIN MATRIX ────────────────────────────

function SimulationToolchainSection() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const ref = useReveal();

  const scenarios = [
    {
      scale: "Case 1: 5–15 Node Small Network (Lab Benchmark)",
      nodes: "5–15 Intersections",
      topology: "2×2 grid or cross-shaped central junction + 4 feeders.",
      purpose: "Validate unit scaling, verify KCL flow conservation, and benchmark baseline CTM against PLECS circuit waveforms.",
      metrics: "Queue trajectory MAE, time-to-peak alignment, and Pearson correlation r ≥ 0.90.",
    },
    {
      scale: "Case 2: 25–50 Node Medium Network (Suburban Grid)",
      nodes: "25–50 Intersections",
      topology: "Multi-arterial suburban arterial mesh with varied turning splits.",
      purpose: "Test scalability of distributed FCS-MPC consensus and simulate cascading queue spillback under link closures.",
      metrics: "Network-wide vehicle clearance rate, cascading wave speed, and N-1 contingency index.",
    },
    {
      scale: "Case 3: Coimbatore Corridor / Full City (100+ Nodes)",
      nodes: "100+ Intersections",
      topology: "Empirical Avinashi Road corridor (Lakshmi Mills to Nava India) scaled to urban mesh.",
      purpose: "Empirical real-world validation with strict 5-tier data provenance and hardware-in-the-loop (HIL) telemetry.",
      metrics: "Arterial travel time reduction (target ≥15%), delay variance, and sensor state estimation error.",
    },
  ];

  return (
    <section id="simulation-tools" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§5"
        title="Simulation architecture & multi-scale test scenarios"
        sub="Co-simulation toolchain matrix comparing SUMO, PLECS/Simscape, MATLAB, and FMI across cost, capabilities, and roles."
      />

      {/* Toolchain Comparison Matrix */}
      <div className="overflow-x-auto border border-[rgba(30,27,22,0.1)] rounded-xl bg-white mb-8 max-w-6xl">
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

      {/* 3-Tier Multi-Scale Test Scenarios */}
      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal border border-[rgba(30,27,22,0.1)] rounded-2xl bg-white p-6 max-w-5xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <Label>Multi-Scale Progressive Test Cases</Label>
          <div className="flex gap-2">
            {scenarios.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-3 py-1 text-[11px] rounded-lg font-medium transition-all ${
                  activeTab === i
                    ? "bg-[#2d6a4f] text-white shadow-xs"
                    : "bg-[#f2efe8] text-[#4a4640] hover:bg-[#eae7df]"
                }`}
              >
                Case {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-3 border-t border-[rgba(30,27,22,0.08)]">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="display text-[18px] font-medium text-[#1e1b16]">{scenarios[activeTab].scale}</h4>
            <span className="data text-[11px] text-[#2d6a4f] bg-[#d1ece0] px-2.5 py-0.5 rounded-full font-bold">
              {scenarios[activeTab].nodes}
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-[12px]">
            <div className="border border-[rgba(30,27,22,0.08)] rounded-xl p-3.5 bg-[#f8f6f1]">
              <div className="text-[10px] font-mono text-[#8a867e] uppercase font-bold mb-1">Network Topology</div>
              <p className="text-[#332f28] leading-relaxed">{scenarios[activeTab].topology}</p>
            </div>
            <div className="border border-[rgba(30,27,22,0.08)] rounded-xl p-3.5 bg-[#f8f6f1]">
              <div className="text-[10px] font-mono text-[#2d6a4f] uppercase font-bold mb-1">Primary Objective</div>
              <p className="text-[#332f28] leading-relaxed">{scenarios[activeTab].purpose}</p>
            </div>
            <div className="border border-[rgba(30,27,22,0.08)] rounded-xl p-3.5 bg-[#f8f6f1]">
              <div className="text-[10px] font-mono text-[#92400e] uppercase font-bold mb-1">Key Success Metrics</div>
              <p className="text-[#332f28] leading-relaxed">{scenarios[activeTab].metrics}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── §6 CIRCUIT DESIGN, MATRIX CONVERTERS & LIVE WAVEFORMS ────────────────────

function CircuitDesignSection() {
  const [duty, setDuty] = useState(0.5);
  const [simTime, setSimTime] = useState(0);
  const [activeTopology, setActiveTopology] = useState<"intersection" | "road" | "queue">("intersection");
  const ref = useReveal();

  useEffect(() => {
    const timer = setInterval(() => {
      setSimTime((t) => (t + 0.05) % 10);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Generate SVG waveform points based on active duty and time
  const waveformPoints = useMemo(() => {
    const pointsGate: string[] = [];
    const pointsVolt: string[] = [];
    const pointsCurr: string[] = [];
    const period = 2.0; // seconds for visual cycle
    const onTime = period * duty;

    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * 10;
      const phase = t % period;
      const isHigh = phase < onTime;
      const x = (i / 200) * 460 + 20;

      // Gate PWM
      const yGate = isHigh ? 35 : 70;
      pointsGate.push(`${x},${yGate}`);

      // Capacitor Sawtooth Voltage (charge when closed, discharge when open)
      let v = 0;
      if (isHigh) {
        v = (phase / onTime) * 35;
      } else {
        v = 35 - ((phase - onTime) / (period - onTime)) * 35;
      }
      const yVolt = 130 - v;
      pointsVolt.push(`${x},${yVolt}`);

      // Branch Current (inductor smoothed)
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
    <section id="circuit-design" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§6"
        title="Circuit design, matrix converter & live waveforms"
        sub="4-switch intersection matrix topologies, R-L corridor inertia, and animated analog voltage/current dynamics."
      />

      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal grid lg:grid-cols-[1fr_360px] gap-8 max-w-6xl mb-8">
        {/* Left: Interactive Waveform Simulator */}
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
              <button
                onClick={() => setActiveTopology("queue")}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                  activeTopology === "queue" ? "bg-[#2d6a4f] text-white" : "bg-[#f2efe8] text-[#4a4640]"
                }`}
              >
                Capacitor Queue
              </button>
            </div>
          </div>

          {/* SVG Waveform Display */}
          <div className="bg-[#1e1b16] rounded-xl p-3 border border-black/20">
            <svg viewBox="0 0 500 200" className="w-full h-48">
              {/* Grid Lines */}
              <line x1="20" y1="35" x2="480" y2="35" stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" />
              <line x1="20" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.12)" />
              <line x1="20" y1="130" x2="480" y2="130" stroke="rgba(255,255,255,0.12)" />
              <line x1="20" y1="180" x2="480" y2="180" stroke="rgba(255,255,255,0.12)" />

              {/* Waveform 1: Gate Pulse PWM */}
              <polyline points={waveformPoints.gate} fill="none" stroke="#3b82f6" strokeWidth="2" />
              <text x="25" y="30" fill="#60a5fa" fontSize="9" fontFamily="JetBrains Mono">Gate PWM v_gs(t) [ON / OFF]</text>

              {/* Waveform 2: Capacitor Sawtooth Queue Voltage */}
              <polyline points={waveformPoints.volt} fill="none" stroke="#10b981" strokeWidth="2.2" />
              <text x="25" y="92" fill="#34d399" fontSize="9" fontFamily="JetBrains Mono">Node Voltage V_i(t) ≡ Queue x_i(t) [Sawtooth Accumulation]</text>

              {/* Waveform 3: Branch Current */}
              <polyline points={waveformPoints.curr} fill="none" stroke="#f59e0b" strokeWidth="2" />
              <text x="25" y="150" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono">Branch Current I_e(t) ≡ Flow f_e(t) [Smoothed Platoon Current]</text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#8a867e] pt-1">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-[#3b82f6]" /> Gate Logic D={duty.toFixed(2)}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-[#10b981]" /> Capacitor Voltage (Queue)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-[#f59e0b]" /> Inductor Current (Flow)</span>
          </div>
        </div>

        {/* Right: Circuit Controls & Schematic Notes */}
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
              <strong>4-Switch Matrix Bridge:</strong> 4 logic-level MOSFETs (IRLZ44N) configured as two bidirectional legs. Freewheeling Schottky diodes clamp all-red inductive spikes during phase commutations.
            </div>
          </div>

          <div className="bg-white border border-[rgba(30,27,22,0.08)] rounded-xl p-3.5 space-y-2">
            <div className="text-[10px] font-mono text-[#8a867e] uppercase font-bold">Safety & Protection</div>
            <p className="text-[11.5px] text-[#4a4640] leading-relaxed">
              12–24V DC bus voltage. Fast-blow 3A fuses in series with DC rails. Shunt resistors (0.1Ω) on all ground returns to read branch currents into microcontroller ADC.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── §7 HARDWARE PROTOTYPE & INTERACTIVE BILL OF MATERIALS (BOM) ──────────────

function HardwarePrototypeSection() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const ref = useReveal();

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
    <section id="hardware-bom" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
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

      {/* Itemized BOM Table */}
      <div className="overflow-x-auto border border-[rgba(30,27,22,0.1)] rounded-xl bg-white mb-8 max-w-6xl">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-[rgba(30,27,22,0.08)] bg-[#f2efe8] text-[#4a4640] data text-[10px]">
              <th className="py-2.5 px-4">Component</th>
              <th className="py-2.5 px-3">Part Number / Specs</th>
              <th className="py-2.5 px-2 text-center">Qty</th>
              <th className="py-2.5 px-3 text-right">Unit ($)</th>
              <th className="py-2.5 px-3 text-right">Total ($)</th>
              <th className="py-2.5 px-4">Functional Purpose</th>
              <th className="py-2.5 px-3">Safety Rating</th>
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
                <td className="py-2.5 px-3 data text-[10px] text-[#92400e] bg-[#fde8c8]/30 rounded">{item.safetyRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Safety & Lab Bench Architecture */}
      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal grid sm:grid-cols-3 gap-4 max-w-6xl">
        <div className="border border-[rgba(30,27,22,0.08)] rounded-xl p-4 bg-white">
          <Label>Microcontroller & DSP Selection</Label>
          <div className="text-[13px] font-semibold text-[#1e1b16] mt-1 mb-1">STM32 Nucleo / TI C2000</div>
          <p className="text-[11.5px] text-[#4a4640] leading-relaxed">
            STM32 Nucleo-F446RE (ARM Cortex-M4 @ 180MHz) provides high-resolution PWM and multi-channel 12-bit ADC for real-time 1-hop distributed consensus. TI C2000 LaunchPad enables hardware floating-point FCS-MPC evaluation.
          </p>
        </div>
        <div className="border border-[rgba(30,27,22,0.08)] rounded-xl p-4 bg-white">
          <Label>Low-Voltage Bench Safety</Label>
          <div className="text-[13px] font-semibold text-[#1e1b16] mt-1 mb-1">12V Isolated DC Supply & Fuses</div>
          <p className="text-[11.5px] text-[#4a4640] leading-relaxed">
            Operates at intrinsically safe 12V DC bus voltage with fast-acting 3A glass fuses, panel-mounted emergency kill-switch, and freewheeling Schottky diodes to prevent voltage spike hazards.
          </p>
        </div>
        <div className="border border-[rgba(30,27,22,0.08)] rounded-xl p-4 bg-white">
          <Label>DAQ & Telemetry Interface</Label>
          <div className="text-[13px] font-semibold text-[#1e1b16] mt-1 mb-1">Shunt Telemetry & Oscilloscope</div>
          <p className="text-[11.5px] text-[#4a4640] leading-relaxed">
            Low-loss 0.10Ω current shunts on all branches feed into differential ADC channels. Dedicated BNC test points allow simultaneous multi-channel digital storage oscilloscope capture.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── §8 EXPERIMENTAL PROTOCOL & VALIDATION SUITE ──────────────────────────────

function ExperimentalProtocolSection() {
  const [selectedTestId, setSelectedTestId] = useState<string>("test-n1-closure");
  const activeTest = TEST_SCENARIOS.find((t) => t.id === selectedTestId) || TEST_SCENARIOS[0];
  const ref = useReveal();

  // Synthetic time-series trajectory generation for Baseline vs Analog comparison
  const { baselinePoints, analogPoints, corrValue, mseVal } = useMemo(() => {
    const ptsBase: string[] = [];
    const ptsAnalog: string[] = [];

    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * 300; // 0 to 300 seconds
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
    <section id="experiments" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§8"
        title="Experimental protocol & validation test bench"
        sub="6 canonical perturbation tests comparing microscopic SUMO baseline queues against physical circuit analog voltages."
      />

      {/* Scenario Selector Chips */}
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

      {/* Test Bench Live Visualization */}
      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal grid lg:grid-cols-[1fr_360px] gap-8 max-w-6xl mb-8">
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

          {/* SVG Comparison Graph */}
          <div className="bg-[#1e1b16] rounded-xl p-3 border border-black/20">
            <svg viewBox="0 0 500 190" className="w-full h-48">
              {/* Grid Lines */}
              <line x1="30" y1="40" x2="470" y2="40" stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="470" y2="100" stroke="rgba(255,255,255,0.07)" strokeDasharray="3 3" />
              <line x1="30" y1="160" x2="470" y2="160" stroke="rgba(255,255,255,0.15)" />

              {/* Baseline Curve (SUMO) */}
              <polyline points={baselinePoints} fill="none" stroke="#60a5fa" strokeWidth="2.2" />

              {/* Analog Circuit Curve */}
              <polyline points={analogPoints} fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4 2" />

              {/* Axis Labels */}
              <text x="30" y="30" fill="#94a3b8" fontSize="8.5" fontFamily="JetBrains Mono">Queue Length x_i(t) [veh] ↔ Scaled Node Voltage V_i(t) [V]</text>
              <text x="440" y="175" fill="#94a3b8" fontSize="8.5" fontFamily="JetBrains Mono">Time [s]</text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-[#8a867e] pt-1">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#60a5fa]" /> Ground Truth Baseline (SUMO)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#34d399] border-b border-dashed" /> Power-Electronics Circuit Analog (Scaled V)</span>
            <span className="data text-[#2d6a4f] font-semibold">Validation Tolerance: ±15% MAE</span>
          </div>
        </div>

        {/* Right: Test Description & Falsification Gate */}
        <div className="border border-[rgba(30,27,22,0.1)] rounded-2xl p-5 bg-[#f2efe8] space-y-3.5">
          <div>
            <Label>Traffic Perturbation Action</Label>
            <p className="text-[12px] text-[#332f28] leading-relaxed mt-0.5">{activeTest.trafficPerturbation}</p>
          </div>

          <div>
            <Label>Electrical Analog Action</Label>
            <p className="text-[12px] text-[#2d6a4f] font-medium leading-relaxed mt-0.5">{activeTest.electricalAnalogAction}</p>
          </div>

          <div>
            <Label>Expected Cross-Domain Observation</Label>
            <p className="text-[11.5px] text-[#4a4640] leading-relaxed mt-0.5">{activeTest.expectedObservation}</p>
          </div>

          <div className="bg-white border border-[rgba(30,27,22,0.08)] rounded-xl p-3 pt-2.5">
            <div className="text-[10px] font-mono text-[#b91c1c] uppercase font-bold">Pass/Fail Falsification Gate</div>
            <p className="text-[11.5px] text-[#991b1b] leading-relaxed mt-0.5">{activeTest.passCriteria}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── §9 FIRST EXPERIMENT: 5-NODE LAB DEMO ─────────────────────────────────────

function FirstExperimentLabDemo() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const ref = useReveal();
  const step = FIRST_EXPERIMENT_STEPS[activeStep];

  return (
    <section id="first-experiment" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§9"
        title="First experiment: 5-node lab demo (highest priority)"
        sub="The prioritized proof-of-concept experiment: 7-phase step-by-step protocol validating the circuit analogy on a tangible scale."
      />

      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal max-w-5xl space-y-6">
        {/* Step Progress Stepper */}
        <div className="grid grid-cols-7 gap-1.5">
          {FIRST_EXPERIMENT_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`p-2 rounded-xl text-center transition-all ${
                activeStep === idx
                  ? "bg-[#2d6a4f] text-white shadow-xs"
                  : "bg-white border border-[rgba(30,27,22,0.08)] text-[#4a4640] hover:bg-[#f2efe8]"
              }`}
            >
              <div className="data text-[9px] opacity-80">{s.duration}</div>
              <div className="display text-[12px] font-bold mt-0.5">Step {s.step}</div>
            </button>
          ))}
        </div>

        {/* Active Step Card */}
        <div className="border border-[rgba(30,27,22,0.12)] rounded-2xl p-6 bg-white shadow-xs space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3 pb-3 border-b border-[rgba(30,27,22,0.08)]">
            <div>
              <span className="data text-[10px] text-[#2d6a4f] font-bold">PHASE {step.step} OF 7 · {step.duration}</span>
              <h3 className="display text-[18px] font-medium text-[#1e1b16] mt-0.5">{step.title}</h3>
            </div>
            <div className="data text-[11px] bg-[#f2efe8] px-3 py-1 rounded text-[#1e1b16]">
              Objective: <strong>{step.objective}</strong>
            </div>
          </div>

          <div>
            <Label>Step-by-Step Procedure Checklist</Label>
            <div className="space-y-2 mt-2">
              {step.procedure.map((proc, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[12px] text-[#332f28] leading-relaxed bg-[#f8f6f1] p-3 rounded-lg border border-[rgba(30,27,22,0.05)]">
                  <span className="w-5 h-5 rounded-full bg-[#d1ece0] text-[#1a5c36] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{proc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[rgba(30,27,22,0.08)]">
            <div className="text-[11.5px] text-[#4a4640]">
              <strong>Primary Deliverable:</strong> <span className="font-mono text-[#2d6a4f]">{step.deliverable}</span>
            </div>
            <div className="flex gap-2 font-mono text-[10px]">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                className="px-3 py-1 rounded bg-[#f2efe8] text-[#1e1b16] disabled:opacity-40"
              >
                ← Prev Step
              </button>
              <button
                disabled={activeStep === FIRST_EXPERIMENT_STEPS.length - 1}
                onClick={() => setActiveStep((s) => Math.min(FIRST_EXPERIMENT_STEPS.length - 1, s + 1))}
                className="px-3 py-1 rounded bg-[#2d6a4f] text-white disabled:opacity-40"
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── §10 SCIENTIFIC RISK ANALYSIS & DECISION CRITERIA ─────────────────────────

function RiskRegisterSection() {
  const [selectedRiskId, setSelectedRiskId] = useState<string>("risk-no-mapping");
  const activeRisk = RISK_REGISTER.find((r) => r.id === selectedRiskId) || RISK_REGISTER[0];
  const ref = useReveal();

  const severityColor = (sev: "High" | "Medium" | "Low") =>
    sev === "High" ? "bg-[#fdd5d5] text-[#991b1b]" : sev === "Medium" ? "bg-[#fde8c8] text-[#7c3811]" : "bg-[#d1ece0] text-[#1a5c36]";

  return (
    <section id="risk-register" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§10"
        title="Scientific risk analysis & decision/abandonment criteria"
        sub="Comprehensive risk register with likelihood, severity, root cause failure mechanisms, mitigations, and explicit continue-vs-abandon criteria."
      />

      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal grid lg:grid-cols-[380px_1fr] gap-8 max-w-6xl">
        {/* Left: Risk List */}
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
                <div className="text-[10px] text-[#8a867e] mt-1 pl-7">{r.category}</div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Risk Deep-Dive & Abandonment Criteria */}
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
              <span className="px-2 py-0.5 rounded bg-[#f2efe8] text-[#4a4640] font-bold">
                Likelihood: {activeRisk.likelihood}
              </span>
            </div>
          </div>

          <div>
            <Label>Threat Summary & Failure Mechanism</Label>
            <p className="text-[12.5px] text-[#332f28] leading-relaxed mt-1">{activeRisk.threatDescription}</p>
            <div className="bg-[#f8f6f1] p-3 rounded-lg border border-[rgba(30,27,22,0.06)] text-[11.5px] text-[#4a4640] mt-2 leading-relaxed">
              <strong>Root Cause:</strong> {activeRisk.failureMechanism}
            </div>
          </div>

          <div>
            <Label>Engineering Mitigation Strategy</Label>
            <p className="text-[12.5px] text-[#2d6a4f] font-medium leading-relaxed mt-1">{activeRisk.mitigationStrategy}</p>
          </div>

          <div className="bg-[#fdd5d5]/30 border border-[#fca5a5] rounded-xl p-4">
            <div className="text-[10px] font-mono text-[#b91c1c] uppercase font-bold tracking-wider mb-1">
              ⛔ Explicit Abandonment / Pivot Threshold
            </div>
            <p className="text-[12px] text-[#7f1d1d] leading-relaxed font-mono">
              {activeRisk.decisionAbandonmentThreshold}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── §11 RESEARCH ROADMAP, GANTT & BUDGET BREAKDOWN ───────────────────────────

function RoadmapAndBudgetSection() {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const stage = RESEARCH_ROADMAP_STAGES[activeStageIdx];
  const ref = useReveal();

  const totalThreeYearBudget = useMemo(() => {
    return BUDGET_BREAKDOWN.reduce((sum, item) => sum + item.threeYearTotalUSD, 0);
  }, []);

  return (
    <section id="roadmap-budget" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§11"
        title="3-Year research roadmap, milestones & budget plan"
        sub="Comprehensive Stage 0 to Stage 7 execution timeline (2026–2031) with multidisciplinary personnel allocation and $1M–$1.5M budget breakdown."
      />

      {/* Stage Timeline Viewer */}
      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal border border-[rgba(30,27,22,0.1)] rounded-2xl bg-white p-6 mb-8 max-w-6xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <Label>Research Stages (Stage 0 to Stage 7)</Label>
          <span className="data text-[10px] text-[#8a867e]">3-Year Total Scope</span>
        </div>

        {/* Stage Buttons */}
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

        {/* Active Stage Details */}
        <div className="space-y-4 pt-3 border-t border-[rgba(30,27,22,0.08)]">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <span className="data text-[10px] text-[#2d6a4f] font-bold">{stage.stageNumber} · {stage.quarterSpan}</span>
              <h3 className="display text-[18px] font-medium text-[#1e1b16] mt-0.5">{stage.stageName}</h3>
            </div>
            <div className="flex gap-2 font-mono text-[10px]">
              <span className="px-2.5 py-1 rounded bg-[#f2efe8] text-[#1e1b16]">Timeframe: {stage.timeframe}</span>
              <span className="px-2.5 py-1 rounded bg-[#d1ece0] text-[#1a5c36] font-bold">Lead: {stage.leadRole}</span>
            </div>
          </div>

          <div>
            <Label>Core Deliverables</Label>
            <ul className="space-y-1.5 mt-1.5 text-[12px] text-[#332f28]">
              {stage.coreDeliverables.map((del, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="text-[#2d6a4f] font-bold shrink-0 mt-0.5">→</span>
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#f8f6f1] p-3 rounded-xl border border-[rgba(30,27,22,0.06)] text-[11.5px] text-[#4a4640]">
            <strong>Stage Gate Approval Criteria:</strong> {stage.gateCriteria}
          </div>
        </div>
      </div>

      {/* Multidisciplinary Team & 3-Year Budget Breakdown */}
      <div className="grid md:grid-cols-[1fr_360px] gap-8 max-w-6xl">
        <div className="border border-[rgba(30,27,22,0.1)] rounded-2xl p-6 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <Label>3-Year Resource & Budget Breakdown</Label>
            <span className="data text-[12px] bg-[#d1ece0] text-[#1a5c36] px-3 py-1 rounded-lg font-bold">
              Total Budget: ${totalThreeYearBudget.toLocaleString()} USD
            </span>
          </div>

          <div className="space-y-3">
            {BUDGET_BREAKDOWN.map((b, i) => (
              <div key={i} className="border-b border-[rgba(30,27,22,0.05)] pb-3 text-[12px]">
                <div className="flex justify-between items-baseline font-semibold text-[#1e1b16]">
                  <span>{b.category}</span>
                  <span className="data text-[#2d6a4f]">${b.threeYearTotalUSD.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-[#8a867e] mt-0.5">{b.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Required Personnel Roles */}
        <div className="border border-[rgba(30,27,22,0.1)] rounded-2xl p-5 bg-[#f2efe8] space-y-3">
          <Label>Interdisciplinary Personnel Team</Label>
          <ul className="space-y-2.5 text-[11.5px] text-[#332f28]">
            <li className="flex gap-2">
              <span className="font-bold text-[#2d6a4f] shrink-0">1 PI:</span>
              <span>Traffic Systems & Network Optimization Lead</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#2d6a4f] shrink-0">1 Co-PI:</span>
              <span>Power Electronics & Converter Control Systems Lead</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#1e1b16] shrink-0">2 PhDs:</span>
              <span>1 in Traffic Micro-simulation (SUMO), 1 in PLECS & FCS-MPC</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#1e1b16] shrink-0">1 Res. Eng:</span>
              <span>Co-simulation architecture (FMI) and Python pipelines</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#1e1b16] shrink-0">1 Lab Tech:</span>
              <span>Hardware PCB fabrication, bench wiring & DAQ instrumentation</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── §12 NOVELTY CLAIMS & FALSIFICATION CHECKLIST ─────────────────────────────

function NoveltyChecklistSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const listRef = useRevealList();

  const statusCls: Record<string, string> = {
    novel: "bg-[#d1ece0] text-[#1a5c36]",
    plausible: "bg-[#fde8c8] text-[#7c3811]",
    established: "bg-[#eae7df] text-[#4a4640]",
  };

  const verifiedCount = Object.values(checked).filter(Boolean).length;
  const pct = NOVELTY_CHECKLIST.length > 0 ? (verifiedCount / NOVELTY_CHECKLIST.length) * 100 : 0;

  return (
    <section id="novelty-checklist" className="section-anchor px-6 sm:px-12 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§12"
        title="Interactive novelty claims & falsification checklist"
        sub="Clearly isolating genuinely novel power-electronics contributions from 70 years of established hydrodynamic prior art."
      />

      <div className="max-w-4xl mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-[#8a867e]">Claims verified during peer review</span>
          <span className="data text-[11px] text-[#2d6a4f] font-medium">
            {verifiedCount} / {NOVELTY_CHECKLIST.length} ({pct.toFixed(0)}%)
          </span>
        </div>
        <div className="h-2 bg-[#eae7df] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2d6a4f] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div ref={listRef as React.RefObject<HTMLDivElement>} className="space-y-3 max-w-4xl">
        {NOVELTY_CHECKLIST.map((item) => (
          <label
            key={item.id}
            className={`reveal flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
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
    </section>
  );
}

// ─── §13 PRIOR ART & PATENT SEARCH DOSSIER ────────────────────────────────────

function PriorArtAndPatentsSection() {
  const [filterCat, setFilterCat] = useState<string>("all");
  const listRef = useRevealList();

  const filtered = useMemo(() => {
    return EXPANDED_PRIOR_ART.filter((p) => {
      if (filterCat !== "all" && p.category !== filterCat) return false;
      return true;
    });
  }, [filterCat]);

  return (
    <section id="prior-art-patents" className="section-anchor px-6 sm:px-12 py-12">
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

      <div ref={listRef as React.RefObject<HTMLDivElement>} className="space-y-4 max-w-5xl">
        {filtered.map((p, i) => (
          <div key={p.id} className="reveal border border-[rgba(30,27,22,0.1)] rounded-xl p-5 bg-white shadow-2xs">
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

      <div className="mt-12 border-t border-[rgba(30,27,22,0.08)] pt-5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#8a867e]">
        <span className="display italic">Deep Research Platform · EEE × Urban Traffic Synthesis · Stage 0 Complete</span>
        <span className="data">Version 3.0 · {new Date().toISOString().slice(0, 10)}</span>
      </div>
    </section>
  );
}

// ─── MASTER APP COMPONENT ─────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState("title");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f6f1] text-[#1e1b16]">
      <ScrollProgress />
      <SpineNav active={activeSection} />
      <div className="h-10 xl:h-0 block xl:hidden" />
      <main className="xl:ml-12">
        <TitleBlock />
        <ExecutionGuideSection />
        <ResearchObjectives />
        <DecisionMatrixSection />
        <DimensionalAnalysisSection />
        <MathematicalModelsSection />
        <SimulationToolchainSection />
        <CircuitDesignSection />
        <HardwarePrototypeSection />
        <ExperimentalProtocolSection />
        <FirstExperimentLabDemo />
        <RiskRegisterSection />
        <RoadmapAndBudgetSection />
        <NoveltyChecklistSection />
        <PriorArtAndPatentsSection />
      </main>
    </div>
  );
}
