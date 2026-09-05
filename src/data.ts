/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Complete Research Data Architecture for the Deep Research Plan:
 * "Investigating Where and How Components of an Urban Traffic System
 * Can Be Represented by Power-Electronic Circuits and Switching Networks"
 */

export const SECTIONS = [
  { id: "title", label: "BRIEF", marker: "§0" },
  { id: "objectives", label: "GOALS", marker: "§1" },
  { id: "decision-matrix", label: "MAPPINGS", marker: "§2" },
  { id: "dimensional", label: "DIMENSIONS", marker: "§3" },
  { id: "math-models", label: "MATH", marker: "§4" },
  { id: "simulation-tools", label: "TOOLS", marker: "§5" },
  { id: "circuit-design", label: "CIRCUITS", marker: "§6" },
  { id: "hardware-bom", label: "HARDWARE", marker: "§7" },
  { id: "experiments", label: "BENCH", marker: "§8" },
  { id: "first-experiment", label: "5-NODE DEMO", marker: "§9" },
  { id: "risk-register", label: "RISKS", marker: "§10" },
  { id: "roadmap-budget", label: "ROADMAP", marker: "§11" },
  { id: "novelty-checklist", label: "NOVELTY", marker: "§12" },
  { id: "prior-art-patents", label: "PATENTS", marker: "§13" },
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
    mathematicalLink: "Y(t) = A^T \\cdot \\text{diag}(u_e(t) \\cdot g_e(x)) \\cdot A, \\quad u_e \\in \\{0,1\\}",
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
    mathematicalLink: "D = \\frac{T_g}{T_{\\text{cyc}}} \\Longleftrightarrow D = \\frac{T_{\\text{on}}}{T_s}, \\quad u(k) \\in \\mathcal{U}_{\\text{admissible}}",
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
    mathematicalLink: "C \\frac{dV_i}{dt} = \\sum I_{\\text{in}} - \\sum I_{\\text{out}} \\Longleftrightarrow k \\frac{dq_i}{dt} = a_i(t) - d_i(t)",
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
    mathematicalLink: "I_{\\text{src}}(t) = k \\cdot \\lambda(t) \\quad [\\text{Amperes}], \\quad I_{\\text{sink}} = \\frac{V_{\\text{exit}}}{R_{\\text{term}}}",
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
    mathematicalLink: "R_e = \\alpha T_e, \\quad I_e \\le I_{\\max} = k \\cdot C_e, \\quad v_L = L \\frac{dI}{dt}",
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
    mathematicalLink: "\\sum_{\\text{loop}} \\Delta V \\neq 0 \\quad (\\text{KVL Fails; Flow Continuity Preserved})",
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
    claim: "Physical 5-Node Benchtop Switching Emulator with Hardware Telemetry & Oscilloscope Capture",
    status: "novel" as const,
    note: "First physical proof-of-concept hardware testbed validating switched dynamic traffic analog under live electrical instrumentation.",
  },
];
