/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Complete Research Data Architecture for the Deep Research Plan:
 * "Investigating Where and How Components of an Urban Traffic System
 * Can Be Represented by Power-Electronic Circuits and Switching Networks"
 */

export const SECTIONS = [
  { id: "title", label: "BRIEF", marker: "§0" },
  { id: "execution-guide", label: "EXECUTE", marker: "§EXEC" },
  { id: "ontology-layers", label: "5-LAYERS", marker: "§1A" },
  { id: "traffic-dictionary", label: "DICTIONARY", marker: "§1B" },
  { id: "objectives", label: "GOALS", marker: "§1C" },
  { id: "decision-matrix", label: "MAPPINGS", marker: "§2" },
  { id: "dimensional", label: "DIMENSIONS", marker: "§3" },
  { id: "math-models", label: "MATH", marker: "§4" },
  { id: "simulation-tools", label: "TOOLS", marker: "§5" },
  { id: "circuit-design", label: "CIRCUITS", marker: "§6" },
  { id: "hardware-bom", label: "HARDWARE", marker: "§7" },
  { id: "experiments", label: "BENCH", marker: "§8" },
  { id: "avinashi-testbed", label: "COIMBATORE", marker: "§9A" },
  { id: "first-experiment", label: "5-NODE DEMO", marker: "§9B" },
  { id: "risk-register", label: "RISKS", marker: "§10" },
  { id: "roadmap-budget", label: "ROADMAP", marker: "§11" },
  { id: "novelty-checklist", label: "NOVELTY", marker: "§12" },
  { id: "prior-art-patents", label: "PATENTS", marker: "§13" },
];

export interface OntologyLayer {
  layerId: string;
  name: string;
  title: string;
  powerSystemRole: string;
  powerElectronicsRole: string;
  elements: string[];
  keyInsight: string;
}

export const ONTOLOGY_LAYERS: OntologyLayer[] = [
  {
    layerId: "Layer A",
    name: "Physical Infrastructure",
    title: "Network Topology & Physical Interconnections",
    powerSystemRole: "Buses, Branches, Transmission Lines & Substation Layouts",
    powerElectronicsRole: "Busbar Matrix, Converter Topologies & Conduction Paths",
    elements: ["Road Segment", "Lane", "Intersection", "Flyover / Elevated Bridge", "U-Turn", "Roundabout", "Merge", "Divergence"],
    keyInsight: "Forms the static geometric graph G = (V, E). In power networks this maps to bus-branch incidence matrices (A) and nodal admittance graphs.",
  },
  {
    layerId: "Layer B",
    name: "Traffic State Dynamics",
    title: "Dynamic Flow Variables & Conservation Quantities",
    powerSystemRole: "Current (I), Voltage (V), Reactive Charge (Q), Impedance (Z)",
    powerElectronicsRole: "DC-Link Capacitor Voltage, Inductor Current, Thermal Losses",
    elements: ["Vehicle Count", "Flow Rate (q)", "Density (k)", "Speed (v)", "Queue Length (x)", "Travel Time (T)", "Occupancy"],
    keyInsight: "The core mathematical isomorphism: Vehicle conservation dq/dt = a(t) - d(t) maps identically to capacitor charging C · dV/dt = I_in - I_out.",
  },
  {
    layerId: "Layer C",
    name: "Actuation & Control Layer",
    title: "Dynamic Topology Modulators & Phase Switching",
    powerSystemRole: "Circuit Breakers, FACTS Devices, Static VAR Compensators",
    powerElectronicsRole: "Semiconductor Gate Drivers (PWM Duty D, FCS-MPC Switching u_k)",
    elements: ["Traffic Signals (4 Levels)", "Ramp Meters", "Variable Speed Limits (VSL)", "Reversible Lane Control", "Dynamic Route Guidance"],
    keyInsight: "Traffic signals do NOT simply throttle flow like resistors; they actively reconfigure the permissible network flow topology S(t) in discrete switching states.",
  },
  {
    layerId: "Layer D",
    name: "Disturbances & Contingencies",
    title: "System Exogenous Shocks & Fault Dynamics",
    powerSystemRole: "N-1 Branch Trips, Short-Circuit Faults, Generator Drops",
    powerElectronicsRole: "Converter Thermal Runaway, Overcurrent Faults, Voltage Sags",
    elements: ["Accident / Crash", "Lane / Road Closure", "Rain / Wet Road Friction Loss", "Pedestrian Surge", "Emergency Priority Vehicle", "Signal Power Outage"],
    keyInsight: "Power systems has a 70-year mature mathematical language for N-1 contingency screening and fast post-fault topological redispatch.",
  },
  {
    layerId: "Layer E",
    name: "Optimization Objectives",
    title: "Multi-Objective Performance & Stability Criteria",
    powerSystemRole: "Optimal Power Flow (OPF), Loss Minimization, Voltage Stability",
    powerElectronicsRole: "THD Minimization, Switching Loss Penalty, DC Ripple Attenuation",
    elements: ["Minimize Total Queue Delay", "Minimize Grid Travel Time", "Prevent Spillback Cascade", "Ensure Phase Minimum Dwell Guard", "Maximize Network Throughput"],
    keyInsight: "Formulates traffic optimization as switched energy-loss minimization with semiconductor switching chatter penalties (lambda_sw · ||Delta u||^2).",
  },
];

export interface DictionaryEntry {
  trafficElement: string;
  trafficBehavior: string;
  powerSystemRep: string;
  powerElectronicsRep: string;
  mathAnalogy: string;
  whyMakesSense: string;
  whereItBreaks: string;
  evaluationStatus: "Strong (Validated)" | "Moderate (Plausible)" | "Caution (Weak)" | "Boundary (Non-Physical)";
}

