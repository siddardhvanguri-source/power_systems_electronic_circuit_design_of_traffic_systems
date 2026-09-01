/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * N-1 Contingency Analysis Simulator (Section 19)
 * Evaluates network resilience under single-element outages (Base Case vs N-1 Case)
 */

window.ContingencySim = {
  selectedElement: "R4", // Default outage on Central Spine

  contingencyScenarios: {
    "R4": {
      name: "Outage of Road R4 (Central Spine J2 → J5)",
      type: "branch",
      baseLoading: 87.1,
      contingencyLoading: 148.0,
      divertedTo: "R1 (+38%), R6 (+52%), R7 (+30%)",
      criticalBottleneck: "J2 & J5 Throat",
      systemDelayDelta: "+84.2%",
      networkRecovery: "Reconfigure J2-J5 signal splits; divert at Northwest Gateway J1",
      severity: "CRITICAL"
    },
    "R1": {
      name: "Outage of Road R1 (North Arterial West J1 → J2)",
      type: "branch",
      baseLoading: 73.8,
      contingencyLoading: 112.5,
      divertedTo: "R3 (+65%), R6 (+45%)",
      criticalBottleneck: "Intersection J4 West",
      systemDelayDelta: "+46.8%",
      networkRecovery: "Increase green split on West Collector R3",
      severity: "MODERATE"
    },
    "R2": {
      name: "Outage of Road R2 (North Arterial East J2 → J3)",
      type: "branch",
      baseLoading: 84.4,
      contingencyLoading: 124.0,
      divertedTo: "R4 (+25%), R7 (+60%)",
      criticalBottleneck: "Intersection J6 Southeast",
      systemDelayDelta: "+58.1%",
      networkRecovery: "Dynamic VMS rerouting to South Bypass J7",
      severity: "SEVERE"
    },
    "J5": {
      name: "Outage / Lockup of Intersection J5 (Central Core)",
      type: "node",
      baseLoading: 89.0,
      contingencyLoading: 190.0,
      divertedTo: "Perimeter links R1, R2, R5, R10",
      criticalBottleneck: "Total network cross-axis severance",
      systemDelayDelta: "+165.0%",
      networkRecovery: "Islanding: isolate North Grid (J1-J2-J3) from South Grid (J4-J6-J7)",
      severity: "CATASTROPHIC"
    },
    "R8": {
      name: "Outage of Road R8 (Industrial Spur J5 → J7)",
      type: "branch",
      baseLoading: 62.9,
      contingencyLoading: 88.0,
      divertedTo: "Regional arterial detour",
      criticalBottleneck: "Local industrial access only",
      systemDelayDelta: "+18.4%",
      networkRecovery: "Extended green phase on minor approach",
      severity: "LOW"
    }
  },

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  },

  selectScenario(elemId) {
    this.selectedElement = elemId;
    this.render();
  },

  render() {
    if (!this.container) return;
    const scen = this.contingencyScenarios[this.selectedElement];

    let html = `
      <div>
        <!-- Scenario Selector Dropdown -->
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 14px; flex-wrap: wrap;">
          <label style="font-size: 0.78rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-secondary);">SELECT ELEMENT OUTAGE (N−1 TEST):</label>
          <select id="contingency-selector" class="header-btn" style="background: var(--surface-white); padding: 5px 10px;" onchange="ContingencySim.selectScenario(this.value)">
            <option value="R4" ${this.selectedElement === 'R4' ? 'selected' : ''}>[Branch] R4: Central Spine (J2 → J5)</option>
            <option value="R1" ${this.selectedElement === 'R1' ? 'selected' : ''}>[Branch] R1: North Arterial West (J1 → J2)</option>
            <option value="R2" ${this.selectedElement === 'R2' ? 'selected' : ''}>[Branch] R2: North Arterial East (J2 → J3)</option>
            <option value="J5" ${this.selectedElement === 'J5' ? 'selected' : ''}>[Node] J5: Central Core Hub Lockup</option>
            <option value="R8" ${this.selectedElement === 'R8' ? 'selected' : ''}>[Branch] R8: Industrial Spur South (J5 → J7)</option>
          </select>
          <span class="risk-pill ${scen.severity === 'CATASTROPHIC' || scen.severity === 'CRITICAL' ? 'risk-high' : scen.severity === 'SEVERE' ? 'risk-medium' : 'risk-low'}">
            SEVERITY: ${scen.severity}
          </span>
        </div>

        <!-- Comparative Side-by-Side Analysis Grid -->
        <div class="contingency-compare-grid">
          <!-- Column 1: BASE CASE (ALL ELEMENTS IN SERVICE) -->
          <div class="contingency-col">
            <h4>
              <span>BASE CASE (N−0)</span>
              <span class="mono-tag" style="background: #E8F5EE; color: #1B7F4B;">ALL IN SERVICE</span>
            </h4>
            <div class="delta-stat">
              <span class="inspector-label">Element Operating Load:</span>
              <span class="val-neutral">${scen.baseLoading}%</span>
            </div>
            <div class="delta-stat">
              <span class="inspector-label">Highest Branch Loading:</span>
              <span class="val-neutral">87.1% (Nominal)</span>
            </div>
            <div class="delta-stat">
              <span class="inspector-label">Downstream Flow Margin:</span>
              <span class="val-pos">+320 veh/h buffer</span>
            </div>
            <div class="delta-stat">
              <span class="inspector-label">Network Mean Delay:</span>
              <span class="val-neutral">38.4 s / vehicle</span>
            </div>
            <div class="delta-stat">
              <span class="inspector-label">Grid Stability Status:</span>
              <span class="val-pos">Equilibrium Maintained</span>
            </div>
          </div>

          <!-- Column 2: POST-CONTINGENCY (N−1 CASE) -->
          <div class="contingency-col n-1-alert">
            <h4>
              <span>CONTINGENCY (N−1: ${this.selectedElement})</span>
              <span class="mono-tag" style="background: #FDF1F1; color: #B52626;">OUTAGE ACTIVE</span>
            </h4>
            <div class="delta-stat">
              <span class="inspector-label">Surge Loading on Parallel Paths:</span>
              <span class="val-neg">${scen.contingencyLoading}% (OVERLOAD)</span>
            </div>
            <div class="delta-stat">
              <span class="inspector-label">Flow Diversion Paths:</span>
              <span class="val-neutral" style="font-size: 0.74rem;">${scen.divertedTo}</span>
            </div>
            <div class="delta-stat">
              <span class="inspector-label">Induced Critical Bottleneck:</span>
              <span class="val-neg">${scen.criticalBottleneck}</span>
            </div>
            <div class="delta-stat">
              <span class="inspector-label">System Delay Delta:</span>
              <span class="val-neg">${scen.systemDelayDelta}</span>
            </div>
            <div class="delta-stat">
              <span class="inspector-label">Recommended Reconfiguration:</span>
              <span class="val-neutral" style="font-size: 0.72rem;">${scen.networkRecovery}</span>
            </div>
          </div>
        </div>

        <div style="font-size: 0.74rem; font-family: var(--font-mono); color: var(--text-tertiary); margin-top: 8px;">
          <em>Analogy Note: Engineering contingency analysis identifies whether a single transmission line trip causes secondary line overloads. Applied here to traffic networks without assuming electrical physics.</em>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }
};
