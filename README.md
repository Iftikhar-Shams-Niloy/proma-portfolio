# Syeda Mahjabin Proma — Portfolio

Personal portfolio of **Syeda Mahjabin Proma**, a Computer Science graduate from BRAC University
working across machine learning, computer vision and data science.

A single-page site in a soft "claymorphism" style, built with **vanilla HTML, CSS and JavaScript**:
no frameworks, no build step, no dependencies.

## Features

- **Light and dark themes.** A toggle in the header switches them, and the choice is remembered.
- **Pause / play for ambient motion** ([WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide)), also remembered.
- **Respects `prefers-reduced-motion`.** All animation stops and the skills marquee becomes a static, wrapped list.
- **Responsive.** Fluid type, wrapping flex layouts, and rhythm breakpoints at `1023px` and `639px`.
- **Accessible.** Skip link, semantic landmarks, visible focus rings, labelled icon buttons, decorative graphics hidden from screen readers.

## Animations

| Animation | Where | How |
| --- | --- | --- |
| Fade-up on load, staggered | Header and hero copy | `.reveal` + `--d` delay |
| Pop-in, staggered | Hero bento tiles | `.pop` + `--d` delay |
| Reveal on scroll | Every section and card below the hero | `.sr` uses `animation-timeline: view()`, with an IntersectionObserver fallback |
| Live status ring | "Exploring Master's programs" dot | `ring` keyframes |
| Infinite skills marquee | Tools & methods strip | `marq` keyframes; JS eases it to a stop on hover |
| Count-up numbers | Stats row | `counters.js`, 1.2s ease-out |
| Neural core | About → research objective | `breathe`, `sonar` and `fire`, all on a shared 3.6s cycle |
| Pipeline stages light up in turn | Thesis pipeline | `lit` keyframes on a 10s cycle, 2.5s apart |
| Floating clay orb | Contact panel | `float` keyframes |
| Hover micro-interactions | Cards, buttons, nav, marquee items, icon boxes | CSS transitions |

## Project structure

```
.
├── index.html                  # The page: all content and markup
├── assets/
│   ├── css/
│   │   ├── tokens.css          # Design tokens: colour, type, spacing, radii, shadows; light + dark themes
│   │   ├── base.css            # Reset, page shell, typography, layout primitives, a11y helpers
│   │   ├── components.css      # Reusable pieces: panel, button, chip, icon box, orb, neural core, marquee, step
│   │   ├── sections.css        # Page-specific layout, in document order (header → footer)
│   │   └── motion.css          # Entrance animations, keyframes, pause state, reduced motion
│   ├── js/
│   │   ├── boot.js             # Runs in <head>: restores the saved theme / motion choice before first paint
│   │   ├── main.js             # ES module entry point: wires everything up
│   │   └── modules/
│   │       ├── preferences.js  # Theme and motion toggles
│   │       ├── storage.js      # Safe localStorage wrapper
│   │       ├── marquee.js      # Duplicates marquee items and eases its speed on hover
│   │       ├── counters.js     # Count-up numbers
│   │       └── scroll-reveal.js  # Fallback reveal for browsers without scroll timelines
│   └── images/
│       └── favicon.svg
├── Portfolio-html-design/      # Original design mockup, kept as the visual reference (not part of the site)
├── .editorconfig
└── .gitignore
```

### Conventions

- **CSS load order matters:** `tokens → base → components → sections → motion`. Later files may
  override earlier ones at equal specificity.
- **Class names:** reusable components keep short names (`.panel`, `.btn`, `.chip`). Section-level
  layout uses BEM-style names (`.hero__content`, `.role--featured`, `.contact-card__label`).
- **No inline styles.** Every visual value comes from a token in `tokens.css` or a class.
- **State lives on `<html>`** as `data-theme="light|dark"` and `data-motion="playing|paused"`, and CSS
  reacts to it. JavaScript only flips those attributes.
- **JS hooks use `data-*` attributes** (`data-theme-toggle`, `data-marquee`, `data-count-to`), not
  styling classes.
- **Icons are defined once** in the inline SVG sprite at the top of `<body>`, and used with
  `<svg class="icon"><use href="#icon-name"/></svg>`.

## Running locally

The scripts are ES modules, which browsers will not load from `file://`. Serve the folder over HTTP instead:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open <http://localhost:8000>.

## Editing content

All copy lives in `index.html`. Several items are still placeholders:

| What | Where in `index.html` |
| --- | --- |
| Portrait photo (4:5, about 800 × 1000) | `.bento__photo` in the hero |
| Thesis image (about 800 × 600) | `.thesis__media` |
| Project images | `.project__media` (×4) |
| Résumé link | Both "Get my résumé" buttons (`href="#"`) |
| LinkedIn and GitHub URLs | `.contact__social` buttons (`href="#"`) |

**To use a real image,** put the file in `assets/images/`. Then replace the placeholder `<div class="… ph-img">`
with an `<img>` that keeps the layout class and adds `media-cover`:

```html
<!-- before -->
<div class="bento__photo ph-img">…</div>

<!-- after -->
<img class="bento__photo media-cover" src="assets/images/portrait.jpg"
     alt="Portrait of Syeda Mahjabin Proma" width="800" height="1000">
```

The same pattern works for `thesis__media` and `project__media`.

**To change colours or spacing,** edit the tokens in `assets/css/tokens.css`. The dark theme overrides
are in the `:root[data-theme="dark"]` block.

## Browser support

The site works in current Chrome, Edge, Safari and Firefox. It uses `color-mix()`, the individual
`translate` property and `overflow: clip`. Scroll-driven reveals run natively where
`animation-timeline: view()` is supported. Other browsers get the same fade-up through the
IntersectionObserver fallback.

## Deployment

The site is static, so any static host works: GitHub Pages, Netlify, Vercel or Cloudflare Pages.
For GitHub Pages, publish from the repository root on the `main` branch; `index.html` is the entry point.
