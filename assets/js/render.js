/*
  RENDER
  Small functions that turn content objects into HTML.
  Each function answers one question: "what does ONE item look like?"
  main.js then calls them for every item in a list.
*/
window.Render = (function () {
  "use strict";

  /*
    escape() makes text safe to put inside HTML. Without it, a title like
    "A <b> tag" would be treated as real HTML. Fields documented as
    "may contain simple HTML" (case-study text, authors) skip it on purpose,
    which is fine because only you write the content files.
  */
  function escape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function list(items, className) {
    if (!items || !items.length) return "";
    return `<ul class="${className}">${items.map((i) => `<li>${escape(i)}</li>`).join("")}</ul>`;
  }

  function isExternal(url) {
    return /^https?:\/\//.test(url);
  }

  function link(l, className = "link-arrow") {
    const ext = isExternal(l.url);
    return `<a class="${className}" href="${escape(l.url)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${escape(l.label)} <span aria-hidden="true">${ext ? "↗" : "→"}</span></a>`;
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  /* ---------- Featured project card ---------- */
  function featuredCard(p, index) {
    const meta = [p.role, p.year].filter(Boolean).join(" · ");
    return `
      <article class="project" data-reveal>
        <span class="project__index" aria-hidden="true">${pad(index + 1)}</span>
        <div class="project__body">
          <p class="project__meta mono">${escape(meta)}</p>
          <h3 class="project__title">${escape(p.title)}</h3>
          <p class="project__summary">${escape(p.summary)}</p>
          ${list(p.highlights, "chips")}
          ${list(p.tags, "tags")}
        </div>
        <div class="project__actions">
          ${p.caseStudy ? `<button class="btn btn--primary" type="button" data-open-case="${escape(p.id)}">Read case study <span aria-hidden="true">→</span></button>` : ""}
          ${(p.links || []).slice(0, 1).map((l) => link(l)).join("")}
        </div>
      </article>`;
  }

  /* ---------- University project card ---------- */
  function universityCard(p) {
    const more = p.featured
      ? `<a class="link-arrow uni-card__more" href="#case/${escape(p.id)}" data-open-case="${escape(p.id)}">Read the case study <span aria-hidden="true">→</span></a>`
      : (p.links || []).map((l) => link(l, "link-arrow uni-card__more")).join("");
    return `
      <article class="uni-card">
        <p class="uni-card__course mono">${escape(p.university.course)}</p>
        <h4 class="uni-card__title">${escape(p.title)}</h4>
        <p class="uni-card__summary">${escape(p.summary)}</p>
        ${p.role ? `<p class="uni-card__role">${escape(p.role)}</p>` : ""}
        ${p.learned ? `<p class="uni-card__learned"><b>Learned:</b> ${escape(p.learned)}</p>` : ""}
        ${more}
        ${list(p.tags, "tags")}
      </article>`;
  }

  /* Groups university projects by semester, newest semester first */
  function semesters(projects) {
    const bySemester = new Map();
    projects.forEach((p) => {
      const key = p.university.semester;
      if (!bySemester.has(key)) bySemester.set(key, []);
      bySemester.get(key).push(p);
    });
    return [...bySemester.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([semester, items]) => {
        const years = [...new Set(items.map((p) => p.year))].join(" / ");
        return `
          <li class="semester" data-reveal>
            <div class="semester__label">
              <span class="semester__num">Sem ${escape(semester)}</span>
              <span class="semester__year mono">${escape(years)} · ${items.length} project${items.length > 1 ? "s" : ""}</span>
            </div>
            <div class="uni-list">${items.map(universityCard).join("")}</div>
          </li>`;
      })
      .join("");
  }

  /* ---------- Other (personal) project card ---------- */
  function otherCard(p) {
    return `
      <article class="uni-card" data-reveal>
        <p class="uni-card__course mono">${escape(p.year)}</p>
        <h3 class="uni-card__title">${escape(p.title)}</h3>
        <p class="uni-card__summary">${escape(p.summary)}</p>
        ${(p.links || []).map((l) => link(l, "link-arrow uni-card__more")).join("")}
        ${list(p.tags, "tags")}
      </article>`;
  }

  /* ---------- Research entry ---------- */
  function paper(r) {
    return `
      <article class="paper" data-reveal>
        ${r.status ? `<span class="paper__status mono">${escape(r.status)}</span>` : ""}
        <h3 class="paper__title">${escape(r.title)}</h3>
        <p class="paper__authors">${r.authors}</p>
        <p class="paper__venue">${escape(r.venue)} · ${escape(r.year)}</p>
        <div class="project__actions">${(r.links || []).map((l) => link(l)).join("")}</div>
      </article>`;
  }

  /* ---------- Journey ---------- */
  function timelineItem(t) {
    return `
      <li class="timeline__item timeline__item--${escape(t.kind || "past")}" data-reveal>
        <span class="timeline__when mono">${escape(t.when)}</span>
        <h3 class="timeline__title">${escape(t.title)}</h3>
        ${t.body ? `<p class="timeline__body">${escape(t.body)}</p>` : ""}
      </li>`;
  }

  function education(e) {
    return `
      <div class="edu" data-reveal>
        <p class="edu__school">${escape(e.school)}</p>
        <p class="edu__degree">${escape(e.degree)}</p>
        <p class="edu__when mono">${escape(e.when)}${e.place ? " · " + escape(e.place) : ""}</p>
      </div>`;
  }

  /* ---------- Skills ---------- */
  function skillRow(s) {
    return `
      <div class="skill-row" data-reveal>
        <h3 class="skill-row__group">${escape(s.group)}</h3>
        ${list(s.items, "tags")}
      </div>`;
  }

  /* ---------- Certificates ---------- */
  function certificate(c) {
    const title = c.url
      ? `<a class="cert__title" href="${escape(c.url)}" target="_blank" rel="noopener">${escape(c.title)} ↗</a>`
      : `<span class="cert__title">${escape(c.title)}</span>`;
    return `<li class="cert" data-reveal>${title}<span class="cert__meta mono">${escape(c.issuer)} · ${escape(c.year)}</span></li>`;
  }

  /* ---------- Case study (inside the dialog) ---------- */
  function chart(c) {
    const max = Math.max(...c.bars.map((b) => b.value));
    const rows = c.bars
      .map(
        (b, i) => `
        <div class="chart__row">
          <span class="chart__label">${escape(b.label)}</span>
          <span class="chart__track">
            <span class="chart__bar${b.emphasis ? " chart__bar--emphasis" : ""}" style="width:${((b.value / max) * 80).toFixed(1)}%; --i:${i}"></span>
            <span class="chart__value">${escape(b.value)} ${escape(c.unit)}</span>
          </span>
        </div>`
      )
      .join("");
    const summary = c.bars.map((b) => `${b.label}: ${b.value} ${c.unit}`).join(", ");
    return `
      <figure class="chart">
        <div class="chart__rows" role="img" aria-label="${escape(c.caption + ". " + summary)}">${rows}</div>
        <figcaption>${escape(c.caption)}</figcaption>
      </figure>`;
  }

  function caseStudy(p) {
    const cs = p.caseStudy;
    const hard = (cs.hard || [])
      .map((h) => `<h4>${escape(h.title)}</h4><p>${h.body}</p>`)
      .join("");
    return `
      <div class="case__top">
        <div>
          <p class="project__meta mono">${escape([p.role, p.year].filter(Boolean).join(" · "))}</p>
          <h2 class="case__title" id="case-title">${escape(p.title)}</h2>
        </div>
        <button class="icon-btn case__close" type="button" data-close-case aria-label="Close case study">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      ${list(p.highlights, "chips")}
      <section class="case__section"><h3>What it is</h3><p>${cs.what}</p></section>
      ${hard ? `<section class="case__section"><h3>The hard part</h3>${hard}</section>` : ""}
      ${cs.chart ? chart(cs.chart) : ""}
      ${cs.result ? `<section class="case__section"><h3>Result</h3><p>${cs.result}</p></section>` : ""}
      ${cs.reflection ? `<section class="case__section case__reflection"><h3>What I'd do differently</h3><p>${cs.reflection}</p></section>` : ""}
      ${list(p.tags, "tags")}
      <div class="project__actions">${(p.links || []).map((l) => link(l)).join("")}</div>`;
  }

  return {
    escape,
    featuredCard,
    semesters,
    otherCard,
    paper,
    timelineItem,
    education,
    skillRow,
    certificate,
    caseStudy,
  };
})();
