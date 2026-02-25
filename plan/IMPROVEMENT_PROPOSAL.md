# Hijaiyah Learning Web — Improvement Proposal

## Project Overview

The app is a zero-dependency, offline-first SPA that teaches young children (2+) the 28 Arabic Hijaiyah letters. It uses a clean MVC architecture (`data.js` → `app.js` → `ui.js`) and has a solid test suite (property-based + unit). All 15 implementation tasks are complete.

---

## ⚠️ Dev Environment Notes

- **`npm` scripts cannot run** on this machine (script execution restriction). Use `node` commands directly (e.g., `node --test tests/data.test.js`)
- **ES modules via `type="module"`** were attempted to fix dual-file duplication but **failed** — browsers block ES module imports over the `file://` protocol due to CORS restrictions. A local HTTP server would be required, which adds a dependency. The dual-file approach is the correct solution for this zero-dependency, open-from-filesystem setup.

---

## 🔴 High Priority

### 1. Audio Pronunciation
The app shows each letter visually, but **there is no sound**. For 2-year-olds, hearing the correct pronunciation is the most important learning feature.

**Proposed changes:**
- Add an `audio/` folder with 28 short MP3/OGG pronunciation clips (e.g., `alif.mp3`, `ba.mp3`, …)
- Extend `data.js` with an `audio` field per letter object:
  ```js
  { id: 1, arabic: 'ا', name: 'Alif', audio: 'audio/alif.mp3' }
  ```
- Auto-play audio on navigation; add a speaker button for manual replay
- Audio files must be bundled locally to preserve offline-first functionality

---

### 2. Letter Progress Indicator ✅ Done
No visual indicator of position (e.g., "Letter 5 of 28").

**Mitigation:** `progress-indicator` element added to DOM and wired up in `ui.js` `updateProgress()` method. Displays live "1 / 28" counter.

---

### 3. Dual-File Sync Protection ✅ Done
**Context:** ES modules were tried and failed (CORS on `file://`). The dual-file approach stays.

**Mitigation:** `sync-check.js` added — run `node sync-check.js` to detect drift. Committed on branch `est` → [PR #1](https://github.com/adityaaries23/Hijaiyah-Learning-Web-application/pull/1).

---

## 🟡 Medium Priority

### 4. Visual Design Modernization
Current design is functional but plain for a children's app.

**Proposed changes:**
- Warm radial gradient or illustrated background (stars, clouds)
- Per-letter background color cycling (28 pastel themes)
- Bounce/pulse entrance animation on the Arabic character
- Child-friendly Google Font (e.g., `Nunito`, `Baloo 2`)
- Confetti/star animation when reaching the last letter (Ya)

---

### 5. Swipe Discovery Hint
No visual cue that cards are swipeable — parents can't discover the gesture.

**Proposed changes:**
- Animated left/right arrows on first load, auto-fade after 3s
- Store `firstVisit` in `localStorage` — show hints only once

---

### 6. Keyboard Navigation
README mentions "basic" keyboard support but it's not implemented.

**Proposed changes:**
- `ArrowRight` → next letter, `ArrowLeft` → previous letter in `ui.js`
- Update `aria-label` on the letter card dynamically on each change

---

### 7. Service Worker / PWA Support
App is offline-functional but can't be installed on a home screen.

**Proposed changes:**
- Minimal `service-worker.js` caching all assets on install
- `manifest.json` + `<link rel="manifest">` in `index.html`
- **Impact:** Parents can add it to the child's tablet home screen as a full-screen app

---

## 🟢 Low Priority

### 8. Letter Example Words
Show an example word per letter (e.g., "أسد" = Lion for Alif).

- Extend `data.js` with an `example` field (word + emoji)
- Display below the letter name in a smaller style

---

### 9. Dark Mode
For low-light/bedtime use — add `@media (prefers-color-scheme: dark)` in `main.css`.

---

### 10. Test Suite Improvements

| Gap | Fix |
|-----|-----|
| `offline.test.js` excluded from `test:all` glob | Add explicitly to the script |
| `package.json` `"author"` is empty | Fill in |
| Must use `node --test` not `npm test` | Noted — npm scripts restricted |
| README line 142 says `npm test:all` | Should be `npm run test:all` |

---

## Summary Table

| # | Improvement | Status | Priority | Impact |
|---|-------------|--------|----------|--------|
| 1 | Audio pronunciation | ⬜ Todo | 🔴 High | ⭐⭐⭐⭐⭐ |
| 2 | Progress indicator | ✅ Done | 🔴 High | ⭐⭐⭐⭐ |
| 3 | Sync-check script | ✅ Done (PR #1) | 🔴 High | ⭐⭐⭐⭐ |
| 4 | Visual design upgrade | ⬜ Todo | 🟡 Medium | ⭐⭐⭐⭐ |
| 5 | Swipe discovery hint | ⬜ Todo | 🟡 Medium | ⭐⭐⭐ |
| 6 | Keyboard navigation | ⬜ Todo | 🟡 Medium | ⭐⭐⭐ |
| 7 | Service Worker / PWA | ⬜ Todo | 🟡 Medium | ⭐⭐⭐ |
| 8 | Example words | ⬜ Todo | 🟢 Low | ⭐⭐⭐ |
| 9 | Dark mode | ⬜ Todo | 🟢 Low | ⭐⭐ |
| 10 | Test improvements | ⬜ Todo | 🟢 Low | ⭐⭐⭐ |

---

## Quick Wins

1. Fix `offline.test.js` not in `test:all`
2. ~~Add progress indicator — ~20 lines of code~~ ✅ Done
3. Add keyboard navigation — ~10 lines in `ui.js`
4. ~~Fix `index.html` `lang="ar" dir="rtl"`~~ ✅ Done

---

## Git History

| Branch | PR | Description |
|--------|----|-------------|
| `est` | [PR #1](https://github.com/adityaaries23/Hijaiyah-Learning-Web-application/pull/1) | `sync-check.js` + `.gitignore` update, and progress indicator added |
