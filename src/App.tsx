import { useState, useEffect, useRef, useMemo } from "react";
import {
  SECTIONS,
  MAPPINGS,
  PARALLELS,
  PRIOR_ART,
  GAP_MATRIX,
  CHECKLIST_ITEMS,
  ROADMAP,
  RISKS,
  type Verdict,
  type ParallelField,
  type ParallelStrength,
} from "./data";

// ─── scroll progress ──────────────────────────────────────────────────────────

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

// ─── animated number ──────────────────────────────────────────────────────────

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

// ─── reveal hooks ─────────────────────────────────────────────────────────────

function useReveal(className = "in") {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add(className); observer.disconnect(); }
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
            (el as HTMLElement).style.setProperty("--stagger", `${i * 45}ms`);
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

// ─── verdict helpers ──────────────────────────────────────────────────────────

const verdictStyles: Record<Verdict, { pill: string; dot: string; label: string }> = {
  strong:   { pill: "bg-[#d1ece0] text-[#1a5c36]", dot: "bg-[#2d6a4f]", label: "Strong / Established" },
  moderate: { pill: "bg-[#fde8c8] text-[#7c3811]", dot: "bg-[#d97706]", label: "Moderate / Caution" },
  weak:     { pill: "bg-[#fdd5d5] text-[#991b1b]", dot: "bg-[#b91c1c]", label: "Weak / Reject" },
  open:     { pill: "bg-[#dbeafe] text-[#1e3a8a]", dot: "bg-[#3b82f6]", label: "Open Research Gap" },
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

function strengthLabel(s: ParallelStrength) {
  if (s === "direct")     return { text: "Direct",     cls: "text-[#1a5c36] bg-[#d1ece0]" };
  if (s === "structural") return { text: "Structural", cls: "text-[#7c3811] bg-[#fde8c8]" };
  return                         { text: "Loose",      cls: "text-[#4a4640] bg-[#eae7df]" };
}

function relevancePill(r: "high" | "medium" | "low") {
  if (r === "high")   return "bg-[#d1ece0] text-[#1a5c36]";
  if (r === "medium") return "bg-[#fde8c8] text-[#7c3811]";
  return "bg-[#eae7df] text-[#8a867e]";
}

// ─── section header ───────────────────────────────────────────────────────────

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
          <h2 className="display text-[22px] font-medium text-[#1e1b16] tracking-tight">{title}</h2>
        </div>
        {sub && <p className="mt-2 text-[13px] text-[#8a867e] leading-relaxed max-w-2xl">{sub}</p>}
        <div className="mt-4 h-px bg-[rgba(30,27,22,0.1)]" />
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="data text-[9px] tracking-widest text-[#8a867e] uppercase">{children}</span>;
}

// ─── spine nav ────────────────────────────────────────────────────────────────