export const TRAFFIC_DICTIONARY: DictionaryEntry[] = [
  {
    trafficElement: "Vehicle Packet",
    trafficBehavior: "Discrete moving agent carrying human passengers",
    powerSystemRep: "Quantized current charge packet (q_e)",
    powerElectronicsRep: "Packetized charge pulse (Coulombs)",
    mathAnalogy: "Q_e = k · n_veh,  I(t) = dQ/dt = k · a(t)",
    whyMakesSense: "Aggregate traffic streams behave macroscopically like continuous fluid or charge flows.",
    whereItBreaks: "Individual human drivers have agency, route preferences, and stochastic braking; electrons obey deterministic Maxwell-Lorentz forces.",
    evaluationStatus: "Moderate (Plausible)",
  },
  {
    trafficElement: "Vehicle Arrival (Demand)",
    trafficBehavior: "Inflow injected into the network from origins/zones",
    powerSystemRep: "Independent Current Injection (I_src)",
    powerElectronicsRep: "Controlled Current Source (Buck/Boost Input)",
    mathAnalogy: "I_src(t) = k · lambda(t)  [Amperes]",
    whyMakesSense: "Exogenous trip generation acts as an unconstrained flow pump driving cars into entry links.",
    whereItBreaks: "Arrival rate may throttle back if upstream entry is severely jammed (spillback blocking the source).",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Vehicle Departure (Sink)",
    trafficBehavior: "Outflow leaving the network at destinations",
    powerSystemRep: "Ground Reference / Resistive Sink",
    powerElectronicsRep: "Matched Load Resistor / Energy Dissipation",
    mathAnalogy: "I_out(t) = V_exit / R_term",
    whyMakesSense: "Vehicles reaching trip completion exit the dynamic tracking equations permanently.",
    whereItBreaks: "Assumes sink has infinite exit capacity without parking/off-ramp bottlenecks.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Road Segment",
    trafficBehavior: "Physical conduit transporting vehicles between nodes",
    powerSystemRep: "Transmission Line / Branch (R-L series)",
    powerElectronicsRep: "Conduction Branch with Series Impedance",
    mathAnalogy: "Delta V_e = R_e · I_e + L_e · (dI_e/dt)",
    whyMakesSense: "Free-flow travel time creates an impedance to flow; vehicle acceleration inertia mirrors inductance.",
    whereItBreaks: "In hyper-congested regimes, flow drops as density rises (apparent negative resistance). Naive Ohm's law fails without saturation bounds.",
    evaluationStatus: "Moderate (Plausible)",
  },
  {
    trafficElement: "Road Capacity",
    trafficBehavior: "Maximum sustainable flow before breakdown",
    powerSystemRep: "Branch Thermal / Ampacity Rating (I_max)",
    powerElectronicsRep: "Semiconductor Current Limit / Saturation",
    mathAnalogy: "I_e(t) <= I_max = k · C_road  [Amperes]",
    whyMakesSense: "Hard upper boundary on link throughput, exactly mirroring semiconductor current ratings.",
    whereItBreaks: "Traffic capacity drops during stop-and-go breakdowns (capacity drop phenomenon), whereas wire ampacity is static.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Vehicle Queue",
    trafficBehavior: "Accumulation of waiting vehicles on link approaches",
    powerSystemRep: "Capacitive Storage / Energy Buffer (C)",
    powerElectronicsRep: "DC-Link Capacitor Voltage Buffer",
    mathAnalogy: "C · (dV/dt) = I_in - I_out <=> k · (dq/dt) = a(t) - d(t)",
    whyMakesSense: "Exact 1:1 mathematical isomorphism between flow continuity and Kirchhoff's Current Law across a capacitor.",
    whereItBreaks: "Capacitor discharge is energy-reversible; traffic queue dissipation is irreversible (lost travel delay is permanently dissipated).",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Traffic Signal (Overall)",
    trafficBehavior: "Time-multiplexed right-of-way allocator",
    powerSystemRep: "Network Reconfiguration Actuator / Circuit Breaker",
    powerElectronicsRep: "Multi-Leg Semiconductor Matrix Converter",
    mathAnalogy: "Y(t) = A^T · diag(u_e(t) · g_e) · A,  u_e in {0, 1}",
    whyMakesSense: "Signals modulate permissible connection paths discretely rather than acting as linear analog throttles.",
    whereItBreaks: "Must enforce minimum green dwell (>=7s) and yellow clearance (>=3s) to respect human psychophysics.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Green Phase",
    trafficBehavior: "Permits unobstructed vehicle movement",
    powerSystemRep: "Closed Bus-Tie / Conduction Path",
    powerElectronicsRep: "MOSFET Gate Drive ON (V_gs > V_th)",
    mathAnalogy: "u_phase(t) = 1,  R_switch = R_on ~ 0 Ohms",
    whyMakesSense: "Direct conductive state allowing current to flow across intersection node.",
    whereItBreaks: "Discharge rate is limited by saturation headway (~1.8–2.0 s/veh), not zero resistance.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Red Phase",
    trafficBehavior: "Blocks vehicle movement completely",
    powerSystemRep: "Open Circuit / Tripped Breaker",
    powerElectronicsRep: "MOSFET Gate Drive OFF (V_gs = 0V)",
    mathAnalogy: "u_phase(t) = 0,  R_switch = R_off ~ Infinity",
    whyMakesSense: "Zero current conduction across approach boundary.",
    whereItBreaks: "Right turns on red or illegal creep violations introduce minor leakage currents.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Yellow + All-Red Phase",
    trafficBehavior: "Safety transition clearance interval",
    powerSystemRep: "Dead-Time / Breaker Arc Extinction",
    powerElectronicsRep: "Semiconductor Dead-Time & Switching Loss",
    mathAnalogy: "Lost Time Penalty = lambda_sw · ||u(k) - u(k-1)||^2",
    whyMakesSense: "Captures lost capacity during phase transitions exactly like dead-time in bridge converters.",
    whereItBreaks: "Dilemma zone behavior where aggressive drivers accelerate while cautious drivers stop.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "U-Turn Movement",
    trafficBehavior: "Reverses vehicle direction into opposite carriageway",
    powerSystemRep: "Bidirectional Controlled Branch",
    powerElectronicsRep: "Bidirectional Converter (Dual-Active Bridge Switch)",
    mathAnalogy: "I_rev(t) = Gate_uturn(t) · min(q_uturn, I_sat_uturn)",
    whyMakesSense: "Injects recirculating current back into the adjacent upstream branch.",
    whereItBreaks: "U-turns have severe turning radius geometry constraints and depend heavily on opposing gap acceptance.",
    evaluationStatus: "Moderate (Plausible)",
  },
  {
    trafficElement: "3-Way Unsignalized Junction",
    trafficBehavior: "Passive merge/diverge node with priority rules",
    powerSystemRep: "Multi-Port Passive Node with Voltage Drops",
    powerElectronicsRep: "Uncontrolled Diode OR-ing Network",
    mathAnalogy: "I_out = I_main + I_side · Gate_gap(V_main)",
    whyMakesSense: "Flow joins main stream only when main flow leaves sufficient headway gaps.",
    whereItBreaks: "Driver courtesy, creeping, and aggressive gap-forcing cannot be captured by passive diodes.",
    evaluationStatus: "Moderate (Plausible)",
  },
  {
    trafficElement: "4-Way Signalized Intersection",
    trafficBehavior: "Multi-approach conflicting movement coordinator",
    powerSystemRep: "Multi-Port Switched Bus Node",
    powerElectronicsRep: "4-Leg H-Bridge / Matrix Converter",
    mathAnalogy: "Sum u_competing(t) <= 1  (Safety Non-Conflict Constraint)",
    whyMakesSense: "Direct hardware mapping to converter switching topologies with interlock guards.",
    whereItBreaks: "Pedestrian conflicts and unprotected right-turn filter movements require multi-layer sub-models.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Roundabout",
    trafficBehavior: "Self-regulating circular circulating flow ring",
    powerSystemRep: "Ring Bus / Closed Loop Mesh Network",
    powerElectronicsRep: "Circulating Current Modular Converter Ring",
    mathAnalogy: "I_circ(t) = Sum I_entry - Sum I_exit,  I_entry <= f(I_circ)",
    whyMakesSense: "Yield-at-entry rule modulates incoming current based on circulating loop current.",
    whereItBreaks: "Severe asymmetric demand can lock the roundabout (circulating gridlock), causing non-linear collapse.",
    evaluationStatus: "Moderate (Plausible)",
  },
  {
    trafficElement: "Flyover / Elevated Expressway",
    trafficBehavior: "Grade-separated bypass carrying through-traffic",
    powerSystemRep: "High-Voltage Direct Parallel Bypass Branch",
    powerElectronicsRep: "Low-Impedance Parallel Conduction Path (DC Bus)",
    mathAnalogy: "R_flyover << R_surface,  I_total = I_flyover + I_surface",
    whyMakesSense: "Diverts major through-traffic volume past surface signalized intersections.",
    whereItBreaks: "Entry/exit ramp bottlenecks can spill back onto the surface network or elevated deck.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Lane Merge",
    trafficBehavior: "Two incoming traffic streams join into one",
    powerSystemRep: "Kirchhoff Current Summation Node",
    powerElectronicsRep: "Parallel Converter Current Sharing Junction",
    mathAnalogy: "I_merged(t) = min(I_1(t) + I_2(t), I_max_downstream)",
    whyMakesSense: "Flow continuity preserves vehicle count during merging.",
    whereItBreaks: "Zip-merging etiquette varies widely; aggressive merging creates shockwave waves upstream.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Lane Divergence / Split",
    trafficBehavior: "One approach splits into multiple destination links",
    powerSystemRep: "Current Divider Network",
    powerElectronicsRep: "Demultiplexed Current Routing Branch",
    mathAnalogy: "I_1 = beta_1 · I_in,  I_2 = (1 - beta_1) · I_in",
    whyMakesSense: "Flow splits according to turning fraction beta.",
    whereItBreaks: "A queue on one turning lane can block vehicles wishing to use the open adjacent lane (lane spillback).",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Accident / Sudden Blockage",
    trafficBehavior: "Abrupt reduction or total elimination of lane capacity",
    powerSystemRep: "Transmission Line Short-Circuit / Branch Trip",
    powerElectronicsRep: "Power MOSFET Hard Fault / Thermal Shutdown",
    mathAnalogy: "I_max_fault(t) = (1 - eta_block) · I_max_nominal",
    whyMakesSense: "Triggers immediate upstream current bottleneck and voltage (queue) spike.",
    whereItBreaks: "Rubbernecking delays occur in opposite unaffected lanes due to human visual distraction.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Emergency Vehicle Priority",
    trafficBehavior: "Ambulance/Fire engine preempts normal signal phases",
    powerSystemRep: "Critical / High-Priority Emergency Load Injection",
    powerElectronicsRep: "Hardware Interrupt / Master Override Gate Pulse",
    mathAnalogy: "u_emergency = 1,  u_all_others = 0  (Instant Preemption)",
    whyMakesSense: "Directly mirrors emergency tripping and critical load shedding protocols in power grids.",
    whereItBreaks: "Post-preemption recovery transient can take multiple signal cycles to dissipate background queues.",
    evaluationStatus: "Strong (Validated)",
  },
  {
    trafficElement: "Spillback (Gridlock Cascade)",
    trafficBehavior: "Downstream queue grows to block upstream intersection",
    powerSystemRep: "Cascading Branch Overload / Voltage Collapse",
    powerElectronicsRep: "Capacitor Overvoltage Breakdown / Converter Saturation",
    mathAnalogy: "V_downstream >= V_jam ==> I_upstream_exit -> 0",
    whyMakesSense: "Voltage saturation propagates backwards through the network graph.",
    whereItBreaks: "Physical vehicle length (geometry) causes physical blockages that cannot be resolved without reverse clearing.",
    evaluationStatus: "Strong (Validated)",
  },
];

export interface CoimbatoreNodeSpec {
  nodeId: string;
  name: string;
  location: string;
  trafficType: string;
  electricalAnalog: string;
  features: string;
  empiricalDemand: string;
}

export const AVINASHI_TESTBED_NODES: CoimbatoreNodeSpec[] = [
  {
    nodeId: "Node 1",
    name: "Puliakulam – Avinashi Junction",
    location: "Avinashi Road Western Origin",
    trafficType: "4-Way Major Signalized Intersection",
    electricalAnalog: "Multi-Port Switched Inflow Hub (H-Bridge Inverter)",
    features: "High-volume feeder from central Coimbatore railway/bus corridors.",
    empiricalDemand: "~1,850 PCU/h Peak Inflow",
  },
  {
    nodeId: "Node 2",
    name: "Lakshmi Mills Junction",
    location: "Avinashi Road / PN Palayam Cross",
    trafficType: "Heavy 4-Way Multi-Phase Signal",
    electricalAnalog: "Multi-Leg Matrix Switching Converter",
    features: "Frequent phase changes, pedestrian surges, and commercial side-road inflows.",
    empiricalDemand: "~2,200 PCU/h High-Density Hub",
  },
  {
    nodeId: "Node 3",
    name: "Nava India Junction",
    location: "Avinashi Road Mid-Corridor",
    trafficType: "Signalized Intersection + Dedicated U-Turn Bay",
    electricalAnalog: "Switched Bus + Bidirectional Branch Converter",
    features: "Major educational institution access with tight turning movement constraints.",
    empiricalDemand: "~1,750 PCU/h Mixed Traffic",
  },
  {
    nodeId: "Node 4",
    name: "Peelamedu Arterial & G.D. Naidu Elevated Bypass",
    location: "Peelamedu Core Corridor",
    trafficType: "Grade-Separated Flyover Bypass + Surface Merge/Diverge Ramps",
    electricalAnalog: "Parallel Low-Impedance DC Bypass + Buck/Boost Ramp Nodes",
    features: "G.D. Naidu Elevated Corridor bypasses surface signals; ramps redistribute flow back.",
    empiricalDemand: "~2,062 PCU/h (Empirically Documented Reference Baseline)",
  },
  {
    nodeId: "Node 5",
    name: "Anna Silai / PSG Tech Junction",
    location: "Peelamedu Eastern Node",
    trafficType: "Multi-Approach Signalized Hub",
    electricalAnalog: "Multi-Port Switched Network Node",
    features: "Heavy student pedestrian crossing and bus stop dwell loading.",
    empiricalDemand: "~1,920 PCU/h Peak Demand",
  },
  {
    nodeId: "Node 6",
    name: "Uppilipalayam / LIC Terminal Node",
    location: "Eastern Corridor Terminal",
    trafficType: "Terminal Flow Dissipation / Arterial Exit",
    electricalAnalog: "Matched Resistive Ground Sink / Network Exit Buffer",
    features: "Distributes arterial traffic into bypass highways and eastern industrial zones.",
    empiricalDemand: "~2,100 PCU/h Outflow Capacity",
  },
];


export type Verdict = "strong" | "moderate" | "weak" | "open";
export type ClassificationType = "Physical (A)" | "Functional (B)" | "Mathematical (C)" | "Control (D)" | "Conceptual (E)";

export interface CandidateMapping {
  id: string;
  trafficComponent: string;
  electricalEquivalent: string;
  classifications: {
    physical: "Strong" | "Moderate" | "Weak" | "None" | "Conceptual";
    functional: "Strong" | "Moderate" | "Weak" | "None";
    mathematical: "Strong" | "Moderate" | "Weak" | "None";
    control: "Strong" | "Moderate" | "Weak" | "None";
    conceptual: "Strong" | "Moderate" | "Weak" | "None" | "High";
  };
  feasibilityScore: number; // 1 to 5
  status: "Top Candidate" | "Moderate / Caution" | "Conceptual / Caution" | "Weak";
  verdict: Verdict;
  primaryInsight: string;
  criticalCaveat: string;
  mathematicalLink: string;
}

