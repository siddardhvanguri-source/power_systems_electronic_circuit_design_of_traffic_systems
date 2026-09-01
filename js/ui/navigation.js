/**
 * TRAFFIC × POWER SYSTEMS RESEARCH WORKSPACE
 * Navigation, Search, Reading Mode & Print Handlers
 */

window.AppNav = {
  activeTopicId: "topic-1",
  readingMode: false,

  init() {
    this.renderSidebar();
    this.setupScrollSpy();
    this.setupSearch();
  },

  renderSidebar() {
    const sidebar = document.getElementById("sidebar-nav-container");
    if (!sidebar) return;

    let html = "";
    window.RESEARCH_DATA.modules.forEach(mod => {
      html += `<div class="sidebar-heading">${mod.title}</div><ul class="sidebar-nav-list">`;
      mod.topics.forEach(topic => {
        html += `
          <li class="sidebar-nav-item" id="nav-item-${topic.id}">
            <a href="#${topic.id}" onclick="AppNav.onNavClick('${topic.id}', event)">
              <span class="sidebar-num">${topic.num}</span>
              <span style="flex: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${topic.title}</span>
            </a>
          </li>
        `;
      });
      html += `</ul>`;
    });

    sidebar.innerHTML = html;
  },

  onNavClick(topicId, event) {
    if (event) event.preventDefault();
    this.activeTopicId = topicId;
    this.highlightActive(topicId);

    const targetElem = document.getElementById(topicId);
    if (targetElem) {
      const headerOffset = 70;
      const elementPosition = targetElem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  },

  highlightActive(topicId) {
    document.querySelectorAll(".sidebar-nav-item").forEach(el => el.classList.remove("active"));
    const activeEl = document.getElementById(`nav-item-${topicId}`);
    if (activeEl) {
      activeEl.classList.add("active");
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  },

  setupScrollSpy() {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.checkScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    });
  },

  checkScrollPosition() {
    const sections = document.querySelectorAll(".research-topic-section");
    const scrollPos = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const sec = sections[i];
      if (sec.offsetTop <= scrollPos) {
        if (this.activeTopicId !== sec.id) {
          this.activeTopicId = sec.id;
          this.highlightActive(sec.id);
        }
        break;
      }
    }
  },

  setupSearch() {
    const input = document.getElementById("global-search-input");
    const resultsContainer = document.getElementById("search-results-popup");
    if (!input || !resultsContainer) return;

    input.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length < 2) {
        resultsContainer.style.display = "none";
        return;
      }

      const matches = [];
      window.RESEARCH_DATA.modules.forEach(mod => {
        mod.topics.forEach(t => {
          if (t.title.toLowerCase().includes(query) || t.summary.toLowerCase().includes(query) || t.content.toLowerCase().includes(query)) {
            matches.push(t);
          }
        });
      });

      if (matches.length === 0) {
        resultsContainer.innerHTML = `<div style="padding: 10px 14px; font-size: 0.8rem; color: var(--text-tertiary);">No research topics match "${query}"</div>`;
      } else {
        resultsContainer.innerHTML = matches.slice(0, 7).map(m => `
          <div class="search-result-item" onclick="AppNav.goToTopic('${m.id}')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid var(--border-subtle); transition: background 0.15s;">
            <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--accent-teal);">${m.num} · ${m.category.toUpperCase()}</div>
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary);">${m.title}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.summary}</div>
          </div>
        `).join("");
      }
      resultsContainer.style.display = "block";
    });

    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
        resultsContainer.style.display = "none";
      }
    });
  },

  goToTopic(topicId) {
    const resultsContainer = document.getElementById("search-results-popup");
    if (resultsContainer) resultsContainer.style.display = "none";
    const input = document.getElementById("global-search-input");
    if (input) input.value = "";
    this.onNavClick(topicId);
  },

  toggleReadingMode() {
    this.readingMode = !this.readingMode;
    document.body.classList.toggle("reading-mode", this.readingMode);
    const btn = document.getElementById("btn-reading-mode");
    if (btn) {
      btn.classList.toggle("active", this.readingMode);
      btn.innerHTML = this.readingMode ? `<span>📖</span> Exit Reading Mode` : `<span>📖</span> Reading Mode`;
    }
  },

  printReport() {
    window.print();
  }
};
