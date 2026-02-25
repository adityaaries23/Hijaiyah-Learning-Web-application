# Hijaiyah Learning Web — Improvement Proposal

## Project Overview

The app is a zero-dependency, offline-first SPA that teaches young children (2+) the 28 Arabic Hijaiyah letters. It uses a clean MVC architecture (`data.js` → `app.js` → `ui.js`) and has a solid test suite (property-based + unit). All 15 implementation tasks are complete.

---

## ⚠️ Dev Environment Notes

- **`npm` scripts cannot run** on this machine (script execution restriction). Use `node` commands directly (e.g., `node --test tests/data.test.js`)
- **ES modules via `type="module"`** were attempted to fix dual-file duplication but **failed** — browsers block ES module imports over the `file://` protocol due to CORS restrictions. A local HTTP server would be required, which adds a dependency. The dual-file approach is the correct solution for this zero-dependency, open-from-filesystem setup.

---

## 🔴 High Priority

### 1. Audio Pronunciation ✅ Done (code complete — audio files pending)
The app shows each letter visually, but **there is no sound**. For 2-year-olds, hearing the correct pronunciation is the most important learning feature.

**Implemented:**
- All 28 letters in `data.js` now have an `audio: 'audio/[name].mp3'` field
- `UIManager.playAudio()` method added — auto-plays on navigation, also wired to a 🔊 replay button
- 🔊 speaker button added to `index.html` inside `.letter-card` with hover/active/error styles in `main.css`
- Red flash fallback via `onerror` handler if audio fails to load
- `tests/data.test.js` — 2 new tests verify all 28 letters have correct `audio/*.mp3` paths
- All 58 tests pass ✅

> ⚠️ **Pending:** Place the 28 MP3 files into `audio/` folder at the project root. Files expected: `alif.mp3`, `ba.mp3`, `ta.mp3`, `tsa.mp3`, `jim.mp3`, `ha.mp3`, `kha.mp3`, `dal.mp3`, `dzal.mp3`, `ra.mp3`, `zay.mp3`, `sin.mp3`, `syin.mp3`, `shad.mp3`, `dhad.mp3`, `tha.mp3`, `zha.mp3`, `ain.mp3`, `ghain.mp3`, `fa.mp3`, `qaf.mp3`, `kaf.mp3`, `lam.mp3`, `mim.mp3`, `nun.mp3`, `waw.mp3`, `ha2.mp3`, `ya.mp3`

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

### 5. Swipe Discovery Hint ✅ Done
No visual cue that cards are swipeable — parents can't discover the gesture.

**Proposed changes:**
- Animated left/right arrows on first load, auto-fade after 3s
- Store `firstVisit` in `localStorage` — show hints only once

---

### 6. Keyboard Navigation ✅ Done
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

### 8. Letter Example Words ✅ Done
Show an example word per letter (e.g., "أسد" = Lion for Alif).

- Extend `data.js` with an `example` field (word + emoji)
- Display below the letter name in a smaller style

---

### 9. Dark Mode ✅ Done
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
| 1 | Audio pronunciation | ✅ Done (files pending) | 🔴 High | ⭐⭐⭐⭐⭐ |
| 2 | Progress indicator | ✅ Done | 🔴 High | ⭐⭐⭐⭐ |
| 3 | Sync-check script | ✅ Done (PR #1) | 🔴 High | ⭐⭐⭐⭐ |
| 4 | Visual design upgrade | ⬜ Todo | 🟡 Medium | ⭐⭐⭐⭐ |
| 5 | Swipe discovery hint | ✅ Done | 🟡 Medium | ⭐⭐⭐ |
| 6 | Keyboard navigation | ✅ Done | 🟡 Medium | ⭐⭐⭐ |
| 7 | Service Worker / PWA | ⬜ Todo | 🟡 Medium | ⭐⭐⭐ |
| 8 | Example words | ✅ Done | 🟢 Low | ⭐⭐⭐ |
| 9 | Dark mode | ✅ Done | 🟢 Low | ⭐⭐ |
| 10 | Test improvements | ✅ Done | 🟢 Low | ⭐⭐⭐ |

---

## Quick Wins

1. ~~Fix `offline.test.js` not in `test:all`~~ ✅ Done
2. ~~Add progress indicator — ~20 lines of code~~ ✅ Done
3. ~~Add keyboard navigation — ~10 lines in `ui.js`~~ ✅ Done
4. ~~Fix `index.html` `lang="ar" dir="rtl"`~~ ✅ Done

---

## Git History

| Branch | PR | Description |
|--------|----|-------------|
| `est` | [PR #1](https://github.com/adityaaries23/Hijaiyah-Learning-Web-application/pull/1) | `sync-check.js` + `.gitignore` update |
| `est` | (open) | Progress indicator, audio pronunciation code, keyboard nav, dark mode, swipe hint, example words |
