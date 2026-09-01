/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Complete Research Data Architecture for the Interactive Research Concept Brief
 * "Developing a Power-Systems and Power-Electronics Representation of an Urban Traffic Network"
 */

export const SECTIONS = [
  { id: "title", label: "BRIEF", marker: "§0" },
  { id: "core-idea", label: "MAPPING", marker: "§1" },
  { id: "explainer", label: "INTENT", marker: "§2" },
  { id: "parallels", label: "PARALLELS", marker: "§3" },
  { id: "demo", label: "DEMO", marker: "§4" },
  { id: "fault-line", label: "FAULT", marker: "§5" },
  { id: "scaling", label: "SCALE", marker: "§6" },
  { id: "prior-art", label: "PRIOR ART", marker: "§7" },
  { id: "gap-matrix", label: "GAPS", marker: "§8" },
  { id: "math", label: "MATH", marker: "§9" },
  { id: "checklist", label: "NOVELTY", marker: "§10" },
  { id: "roadmap", label: "ROADMAP", marker: "§11" },
  { id: "risks", label: "RISKS", marker: "§12" },
];

export type Verdict = "strong" | "moderate" | "weak" | "open";

export interface Mapping {
  ecology: string; // In our theme: Traffic Element
  neural: string;  // In our theme: Electrical Concept
  verdict: Verdict;
  note: string;
}

export const MAPPINGS: Mapping[] = [
  {
    ecology: "Roadway corridor / link",
    neural: "Transmission line / distribution feeder path",
    verdict: "strong",
    note: "Direct graph abstraction G=(V,E). Physical length, impedance, and capacity constraints apply naturally.",
  },
  {
    ecology: "Signalized intersection",
    neural: "Multi-terminal bus / semiconductor switching node",
    verdict: "strong",
    note: "Flow continuity holds (Kirchhoff's Current Law). Multi-pole switching matrix controls allowable conduction paths.",
  },
  {
    ecology: "Traffic flow rate q (veh/h)",
    neural: "Electric current I (amperes / Coulombs/s)",
    verdict: "strong",
    note: "Conservation-based hydrodynamic mapping holds at macroscopic scale. Bounded by finite saturation capacity.",
  },
  {
    ecology: "Road saturation capacity",
    neural: "Line thermal / current limit (MVA rating)",
    verdict: "strong",
    note: "Hard capacity ceiling. Exceeding nominal loading induces congestion delay analogous to thermal overload.",
  },
  {
    ecology: "Signal phase (green/yellow/red)",
    neural: "Semiconductor switching state S in {0,1}^M",
    verdict: "open",
    note: "The central candidate contribution: modeling traffic signals as active semiconductor switches with switching losses.",
  },
  {
    ecology: "Queue accumulation / stored vehicles",
    neural: "Stored charge Q in finite capacitor buffer",
    verdict: "moderate",
    note: "Storage is bounded by road length and jam density. Discharging is irreversible; lost travel time cannot be recovered.",
  },
  {
    ecology: "Travel-time delay / congestion cost",
    neural: "Joule dissipation / branch impedance (Z = R + jX)",
    verdict: "moderate",
    note: "Delay increases monotonically with flow up to capacity. Hyper-congested regime produces apparent negative resistance.",
  },
  {
    ecology: "Origin-destination demand",
    neural: "Active/reactive power demand & generator injection",
    verdict: "moderate",
    note: "External inflows behave like power injections, but demand direction is driven by driver intent rather than potential.",
  },
  {
    ecology: "Traffic bottleneck",
    neural: "High-impedance transmission constraint",
    verdict: "strong",
    note: "Throttles network-wide throughput. Identifiable via Jacobian sensitivity and N-1 contingency screening.",
  },
  {
    ecology: "Cascading queue spillback",
    neural: "Cascading blackout / line tripping cascade",
    verdict: "open",
    note: "Single bottleneck failure causes diversion, saturating parallel paths and triggering upstream gridlock.",
  },
  {
    ecology: "Travel-time potential field",
    neural: "Voltage potential gradient (∇V)",
    verdict: "weak",
    note: "Traffic travel cost is non-conservative (line integrals along closed loops ≠ 0). Violates Kirchhoff's Voltage Law.",
  },
  {
    ecology: "Distributed intersection control",
    neural: "Distributed consensus / microgrid tie-line control",
    verdict: "open",
    note: "Autonomous local agents communicating via 1-hop consensus to coordinate green waves without central supercomputer.",
  },
];

