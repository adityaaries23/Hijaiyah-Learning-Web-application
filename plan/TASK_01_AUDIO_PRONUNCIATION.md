# Task 1: Audio Pronunciation

**Priority:** 🔴 High | **Impact:** ⭐⭐⭐⭐⭐ | **Effort:** Medium

## Goal

Add letter pronunciation audio so children hear each letter spoken aloud — the most impactful missing learning feature.

---

## Task Breakdown

- [x] **1.1 Source / create 28 audio clips** ⚠️ Pending — manual step
  - Format: MP3 (broad compatibility), ~1-3 seconds each
  - One file per letter, named by romanized name (e.g., `alif.mp3`, `ba.mp3`, …, `ya.mp3`)
  - Store in `audio/` folder at project root
  - Keep files small (< 50KB each) for fast loading
  - Must be bundled locally (no CDN) for offline-first
  - **Expected filenames:** `alif.mp3`, `ba.mp3`, `ta.mp3`, `tsa.mp3`, `jim.mp3`, `ha.mp3`, `kha.mp3`, `dal.mp3`, `dzal.mp3`, `ra.mp3`, `zay.mp3`, `sin.mp3`, `syin.mp3`, `shad.mp3`, `dhad.mp3`, `tha.mp3`, `zha.mp3`, `ain.mp3`, `ghain.mp3`, `fa.mp3`, `qaf.mp3`, `kaf.mp3`, `lam.mp3`, `mim.mp3`, `nun.mp3`, `waw.mp3`, `ha2.mp3`, `ya.mp3`

- [x] **1.2 Update `data.js` — add `audio` field** ✅ Done
  - Added `audio: 'audio/[name].mp3'` to all 28 letter objects
  - Synced to `data.test.js` via sync script

- [x] **1.3 Update `ui.js` — auto-play on navigation** ✅ Done
  - `Audio` object created in `UIManager` constructor
  - `playAudio(src)` method added — silently handles autoplay blocks
  - Called inside `updateDisplay()` after rendering the letter
  - Synced to `ui.test.js`

- [x] **1.4 Add speaker/replay button to UI** ✅ Done
  - 🔊 button added in `index.html` inside `.letter-card`
  - Styled in `main.css`: 56px circle, golden border, hover/active states
  - Click handler wired in `ui.js` → `playAudio()` with current letter's audio src

- [x] **1.5 Add visual fallback for audio failure** ✅ Done
  - `onerror` handler on the `Audio` object flashes red border on the 🔊 button for 600ms

- [x] **1.6 Update tests** ✅ Done
  - `tests/data.test.js`: 2 new tests — all 28 letters have `audio/*.mp3` field
  - All 58 tests pass: `node --test tests/data.test.js` and `node --test tests/app.unit.test.js`

- [ ] **1.7 Manual verification** — requires audio files in `audio/` folder
  - Open `index.html` in browser
  - Tap through all 28 letters — audio should play for each
  - Tap the 🔊 button — audio replays
  - Test on mobile device (touch events)
  - Test offline (disconnect wifi, reload page)

---

## Files Modified

| File | Change | Status |
|------|--------|--------|
| `scripts/data.js` | Added `audio` field to each letter | ✅ |
| `scripts/data.test.js` | Mirrored + kept export | ✅ |
| `scripts/ui.js` | Added `playAudio()`, wired to `updateDisplay()` + button | ✅ |
| `scripts/ui.test.js` | Mirrored + kept export | ✅ |
| `styles/main.css` | `.sound-button` styles + error state | ✅ |
| `index.html` | Added `<button class="sound-button">🔊</button>` | ✅ |
| `tests/data.test.js` | 2 new audio field validation tests | ✅ |

## New Files Needed

| File | Purpose | Status |
|------|---------|--------|
| `audio/*.mp3` | 28 pronunciation audio clips | ⚠️ Pending — source manually |

---

## Notes

- Audio sourcing options: record manually, use text-to-speech, or find royalty-free Hijaiyah audio online
- Browser autoplay policies may block audio until the user's first interaction — this is expected and handled (silent catch)
- Remember to run `node sync-check.js` after editing any `scripts/*.js` files
- Commit: `ab78274` on branch `est`
