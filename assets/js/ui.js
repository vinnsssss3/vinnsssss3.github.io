/*
  UI
  Interactive behaviour: theme toggle, navigation, scroll effects,
  the case-study dialog and the "copy email" button.
*/
window.UI = (function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Theme (light / dark) ---------- */
  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function initTheme() {
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    button.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) { /* private mode: fine */ }
    });
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    const nav = document.querySelector("[data-nav]");
    const toggle = document.querySelector("[data-menu-toggle]");
    const links = [...document.querySelectorAll(".nav__menu a")];
    const progress = document.querySelector(".progress");
    if (!nav) return;

    function setMenu(open) {
      nav.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("menu-open")));
    links.forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

    // Hide the nav when scrolling down, show it when scrolling up.
    let lastY = window.scrollY;
    let ticking = false;
    function onScroll() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
      nav.classList.toggle("is-scrolled", y > 10);
      if (!nav.classList.contains("menu-open")) {
        nav.classList.toggle("is-hidden", y > lastY && y > 400);
      }
      lastY = y;
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    // Underline the menu link of the section currently on screen.
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Hero title: split into letters ---------- */
  function splitText() {
    document.querySelectorAll("[data-split] .line").forEach((line, lineIndex) => {
      let i = lineIndex * 7;
      const walk = (node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            [...child.textContent].forEach((ch) => {
              const span = document.createElement("span");
              span.className = "char";
              span.style.setProperty("--i", i++);
              span.textContent = ch;
              frag.appendChild(span);
            });
            child.replaceWith(frag);
          } else {
            walk(child);
          }
        });
      };
      walk(line);
    });
    // Screen readers should read the name as a word, not letter by letter.
    document.querySelectorAll("[data-split]").forEach((el) => {
      el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
      [...el.children].forEach((c) => c.setAttribute("aria-hidden", "true"));
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const targets = document.querySelectorAll("[data-reveal], [data-split], .chart");
    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    // Items that sit next to each other appear one after another.
    targets.forEach((el) => {
      const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal")) : [];
      const index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty("--delay", Math.min(index, 6) * 0.08 + "s");
      io.observe(el);
    });
  }

  /* ---------- Toast + copy email ---------- */
  let toastTimer;
  function toast(message) {
    const el = document.querySelector("[data-toast]");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
  }

  function initCopyEmail(email) {
    const button = document.querySelector("[data-copy-email]");
    if (!button || !email) return;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        toast("Email copied ✓");
      } catch (e) {
        toast(email);
      }
    });
  }

  /* ---------- Case-study dialog ---------- */
  function initCaseStudies(findProject) {
    const dialog = document.querySelector("[data-case-dialog]");
    const body = document.querySelector("[data-case-body]");
    if (!dialog || typeof dialog.showModal !== "function") return;
    let opener = null;

    function open(id, trigger) {
      const project = findProject(id);
      if (!project || !project.caseStudy) return;
      opener = trigger || null;
      body.innerHTML = Render.caseStudy(project);
      dialog.showModal();
      dialog.scrollTop = 0;
      history.replaceState(null, "", "#case/" + id);
      const chart = body.querySelector(".chart");
      if (chart) requestAnimationFrame(() => requestAnimationFrame(() => chart.classList.add("is-in")));
    }

    function close() {
      if (dialog.open) dialog.close();
    }

    dialog.addEventListener("close", () => {
      history.replaceState(null, "", location.pathname + location.search);
      if (opener) opener.focus();
    });
    // Click on the dark backdrop closes it.
    dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); });

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-open-case]");
      if (trigger) {
        e.preventDefault();
        open(trigger.dataset.openCase, trigger);
        return;
      }
      if (e.target.closest("[data-close-case]")) close();
    });

    // Shareable links: yoursite/#case/harmoney opens that case study directly.
    const match = location.hash.match(/^#case\/(.+)$/);
    if (match) open(decodeURIComponent(match[1]));
  }

  return { initTheme, initNav, splitText, initReveal, initCopyEmail, initCaseStudies, toast };
})();
