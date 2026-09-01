/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Cascading Congestion Propagation Simulator (Section 18)
 * Demonstrates disturbance propagation and geometric cascade:
 * Disturbance → Diversion → Overload → Spillback → Cascading Gridlock
 */

window.CascadeSim = {
  currentStep: 1,

  steps: [
    {
      step: 1,
      title: "Step 1: Normal Balanced Operation",
      status: "nominal",
      description: "All branches operating within nominal capacity. Central corridor R4 carries 1,480 veh/h (87% loading) with steady flow.",
      affectedLinks: ["R1", "R2", "R4", "R6"],
      metrics: { maxLoading: "87.1%", avgNetworkSpeed: "42.5 km/h", totalQueue: "124 veh", statusBadge: "NOMINAL" },
      highlight: []
    },
    {
      step: 2,
      title: "Step 2: Capacity Disturbance on Road R4 (Trip / Lane Closure)",
      status: "fault",
      description: "Incident occurs on Central Spine R4 (vehicle stall / lane blockage). Capacity drops abruptly from 1,700 to 600 veh/h (down 65%).",
      affectedLinks: ["R4"],
      metrics: { maxLoading: "162.0% (OVERSATURATED)", avgNetworkSpeed: "31.2 km/h", totalQueue: "185 veh", statusBadge: "DISTURBANCE DETECTED" },
      highlight: ["R4"]
    },
    {
      step: 3,
      title: "Step 3: Traffic Diversion to Alternate Corridors",
      status: "propagation",
      description: "Drivers divert around R4 bottleneck onto West Collector R3 and North Arterial R1. Inflow onto East Collector R7 surges by 45%.",
      affectedLinks: ["R1", "R3", "R6", "R7"],
      metrics: { maxLoading: "108.5%", avgNetworkSpeed: "23.4 km/h", totalQueue: "260 veh", statusBadge: "PROPAGATION" },
      highlight: ["R1", "R6", "R7"]
    },
    {
      step: 4,
      title: "Step 4: Upstream Queue Spillback into Intersection J2",
      status: "cascade",
      description: "Queue on R4 stretches 480 meters upstream, completely blocking the throat of Intersection J2. Perpendicular East-West arterial traffic stalls.",
      affectedLinks: ["J2", "R1", "R2", "R4"],
      metrics: { maxLoading: "128.0%", avgNetworkSpeed: "14.8 km/h", totalQueue: "390 veh", statusBadge: "SPILLBACK COLLAPSE" },
      highlight: ["J2", "R1", "R2"]
    },
    {
      step: 5,
      title: "Step 5: Full Network Cascading Gridlock",
      status: "blackout",
      description: "With J2 locked, J1 and J5 queues also propagate backward. 6 of 10 roads exceed 100% capacity. Gridlock mirrors a cascading power blackout.",
      affectedLinks: ["J1", "J2", "J4", "J5", "R1", "R2", "R4", "R6", "R7"],
      metrics: { maxLoading: "185.0%", avgNetworkSpeed: "6.2 km/h", totalQueue: "640 veh", statusBadge: "CASCADING GRIDLOCK" },
      highlight: ["J1", "J2", "J5", "R1", "R2", "R4", "R6", "R7"]
    }
  ],

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  },

  setStep(stepNum) {
    this.currentStep = stepNum;
    this.render();
  },

  nextStep() {
    if (this.currentStep < 5) this.setStep(this.currentStep + 1);
  },

  reset() {
    this.setStep(1);
  },

  render() {
    if (!this.container) return;
    const cur = this.steps[this.currentStep - 1];

    let html = `
      <div>
        <!-- Step Navigation Bar -->
        <div class="cascade-steps-timeline">
          <div class="cascade-progress-line"></div>
          ${this.steps.map(s => `
            <div class="cascade-step-dot ${this.currentStep === s.step ? (s.step === 2 ? 'fault' : 'active') : ''}"
                 onclick="CascadeSim.setStep(${s.step})">
              ${s.step}
            </div>
          `).join("")}
        </div>

        <!-- Metric Display Bar -->
        <div style="display: flex; gap: 12px; margin: 12px 0; background: var(--surface-secondary); padding: 10px 14px; border: 1px solid var(--border-soft); border-radius: 4px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 140px;">
            <div style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-tertiary);">MAX CORRIDOR LOADING</div>
            <div style="font-size: 0.95rem; font-weight: 800; font-family: var(--font-mono); color: ${this.currentStep >= 2 ? 'var(--status-red)' : 'var(--text-primary)'};">${cur.metrics.maxLoading}</div>
          </div>
          <div style="flex: 1; min-width: 140px;">
            <div style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-tertiary);">NETWORK MEAN SPEED</div>
            <div style="font-size: 0.95rem; font-weight: 800; font-family: var(--font-mono); color: var(--text-primary);">${cur.metrics.avgNetworkSpeed}</div>
          </div>
          <div style="flex: 1; min-width: 140px;">
            <div style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-tertiary);">SYSTEM ACCUMULATED QUEUE</div>
            <div style="font-size: 0.95rem; font-weight: 800; font-family: var(--font-mono); color: var(--accent-amber);">${cur.metrics.totalQueue}</div>
          </div>
          <div style="display: flex; align-items: center;">
            <span class="badge ${this.currentStep === 1 ? 'badge-established' : this.currentStep === 2 ? 'badge-rejected' : 'badge-hypothesis'}">
              ${cur.metrics.statusBadge}
            </span>
          </div>
        </div>

        <!-- Narrative Card -->
        <div class="cascade-narrative-card">
          <h5>${cur.title}</h5>
          <p style="font-size: 0.85rem; color: var(--text-primary); margin-bottom: 8px;">${cur.description}</p>
          <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-tertiary);">
            <strong>Critically Impacted Components:</strong> ${cur.highlight.length > 0 ? cur.highlight.join(', ') : 'None (System nominal)'}
          </div>
        </div>

        <!-- Step Action Buttons -->
        <div style="display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end;">
          <button class="header-btn" onclick="CascadeSim.reset()">Reset to Baseline</button>
          <button class="header-btn active" onclick="CascadeSim.nextStep()" ${this.currentStep === 5 ? 'disabled' : ''}>
            ${this.currentStep === 5 ? 'Cascade Complete' : 'Next Propagation Step →'}
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }
};
