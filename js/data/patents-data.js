/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Patent Prior Art Database: Multi-Jurisdiction Searches & Infringement Risk Ratings
 */

window.PATENTS_DATA = {
  disclaimer: "Preliminary research assessment only. Not formal legal counsel or patent attorney opinion. Prepared for scientific novelty evaluation.",
  patents: [
    {
      patentNumber: "US9852631B2",
      title: "Decentralized traffic signal control system and method using backpressure routing",
      applicant: "The Regents of the University of California",
      priorityDate: "2013-09-18",
      jurisdiction: "USPTO (United States)",
      problem: "Inefficient fixed-time and centralized traffic control unable to adapt to stochastic urban network fluctuations without global origin-destination information.",
      solution: "Local distributed controllers at each intersection calculate vehicle queue differentials (pressure) across upstream and downstream links to select active signal phase.",
      relevantClaims: "Claim 1: A method comprising receiving queue measurements from sensors on adjacent road links, computing a differential pressure metric, and actuating signal switches to maximize throughput.",
      similarity: "High similarity to decentralized signal selection. Uses queue backpressure analogous to flow potential.",
      difference: "Does not model traffic as an electrical switching circuit, neglects semiconductor switching losses (lost green time), and does not use FCS-MPC with multi-step prediction horizons.",
      riskLevel: "MEDIUM",
      riskBadge: "risk-medium"
    },
    {
      patentNumber: "US10410521B2",
      title: "Coordinated control of traffic signals and electric power distribution networks",
      applicant: "Siemens Aktiengesellschaft",
      priorityDate: "2016-04-12",
      jurisdiction: "USPTO / EPO",
      problem: "High penetration of electric vehicle charging creates localized transformer overloads and power distribution voltage dips coincident with peak traffic congestion.",
      solution: "A joint supervisory system that coordinates traffic signal timing to throttle vehicle arrivals at EV charging plazas based on distribution grid transformer thermal headroom.",
      relevantClaims: "Claim 1: System comprising an electrical distribution grid interface, a traffic signal controller interface, and an optimization processor adjusting traffic green splits in response to electrical feeder loading.",
      similarity: "Brings power systems and traffic signals into the same computational loop.",
      difference: "Treats traffic and power systems as two separate physical infrastructures coupled by EV charging, whereas our framework represents traffic itself using the mathematical language of power systems.",
      riskLevel: "LOW",
      riskBadge: "risk-low"
    },
    {
      patentNumber: "EP3155590B1",
      title: "Adaptive traffic flow control using dynamic network impedance calculation",
      applicant: "TomTom Traffic B.V.",
      priorityDate: "2014-06-11",
      jurisdiction: "EPO (Europe)",
      problem: "Navigation routing algorithms route too many vehicles onto minor residential side streets, causing neighborhood gridlock.",
      solution: "Calculates dynamic network link impedances based on real-time probe vehicle speeds and adjusts route recommendations to balance network loading.",
      relevantClaims: "Claim 1: Method for calculating dynamic routing costs using resistive network flow approximations across a directed road graph.",
      similarity: "Uses electrical impedance analogy for routing travel time calculation.",
      difference: "Focuses entirely on navigation route guidance; does not model or control intersection signal switching states, and does not implement power electronics MPC.",
      riskLevel: "LOW",
      riskBadge: "risk-low"
    },
    {
      patentNumber: "IN201941028345A",
      title: "Intelligent traffic management system for urban corridors using switched node architectures",
      applicant: "Indian Institute of Technology (IIT) Madras",
      priorityDate: "2019-07-15",
      jurisdiction: "Indian Patent Office (IPO)",
      problem: "Extreme heterogeneous traffic conditions and lane-less vehicle movements along Indian arterial corridors causing signal controller failure.",
      solution: "Multi-camera computer vision detects vehicle area occupancy, updating a switched-queue dynamic state model to actuate signal timings along an arterial corridor.",
      relevantClaims: "Claim 1: Switched state-space model updating cycle splits based on fractional area occupancy in mixed non-lane traffic.",
      similarity: "Switched state-space model for urban arterials in an Indian context (relevant to Coimbatore).",
      difference: "Empirical heuristic occupancy model; does not integrate power systems N-1 contingency, power-flow formulation, or power electronics switching loss optimization.",
      riskLevel: "MEDIUM",
      riskBadge: "risk-medium"
    },
    {
      patentNumber: "WO2021183592A1",
      title: "Method and apparatus for resilient transportation network reconfiguration under localized failure",
      applicant: "Massachusetts Institute of Technology (MIT)",
      priorityDate: "2020-03-10",
      jurisdiction: "WIPO / PCT",
      problem: "Urban road networks collapse during localized disruptions (floods, crashes, construction) due to lack of coordinated network reconfiguration.",
      solution: "Identifies cut-sets and bottlenecks in transportation graphs and dynamically re-routes perimeter demand using automated variable message signs and signal phase gating.",
      relevantClaims: "Claim 1: Algorithm for network contingency isolation using spectral graph theory and cut-set capacity reallocation.",
      similarity: "Very close to our N-1 contingency analysis and network reconfiguration concept.",
      difference: "Purely topological graph cut approach without power-flow analogy, state estimation, or power-electronics switching frameworks.",
      riskLevel: "HIGH",
      riskBadge: "risk-high"
    }
  ]
};