export type ParallelField =
  | "traffic engineering"
  | "power systems"
  | "power electronics"
  | "control theory"
  | "network theory"
  | "optimization";

export type ParallelStrength = "direct" | "structural" | "loose";

export interface Parallel {
  name: string;
  field: ParallelField;
  authors: string;
  year: number;
  strength: ParallelStrength;
  relevance: "high" | "medium" | "low";
  note: string;
}

export const PARALLELS: Parallel[] = [
  {
    name: "Macroscopic Kinematic Waves (LWR)",
    field: "traffic engineering",
    authors: "Lighthill & Whitham / Richards",
    year: 1955,
    strength: "direct",
    relevance: "high",
    note: "Foundational hydrodynamic conservation law for vehicular flow. The direct parent of all fluid/current analogies.",
  },
  {
    name: "Cell Transmission Model (CTM)",
    field: "traffic engineering",
    authors: "Daganzo",
    year: 1994,
    strength: "direct",
    relevance: "high",
    note: "Discrete-time sending/receiving flow functions. Re-cast in our framework as switched branch conductances.",
  },
  {
    name: "Max-Pressure Signal Control",
    field: "control theory",
    authors: "Varaiya",
    year: 2013,
    strength: "direct",
    relevance: "high",
    note: "Decentralized queue-differential pressure controller. The critical baseline that our switching framework must benchmark against.",
  },
  {
    name: "Finite-Control-Set MPC (FCS-MPC)",
    field: "power electronics",
    authors: "Rodriguez et al.",
    year: 2013,
    strength: "direct",
    relevance: "high",
    note: "Discrete switching state selection without carrier modulator. Direct mathematical basis for our signal controller.",
  },
  {
    name: "Cascading Failures in Networks",
    field: "network theory",
    authors: "Buldyrev et al.",
    year: 2010,
    strength: "structural",
    relevance: "high",
    note: "Coupled infrastructure failure cascades. Inspires our N-1 contingency and cascading congestion propagation engine.",
  },
  {
    name: "Power System State Estimation",
    field: "power systems",
    authors: "Monticelli",
    year: 2000,
    strength: "structural",
    relevance: "high",
    note: "Weighted Least Squares (WLS) state estimation and observability from sparse telemetry; adapted to urban traffic sensors.",
  },
  {
    name: "Macroscopic Fundamental Diagram (MFD)",
    field: "traffic engineering",
    authors: "Geroliminis & Daganzo",
    year: 2008,
    strength: "structural",
    relevance: "high",
    note: "Network-wide relationship between vehicle accumulation and trip completion. Acts as macroscopic capacity boundary.",
  },
  {
    name: "Consensus in Networked Multi-Agent Systems",
    field: "control theory",
    authors: "Olfati-Saber et al.",
    year: 2007,
    strength: "structural",
    relevance: "high",
    note: "Graph Laplacian consensus for decentralized multi-agent coordination; used for distributed signal offset tuning.",
  },
  {
    name: "Electrical Analogs for Traffic Networks",
    field: "traffic engineering",
    authors: "Schweitzer & Helbing",
    year: 1999,
    strength: "direct",
    relevance: "high",
    note: "Key prior art critique: proved passive resistor networks fail to capture traffic hysteresis, justifying active switching.",
  },
  {
    name: "Optimal Power Flow (OPF)",
    field: "power systems",
    authors: "Carpentier",
    year: 1962,
    strength: "structural",
    relevance: "medium",
    note: "Constrained non-linear optimization balancing generation and transmission limits; parallel to traffic network assignment.",
  },
  {
    name: "Coupled Power & Transportation Dynamics",
    field: "power systems",
    authors: "Alizadeh et al.",
    year: 2014,
    strength: "loose",
    relevance: "medium",
    note: "Couples EV charging demand to power feeders. Distinct from our goal of representing traffic itself as a switching network.",
  },
  {
    name: "Switched Dynamical Systems",
    field: "control theory",
    authors: "Liberzon",
    year: 2003,
    strength: "direct",
    relevance: "high",
    note: "Hybrid systems switching between discrete affine vector fields; formal framework for traffic signal mode changes.",
  },
];