function SpineNav({ active }: { active: string }) {
  return (
    <>
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-10 flex-col items-center justify-center border-r border-[rgba(30,27,22,0.08)] z-50 bg-[#f8f6f1]">
        <div className="flex flex-col gap-1">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              title={s.label}
              className={`flex items-center justify-center w-7 h-6 rounded transition-all group ${
                active === s.id ? "bg-[#2d6a4f]" : "hover:bg-[rgba(30,27,22,0.05)]"
              }`}
            >
              <span className={`display text-[8px] italic transition-colors ${
                active === s.id ? "text-white" : "text-[#8a867e] group-hover:text-[#1e1b16]"
              }`}>
                {s.marker}
              </span>
            </a>
          ))}
        </div>
      </nav>

      <nav className="md:hidden fixed top-[2px] left-0 right-0 z-50 bg-[#f8f6f1]/95 backdrop-blur border-b border-[rgba(30,27,22,0.08)]">
        <div className="flex gap-1 overflow-x-auto no-scrollbar px-3 py-2">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`flex-shrink-0 data text-[9px] px-2.5 py-1 rounded-full transition-all ${
                active === s.id
                  ? "bg-[#2d6a4f] text-white"
                  : "text-[#8a867e] hover:text-[#1e1b16] hover:bg-[rgba(30,27,22,0.06)]"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

// ─── title block ──────────────────────────────────────────────────────────────

const STATS = [
  { n: 12, label: "analogies assessed",         delay: 100 },
  { n: 12, label: "parallels surveyed",         delay: 200 },
  { n: 4,  label: "prior art items dissected",  delay: 300 },
  { n: 3,  label: "genuinely novel claims",     delay: 400 },
  { n: 1,  label: "critical fault line",        delay: 500 },
];

function TitleBlock() {
  const ref = useReveal();
  return (
    <section id="title" className="section-anchor border-b border-[rgba(30,27,22,0.08)]">
      <div className="grid-bg px-6 sm:px-10 pt-10 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm bg-[#2d6a4f] flex items-center justify-center">
              <span className="display text-[10px] italic text-white font-medium">§</span>
            </div>
            <span className="data text-[10px] text-[#8a867e] tracking-widest">RESEARCH CONCEPT BRIEF · EEE × TRAFFIC</span>
          </div>
          <div className="flex gap-5">
            {[["Status", "Stage 0 · Validation"], ["Rev", "1.0"], ["Date", "2026-09-01"]].map(([k, v]) => (
              <div key={k}>
                <Label>{k}</Label>
                <div className="data text-[10px] text-[#4a4640] mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal max-w-3xl">
          <h1 className="display text-[36px] sm:text-[52px] font-medium leading-[1.06] tracking-tight text-[#1e1b16]">
            Power-Systems & Power-Electronics{" "}
            <em className="font-light">Representation</em>{" "}
            of an Urban Traffic Network
          </h1>
          <p className="mt-5 text-[15px] text-[#4a4640] leading-relaxed max-w-2xl">
            Can an urban traffic grid be formulated as a dynamically reconfigurable, power-system-inspired
            switching network? This brief investigates that question with scientific discipline:
            preserving useful physical conservation, rejecting weak analogies, exposing 70 years of prior art,
            and introducing power-electronics switching mathematics only where it adds measurable capability.
          </p>
        </div>

        {/* animated stat counters */}
        <div className="mt-10 flex flex-wrap gap-8">
          {STATS.map(({ n, label, delay }) => (
            <div key={label}>
              <div className="display text-[30px] font-medium text-[#2d6a4f] tabular-nums">
                <AnimatedNumber target={n} delay={delay} />
              </div>
              <div className="text-[11px] text-[#8a867e] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 sm:px-10 py-3 bg-[#fde8c8]/40 border-t border-[rgba(146,64,14,0.12)] flex items-start gap-3">
        <span className="data text-[9px] text-[#92400e] tracking-widest mt-0.5 shrink-0">CORE RULE</span>
        <p className="text-[12px] text-[#7c5a3a] leading-relaxed">
          Do not claim novelty from an analogy that already exists in literature. Try to break the idea first.
          The fault line in §5 explains where the circuit analogy collapses and the active switching fix in §8.
        </p>
      </div>
    </section>
  );
}

// ─── core idea ────────────────────────────────────────────────────────────────

function CoreIdea() {
  const listRef = useRevealList();
  return (
    <section id="core-idea" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§1"
        title="Analogy mapping matrix"
        sub="Each card maps one traffic element to its electrical counterpart. Strong mappings are separated from speculative ones to avoid superficial rebranding."
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {(Object.entries(verdictStyles) as [Verdict, typeof verdictStyles[Verdict]][]).map(([v, s]) => (
          <span key={v} className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium ${s.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        ))}
      </div>

      <div ref={listRef as React.RefObject<HTMLDivElement>} className="grid sm:grid-cols-2 gap-4 max-w-4xl">
        {MAPPINGS.map((m, i) => (
          <div key={i} className="reveal border border-[rgba(30,27,22,0.1)] rounded-2xl p-5 bg-white flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label>Traffic Element</Label>
                <div className="mt-1 text-[14px] font-semibold text-[#1e1b16] leading-snug">{m.ecology}</div>
              </div>
              <div className="shrink-0 mt-0.5"><VerdictPill v={m.verdict} /></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-[rgba(30,27,22,0.08)]" />
              <span className="text-[11px] text-[#8a867e] px-1">maps to</span>
              <div className="flex-1 h-px bg-[rgba(30,27,22,0.08)]" />
            </div>
            <div>
              <Label>Power System / Electronics Concept</Label>
              <div className="mt-1 text-[13px] font-medium text-[#2d6a4f] leading-snug">{m.neural}</div>
            </div>
            <div className="border-t border-[rgba(30,27,22,0.06)] pt-3 text-[11px] text-[#8a867e] leading-relaxed">
              {m.note}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── explainer ────────────────────────────────────────────────────────────────

function Explainer() {
  const listRef = useRevealList();
  return (
    <section id="explainer" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader n="§2" title="What we are actually trying to do" />

      <div ref={listRef as React.RefObject<HTMLDivElement>} className="grid sm:grid-cols-2 gap-6 max-w-4xl mb-8">
        <div className="reveal p-5 rounded-lg border border-[rgba(185,28,28,0.15)] bg-[#fdd5d5]/20">
          <div className="text-[10px] font-semibold text-[#b91c1c] tracking-wider mb-3 uppercase">Surface claim</div>
          <p className="text-[13px] text-[#6b4a4a] leading-relaxed italic">
            "Cars are electrons, roads are wires, intersections are buses, and we can solve urban traffic congestion
            by simply applying Ohm's and Kirchhoff's laws to traffic networks."
          </p>
          <p className="mt-2 text-[11px] text-[#b91c1c]">↑ superficial metaphor · mathematically invalid</p>
        </div>
        <div className="reveal p-5 rounded-lg border border-[rgba(45,106,79,0.2)] bg-[#d1ece0]/20">
          <div className="text-[10px] font-semibold text-[#2d6a4f] tracking-wider mb-3 uppercase">Actual claim</div>
          <p className="text-[13px] text-[#1e1b16] leading-relaxed">
            Traffic signals act as <em>discrete multi-pole semiconductor switches</em> governing dynamic link admittance.
            By formulating signalized networks as switched hybrid dynamical systems, we apply
            <strong> Finite-Control-Set MPC</strong> with explicit switching loss penalties (lost green clearance time)
            and <strong>N−1 contingency analysis</strong> to prevent cascading queue collapse.
          </p>
          <p className="mt-2 text-[11px] text-[#2d6a4f]">↑ testable · falsifiable · rigorous</p>
        </div>
      </div>

      <div ref={useRevealList() as React.RefObject<HTMLDivElement>} className="grid sm:grid-cols-3 gap-4 max-w-4xl">
        {[
          {
            label: "Not the goal",
            items: [
              "Rebrand existing hydrodynamic current analogies as novel",
              "Force Ohm's law where travel-time curl is non-zero",
              "Propose a city-wide AI system without a 5-node toy test",
            ],
            cls: "border-[rgba(185,28,28,0.15)] bg-[#fdd5d5]/10", labelCls: "text-[#b91c1c]",
          },
          {
            label: "Is the goal",
            items: [
              "FCS-MPC discrete switching state optimization",
              "N-1 contingency screening for urban bottleneck resilience",
              "Rigorous divergence measurement against traffic baselines",
            ],
            cls: "border-[rgba(45,106,79,0.15)] bg-[#d1ece0]/15", labelCls: "text-[#2d6a4f]",
          },
          {
            label: "Open question",
            items: [
              "Can switched admittance Y(t) beat Max-Pressure under backpressure?",
              "Does N-1 screening reliably predict urban shockwave spillback?",
              "Can 1-hop distributed consensus avoid central solver latency?",
            ],
            cls: "border-[rgba(30,64,175,0.12)] bg-[#dbeafe]/10", labelCls: "text-[#1e40af]",
          },
        ].map((box) => (
          <div key={box.label} className={`reveal p-4 rounded-lg border ${box.cls}`}>
            <div className={`text-[10px] font-semibold tracking-wider mb-3 uppercase ${box.labelCls}`}>{box.label}</div>
            <ul className="space-y-2">
              {box.items.map((item) => (
                <li key={item} className="text-[12px] text-[#4a4640] leading-relaxed flex gap-2">
                  <span className="text-[#8a867e] shrink-0">—</span>{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── parallels explorer ───────────────────────────────────────────────────────

function ParallelsExplorer() {
  const [query, setQuery] = useState("");
  const [fieldFilter, setFieldFilter] = useState<ParallelField | "all">("all");
  const [strengthFilter, setStrengthFilter] = useState<ParallelStrength | "all">("all");
  const [relevanceFilter, setRelevanceFilter] = useState<"high" | "medium" | "low" | "all">("all");
  const listRef = useRevealList();

  const fields = useMemo(() => {
    const seen = new Set<string>();
    PARALLELS.forEach((p) => seen.add(p.field));
    return ["all", ...Array.from(seen)] as (ParallelField | "all")[];
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return PARALLELS.filter((p) => {
      if (fieldFilter !== "all" && p.field !== fieldFilter) return false;
      if (strengthFilter !== "all" && p.strength !== strengthFilter) return false;
      if (relevanceFilter !== "all" && p.relevance !== relevanceFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.note.toLowerCase().includes(q) && !p.authors.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, fieldFilter, strengthFilter, relevanceFilter]);

  const selectCls = "bg-white border border-[rgba(30,27,22,0.12)] text-[#1e1b16] text-[11px] px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#2d6a4f] transition-colors";

  const fieldColors: Record<string, string> = {
    "traffic engineering": "bg-[#d1ece0] text-[#1a5c36]",
    "power systems":       "bg-[#dbeafe] text-[#1e3a8a]",
    "power electronics":   "bg-[#fde8c8] text-[#7c3811]",
    "control theory":      "bg-[#ede9fe] text-[#4c1d95]",
    "network theory":      "bg-[#fdd5d5] text-[#991b1b]",
    "optimization":        "bg-[#eae7df] text-[#4a4640]",
  };

  return (
    <section id="parallels" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§3"
        title="Parallels explorer"
        sub={`${PARALLELS.length} foundational theories across traffic engineering, power systems, power electronics, and control surveyed.`}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <input
          type="text" placeholder="Search literature…" value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white border border-[rgba(30,27,22,0.12)] text-[#1e1b16] text-[12px] px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#2d6a4f] placeholder-[#8a867e] transition-colors w-40"
        />
        <select value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value as ParallelField | "all")} className={selectCls}>
          {fields.map((f) => <option key={f} value={f}>{f === "all" ? "All fields" : f}</option>)}
        </select>
        <select value={strengthFilter} onChange={(e) => setStrengthFilter(e.target.value as ParallelStrength | "all")} className={selectCls}>
          <option value="all">All connections</option>
          <option value="direct">Direct</option>
          <option value="structural">Structural</option>
          <option value="loose">Loose</option>
        </select>
        <select value={relevanceFilter} onChange={(e) => setRelevanceFilter(e.target.value as "high" | "medium" | "low" | "all")} className={selectCls}>
          <option value="all">All relevance</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <span className="text-[11px] text-[#8a867e] self-center ml-auto">{filtered.length} / {PARALLELS.length}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-[13px] text-[#8a867e]">No matches</div>
      ) : (
        <div ref={listRef as React.RefObject<HTMLDivElement>} className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((p) => {
            const sl = strengthLabel(p.strength);
            const fc = fieldColors[p.field] ?? "bg-[#eae7df] text-[#4a4640]";
            return (
              <div key={p.name} className="reveal bg-white border border-[rgba(30,27,22,0.09)] rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[13px] font-semibold text-[#1e1b16] leading-snug">{p.name}</div>
                    <div className="text-[10px] text-[#8a867e] mt-0.5">{p.authors}, {p.year}</div>
                  </div>
                  <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${relevancePill(p.relevance)}`}>
                    {p.relevance}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${fc}`}>{p.field}</span>
                  <span className={`data text-[9px] px-2 py-0.5 rounded-full ${sl.cls}`}>{sl.text}</span>
                </div>
                <div className="text-[11px] text-[#4a4640] leading-relaxed border-t border-[rgba(30,27,22,0.06)] pt-3 flex-1">
                  {p.note}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ─── live demo (Small-Town Grid & FCS-MPC Switching) ──────────────────────────

function LiveDemo() {
  const [horizon, setHorizon] = useState(3);
  const [swPenalty, setSwPenalty] = useState(0.4);
  const [demandFactor, setDemandFactor] = useState(1.0);
  const [activeState, setActiveState] = useState(1);
  const ref = useReveal();

  // Benchmark nodes coordinates in SVG
  const nodes = [
    { id: "J1", x: 80, y: 70, name: "North-West Gate" },
    { id: "J2", x: 250, y: 60, name: "North Hub" },
    { id: "J3", x: 420, y: 70, name: "North-East Gate" },
    { id: "J4", x: 140, y: 150, name: "West Collector" },
    { id: "J5", x: 260, y: 140, name: "Central Commercial Core" },
    { id: "J6", x: 380, y: 150, name: "East Collector" },
    { id: "J7", x: 260, y: 220, name: "South Terminal Hub" },
  ];

  const branches = [
    { id: "R1", from: "J1", to: "J2", flow: 1450 * demandFactor, cap: 2400 },
    { id: "R2", from: "J2", to: "J3", flow: 1820 * demandFactor, cap: 2400 },
    { id: "R3", from: "J1", to: "J4", flow: 980 * demandFactor, cap: 1600 },
    { id: "R4", from: "J2", to: "J5", flow: 2150 * demandFactor, cap: 2200 }, // Critical Bottleneck!
    { id: "R5", from: "J3", to: "J6", flow: 890 * demandFactor, cap: 1600 },
    { id: "R6", from: "J4", to: "J5", flow: 1120 * demandFactor, cap: 1800 },
    { id: "R7", from: "J5", to: "J6", flow: 1340 * demandFactor, cap: 1800 },
    { id: "R8", from: "J4", to: "J7", flow: 780 * demandFactor, cap: 1600 },
    { id: "R9", from: "J5", to: "J7", flow: 1980 * demandFactor, cap: 2200 },
    { id: "R10", from: "J6", to: "J7", flow: 920 * demandFactor, cap: 1600 },
  ];

  // Dynamic cost calculation based on FCS-MPC parameters
  const bestState = useMemo(() => {
    // S1: N-S Through, S2: E-W Through, S3: Left Turns, S4: Pedestrian
    const costs = [
      { s: 1, name: "S1 (N-S Arterial)", qCost: 140 / demandFactor, swCost: activeState === 1 ? 0 : swPenalty * 80 },
      { s: 2, name: "S2 (E-W Cross)", qCost: 280 * demandFactor, swCost: activeState === 2 ? 0 : swPenalty * 80 },
      { s: 3, name: "S3 (Protected Lefts)", qCost: 310 * demandFactor, swCost: activeState === 3 ? 0 : swPenalty * 80 },
      { s: 4, name: "S4 (All-Pedestrian)", qCost: 450 * demandFactor, swCost: activeState === 4 ? 0 : swPenalty * 80 },
    ];
    const evaluated = costs.map((c) => ({
      ...c,
      total: (c.qCost * horizon + c.swCost).toFixed(1),
    }));
    evaluated.sort((a, b) => parseFloat(a.total) - parseFloat(b.total));
    return evaluated;
  }, [horizon, swPenalty, demandFactor, activeState]);

  return (
    <section id="demo" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§4"
        title="Live interactive benchmark — 7-Node Town & FCS-MPC"
        sub="The 7-intersection benchmark grid with active signal-as-switch modulation and predictive cost evaluation."
      />

      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal grid sm:grid-cols-[240px_1fr] gap-8">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[11px] text-[#4a4640]">Prediction Horizon N_p</span>
              <span className="data text-[11px] text-[#2d6a4f] font-medium">{horizon} steps</span>
            </div>
            <input type="range" min={1} max={6} step={1} value={horizon}
              onChange={(e) => setHorizon(parseInt(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[11px] text-[#4a4640]">Switching Penalty λ_sw</span>
              <span className="data text-[11px] text-[#2d6a4f] font-medium">{swPenalty.toFixed(2)}</span>
            </div>
            <input type="range" min={0} max={1.5} step={0.05} value={swPenalty}
              onChange={(e) => setSwPenalty(parseFloat(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[11px] text-[#4a4640]">Inflow Demand Factor</span>
              <span className="data text-[11px] text-[#2d6a4f] font-medium">{demandFactor.toFixed(2)}×</span>
            </div>
            <input type="range" min={0.6} max={1.5} step={0.05} value={demandFactor}
              onChange={(e) => setDemandFactor(parseFloat(e.target.value))} className="w-full" />
          </div>

          <div className="border border-[rgba(30,27,22,0.1)] rounded-lg p-4 bg-[#f2efe8] space-y-3">
            <div>
              <Label>Optimal FCS-MPC Selected State</Label>
              <div className="display font-medium text-[20px] text-[#2d6a4f] mt-0.5">
                {bestState[0].name}
              </div>
            </div>
            <div>
              <Label>Min. Predicted Cost J*</Label>
              <div className="display font-medium text-[16px] text-[#1e1b16] mt-0.5">
                {bestState[0].total} veh·s
              </div>
            </div>
            <div>
              <Label>Critical Bottleneck</Label>
              <div className="data text-[11px] text-[#b91c1c] font-medium mt-0.5">
                R4 (J2→J5) @ {(branches[3].flow / branches[3].cap * 100).toFixed(0)}% Cap.
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* SVG Diagram of 7-Node Town */}
          <svg viewBox="0 0 500 260" className="w-full rounded-lg border border-[rgba(30,27,22,0.1)] bg-white">
            {/* Draw road branches */}
            {branches.map((b) => {
              const n1 = nodes.find((n) => n.id === b.from)!;
              const n2 = nodes.find((n) => n.id === b.to)!;
              const satRatio = b.flow / b.cap;
              const isBottleneck = satRatio >= 0.95;
              const strokeColor = isBottleneck ? "#b91c1c" : satRatio > 0.7 ? "#d97706" : "#2d6a4f";
              return (
                <g key={b.id}>
                  <line
                    x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                    stroke={strokeColor}
                    strokeWidth={isBottleneck ? 4 : 2.5}
                    strokeDasharray={isBottleneck ? "4 2" : "none"}
                  />
                  <text
                    x={(n1.x + n2.x) / 2}
                    y={(n1.y + n2.y) / 2 - 4}
                    fill={strokeColor}
                    fontSize="7.5"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {b.id}: {(satRatio * 100).toFixed(0)}%
                  </text>
                </g>
              );
            })}

            {/* Draw nodes (buses / intersections) */}
            {nodes.map((n) => (
              <g key={n.id} className="cursor-pointer" onClick={() => setActiveState((s) => (s % 4) + 1)}>
                <circle cx={n.x} cy={n.y} r={14} fill="white" stroke="#1e1b16" strokeWidth="2" />
                {n.id === "J5" && (
                  <circle cx={n.x} cy={n.y} r={18} fill="none" stroke="#2d6a4f" strokeWidth="1.5" strokeDasharray="3 3" />
                )}
                <text x={n.x} y={n.y + 3.5} textAnchor="middle" fill="#1e1b16" fontSize="8" fontFamily="JetBrains Mono" fontWeight="700">
                  {n.id}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-3 flex flex-wrap items-center justify-between text-[10px] text-[#8a867e]">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#2d6a4f]" /> Normal Flow (&lt;70%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#d97706]" /> Near-Sat (&gt;70%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-[#b91c1c]" /> Bottleneck (&gt;95%)</span>
            </div>
            <span className="data">Click J5 to cycle candidate switching states S1–S4</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── fault line ───────────────────────────────────────────────────────────────

function FaultLine() {
  const ref = useReveal();
  return (
    <section id="fault-line" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader n="§5" title="Fault line / critical scientific objection" />
      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal max-w-3xl">
        <div className="border-l-4 border-[#b91c1c] bg-[#fdd5d5]/20 rounded-r-xl p-6">
          <div className="text-[10px] font-semibold text-[#b91c1c] tracking-wider mb-3 uppercase">⚠ Fatal flaw of passive analogies</div>
          <h3 className="display text-[18px] font-medium text-[#1e1b16] mb-3">
            Traffic potential fields are non-conservative. Kirchhoff's Voltage Law does not hold.
          </h3>
          <p className="text-[13px] text-[#4a4640] leading-relaxed mb-3">
            In an electrical circuit, the line integral of electric field along any closed loop is strictly zero:
            ∮ E · dl = 0. In an urban road network, due to one-way streets, turn restrictions, and asymmetric delays,
            the line integral of travel cost around a closed block is fundamentally non-zero.
          </p>
          <p className="text-[13px] text-[#4a4640] leading-relaxed">
            Furthermore, passive resistor networks cannot model congestion shockwaves propagating upstream, nor can they
            represent the discrete switching of traffic signals. Forcing Ohm's law on traffic is a category error.
          </p>
        </div>

        <div className="flex items-center my-1 px-2" aria-hidden>
          <svg viewBox="0 0 400 24" className="w-full h-6 opacity-30">
            <polyline
              points="0,12 60,12 80,4 100,20 120,8 145,16 170,12 210,12 230,6 255,18 275,10 300,14 320,12 400,12"
              fill="none" stroke="#b91c1c" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="border-l-4 border-[#2d6a4f] bg-[#d1ece0]/20 rounded-r-xl p-6">
          <div className="text-[10px] font-semibold text-[#2d6a4f] tracking-wider mb-3 uppercase">→ The specific mathematical fix</div>
          <p className="text-[13px] text-[#1e1b16] leading-relaxed font-medium mb-3">
            Abandon passive circuit analogies. Formulate traffic signals as active semiconductor switching bridges.
          </p>
          <p className="text-[13px] text-[#4a4640] leading-relaxed mb-3">
            Signal phases are modeled as discrete switching vectors u(k) ∈ &#123;0, 1&#125;^M that dynamically alter the network
            admittance matrix Y(t). Travel delay is not voltage; it is irreversible branch dissipation.
          </p>
          <p className="text-[13px] text-[#4a4640] leading-relaxed mb-3">
            This transforms the problem into a <strong className="text-[#2d6a4f]">switched piecewise-affine dynamical system</strong>,
            where Finite-Control-Set MPC (FCS-MPC) explicitly optimizes switching intervals while penalizing lost clearance time.
          </p>
          <p className="text-[12px] text-[#8a867e] leading-relaxed">
            This reframe is mathematically grounded in power electronics, preserves macroscopic conservation laws, and generates
            falsifiable, testable predictions.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── scaling ──────────────────────────────────────────────────────────────────

function Scaling() {
  const listRef = useRevealList();
  return (
    <section id="scaling" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader n="§6" title="Scale-up case study" sub="From the 7-node toy town to the real-world Coimbatore arterial corridor." />
      <div ref={listRef as React.RefObject<HTMLDivElement>} className="grid sm:grid-cols-3 gap-4 max-w-4xl">
        {[
          {
            scale: "Benchmark  7-Node Town",
            items: [
              "Every conservation equation inspectable by hand",
              "10 branches, 4 signalized intersections (J2, J4, J5, J6)",
              "Direct analytical comparison between CTM and Switched Network",
            ],
            note: "Phase 1 testbed. Designed to verify or kill the hypothesis.",
            bg: "bg-[#d1ece0]/15 border-[rgba(45,106,79,0.15)]",
          },
          {
            scale: "Corridor  Coimbatore Avinashi Rd",
            items: [
              "Lakshmi Mills to Nava India arterial segment (1.8 km)",
              "Strict provenance labeling: MEASURED, PUBLISHED, ESTIMATED",
              "Heterogeneous mixed traffic (2-wheelers, autos, buses)",
              "N-1 contingency testing for bus-breakdown choke points",
            ],
            note: "Phase 2 empirical case study with hardware-in-the-loop telemetry.",
            bg: "bg-[#fde8c8]/15 border-[rgba(146,64,14,0.15)]",
          },
          {
            scale: "Metropolitan  > 100 Nodes",
            items: [
              "Centralized solver becomes computationally intractable O(M^N)",
              "Requires 1-hop distributed consensus decomposition",
              "Macroscopic Fundamental Diagram (MFD) acts as perimeter gate",
            ],
            note: "Phase 3 vision. Conditional upon Phase 1 & 2 validation.",
            bg: "bg-[#dbeafe]/10 border-[rgba(30,64,175,0.12)]",
          },
        ].map((row) => (
          <div key={row.scale} className={`reveal p-5 rounded-xl border ${row.bg}`}>
            <div className="display text-[14px] font-medium text-[#1e1b16] mb-4">{row.scale}</div>
            <ul className="space-y-2 mb-4">
              {row.items.map((c) => (
                <li key={c} className="text-[12px] text-[#4a4640] leading-relaxed flex gap-2">
                  <span className="text-[#2d6a4f] shrink-0">+</span>{c}
                </li>
              ))}
            </ul>
            <div className="text-[11px] text-[#8a867e] leading-relaxed border-t border-[rgba(30,27,22,0.06)] pt-3">{row.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── prior art ────────────────────────────────────────────────────────────────

function PriorArt() {
  const listRef = useRevealList();
  return (
    <section id="prior-art" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§7"
        title="Prior art & literature database"
        sub="Canonical works and multi-jurisdiction patent prior art across USPTO, WIPO, EPO, and Indian Patent Office (IPO)."
      />
      <div ref={listRef as React.RefObject<HTMLDivElement>} className="space-y-3 max-w-4xl">
        {PRIOR_ART.map((p, i) => (
          <div key={p.title} className="reveal border border-[rgba(30,27,22,0.1)] rounded-xl p-5 bg-white">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3">
                <span className="display text-[18px] italic font-light text-[#8a867e] leading-none mt-0.5 shrink-0">
                  [{i + 1}]
                </span>
                <div>
                  <div className="text-[13px] font-medium text-[#1e1b16]">{p.title}</div>
                  <div className="text-[11px] text-[#8a867e] mt-0.5">{p.authors}, {p.year} · {p.venue}</div>
                </div>
              </div>
              <a href={p.url} target="_blank" rel="noopener noreferrer"
                className="data text-[9px] text-[#2d6a4f] border border-[rgba(45,106,79,0.25)] px-2 py-0.5 rounded hover:bg-[#d1ece0]/40 transition-colors shrink-0">
                source ↗
              </a>
            </div>
            <p className="text-[12px] text-[#4a4640] leading-relaxed mb-3 pl-9">{p.summary}</p>
            <div className="flex gap-2 items-start pl-9">
              <span className="text-[10px] font-semibold text-[#92400e] shrink-0 mt-0.5">Novelty Gap:</span>
              <span className="text-[11px] text-[#8a867e] leading-relaxed">{p.noveltyGap}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── gap matrix ───────────────────────────────────────────────────────────────

function GapMatrix() {
  const listRef = useRevealList();
  return (
    <section id="gap-matrix" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader n="§8" title="Research gap matrix" sub="For each existing methodology: what it accomplishes, where it breaks, and what this project introduces." />
      <div ref={listRef as React.RefObject<HTMLDivElement>} className="grid sm:grid-cols-2 gap-4 max-w-5xl">
        {GAP_MATRIX.map((row, i) => (
          <div key={i} className="reveal bg-white border border-[rgba(30,27,22,0.1)] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[rgba(30,27,22,0.07)] bg-[#f2efe8]">
              <div className="text-[13px] font-semibold text-[#1e1b16] leading-snug">{row.existing}</div>
            </div>
            <div className="px-5 py-4 flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#2d6a4f] shrink-0" />
                  <Label>What it does</Label>
                </div>
                <p className="text-[12px] text-[#4a4640] leading-relaxed pl-3.5">{row.does}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#b91c1c] shrink-0" />
                  <Label>Limitation</Label>
                </div>
                <p className="text-[12px] text-[#8a867e] leading-relaxed pl-3.5">{row.limitation}</p>
              </div>
              <div className="rounded-xl bg-[#d1ece0]/30 border border-[rgba(45,106,79,0.15)] px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] text-[#2d6a4f]">→</span>
                  <Label>This proposes</Label>
                </div>
                <p className="text-[12px] text-[#2d6a4f] leading-relaxed font-medium">{row.proposal}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── math comparison ──────────────────────────────────────────────────────────

function MathComparison() {
  const listRef = useRevealList();
  return (
    <section id="math" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader n="§9" title="Mathematical formulation comparison" sub="Comparing classical Cell Transmission models against the proposed switched power-electronics representation." />
      <div ref={listRef as React.RefObject<HTMLDivElement>} className="grid sm:grid-cols-2 gap-5 max-w-4xl">
        {[
          {
            title: "Classical Cell Transmission Model (CTM)",
            cls: "border-[rgba(30,27,22,0.12)] bg-[#f2efe8]",
            eqs: [
              { label: "Flow Transmission", eq: "q_i(k) = min { v · k_i(k), q_max, w · (k_jam − k_{i+1}(k)) }" },
              { label: "State Conservation", eq: "x_i(k+1) = x_i(k) + T_s · [ q_{i-1}(k) − q_i(k) ]" },
              { label: "Signal Representation", eq: "Exogenous capacity scaling: q_max(k) = c_i · green_ratio" },
              { label: "Switching Loss", eq: "Neglected (assumed instantaneous square-wave switching)" },
            ],
            note: "Continuous relaxation. Does not model discrete semiconductor conduction states or lost clearance time.",
            noteCls: "text-[#8a867e]",
          },
          {
            title: "Switched Network FCS-MPC (Proposed)",
            cls: "border-[rgba(45,106,79,0.2)] bg-[#d1ece0]/15",
            eqs: [
              { label: "Switched Admittance", eq: "Y(t) = A^T · diag(u_e(t) · g_e(x)) · A,   u_e ∈ {0, 1}" },
              { label: "Hybrid State Space", eq: "x(k+1) = f(x(k), u(k), d(k))  subject to u(k) ∈ U_admissible" },
              { label: "FCS-MPC Objective", eq: "min J = Σ_{j=1}^{N_p} ||x(k+j)||_Q^2 + λ_sw · ||u(k+j) − u(k+j−1)||^2" },
              { label: "Lost Green Penalty", eq: "λ_sw · Δu^2 explicitly prevents rapid phase chatter" },
            ],
            note: "Discrete finite-control-set optimization directly adapted from 3-phase power converter control.",
            noteCls: "text-[#4a4640]",
          },
        ].map((col) => (
          <div key={col.title} className={`reveal rounded-xl border p-5 ${col.cls}`}>
            <div className="display text-[14px] font-medium text-[#1e1b16] mb-5">{col.title}</div>
            <div className="space-y-4">
              {col.eqs.map((eq) => (
                <div key={eq.label}>
                  <Label>{eq.label}</Label>
                  <div className="data text-[11px] text-[#1e1b16] leading-relaxed bg-white/70 px-3 py-2 rounded-lg border border-[rgba(30,27,22,0.08)] mt-1">{eq.eq}</div>
                </div>
              ))}
            </div>
            <div className={`mt-4 text-[11px] leading-relaxed border-t border-[rgba(30,27,22,0.08)] pt-3 ${col.noteCls}`}>{col.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── novelty checklist ────────────────────────────────────────────────────────

function NoveltyChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const listRef = useRevealList();

  const statusCls: Record<string, string> = {
    novel:       "bg-[#d1ece0] text-[#1a5c36]",
    plausible:   "bg-[#fde8c8] text-[#7c3811]",
    open:        "bg-[#dbeafe] text-[#1e3a8a]",
    established: "bg-[#eae7df] text-[#4a4640]",
  };

  const verifiedCount = Object.values(checked).filter(Boolean).length;
  const pct = CHECKLIST_ITEMS.length > 0 ? (verifiedCount / CHECKLIST_ITEMS.length) * 100 : 0;

  return (
    <section id="checklist" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader
        n="§10"
        title="Interactive novelty claims checklist"
        sub="Clearly distinguishing genuine power-electronics contributions from established prior art."
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {[["novel", "Genuinely Novel"], ["plausible", "Plausible Transfer"], ["open", "Open Question"], ["established", "Established Prior Art (Do Not Claim)"]].map(([s, label]) => (
          <span key={s} className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${statusCls[s]}`}>
            {s} — {label}
          </span>
        ))}
      </div>

      <div className="max-w-3xl mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-[#8a867e]">Claims verified during review</span>
          <span className="data text-[11px] text-[#2d6a4f] font-medium">
            {verifiedCount} / {CHECKLIST_ITEMS.length}
          </span>
        </div>
        <div className="h-1.5 bg-[#eae7df] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2d6a4f] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div ref={listRef as React.RefObject<HTMLDivElement>} className="space-y-2.5 max-w-3xl">
        {CHECKLIST_ITEMS.map((item) => (
          <label
            key={item.id}
            className={`reveal flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
              checked[item.id]
                ? "border-[rgba(45,106,79,0.25)] bg-[#d1ece0]/20"
                : "border-[rgba(30,27,22,0.08)] bg-white hover:border-[rgba(30,27,22,0.16)]"
            }`}
          >
            <input type="checkbox" checked={!!checked[item.id]}
              onChange={(e) => setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))}
              className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[12px] font-medium ${checked[item.id] ? "text-[#2d6a4f] line-through decoration-[#2d6a4f]/40" : "text-[#1e1b16]"}`}>
                  {item.claim}
                </span>
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${statusCls[item.status]}`}>{item.status}</span>
              </div>
              <div className="text-[11px] text-[#8a867e] leading-relaxed">{item.note}</div>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}