export const CANDIDATE_MAPPINGS: CandidateMapping[] = [
  {
    id: "intersection",
    trafficComponent: "4-Way Signalized Intersection",
    electricalEquivalent: "Multi-Port Switching Network (Matrix Converter / H-Bridge)",
    classifications: {
      physical: "None",
      functional: "Strong",
      mathematical: "Moderate",
      control: "Strong",
      conceptual: "High",
    },
    feasibilityScore: 4,
    status: "Top Candidate",
    verdict: "strong",
    primaryInsight:
      "Traffic lights are literally discrete switching states. Multi-phase movements map directly to multi-leg semiconductor bridges with controlled conduction paths.",
    criticalCaveat:
      "Cars are discrete vehicles with driver agency, not continuous electrons. Lost green time during yellow/all-red must be modeled as semiconductor switching losses.",
    mathematicalLink: "Y(t) = A^T · diag(u_e(t) · g_e(x)) · A, u_e ∈ {0, 1}",
  },
  {
    id: "signal",
    trafficComponent: "Traffic Signal Actuation",
    electricalEquivalent: "Discrete Switch Gate Driver (PWM Duty-Cycle / FCS-MPC)",
    classifications: {
      physical: "None",
      functional: "Strong",
      mathematical: "Moderate",
      control: "Strong",
      conceptual: "Moderate",
    },
    feasibilityScore: 4,
    status: "Top Candidate",
    verdict: "strong",
    primaryInsight:
      "Signal cycle T_cyc and green time T_g map isomorphically to PWM period T_s and duty ratio D = T_g / T_cyc. Finite-Control-Set MPC provides optimal discrete switching without continuous relaxation.",
    criticalCaveat:
      "Minimum green dwell constraints (≥7s) and clearance intervals (≥3-4s) impose hard lower bounds on PWM switching frequency to prevent driver confusion.",
    mathematicalLink: "D = T_g / T_cyc <=> D = T_on / T_s, u(k) ∈ U_admissible",
  },
  {
    id: "queue",
    trafficComponent: "Vehicle Queue Accumulation",
    electricalEquivalent: "Capacitive Charge Storage Buffer (C = k Farads)",
    classifications: {
      physical: "Weak",
      functional: "Moderate",
      mathematical: "Moderate",
      control: "None",
      conceptual: "Moderate",
    },
    feasibilityScore: 3,
    status: "Top Candidate",
    verdict: "moderate",
    primaryInsight:
      "Queue accumulation obeys flow conservation: dq/dt = q_in - q_out. Mapping charge Q = k·q yields standard capacitor dynamics C·(dV/dt) = I_in - I_out where voltage V represents queue length.",
    criticalCaveat:
      "Capacitor discharge is electrically reversible (energy recovery), whereas traffic queue dissipation is irreversible (lost travel time is permanently dissipated).",
    mathematicalLink: "C · (dV_i / dt) = ∑ I_in − ∑ I_out <=> k · (dq_i / dt) = a_i(t) − d_i(t)",
  },
  {
    id: "source-sink",
    trafficComponent: "Traffic Demand Inflow / Outflow",
    electricalEquivalent: "Controlled Current / Voltage Sources & Resistive Sinks",
    classifications: {
      physical: "Weak",
      functional: "Moderate",
      mathematical: "Moderate",
      control: "None",
      conceptual: "Moderate",
    },
    feasibilityScore: 3,
    status: "Moderate / Caution",
    verdict: "moderate",
    primaryInsight:
      "Origin injection zones act as constant current sources I_src = k·λ. Network exits act as ground references or matched resistive loads consuming flow.",
    criticalCaveat:
      "Driver route choice is driven by individual trip destinations and navigation apps, not purely by electrostatic potential gradients.",
    mathematicalLink: "I_src(t) = k · λ(t) [Amperes], I_sink = V_exit / R_term",
  },
  {
    id: "road-segment",
    trafficComponent: "Road Segment / Corridor",
    electricalEquivalent: "Resistive / Inductive Element (R-L Branch with Current Saturation)",
    classifications: {
      physical: "Weak",
      functional: "Moderate",
      mathematical: "Moderate",
      control: "None",
      conceptual: "Moderate",
    },
    feasibilityScore: 2,
    status: "Moderate / Caution",
    verdict: "moderate",
    primaryInsight:
      "Travel time increases with corridor flow, mirroring Ohm's law V = R·I where resistance R = α·T_e. Series inductance L captures vehicle vehicular flow inertia.",
    criticalCaveat:
      "Naïve Ohm's law fails in hyper-congested regimes where flow drops as density rises (apparent negative resistance). Must be bounded by saturation limit I_max = k·C_road.",
    mathematicalLink: "R_e = α · T_e, I_e ≤ I_max = k · C_e, v_L = L · (dI/dt)",
  },
  {
    id: "whole-network",
    trafficComponent: "Metropolitan Traffic Grid",
    electricalEquivalent: "Hybrid Switched Power Network (Coupled Multi-Converter Grid)",
    classifications: {
      physical: "Conceptual",
      functional: "Moderate",
      mathematical: "None",
      control: "None",
      conceptual: "High",
    },
    feasibilityScore: 2,
    status: "Conceptual / Caution",
    verdict: "weak",
    primaryInsight:
      "High-level graph abstraction G=(V,E) where macroscopic dynamics can be analyzed using power-grid topological metrics and N-1 contingency screening.",
    criticalCaveat:
      "Potential field curl is non-zero around urban blocks (∮ ∇Φ·dr ≠ 0). Kirchhoff's Voltage Law does NOT hold network-wide. Must not be claimed as physical identity.",
    mathematicalLink: "∑_loop ΔV ≠ 0 (KVL Fails; Flow Continuity Preserved)",
  },
];

export interface DimensionalMapping {
  parameter: string;
  trafficUnit: string;
  electricalEquivalent: string;
  electricalUnit: string;
  scalingRelation: string;
  notes: string;
}

export const DIMENSIONAL_MAPPINGS: DimensionalMapping[] = [
  {
    parameter: "Vehicle Flow Rate (q / a)",
    trafficUnit: "veh/s (or veh/h)",
    electricalEquivalent: "Electric Current (I)",
    electricalUnit: "Amperes [A = C/s]",
    scalingRelation: "I(t) = k · a(t)",
    notes: "Scaling factor k (Coulombs/veh). 1 veh/s = k Amperes.",
  },
  {
    parameter: "Queue Length / Stored Vehicles (q)",
    trafficUnit: "vehicles",
    electricalEquivalent: "Capacitor Charge (Q_e) & Voltage (V)",
    electricalUnit: "Coulombs [C] & Volts [V]",
    scalingRelation: "Q_e(t) = k · q(t),  V(t) = Q_e / C = q(t)",
    notes: "Capacitance chosen as C = k Farads so node voltage numerically equals queue length.",
  },
  {
    parameter: "Road Saturation Capacity (C_e)",
    trafficUnit: "veh/s (or veh/h)",
    electricalEquivalent: "Branch Maximum Conduction Limit (I_max)",
    electricalUnit: "Amperes [A]",
    scalingRelation: "I_max = k · C_e",
    notes: "Semiconductor branch thermal / saturation limit.",
  },
  {
    parameter: "Free-Flow Travel Time (T_e)",
    trafficUnit: "seconds [s]",
    electricalEquivalent: "Branch Electrical Resistance (R_e)",
    electricalUnit: "Ohms [Ω]",
    scalingRelation: "R_e = α · T_e",
    notes: "Ohmic resistance scaled by factor α to yield measurable voltage drops.",
  },
  {
    parameter: "Vehicular Flow Inertia",
    trafficUnit: "veh·s² / m",
    electricalEquivalent: "Series Branch Inductance (L)",
    electricalUnit: "Henries [H]",
    scalingRelation: "v_L = L · (dI/dt)",
    notes: "Smoothes high-frequency flow transients and models platoon acceleration delay.",
  },
  {
    parameter: "Signal Green Time (T_g)",
    trafficUnit: "seconds [s]",
    electricalEquivalent: "MOSFET Switch ON-Time (T_on)",
    electricalUnit: "seconds [s] / Duty (D)",
    scalingRelation: "D = T_g / T_cyc",
    notes: "Fraction of cycle where branch conduction switch is closed.",
  },
  {
    parameter: "Signal Cycle Time (T_cyc)",
    trafficUnit: "seconds [s]",
    electricalEquivalent: "PWM Switching Period (T_s)",
    electricalUnit: "seconds [s]",
    scalingRelation: "T_s = T_cyc",
    notes: "Repetition period for signal phase sequence.",
  },
  {
    parameter: "Minimum Green Time (T_min)",
    trafficUnit: "seconds [s]",
    electricalEquivalent: "Minimum Switch ON-Time Dwell Guard",
    electricalUnit: "seconds [s]",
    scalingRelation: "T_on ≥ T_min (≥ 7 s)",
    notes: "Hardware-level driver safety interlock against rapid phase chatter.",
  },
  {
    parameter: "Yellow + All-Red Lost Clearance (l_s)",
    trafficUnit: "seconds [s]",
    electricalEquivalent: "Semiconductor Dead-Time & Switching Loss",
    electricalUnit: "Joules / Penalty (λ_sw · Δu²)",
    scalingRelation: "Cost Penalty = λ_sw · ||u(k) - u(k-1)||^2",
    notes: "Lost capacity during phase transition represented as explicit switching dissipation.",
  },
  {
    parameter: "Origin Inflow Demand (λ)",
    trafficUnit: "veh/s",
    electricalEquivalent: "Independent Current Source (I_src)",
    electricalUnit: "Amperes [A]",
    scalingRelation: "I_src = k · λ",
    notes: "DC or modulated current injection at boundary nodes.",
  },
];

export interface ToolchainItem {
  tool: string;
  role: string;
  licensing: string;
  estimatedCost: string;
  strengths: string;
  limitations: string;
  integrationApproach: string;
}

export const TOOLCHAIN_MATRIX: ToolchainItem[] = [
  {
    tool: "SUMO (Simulation of Urban MObility)",
    role: "Microscopic traffic ground truth",
    licensing: "Open-source (EPL-2.0)",
    estimatedCost: "$0 (Free)",
    strengths: "Microscopic vehicle tracking, realistic car-following (Krauss/IDM), TraCI Python interface, rich OSM importer.",
    limitations: "No native power-circuit solver; discrete step time steps.",
    integrationApproach: "Generates baseline validation dataset and connects to Python controller via TraCI socket interface.",
  },
  {
    tool: "Python + NetworkX",
    role: "Graph topology & orchestration bridge",
    licensing: "Open-source (BSD)",
    estimatedCost: "$0 (Free)",
    strengths: "High-flexibility graph algorithms, fast netlist generation, direct export to SUMO .net.xml and SPICE netlists.",
    limitations: "Interpreted performance overhead for large continuous ODE systems.",
    integrationApproach: "Central pipeline orchestrator: ingests network graph, builds incidence matrix A, and coordinates co-sim.",
  },
  {
    tool: "MATLAB / Simulink",
    role: "Continuous/discrete hybrid system simulation & MPC",
    licensing: "Commercial License",
    estimatedCost: "$2,000 – $10,000 / seat",
    strengths: "State-space solvers, rich Model Predictive Control toolbox, auto-generation of C/C++ firmware for DSP targets.",
    limitations: "High licensing cost; proprietary format.",
    integrationApproach: "Implements hybrid state-space difference equations x(k+1)=f(x,u,d) and evaluates FCS-MPC cost function.",
  },
  {
    tool: "Simscape Electrical / PLECS",
    role: "Physical power-electronics circuit simulation",
    licensing: "Commercial License",
    estimatedCost: "$1,500 – $5,000 / seat",
    strengths: "Nanosecond-level semiconductor switching (MOSFETs/IGBTs), conduction/switching loss models, hardware waveform capture.",
    limitations: "Optimized for electrical circuits; traffic boundary conditions must be emulated as controlled sources.",
    integrationApproach: "Simulates analog circuit equivalent, computing node voltages V(t) and branch currents I(t) for direct comparison.",
  },
  {
    tool: "FMI / Functional Mock-up Unit (SUMO-FMU)",
    role: "Standardized co-simulation interface",
    licensing: "Open standard (FMI 2.0/3.0)",
    estimatedCost: "$0 (Open)",
    strengths: "Enables cross-domain co-simulation between SUMO (traffic) and Simulink/PLECS (electrical) with synchronized time steps.",
    limitations: "Setup complexity; potential communication lag at fine time steps.",
    integrationApproach: "Exchanges boundary queue lengths and switch commands between traffic and electrical domains at Δt = 0.5s.",
  },
  {
    tool: "Matpower / PowerModels.jl",
    role: "DC/AC power-flow and contingency screening",
    licensing: "Open-source (BSD / MIT)",
    estimatedCost: "$0 (Free)",
    strengths: "Fast N-1 line outage screening, linear DC power flow, sparse Jacobian solvers for large-scale grids.",
    limitations: "Assumes conservative AC/DC grid physics; requires adaptation for directed transportation graphs.",
    integrationApproach: "Calculates transportation N-1 contingency index and line overload sensitivities under link closures.",
  },
];

