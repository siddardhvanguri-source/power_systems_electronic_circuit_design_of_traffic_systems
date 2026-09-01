/**
 * TRAFFIC × POWER SYSTEMS — RESEARCH CONTROL ROOM
 * Master Application Orchestrator
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Views, Sections, and Data Displays
  if (window.AppViews) {
    window.AppViews.renderAll();
  }

  // 2. Initialize Interactive Simulation Engines
  if (window.NetworkSim) window.NetworkSim.init("network-stage");
  if (window.SwitchMatrix) window.SwitchMatrix.init("switch-diagram-stage");
  if (window.CascadeSim) window.CascadeSim.init("cascade-sim-stage");
  if (window.ContingencySim) window.ContingencySim.init("contingency-sim-stage");
  if (window.FcsMpcSim) window.FcsMpcSim.init("fcs-mpc-stage");

  // 3. Scroll Progress Indicator
  const progressBar = document.getElementById("progress");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (progressBar) {
      progressBar.style.width = (max ? (window.scrollY / max) * 100 : 0) + "%";
    }
  }, { passive: true });

  // 4. Scroll Reveal Intersection Observer
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // 5. Reference Anchors Live Filter
  const refInput = document.getElementById("refSearch");
  if (refInput) {
    window.filterRefs = function () {
      const q = refInput.value.toLowerCase();
      document.querySelectorAll(".ref").forEach(x => {
        x.style.display = x.innerText.toLowerCase().includes(q) ? "block" : "none";
      });
    };
    refInput.addEventListener("input", window.filterRefs);
  }

  // 6. Seven Layers Expand/Collapse Handler
  window.AppViews.toggleAnalogyLayer = function (level) {
    const body = document.getElementById(`layer-body-${level}`);
    if (body) {
      const isVisible = body.style.display === "block";
      body.style.display = isVisible ? "none" : "block";
    }
  };

  // 7. KaTeX Mathematical Typesetting
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false
    });
  }

  console.log("Traffic × Power Systems Research Control Room initialized successfully.");
});
