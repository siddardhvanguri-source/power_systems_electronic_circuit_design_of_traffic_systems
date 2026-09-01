/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Small-Town Network Interactive Visualization Engine
 * Supports Dual View: Traffic View vs Electrical Analogy View
 */

window.NetworkSim = {
  currentView: "traffic", // "traffic" or "electrical"
  selectedElement: null,
  isAnimating: true,

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
    this.selectNode("J2"); // Default selection
  },

  setViewMode(mode) {
    this.currentView = mode;
    const trafficBtn = document.getElementById("btn-view-traffic");
    const elecBtn = document.getElementById("btn-view-electrical");
    if (trafficBtn && elecBtn) {
      if (mode === "traffic") {
        trafficBtn.classList.add("active");
        elecBtn.classList.remove("active");
      } else {
        elecBtn.classList.add("active");
        trafficBtn.classList.remove("active");
      }
    }
    this.render();
    if (this.selectedElement) {
      if (this.selectedElement.type === "node") this.selectNode(this.selectedElement.id);
      else this.selectRoad(this.selectedElement.id);
    }
  },

  render() {
    const data = window.NETWORK_MODEL;
    if (!data || !this.container) return;

    let svgHtml = `
      <svg class="network-svg" viewBox="0 0 860 510" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arrow-traffic" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#5F6D79" />
          </marker>
          <marker id="arrow-elec" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#087B77" />
          </marker>
          <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#18232D" flood-opacity="0.12" />
          </filter>
        </defs>

        <!-- Grid Background Pattern -->
        <g stroke="#E6ECF1" stroke-width="1" stroke-dasharray="2, 6">
          ${Array.from({ length: 9 }).map((_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="510" />`).join("")}
          ${Array.from({ length: 6 }).map((_, i) => `<line x1="0" y1="${i * 100}" x2="860" y2="${i * 100}" />`).join("")}
        </g>

        <!-- Network Branches (Roads / Transmission Lines) -->
        <g id="network-edges">
    `;

    // Render Edges
    data.roads.forEach(road => {
      const src = data.nodes.find(n => n.id === road.source);
      const tgt = data.nodes.find(n => n.id === road.target);
      if (!src || !tgt) return;

      const midX = (src.x + tgt.x) / 2;
      const midY = (src.y + tgt.y) / 2;

      // Color based on loading
      let strokeColor = "#CBD5DF";
      if (this.currentView === "traffic") {
        if (road.loadingPct >= 85) strokeColor = "#B52626"; // Overload
        else if (road.loadingPct >= 70) strokeColor = "#9A6700"; // Heavy
        else strokeColor = "#087B77"; // Nominal
      } else {
        // Electrical view: impedance/loss
        strokeColor = road.electrical.lossKW > 8.0 ? "#9A6700" : "#087B77";
      }

      const strokeWidth = Math.max(3, Math.min(8, road.loadingPct / 14));
      const markerId = this.currentView === "traffic" ? "url(#arrow-traffic)" : "url(#arrow-elec)";
      const animClass = this.isAnimating ? "flow-animating" : "";

      svgHtml += `
        <g class="net-edge-group" onclick="NetworkSim.selectRoad('${road.id}')">
          <line class="net-edge ${animClass}" x1="${src.x}" y1="${src.y}" x2="${tgt.x}" y2="${tgt.y}"
                stroke="${strokeColor}" stroke-width="${strokeWidth}" marker-end="${markerId}" />
          
          <!-- Background pill for edge label -->
          <rect x="${midX - 22}" y="${midY - 10}" width="44" height="18" rx="3" fill="#FFFFFF" stroke="#D9E1E7" stroke-width="1" />
          <text class="net-edge-label" x="${midX}" y="${midY + 2}" text-anchor="middle" dominant-baseline="middle">
            ${this.currentView === "traffic" ? road.id + ': ' + road.loadingPct + '%' : road.id + ': ' + road.electrical.currentA + 'A'}
          </text>
        </g>
      `;
    });

    svgHtml += `</g><!-- Network Nodes (Intersections / Buses) --><g id="network-nodes">`;

    // Render Nodes
    data.nodes.forEach(node => {
      let nodeFill = "#FFFFFF";
      let nodeStroke = "#087B77";
      let ringColor = "#087B77";

      if (this.currentView === "traffic") {
        if (node.currentLoad >= 85) { ringColor = "#B52626"; nodeFill = "#FDF1F1"; }
        else if (node.currentLoad >= 70) { ringColor = "#9A6700"; nodeFill = "#FDF7EC"; }
        else { ringColor = "#087B77"; nodeFill = "#EDF7F6"; }
      } else {
        nodeFill = node.electricalBus.voltage < 0.96 ? "#FDF7EC" : "#EDF7F6";
        ringColor = "#087B77";
      }

      svgHtml += `
        <g class="net-node-group" onclick="NetworkSim.selectNode('${node.id}')">
          <!-- Outer status ring -->
          <circle class="net-node-circle" cx="${node.x}" cy="${node.y}" r="22" fill="${nodeFill}" stroke="${ringColor}" stroke-width="2.5" filter="url(#node-shadow)" />
          
          <!-- Node Label -->
          <text class="net-node-label" x="${node.x}" y="${node.y}">${node.id}</text>
          
          <!-- Subtitle telemetry badge -->
          <text class="net-telemetry-badge" x="${node.x}" y="${node.y + 34}">
            ${this.currentView === "traffic" ? node.signalState + ' · ' + node.queueLength + 'v' : node.electricalBus.voltage.toFixed(2) + ' pu'}
          </text>
        </g>
      `;
    });

    svgHtml += `</g></svg>`;

    // Float Inspector Panel
    svgHtml += `
      <div id="net-inspector" class="net-inspector-panel">
        <div class="inspector-title">
          <span id="inspector-heading">ELEMENT INSPECTOR</span>
          <span id="inspector-badge" class="mono-tag">READY</span>
        </div>
        <div id="inspector-body">
          <p style="color: var(--text-secondary); font-size: 0.78rem;">Click any intersection node or road link to inspect mathematical telemetry.</p>
        </div>
      </div>
    `;

    this.container.innerHTML = svgHtml;
  },

  selectNode(nodeId) {
    const node = window.NETWORK_MODEL.nodes.find(n => n.id === nodeId);
    if (!node) return;
    this.selectedElement = { type: "node", id: nodeId };

    const heading = document.getElementById("inspector-heading");
    const badge = document.getElementById("inspector-badge");
    const body = document.getElementById("inspector-body");
    if (!heading || !body) return;

    heading.innerText = `${node.id}: ${node.name.split('(')[1].replace(')', '')}`;
    badge.innerText = this.currentView === "traffic" ? `SIGNAL ${node.signalState}` : node.electricalBus.busType.split(' ')[0];

    if (this.currentView === "traffic") {
      body.innerHTML = `
        <div class="inspector-row"><span class="inspector-label">Inflow Demand:</span><span class="inspector-val">${node.inflow} veh/h</span></div>
        <div class="inspector-row"><span class="inspector-label">Outflow Throughput:</span><span class="inspector-val">${node.outflow} veh/h</span></div>
        <div class="inspector-row"><span class="inspector-label">Queue Accumulation:</span><span class="inspector-val" style="color: ${node.queueLength > 20 ? 'var(--accent-amber)' : 'inherit'}">${node.queueLength} vehicles</span></div>
        <div class="inspector-row"><span class="inspector-label">Nodal Capacity:</span><span class="inspector-val">${node.capacity} veh/h</span></div>
        <div class="inspector-row"><span class="inspector-label">Capacity Loading:</span><span class="inspector-val">${node.currentLoad}%</span></div>
        <div class="inspector-row"><span class="inspector-label">Active Phase:</span><span class="inspector-val mono-tag">${node.signalCycles[node.signalState] || node.signalState}</span></div>
        <div class="loading-bar-track">
          <div class="loading-bar-fill ${node.currentLoad >= 85 ? 'danger' : node.currentLoad >= 70 ? 'amber' : 'normal'}" style="width: ${node.currentLoad}%"></div>
        </div>
        <div style="margin-top: 8px; font-size: 0.72rem; color: var(--text-tertiary);">
          <strong>Connected Turn Movements:</strong><br>
          ${Object.entries(node.turningRatios).map(([k, v]) => `→ ${k}: ${(v * 100).toFixed(0)}%`).join(' | ')}
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="inspector-row"><span class="inspector-label">Bus Designation:</span><span class="inspector-val">${node.electricalBus.busType}</span></div>
        <div class="inspector-row"><span class="inspector-label">Voltage Potential (|V|):</span><span class="inspector-val">${node.electricalBus.voltage.toFixed(3)} p.u.</span></div>
        <div class="inspector-row"><span class="inspector-label">Phase Angle (δ):</span><span class="inspector-val">${node.electricalBus.angleDeg}°</span></div>
        <div class="inspector-row"><span class="inspector-label">Nodal Injected Current:</span><span class="inspector-val">${node.electricalBus.currentInj} kA equivalent</span></div>
        <div class="inspector-row"><span class="inspector-label">Equivalent Admittance:</span><span class="inspector-val">Y_ii = ${(1 / (node.currentLoad * 0.01)).toFixed(2)} ∠ -82°</span></div>
        <div style="margin-top: 8px; font-size: 0.72rem; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 6px;">
          <em>Analogy note: Kirchhoff's Current Law holds at node: ∑ I_in - ∑ I_out = dQ_node/dt.</em>
        </div>
      `;
    }
  },

  selectRoad(roadId) {
    const road = window.NETWORK_MODEL.roads.find(r => r.id === roadId);
    if (!road) return;
    this.selectedElement = { type: "road", id: roadId };

    const heading = document.getElementById("inspector-heading");
    const badge = document.getElementById("inspector-badge");
    const body = document.getElementById("inspector-body");
    if (!heading || !body) return;

    heading.innerText = `${road.id}: ${road.name}`;
    badge.innerText = this.currentView === "traffic" ? `${road.loadingPct}% LOAD` : `${road.electrical.lossKW} kW LOSS`;

    if (this.currentView === "traffic") {
      body.innerHTML = `
        <div class="inspector-row"><span class="inspector-label">Flow Rate (q):</span><span class="inspector-val">${road.flow} veh/h</span></div>
        <div class="inspector-row"><span class="inspector-label">Saturation Capacity (c):</span><span class="inspector-val">${road.capacity} veh/h</span></div>
        <div class="inspector-row"><span class="inspector-label">Link Loading (q/c):</span><span class="inspector-val" style="color: ${road.loadingPct >= 85 ? 'var(--status-red)' : road.loadingPct >= 70 ? 'var(--accent-amber)' : 'inherit'}">${road.loadingPct}%</span></div>
        <div class="inspector-row"><span class="inspector-label">Queued Storage:</span><span class="inspector-val">${road.queueVeh} vehicles</span></div>
        <div class="inspector-row"><span class="inspector-label">Mean Speed:</span><span class="inspector-val">${road.speedKmH} km/h</span></div>
        <div class="inspector-row"><span class="inspector-label">Segment Length:</span><span class="inspector-val">${road.lengthM} m</span></div>
        <div class="loading-bar-track">
          <div class="loading-bar-fill ${road.loadingPct >= 85 ? 'danger' : road.loadingPct >= 70 ? 'amber' : 'normal'}" style="width: ${road.loadingPct}%"></div>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="inspector-row"><span class="inspector-label">Equivalent Branch Current (I):</span><span class="inspector-val">${road.electrical.currentA} A</span></div>
        <div class="inspector-row"><span class="inspector-label">Branch Impedance (Z):</span><span class="inspector-val">${road.electrical.impedanceOhm} Ω</span></div>
        <div class="inspector-row"><span class="inspector-label">Joule Loss / Delay Dissipation:</span><span class="inspector-val">${road.electrical.lossKW} kW</span></div>
        <div class="inspector-row"><span class="inspector-label">Thermal Loading Rating:</span><span class="inspector-val">${road.electrical.thermalLoadingPct}%</span></div>
        <div class="loading-bar-track">
          <div class="loading-bar-fill ${road.electrical.thermalLoadingPct >= 85 ? 'danger' : road.electrical.thermalLoadingPct >= 70 ? 'amber' : 'normal'}" style="width: ${road.electrical.thermalLoadingPct}%"></div>
        </div>
        <div style="margin-top: 8px; font-size: 0.72rem; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 6px;">
          <em>Analogy note: Loss calculated as P_loss = I² · Z_branch; mirrors travel time delay in traffic.</em>
        </div>
      `;
    }
  }
};