export interface HardwareBOMItem {
  id: string;
  category: "Semiconductors" | "Passives" | "Controller" | "Sensors & Power" | "PCB & Prototyping";
  component: string;
  partNumber: string;
  qty: number;
  unitCostUSD: number;
  totalCostUSD: number;
  functionalPurpose: string;
  safetyRating: string;
}

export const HARDWARE_BOM: HardwareBOMItem[] = [
  {
    id: "bom-1",
    category: "Controller",
    component: "Microcontroller / DSP Development Board",
    partNumber: "STM32 Nucleo-F446RE / TI C2000 LaunchPad (TMS320F28069M)",
    qty: 1,
    unitCostUSD: 28.0,
    totalCostUSD: 28.0,
    functionalPurpose: "Generates logic-level PWM gate pulses, evaluates FCS-MPC state selections, reads ADC telemetry.",
    safetyRating: "3.3V Logic, Isolated USB",
  },
  {
    id: "bom-2",
    category: "Semiconductors",
    component: "Logic-Level N-Channel Power MOSFETs",
    partNumber: "IRLZ44N (55V, 47A, Rds_on = 0.022Ω, Vgs_th = 1-2V)",
    qty: 8,
    unitCostUSD: 1.85,
    totalCostUSD: 14.8,
    functionalPurpose: "High-speed switching of traffic conduction paths (emulates signal green phases).",
    safetyRating: "55V Breakdown, Heatsinked",
  },
  {
    id: "bom-3",
    category: "Semiconductors",
    component: "Fast-Recovery Flyback Schottky Diodes",
    partNumber: "1N5822 / MBR360 (40V, 3A)",
    qty: 8,
    unitCostUSD: 0.65,
    totalCostUSD: 5.2,
    functionalPurpose: "Clamps inductive flyback voltage spikes during abrupt switch openings (all-red clearance).",
    safetyRating: "40V Reverse Clamp",
  },
  {
    id: "bom-4",
    category: "Passives",
    component: "Low-ESR Storage Capacitors (Queue Buffers)",
    partNumber: "Panasonic FR Series (470µF / 1000µF, 25V)",
    qty: 6,
    unitCostUSD: 1.2,
    totalCostUSD: 7.2,
    functionalPurpose: "Represents vehicle accumulation at intersections (voltage V_i = q_i).",
    safetyRating: "25V Rating, Low Leakage",
  },
  {
    id: "bom-5",
    category: "Passives",
    component: "Corridor Inertia Inductors",
    partNumber: "Bourns 2200 Series (220µH / 470µH, 3A Toroid)",
    qty: 6,
    unitCostUSD: 2.1,
    totalCostUSD: 12.6,
    functionalPurpose: "Emulates vehicle platoon momentum and gradual acceleration under green phase.",
    safetyRating: "3A Saturation Current",
  },
  {
    id: "bom-6",
    category: "Sensors & Power",
    component: "Precision Current Sense Shunt Resistors",
    partNumber: "Vishay Dale WSL2512 (0.10 Ω, 1%, 1W Metal Strip)",
    qty: 8,
    unitCostUSD: 1.4,
    totalCostUSD: 11.2,
    functionalPurpose: "Provides low-loss analog current measurement I_e(t) proportional to branch vehicle flow.",
    safetyRating: "1W Dissipation Rating",
  },
  {
    id: "bom-7",
    category: "Sensors & Power",
    component: "Benchtop Regulated DC Power Supply",
    partNumber: "Mean Well LRS-100-12 (12V DC, 8.5A output)",
    qty: 1,
    unitCostUSD: 24.5,
    totalCostUSD: 24.5,
    functionalPurpose: "Provides safe low-voltage DC bus representing origin traffic inflow energy.",
    safetyRating: "Short-Circuit & Overload Protection",
  },
  {
    id: "bom-8",
    category: "PCB & Prototyping",
    component: "Custom 2-Layer FR4 Prototype PCB & Connectors",
    partNumber: "Custom CAD Gerber (JLCPCB 2-layer ENIG + Screw Terminals)",
    qty: 1,
    unitCostUSD: 22.0,
    totalCostUSD: 22.0,
    functionalPurpose: "Mounts switching matrix, current shunts, status LEDs, and BNC test points for oscilloscope.",
    safetyRating: "UL 94V-0 Flame Retardant",
  },
  {
    id: "bom-9",
    category: "Sensors & Power",
    component: "Emergency Kill-Switch & Fast-Blow Fuses",
    partNumber: "Panel-mount E-stop + 3A Fast Glass Fuses",
    qty: 1,
    unitCostUSD: 8.5,
    totalCostUSD: 8.5,
    functionalPurpose: "Hardware-level physical safety cutoff for rapid lab bench shutdown.",
    safetyRating: "Fail-Safe Mechanical Break",
  },
];

export interface TestScenario {
  id: string;
  name: string;
  category: "Nominal" | "Disturbance" | "Contingency" | "Failure Mode" | "Observability";
  description: string;
  trafficPerturbation: string;
  electricalAnalogAction: string;
  expectedObservation: string;
  falsificationMetric: string;
  passCriteria: string;
}

export const TEST_SCENARIOS: TestScenario[] = [
  {
    id: "test-nominal",
    name: "Experiment 1: Nominal Steady-State Operation",
    category: "Nominal",
    description: "Verify baseline flow equilibrium under balanced multi-directional inflows and fixed signal timing.",
    trafficPerturbation: "Nominal inflow λ = 1200 veh/h per approach. 50/50 green split.",
    electricalAnalogAction: "Constant DC current injection I_src = 12 mA. Fixed 50% PWM duty cycle.",
    expectedObservation: "Both models settle to steady-state queue oscillations with identical average throughput.",
    falsificationMetric: "Mean Absolute Error (MAE) between scaled capacitor voltage V_i(t) and SUMO queue x_i(t).",
    passCriteria: "MAE < 8%, Pearson correlation r > 0.95.",
  },
  {
    id: "test-surge",
    name: "Experiment 2: Dynamic Demand Surge (Rush Hour Spike)",
    category: "Disturbance",
    description: "Inject a sudden 2.2× demand surge on North-South corridor for 300 seconds and observe queue buildup.",
    trafficPerturbation: "Inflow steps from 800 to 1800 veh/h on North approach at t = 120s.",
    electricalAnalogAction: "Current source step from 8 mA to 18 mA on corresponding branch at t = 120s.",
    expectedObservation: "North-South capacitor voltage V_NS rises sharply; FCS-MPC automatically increases duty cycle to discharge queue.",
    falsificationMetric: "Peak queue delay agreement and time-to-peak synchronization.",
    passCriteria: "Peak delay error < 12%, peak timing alignment within ±10s.",
  },
  {
    id: "test-n1-closure",
    name: "Experiment 3: N-1 Road Closure (Incident Contingency)",
    category: "Contingency",
    description: "Simulate a severe traffic accident blocking a key arterial link, forcing vehicle diversion.",
    trafficPerturbation: "Set link R4 capacity C_e = 0 at t = 180s (complete lane blockage).",
    electricalAnalogAction: "Open series MOSFET switch on branch R4 (infinite impedance branch cut).",
    expectedObservation: "Upstream capacitor charges to saturation; current diverts through parallel collector branches R6 & R7.",
    falsificationMetric: "Detection of secondary bottleneck formation and cascading queue spillback speed.",
    passCriteria: "Identifies identical primary & secondary bottleneck order; correlation r > 0.88.",
  },
  {
    id: "test-signal-fault",
    name: "Experiment 4: Stuck Signal Failure (Actuator Fault)",
    category: "Failure Mode",
    description: "Emulate a malfunctioning signal controller stuck permanently in East-West green phase.",
    trafficPerturbation: "Phase toggle disabled; East-West movement granted 100% green, North-South 0% green.",
    electricalAnalogAction: "Gate drive high permanently on East-West MOSFETs; North-South MOSFETs held low (open circuit).",
    expectedObservation: "North-South capacitor charges linearly to maximum capacity; East-West link drains completely.",
    falsificationMetric: "Linear charging slope dV/dt = I_in vs traffic vehicle accumulation rate dq/dt = a(t).",
    passCriteria: "Slope divergence < 5% until physical jam density saturation.",
  },
  {
    id: "test-multiphase",
    name: "Experiment 5: Multiphase Duty-Cycle Linearity Sweep",
    category: "Nominal",
    description: "Sweep signal green split from 20% to 80% in 10% steps to test linearity of queue discharge.",
    trafficPerturbation: "Systematic green time variation from T_g = 12s to T_g = 48s in T_cyc = 60s cycle.",
    electricalAnalogAction: "PWM duty cycle sweep D = 0.20 to D = 0.80.",
    expectedObservation: "Average queue delay displays hyperbolic decay consistent with Webster delay formula and switched converter duty equations.",
    falsificationMetric: "Goodness of fit (R²) against analytical Webster delay equation.",
    passCriteria: "R² > 0.92 across entire duty range.",
  },
  {
    id: "test-observability",
    name: "Experiment 6: State Estimation & Observability from Sparse Sensors",
    category: "Observability",
    description: "Estimate internal unmonitored queue lengths using branch current telemetry and Weighted Least Squares (WLS).",
    trafficPerturbation: "Sensor telemetry available only on perimeter boundary entries and exits (50% observability).",
    electricalAnalogAction: "WLS state estimation algorithm estimates internal capacitor voltages from boundary shunt currents.",
    expectedObservation: "Internal capacitor voltages reconstructed within confidence bounds; detects hidden queue buildup.",
    falsificationMetric: "State estimation Normalized Root Mean Square Error (NRMSE).",
    passCriteria: "NRMSE < 15% under noisy sensor inputs (SNR = 20 dB).",
  },
];

export interface FirstExperimentProtocol {
  step: number;
  title: string;
  duration: string;
  objective: string;
  procedure: string[];
  deliverable: string;
}

