/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Finite-Control-Set Model Predictive Control (FCS-MPC) Simulator (Section 22)
 * Demonstrates direct discrete switching-state optimization over a finite prediction horizon
 */

window.FcsMpcSim = {
  horizon: 3,        // Prediction horizon N_p (steps)
  switchPenalty: 25, // Lambda penalty for switching states (avoids chatter)
  currentActive: "S1",

  candidateStates: [
    {
      id: "S1",
      name: "Phase 1 (N-S Arterial Thru)",
      predictedQueueCost: 34.2,
      switchTransition: 0, // already in S1
      constraintViolations: 0,
      description: "Serves highest arrival corridor on North-South spine."
    },
    {
      id: "S2",
      name: "Phase 2 (E-W Cross Arterial)",
      predictedQueueCost: 48.6,
      switchTransition: 1, // requires phase switch
      constraintViolations: 0,
      description: "Clears growing queues on East-West collector."
    },
    {
      id: "S3",
      name: "Phase 3 (Protected Left Turns)",
      predictedQueueCost: 62.1,
      switchTransition: 1,
      constraintViolations: 0,
      description: "Services waiting left-turning vehicles."
    },
    {
      id: "S4",
      name: "Phase 4 (All-Red Clearance)",
      predictedQueueCost: 88.0,
      switchTransition: 1,
      constraintViolations: 1, // not needed unless clearance required
      description: "Zero flow throughput; only used for inter-phase clearance."
    }
  ],

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  },

  updateHorizon(val) {
    this.horizon = parseInt(val, 10);
    this.render();
  },

  updatePenalty(val) {
    this.switchPenalty = parseInt(val, 10);
    this.render();
  },

  render() {
    if (!this.container) return;

    // Calculate total cost for each candidate state:
    // J = predictedQueueCost * (1 + 0.1 * horizon) + switchPenalty * switchTransition + (violations * 100)
    const evaluated = this.candidateStates.map(cand => {
      const isSwitch = cand.id !== this.currentActive;
      const penaltyCost = isSwitch ? this.switchPenalty : 0;
      const baseCost = cand.predictedQueueCost * (1 + (this.horizon - 1) * 0.18);
      const violationPenalty = cand.constraintViolations * 150;
      const totalJ = Math.round(baseCost + penaltyCost + violationPenalty);
      return {
        ...cand,
        totalJ,
        penaltyCost
      };
    });

    // Find optimal (minimum total cost)
    let minCost = Infinity;
    let optimalId = "S1";
    evaluated.forEach(e => {
      if (e.totalJ < minCost) {
        minCost = e.totalJ;
        optimalId = e.id;
      }
    });

    let html = `
      <div>
        <!-- Parameter Tuning Sliders -->
        <div style="display: flex; gap: 20px; background: var(--surface-secondary); padding: 12px 16px; border: 1px solid var(--border-soft); border-radius: 4px; margin-bottom: 14px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.76rem; font-family: var(--font-mono); margin-bottom: 4px;">
              <span>PREDICTION HORIZON (N_p):</span>
              <strong style="color: var(--accent-teal);">${this.horizon} STEPS (${this.horizon * 5} s)</strong>
            </div>
            <input type="range" min="1" max="5" value="${this.horizon}" style="width: 100%; accent-color: var(--accent-teal);" oninput="FcsMpcSim.updateHorizon(this.value)">
          </div>

          <div style="flex: 1; min-width: 200px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.76rem; font-family: var(--font-mono); margin-bottom: 4px;">
              <span>SWITCHING PENALTY (λ_sw):</span>
              <strong style="color: var(--accent-amber);">${this.switchPenalty} (Lost Green Time Weight)</strong>
            </div>
            <input type="range" min="0" max="60" value="${this.switchPenalty}" style="width: 100%; accent-color: var(--accent-amber);" oninput="FcsMpcSim.updatePenalty(this.value)">
          </div>
        </div>

        <!-- Candidate Switching States Grid -->
        <div class="fcs-candidates-grid">
          ${evaluated.map(cand => {
            const isOpt = cand.id === optimalId;
            return `
              <div class="fcs-candidate-card ${isOpt ? 'optimal' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="mono-tag" style="font-weight: 800;">${cand.id}</span>
                  ${isOpt ? '<span class="badge badge-established" style="font-size: 0.62rem;">OPTIMAL STATE</span>' : ''}
                </div>
                <h5 style="margin-top: 6px; font-size: 0.78rem;">${cand.name.split('(')[0]}</h5>
                <div class="fcs-cost-score ${isOpt ? 'best' : 'suboptimal'}">J = ${cand.totalJ}</div>
                <div style="font-size: 0.72rem; color: var(--text-secondary); text-align: left; margin-top: 6px;">
                  <div>Queue Cost: ${(cand.predictedQueueCost * (1 + (this.horizon - 1) * 0.18)).toFixed(1)}</div>
                  <div>Switch Loss: ${cand.penaltyCost}</div>
                  <div>Constraints: ${cand.constraintViolations === 0 ? '✓ Satisfied' : '✗ Violated'}</div>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- Predictive Sequence Architecture Flow -->
        <div style="background: var(--surface-secondary); border: 1px solid var(--border-soft); border-radius: 4px; padding: 10px 14px; margin-top: 14px; font-size: 0.78rem; font-family: var(--font-mono);">
          <strong style="color: var(--text-primary);">FCS-MPC CONTROL CYCLE PIPELINE:</strong><br>
          <span style="color: var(--accent-teal);">Candidate States (S1..S4)</span> → 
          Prediction Model <span style="color: var(--text-secondary);">x(k+h)</span> → 
          Cost Evaluation <span style="color: var(--text-secondary);">min J</span> → 
          Optimal State Selected: <strong style="color: var(--accent-teal);">${optimalId}</strong> → 
          Apply to Signal → Repeat Next Step
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }
};
