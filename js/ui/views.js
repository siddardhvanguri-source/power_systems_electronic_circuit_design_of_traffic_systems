/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Master View Components Renderer
 */

window.AppViews = {
  activePipelineStage: "REPRESENTATION",

  pipelineStages: [
    {
      id: "REPRESENTATION",
      title: "REPRESENTATION",
      status: "ACTIVE",
      objective: "Formulate physical road network as a topological graph with electrical branch-bus properties.",
      questions: "Can discrete vehicle movements be mapped to continuous charge/current without violating physical laws?",
      models: "Directed graph G=(V,E), Incidence matrix A, switched admittance Y(t).",
      evidence: "Topological graph isomorphism is established; potential field requires formal test.",
      openProblems: "Handling asymmetric turning delays and non-conservative travel potential fields.",
      nextExp: "Benchmark graph extraction from Coimbatore Avinashi Rd GIS coordinates."
    },
    {
      id: "MODELLING",
      title: "MODELLING",
      status: "ACTIVE",
      objective: "Develop discrete-time switched dynamic state-space equations x(k+1) = f(x(k), u(k), d(k)).",
      questions: "How do we incorporate downstream queue backpressure and lost green switching time?",
      models: "Switched piecewise-affine queue dynamics with capacitor saturation limits.",
      evidence: "Cell Transmission Model sending/receiving functions re-cast as switched conductances.",
      openProblems: "Hyper-congested negative apparent resistance destabilizing solvers.",
      nextExp: "Formulate complete state-space matrices for 7-intersection Small-Town grid."
    },
    {
      id: "ANALYSIS",
      title: "ANALYSIS",
      status: "OPEN",
      objective: "Develop Traffic Load Flow, N-1 contingency analysis, and cascading failure propagation.",
      questions: "Does Newton-Raphson or DC load flow provide computational advantages over Frank-Wolfe?",
      models: "Non-linear power-flow balance equations with line thermal loading limits.",
      evidence: "Sensitivity Jacobian partials ∂Delay/∂Demand mirror electrical bus sensitivity.",
      openProblems: "Non-linear driver route choice diversion under localized bottlenecking.",
      nextExp: "Simulate single-line tripping on Central Spine R4."
    },
    {
      id: "VALIDATION",
      title: "VALIDATION",
      status: "PLANNED",
      objective: "Compare proposed switched model against SUMO micro-simulation and baseline Max-Pressure.",
      questions: "Does FCS-MPC reduce vehicle delay compared to classical Webster fixed-time plans?",
      models: "SUMO + TraCI Python co-simulation harness.",
      evidence: "Preliminary numerical tests show reduced signal chatter when lambda_sw > 20.",
      openProblems: "Calibration of human perception-reaction variance.",
      nextExp: "Run 1,000-vehicle demand profile on Small-Town benchmark in SUMO."
    },
    {
      id: "SCALING",
      title: "SCALING",
      status: "PLANNED",
      objective: "Scale from 7-node benchmark to 50-node regional grid and Coimbatore corridor.",
      questions: "Does computational complexity remain polynomial under distributed consensus?",
      models: "Hierarchical sub-grid decomposition and microgrid-style islanding.",
      evidence: "Sparse matrix graph solvers scale efficiently to 1,000+ nodes in power systems.",
      openProblems: "Inter-intersection communication packet loss and latency.",
      nextExp: "Calibrate Lakshmi Mills to Nava India corridor link capacities."
    },
    {
      id: "PROBLEM_DISCOVERY",
      title: "PROBLEM DISCOVERY",
      status: "OPEN",
      objective: "Identify emergent network vulnerabilities revealed uniquely by this representation.",
      questions: "What new failure modes appear when viewing signals as high-frequency switches?",
      models: "Switching harmonic resonance and capacity degradation under high switching frequency.",
      evidence: "Observation: excessive phase switching induces upstream shockwaves.",
      openProblems: "Determining optimal switching frequency limits for vehicle platoons.",
      nextExp: "Sweep switching frequency f_sw from 0.005 Hz (200s cycle) to 0.033 Hz (30s cycle)."
    },
    {
      id: "OPTIMIZATION",
      title: "OPTIMIZATION",
      status: "PLANNED",
      objective: "Formulate multi-objective FCS-MPC balancing queue length, delay, and vehicle energy dissipation.",
      questions: "Can vehicle kinetic braking dissipation be minimized as equivalent I²R line losses?",
      models: "Quadratic cost function min J with linear state inequalities.",
      evidence: "FCS-MPC in motor drives demonstrates optimal switching without carrier modulation.",
      openProblems: "Real-time horizon prediction scaling with O(M^N_p) combinatorial combinations.",
      nextExp: "Implement branch-and-bound pruning for candidate phase vectors."
    },
    {
      id: "CONTROL",
      title: "CONTROL",
      status: "PLANNED",
      objective: "Deploy closed-loop distributed feedback controllers on physical EEE microcontrollers.",
      questions: "Can CAN-bus networked microcontrollers maintain green waves under communication dropouts?",
      models: "Distributed consensus with event-triggered state updates.",
      evidence: "Multi-agent consensus proofs in IEEE Transactions on Automatic Control.",
      openProblems: "Fail-safe default states during hardware fault.",
      nextExp: "Build 4-node physical demonstration prototype with STM32 and LED arrays."
    }
  ],

  renderAll() {
    this.renderHero();
    this.renderPipeline();
    this.renderSevenLevels();
    this.renderAnalogyMatrix();
    this.renderLoadFlowComparison();
    this.renderControlComparison();
    this.renderCoimbatoreProvenance();
    this.renderLiterature();
    this.renderPatents();
    this.renderRoadmap();
    this.renderDecisionMatrix();
  },

  renderHero() {
    const el = document.getElementById("hero-container");
    if (!el) return;
    const s = window.RESEARCH_DATA.statusSummary;

    el.innerHTML = `
      <div class="hero-section">
        <div class="hero-eyebrow">${window.RESEARCH_DATA.eyebrow}</div>
        <h1 class="hero-title">${window.RESEARCH_DATA.projectTitle}</h1>
        <div class="hero-subtitle">${window.RESEARCH_DATA.subtitle}</div>

        <!-- Scientific Status Summary Panel (Section 6) -->
        <div style="font-family: var(--font-mono); font-size: 0.76rem; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; margin-top: 14px;">
          PROJECT VALIDATION STATUS DASHBOARD:
        </div>
        <div class="status-panel-grid">
          ${Object.values(s).map(item => `
            <div class="status-metric">
              <span class="status-metric-label">${item.label}</span>
              <span class="status-metric-val ${item.state}">
                <span style="font-size: 8px;">●</span> ${item.status}
              </span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- "TRY TO BREAK IT" Scientific Warning Panel (Section 7) -->
      <div class="break-it-panel">
        <div class="break-it-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div class="break-it-content">
          <h4>TRY TO BREAK THE IDEA</h4>
          <p>The objective of this research is <strong>not</strong> to prove the original concept correct. The objective is to determine where it works, where it fails, what already exists, what can genuinely be transferred from electrical power engineering, and whether the resulting framework provides capabilities that conventional traffic models do not.</p>
        </div>
      </div>
    `;
  },

  renderPipeline() {
    const el = document.getElementById("pipeline-container");
    if (!el) return;
    const cur = this.pipelineStages.find(p => p.id === this.activePipelineStage) || this.pipelineStages[0];

    el.innerHTML = `
      <div class="pipeline-container">
        <div class="pipeline-header">
          <span class="pipeline-title">RESEARCH EXECUTION PIPELINE (STAGED WORKFLOW)</span>
          <span class="mono-tag" style="color: var(--accent-teal);">CLICK ANY STAGE TO INSPECT STATUS</span>
        </div>

        <div class="pipeline-nav">
          ${this.pipelineStages.map((st, idx) => `
            <div class="pipeline-step ${st.id === this.activePipelineStage ? 'active' : ''}" onclick="AppViews.selectPipelineStage('${st.id}')">
              <span>${st.title}</span>
              <span class="badge ${st.status === 'ACTIVE' ? 'badge-active' : st.status === 'OPEN' ? 'badge-open' : 'badge-planned'} pipeline-step-badge">${st.status}</span>
            </div>
            ${idx < this.pipelineStages.length - 1 ? '<span class="pipeline-arrow">→</span>' : ''}
          `).join("")}
        </div>

        <div class="pipeline-detail-card">
          <div class="pipeline-detail-col">
            <h5>STAGE OBJECTIVE & RESEARCH QUESTIONS</h5>
            <p><strong>Objective:</strong> ${cur.objective}</p>
            <p><strong>Key Questions:</strong> ${cur.questions}</p>
            <p><strong>Mathematical Models:</strong> <code>${cur.models}</code></p>
          </div>
          <div class="pipeline-detail-col">
            <h5>CURRENT EVIDENCE & NEXT EXPERIMENT</h5>
            <p><strong>Existing Evidence:</strong> ${cur.evidence}</p>
            <p><strong>Identified Open Problems:</strong> <span style="color: var(--accent-amber);">${cur.openProblems}</span></p>
            <p><strong>Upcoming Experiment:</strong> <strong style="color: var(--accent-teal);">${cur.nextExp}</strong></p>
          </div>
        </div>
      </div>
    `;
  },

  selectPipelineStage(stageId) {
    this.activePipelineStage = stageId;
    this.renderPipeline();
  },

  renderSevenLevels() {
    const el = document.getElementById("seven-levels-container");
    if (!el) return;
    const data = window.ANALOGY_DATA.sevenLevels;

    el.innerHTML = `
      <div class="analogy-layers-stack">
        ${data.map(l => `
          <div class="analogy-layer-card ${l.level <= 2 ? 'expanded' : ''}" id="analogy-layer-${l.level}">
            <div class="analogy-layer-header" onclick="AppViews.toggleAnalogyLayer(${l.level})">
              <div class="analogy-layer-title-wrap">
                <span class="analogy-layer-num">LEVEL ${l.level}</span>
                <span class="analogy-layer-title">${l.name}</span>
                <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 8px;">(${l.traffic.split('→')[0].trim()} ↔ ${l.electrical.split('→')[0].trim()})</span>
              </div>
              <span class="badge badge-${l.status}">${l.badgeText}</span>
            </div>
            <div class="analogy-layer-body">
              <p style="margin-bottom: 12px; font-size: 0.88rem; color: var(--text-primary);">${l.summary}</p>
              
              <div class="math-equation-display">
                \\[ ${l.mathMapping} \\]
              </div>

              <div class="analogy-layer-grid">
                <div class="analogy-subbox">
                  <div class="analogy-subbox-title">Underlying Assumptions:</div>
                  <ul style="padding-left: 16px; font-size: 0.8rem; color: var(--text-secondary);">
                    ${l.assumptions.map(a => `<li>${a}</li>`).join("")}
                  </ul>
                </div>
                <div class="analogy-subbox">
                  <div class="analogy-subbox-title">Identified Limitations:</div>
                  <ul style="padding-left: 16px; font-size: 0.8rem; color: var(--text-secondary);">
                    ${l.limitations.map(lim => `<li>${lim}</li>`).join("")}
                  </ul>
                </div>
              </div>

              <div style="background: var(--status-red-bg); border: 1px solid var(--status-red-border); border-radius: 3px; padding: 6px 10px; font-size: 0.76rem; color: var(--status-red);">
                <strong>Falsification Criteria:</strong> ${l.failureCriteria}
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  toggleAnalogyLayer(level) {
    const card = document.getElementById(`analogy-layer-${level}`);
    if (card) card.classList.toggle("expanded");
  },

  renderAnalogyMatrix() {
    const el = document.getElementById("analogy-matrix-container");
    if (!el) return;
    const rows = window.ANALOGY_DATA.analogyMatrix;

    el.innerHTML = `
      <div class="table-responsive">
        <table class="research-table">
          <thead>
            <tr>
              <th>TRAFFIC CONCEPT</th>
              <th>ELECTRICAL ANALOGUE</th>
              <th>MATHEMATICAL MAPPING</th>
              <th>VALIDITY</th>
              <th>EXISTING LITERATURE</th>
              <th>NEW INFORMATION</th>
              <th>RESEARCH STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td class="primary-cell">${r.traffic}</td>
                <td style="color: var(--accent-teal); font-weight: 600;">${r.electrical}</td>
                <td><code>${r.mapping}</code></td>
                <td><span class="badge ${r.statusBadge}">${r.validity}</span></td>
                <td>${r.literature}</td>
                <td style="font-size: 0.8rem;">${r.newInfo}</td>
                <td><span class="mono-tag">${r.researchStatus}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  },

  renderLoadFlowComparison() {
    const el = document.getElementById("load-flow-comparison-container");
    if (!el) return;

    el.innerHTML = `
      <div class="table-responsive">
        <table class="research-table">
          <thead>
            <tr>
              <th>DIMENSION</th>
              <th>CONVENTIONAL TRAFFIC ASSIGNMENT (WARDROP EQUILIBRIUM)</th>
              <th>POWER-FLOW-INSPIRED ANALYSIS (AC/DC ADMITTANCE)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="primary-cell">Primary Inputs</td>
              <td>Static Origin-Destination (O-D) matrix, free-flow travel times, BPR link parameters.</td>
              <td>Injected bus current/power demand, nodal admittance matrix Y_bus, branch impedance limits.</td>
            </tr>
            <tr>
              <td class="primary-cell">Primary Outputs</td>
              <td>Link volume-to-capacity (v/c) ratios, static equilibrium travel delays.</td>
              <td>Nodal travel potentials (bus voltages), branch power/delay dissipation, sensitivity partials.</td>
            </tr>
            <tr>
              <td class="primary-cell">Core Assumptions</td>
              <td>Wardrop user equilibrium: all drivers possess perfect information and minimize individual path cost.</td>
              <td>Continuity of nodal flows (KCL), impedance models flow resistance, potential drives transmission.</td>
            </tr>
            <tr>
              <td class="primary-cell">Computational Method</td>
              <td>Frank-Wolfe convex optimization algorithm, method of successive averages (MSA).</td>
              <td>Iterative non-linear solvers: Newton-Raphson, Fast Decoupled, or linear DC power flow.</td>
            </tr>
            <tr>
              <td class="primary-cell">Dynamic Capability</td>
              <td>Static or quasi-dynamic (DTA); struggles with non-convergent shock waves and spatial spillback.</td>
              <td>Explicitly models dynamic state propagation and boundary impedance shifts.</td>
            </tr>
            <tr>
              <td class="primary-cell">Switching Representation</td>
              <td>Signal timing represented as exogenous link capacity multipliers (green split percentage).</td>
              <td>Signals represented directly as high-frequency topology switches in the admittance matrix.</td>
            </tr>
            <tr>
              <td class="primary-cell">Novel Information Provided</td>
              <td>Standard planning flow volumes across regional corridors.</td>
              <td>Nodal Jacobian sensitivity (∂Delay/∂Demand), cascading trip paths, and N-1 contingency rankings.</td>
            </tr>
            <tr>
              <td class="primary-cell">Major Limitations</td>
              <td>Neglects queue spillback across intersections and lost time from phase switching chatter.</td>
              <td>Human drivers do not behave like electromagnetic potential fields; requires artificial potential formulation.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  },

  renderControlComparison() {
    const el = document.getElementById("control-comparison-container");
    if (!el) return;

    el.innerHTML = `
      <div class="table-responsive">
        <table class="research-table">
          <thead>
            <tr>
              <th>FEATURE</th>
              <th>CENTRALIZED CONTROL ARCHITECTURE</th>
              <th>DISTRIBUTED CONSENSUS CONTROL ARCHITECTURE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="primary-cell">Control Mechanism</td>
              <td>Central supercomputer processes entire network state x(k) and dispatches all signal timings.</td>
              <td>Each intersection controller acts as an autonomous node communicating only with 1-hop neighbors.</td>
            </tr>
            <tr>
              <td class="primary-cell">Computational Complexity</td>
              <td>O(M^N) combinatorial explosion; becomes intractable beyond 30–50 intersections.</td>
              <td>O(1) localized optimization at each node; scales linearly with network size.</td>
            </tr>
            <tr>
              <td class="primary-cell">Communication Requirement</td>
              <td>High-bandwidth, low-latency continuous backbone connecting every sensor to central HQ.</td>
              <td>Low-bandwidth localized mesh (e.g. DSRC, CAN, local Wi-Fi / LoRa) between adjacent junctions.</td>
            </tr>
            <tr>
              <td class="primary-cell">Failure Robustness</td>
              <td>Single point of failure: central server or main fiber severance paralyzes entire city.</td>
              <td>Extremely fault-tolerant: if one junction drops, neighbors reconfigure boundary constraints.</td>
            </tr>
            <tr>
              <td class="primary-cell">Coordination Capability</td>
              <td>Theoretically achieves global network optimum under ideal conditions.</td>
              <td>Achieves Pareto-efficient sub-optimal equilibrium; prevents runaway local congestion.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  },

  renderCoimbatoreProvenance() {
    const el = document.getElementById("coimbatore-provenance-container");
    if (!el) return;

    el.innerHTML = `
      <div style="background: var(--surface-white); border: 1px solid var(--border-soft); border-radius: 4px; padding: var(--space-lg); margin: var(--space-md) 0;">
        <h4 style="margin-top: 0;">COIMBATORE AVINASHI ROAD CORRIDOR TESTBED (LAKSHMI MILLS → NAVA INDIA)</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">
          To ensure scientific integrity during scale-up, every single data point used in the Coimbatore model is strictly tagged with its origin provenance. <strong>Never mix assumed values with measured values.</strong>
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-md); margin-top: 14px;">
          <div style="background: var(--surface-secondary); border: 1px solid var(--border-soft); border-radius: 4px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 0.85rem;">Geometric Cross-Section</span>
              <span class="provenance-tag provenance-measured">MEASURED</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">
              Road carriage widths: 6-lane divided arterial (24.0 m total width), dedicated flyover corridor piers. Extracted from field GIS survey and satellite orthomosaics.
            </div>
          </div>

          <div style="background: var(--surface-secondary); border: 1px solid var(--border-soft); border-radius: 4px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 0.85rem;">Saturation Flow Capacities</span>
              <span class="provenance-tag provenance-published">PUBLISHED</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">
              Saturation capacity: 1,850 PCU/hour/lane per Indian Roads Congress (IRC:106-1990) Guidelines for Capacity of Urban Roads in Plain Areas.
            </div>
          </div>

          <div style="background: var(--surface-secondary); border: 1px solid var(--border-soft); border-radius: 4px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 0.85rem;">Peak Traffic Volumes</span>
              <span class="provenance-tag provenance-estimated">ESTIMATED</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">
              Morning peak: 4,600 PCU/h westbound towards Gandhipuram; evening peak: 5,100 PCU/h eastbound towards Airport/Hope College. Estimated from sample 15-min turning count surveys.
            </div>
          </div>

          <div style="background: var(--surface-secondary); border: 1px solid var(--border-soft); border-radius: 4px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 0.85rem;">Driver Perception Reaction Time</span>
              <span class="provenance-tag provenance-assumed">ASSUMED</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">
              Mean perception-reaction time t_pr = 1.2 s, startup lost time t_start = 2.4 s, non-lane discipline lateral friction factor = 1.35. Assumed based on urban mixed-traffic literature.
            </div>
          </div>

          <div style="background: var(--surface-secondary); border: 1px solid var(--border-soft); border-radius: 4px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 0.85rem;">FCS-MPC Queue Clearance</span>
              <span class="provenance-tag provenance-simulated">SIMULATED</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-secondary);">
              Model predicted queue dissipation time: 48 seconds for Lakshmi Mills westbound approach under proposed power-electronics switching controller.
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderLiterature() {
    const el = document.getElementById("literature-container");
    if (!el) return;
    const papers = window.LITERATURE_DATA;

    el.innerHTML = `
      <div>
        <div class="literature-filter-bar">
          <button class="lit-filter-btn active" onclick="AppViews.filterLiterature('all', this)">All Categories</button>
          <button class="lit-filter-btn" onclick="AppViews.filterLiterature('traffic-modelling', this)">Traffic Modelling</button>
          <button class="lit-filter-btn" onclick="AppViews.filterLiterature('signal-control', this)">Signal Control</button>
          <button class="lit-filter-btn" onclick="AppViews.filterLiterature('power-electronics', this)">Power Electronics</button>
          <button class="lit-filter-btn" onclick="AppViews.filterLiterature('traffic-power-analogy', this)">Traffic-Power Analogy</button>
          <button class="lit-filter-btn" onclick="AppViews.filterLiterature('cascading', this)">Cascading Failures</button>
          <button class="lit-filter-btn" onclick="AppViews.filterLiterature('state-estimation', this)">State Estimation</button>
        </div>

        <div class="literature-grid" id="lit-cards-container">
          ${papers.map(p => this.createLitCard(p)).join("")}
        </div>
      </div>
    `;
  },

  createLitCard(p) {
    return `
      <div class="lit-card" data-cat="${p.category}">
        <div class="lit-card-header">
          <div>
            <div class="lit-title">${p.title}</div>
            <div class="lit-authors">${p.authors} (${p.year})</div>
          </div>
          <span class="mono-tag" style="background: var(--surface-secondary);">${p.category.toUpperCase()}</span>
        </div>
        <div class="lit-meta-row">
          <span>${p.publication}</span>
          <span>DOI: <a href="https://doi.org/${p.doi}" target="_blank" style="color: var(--accent-teal); text-decoration: none;">${p.doi}</a></span>
        </div>
        <div class="lit-body-grid">
          <div class="lit-detail-box">
            <h6>Methodology & Main Finding</h6>
            <p><strong>Method:</strong> ${p.method}</p>
            <p style="margin-top: 4px;"><strong>Finding:</strong> ${p.mainFinding}</p>
          </div>
          <div class="lit-detail-box">
            <h6>Scientific Critique & Novelty Impact</h6>
            <p><strong>Identified Limitation:</strong> <span style="color: var(--accent-amber);">${p.limitation}</span></p>
            <p style="margin-top: 4px;"><strong>Novelty Impact:</strong> ${p.noveltyImpact}</p>
          </div>
        </div>
      </div>
    `;
  },

  filterLiterature(category, btn) {
    document.querySelectorAll(".lit-filter-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    document.querySelectorAll(".lit-card").forEach(c => {
      if (category === "all" || c.getAttribute("data-cat") === category) {
        c.style.display = "block";
      } else {
        c.style.display = "none";
      }
    });
  },

  renderPatents() {
    const el = document.getElementById("patents-container");
    if (!el) return;
    const data = window.PATENTS_DATA;

    el.innerHTML = `
      <div>
        <div class="table-responsive">
          <table class="research-table">
            <thead>
              <tr>
                <th>PATENT NUMBER</th>
                <th>TITLE & APPLICANT</th>
                <th>JURISDICTION & PRIORITY</th>
                <th>PROBLEM & SOLUTION</th>
                <th>SIMILARITY TO OUR FRAMEWORK</th>
                <th>DIFFERENCES & CLEARANCE</th>
                <th>RISK LEVEL</th>
              </tr>
            </thead>
            <tbody>
              ${data.patents.map(p => `
                <tr>
                  <td class="primary-cell" style="font-family: var(--font-mono);">${p.patentNumber}</td>
                  <td>
                    <strong>${p.title}</strong><br>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">${p.applicant}</span>
                  </td>
                  <td style="font-family: var(--font-mono); font-size: 0.75rem;">${p.jurisdiction}<br>${p.priorityDate}</td>
                  <td style="font-size: 0.78rem;">
                    <strong>Problem:</strong> ${p.problem}<br>
                    <strong>Solution:</strong> ${p.solution}
                  </td>
                  <td style="font-size: 0.78rem;">${p.similarity}</td>
                  <td style="font-size: 0.78rem; color: var(--accent-teal);">${p.difference}</td>
                  <td><span class="risk-pill ${p.riskBadge}">${p.riskLevel}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="legal-disclaimer">${data.disclaimer}</div>
      </div>
    `;
  },

  renderRoadmap() {
    const el = document.getElementById("roadmap-container");
    if (!el) return;

    const stages = [
      { stage: "STAGE 0", name: "Literature & Patent Prior-Art Research", status: "COMPLETE", desc: "Comprehensive taxonomy of past electrical analogies, fluid dynamics, max-pressure, and patent boundaries." },
      { stage: "STAGE 1", name: "5–15 Node Small-Town Network Graph", status: "COMPLETE", desc: "Define G=(V,E), node types, branch capacities, and directional turning movements for benchmark town." },
      { stage: "STAGE 2", name: "Mathematical Formulation & Analogy Matrix", status: "COMPLETE", desc: "Decompose into 7 levels of analogy; formulate switched state-space equations with falsification tests." },
      { stage: "STAGE 3", name: "Small-Town Simulation & Telemetry Testbed", status: "ACTIVE", desc: "Interactive dual-view visualizer (Traffic vs Electrical) with live node/branch telemetry inspection." },
      { stage: "STAGE 4", name: "Dynamic Queuing & Downstream Backpressure", status: "ACTIVE", desc: "Integrate finite road spatial reservoir limits and queue spillback into state equations." },
      { stage: "STAGE 5", name: "Power Electronics Switching Model (FCS-MPC)", status: "ACTIVE", desc: "Formulate signal phases as discrete switching vectors S in {0,1}^M; penalize switching losses (lost green time)." },
      { stage: "STAGE 6", name: "Network Analysis (Load Flow & N−1 Contingency)", status: "OPEN", desc: "Iterative load flow calculation; N-1 element outage simulation comparing Base vs Line-Outage cases." },
      { stage: "STAGE 7", name: "Problem Discovery: Cascading Congestion", status: "OPEN", desc: "Map localized disturbance propagation into geometric gridlock; test network protection perimeter gating." },
      { stage: "STAGE 8", name: "Distributed Multi-Agent Consensus Control", status: "PLANNED", desc: "Replace centralized master computer with peer-to-peer 1-hop consensus between neighboring signal nodes." },
      { stage: "STAGE 9", name: "Physical Hardware EEE Demonstration Testbed", status: "PLANNED", desc: "Build 4-node physical demonstration prototype with microcontrollers, MOSFET switches, and LED arrays." },
      { stage: "STAGE 10", name: "Real-World Scaling: Coimbatore Corridor Case Study", status: "PLANNED", desc: "Scale framework to Coimbatore Avinashi Road corridor with rigorous data provenance labeling." },
      { stage: "STAGE 11", name: "Large-Scale Microscopic Validation in SUMO", status: "PLANNED", desc: "Co-simulation coupling Python NetworkX, SUMO TraCI, and MATLAB/Simulink for statistical benchmarking." },
      { stage: "STAGE 12", name: "Peer-Reviewed Scientific Publication", status: "PLANNED", desc: "Prepare technical paper for IEEE Transactions on Intelligent Transportation Systems / Smart Grid." },
      { stage: "STAGE 13", name: "Patentability Review & Clearance", status: "PLANNED", desc: "Formal review of FCS-MPC switching controller implementation with patent attorney." }
    ];

    el.innerHTML = `
      <div class="roadmap-timeline">
        ${stages.map(s => `
          <div class="roadmap-stage-item">
            <div class="roadmap-stage-badge">${s.stage}</div>
            <div class="roadmap-stage-content">
              <h4>
                <span>${s.name}</span>
                <span class="badge ${s.status === 'COMPLETE' ? 'badge-established' : s.status === 'ACTIVE' ? 'badge-active' : s.status === 'OPEN' ? 'badge-open' : 'badge-planned'}">${s.status}</span>
              </h4>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0;">${s.desc}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  renderDecisionMatrix() {
    const el = document.getElementById("decision-matrix-container");
    if (!el) return;

    const dimensions = [
      { dim: "Scientific validity", status: "Under investigation", state: "amber", criteria: "Must prove conservation laws and state observability without physical non-conserved energy fallacies." },
      { dim: "Mathematical usefulness", status: "Under investigation", state: "amber", criteria: "Must provide non-trivial theorems or faster analytical solvers than conventional convex traffic assignment." },
      { dim: "Computational feasibility", status: "Under investigation", state: "amber", criteria: "FCS-MPC must execute within 1.0 second control epoch on embedded hardware for 15+ nodes." },
      { dim: "Experimental feasibility", status: "Planned", state: "gray", criteria: "Physical demonstration circuit must validate switching dynamics in laboratory hardware-in-the-loop." },
      { dim: "Scalability", status: "Open question", state: "amber", criteria: "Must transition successfully from 7-node town to 50+ node city corridor without state combinatorial explosion." },
      { dim: "Genuine differentiation", status: "Supported", state: "teal", criteria: "Proven distinct from passive resistor networks by incorporating active power-electronics semiconductor switching loss." },
      { dim: "Patent potential", status: "Prior-art review required", state: "amber", criteria: "Pending formal patentability clearance; preliminary assessment shows moderate novelty in switching MPC." }
    ];

    el.innerHTML = `
      <div class="table-responsive">
        <table class="research-table">
          <thead>
            <tr>
              <th>EVALUATION DIMENSION</th>
              <th>CURRENT ASSESSMENT</th>
              <th>RESEARCH EVIDENCE & GATE CRITERIA</th>
            </tr>
          </thead>
          <tbody>
            ${dimensions.map(d => `
              <tr>
                <td class="primary-cell">${d.dim}</td>
                <td>
                  <span class="status-metric-val ${d.state}">
                    <span style="font-size: 8px;">●</span> ${d.status}
                  </span>
                </td>
                <td style="font-size: 0.8rem;">${d.criteria}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div style="background: var(--surface-secondary); border: 1px solid var(--border-soft); border-radius: 4px; padding: 10px 14px; font-size: 0.8rem; color: var(--text-secondary);">
        <strong>Gate Decision Rule:</strong> These evaluation dimensions remain strictly <em>UNDER INVESTIGATION</em>. They will only be marked as confirmed when empirical simulation and hardware-in-the-loop experimental evidence are produced.
      </div>
    `;
  }
};