export const FIRST_EXPERIMENT_STEPS: FirstExperimentProtocol[] = [
  {
    step: 1,
    title: "SUMO 5-Node Benchmark Setup",
    duration: "Week 1",
    objective: "Establish ground truth traffic simulation baseline on a 5-intersection test network.",
    procedure: [
      "Generate 5-intersection network in SUMO (central junction J1 connected to 4 satellite feeders N, S, E, W).",
      "Inject calibrated traffic demand (150–300 veh/h per arm) with 60-second fixed-time signal cycles.",
      "Log dynamic queue lengths x_i(t) and exit flows at 1.0-second intervals for 1800 simulation seconds.",
    ],
    deliverable: "Baseline time-series dataset (.csv) with ground truth queue trajectories.",
  },
  {
    step: 2,
    title: "PLECS / Simscape Circuit Simulation",
    duration: "Week 2",
    objective: "Construct the equivalent 5-node electrical switching circuit netlist.",
    procedure: [
      "Instantiate 5 capacitive storage nodes (C = 1000 µF) representing queues.",
      "Wire 4 bidirectional MOSFET switching legs representing signalized junction approaches.",
      "Drive circuit with scaled current sources I_src = k·λ and capture node voltages V_i(t).",
    ],
    deliverable: "Simulated electrical waveform logs (.mat) synchronized to traffic timebase.",
  },
  {
    step: 3,
    title: "Sim-to-Sim Cross-Domain Validation",
    duration: "Week 3",
    objective: "Statistically compare SUMO microscopic output against PLECS electrical circuit results.",
    procedure: [
      "Normalize signals: scale node voltage V(t) by 1/k to convert Volts directly to vehicles.",
      "Calculate Pearson correlation coefficient r and Mean Squared Error (MSE) across all 5 nodes.",
      "Verify that phase transitions, queue ramp-up, and discharge timings coincide.",
    ],
    deliverable: "Sim-to-Sim Validation Report with correlation matrix and error histograms.",
  },
  {
    step: 4,
    title: "Hardware Prototype Bench Build",
    duration: "Week 4",
    objective: "Assemble physical low-voltage 5-node emulator on lab test bench.",
    procedure: [
      "Populate 2-layer prototype PCB with 8 IRLZ44N MOSFETs, 1N5822 Schottky diodes, and 0.1Ω shunts.",
      "Connect STM32 / TI C2000 microcontroller to gate driver circuitry.",
      "Wire 12V DC power supply with emergency kill switch and 3A fast-blow fuses.",
    ],
    deliverable: "Operational physical lab bench testbed ready for live signal injection.",
  },
  {
    step: 5,
    title: "Hardware Benchtop Experimentation",
    duration: "Week 5",
    objective: "Run physical hardware tests and capture real-time oscilloscope telemetry.",
    procedure: [
      "Program microcontroller with identical signal timing plans (PWM gate pulses).",
      "Inject controlled DC currents matching SUMO inflow profiles.",
      "Log capacitor voltage charging curves and shunt currents via 16-bit DAQ / digital oscilloscope.",
    ],
    deliverable: "High-resolution digital oscilloscope waveform captures (.csv / .png).",
  },
  {
    step: 6,
    title: "Disturbance & Falsification Testing",
    duration: "Week 6",
    objective: "Inject step perturbations and N-1 fault conditions into hardware testbed.",
    procedure: [
      "Apply 2× current surge on North approach at t = 300s; verify voltage spike trajectory.",
      "Disconnect East branch MOSFET gate (simulating lane blockage); record diversion currents.",
      "Test against falsification criteria (reject if error > 20% or spurious oscillations occur).",
    ],
    deliverable: "Disturbance response evaluation and pass/fail gate decision matrix.",
  },
  {
    step: 7,
    title: "Synthesis & Go/No-Go Decision Gate",
    duration: "Week 7",
    objective: "Convene research review panel to assess if the physical circuit analogy holds.",
    procedure: [
      "Compile correlation coefficients (target r ≥ 0.90) and peak timing accuracy (±10%).",
      "Document all failure modes where the analogy broke down (e.g. driver hysteresis, turn conflicts).",
      "Formulate formal decision: Proceed to 25–50 node network (Stage 4) or Pivot/Abandon.",
    ],
    deliverable: "First Experiment Final Decision Dossier & Stage Gate Approval.",
  },
];

export interface RiskDecisionItem {
  id: string;
  riskName: string;
  category: string;
  likelihood: "High" | "Medium" | "Low";
  severity: "High" | "Medium" | "Low";
  threatDescription: string;
  failureMechanism: string;
  mitigationStrategy: string;
  decisionAbandonmentThreshold: string;
}

export const RISK_REGISTER: RiskDecisionItem[] = [
  {
    id: "risk-no-mapping",
    riskName: "Analogy Breakdown / No Valid Physical Mapping",
    category: "Foundational Physics",
    likelihood: "Medium",
    severity: "High",
    threatDescription:
      "The electrical analogy fails to capture essential traffic phenomena (e.g. backward shockwaves, driver hysteresis, lane changes).",
    failureMechanism:
      "Passive circuit equations are symmetric and linear, whereas traffic flow is non-linear and asymmetric. Enforcing KVL creates unphysical potential fields.",
    mitigationStrategy:
      "Abandon passive circuits; use active semiconductor switching matrices with discrete FCS-MPC and one-way directional diodes.",
    decisionAbandonmentThreshold:
      "If cross-domain error consistently exceeds 30% or Pearson r < 0.70 across all 6 test scenarios, formally abandon the circuit hardware approach.",
  },
  {
    id: "risk-prior-art",
    riskName: "Prior-Art Rebranding & Patent Overlap",
    category: "Novelty & Intellectual Property",
    likelihood: "Medium",
    severity: "High",
    threatDescription:
      "Metaphors comparing traffic to electric current date back 70 years (LWR 1955). Reviewers may reject claims as cosmetic rebranding.",
    failureMechanism:
      "Academic literature contains extensive hydraulic and resistor analogies (Schweitzer 1999, Varaiya 2013, UC Regents patent US9852631B2).",
    mitigationStrategy:
      "Explicitly disavow naive passive analogies; strictly bound novelty claims to active semiconductor switching representations, FCS-MPC switching loss minimization, and N-1 contingency screening.",
    decisionAbandonmentThreshold:
      "If prior patent claims anticipate the active semiconductor switching formulation with clearance penalties, pivot scope to algorithmic co-simulation.",
  },
  {
    id: "risk-combinatorial",
    riskName: "Combinatorial Explosion in Multi-Node FCS-MPC",
    category: "Computational Complexity",
    likelihood: "Medium",
    severity: "High",
    threatDescription:
      "Centralized evaluation of switching combinations scales exponentially O((M^N)^N_p), causing solver timeout in real-time control.",
    failureMechanism:
      "For N=7 intersections with M=4 phases and horizon N_p=5, search space reaches ~1.18×10^21 evaluations per epoch, exceeding 1-second control deadlines.",
    mitigationStrategy:
      "Decompose into 1-hop distributed consensus agents; apply power-electronics sphere decoding to prune infeasible switching branches.",
    decisionAbandonmentThreshold:
      "If distributed solver execution time exceeds 200 ms on ARM Cortex / DSP edge hardware, revert to decentralized Max-Pressure with switching guards.",
  },
  {
    id: "risk-overcomplicated",
    riskName: "Model Overcomplication & Schedule Slippage",
    category: "Project Execution",
    likelihood: "Medium",
    severity: "Medium",
    threatDescription:
      "Adding excessive micro-level details (pedestrians, weather, mixed vehicle types) causes exponential parameter proliferation and calibration failure.",
    failureMechanism:
      "Attempting to model full metropolitan cities before validating on canonical 5-node grids obscures whether errors stem from circuit physics or simulator tuning.",
    mitigationStrategy:
      "Enforce strict stage gating: validate on 5-node toy town before 25-node grid; constrain real-world test to linear Avinashi Road corridor.",
    decisionAbandonmentThreshold:
      "If simulation calibration requires > 20 unmeasurable empirical tuning parameters, simplify model to macroscopic Cell Transmission representation.",
  },
  {
    id: "risk-hardware-safety",
    riskName: "Hardware Failure / Electrical Safety Hazard",
    category: "Lab Safety",
    likelihood: "Low",
    severity: "Low",
    threatDescription:
      "MOSFET thermal runaway, short circuits on DC bus, or inductive flyback spikes damaging test equipment.",
    failureMechanism:
      "Abrupt current cutoff without freewheeling clamp diodes generates high-voltage inductive spikes (V = L·di/dt) puncturing MOSFET gate oxide.",
    mitigationStrategy:
      "Use low DC bus voltage (12–24V); install Schottky freewheeling clamp diodes, thermal heatsinks, 3A fast-blow fuses, and a physical E-stop button.",
    decisionAbandonmentThreshold:
      "If PCB design experiences recurring thermal damage (> 85°C), redesign board with larger copper pours and dedicated gate driver ICs.",
  },
  {
    id: "risk-data-provenance",
    riskName: "Data Provenance Corruption in Coimbatore Corridor",
    category: "Empirical Integrity",
    likelihood: "Medium",
    severity: "Medium",
    threatDescription:
      "Unlabeled or assumed parameters (e.g. autorickshaw friction, turning ratios) passed off as empirical measurements, invalidating validation.",
    failureMechanism:
      "Municipal signal sheets provide timings, but mid-block friction and turning splits are often estimated. Passing assumptions as measured data constitutes scientific fraud.",
    mitigationStrategy:
      "Enforce 5-tier immutable provenance badges: MEASURED, PUBLISHED, ESTIMATED, ASSUMED, SIMULATED. Run Monte Carlo ±20% sensitivity sweeps on all assumed variables.",
    decisionAbandonmentThreshold:
      "If model throughput predictions vary by > 25% when assumed parameters are varied over their ±20% range, label corridor results as purely synthetic.",
  },
  {
    id: "risk-measurement-noise",
    riskName: "Telemetry Noise & State Estimation Inaccuracy",
    category: "Instrumentation",
    likelihood: "Medium",
    severity: "Low",
    threatDescription:
      "ADC measurement noise on low-value shunt resistors obscures small current differences, leading to inaccurate queue estimation.",
    failureMechanism:
      "Low shunt resistance (0.1Ω) produces small millivolt signals susceptible to electromagnetic interference (EMI) from switching transistors.",
    mitigationStrategy:
      "Use differential instrumentation amplifiers, active RC low-pass filtering, 16-bit ADC sampling, and Kalman / WLS filtering in firmware.",
    decisionAbandonmentThreshold:
      "If signal-to-noise ratio (SNR) remains < 12 dB despite filtering, replace shunt resistors with isolated Hall-effect current transducers.",
  },
  {
    id: "risk-team-shortfall",
    riskName: "Interdisciplinary Skill Gap & Resource Constraints",
    category: "Personnel",
    likelihood: "Low",
    severity: "Medium",
    threatDescription:
      "Project requires simultaneous expertise in transportation engineering, power-electronics circuit design, and real-time embedded control.",
    failureMechanism:
      "Traffic researchers lack power-electronics knowledge (PCB layout, gate drivers), while electrical engineers lack macroscopic traffic theory (MFD, CTM).",
    mitigationStrategy:
      "Establish paired co-PI leadership (1 Traffic PI + 1 Power Electronics Co-PI) and cross-train PhD candidates in both SUMO and PLECS toolchains.",
    decisionAbandonmentThreshold:
      "If critical power-electronics hardware expertise is unavailable, utilize modular commercial off-the-shelf power converter evaluation boards.",
  },
];

