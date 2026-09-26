# vinnsssss3.github.io

My personal website: **https://vinnsssss3.github.io**

Hand-built with plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

---

## How the project is organised

```
website/
├── index.html            ← the page skeleton (sections, headings, hero text)
├── 404.html              ← shown when someone opens a link that doesn't exist
├── .nojekyll             ← tells GitHub Pages to serve files as they are
├── content/              ← YOUR CONTENT: edit these files
│   ├── site.js           ←   name, email, links, CV, "currently learning"
│   ├── projects.js       ←   every project (featured, university, other)
│   ├── research.js       ←   papers
│   ├── journey.js        ←   education + timeline
│   ├── skills.js         ←   skill groups
│   └── certificates.js   ←   certificates (section hidden while empty)
└── assets/
    ├── css/
    │   ├── fonts.css      ← loads the font files
    │   ├── tokens.css     ← colours, fonts, sizes (the "design system")
    │   ├── base.css       ← default look of plain elements (body, links, headings)
    │   ├── layout.css     ← page structure: nav, hero, sections, footer
    │   ├── components.css ← reusable pieces: buttons, cards, timeline, dialog
    │   └── motion.css     ← animations (and turning them off for "reduce motion")
    ├── js/
    │   ├── render.js      ← turns one content item into HTML (one function per item type)
    │   ├── ui.js          ← theme toggle, menu, scroll effects, case-study popup
    │   ├── donut.js       ← the spinning ASCII donut in the hero
    │   └── main.js        ← entry point: checks content → fills sections → starts UI
    ├── fonts/             ← self-hosted font files (free, SIL Open Font License)
    └── img/               ← favicon + og-image.png (the preview image for link sharing)
```

**The one idea behind this structure: content is separate from design.**
You add a project by editing `content/projects.js`. The design code never changes,
so the site works the same with 3 projects or 30.

---


