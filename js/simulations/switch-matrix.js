/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Signal-as-Switch Interactive Controller & Phase Matrix (Section 14)
 * Represents a 4-way intersection as a multi-pole semiconductor switching bridge
 */

window.SwitchMatrix = {
  activeState: "S1",
  autoCycleTimer: null,

  states: {
    S1: {
      id: "S1",
      name: "Phase 1: North ↔ South Through & Right",
      allowed: ["North → South", "South → North", "North → West", "South → East"],
      blocked: ["East → West", "West → East", "West → North", "East → South"],
      trafficLights: { north: "green", south: "green", east: "red", west: "red" },
      electricalSwitch: "SW1=CLOSED, SW2=CLOSED, SW3=OPEN, SW4=OPEN",
      minGreen: 15,
      maxGreen: 55,
      yellow: 3.5,
      allRed: 2.0,
      switchingDelay: "5.5s lost time"
    },
    S2: {
      id: "S2",
      name: "Phase 2: East ↔ West Through & Right",
      allowed: ["East → West", "West → East", "East → North", "West → South"],
      blocked: ["North → South", "South → North", "North → East", "South → West"],
      trafficLights: { north: "red", south: "red", east: "green", west: "green" },
      electricalSwitch: "SW1=OPEN, SW2=OPEN, SW3=CLOSED, SW4=CLOSED",
      minGreen: 15,
      maxGreen: 60,
      yellow: 3.5,
      allRed: 2.0,
      switchingDelay: "5.5s lost time"
    },
    S3: {
      id: "S3",
      name: "Phase 3: Protected North-Left & South-Left Turns",
      allowed: ["North → East (Left)", "South → West (Left)"],
      blocked: ["North → South", "South → North", "East → West", "West → East"],
      trafficLights: { north: "amber", south: "amber", east: "red", west: "red" },
      electricalSwitch: "SW_L1=CLOSED, SW_L2=CLOSED, Mains=OPEN",
      minGreen: 10,
      maxGreen: 25,
      yellow: 3.0,
      allRed: 1.5,
      switchingDelay: "4.5s lost time"
    },
    S4: {
      id: "S4",
      name: "Phase 4: All-Red Safety Clearance Transition",
      allowed: ["None (Intersection Clearing)"],
      blocked: ["All Approach Arms (North, South, East, West)"],
      trafficLights: { north: "red", south: "red", east: "red", west: "red" },
      electricalSwitch: "ALL SWITCHES OPEN (High-Z Dead Time)",
      minGreen: 0,
      maxGreen: 3,
      yellow: 0.0,
      allRed: 3.0,
      switchingDelay: "3.0s non-conduction dead-time"
    }
  },

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  },

  setState(stateId) {
    if (!this.states[stateId]) return;
    this.activeState = stateId;
    this.render();
  },

  toggleAutoCycle() {
    if (this.autoCycleTimer) {
      clearInterval(this.autoCycleTimer);
      this.autoCycleTimer = null;
      document.getElementById("btn-auto-cycle").innerText = "Auto Cycle: OFF";
      document.getElementById("btn-auto-cycle").classList.remove("active");
    } else {
      const stateKeys = ["S1", "S4", "S2", "S4", "S3", "S4"];
      let idx = 0;
      this.autoCycleTimer = setInterval(() => {
        idx = (idx + 1) % stateKeys.length;
        this.setState(stateKeys[idx]);
      }, 2400);
      document.getElementById("btn-auto-cycle").innerText = "Auto Cycle: ON";
      document.getElementById("btn-auto-cycle").classList.add("active");
    }
  },

  render() {
    const s = this.states[this.activeState];
    if (!this.container || !s) return;

    const northColor = s.trafficLights.north === "green" ? "#1B7F4B" : s.trafficLights.north === "amber" ? "#9A6700" : "#B52626";
    const southColor = s.trafficLights.south === "green" ? "#1B7F4B" : s.trafficLights.south === "amber" ? "#9A6700" : "#B52626";
    const eastColor = s.trafficLights.east === "green" ? "#1B7F4B" : "#B52626";
    const westColor = s.trafficLights.west === "green" ? "#1B7F4B" : "#B52626";

    this.container.innerHTML = `
      <div class="switch-diagram-grid">
        <!-- Visual Schematic Stage -->
        <div class="switch-visual-stage">
          <svg width="340" height="340" viewBox="0 0 340 340">
            <!-- Road Cross Geometry -->
            <rect x="130" y="10" width="80" height="320" fill="#E6ECF1" rx="4" />
            <rect x="10" y="130" width="320" height="80" fill="#E6ECF1" rx="4" />
            <rect x="130" y="130" width="80" height="80" fill="#CBD5DF" />
            
            <!-- Road Dashed Centerlines -->
            <line x1="170" y1="10" x2="170" y2="125" stroke="#FFF" stroke-width="2" stroke-dasharray="6,6" />
            <line x1="170" y1="215" x2="170" y2="330" stroke="#FFF" stroke-width="2" stroke-dasharray="6,6" />
            <line x1="10" y1="170" x2="125" y2="170" stroke="#FFF" stroke-width="2" stroke-dasharray="6,6" />
            <line x1="215" y1="170" x2="330" y2="170" stroke="#FFF" stroke-width="2" stroke-dasharray="6,6" />

            <!-- Arm Direction Labels -->
            <text x="170" y="26" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#18232D">NORTH ARM</text>
            <text x="170" y="322" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#18232D">SOUTH ARM</text>
            <text x="25" y="174" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#18232D">WEST</text>
            <text x="312" y="174" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#18232D">EAST</text>

            <!-- Signal Heads -->
            <!-- North Signal -->
            <circle cx="145" cy="115" r="9" fill="${northColor}" stroke="#18232D" stroke-width="2" />
            <!-- South Signal -->
            <circle cx="195" cy="225" r="9" fill="${southColor}" stroke="#18232D" stroke-width="2" />
            <!-- West Signal -->
            <circle cx="115" cy="195" r="9" fill="${westColor}" stroke="#18232D" stroke-width="2" />
            <!-- East Signal -->
            <circle cx="225" cy="145" r="9" fill="${eastColor}" stroke="#18232D" stroke-width="2" />

            <!-- Central Switch Matrix Core -->
            <rect x="145" y="145" width="50" height="50" rx="3" fill="#FFFFFF" stroke="#087B77" stroke-width="2" />
            <text x="170" y="168" text-anchor="middle" font-family="monospace" font-size="11" font-weight="800" fill="#087B77">${s.id}</text>
            <text x="170" y="182" text-anchor="middle" font-family="monospace" font-size="8" fill="#5F6D79">SWITCH</text>
          </svg>
        </div>

        <!-- Switching Controls & Rules Panel -->
        <div class="switch-state-cycle-panel">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="margin: 0; font-size: 0.88rem; font-family: var(--font-mono);">FINITE SWITCHING STATE</h4>
            <button id="btn-auto-cycle" class="header-btn" onclick="SwitchMatrix.toggleAutoCycle()" style="font-size: 0.72rem;">Auto Cycle: OFF</button>
          </div>

          <div class="state-selector-bar">
            ${Object.keys(this.states).map(k => `
              <button class="state-pill-btn ${this.activeState === k ? 'active' : ''}" onclick="SwitchMatrix.setState('${k}')">
                ${k}
              </button>
            `).join("")}
          </div>

          <div style="margin-bottom: 12px;">
            <h5 style="margin: 0 0 4px 0; font-size: 0.85rem; color: var(--text-primary);">${s.name}</h5>
            <span class="mono-tag" style="background: var(--surface-secondary);">${s.electricalSwitch}</span>
          </div>

          <ul class="switch-rules-list">
            <li>
              <span style="color: var(--status-green); font-weight: 600;">✓ Permitted Movements:</span>
              <span style="font-family: var(--font-mono); text-align: right;">${s.allowed.join("<br>")}</span>
            </li>
            <li>
              <span style="color: var(--status-red); font-weight: 600;">✗ Blocked Movements:</span>
              <span style="font-family: var(--font-mono); text-align: right;">${s.blocked.join("<br>")}</span>
            </li>
            <li>
              <span style="color: var(--text-secondary);">Minimum Green Constraint:</span>
              <span class="mono-tag">${s.minGreen} s</span>
            </li>
            <li>
              <span style="color: var(--text-secondary);">Maximum Green Ceiling:</span>
              <span class="mono-tag">${s.maxGreen} s</span>
            </li>
            <li>
              <span style="color: var(--text-secondary);">Clearance Interval (Yellow + All-Red):</span>
              <span class="mono-tag">${s.yellow + s.allRed} s</span>
            </li>
            <li>
              <span style="color: var(--accent-amber); font-weight: 600;">Switching Loss Equivalent:</span>
              <span class="mono-tag" style="color: var(--accent-amber);">${s.switchingDelay}</span>
            </li>
          </ul>
        </div>
      </div>
    `;
  }
};