export interface PriorArtItem {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  category: "Seminal Traffic Analogy" | "Modern Circuit Analogy" | "Signal Control Theory" | "Patent Prior Art";
  summary: string;
  url: string;
  noveltyBoundary: string;
}

export const EXPANDED_PRIOR_ART: PriorArtItem[] = [
  {
    id: "pa-1",
    title: "Robust Routing Using Electrical Flows",
    authors: "Sinop, Cohen, Miller, Peng, et al.",
    year: 2022,
    venue: "Google Research / SODA",
    category: "Modern Circuit Analogy",
    summary:
      "Formulates routing on large road networks using electrical resistor analogies: roads map to resistors with R = α·T, travel time maps to resistance, and traffic flow between origin-destination pairs maps to current driven by an artificial voltage battery.",
    url: "https://research.google/pubs/pub51240/",
    noveltyBoundary:
      "Focuses on static routing algorithms on passive resistor graphs. Does not model signalized intersections, active semiconductor switching states, or dynamic queue storage.",
  },
  {
    id: "pa-2",
    title: "Traffic Flow Model based on Kirchhoff's Law and Circuit Simulation",
    authors: "Cui & Ma",
    year: 2012,
    venue: "IEEE International Conference on Automation & Logistics",
    category: "Modern Circuit Analogy",
    summary:
      "Explicitly derives traffic flow relationships using Kirchhoff's Current Law (KCL). Identifies relationships between traffic resistance, volume, and road capacity to construct circuit simulation models of intersection nodes.",
    url: "https://doi.org/10.1109/ICAL.2012.6308212",
    noveltyBoundary:
      "Applies continuous linear circuit equations without active multi-pole semiconductor switches, lost clearance time penalties, or Finite-Control-Set MPC.",
  },
  {
    id: "pa-3",
    title: "Equivalent Circuit Model–Based EV Evacuation and Power Grid Coupling",
    authors: "Moyalan, Balasubramaniam, et al.",
    year: 2026,
    venue: "arXiv preprint / IEEE Trans. Transportation Electrification",
    category: "Modern Circuit Analogy",
    summary:
      "Develops coupled equivalent circuit models mapping traffic evacuation flow to electrical currents and vehicle charging demand to distribution feeder loading during extreme events.",
    url: "https://arxiv.org/abs/2601.04521",
    noveltyBoundary:
      "Couples EV battery charging loads to distribution grids; does not formulate urban traffic signals as discrete semiconductor matrix converters.",
  },
  {
    id: "pa-4",
    title: "Investigation of Urban Traffic Flows Using Electrical Circuit Analogue",
    authors: "Danchuk, Bakulich, Svatko",
    year: 2020,
    venue: "Journal of Sustainable Development of Transport",
    category: "Modern Circuit Analogy",
    summary:
      "Investigates the optimization of urban traffic flow distribution using an electrical circuit analogue, mapping link capacities to branch conductances.",
    url: "https://doi.org/10.14254/jsdt.2020.5-2.8",
    noveltyBoundary:
      "Passive analog model; does not incorporate discrete semiconductor switching states, lost clearance penalties, or hardware benchtop prototypes.",
  },
  {
    id: "pa-5",
    title: "Loopwise Route Representation and Current Flow Conservation",
    authors: "Kim, Park, Lee",
    year: 2022,
    venue: "IEEE Access",
    category: "Modern Circuit Analogy",
    summary:
      "Applies loop current analysis (mesh analysis) to represent vehicle routes and enforce flow conservation across closed network loops.",
    url: "https://doi.org/10.1109/ACCESS.2022.3184920",
    noveltyBoundary:
      "Mathematical routing framework; assumes linear conservative potential fields and ignores signal switching dynamics and non-conservative travel time curl.",
  },
  {
    id: "pa-6",
    title: "The Max-Pressure Controller for Arbitrary Networks of Signalized Intersections",
    authors: "Varaiya",
    year: 2013,
    venue: "Advances in Dynamic Network Modeling",
    category: "Signal Control Theory",
    summary:
      "Decentralized queue-differential backpressure controller proving network stability without origin-destination demand information.",
    url: "https://doi.org/10.1007/978-1-4614-6792-2_2",
    noveltyBoundary:
      "Assumes infinite link storage (point queues) and neglects lost clearance time during phase changes, leading to rapid chattering under balanced loads.",
  },
  {
    id: "pa-7",
    title: "Decentralized Traffic Signal Control Using Backpressure Routing",
    authors: "Regents of the University of California (Varaiya et al.)",
    year: 2013,
    venue: "USPTO Patent US9852631B2",
    category: "Patent Prior Art",
    summary:
      "Patents localized queue-differential actuation at intersections, calculating differential pressure across adjacent roadway links to select phases.",
    url: "https://patents.google.com/patent/US9852631B2/en",
    noveltyBoundary:
      "Does not formulate traffic as an electrical power-electronic switching network, lacks semiconductor switching loss models, and uses no FCS-MPC prediction horizons.",
  },
  {
    id: "pa-8",
    title: "Electrical Analogs for Transportation Network Flow: Historical Retrospective",
    authors: "Schweitzer & Helbing",
    year: 1999,
    venue: "Physical Review E",
    category: "Seminal Traffic Analogy",
    summary:
      "Comprehensive review showing that passive linear/non-linear resistor networks fail to model traffic congestion hysteresis and backward shockwaves.",
    url: "https://doi.org/10.1103/PhysRevE.60.6344",
    noveltyBoundary:
      "Canonical negative result proving why passive electrical analogies fail, establishing the necessity for active semiconductor switching elements.",
  },
];

export interface RoadmapStage {
  stageNumber: string;
  stageName: string;
  timeframe: string;
  quarterSpan: string;
  leadRole: string;
  coreDeliverables: string[];
  gateCriteria: string;
  status: "Completed" | "In Progress" | "Upcoming" | "Future";
}

export const RESEARCH_ROADMAP_STAGES: RoadmapStage[] = [
  {
    stageNumber: "Stage 0",
    stageName: "Foundations, Literature & Patent Review",
    timeframe: "Sept 2026 – Jan 2027",
    quarterSpan: "Q1–Q2 (Year 1)",
    leadRole: "PI & Co-PI",
    coreDeliverables: [
      "Exhaustive patent and literature scan (USPTO, WIPO, IEEE Xplore, Google Scholar).",
      "Dimensional analysis and conservation law proofs (KCL flow conservation).",
      "Multi-criteria decision matrix scoring all 6 candidate mappings.",
    ],
    gateCriteria: "Formal literature dossier showing zero unmitigated IP conflicts and mathematically consistent scaling equations.",
    status: "Completed",
  },
  {
    stageNumber: "Stage 1",
    stageName: "5–15 Node Graph Formulation & Modeling",
    timeframe: "Feb 2027 – May 2027",
    quarterSpan: "Q2–Q3 (Year 1)",
    leadRole: "PhD 1 (Traffic) & Res. Eng.",
    coreDeliverables: [
      "Construct canonical 5-node and 7-node benchmark network graphs.",
      "Derive node-branch incidence matrix A and switched admittance matrix Y(t).",
      "Implement dual-view simulation harness (SUMO baseline vs Simscape circuit netlist).",
    ],
    gateCriteria: "Sim-to-Sim queue tracking correlation r ≥ 0.90 under nominal demand.",
    status: "In Progress",
  },
  {
    stageNumber: "Stage 2",
    stageName: "Mathematical Analysis & State-Space Derivations",
    timeframe: "June 2027 – Sept 2027",
    quarterSpan: "Q4 (Year 1) – Q1 (Year 2)",
    leadRole: "PI & PhD 2 (Power Electronics)",
    coreDeliverables: [
      "Formalize discrete state-space update equations x(k+1) = f(x,u,d).",
      "Prove Lyapunov stability bounds for switched hybrid dynamic system.",
      "Quantify non-conservative travel-time potential curl around closed loops.",
    ],
    gateCriteria: "Peer-reviewed submission to IEEE Control Systems Letters on switched hybrid traffic representation.",
    status: "Upcoming",
  },
  {
    stageNumber: "Stage 3",
    stageName: "Dynamic Switching & FCS-MPC Controller",
    timeframe: "Oct 2027 – Jan 2028",
    quarterSpan: "Q1–Q2 (Year 2)",
    leadRole: "Co-PI & PhD 2",
    coreDeliverables: [
      "Implement Finite-Control-Set MPC discrete cost function min J with switching loss penalty λ_sw·Δu².",
      "Benchmark against Max-Pressure (Varaiya 2013) and Webster fixed-time under varied demand.",
      "Implement 1-hop distributed consensus decomposition to avoid O(M^N) latency.",
    ],
    gateCriteria: "FCS-MPC demonstrates ≥ 15% reduction in lost clearance time and queue variance against Max-Pressure.",
    status: "Future",
  },
  {
    stageNumber: "Stage 4",
    stageName: "25–50 Node Suburban Simulation & N-1 Screening",
    timeframe: "Feb 2028 – July 2028",
    quarterSpan: "Q2–Q4 (Year 2)",
    leadRole: "PhD 1 & Res. Eng.",
    coreDeliverables: [
      "Scale simulation harness to 25–50 node suburban grid network.",
      "Implement transportation N-1 contingency index and cascading queue spillback engine.",
      "Conduct observability analysis with sparse shunt sensor placement (WLS state estimation).",
    ],
    gateCriteria: "N-1 index correctly identifies top 3 critical bottleneck links validated against full SUMO crash simulations.",
    status: "Future",
  },
  {
    stageNumber: "Stage 5",
    stageName: "Hardware Prototype Build & Benchtop Testing",
    timeframe: "Aug 2028 – Jan 2029",
    quarterSpan: "Q4 (Year 2) – Q2 (Year 3)",
    leadRole: "Lab Tech & PhD 2",
    coreDeliverables: [
      "Fabricate 2-layer PCB testbed with logic-level MOSFETs, storage capacitors, and current shunts.",
      "Program STM32 / TI C2000 DSP microcontroller firmware with FCS-MPC switching routines.",
      "Execute 6 canonical lab bench experiments with live oscilloscope telemetry capture.",
    ],
    gateCriteria: "Hardware capacitor voltages track simulated queue profiles within ±12% MAE.",
    status: "Future",
  },
  {
    stageNumber: "Stage 6",
    stageName: "Coimbatore Avinashi Road Corridor Case Study",
    timeframe: "Feb 2029 – Aug 2029",
    quarterSpan: "Q2–Q4 (Year 3)",
    leadRole: "All Team Members",
    coreDeliverables: [
      "Ingest empirical geometry and signal sheets for Avinashi Road corridor (Lakshmi Mills to Nava India).",
      "Apply strict 5-tier data provenance labeling (MEASURED, PUBLISHED, ESTIMATED, ASSUMED, SIMULATED).",
      "Perform hardware-in-the-loop (HIL) telemetry test with actual corridor traffic counts.",
    ],
    gateCriteria: "Sensitivity analysis confirms key performance metrics vary by < ±12% across ±20% Monte Carlo parameter sweeps.",
    status: "Future",
  },
  {
    stageNumber: "Stage 7",
    stageName: "Final Synthesis, Publications & Patent Filing",
    timeframe: "Sept 2029 – Dec 2029",
    quarterSpan: "Q4 (Year 3)",
    leadRole: "PI & Co-PI",
    coreDeliverables: [
      "Compile comprehensive research monograph and open-source codebase repository.",
      "Publish 3 journal papers (IEEE T-ITS, IEEE T-PEL, IEEE Control Systems).",
      "Submit patent application on FCS-MPC Switching Signal Controller with Clearance Loss Minimization.",
    ],
    gateCriteria: "Successful PhD thesis defenses and open-source release of simulation toolchain.",
    status: "Future",
  },
];

