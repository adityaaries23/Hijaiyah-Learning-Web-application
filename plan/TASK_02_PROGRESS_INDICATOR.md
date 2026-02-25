# Task 2: Letter Progress Indicator

**Priority:** 🔴 High | **Impact:** ⭐⭐⭐⭐ | **Effort:** Low

## Goal

Show the current position (e.g., "5 / 28") so parents and children can track progress through the alphabet.

---

## Task Breakdown

- [ ] **2.1 Add progress HTML to `index.html`**
  - Add a progress container between `.display-area` and `.navigation`:
    ```html
    <div class="progress-indicator" aria-label="Letter progress">
      <span class="progress-current">1</span>
      <span class="progress-separator">/</span>
      <span class="progress-total">28</span>
    </div>
    ```

- [ ] **2.2 Style progress indicator in `main.css`**
  - Position: centered, below letter card, above nav buttons
  - Font: medium size, high contrast, same family as letter name
  - Add responsive sizing via `clamp()` for phone/tablet
  - Example styles:
    ```css
    .progress-indicator {
      text-align: center;
      font-size: clamp(18px, 3vw, 24px);
      color: var(--color-primary-text);
      font-weight: 600;
      padding: 8px 0;
    }
    .progress-current {
      color: var(--color-button-next);
      font-weight: 700;
    }
    ```

- [ ] **2.3 Update `ui.js` — wire progress to navigation**
  - Cache DOM refs in constructor:
    ```js
    this.progressCurrent = document.querySelector('.progress-current');
    this.progressTotal = document.querySelector('.progress-total');
    ```
  - Add `updateProgress()` method:
    ```js
    updateProgress() {
      this.progressCurrent.textContent = this.app.getCurrentIndex() + 1;
    }
    ```
  - Call `updateProgress()` inside `updateDisplay()`
  - Set total on `init()`:
    ```js
    this.progressTotal.textContent = this.app.getLettersCount();
    ```
  - Sync to `ui.test.js`

- [ ] **2.4 Update tests**
  - Add unit test: after navigation, progress text matches `currentIndex + 1`
  - Add unit test: total always shows `28`
  - Run: `node --test tests/app.unit.test.js`

- [ ] **2.5 Manual verification**
  - Open `index.html` — should show "1 / 28" on load
  - Navigate forward — counter increments
  - Navigate backward — counter decrements
  - Wrap-around: at letter 28, tap next → shows "1 / 28"
  - Test on mobile screen sizes (320px, 768px)

---

## Files Modified

| File | Change |
|------|--------|
| `index.html` | Add `.progress-indicator` markup |
| `styles/main.css` | Style progress indicator + responsive |
| `scripts/ui.js` | Add `updateProgress()`, wire to `updateDisplay()` |
| `scripts/ui.test.js` | Mirror above + keep export |
| `tests/app.unit.test.js` | Add progress display tests |

---

## Notes

- This is a quick win — estimated ~20 lines of code across 3 files
- Consider adding optional dot-style indicator later (28 dots, current highlighted) as a follow-up
- Adjust `.display-area` min-height if the new element pushes the layout
- Remember to run `node sync-check.js` after editing `scripts/ui.js`
