# Task 1: Audio Pronunciation

**Priority:** 🔴 High | **Impact:** ⭐⭐⭐⭐⭐ | **Effort:** Medium

## Goal

Add letter pronunciation audio so children hear each letter spoken aloud — the most impactful missing learning feature.

---

## Task Breakdown

- [ ] **1.1 Source / create 28 audio clips**
  - Format: MP3 (broad compatibility), ~1-3 seconds each
  - One file per letter, named by romanized name (e.g., `alif.mp3`, `ba.mp3`, …, `ya.mp3`)
  - Store in `audio/` folder at project root
  - Keep files small (< 50KB each) for fast loading
  - Must be bundled locally (no CDN) for offline-first

- [ ] **1.2 Update `data.js` — add `audio` field**
  - Add an `audio` property to each letter object:
    ```js
    { id: 1, arabic: 'ا', name: 'Alif', audio: 'audio/alif.mp3' }
    ```
  - Sync the same change to `data.test.js`
  - Run `node sync-check.js` to verify sync

- [ ] **1.3 Update `ui.js` — auto-play on navigation**
  - Create an `Audio` object in `UIManager` constructor
  - Add `playAudio(src)` method:
    ```js
    playAudio(src) {
      this.audio.src = src;
      this.audio.play().catch(() => { /* silent fail on autoplay block */ });
    }
    ```
  - Call `playAudio()` inside `updateDisplay()` after rendering the letter
  - Handle autoplay policy: browsers may block first auto-play until user interacts — audio should start working after the first tap/click
  - Sync to `ui.test.js`

- [ ] **1.4 Add speaker/replay button to UI**
  - Add a 🔊 button in `index.html` inside `.letter-card`:
    ```html
    <button class="sound-button" aria-label="Play letter sound">🔊</button>
    ```
  - Style in `main.css`: large (min 44x44px), centered below letter name, playful design
  - Wire click handler in `ui.js` → `playAudio()` with current letter's audio src

- [ ] **1.5 Add visual fallback for audio failure**
  - If audio fails to load/play, show a brief visual cue (e.g., red outline flash on the speaker button)
  - Add `onerror` handler on the `Audio` object

- [ ] **1.6 Update tests**
  - Update `tests/data.test.js`: verify each letter has an `audio` field with a valid path string
  - Add unit test: verify `playAudio()` method exists on `UIManager`
  - Run: `node --test tests/data.test.js` and `node --test tests/app.unit.test.js`

- [ ] **1.7 Manual verification**
  - Open `index.html` in browser
  - Tap through all 28 letters — audio should play for each
  - Tap the 🔊 button — audio replays
  - Test on mobile device (touch events)
  - Test offline (disconnect wifi, reload page)

---

## Files Modified

| File | Change |
|------|--------|
| `scripts/data.js` | Add `audio` field to each letter |
| `scripts/data.test.js` | Mirror above + keep export |
| `scripts/ui.js` | Add `playAudio()`, wire to `updateDisplay()` |
| `scripts/ui.test.js` | Mirror above + keep export |
| `styles/main.css` | Style `.sound-button` |
| `index.html` | Add `<button class="sound-button">` |
| `tests/data.test.js` | Add audio field validation test |

## New Files

| File | Purpose |
|------|---------|
| `audio/*.mp3` | 28 pronunciation audio clips |

---

## Notes

- Audio sourcing is the biggest effort item — options include recording manually, using TTS, or finding royalty-free Hijaiyah audio
- Browser autoplay policies may block audio until the user's first interaction; this is expected behavior
- Remember to run `node sync-check.js` after editing any `scripts/*.js` files