// ─── roadmap stepper ──────────────────────────────────────────────────────────

function RoadmapStepper() {
  const [active, setActive] = useState(0);
  const phase = ROADMAP[active];
  const ref = useReveal();

  const statusCls = (s: string) =>
    s === "current" ? "bg-[#d1ece0] text-[#1a5c36]" :
    s === "next"    ? "bg-[#fde8c8] text-[#7c3811]" :
                      "bg-[#eae7df] text-[#4a4640]";

  return (
    <section id="roadmap" className="section-anchor px-6 sm:px-10 py-12 border-b border-[rgba(30,27,22,0.08)]">
      <SectionHeader n="§11" title="Phased research execution roadmap" />

      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal max-w-2xl">
        <div className="relative mb-8">
          <div className="absolute top-5 left-[28px] right-[28px] h-0.5 bg-[rgba(30,27,22,0.1)]" />
          <div
            className="absolute top-5 left-[28px] h-0.5 bg-[#2d6a4f] transition-all duration-500 ease-out"
            style={{ width: active === 0 ? "0%" : `calc(${(active / (ROADMAP.length - 1)) * 100}% - 0px)` }}
          />

          <div className="relative flex justify-between">
            {ROADMAP.map((r, i) => (
              <button
                key={r.phase}
                onClick={() => setActive(i)}
                className="flex flex-col items-center gap-2.5 w-[25%] group"
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  i < active  ? "border-[#2d6a4f] bg-[#2d6a4f]" :
                  i === active ? "border-[#2d6a4f] bg-white shadow-[0_0_0_4px_rgba(45,106,79,0.12)]" :
                                 "border-[rgba(30,27,22,0.15)] bg-white group-hover:border-[rgba(30,27,22,0.3)]"
                }`}>
                  {i < active ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className={`display text-[12px] italic font-medium ${i === active ? "text-[#2d6a4f]" : "text-[#8a867e]"}`}>
                      {i + 1}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <div className="display text-[10px] italic text-[#8a867e]">{r.phase}</div>
                  <div className={`text-[11px] font-medium transition-colors ${i === active ? "text-[#2d6a4f]" : "text-[#4a4640]"}`}>
                    {r.label}
                  </div>
                  <div className="data text-[9px] text-[#8a867e]">{r.duration}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border border-[rgba(30,27,22,0.1)] rounded-xl p-5 bg-white transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="display text-[16px] font-medium text-[#1e1b16]">{phase.label}</div>
            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${statusCls(phase.status)}`}>
              {phase.status}
            </span>
            <span className="data text-[10px] text-[#8a867e] ml-auto">{phase.duration}</span>
          </div>
          <ul className="space-y-2.5">
            {phase.tasks.map((t) => (
              <li key={t} className="flex gap-2.5 text-[12px] text-[#4a4640] leading-relaxed">
                <span className="text-[#2d6a4f] shrink-0 mt-0.5">→</span>{t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── risk grid ────────────────────────────────────────────────────────────────

const RISK_POSITIONS = [
  { x: 0.76, y: 0.76 },  // Analogy Breakdown: High / High
  { x: 0.50, y: 0.76 },  // Prior-Art Rebranding: High / Med
  { x: 0.76, y: 0.50 },  // Scope Overreach: Med / High
  { x: 0.50, y: 0.50 },  // Data Provenance: Med / Med
  { x: 0.55, y: 0.74 },  // Combinatorial Explosion: High / Med
];

function RiskGrid() {
  const [selected, setSelected] = useState<number | null>(null);
  const ref = useReveal();
  const listRef = useRevealList();

  const QW = 400, QH = 300;
  const pad = 40;
  const plotW = QW - pad * 2, plotH = QH - pad * 2;

  const qx = (v: number) => pad + v * plotW;
  const qy = (v: number) => pad + (1 - v) * plotH;

  const dotColor = (r: (typeof RISKS)[0]) => {
    if (r.severity === "high" && r.probability === "high") return "#b91c1c";
    if (r.severity === "high" || r.probability === "high") return "#d97706";
    return "#2d6a4f";
  };

  return (
    <section id="risks" className="section-anchor px-6 sm:px-10 py-12">
      <SectionHeader n="§12" title="Scientific risk & failure modes" sub="Severity × probability. Click any point to inspect its mitigation strategy." />

      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal flex flex-col lg:flex-row gap-8 max-w-5xl">
        <div className="shrink-0">
          <svg viewBox={`0 0 ${QW} ${QH}`} className="w-full max-w-[420px] border border-[rgba(30,27,22,0.1)] rounded-2xl bg-white">
            <rect x={pad} y={pad} width={plotW / 2} height={plotH / 2} fill="rgba(255,82,82,0.04)" />
            <rect x={pad + plotW / 2} y={pad} width={plotW / 2} height={plotH / 2} fill="rgba(255,82,82,0.09)" />
            <rect x={pad} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="rgba(45,106,79,0.05)" />
            <rect x={pad + plotW / 2} y={pad + plotH / 2} width={plotW / 2} height={plotH / 2} fill="rgba(217,119,6,0.05)" />

            {[
              { label: "Watch",   x: pad + plotW * 0.25, y: pad + plotH * 0.85, color: "rgba(45,106,79,0.5)" },
              { label: "Monitor", x: pad + plotW * 0.75, y: pad + plotH * 0.85, color: "rgba(217,119,6,0.5)" },
              { label: "Manage",  x: pad + plotW * 0.25, y: pad + plotH * 0.18, color: "rgba(217,119,6,0.5)" },
              { label: "Address", x: pad + plotW * 0.75, y: pad + plotH * 0.18, color: "rgba(185,28,28,0.5)" },
            ].map((q) => (
              <text key={q.label} x={q.x} y={q.y} textAnchor="middle" fill={q.color}
                fontSize="9" fontFamily="JetBrains Mono" fontWeight="500" letterSpacing="0.08em">
                {q.label}
              </text>
            ))}

            <line x1={pad} y1={pad + plotH / 2} x2={pad + plotW} y2={pad + plotH / 2}
              stroke="rgba(30,27,22,0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1={pad + plotW / 2} y1={pad} x2={pad + plotW / 2} y2={pad + plotH}
              stroke="rgba(30,27,22,0.08)" strokeWidth="1" strokeDasharray="4 4" />

            <line x1={pad} y1={pad} x2={pad} y2={pad + plotH} stroke="rgba(30,27,22,0.15)" strokeWidth="1" />
            <line x1={pad} y1={pad + plotH} x2={pad + plotW} y2={pad + plotH} stroke="rgba(30,27,22,0.15)" strokeWidth="1" />

            <text x={pad + plotW / 2} y={QH - 6} textAnchor="middle" fill="#8a867e" fontSize="9" fontFamily="JetBrains Mono">
              Probability →
            </text>
            <text x={10} y={pad + plotH / 2} textAnchor="middle" fill="#8a867e" fontSize="9" fontFamily="JetBrains Mono"
              transform={`rotate(-90 10 ${pad + plotH / 2})`}>
              Severity ↑
            </text>

            {RISKS.map((r, i) => {
              const px = qx(RISK_POSITIONS[i].x);
              const py = qy(RISK_POSITIONS[i].y);
              const isSelected = selected === i;
              const dc = dotColor(r);
              return (
                <g key={i} onClick={() => setSelected(selected === i ? null : i)} className="cursor-pointer">
                  {isSelected && <circle cx={px} cy={py} r="16" fill={dc} opacity="0.12" />}
                  <circle cx={px} cy={py} r="10" fill={dc} opacity={isSelected ? 1 : 0.75} stroke="white" strokeWidth="2" />
                  <text x={px} y={py + 4} textAnchor="middle" fill="white" fontSize="9" fontFamily="JetBrains Mono" fontWeight="500">{i + 1}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div ref={listRef as React.RefObject<HTMLDivElement>} className="flex-1 space-y-3">
          {RISKS.map((r, i) => {
            const isSelected = selected === i;
            const dc = dotColor(r);
            return (
              <div
                key={i}
                onClick={() => setSelected(selected === i ? null : i)}
                className={`reveal border rounded-xl px-4 py-3.5 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-[rgba(30,27,22,0.25)] bg-white shadow-sm"
                    : "border-[rgba(30,27,22,0.08)] bg-white hover:border-[rgba(30,27,22,0.16)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: dc }}>
                    <span className="data text-[9px] text-white font-medium">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[12px] font-medium text-[#1e1b16] leading-snug">{r.risk}</span>
                      <div className="flex gap-1.5 ml-auto">
                        {[["S", r.severity], ["P", r.probability]].map(([lbl, val]) => (
                          <span key={lbl} className={`data text-[9px] px-1.5 py-0.5 rounded font-medium ${
                            val === "high" ? "bg-[#fdd5d5] text-[#991b1b]" :
                            val === "medium" ? "bg-[#fde8c8] text-[#7c3811]" :
                            "bg-[#eae7df] text-[#4a4640]"
                          }`}>{lbl}:{val}</span>
                        ))}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-[rgba(30,27,22,0.06)]">
                        <div className="flex items-start gap-1.5">
                          <span className="text-[10px] font-semibold text-[#2d6a4f] shrink-0 mt-0.5">→</span>
                          <p className="text-[11px] text-[#4a4640] leading-relaxed">{r.mitigation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 border-t border-[rgba(30,27,22,0.08)] pt-5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#8a867e]">
        <span className="display italic">Engineering Research Control Room · Stage 0 · Hypothesis Under Test</span>
        <span className="data">{new Date().toISOString().slice(0, 10)}</span>
      </div>
    </section>
  );
}

// ─── app shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState("title");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
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
      <div className="h-10 md:h-0 block md:hidden" />
      <main className="md:ml-10">
        <TitleBlock />
        <CoreIdea />
        <Explainer />
        <ParallelsExplorer />
        <LiveDemo />
        <FaultLine />
        <Scaling />
        <PriorArt />
        <GapMatrix />
        <MathComparison />
        <NoveltyChecklist />
        <RoadmapStepper />
        <RiskGrid />
      </main>
    </div>
  );
}
