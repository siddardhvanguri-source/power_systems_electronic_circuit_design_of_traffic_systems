# Power-Systems & Power-Electronics Representation of Urban Traffic Networks

An interactive scientific research workspace and computational living laboratory investigating whether and how components of an urban traffic system can legitimately be modeled as power-electronic circuits and switching networks.

[![Research Status](https://img.shields.io/badge/Research_Status-Stage_0_Validation-2d6a4f?style=flat-square)](https://github.com/siddardhvanguri-source/power_systems_electronic_circuit_design_of_traffic_systems)
[![Framework](https://img.shields.io/badge/Framework-React_19_+_TypeScript_+_Vite-1e1b16?style=flat-square)](https://vitejs.dev/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38bdf8?style=flat-square)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Academic_Research-92400e?style=flat-square)](LICENSE)

---

## 🔬 Scientific Ethos & Core Hypothesis

> **"Try to break the concept rather than forcing success."**

This platform moves beyond naive superficial metaphors (*"cars are electrons / roads are passive resistors"*) to establish a mathematically rigorous, falsifiable power-electronics formulation of traffic dynamics:

1. **Topological & Flow Conservation**: Vehicular arrival/departure continuity maps directly to Kirchhoff's Current Law:
   $$\sum I_{\text{in}} - \sum I_{\text{out}} = C \frac{dV}{dt} \iff k\left(\sum a_i(t) - \sum d_i(t)\right) = k \frac{dq_i}{dt}$$
   where $k$ is the scaling factor [Coulombs/veh], $C = k$ [Farads], and node voltage $V_i(t)$ numerically equals vehicle queue length $q_i(t)$.
2. **Traffic Signals as Active Semiconductor Switches**: Signals act as multi-pole semiconductor switching bridges governed by discrete state vectors $u(k) \in \{0, 1\}^M$ that dynamically modulate the network nodal admittance matrix:
   $$Y(t) = A^T \cdot \text{diag}\bigl(u_e(t) \cdot g_e(x)\bigr) \cdot A$$
3. **Finite-Control-Set Model Predictive Control (FCS-MPC)**: Directly optimizes discrete switching sequences with an explicit lost clearance time penalty:
   $$\min J = \sum_{j=1}^{N_p} \|x(k+j)\|_Q^2 + \lambda_{\text{sw}} \cdot \|u(k+j) - u(k+j-1)\|^2$$
   preventing rapid phase chattering and modeling yellow/all-red clearance dissipation.
4. **Physical Circuit Topologies**: 4-Switch Matrix Converter bridges (MOSFETs + freewheeling Schottky diodes), series R-L corridor branches with vehicular flow inertia $L$, and capacitive queue storage buffers.
5. **Transportation $N-1$ Contingency Screening**: Identifies critical bottlenecks and cascades before urban gridlock occurs.
6. **Empirical Corridor Scaling**: Applied to the Avinashi Road arterial corridor in Coimbatore with strict 5-tier data provenance (`MEASURED`, `PUBLISHED`, `ESTIMATED`, `ASSUMED`, `SIMULATED`).

---

## 🏛️ 14-Section Interactive Research Architecture

The application provides a comprehensive 14-section interactive research environment:

* **§0 BRIEF**: Executive summary, research metadata, core philosophy, and animated statistical counters.
* **§1 GOALS**: Primary research objective, 3-tier falsifiability criteria, and 6 concrete subgoals.
* **§2 MAPPINGS**: Multi-Criteria Decision Matrix evaluating 6 candidates across **Physical (A)**, **Functional (B)**, **Mathematical (C)**, **Control (D)**, and **Conceptual (E)** classifications with feasibility scores (1–5).
* **§3 DIMENSIONS**: Dimensional analysis proofs ($I=k\cdot a$, $Q_e=k\cdot q$, $R=\alpha T$, $D=T_g/T_{\text{cyc}}$) + **Interactive Dimensional Scaling Converter Widget**.
* **§4 MATH**: Dynamic discrete difference equations $x(k+1)=f(x,u,d)$, $Y(t)$ switched admittance matrix, and side-by-side comparison with Classical Cell Transmission Model (CTM).
* **§5 TOOLS**: Simulation toolchain comparison (SUMO, PLECS/Simscape, MATLAB, FMI co-simulation, Matpower) across capabilities, licensing, and roles across 3 network scales (5–15 node, 25–50 node, Coimbatore corridor).
* **§6 CIRCUITS**: 4-Switch MOSFET matrix converter topologies, R-L corridor inertia, and **Interactive Live Waveform Oscilloscope** (Gate PWM, Sawtooth Queue Voltage $V_i(t)$, Branch Current $I_e(t)$).
* **§7 HARDWARE**: Low-voltage 12V hardware testbed plan with an itemized, filterable **Bill of Materials (BOM)** ($124.70 USD total; IRLZ44N MOSFETs, 1N5822 Schottky diodes, STM32 / TI C2000 DSP).
* **§8 BENCH**: **Interactive Validation Test Bench Simulator** running 6 perturbation scenarios (Nominal, Surge, N-1 Closure, Stuck Signal, Duty Sweep, WLS State Estimation) with live Baseline vs Analog correlation curves ($r \ge 0.92$) and MSE error gates.
* **§9 5-NODE DEMO**: Step-by-step 7-phase priority proof-of-concept execution protocol (Weeks 1–7) with specific validation deliverables and go/no-go gates.
* **§10 RISKS**: Comprehensive 8-risk register detailing root-cause failure mechanisms, 4-step engineering mitigations, and explicit numerical **Continue-vs-Abandon Decision Thresholds**.
* **§11 ROADMAP**: 3-Year Stage 0 to Stage 7 research roadmap (2026–2031), multidisciplinary team roles (PI, Co-PI, 2 PhDs, Res. Eng, Lab Tech), and itemized $1,238,550 USD budget breakdown.
* **§12 NOVELTY**: Interactive novelty claims checklist with real-time verification progress tracking.
* **§13 PATENTS**: Expanded literature database (Google Research / Sinop 2022, Cui & Ma 2012, Moyalan 2026, Danchuk 2020, Kim 2022, Varaiya 2013) and multi-jurisdiction patent search dossier (USPTO US9852631B2, WIPO, EPO, IPO).

---

## 🚀 How to Run Locally

### Option 1: Vite Development Server
```bash
# Install dependencies
pnpm install  # or npm install

# Start development server
pnpm dev      # or npm run dev
```
Open **`http://localhost:8443`** or the URL indicated in the terminal.

### Option 2: Standalone Static Server
```bash
python -m http.server 8000
```
Open **`http://localhost:8000/`** in your browser.

---

## 📁 Repository Structure

```
├── src/
│   ├── App.tsx             # Master React component tree (§0 to §13)
│   ├── data.ts             # Research datasets, formulas, BOM, risks & toolchains
│   ├── main.tsx            # React 19 entrypoint
│   └── index.css           # Design tokens, typography & animation rules
├── index.html              # HTML shell
├── deep-research-report (3).md # Complete 12-section technical research plan
├── deep-research-report.md     # Foundational research overview
├── package.json            # Dependencies and build scripts
├── vite.config.ts          # Vite configuration
└── README.md
```

---

## ⚖️ Citation & Academic Attribution

```bibtex
@article{vanguri2026powersystems,
  title={Power-Electronic Circuits and Switching Networks as Physical Representations of Urban Traffic Networks},
  author={Vanguri, Siddardh},
  journal={Working Paper & Interactive Research Brief},
  year={2026},
  url={https://github.com/siddardhvanguri-source/power_systems_electronic_circuit_design_of_traffic_systems}
}
```

**Repository**: [github.com/siddardhvanguri-source/power_systems_electronic_circuit_design_of_traffic_systems](https://github.com/siddardhvanguri-source/power_systems_electronic_circuit_design_of_traffic_systems.git)