export const PRIOR_ART = [
  {
    title: "On Kinematic Waves. II. Theory of Traffic Flow on Long Crowded Roads",
    authors: "Lighthill & Whitham / Richards",
    year: 1955,
    venue: "Proc. Royal Society London (LWR Model)",
    summary:
      "Established the macroscopic fluid flow analogy for traffic corridors (dq/dx + dk/dt = 0). Canonical foundation for vehicle flow as current.",
    url: "https://doi.org/10.1098/rspa.1955.0089",
    noveltyGap:
      "One-dimensional continuous corridor model. Lacks multi-phase switching nodes, network topology, and power-electronics control.",
  },
  {
    title: "Electrical Analogs for Transportation Network Flow: Historical Retrospective",
    authors: "Schweitzer & Helbing",
    year: 1999,
    venue: "Physical Review E",
    summary:
      "Comprehensive review showing that passive linear/non-linear resistor networks fail to model traffic congestion hysteresis and backward shockwaves.",
    url: "https://doi.org/10.1103/PhysRevE.60.6344",
    noveltyGap:
      "Critical negative result: proves why passive electrical analogies fail. Our framework introduces active semiconductor switching to solve this.",
  },
  {
    title: "The Max-Pressure Controller for Arbitrary Networks of Signalized Intersections",
    authors: "Varaiya",
    year: 2013,
    venue: "Advances in Dynamic Network Modeling",
    summary:
      "Decentralized queue-differential backpressure controller proving network stability without origin-destination demand information.",
    url: "https://doi.org/10.1007/978-1-4614-6792-2_2",
    noveltyGap:
      "Assumes infinite link storage (point queues) and neglects lost green time during switching transitions. Our FCS-MPC penalizes switching losses directly.",
  },
  {
    title: "Decentralized Traffic Signal Control Using Backpressure Routing (US9852631B2)",
    authors: "Regents of the University of California",
    year: 2013,
    venue: "USPTO Patent",
    summary:
      "Patents local queue-differential actuation at intersections. Calculates differential pressure across adjacent roadway links.",
    url: "https://patents.google.com/patent/US9852631B2/en",
    noveltyGap:
      "Does not formulate traffic as an electrical switching circuit, neglects semiconductor switching losses, and lacks predictive FCS-MPC horizons.",
  },
];

export const GAP_MATRIX = [
  {
    existing: "Passive Resistor Network Flow (Schweitzer 1999)",
    does: "Models static route assignment via electrical resistance",
    limitation: "Cannot represent backward-propagating shockwaves or signal phases",
    proposal: "Switched admittance matrix Y(t) governed by active semiconductor switching logic",
  },
  {
    existing: "Max-Pressure Signal Control (Varaiya 2013)",
    does: "Decentralized queue backpressure phase actuation",
    limitation: "Point queues (infinite storage); ignores lost green time, causing chatter",
    proposal: "Finite-Control-Set MPC (FCS-MPC) with explicit switching loss penalty (λ_sw · Δu²)",
  },
  {
    existing: "Cell Transmission Model (Daganzo 1994)",
    does: "Piecewise-linear simulation of hydrodynamic traffic flow",
    limitation: "Signal phases are imposed as exogenous capacity multipliers",
    proposal: "Unified dynamic state-space representation x(k+1) = f(x, u, d) with discrete control vectors",
  },
  {
    existing: "Power Grid Contingency Screening (IEEE Stds)",
    does: "N-1 transmission line outage screening across power grids",
    limitation: "Never systematically transferred to dynamic urban traffic corridors",
    proposal: "Transportation N-1 contingency index detecting critical bottlenecks before cascading collapse",
  },
];

export const CHECKLIST_ITEMS = [
  {
    id: "c1",
    claim: "Representing traffic signals as active semiconductor switching bridges (not passive resistors)",
    status: "novel",
    note: "Core proposed contribution: transforms passive circuit analogy into active power electronics.",
  },
  {
    id: "c2",
    claim: "FCS-MPC switching optimization incorporating lost green clearance time penalties",
    status: "novel",
    note: "Direct mathematical transfer from power inverter control. Avoids continuous relaxation heuristics.",
  },
  {
    id: "c3",
    claim: "N-1 contingency analysis screening for transportation corridor reliability",
    status: "plausible",
    note: "Adapted from high-voltage transmission engineering to detect urban bottleneck vulnerability.",
  },
  {
    id: "c4",
    claim: "Traffic flow rate mapped to electric current (q ↔ I)",
    status: "established",
    note: "Known since Lighthill-Whitham-Richards (1955). Do NOT claim as novel.",
  },
  {
    id: "c5",
    claim: "Graph representation of intersections and roads as G=(V,E)",
    status: "established",
    note: "Universal standard in network flow theory since Ford-Fulkerson (1956). Do NOT claim as novel.",
  },
  {
    id: "c6",
    claim: "Decentralized signal control without central master controller",
    status: "established",
    note: "Well-established in Max-Pressure literature (Varaiya 2013). Must show quantifiable advantage.",
  },
  {
    id: "c7",
    claim: "Cascading congestion propagation modeled via coupled network blackout dynamics",
    status: "plausible",
    note: "Topological percolation models exist; our work grounds it in physical queue spillback dynamics.",
  },
];