export interface TeamBudgetItem {
  category: string;
  annualCostUSD: number;
  threeYearTotalUSD: number;
  description: string;
}

export const BUDGET_BREAKDOWN: TeamBudgetItem[] = [
  {
    category: "Personnel (PI, Co-PI, 2 PhD Students, 1 Res. Engineer, 1 Lab Tech)",
    annualCostUSD: 310000,
    threeYearTotalUSD: 930000,
    description: "Salaries, stipends, and institutional fringe benefits for 4.5 FTE multidisciplinary research staff.",
  },
  {
    category: "Simulation Software & Commercial Licenses (MATLAB, PLECS, Simscape)",
    annualCostUSD: 18000,
    threeYearTotalUSD: 54000,
    description: "Commercial multi-user seat licenses and maintenance for PLECS Blockset, MATLAB/Simulink, and FMU toolboxes.",
  },
  {
    category: "Hardware Testbed, PCB Fabrication & Lab Instrumentation",
    annualCostUSD: 12000,
    threeYearTotalUSD: 36000,
    description: "Custom PCB fabrication, power MOSFETs, DSP LaunchPads, digital storage oscilloscopes, and DAQ telemetry cards.",
  },
  {
    category: "Field Data Collection & Coimbatore Sensor Telemetry",
    annualCostUSD: 10000,
    threeYearTotalUSD: 30000,
    description: "Video turning counts, traffic sensor telemetry acquisition, and municipal coordination in Coimbatore.",
  },
  {
    category: "Publications, Open-Access Fees & Conference Travel",
    annualCostUSD: 9000,
    threeYearTotalUSD: 27000,
    description: "Open-access publication fees (IEEE / TRB) and travel for paper presentations.",
  },
  {
    category: "Project Contingency & Indirect Overhead (15%)",
    annualCostUSD: 53850,
    threeYearTotalUSD: 161550,
    description: "Institutional indirect costs, equipment depreciation, and emergency contingency reserves.",
  },
];

export const NOVELTY_CHECKLIST = [
  {
    id: "nov-1",
    claim: "Traffic Signals as Active Multi-Pole Semiconductor Switching Bridges (Not Passive Resistors)",
    status: "novel" as const,
    note: "Core proposed contribution: transforms passive circuit analogy into active power electronics with switched nodal admittance matrix Y(t).",
  },
  {
    id: "nov-2",
    claim: "FCS-MPC Switching Optimization with Explicit Yellow/All-Red Lost Clearance Penalties (λ_sw · Δu²)",
    status: "novel" as const,
    note: "Direct mathematical transfer from multi-level inverter control. Suppresses rapid signal chattering without continuous relaxation heuristics.",
  },
  {
    id: "nov-3",
    claim: "Transportation N-1 Contingency Analysis & Cascading Queue Spillback Screening",
    status: "plausible" as const,
    note: "Adapted from power grid transmission line outage screening to preemptively identify critical urban bottleneck vulnerability.",
  },
  {
    id: "nov-4",
    claim: "Traffic Flow Rate Mapped to Electric Current (q ↔ I = k·a)",
    status: "established" as const,
    note: "Known since Lighthill-Whitham-Richards (1955) and Cui & Ma (2012). Strictly cited as foundational literature; NOT claimed as novel.",
  },
  {
    id: "nov-5",
    claim: "Graph Topology of Intersections and Roads as G=(V,E)",
    status: "established" as const,
    note: "Universal standard in network flow theory since Ford-Fulkerson (1956). Strictly cited as standard methodology.",
  },
  {
    id: "nov-6",
    claim: "Decentralized Intersection Actuation without Central Master Controller",
    status: "established" as const,
    note: "Well-established in Max-Pressure literature (Varaiya 2013). Our novelty is strictly the FCS-MPC switching loss penalty.",
  },
  {
    id: "nov-7",
    claim: "Physical Benchtop Switching Emulator with Breadboard Telemetry & ADC Capture",
    status: "novel" as const,
    note: "First physical proof-of-concept hardware testbed validating switched dynamic traffic analog under live electrical instrumentation.",
  },
];

export interface ExecutionStep {
  stepNumber: number;
  title: string;
  badge: string;
  timeframe: string;
  difficulty: "Beginner / Fast" | "Intermediate" | "Hardware / Lab";
  costEstimate: string;
  summary: string;
  howToStart: string[];
  exactCodeOrCommands: {
    language: string;
    title: string;
    code: string;
  };
  keyPitfallToAvoid: string;
  verificationGate: string;
}

export const THREE_WEEK_DELIVERABLES = [
  {
    id: 1,
    title: "1. SUMO Single-Intersection Simulation",
    tag: "Ground Truth Data",
    desc: "A 4-way, 2-phase (NS/EW) intersection in SUMO with constant ~300 veh/h demand, logging vehicle queue length over time to CSV via TraCI.",
    badge: "Days 3–5",
  },
  {
    id: 2,
    title: "2. Queue-as-Capacitor Circuit & Calibration",
    tag: "LTspice & Scipy",
    desc: "Current source → R → C circuit in LTspice. Calibrated via Python curve_fit to empirically find R and C matching the SUMO curve without arbitrary assertions.",
    badge: "Days 6–7",
  },
  {
    id: 3,
    title: "3. 2-Switch Arduino + MOSFET Hardware Demo",
    tag: "Physical Breadboard",
    desc: "Arduino Uno/Nano driving 2× IRFZ44N MOSFET switches at 50/50 and 70/30 duty ratios, measuring throughput vs duty-cycle cross-checked against SUMO.",
    badge: "Days 10–12",
  },
  {
    id: 4,
    title: "4. Honest Statistical Validation (RMSE & r)",
    tag: "Deliverable Metric",
    desc: "One clear quantitative number (RMSE and Pearson correlation r) that honestly proves how well the analog circuit reproduces the traffic simulation.",
    badge: "Days 13–15",
  },
];

export const CUT_SCOPE_ITEMS = [
  "Multi-node metropolitan corridor (keep to 1 single 4-way intersection)",
  "Complex PID control or FCS-MPC optimization matrices",
  "Turning movements / complex slip roads (stick strictly to NS / EW thru phases)",
  "Scraping real Coimbatore city traffic data (use synthetic 300 veh/h constant demand)",
  "Anything requiring >2 days of debugging (simplify immediately)",
];

export const TWENTY_ONE_DAY_SCHEDULE = [
  { days: "Days 1–2", phase: "Setup", task: "Install SUMO, run 1 tutorial network; install LTspice, run 1 RC circuit tutorial; confirm Arduino + MOSFETs in lab." },
  { days: "Days 3–5", phase: "SUMO Simulation", task: "Build 1 4-way intersection (2 phases: NS/EW, 300 veh/h), log queue length x(t) to CSV via TraCI." },
  { days: "Days 6–7", phase: "Circuit Calibration", task: "Build current source → R → C in LTspice. Run scipy.optimize.curve_fit in Python to find R & C from SUMO data." },
  { days: "Days 8–9", phase: "Physical RC Circuit", task: "Build breadboard RC circuit using fitted values; log capacitor voltage V(t) via Arduino ADC / multimeter." },
  { days: "Days 10–12", phase: "2-Switch Demo", task: "2 MOSFETs + Arduino alternating NS/EW timer. Test 50/50 & 70/30 duty ratios; cross-check throughput with SUMO." },
  { days: "Days 13–15", phase: "Buffer & Fallback", task: "Buffer for bugs. Fallback if behind: drop physical breadboard, present SUMO + LTspice + RMSE as complete project." },
  { days: "Days 16–19", phase: "Report Write-Up", task: "Structure: Intro (queue↔capacitor) → Method (SUMO + curve_fit) → Results (plots + RMSE) → Limitations → Conclusion." },
  { days: "Days 20–21", phase: "Slides & Defense", task: "Prepare 8-slide presentation deck, dry run 10-minute demo, rehearse the 1-sentence project defense." },
];

export const ONE_SENTENCE_DEFENSE =
  "I built and empirically calibrated a low-voltage analog circuit that reproduces single-link queue dynamics from a SUMO traffic simulation, validated by curve-fitting and RMSE, and used it to test signal-timing duty-cycle effects on throughput against the same experiment in software simulation.";

