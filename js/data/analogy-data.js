/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Analogy System Data: Seven Levels of Analogy & Complete 13-Row Matrix
 */

window.ANALOGY_DATA = {
  sevenLevels: [
    {
      level: 1,
      name: "TOPOLOGY",
      traffic: "Intersections → Nodes, Roads → Branches / Links",
      electrical: "Buses → Nodes, Transmission lines → Branches",
      status: "established",
      badgeText: "STRONG / ESTABLISHED",
      summary: "Direct mathematical equivalence via algebraic graph theory G=(V,E). Incidence matrices A and Laplacian matrices L apply identically.",
      mathMapping: "G = (V, E), \\quad A_{ij} = \\begin{cases} +1 & \\text{if node } i \\text{ is start of branch } j \\\\ -1 & \\text{if node } i \\text{ is end of branch } j \\\\ 0 & \\text{otherwise} \\end{cases}",
      assumptions: [
        "Network is planar or near-planar directed graph",
        "Intersections have well-defined spatial boundaries",
        "Roadways possess fixed physical lengths and connectivity"
      ],
      limitations: [
        "Does not capture complex grade-separated multi-level interchanges without dummy node expansion",
        "Graph topology alone conveys zero dynamic flow behavior"
      ],
      failureCriteria: "If physical road geometry cannot be represented by directed edges without circular non-physical dependencies."
    },
    {
      level: 2,
      name: "FLOW",
      traffic: "Vehicles / macroscopic traffic flow rate q (veh/h)",
      electrical: "Electric current I (amperes / Coulombs/s)",
      status: "plausible",
      badgeText: "PLAUSIBLE",
      summary: "Continuity equation and flow conservation at nodes: sum of inflows equals sum of outflows plus accumulation rate.",
      mathMapping: "\\sum_{e \\in \\text{In}(v)} q_e(t) - \\sum_{e \\in \\text{Out}(v)} q_e(t) = \\frac{d x_v(t)}{dt} \\quad \\Longleftrightarrow \\quad \\sum I_{\\text{in}} - \\sum I_{\\text{out}} = \\frac{dQ_v}{dt}",
      assumptions: [
        "Vehicles are conserved (no spontaneous vehicle generation or destruction inside links)",
        "Flow is treated as a continuous fluid approximation at macro scale"
      ],
      limitations: [
        "Vehicles are discrete, indivisible packets, unlike near-continuous electron flow",
        "Vehicle flow has a hard upper ceiling (capacity q_max), whereas electrical wire current can exceed nominal ratings until thermal destruction"
      ],
      failureCriteria: "If discrete vehicle arrival variance invalidates continuous flow conservation at short time scales (<5 seconds)."
    },
    {
      level: 3,
      name: "POTENTIAL",
      traffic: "Travel-time potential / Generalized travel cost \\Phi (seconds or monetary cost)",
      electrical: "Voltage potential V (volts / Joules/Coulomb)",
      status: "uncertain",
      badgeText: "REQUIRES FORMAL TESTING",
      summary: "Flow tends to move from high potential (origin/upstream) to low potential (destination/sink), but human drivers do not follow Ohm's law.",
      mathMapping: "\\Delta \\Phi_{ij} = \\Phi_i - \\Phi_j = f(q_{ij}, c_{ij}) \\quad \\Longleftrightarrow \\quad \\Delta V_{ij} = V_i - V_j = I_{ij} Z_{ij}",
      assumptions: [
        "Drivers act as rational cost-minimizers seeking minimum travel time (Wardrop equilibrium)",
        "Travel potential is monotonic with congestion"
      ],
      limitations: [
        "Traffic potential field is not conservative (line integrals along closed loops can be non-zero due to one-way streets and asymmetric turning penalties)",
        "Kirchhoff's Voltage Law (sum of voltage drops around any closed loop is zero) is violated in traffic unless artificial potential fields are enforced"
      ],
      failureCriteria: "If the non-conservative curl of travel cost prevents a unique potential field from being established mathematically."
    },
    {
      level: 4,
      name: "IMPEDANCE",
      traffic: "Travel resistance / Congestion cost (delay per unit flow)",
      electrical: "Resistance R and reactance X (Impedance Z = R + jX)",
      status: "plausible",
      badgeText: "POTENTIALLY USEFUL",
      summary: "Road travel time increases with flow. Modeled through non-linear BPR functions or triangular fundamental diagrams.",
      mathMapping: "t_e(q_e) = t_0 \\left[ 1 + \\alpha \\left( \\frac{q_e}{c_e} \\right)^\\beta \\right] \\quad \\text{vs.} \\quad R_{\\text{eff}} = \\frac{\\Delta V}{I}",
      assumptions: [
        "Link impedance increases monotonically with flow up to capacity",
        "Free-flow travel time acts as baseline series resistance"
      ],
      limitations: [
        "Electrical resistors are linear (or thermal non-linear); traffic impedance exhibits sharp asymptotic vertical barrier at capacity",
        "Electrical reactance stores AC magnetic/electric energy; traffic 'inertial delay' requires distinct definition"
      ],
      failureCriteria: "If the hyper-congested regime (where flow drops while density rises) produces negative apparent differential resistance that destabilizes classical load-flow solvers."
    },
    {
      level: 5,
      name: "ENERGY / STORAGE",
      traffic: "Queue accumulation / Stored vehicles in roadway spatial buffer",
      electrical: "Electrostatic energy in capacitors (E = 1/2 C V^2) or magnetic energy in inductors",
      status: "uncertain",
      badgeText: "REQUIRES REFORMULATION",
      summary: "Stored vehicles on a road link act like charge stored in a capacitor. Maximum storage is bounded by road length and jam density.",
      mathMapping: "x_e(k) = \\int (q_{\\text{in}}(t) - q_{\\text{out}}(t)) dt \\le L_e \\cdot k_{\\text{jam}} \\quad \\Longleftrightarrow \\quad Q = C V",
      assumptions: [
        "Road link acts as a finite spatial reservoir",
        "Accumulation rate directly governs downstream departure speed"
      ],
      limitations: [
        "Traffic energy is non-recoverable: wasted fuel and idling driver time cannot be discharged back into the system like capacitor charge",
        "Vehicle kinetic energy is dissipated into brakes as heat; it does not sustain network resonance"
      ],
      failureCriteria: "If energy conservation cannot be rigorously defined without equating irreversibly lost travel time to recoverable stored energy."
    },
    {
      level: 6,
      name: "SWITCHING",
      traffic: "Traffic signal phases (green/yellow/red) alternating permitted movements",
      electrical: "Semiconductor switching devices (IGBTs, MOSFETs) controlling converter topologies",
      status: "supported",
      badgeText: "HIGH-INTEREST RESEARCH AREA",
      summary: "Signals act as high-frequency topology switches. Conduction permits flow; blocking forces zero current. Incurs switching losses.",
      mathMapping: "q_{\\text{out}}(k) = u(k) \\cdot \\min\\{q_{\\text{demand}}(k), q_{\\text{sat}}, c_{\\text{downstream}}\\}, \\quad u(k) \\in \\{0, 1\\}",
      assumptions: [
        "Signal states are discrete binary control inputs",
        "Switching events are subject to minimum dwell times and safety clearance (yellow/all-red)"
      ],
      limitations: [
        "Semiconductors switch in nanoseconds; traffic signals switch over seconds (lost green time)",
        "Switching frequency is physically constrained by vehicle stopping distances and safety clearance"
      ],
      failureCriteria: "If human perception-reaction time and vehicle acceleration transients dominate the switching interval, rendering discrete-time averaging invalid."
    },
    {
      level: 7,
      name: "DYNAMIC SYSTEM",
      traffic: "Hybrid dynamic transportation network with switched piecewise-affine queues",
      electrical: "Switched dynamic electrical network / multi-converter power system",
      status: "hypothesis",
      badgeText: "CORE HYPOTHESIS",
      summary: "The master hypothesis: the entire urban network is a switched dynamical system governed by discrete state-space equations.",
      mathMapping: "x(k+1) = f(x(k), u(k), d(k)), \\quad u(k) \\in \\mathcal{U}_{\\text{admissible}}",
      assumptions: [
        "System evolution can be discretized into regular control epochs \\Delta t (1–5 s)",
        "State vector x(k) captures sufficient statistics to predict future congestion"
      ],
      limitations: [
        "Stochastic human driver behavior introduces parameter uncertainty",
        "Large-scale network matrices have state-dependent, switched structural graphs"
      ],
      failureCriteria: "If model mismatch between predicted state trajectory and actual micro-simulation exceeds 35% under standard disturbance testing."
    }
  ],

  analogyMatrix: [
    {
      traffic: "Road",
      electrical: "Transmission line / Distribution feeder",
      mapping: "Link e = (u, v) with spatial length L and impedance Z_e",
      validity: "SUPPORTED",
      statusBadge: "badge-supported",
      literature: "Established in network flow theory (Ford-Fulkerson, 1956)",
      newInfo: "Dynamic loading formulation coupled to downstream queue backpressure",
      researchStatus: "Complete"
    },
    {
      traffic: "Intersection",
      electrical: "Bus / Node",
      mapping: "Sum of flows equals zero (with accumulation node storage term)",
      validity: "SUPPORTED",
      statusBadge: "badge-supported",
      literature: "Universal graph representation",
      newInfo: "Multi-terminal internal switching matrix with phase-dependent admittance",
      researchStatus: "Complete"
    },
    {
      traffic: "Traffic Flow",
      electrical: "Electric Current (I)",
      mapping: "q = \\Delta N / \\Delta t (vehicles per hour)",
      validity: "PLAUSIBLE",
      statusBadge: "badge-plausible",
      literature: "Fluid analogies (Lighthill & Whitham, 1955; Richards, 1956)",
      newInfo: "Strict ceiling constraint; discrete packet quantization at low flows",
      researchStatus: "Active"
    },
    {
      traffic: "Traffic Demand",
      electrical: "Electrical Load / Demand (P, Q)",
      mapping: "Origin generation rate d_i(t) (veh/h injected into network)",
      validity: "SUPPORTED",
      statusBadge: "badge-supported",
      literature: "Standard origin-destination demand matrices",
      newInfo: "Demand-response equivalent: routing incentives as price-elastic demand",
      researchStatus: "Complete"
    },
    {
      traffic: "Traffic Source",
      electrical: "Power Generator / Grid Infeed",
      mapping: "Boundary node injecting external vehicle volume into grid",
      validity: "SUPPORTED",
      statusBadge: "badge-supported",
      literature: "Source nodes in transportation planning",
      newInfo: "Ramp metering equivalent to generator governor control",
      researchStatus: "Complete"
    },
    {
      traffic: "Road Capacity",
      electrical: "Thermal / Line Current Limit (MVA rating)",
      mapping: "q_max = v_f \\cdot k_crit (saturation flow rate)",
      validity: "SUPPORTED",
      statusBadge: "badge-supported",
      literature: "Highway Capacity Manual (HCM)",
      newInfo: "Dynamic capacity reduction due to weather, incidents, and turning conflicts",
      researchStatus: "Complete"
    },
    {
      traffic: "Queue",
      electrical: "Stored Charge (Q = C \\cdot V)",
      mapping: "q_queue(t) = \\int (q_in - q_out) dt vehicles waiting",
      validity: "UNCERTAIN",
      statusBadge: "badge-uncertain",
      literature: "Point queue and spatial queue models (Daganzo, 1994)",
      newInfo: "Non-linear capacitor with hard saturation and irreversible discharge",
      researchStatus: "Under investigation"
    },
    {
      traffic: "Traffic Accumulation",
      electrical: "Stored Electrostatic Energy (1/2 C V^2)",
      mapping: "Total vehicles currently on network links: N(t) = sum(x_e)",
      validity: "WEAK",
      statusBadge: "badge-weak",
      literature: "Macroscopic Fundamental Diagram (MFD) (Geroliminis & Daganzo, 2008)",
      newInfo: "Energy is not recoverable; analogy must be reformulated as exergy loss",
      researchStatus: "Reformulation required"
    },
    {
      traffic: "Bottleneck",
      electrical: "High-Impedance / Congested Line",
      mapping: "Link where demand exceeds capacity: d_e > c_e",
      validity: "SUPPORTED",
      statusBadge: "badge-supported",
      literature: "Vickrey bottleneck model (1969)",
      newInfo: "N-1 contingency sensitivity ranking identifying critical bottlenecks",
      researchStatus: "Complete"
    },
    {
      traffic: "Signal Phase",
      electrical: "Semiconductor Switching State S in {0, 1}",
      mapping: "Binary gate control u_m(t) governing permitted directional paths",
      validity: "SUPPORTED",
      statusBadge: "badge-supported",
      literature: "Switched systems in control literature",
      newInfo: "Direct application of power electronic FCS-MPC optimization",
      researchStatus: "High-interest"
    },
    {
      traffic: "Traffic Route",
      electrical: "Parallel Feeder / Transmission Path",
      mapping: "Alternative topological path between origin O and destination D",
      validity: "PLAUSIBLE",
      statusBadge: "badge-plausible",
      literature: "Traffic assignment and route choice models",
      newInfo: "Tie-switch reconfiguration analogy for dynamic corridor balancing",
      researchStatus: "Active"
    },
    {
      traffic: "Network",
      electrical: "Power Grid (Transmission & Distribution)",
      mapping: "Interconnected multi-bus, multi-branch switching infrastructure",
      validity: "SUPPORTED",
      statusBadge: "badge-supported",
      literature: "Complex networks research (Watts & Strogatz, 1998)",
      newInfo: "Unified dynamic state-space representation with switching control",
      researchStatus: "Active"
    },
    {
      traffic: "Traffic Control",
      electrical: "Power Electronic Converter & Grid Control",
      mapping: "Real-time state feedback adjusting signal switching states",
      validity: "PLAUSIBLE",
      statusBadge: "badge-plausible",
      literature: "Max-Pressure control (Varaiya, 2013), SCOOT, SCATS",
      newInfo: "FCS-MPC incorporating switching losses and multi-step prediction horizons",
      researchStatus: "Active"
    }
  ]
};