export const ROADMAP = [
  {
    phase: "STAGE 0",
    label: "Literature & Prior-Art Review",
    duration: "0–2 mo",
    tasks: [
      "Exhaustive prior-art scan across USPTO, WIPO, EPO, and Indian Patent Office (IPO)",
      "Formalize taxonomy of past passive resistor analogies and identify exact failure boundaries",
      "Benchmark Max-Pressure and Cell Transmission Model baseline equations",
    ],
    status: "current",
  },
  {
    phase: "STAGE 1",
    label: "Benchmark Network Formulation",
    duration: "2–4 mo",
    tasks: [
      "Construct 7-node, 10-branch Small-Town benchmark grid (J1–J7, R1–R10)",
      "Derive node-branch incidence matrix A and switched nodal admittance matrix Y(t)",
      "Implement dual-view simulation harness (Traffic View vs Electrical Analogy)",
    ],
    status: "next",
  },
  {
    phase: "STAGE 2",
    label: "FCS-MPC & Switching Optimization",
    duration: "4–8 mo",
    tasks: [
      "Formulate Finite-Control-Set MPC discrete cost function min J over horizon N_p",
      "Incorporate lost green time switching penalty λ_sw to suppress signal chatter",
      "Measure delay divergence against classical Webster fixed-time and Max-Pressure baselines",
    ],
    status: "future",
  },
  {
    phase: "STAGE 3",
    label: "Contingency, Cascades & Coimbatore",
    duration: "8–14 mo",
    tasks: [
      "Implement N-1 contingency analysis and cascading queue spillback simulator",
      "Scale framework to Coimbatore Avinashi Road corridor (Lakshmi Mills to Nava India)",
      "Enforce strict data provenance labeling (MEASURED, PUBLISHED, ESTIMATED, ASSUMED, SIMULATED)",
      "Demonstrate 4-node physical EEE hardware testbed with microcontrollers and LED signals",
    ],
    status: "future",
  },
];

export const RISKS = [
  {
    risk: "Non-Conservative Potential Field (Voltage Analogy Failure)",
    severity: "high",
    probability: "high",
    mitigation:
      "Travel cost line integrals along closed loops are non-zero due to one-way streets. Do NOT force Kirchhoff's Voltage Law. Reframe potential as artificial forward cost.",
  },
  {
    risk: "Prior-Art Rebranding Accusation",
    severity: "high",
    probability: "medium",
    mitigation:
      "The broad electrical analogy is 70 years old. Restrict novelty claims strictly to active semiconductor switching, FCS-MPC, and lost-green-time minimization.",
  },
  {
    risk: "Scope Overreach (Attempting City-Scale AI Optimization)",
    severity: "medium",
    probability: "high",
    mitigation:
      "Do not attempt to solve city-wide traffic or build a commercial product. Restrict Stage 1 deliverable strictly to proving or disproving divergence on the 7-node benchmark.",
  },
  {
    risk: "Data Provenance Corruption in Coimbatore Case Study",
    severity: "medium",
    probability: "medium",
    mitigation:
      "Indian arterial data has mixed fidelity. Strictly enforce provenance badges (MEASURED, PUBLISHED, ESTIMATED, ASSUMED, SIMULATED). Never claim assumed values as empirical.",
  },
  {
    risk: "Combinatorial Explosion in Multi-Intersection FCS-MPC",
    severity: "high",
    probability: "medium",
    mitigation:
      "Candidate states scale as O(M^N). Mitigate by decomposing grid into 1-hop distributed consensus agents, keeping local optimization O(1).",
  },
];
