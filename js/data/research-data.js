/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Master Research Data Architecture (60 Topics Across 9 Modules)
 */

window.RESEARCH_DATA = {
  projectTitle: "Developing a Power-Systems and Power-Electronics Representation of an Urban Traffic Network",
  eyebrow: "RESEARCH PROGRAM · HYPOTHESIS UNDER VALIDATION",
  subtitle: "Investigating whether urban transportation networks can be represented as dynamically reconfigurable, power-system-inspired switching networks — and whether this representation provides useful new methods for modelling, analysis, control, optimization, and resilience.",
  statusSummary: {
    scientificValidity: { label: "Scientific validity", status: "Under investigation", state: "amber" },
    mathematicalUsefulness: { label: "Mathematical usefulness", status: "Under investigation", state: "amber" },
    computationalFeasibility: { label: "Computational feasibility", status: "Under investigation", state: "amber" },
    experimentalFeasibility: { label: "Experimental feasibility", status: "Planned", state: "gray" },
    scalability: { label: "Scalability", status: "Open question", state: "amber" },
    novelty: { label: "Novelty", status: "Prior-art investigation required", state: "amber" },
    patentability: { label: "Patentability", status: "Not established", state: "gray" }
  },

  modules: [
    {
      id: "foundation",
      title: "RESEARCH FOUNDATION",
      topics: [
        {
          id: "topic-1",
          num: "01",
          title: "Research Question",
          category: "foundation",
          classification: "source",
          status: "open",
          summary: "Can an urban road/traffic network be represented, modeled, analyzed, and controlled using concepts, structures, mathematical methods, and hardware architectures derived from Electrical Power Systems and Power Electronics?",
          content: `The primary question asks whether an urban transportation system can be described in an engineering language borrowed from high-voltage electric power grids and power electronic converters. The investigation focuses on developing the network representation first, without pre-determining congestion solutions or AI claims.`
        },
        {
          id: "topic-2",
          num: "02",
          title: "Original Concept",
          category: "foundation",
          classification: "hypothesis",
          status: "hypothesis",
          summary: "A small-town network mapped to an electrical network: roads as branches, intersections as buses, traffic signals as semiconductor switches, and vehicle flow as current.",
          content: `The original conceptual spark maps macroscopic traffic corridors to transmission lines with thermal/capacity limits, intersections to electrical buses obeying Kirchhoff's Current Law (flow conservation), and traffic signal phases to controllable semiconductor switching states.`
        },
        {
          id: "topic-3",
          num: "03",
          title: "Why It Is Interesting",
          category: "foundation",
          classification: "source",
          status: "plausible",
          summary: "Electrical networks possess mature mathematical tools for contingency analysis, cascading failure dynamics, state estimation, and finite-state switching control.",
          content: `Decades of power system engineering have produced robust formulations for N-1 contingency analysis, dynamic state estimation from sparse PMUs, optimal power flow (OPF), and finite-control-set model predictive control (FCS-MPC). If the mathematical structure transfers, these tools can address transportation resilience.`
        },
        {
          id: "topic-4",
          num: "04",
          title: "Scientific Criticism",
          category: "foundation",
          classification: "source",
          status: "uncertain",
          summary: "Falsification testing: Vehicles have autonomous driver agency, asymmetric speed-density non-linearities, and lack physical electromagnetic potential.",
          content: `Critical objections must be addressed: electrons obey physical field equations (Maxwell/Ohm/Kirchhoff) with instantaneous wave propagation; vehicles are discrete agents with human decision delays, routing habits, and non-monotonic flow-density relations (fundamental diagram). The analogy must not confuse metaphor with physical equivalence.`
        },
        {
          id: "topic-5",
          num: "05",
          title: "Research Philosophy",
          category: "foundation",
          classification: "source",
          status: "established",
          summary: "Do not start by optimizing traffic. Build and stress-test the representation first. Try to break the idea.",
          content: `The scientific workflow progresses strictly from: Representation → Modelling → Analysis → Validation → Scaling → Problem Discovery → Optimization → Control. The objective is to identify where the representation breaks down, what already exists in literature, and what genuine mathematical utility remains.`
        }
      ]
    },
    {
      id: "network-rep",
      title: "NETWORK REPRESENTATION",
      topics: [
        {
          id: "topic-6",
          num: "06",
          title: "Traffic Network",
          category: "network-rep",
          classification: "model",
          status: "established",
          summary: "Directed graph G=(V,E) where V is the set of intersections and E is the set of roadway links with finite capacity and storage.",
          content: `Physical representation of urban streets: intersections act as merge/diverge points; road links have spatial length L, lane count, free-flow speed v_f, jam density k_jam, and capacity q_max.`
        },
        {
          id: "topic-7",
          num: "07",
          title: "Power-System Analogy",
          category: "network-rep",
          classification: "hypothesis",
          status: "plausible",
          summary: "Bus admittance matrix Y_bus and branch power flows mapped to incidence matrices and flow impedance.",
          content: `Investigating whether network flow conservation can be formulated in a matrix structure analogous to nodal admittance equations: I_bus = Y_bus * V_bus.`
        },
        {
          id: "topic-8",
          num: "08",
          title: "Seven Levels of Analogy",
          category: "network-rep",
          classification: "model",
          status: "supported",
          summary: "Rigorous decomposition from Level 1 (Topology) to Level 7 (Dynamic Switching System).",
          content: `Categorizes the analogy into 7 hierarchical layers to prevent unscientific over-claiming. Topology and Flow are well-grounded; Potential and Energy require reformulation; Switching is high-interest.`
        },
        {
          id: "topic-9",
          num: "09",
          title: "Node / Branch / Switch Model",
          category: "network-rep",
          classification: "model",
          status: "hypothesis",
          summary: "Intersections as multi-terminal switching nodes with internal directional routing matrices.",
          content: `Each node i contains an internal switching matrix S_i(k) that selectively connects incoming branches e_in to outgoing branches e_out during specific phase intervals.`
        },
        {
          id: "topic-10",
          num: "10",
          title: "Small-Town Network",
          category: "network-rep",
          classification: "experiment",
          status: "active",
          summary: "A benchmark testbed of 7 intersections (J1–J7) and 10 arterial/collector roads.",
          content: `The initial sandbox network includes residential source zones, commercial sink zones, bottlenecks, and signalized intersections for testing equations without city-scale noise.`
        }
      ]
    },
    {
      id: "power-systems",
      title: "POWER SYSTEMS",
      topics: [
        {
          id: "topic-11",
          num: "11",
          title: "Traffic Load Flow",
          category: "power-systems",
          classification: "hypothesis",
          status: "plausible",
          summary: "Iterative non-linear solver determining steady-state link flows and nodal travel-time potentials.",
          content: `Can a formulation analogous to AC/DC power flow solve traffic equilibrium? Unlike static user equilibrium (Frank-Wolfe), traffic load flow accounts for downstream capacity bottlenecks and queue spillbacks.`
        },
        {
          id: "topic-12",
          num: "12",
          title: "Network Loading",
          category: "power-systems",
          classification: "model",
          status: "supported",
          summary: "Normalized link loading index: Loading = Flow / Capacity, incorporating density and downstream storage.",
          content: `Analogous to MVA line loading percentage in power grids. Critical threshold at 85% (amber) and 100% (overload/red).`
        },
        {
          id: "topic-13",
          num: "13",
          title: "Bottlenecks",
          category: "power-systems",
          classification: "model",
          status: "supported",
          summary: "Identification of transmission-constrained links that throttle network-wide throughput.",
          content: `In electrical systems, thermal line limits constrain generator dispatch. In traffic, narrow links or badly timed signals bottleneck upstream corridors.`
        },
        {
          id: "topic-14",
          num: "14",
          title: "Sensitivity Analysis",
          category: "power-systems",
          classification: "hypothesis",
          status: "plausible",
          summary: "Jacobian matrix sensitivity determining how incremental demand shifts propagate across link delays.",
          content: `Using partial derivatives ∂Delay_i / ∂Demand_j to identify critical vulnerabilities before congestion strikes.`
        },
        {
          id: "topic-15",
          num: "15",
          title: "N−1 Contingency Analysis",
          category: "power-systems",
          classification: "model",
          status: "supported",
          summary: "Simulating single-element outages (lane closure, signal fault) to evaluate network survival.",
          content: `Standard power grid reliability criteria applied to urban corridors to calculate post-contingency overload indices.`
        },
        {
          id: "topic-16",
          num: "16",
          title: "Network Reconfiguration",
          category: "power-systems",
          classification: "hypothesis",
          status: "plausible",
          summary: "Dynamic routing and phase alterations to re-route flows around saturated paths.",
          content: `Equivalent to distribution feeder reconfiguration using tie-switches to minimize I²R losses.`
        },
        {
          id: "topic-17",
          num: "17",
          title: "Cascading Congestion",
          category: "power-systems",
          classification: "hypothesis",
          status: "high-interest",
          summary: "Investigating whether queue spillbacks follow domino dynamics analogous to cascading blackout trips.",
          content: `When a road oversaturates, vehicles spill back into upstream intersections, blocking perpendicular flows and triggering a geometric cascade.`
        },
        {
          id: "topic-18",
          num: "18",
          title: "Network Protection",
          category: "power-systems",
          classification: "hypothesis",
          status: "open",
          summary: "Automated perimeter metering and gating to isolate saturated zones before gridlock occurs.",
          content: `Analogous to electrical distance relays and under-frequency load shedding: shedding inflow at boundaries to protect the urban core.`
        },
        {
          id: "topic-19",
          num: "19",
          title: "State Estimation",
          category: "power-systems",
          classification: "model",
          status: "plausible",
          summary: "Weighted Least Squares (WLS) state estimation combining noisy loop detectors, cameras, and GPS probes.",
          content: `Mathematical formulation: z = h(x) + e, estimating link density and queue counts from incomplete sensor observations.`
        },
        {
          id: "topic-20",
          num: "20",
          title: "Observability",
          category: "power-systems",
          classification: "model",
          status: "supported",
          summary: "Topological observability criteria: minimum sensor placement required for state estimation solvability.",
          content: `Determines which intersections and corridors must have sensors to prevent unobservable network islands.`
        }
      ]
    },
    {
      id: "power-electronics",
      title: "POWER ELECTRONICS",
      topics: [
        {
          id: "topic-21",
          num: "21",
          title: "Switching States",
          category: "power-electronics",
          classification: "model",
          status: "supported",
          summary: "Traffic signal phases represented as discrete switching vectors S in {0, 1}^M.",
          content: `A 4-way intersection has discrete allowable states S_1..S_4 representing permitted conflict-free directional movements.`
        },
        {
          id: "topic-22",
          num: "22",
          title: "Switching Networks",
          category: "power-electronics",
          classification: "model",
          status: "supported",
          summary: "Representing an entire multi-intersection urban grid as a topology-switching variable network.",
          content: `The effective network admittance matrix Y(t) switches discontinuously between finite configurations as signal phases change.`
        },
        {
          id: "topic-23",
          num: "23",
          title: "Pulse-Width Modulation (PWM)",
          category: "power-electronics",
          classification: "hypothesis",
          status: "plausible",
          summary: "Green split / duty cycle d = T_green / T_cycle as a PWM modulation index controlling average vehicle flow.",
          content: `Equivalent to a buck converter duty cycle: adjusting the average flow rate q_out = d * q_sat through periodic switching.`
        },
        {
          id: "topic-24",
          num: "24",
          title: "Modulation Strategies",
          category: "power-electronics",
          classification: "hypothesis",
          status: "open",
          summary: "Space-vector modulation vs carrier-based modulation for coordinated arterial signal offsets.",
          content: `Investigating whether multi-phase coordinated signal timing can be formulated as harmonic minimization in switching patterns.`
        },
        {
          id: "topic-25",
          num: "25",
          title: "Finite-Control-Set (FCS) Control",
          category: "power-electronics",
          classification: "hypothesis",
          status: "high-interest",
          summary: "Directly selecting discrete switching states without an intermediate continuous modulator.",
          content: `In power electronics, FCS evaluates every inverter switch combination directly. In traffic, each intersection evaluates permitted signal phases directly.`
        },
        {
          id: "topic-26",
          num: "26",
          title: "FCS-MPC",
          category: "power-electronics",
          classification: "model",
          status: "supported",
          summary: "Model Predictive Control selecting the optimal discrete signal state S*(k) minimizing predicted queue cost.",
          content: `Minimizes J = sum_{h=1}^{N_p} [ q(k+h)^T Q q(k+h) + delta_S^T R delta_S ] subject to minimum green and safety constraints.`
        },
        {
          id: "topic-27",
          num: "27",
          title: "Switching Optimization",
          category: "power-electronics",
          classification: "model",
          status: "supported",
          summary: "Balancing queue clearance against the penalty of frequent switching.",
          content: `Every phase switch incurs yellow/all-red lost clearance time; optimal control balances clearing green queues against lost switching time.`
        },
        {
          id: "topic-28",
          num: "28",
          title: "Switching Frequency",
          category: "power-electronics",
          classification: "model",
          status: "supported",
          summary: "Signal cycle frequency: trade-off between responsive queue service and lost capacity.",
          content: `High switching frequency increases responsiveness but wastes network capacity through startup delays and clearance intervals.`
        },
        {
          id: "topic-29",
          num: "29",
          title: "Switching Losses",
          category: "power-electronics",
          classification: "model",
          status: "supported",
          summary: "Lost time (yellow interval + all-red clearance + startup acceleration delay) as semiconductor switching loss.",
          content: `Exact equivalence: P_loss_switch = f_sw * E_loss in converters corresponds to Q_lost = f_cycle * (t_yellow + t_red + t_start) * q_sat in traffic.`
        },
        {
          id: "topic-30",
          num: "30",
          title: "Closed-Loop Control",
          category: "power-electronics",
          classification: "model",
          status: "established",
          summary: "Feedback loop measuring real-time queue states to dynamically adjust switching vectors.",
          content: `Replacing static pre-timed Webster signal plans with real-time state feedback control.`
        }
      ]
    },
    {
      id: "traffic-ctrl",
      title: "TRAFFIC CONTROL",
      topics: [
        {
          id: "topic-31",
          num: "31",
          title: "Signal Switching",
          category: "traffic-ctrl",
          classification: "model",
          status: "established",
          summary: "Phase transition rules, clearance intervals, and non-conflicting green allocations.",
          content: `Standard traffic engineering safety requirements (NEMA TS2 dual-ring logic) mapped to switching constraint sets.`
        },
        {
          id: "topic-32",
          num: "32",
          title: "Distributed Control",
          category: "traffic-ctrl",
          classification: "hypothesis",
          status: "plausible",
          summary: "Neighboring intersections communicating via consensus protocols without a central master computer.",
          content: `Nodes exchange queue and pressure estimates with immediate upstream/downstream neighbors to coordinate green waves.`
        },
        {
          id: "topic-33",
          num: "33",
          title: "Centralized Control",
          category: "traffic-ctrl",
          classification: "model",
          status: "supported",
          summary: "Global state optimization with heavy computational overhead and single point of failure risks.",
          content: `Evaluates scalability limits: centralized MPC becomes computationally intractable beyond 30–50 intersections.`
        },
        {
          id: "topic-34",
          num: "34",
          title: "Adaptive Control",
          category: "traffic-ctrl",
          classification: "literature",
          status: "established",
          summary: "Comparison with SCOOT, SCATS, and Max-Pressure traffic control frameworks.",
          content: `Benchmarking against established adaptive traffic systems to verify if power-electronics formulation adds genuine value.`
        },
        {
          id: "topic-35",
          num: "35",
          title: "Optimization",
          category: "traffic-ctrl",
          classification: "hypothesis",
          status: "open",
          summary: "Formulating network-wide delay, stops, and fuel consumption as quadratic cost functions.",
          content: `Evaluating whether multi-objective optimization can incorporate vehicle kinetic energy dissipation as an I²R loss equivalent.`
        }
      ]
    },
    {
      id: "modelling",
      title: "MATHEMATICAL MODELLING",
      topics: [
        {
          id: "topic-36",
          num: "36",
          title: "Mathematical Formulation",
          category: "modelling",
          classification: "model",
          status: "supported",
          summary: "Incidence matrix A, flow vector q, capacity vector c, and nodal queue conservation.",
          content: `State vector x(k) = [q_1(k), q_2(k), ..., q_E(k)]^T representing queues on each network branch.`
        },
        {
          id: "topic-37",
          num: "37",
          title: "Dynamic Model",
          category: "modelling",
          classification: "model",
          status: "supported",
          summary: "Non-linear discrete-time state equation x(k+1) = f(x(k), u(k), d(k)).",
          content: `State transition: queue at step k+1 equals queue at step k plus arrivals minus departures, bounded by downstream link storage.`
        },
        {
          id: "topic-38",
          num: "38",
          title: "Network-Flow Model",
          category: "modelling",
          classification: "model",
          status: "established",
          summary: "Flow conservation at nodes: sum of inflows equals sum of outflows plus rate of queue accumulation.",
          content: `Direct analogue to Kirchhoff's Current Law: sum(I_in) - sum(I_out) = dQ/dt (rate of charge accumulation).`
        },
        {
          id: "topic-39",
          num: "39",
          title: "Loading Model",
          category: "modelling",
          classification: "model",
          status: "supported",
          summary: "Non-linear link impedance functions: BPR curve and triangular fundamental diagram.",
          content: `Travel time t_e = t_0 * [1 + alpha * (q_e / c_e)^beta], representing non-linear resistance to traffic flow.`
        },
        {
          id: "topic-40",
          num: "40",
          title: "Switching Model",
          category: "modelling",
          classification: "model",
          status: "supported",
          summary: "Hybrid dynamical system with continuous queue states and discrete switching control modes.",
          content: `Formulated as a switched affine system: x_dot = A_sigma x + B_sigma u + d, where sigma in {1..M} represents active signal phase.`
        },
        {
          id: "topic-41",
          num: "41",
          title: "State-Space Model",
          category: "modelling",
          classification: "model",
          status: "supported",
          summary: "Matrices A, B, and disturbance matrix E with state and control inequality constraints.",
          content: `Constrained linear/piecewise-affine state-space: 0 <= x(k) <= x_jam, u(k) in {0, 1}^M, sum(u_conflicting) <= 1.`
        }
      ]
    },
    {
      id: "validation",
      title: "VALIDATION & SIMULATION",
      topics: [
        {
          id: "topic-42",
          num: "42",
          title: "Conventional Traffic Models",
          category: "validation",
          classification: "literature",
          status: "established",
          summary: "Cell Transmission Model (CTM), Lighthill-Whitham-Richards (LWR) PDE, and Webster fixed-time formulas.",
          content: `Standard reference baselines used to determine whether the proposed electrical framework offers any genuine predictive or control advantage.`
        },
        {
          id: "topic-43",
          num: "43",
          title: "Proposed Model",
          category: "validation",
          classification: "model",
          status: "hypothesis",
          summary: "The hybrid power-system switching network representation under test.",
          content: `Tested side-by-side against CTM and micro-simulation in identical demand and disturbance conditions.`
        },
        {
          id: "topic-44",
          num: "44",
          title: "Model Comparison",
          category: "validation",
          classification: "experiment",
          status: "active",
          summary: "Systematic comparison across 8 engineering dimensions: computation, dynamic capability, switching fidelity, etc.",
          content: `Empirical validation table identifying strengths (contingency analysis, switching optimization) and weaknesses (human driver stochasticity).`
        },
        {
          id: "topic-45",
          num: "45",
          title: "Simulation Architecture",
          category: "validation",
          classification: "model",
          status: "planned",
          summary: "Multi-tool pipeline: Python/NetworkX + SUMO + MATLAB/Simulink + PLECS/Simscape.",
          content: `SUMO generates realistic microscopic traffic; Python runs the graph model and TraCI interface; MATLAB/Simulink simulates FCS-MPC control.`
        },
        {
          id: "topic-46",
          num: "46",
          title: "Disturbance Testing",
          category: "validation",
          classification: "experiment",
          status: "active",
          summary: "Injecting lane closures, demand spikes, and sensor dropouts to evaluate model robustness.",
          content: `Testing whether the model predicts queue propagation and recovers from simulated accidents without numerical divergence.`
        },
        {
          id: "topic-47",
          num: "47",
          title: "Hardware Prototype",
          category: "validation",
          classification: "experiment",
          status: "planned",
          summary: "Physical micro-scaled EEE hardware testbed: LED signal heads, microcontrollers, and switching transistors.",
          content: `Clearly labelled 'ABSTRACT NETWORK VALIDATION' — demonstrating mathematical, simulated, and physical circuit isomorphism.`
        },
        {
          id: "topic-48",
          num: "48",
          title: "Hardware-in-the-Loop",
          category: "validation",
          classification: "experiment",
          status: "planned",
          summary: "Real microcontrollers executing FCS-MPC connected via CAN/Ethernet to a real-time SUMO traffic simulator.",
          content: `Hardware-in-the-Loop (HIL) testing verifies that control execution delays and packet losses do not destabilize the physical traffic controllers.`
        }
      ]
    },
    {
      id: "scaling",
      title: "SCALING & CASE STUDY",
      topics: [
        {
          id: "topic-49",
          num: "49",
          title: "5–15 Intersection Model",
          category: "scaling",
          classification: "experiment",
          status: "active",
          summary: "Small-town testbed: fast matrix computations, fully observable, ideal for fundamental theorem proofs.",
          content: `The current operational model: 7 intersections, 10 branches, 4 source zones, 3 sink zones.`
        },
        {
          id: "topic-50",
          num: "50",
          title: "25–50 Intersection Model",
          category: "scaling",
          classification: "model",
          status: "planned",
          summary: "Intermediate suburban grid: requires sparse matrix solvers and distributed consensus algorithms.",
          content: `Transition point where centralized MPC becomes computationally prohibitive and distributed agent-based controllers are necessary.`
        },
        {
          id: "topic-51",
          num: "51",
          title: "100+ Intersection Model",
          category: "scaling",
          classification: "model",
          status: "open",
          summary: "Metropolitan network: hierarchical decomposition into interconnected sub-grids (islanding).",
          content: `Explores whether metropolitan grids can be partitioned into autonomous sub-areas analogous to microgrid islands during extreme congestion.`
        },
        {
          id: "topic-52",
          num: "52",
          title: "Coimbatore Case Study",
          category: "scaling",
          classification: "source",
          status: "active",
          summary: "Avinashi Road corridor (Lakshmi Mills to Nava India): real-world arterial deployment testbed.",
          content: `Corridor analysis incorporating strict data provenance: Measured geometric widths, Published IRC capacities, Estimated peak flows, Assumed driver reactions.`
        },
        {
          id: "topic-53",
          num: "53",
          title: "Digital Twin Dashboard",
          category: "scaling",
          classification: "model",
          status: "planned",
          summary: "Real-time synchronization between physical road sensors and the power-system network model.",
          content: `Architecture: Real City Sensors → Data Acquisition → State Estimation → Model Prediction → FCS-MPC Control Action.`
        }
      ]
    },
    {
      id: "research",
      title: "RESEARCH, PATENTS & ROADMAP",
      topics: [
        {
          id: "topic-54",
          num: "54",
          title: "Existing Literature",
          category: "research",
          classification: "literature",
          status: "established",
          summary: "Comprehensive survey of fluid dynamics analogies, electrical resistor network models, and Max-Pressure control.",
          content: `Historical review: from Prigogine's gas kinetic theory to modern coupled EV-grid transportation-power formulations.`
        },
        {
          id: "topic-55",
          num: "55",
          title: "Research Gaps",
          category: "research",
          classification: "source",
          status: "supported",
          summary: "What is actually new? Combining power-electronics FCS-MPC with power-system N-1 contingency for urban networks.",
          content: `Existing models treat traffic as passive fluid or static graph. The genuine gap lies in modeling traffic signals as active semiconductor switches with switching loss penalties.`
        },
        {
          id: "topic-56",
          num: "56",
          title: "Patent Prior Art",
          category: "research",
          classification: "source",
          status: "active",
          summary: "Exhaustive prior-art search across USPTO, WIPO, EPO, and Indian Patent Office (IPO).",
          content: `Evaluates existing patents in adaptive traffic control, EV-grid coupling, and network routing. Includes mandatory legal disclaimer.`
        },
        {
          id: "topic-57",
          num: "57",
          title: "Novelty Assessment",
          category: "research",
          classification: "source",
          status: "supported",
          summary: "Rigorous self-scrutiny on 10 novelty questions: distinguishing true innovation from re-labeled classical traffic models.",
          content: `Concludes that graph flow and resistor routing are not novel. Novelty is restricted to the unified power-systems + power-electronics switching formulation.`
        },
        {
          id: "topic-58",
          num: "58",
          title: "Potential Applications",
          category: "research",
          classification: "hypothesis",
          status: "open",
          summary: "Emergency vehicle green corridors, EV charging network coordination, and perimeter disaster evacuation gating.",
          content: `Applications that naturally emerge from the network representation rather than being retrofitted.`
        },
        {
          id: "topic-59",
          num: "59",
          title: "Future Problems",
          category: "research",
          classification: "hypothesis",
          status: "open",
          summary: "Autonomous vehicle platooning as variable line reactances and mixed-traffic stochastic disturbances.",
          content: `Investigating how connected autonomous vehicles (CAVs) behave like flexible AC transmission systems (FACTS) devices.`
        },
        {
          id: "topic-60",
          num: "60",
          title: "Research Roadmap",
          category: "research",
          classification: "source",
          status: "active",
          summary: "Staged 13-step research timeline from Stage 0 (Prior Art) to Stage 12 (Publication) & Stage 13 (Patentability).",
          content: `Structured experimental roadmap with clear gates, milestones, failure criteria, and deliverables.`
        }
      ]
    }
  ]
};
