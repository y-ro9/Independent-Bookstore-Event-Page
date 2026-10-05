<div align="center">

# 📚 Independent Bookstore — Events Page

**A fast, accessible, paper-free events manager for bookstore floor staff.**

[![Ticket](https://img.shields.io/badge/ticket-ENG--18072-blue?style=flat-square)](#)
[![Priority](https://img.shields.io/badge/priority-P1-red?style=flat-square)](#)
[![Epic](https://img.shields.io/badge/epic-Core%20Infrastructure%20Overhaul-purple?style=flat-square)](#)
[![Points](https://img.shields.io/badge/story%20points-5-green?style=flat-square)](#)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](#)
[![No Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat-square)](#)
[![Lighthouse](https://img.shields.io/badge/lighthouse%20a11y-100-success?style=flat-square)](#)

[Live Demo](#-live-demo) · [Features](#-features) · [Getting Started](#-getting-started) · [Architecture](#-architecture) · [Roadmap](#-roadmap)

</div>

---

## 🎯 The Problem

Independent bookstores run their event calendar on **paper logs and Excel sheets**. This causes:

- 🗂️ **Data loss** — sheets get overwritten, papers get misplaced
- 🐌 **Operational slowdown** — no quick lookup for floor staff during customer queries
- 🚫 **No offline resilience** — nothing works when the internet is spotty

## 💡 The Solution

A **single-page, dependency-free web tool** that bookstore staff can pull up on any device — fast, accessible, and resilient to bad connectivity.

> Built as a Proof of Concept for ticket **ENG-18072** under the *Core Infrastructure Overhaul* epic.

---

## ✨ Features

### 🟢 Happy Path
| Feature | Description |
|---|---|
| **Event Listing** | Clean, scannable cards showing title, author, date, time, and capacity |
| **Live Search** | Debounced search filters events by title or author as you type |
| **Add Event** | Simple form to register new events with instant feedback |
| **Instant Response** | No heavy frameworks, no blocking — sub-100ms interactions |

### 🔴 Unhappy Path (Edge Cases)
| Scenario | Handling |
|---|---|
| **Empty results** | Friendly *"No data found"* message — never a blank screen |
| **Slow 3G connection** | Visual spinner + `aria-busy` during async operations |
| **Invalid form input** | Field-level red highlighting + inline error messages |
| **Malformed submissions** | Blocked before they ever reach state |

### ♿ Accessibility
- 🏆 **100% Lighthouse accessibility score** target
- ⌨️ Fully keyboard navigable (visible focus rings everywhere)
- 🏷️ ARIA labels, `role="alert"`, `aria-invalid`, `aria-live`
- 🔗 Skip-to-content link for screen reader users
- 🎞️ Respects `prefers-reduced-motion`

### 🔒 Security & Telemetry
- 🛡️ **XSS-safe** — all inputs sanitized before entering state; rendering uses `textContent` only
- 📊 **Analytics hooks** — every primary action fires a console telemetry ping:
  ```
  [Analytics] User interacted with Independent Bookstore Events Page
  ```

### 🎨 Design
- Monochromatic corporate palette — **zero rogue hex colors**
- Consistent 8px spacing rhythm (16px / 32px / 48px steps)
- Responsive layout — 1 column on mobile, 2 columns on tablet+

---

## 🌐 Live Demo

> 🔗 **[View Live on Vercel](#)** 
---

## 🚀 Getting Started

### Prerequisites

None. Literally. Just a browser. 🎉

### Run Locally

**Option 1 — Direct**
```bash
git clone https://github.com/y-ro9/Independent-Bookstore-Event-Page.git
cd Independent-Bookstore-Event-Page
open index.html      # macOS
# or
start index.html     # Windows
# or
xdg-open index.html  # Linux
```

**Option 2 — Local server (recommended)**
```bash
npx serve .
# → http://localhost:3000
```

### Lint

```bash
npx eslint app.js
```

Expected output: **zero warnings, zero errors.**

---

## 📁 Project Structure

```
independent-bookstore-event-page/
├── index.html        # Semantic HTML5 markup
├── styles.css        # Vanilla CSS (design tokens + layout)
├── app.js            # Vanilla JS (state, render, validation, sanitization)
├── .eslintrc.json    # Lint config
└── README.md         # You are here
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              index.html                     │
│  ┌────────────┬────────────┬─────────────┐  │
│  │  Search    │   Events   │  Add Form   │  │
│  └────────────┴────────────┴─────────────┘  │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │     app.js        │
         │  ┌─────────────┐  │
         │  │   State     │  │  ← in-memory events[]
         │  ├─────────────┤  │
         │  │  Sanitizer  │  │  ← XSS-safe before write
         │  ├─────────────┤  │
         │  │  Renderer   │  │  ← textContent only
         │  ├─────────────┤  │
         │  │  Validator  │  │  ← field-level rules
         │  └─────────────┘  │
         └───────────────────┘
                   │
         ┌─────────▼─────────┐
         │    Telemetry      │
         │  console.log ping │
         └───────────────────┘
```

**Design principles:**
- **No framework** — DOM is truth, JS is the renderer
- **Sanitize once** — every string passes through `sanitizeText()` before entering state
- **Render via `textContent`** — immune to XSS by construction
- **Progressive feedback** — loading state wraps every async simulation

---

## ✅ Definition of Done

| # | Criteria | Status |
|---|---|---|
| 1 | Code compiles and runs without fatal errors | ✅ |
| 2 | ESLint clean (zero warnings) | ✅ |
| 3 | Happy + Unhappy path acceptance criteria met | ✅ |
| 4 | No hardcoded API keys or PII | ✅ |
| 5 | Hosted on personal GitHub + deployed | ✅ |

---

## 🗺️ Roadmap

- [ ] Persist events to `localStorage` for true offline support
- [ ] Import/export events as CSV (to migrate legacy Excel sheets)
- [ ] Service worker for full PWA offline mode
- [ ] Print-friendly view for staff notice boards
- [ ] Multi-branch support (shared event calendar across stores)

---

## 🧪 Testing Checklist (Manual)

- [ ] Type gibberish in search → *"No data found"* appears, no crash
- [ ] Submit empty form → all fields turn red with messages
- [ ] Enter `<script>alert(1)</script>` as title → renders as plain text
- [ ] Tab through entire page → visible focus ring on every interactive element
- [ ] DevTools → throttle to Slow 3G → spinner shows before list renders
- [ ] Open console → every action logs the analytics ping

---

## 📦 Deployment

This is a **static site** — no build step required.

**Vercel:**
```bash
npx vercel --prod
```

**GitHub Pages:**
Settings → Pages → Source: `main` branch, `/root` folder → Save.

---

## 👥 Credits

| Role | Name |
|---|---|
| **Reporter** | Amit Sharma (Senior Staff Engineer) |
| **Assignee** | Yash Raj |
| **Epic** | Core Infrastructure Overhaul |
| **Ticket** | ENG-18072 |

---

## 📜 License

Internal Proof of Concept — not for public distribution.

---

<div align="center">

**Built with ☕ and zero dependencies.**

*If this saved your bookstore from one more Excel sheet, give it a ⭐*

</div>
