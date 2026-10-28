# BrainDeck AI — Active Recall Learning Web Application

> **Tagline:** Learn Better, One Card at a Time.

**BrainDeck AI** is a production-grade, accessible, and responsive flashcard learning web application engineered with semantic **HTML5**, **CSS3 3D Transforms**, and modern **Vanilla JavaScript (ES6+)**. The visual identity is strictly informed by the **MOONDU** design system, featuring high-contrast neo-brutalist styling, structured typography tokens, and tactile elevation.

Built to exceed the requirements of the **“Flashcard App (Static Deck)”** specification:
- **12 comprehensive flashcards** focusing on **Frontend Fundamentals** (HTML5 Semantics, CSS 3D Transforms, Event Loops, Closures, DOM Reflow/Repaint, Web Storage, and more).
- **Physical 3D card-flip interaction** powered by GPU-accelerated CSS `transform-style: preserve-3d` and strict backface occlusion (no mirrored or inverted text glitches).
- **Interactive Mouse Gyroscopic Tilt & Glare** with real-time cursor parallax.
- **Bi-directional Navigation & Direct Card Navigator Matrix** with live mastery status tags.
- **Targeted Review Mode** allowing users to isolate and study difficult cards.
- **Integrated Focus Pomodoro Timer (25m/5m)** and **Leitner Spaced Repetition Engine**.
- **Lenis v1.1.20 Smooth Inertial Scrolling Engine** with invisible, native-preserving scrollbar styling.
- **Smart Adaptive Sticky Header** that conceals on downward scroll and reveals smoothly upon upward scroll.
- **Full WCAG 2.2 AA Accessibility & High-Contrast Light/Dark Themes** with local storage persistence.

---

## 1. MOONDU Design System Integration

The user interface implements the exact tokens and foundations documented in `design.md` and `Skill.md`:

### Typography Foundations
- **Primary Font Stack:** `Pin Sans`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Oxygen-Sans`, `Ubuntu`, `Cantarell`, `Helvetica Neue`, `Arial`, `sans-serif`
- **Monospace Stack:** `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, `monospace`
- **Base Metrics:** `font.size.base = 14px`, `font.weight.base = 400`, `font.lineHeight.base = 1.5`
- **Type Scale:**
  - `xs`: `12px` (meta badges, keyboard indicators, helper labels)
  - `sm`: `14px` (button text, navigation items, secondary body copy)
  - `md`: `16px` (lead paragraphs, stat descriptions, accordion triggers)
  - `lg`: `24px` (card headers, secondary titles)
  - `xl`: `32px` (dashboard metric values)
  - `display`: `clamp(28px, 5vw, 46px)` (hero & section headlines)

### Color Palette Tokens
- **`color.text.primary`:** `#000000` (deep ink black)
- **`color.text.secondary`:** `#211922` (dark plum slate)
- **`color.text.tertiary`:** `#2b48d4` (electric royal cobalt blue)
- **`color.surface.muted`:** `#ffffff` (crisp white card background)
- **`color.surface.raised`:** `#fbfbf9` (warm studio canvas)
- **`color.surface.strong`:** `#e5e5e0` (neutral track dividers)
- **Vibrant Neo-Brutalist Accents:**
  - Yellow Accent: `#fde047` (pill badges, review states, active indicators)
  - Mint Accent: `#86efac` (mastered badges, completion dialogs)
  - Coral Pink Accent: `#f472b6` (topic tags)

### Spacing, Radii & Tactile Shadows
- **Spacing Scale:** `space.1 = 6px`, `space.2 = 14px`, `space.3 = 20px`, `space.4 = 28px`, `space.5 = 42px`
- **Radius Scale:** `radius.xs = 8px`, `radius.sm = 16px`, `radius.md = 50px`, `radius.full = 9999px`
- **Motion Durations:** `motion.duration.instant = 85ms`, `motion.duration.fast = 250ms`, `flip = 500ms`
- **Hard-Edge Drop Shadows:**
  - Standard: `4px 4px 0px #000000`
  - Hover Lift: `6px 6px 0px #000000` (`transform: translate(-2px, -2px)`)
  - Active Press: `1px 1px 0px #000000` (`transform: translate(2px, 2px)`)

---

## 2. Canonical 13-Section Sequence

The landing page follows the recommended architecture:

