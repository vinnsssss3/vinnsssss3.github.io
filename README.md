# vinnsssss3.github.io

My personal website: **https://vinnsssss3.github.io**

Hand-built with plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

---

## 1. How the project is organised

```
website/
├── index.html            ← the page skeleton (sections, headings, hero text)
├── 404.html              ← shown when someone opens a link that doesn't exist
├── .nojekyll             ← tells GitHub Pages to serve files as they are
├── content/              ← ✏️ YOUR CONTENT: edit these files
│   ├── site.js           ←   name, email, links, CV, "currently learning"
│   ├── projects.js       ←   every project (featured, university, other)
│   ├── research.js       ←   papers
│   ├── journey.js        ←   education + timeline
│   ├── skills.js         ←   skill groups
│   └── certificates.js   ←   certificates (section hidden while empty)
└── assets/
    ├── css/
    │   ├── fonts.css      ← loads the font files
    │   ├── tokens.css     ← 🎨 colours, fonts, sizes (the "design system")
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

## 2. Run it on your laptop

**Option A (recommended): VS Code + Live Server**

1. Open VS Code → **File → Open Folder…** → choose the `website` folder.
2. Click the Extensions icon (four squares on the left), search **Live Server** (by Ritwick Dey), and install it.
3. Right-click `index.html` → **Open with Live Server**.
4. Your browser opens `http://127.0.0.1:5500`. Every time you save a file, the page reloads by itself.

**Option B:** double-click `index.html`. It works, but the browser treats local files
more strictly, so you may see 2 harmless "preload" errors in the Console. Live Server avoids that.

---

## 3. Everyday tasks

### Add a new project
1. Open `content/projects.js`.
2. Copy an existing `{ … },` block (from `{` to `},`) and paste it at the top of the list.
3. Change the values. The comment at the top of the file explains every field.
4. Save → check the page.

Where it appears depends on two fields:

| Field | Result |
|---|---|
| `featured: true` | "Featured work" card + a case-study popup (needs `caseStudy`) |
| `university: { semester, course }` | "Built at university" under that semester |
| neither | "Other projects" (the section appears automatically) |
| `draft: true` | **hidden everywhere**. Use this for unfinished work |

### Add a certificate
Open `content/certificates.js` and add one line inside `[ ]`.
The Certificates section appears as soon as the list isn't empty.

### Add your CV
Put the PDF at `assets/cv.pdf`, then in `content/site.js` change `cv: ""` to `cv: "assets/cv.pdf"`.

### Change colours or fonts
Edit `assets/css/tokens.css`. Every colour on the site comes from there.

### Check for mistakes
Open the page → press **F12** → **Console** tab. If a content file is missing a required field,
you'll see a yellow warning naming the exact file and item.

---

## 4. Publish (GitHub Pages)

Do this once:

1. On github.com, create a **new repository** named exactly **`vinnsssss3.github.io`** (Public, no README).
2. In VS Code, open the terminal (**Terminal → New Terminal**) inside the `website` folder and run:

   ```bash
   git init
   git add .
   git commit -m "First version of my personal website"
   git branch -M main
   git remote add origin https://github.com/vinnsssss3/vinnsssss3.github.io.git
   git push -u origin main
   ```

3. On GitHub: repository → **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → Save.
4. Wait 1–2 minutes, then open **https://vinnsssss3.github.io**.

After that, every update is:

```bash
git add .
git commit -m "Add <what you changed>"
git push
```

and the live site updates within a minute or two.

---

## 5. Before every push: 30-second checklist

- [ ] Page loads with no red errors in the Console (F12)
- [ ] Looks right on a phone (F12 → the phone/tablet icon at the top left of DevTools)
- [ ] Both themes look right (the sun/moon button)
- [ ] Every link you added opens the right place
- [ ] `lastUpdated` in `content/site.js` has today's date
