/*
  MAIN
  The entry point. Runs after all content and code files have loaded:
  1. checks the content files for mistakes,
  2. fills every section with content,
  3. hides sections that have nothing to show,
  4. switches on the interactive parts.
*/
(function () {
  "use strict";

  const C = window.CONTENT || {};
  const site = C.site || {};

  /* ---------- 1. Check content (open DevTools → Console to see warnings) ---------- */
  const REQUIRED = {
    projects: ["id", "title", "summary", "year", "tags"],
    research: ["title", "authors", "venue", "year"],
    journey: ["when", "title", "kind"],
    certificates: ["title", "issuer", "year"],
  };

  function validate(name, items) {
    const fields = REQUIRED[name] || [];
    const ids = new Set();
    items.forEach((item, i) => {
      const label = `content/${name}.js → item #${i + 1}${item.title ? ` ("${item.title}")` : ""}`;
      fields.forEach((f) => {
        if (item[f] === undefined || item[f] === "") console.warn(`${label} is missing "${f}".`);
      });
      if (item.id) {
        if (ids.has(item.id)) console.warn(`${label}: id "${item.id}" is used twice.`);
        ids.add(item.id);
      }
      if (item.featured && !item.caseStudy) console.warn(`${label} is featured but has no caseStudy.`);
      if (item.university && !item.university.semester) console.warn(`${label}: university needs a semester.`);
    });
  }

  // Drafts are removed here, before anything is shown.
  function published(name) {
    const items = Array.isArray(C[name]) ? C[name] : [];
    validate(name, items);
    return items.filter((item) => !item.draft);
  }

  const projects = published("projects");
  const research = published("research");
  const journey = published("journey");
  const certificates = published("certificates");
  const skills = Array.isArray(C.skills) ? C.skills : [];
  const educationList = Array.isArray(C.education) ? C.education : [];

  const featured = projects.filter((p) => p.featured);
  const university = projects.filter((p) => p.university);
  const other = projects.filter((p) => !p.featured && !p.university);

  /* ---------- 2. Fill sections ---------- */
  function fill(name, html) {
    const target = document.querySelector(`[data-render="${name}"]`);
    if (target) target.innerHTML = html;
  }

  // A section with no items hides itself, so the site never looks empty.
  function showSection(name, hasItems) {
    const section = document.querySelector(`[data-section="${name}"]`);
    if (section) section.hidden = !hasItems;
    if (!hasItems) {
      const navLink = document.querySelector(`.nav__menu a[href="#${section?.id}"]`);
      if (navLink) navLink.hidden = true;
    }
  }

  fill("featured", featured.map(Render.featuredCard).join(""));
  fill("university", Render.semesters(university));
  fill("other", other.map(Render.otherCard).join(""));
  fill("research", research.map(Render.paper).join(""));
  fill("journey", journey.map(Render.timelineItem).join(""));
  fill("education", educationList.map(Render.education).join(""));
  fill("skills", skills.map(Render.skillRow).join(""));
  fill("certificates", certificates.map(Render.certificate).join(""));

  showSection("featured", featured.length > 0);
  showSection("university", university.length > 0);
  showSection("other", other.length > 0);
  showSection("research", research.length > 0);
  showSection("journey", journey.length > 0);
  showSection("skills", skills.length > 0);
  showSection("certificates", certificates.length > 0);

  // Marquee: all skill items, repeated twice so the loop is seamless.
  const marquee = document.querySelector("[data-marquee]");
  if (marquee) {
    const words = skills.flatMap((s) => s.items).slice(0, 14);
    const row = words.map((w) => `<span>${Render.escape(w)}</span>`).join("");
    marquee.innerHTML = row + row;
  }

  /* ---------- Site info (links, status, learning list…) ---------- */
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const value = site[el.dataset.bind];
    if (value) el.textContent = value;
  });

  const learning = document.querySelector('[data-list="learning"]');
  if (learning) {
    const items = site.learning || [];
    learning.innerHTML = items.map((i) => `<li>${Render.escape(i)}</li>`).join("");
    const row = learning.closest(".facts > div");
    if (row && !items.length) row.hidden = true;
  }

  const LINK_BUILDERS = {
    email: (v) => "mailto:" + v,
    github: (v) => v,
    linkedin: (v) => v,
    cv: (v) => v,
  };
  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    const value = site[key];
    const holder = el.closest("li") || el;
    if (!value) { holder.hidden = true; return; }
    el.href = LINK_BUILDERS[key](value);
    if (key === "email") el.textContent = value;
  });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 3. Interactive parts ---------- */
  UI.initTheme();
  UI.initNav();
  UI.splitText();
  UI.initReveal();
  UI.initCopyEmail(site.email);
  UI.initCaseStudies((id) => projects.find((p) => p.id === id));
  Donut.start(document.querySelector("[data-donut]"));
})();