| Section # | Component / Landmark | Anchor ID | Purpose & Architecture |
|---|---|---|---|
| **01** | **Skip Link** | `#skip-link` | Accessible keyboard bypass directly to the study workspace. |
| **02** | **Header & Navigation** | `#site-header` | Smart sticky header with auto hide-on-scroll-down, reveal-on-scroll-up, pill-grouped links, theme switcher, and mobile drawer. |
| **03** | **Hero Section** | `#hero` | Bold typography headline, active recall value proposition, dual CTAs, and live mini-deck visual preview. |
| **04** | **Study Overview** | `#study-overview` | Real-time deck metrics: Total cards, Mastered count, Review queue count, and Estimated completion time. |
| **05** | **Main Flashcard Workspace** | `#study-workspace` | The primary application: 3D flipping card, dynamic glare, question/answer faces, explanation callouts, and study controls. |
| **06** | **Card Navigator** | `#card-navigator` | Direct 12-cell matrix allowing 1-click jumps to any card with color + geometric dot indicators. |
| **07** | **Mastery Diagnostics** | `#progress-summary` | 4-tier status diagnostics (Rated, Known, Review, Remaining) and session progress bar. |
| **08A** | **Pomodoro Focus Timer** | `#pomodoro-timer` | Integrated 25-minute study sprint and 5-minute break counter. |
| **08B** | **Leitner Spaced Repetition Engine**| `#spaced-repetition` | 3-Box graduation workflow (Box 1: Daily, Box 2: 3 Days, Box 3: Long-term). |
| **08C** | **Ebbinghaus Forgetting Curve** | `#memory-curve` | Interactive SVG chart contrasting passive reading decay vs. active recall retention. |
| **09** | **How It Works** | `#how-it-works` | 3-step cognitive workflow: Inspect &rarr; Reveal & Compare &rarr; Rate & Re-Queue. |
| **10** | **Keyboard Shortcuts** | `#shortcuts` | Comprehensive keyboard navigation guide with visual `<kbd>` keys. |
| **11** | **FAQ Accordion** | `#faq` | Native, accessible disclosure panels answering questions about persistence, 3D mechanics, and offline support. |
| **12** | **Final Call to Action** | `#final-cta` | Return banner to jump directly back to the active recall workspace or reset progress. |
| **13** | **Footer** | `footer` | Semantic metadata, project architecture specs, and dynamic copyright year. |

---

## 3. Core Functional & Technical Capabilities

### A. 3D Card-Flip Architecture
- Built with CSS `perspective: 1400px` on the outer stage and `transform-style: preserve-3d` on the flipping inner container.
- Individual card faces use strict `-webkit-backface-visibility: hidden !important;` and `backface-visibility: hidden !important;`.
- Flipping occurs along the Y-axis (`rotateY(180deg)`) via a custom cubic-bezier timing curve (`cubic-bezier(0.34, 1.25, 0.64, 1)`), avoiding the visual glitch of reversed or mirrored text.

### B. Interactive Parallax & Dynamic Holographic Glare
- A subtle gyroscopic tilt tracks mouse position over the card using requestAnimationFrame (RAF), bounded to safe tilt angles (max `8deg` on X, `10deg` on Y) to prevent edge clipping.
- Radial dynamic glare (`--glare-x`, `--glare-y`) shifts across the card surface in real time based on cursor coordinates.

### C. Non-Destructive Deck Shuffling & State Control
- Shuffling uses the **Fisher-Yates** randomization algorithm on an in-memory working array, ensuring zero card duplication or data loss.
- Triggering "Shuffle" initiates a 3D riffle-spread visual animation before reloading card indices.

### D. Targeted Review Mode
- Isolates and filters only cards marked as **Review Again** into an active study queue.
- Includes a top notice banner showing the active review queue count and an exit action to return to the full deck.

### E. Keyboard-First Navigation
- <kbd>Space</kbd> or <kbd>Enter</kbd>: Flip active card.
- <kbd>&rarr;</kbd> (Right Arrow): Advance to next card.
- <kbd>&larr;</kbd> (Left Arrow): Go back to previous card.
- <kbd>K</kbd>: Mark as "Know It" (Mastered).
- <kbd>R</kbd>: Mark as "Review Again".
- <kbd>Esc</kbd>: Dismiss completion modal or close mobile navigation drawer.

### F. Dual Theme & Persistence
- Automatically detects system preference via `window.matchMedia('(prefers-color-scheme: dark)')`.
- Saves user selection (`data-theme="light"` or `data-theme="dark"`) and all card ratings in browser `localStorage`.
- Safely catches potential storage quota or sandbox exceptions with memory fallbacks.

---

## 4. Project File Structure

```text
flashcard-studio/
├── index.html           # Unified production application (HTML5, CSS3 Tokens, Vanilla JS)
├── design.md            # MOONDU Design System token specifications
├── Skill.md             # Design system guidance and implementation constraints
├── ReferenceDesignPrompt.md # Addendum for reference-driven design consistency
└── README.md            # Comprehensive architectural documentation
```

---

## 5. How to Run Locally

Because the project uses pure semantic standards without build steps or npm dependencies, you can run it using any local static file server:

### Option 1: Direct Browser Launch
Double-click `index.html` or open it directly in Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari:
```bash
open index.html
```

### Option 2: Python 3 HTTP Server
```bash
python3 -m http.server 8000
```
Navigate to `http://localhost:8000` in your browser.

### Option 3: Node.js `npx serve`
```bash
npx serve .
```

---

## 6. Accessibility (WCAG 2.2 AA) Compliance Checklist

- [x] **Visual Focus Rings:** `:focus-visible` styling applied across all interactive elements (`outline: 2px solid var(--border-focus); outline-offset: 3px`).
- [x] **Screen Reader Buffer:** `aria-live="polite"` status announcer (`#a11y-announcer`) broadcasts card position and flip states without causing entire page re-reads.
- [x] **Non-Color-Only Indicators:** Status badges and matrix dots combine semantic geometric dots and distinct label text with color styling.
- [x] **Contrast Ratios:** Text-to-surface contrast exceeds 4.5:1 across both Light and Dark themes.
- [x] **Motion Safety:** Respects `prefers-reduced-motion` guidelines with instantaneous transitions where appropriate.

---

## 7. License & Credits

Built as part of the **Frontend Engineering & Systems Architecture** curriculum. Free and open source for educational, prototyping, and study applications.# BrainDeck