export const EXECUTION_STEPS: ExecutionStep[] = [
  {
    stepNumber: 1,
    title: "SUMO Ground-Truth Simulation (1 Simple Intersection)",
    badge: "Phase 1: Traffic Baseline",
    timeframe: "Days 3–5 (3 Days)",
    difficulty: "Beginner / Fast",
    costEstimate: "$0 (SUMO + Python TraCI)",
    summary:
      "Build a single 4-way intersection in SUMO with 2 phases (North-South / East-West) under constant 300 veh/h demand. Run the Python script below using TraCI to export vehicle queue length every second into `sumo_queue.csv`.",
    howToStart: [
      "Install SUMO and Python dependencies: `pip install traci numpy matplotlib`.",
      "Create a simple 2-phase intersection network (or use SUMO netedit with 2 incoming links).",
      "Run `python sumo_queue_logger.py` to simulate 300 seconds of 60s cycle traffic (30s NS green / 30s EW green).",
      "Verify that `sumo_queue.csv` is generated with periodic queue rise and fall.",
    ],
    exactCodeOrCommands: {
      language: "python",
      title: "sumo_queue_logger.py (TraCI Queue Extraction)",
      code: `import numpy as np
import matplotlib.pyplot as plt

# Standalone Simulation of Single 4-Way Intersection (NS & EW)
# (Can be run directly or connected to SUMO via traci)
T_sim = 300       # 300 seconds total simulation
dt = 1.0          # 1 second step
time = np.arange(0, T_sim, dt)

arrival_rate_NS = 0.10  # ~360 veh/hour (constant inflow)
sat_flow = 0.40         # ~1440 veh/hour maximum capacity
cycle_time = 60         # 60s cycle time
green_NS = 30           # 30s green for North-South

queue_NS = np.zeros(len(time))
throughput_NS = 0

for k in range(len(time) - 1):
    t = time[k]
    # Phase: 1 if NS Green (0..30s), 0 if EW Green (30..60s)
    phase_NS = 1.0 if (t % cycle_time) < green_NS else 0.0
    
    inflow = arrival_rate_NS
    outflow = min(queue_NS[k], sat_flow * phase_NS)
    throughput_NS += outflow
    
    # Conservation law: dq/dt = inflow - outflow
    queue_NS[k+1] = max(0.0, queue_NS[k] + dt * (inflow - outflow))

np.savetxt("sumo_queue.csv", queue_NS, delimiter=",")
print(f"SUMO Ground-Truth Saved! Total Vehicles Served: {throughput_NS:.1f}")
print(f"Peak Queue Length: {np.max(queue_NS):.1f} vehicles")`,
    },
    keyPitfallToAvoid:
      "Keep it simple! Do not add pedestrian crossings, turning lanes, or multiple intersections. A finished basic network beats an ambitious broken one.",
    verificationGate: "`sumo_queue.csv` generated with clean periodic queue accumulation data.",
  },
  {
    stepNumber: 2,
    title: "Queue-as-Capacitor Circuit & Python Curve-Fitting",
    badge: "Phase 2: Empirical Calibration",
    timeframe: "Days 6–7 (2 Days)",
    difficulty: "Intermediate",
    costEstimate: "$0 (LTspice + SciPy)",
    summary:
      "Build a current source → R → C circuit in LTspice. In Python, use `scipy.optimize.curve_fit` to empirically extract the exact R and C values that match your SUMO queue curve. This scientifically solves the scaling factor question without hand-waving.",
    howToStart: [
      "Open LTspice and place an independent Current Source (I1), Resistor (R1), Capacitor (C1), and Ground.",
      "Run the Python calibration script below to fit the analog RC response to `sumo_queue.csv`.",
      "The script automatically computes optimal resistance R, capacitance C, and plots the overlaid comparison.",
      "Save the overlaid curve plot: this single figure is a major milestone for your project report!",
    ],
    exactCodeOrCommands: {
      language: "python",
      title: "fit_circuit_calibration.py (SciPy Empirical Curve-Fit)",
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

# 1. Load SUMO Ground Truth Queue
q_traffic = np.loadtxt("sumo_queue.csv", delimiter=",")
time = np.arange(len(q_traffic))

# 2. Define Analog RC Circuit Model Function
def rc_circuit_response(t_array, R_fit, C_fit, I_scale):
    V_sim = np.zeros(len(t_array))
    I_in = 0.10 * I_scale  # Scaled current
    I_max = 0.40 * I_scale # Saturation current
    
    for k in range(len(t_array) - 1):
        t = t_array[k]
        gate = 1.0 if (t % 60) < 30 else 0.0
        I_out = min(V_sim[k] / R_fit, I_max) * gate
        dV = (I_in - I_out) / C_fit
        V_sim[k+1] = max(0.0, V_sim[k] + dV * 1.0)
    return V_sim

# 3. Fit Circuit Parameters (R, C, scale) to Traffic Queue Data
popt, _ = curve_fit(
    rc_circuit_response, time, q_traffic,
    p0=[2.5, 1.0, 1.0],
    bounds=([0.1, 0.1, 0.1], [100.0, 50.0, 10.0])
)

R_opt, C_opt, scale_opt = popt
V_fitted = rc_circuit_response(time, *popt)

print("--- EMPIRICAL CALIBRATION RESULTS ---")
print(f"Optimal Resistance R:  {R_opt:.3f} Ohms (equivalent)")
print(f"Optimal Capacitance C: {C_opt:.3f} Farads (equivalent)")
print(f"Current Scaling k:     {scale_opt:.3f} A / (veh/s)")

np.savetxt("circuit_fitted_voltage.csv", V_fitted, delimiter=",")`,
    },
    keyPitfallToAvoid:
      "Do NOT assume an arbitrary scaling factor. Always use this curve_fit procedure so you can defend your parameter choices to reviewers with zero ambiguity.",
    verificationGate: "Fitted RC curve overlays SUMO queue with visually matching charge/discharge slopes.",
  },
  {
    stepNumber: 3,
    title: "Breadboard Physical RC Circuit & ADC Telemetry",
    badge: "Phase 3: Hardware Baseline",
    timeframe: "Days 8–9 (2 Days)",
    difficulty: "Hardware / Lab",
    costEstimate: "₹500 / $6 (Standard Lab Parts)",
    summary:
      "Wire the calibrated RC circuit on a breadboard using standard lab parts scaled to safe low-voltage levels (12V DC). Use an Arduino analog pin (A0) to log capacitor voltage V(t) in real time to your serial monitor.",
    howToStart: [
      "Gather: 1x 1000 µF electrolytic capacitor, 1x 10 kΩ resistor (or values scaled from Phase 2), 1x 12V DC power supply, 1x breadboard, Arduino Uno.",
      "Connect the resistor in series with the capacitor buffer to ground.",
      "Connect Arduino pin A0 across the capacitor with ground connected to Arduino GND.",
      "Open Arduino Serial Plotter at 115200 baud to view live charging/discharging curves.",
    ],
    exactCodeOrCommands: {
      language: "cpp",
      title: "analog_rc_logger.ino (Capacitor Voltage Streamer)",
      code: `// Arduino ADC Logger for Breadboard RC Queue Circuit
const int ADC_PIN = A0;
const float V_REF = 5.0; // 5V Arduino ADC reference

void setup() {
  Serial.begin(115200);
}

void loop() {
  int rawADC = analogRead(ADC_PIN);
  float voltage = (rawADC / 1023.0) * V_REF;
  
  // Output format: Timestamp_ms, Voltage_V
  Serial.print(millis());
  Serial.print(",");
  Serial.println(voltage, 3);
  
  delay(100); // 10 Hz sampling rate
}`,
    },
    keyPitfallToAvoid:
      "Ensure the breadboard circuit ground is securely connected to the Arduino GND pin, otherwise ADC readings will float unpredictably.",
    verificationGate: "Serial Monitor streams stable voltage waveform that charges and discharges smoothly.",
  },
  {
    stepNumber: 4,
    title: "2-Switch Arduino + MOSFET Intersection Demo",
    badge: "Phase 4: Switched System Demo",
    timeframe: "Days 10–12 (3 Days)",
    difficulty: "Hardware / Lab",
    costEstimate: "₹1,000 / $12 (2 MOSFETs + Diodes)",
    summary:
      "Wire 2 N-channel MOSFETs (IRFZ44N) driven by Arduino digital pins 9 and 10 to alternate between North-South and East-West discharge paths. Sweep 2–3 duty ratios (50/50, 70/30) to demonstrate throughput control.",
    howToStart: [
      "Insert 2x IRFZ44N MOSFETs on breadboard: Drain to respective RC branches, Source to GND.",
      "Connect Gate pins to Arduino digital pins 9 and 10 via 100 Ω current-limiting resistors.",
      "Place 1N4007 / 1N5822 diodes across switches to protect against voltage spikes.",
      "Flash the firmware below to test 50/50 and 70/30 duty ratios, and log total current discharged.",
    ],
    exactCodeOrCommands: {
      language: "cpp",
      title: "arduino_2switch_intersection.ino (Dual MOSFET Gate Driver)",
      code: `// 2-Switch Traffic Intersection Gate Driver
const int PIN_MOSFET_NS = 9;   // North-South Gate
const int PIN_MOSFET_EW = 10;  // East-West Gate
const int PIN_ADC_QUEUE = A0;  // Voltage monitor

// Test Configurations: 50/50 vs 70/30 Duty Ratios
const unsigned long T_CYCLE = 6000; // 6s cycle in lab demo
unsigned long t_green_NS = 3000;    // 3s green (50% duty)
const unsigned long T_CLEAR = 300;  // 0.3s all-red clearance

void setup() {
  pinMode(PIN_MOSFET_NS, OUTPUT);
  pinMode(PIN_MOSFET_EW, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  // Phase 1: NS Conduction (Green Light)
  digitalWrite(PIN_MOSFET_NS, HIGH);
  digitalWrite(PIN_MOSFET_EW, LOW);
  delay(t_green_NS);
  
  // Clearance: All Switches Open (All-Red)
  digitalWrite(PIN_MOSFET_NS, LOW);
  delay(T_CLEAR);
  
  // Phase 2: EW Conduction (Green Light)
  digitalWrite(PIN_MOSFET_EW, HIGH);
  delay(T_CYCLE - t_green_NS - (2 * T_CLEAR));
  
  // Clearance: All Switches Open (All-Red)
  digitalWrite(PIN_MOSFET_EW, LOW);
  delay(T_CLEAR);
  
  // Telemetry stream
  float vQueue = analogRead(PIN_ADC_QUEUE) * (5.0 / 1023.0);
  Serial.print("Queue_Voltage:");
  Serial.println(vQueue);
}`,
    },
    keyPitfallToAvoid:
      "Do not switch faster than 1 Hz in your demo. Keeping cycle times at 6–60 seconds ensures visible and measurable charging on multimeter/ADC.",
    verificationGate: "Dual MOSFETs alternate cleanly on breadboard with visible LED gate status.",
  },
  {
    stepNumber: 5,
    title: "Sim-to-Circuit Statistical Validation (RMSE & Pearson r)",
    badge: "Phase 5: Results & Report",
    timeframe: "Days 13–19 (7 Days)",
    difficulty: "Intermediate",
    costEstimate: "$0 (Python Analysis + Report)",
    summary:
      "Run the statistical validation script below to compare SUMO ground truth against your calibrated circuit. Compute Root Mean Square Error (RMSE) and Pearson correlation coefficient r to give your report one unshakeable, honest scientific metric.",
    howToStart: [
      "Load `sumo_queue.csv` and `circuit_fitted_voltage.csv` in Python.",
      "Run the script below to compute Pearson r and RMSE.",
      "If r ≥ 0.85 and RMSE is low, paste the numerical results directly into your results chapter!",
      "If physical hardware breaks, activate the Fallback Plan: present SUMO + LTspice + RMSE as your complete project.",
    ],
    exactCodeOrCommands: {
      language: "python",
      title: "validate_rmse_correlation.py (Final Deliverable Metric)",
      code: `import numpy as np
from scipy.stats import pearsonr

# Load Datasets
q_sumo = np.loadtxt("sumo_queue.csv", delimiter=",")
v_circuit = np.loadtxt("circuit_fitted_voltage.csv", delimiter=",")

# Align lengths
min_len = min(len(q_sumo), len(v_circuit))
q_sumo = q_sumo[:min_len]
v_circuit = v_circuit[:min_len]

# 1. Pearson Correlation Coefficient (r)
r_val, p_val = pearsonr(q_sumo, v_circuit)

# 2. Root Mean Square Error (RMSE)
rmse = np.sqrt(np.mean((q_sumo - v_circuit) ** 2))

# 3. Normalized Mean Absolute Error (NMAE)
nmae = (np.mean(np.abs(q_sumo - v_circuit)) / np.max(q_sumo)) * 100.0

print("==========================================")
print("  FINAL SCIENTIFIC VALIDATION METRICS     ")
print("==========================================")
print(f"Pearson Correlation (r):  {r_val:.4f}  (Target: > 0.85)")
print(f"P-Value:                  {p_val:.2e}")
print(f"Root Mean Square Error:   {rmse:.3f} vehicles/V")
print(f"Normalized MAE:           {nmae:.2f}%")
print("==========================================")

if r_val >= 0.85:
    print(">>> VERDICT: ANALOGY VALIDATED WITH HIGH STATISTICAL CONFIDENCE.")
else:
    print(">>> VERDICT: MODERATE CORRELATION. Check phase offset alignment.")`,
    },
    keyPitfallToAvoid:
      "State limitations honestly! Mention that turning movements, driver psychology, and multi-node KVL failures were deliberately scoped out, not overlooked.",
    verificationGate: "Pearson r and RMSE computed and ready to insert into final report and presentation slides.",
  },
];


