/**
 * UIManager
 * Handles all DOM manipulation and user interactions
 * Validates: Requirements 1.1, 1.2, 1.4, 9.1
 */

class UIManager {
  /**
   * Initialize the UI manager with an app instance
   * @param {HijaiyahApp} app - The application controller instance
   */
  constructor(app) {
    if (!app) {
      throw new Error('UIManager requires a HijaiyahApp instance');
    }

    this.app = app;

    // Cache DOM element references for performance
    this.displayArea = document.querySelector('.display-area');
    this.letterCard = document.querySelector('.letter-card');
    this.letterCircle = document.querySelector('.letter-circle-container');
    this.letterArabic = document.querySelector('.letter-arabic');
    this.letterName = document.querySelector('.letter-name');
    this.prevButton = document.querySelector('.prev-button');
    this.nextButton = document.querySelector('.next-button');
    this.progressCurrent = document.querySelector('.progress-current');
    this.progressTotal = document.querySelector('.progress-total');
    this.soundButton = document.querySelector('.sound-button');
    this.exampleWord = document.querySelector('.letter-example-word');
    this.exampleMeaning = document.querySelector('.letter-example-meaning');
    this.progressBarFill = document.getElementById('progress-bar-fill');
    this.progressDotsEl = document.getElementById('progress-dots');
    this.progressBarTrack = document.querySelector('.progress-bar-track');

    // Grid modal elements
    this.gridModal = document.getElementById('grid-modal');
    this.gridBtn = document.getElementById('grid-btn');
    this.gridToggleBtn = document.getElementById('grid-toggle-btn');
    this.gridCloseBtn = document.getElementById('grid-close-btn');
    this.lettersGrid = document.getElementById('letters-grid');

    // New Desktop/iPad Responsive elements
    this.inlineGrid = document.getElementById('letters-grid-inline');
    this.sidebarList = document.getElementById('sidebar-letter-list');
    this.sidebarProgFill = document.getElementById('sidebar-progress-fill');
    this.sidebarProgCur = document.querySelector('.progress-current-sidebar');
    this.sidebarProgTot = document.querySelector('.progress-total-sidebar');

    // Validate required DOM elements
    if (!this.displayArea || !this.letterCard || !this.letterArabic ||
      !this.letterName || !this.prevButton || !this.nextButton) {
      throw new Error('Required DOM elements not found');
    }

    // Audio player
    this.audio = (typeof window !== 'undefined' && window.Audio)
      ? new window.Audio()
      : { play: () => Promise.resolve(), src: '' };

    this.audio.onerror = () => {
      if (this.soundButton) {
        this.soundButton.classList.add('sound-error');
        setTimeout(() => this.soundButton.classList.remove('sound-error'), 600);
      }
    };

    // Speech Synthesis checking
    this.speechSynth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.arabicVoiceStr = null;
    
    if (this.speechSynth) {
      const loadVoices = () => {
        this.voices = this.speechSynth.getVoices();
        const arabicVoice = this.voices.find(v => v.lang.startsWith('ar'));
        if (arabicVoice) this.arabicVoiceStr = arabicVoice;
      };
      loadVoices();
      if (this.speechSynth.onvoiceschanged !== undefined) {
        this.speechSynth.onvoiceschanged = loadVoices;
      }
    }

    // Touch/swipe tracking
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;

    // Grid modal state
    this.gridModalOpen = false;
  }

  /**
   * Initialize the UI by rendering the first letter and building supplemental UI
   */
  init() {
    if (this.progressTotal) {
      this.progressTotal.textContent = this.app.getLettersCount();
    }
    if (this.sidebarProgTot) {
      this.sidebarProgTot.textContent = this.app.getLettersCount();
    }

    // Build the progress dots (show up to 7 nearby letters)
    this._buildProgressDots();

    // Build the letters grid (Modal + Inline)
    this._buildLettersGrid();

    // Build the desktop sidebar list
    this._buildSidebarList();

    const firstLetter = this.app.getCurrentLetter();
    this.updateDisplay(firstLetter);
  }

  /**
   * Build small dot indicators for the progress section.
   * Shows a window of up to 7 dots around the current position.
   */
  _buildProgressDots() {
    if (!this.progressDotsEl) return;
    const total = this.app.getLettersCount();
    const dotsCount = Math.min(total, 7);
    this.progressDotsEl.innerHTML = '';
    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('span');
      dot.className = 'progress-dot';
      dot.dataset.index = i;
      this.progressDotsEl.appendChild(dot);
    }
  }

  /**
   * Build the all-letters grid inside the modal and inline panel.
   */
  _buildLettersGrid() {
    const letters = this.app.state.letters;

    const buildGrid = (containerId, isModal) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';

      letters.forEach((letter, index) => {
        const cell = document.createElement('div');
        cell.className = 'letter-grid-cell';
        cell.setAttribute('role', 'listitem');
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('aria-label', `${letter.name} — ${letter.arabic}`);
        cell.dataset.index = index;

        const arabicEl = document.createElement('div');
        arabicEl.className = 'grid-cell-arabic';
        arabicEl.lang = 'ar';
        arabicEl.dir = 'rtl';
        arabicEl.textContent = letter.arabic;

        const nameEl = document.createElement('div');
        nameEl.className = 'grid-cell-name';
        nameEl.textContent = letter.name;

        cell.appendChild(arabicEl);
        cell.appendChild(nameEl);

        // Click/tap: navigate to that letter
        cell.addEventListener('click', () => {
          this._navigateToIndex(index);
          if (isModal) this.closeGridModal();
        });

        // Keyboard: Enter or Space activates it
        cell.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._navigateToIndex(index);
            if (isModal) this.closeGridModal();
          }
        });

        container.appendChild(cell);
      });
    };

    buildGrid('letters-grid', true);
    buildGrid('letters-grid-inline', false);
  }

  /**
   * Build the desktop sidebar list.
   */
  _buildSidebarList() {
    if (!this.sidebarList) return;
    this.sidebarList.innerHTML = '';
    const letters = this.app.state.letters;

    letters.forEach((letter, index) => {
      const row = document.createElement('div');
      row.className = 'sidebar-letter-row';
      row.setAttribute('role', 'listitem');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-label', `${letter.name} — ${letter.arabic}`);
      row.dataset.index = index;

      const arabicEl = document.createElement('div');
      arabicEl.className = 'sidebar-row-arabic';
      arabicEl.lang = 'ar';
      arabicEl.dir = 'rtl';
      arabicEl.textContent = letter.arabic;

      const nameEl = document.createElement('div');
      nameEl.className = 'sidebar-row-name';
      nameEl.textContent = letter.name;

      row.appendChild(arabicEl);
      row.appendChild(nameEl);

      // Click/tap: navigate to that letter
      row.addEventListener('click', () => {
        this._navigateToIndex(index);
      });

      // Keyboard: Enter or Space activates it
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._navigateToIndex(index);
        }
      });

      this.sidebarList.appendChild(row);
    });
  }

  /**
   * Jump to a letter by index without transition locking
   * @param {number} index
   */
  _navigateToIndex(index) {
    if (this.app.state.isTransitioning) return;
    this.app.goToLetter(index);
    const letter = this.app.getCurrentLetter();
    this.updateDisplay(letter);
    this.showTransition('next');
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Navigation buttons
    this.nextButton.addEventListener('click', () => this.handleNextClick());
    this.prevButton.addEventListener('click', () => this.handlePreviousClick());

    // Sound button
    if (this.soundButton) {
      this.soundButton.addEventListener('click', () => {
        const letter = this.app.getCurrentLetter();
        if (letter) this.playPronunciation(letter);
      });
    }

    // Grid modal open — both header icon and bottom nav button
    if (this.gridBtn) {
      this.gridBtn.addEventListener('click', () => this.openGridModal());
    }
    if (this.gridToggleBtn) {
      this.gridToggleBtn.addEventListener('click', () => this.openGridModal());
    }

    // Grid modal close
    if (this.gridCloseBtn) {
      this.gridCloseBtn.addEventListener('click', () => this.closeGridModal());
    }

    // Close modal on backdrop click (clicking outside modal-inner)
    if (this.gridModal) {
      this.gridModal.addEventListener('click', (e) => {
        if (e.target === this.gridModal) this.closeGridModal();
      });
    }

    // Touch events for swipe
    this.displayArea.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.displayArea.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

    // Mouse drag fallback for desktop
    this.displayArea.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.displayArea.addEventListener('mouseup', (e) => this.handleMouseUp(e));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.gridModalOpen) {
        if (e.key === 'Escape') this.closeGridModal();
        return;
      }
      if (e.key === 'ArrowRight') this.handleNextClick();
      else if (e.key === 'ArrowLeft') this.handlePreviousClick();
    });
  }

  /* ----------------------
     Grid Modal Controls
  ---------------------- */
  openGridModal() {
    if (!this.gridModal) return;
    this._syncGridActiveCell();
    this.gridModal.removeAttribute('hidden');
    this.gridModalOpen = true;

    // Scroll active cell into view
    const activeCell = this.lettersGrid
      ? this.lettersGrid.querySelector('.active-letter') : null;
    if (activeCell) {
      setTimeout(() => activeCell.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
    }
  }

  closeGridModal() {
    if (!this.gridModal) return;
    this.gridModal.setAttribute('hidden', '');
    this.gridModalOpen = false;
  }

  /**
   * Sync the active cell highlight in the grid and sidebar to the current letter index
   */
  _syncGridActiveCell() {
    const currentIndex = this.app.getCurrentIndex();

    // Sync modal & inline grid cells
    const syncGrid = (gridEl) => {
      if (!gridEl) return;
      const cells = gridEl.querySelectorAll('.letter-grid-cell');
      cells.forEach((cell, i) => {
        cell.classList.toggle('active-letter', i === currentIndex);
      });
      // specific logic to scroll into view happens when modal opens,
      // but for inline grid we can scroll it if it's visible
      if (gridEl.id === 'letters-grid-inline') {
        const activeCell = gridEl.querySelector('.active-letter');
        if (activeCell) activeCell.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    };
    syncGrid(this.lettersGrid);
    syncGrid(this.inlineGrid);

    // Sync sidebar list
    if (this.sidebarList) {
      const rows = this.sidebarList.querySelectorAll('.sidebar-letter-row');
      rows.forEach((row, i) => {
        row.classList.toggle('active', i === currentIndex);
      });
      const activeRow = this.sidebarList.querySelector('.active');
      if (activeRow) activeRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /* ----------------------
     Touch / Swipe Handlers
  ---------------------- */
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.touchEndY = e.changedTouches[0].screenY;
    this.detectSwipe();
  }

  handleMouseDown(e) {
    this.touchStartX = e.screenX;
    this.touchStartY = e.screenY;
  }

  handleMouseUp(e) {
    this.touchEndX = e.screenX;
    this.touchEndY = e.screenY;
    this.detectSwipe();
  }

  detectSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Ignore if no significant movement
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) return;

    // Ignore vertical swipes (prioritize scrolling)
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    // Require more significant horizontal movement
    const threshold = 60;
    if (deltaX < -threshold) this.handleSwipe('left');
    else if (deltaX > threshold) this.handleSwipe('right');
  }

  handleSwipe(direction) {
    if (this.app.state.isTransitioning) return;
    this.app.setTransitioning(true);

    if (direction === 'left') {
      this.app.nextLetter();
      this.updateDisplay(this.app.getCurrentLetter());
      this.showTransition('next');
    } else if (direction === 'right') {
      this.app.previousLetter();
      this.updateDisplay(this.app.getCurrentLetter());
      this.showTransition('prev');
    }

    setTimeout(() => this.app.setTransitioning(false), 300);
  }

  /* ----------------------
     Navigation Handlers
  ---------------------- */
  handleNextClick() {
    if (this.app.state.isTransitioning) return;
    this.app.setTransitioning(true);
    this.app.nextLetter();
    this.updateDisplay(this.app.getCurrentLetter());
    this.showTransition('next');
    setTimeout(() => this.app.setTransitioning(false), 300);
  }

  handlePreviousClick() {
    if (this.app.state.isTransitioning) return;
    this.app.setTransitioning(true);
    this.app.previousLetter();
    this.updateDisplay(this.app.getCurrentLetter());
    this.showTransition('prev');
    setTimeout(() => this.app.setTransitioning(false), 300);
  }

  /* ----------------------
     Transition Animation
  ---------------------- */
  showTransition(direction) {
    this.letterCard.classList.remove('slide-in-left', 'slide-in-right');
    // Trigger reflow
    void this.letterCard.offsetWidth;

    if (direction === 'next') {
      this.letterCard.classList.add('slide-in-left');
    } else if (direction === 'prev') {
      this.letterCard.classList.add('slide-in-right');
    }

    setTimeout(() => {
      this.letterCard.classList.remove('slide-in-left', 'slide-in-right');
    }, 300);
  }

  /* ----------------------
     Audio
  ---------------------- */
  playAudio(src) {
    if (!src) return;

    // Skip in JSDOM test environments
    if (typeof navigator !== 'undefined' && navigator.userAgent &&
      navigator.userAgent.includes('jsdom')) return;

    this.audio.src = src;
    try {
      const playPromise = this.audio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => { });
      }
    } catch (e) {
      // Swallow synchronous errors (e.g. JSDOM)
    }
  }

  /* ----------------------
     Hybrid Voice & Audio
  ---------------------- */
  playPronunciation(letter) {
      if (!letter) return;
      
      // If we have an Arabic TTS voice, use that
      if (this.speechSynth && this.arabicVoiceStr) {
         if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('jsdom')) return;

         try {
             this.speechSynth.cancel();
             const utterance = new SpeechSynthesisUtterance(letter.arabic);
             utterance.lang = 'ar-SA';
             utterance.voice = this.arabicVoiceStr;
             utterance.rate = 0.9;
             // fallback to recorded audio if TTS errors at flight time
             utterance.onerror = () => {
                 if (letter.audio) this.playAudio(letter.audio); 
             };
             this.speechSynth.speak(utterance);
             return; // TTS succeeded, return early
         } catch (e) {
             console.error('Speech error:', e);
             // fallback to recorded voice on error
         }
      }
      
      // Fallback to recorded audio file if no Arabic TTS voice available
      if (letter.audio) {
          this.playAudio(letter.audio);
      }
  }

  /* ----------------------
     Progress Updates
  ---------------------- */
  updateProgress() {
    const current = this.app.getCurrentIndex();
    const total = this.app.getLettersCount();
    const display = current + 1;

    // Badge & sidebar counters
    if (this.progressCurrent) {
      this.progressCurrent.textContent = display;
    }
    if (this.sidebarProgCur) {
      this.sidebarProgCur.textContent = display;
    }

    // Progress bar fill width
    const pct = (display / total) * 100;
    if (this.progressBarFill) {
      this.progressBarFill.style.width = `${pct}%`;
    }
    if (this.sidebarProgFill) {
      this.sidebarProgFill.style.width = `${pct}%`;
    }

    // Update aria-valuenow on track
    if (this.progressBarTrack) {
      this.progressBarTrack.setAttribute('aria-valuenow', display);
    }

    // Update dot indicators — window of 7 around current
    this._updateProgressDots(current, total);
  }

  /**
   * Show up to 7 dot indicators centred around the current index
   */
  _updateProgressDots(current, total) {
    if (!this.progressDotsEl) return;
    const dotsCount = Math.min(total, 7);
    const half = Math.floor(dotsCount / 2);

    // Clamp window start so we don't go out of bounds
    let start = current - half;
    if (start < 0) start = 0;
    if (start + dotsCount > total) start = total - dotsCount;

    const dots = this.progressDotsEl.querySelectorAll('.progress-dot');
    dots.forEach((dot, i) => {
      const idx = start + i;
      dot.classList.toggle('active', idx === current);
    });
  }

  /* ----------------------
     Main Display Update
  ---------------------- */
  updateDisplay(letter) {
    if (!letter || !letter.arabic || !letter.name) {
      throw new Error('Invalid letter object');
    }

    // Update letter content
    this.letterArabic.textContent = letter.arabic;
    this.letterName.textContent = letter.name;

    // Bounce animation on the letter
    this.letterArabic.classList.remove('animate-pop');
    void this.letterArabic.offsetWidth; // trigger reflow
    this.letterArabic.classList.add('animate-pop');

    // Dynamic background hue shift on the circle container
    const currentIndex = this.app.getCurrentIndex();
    const hue = (currentIndex * (360 / 28)) % 360;
    document.documentElement.style.setProperty('--card-hue', hue);

    // Update example word + meaning
    if (this.exampleWord && this.exampleMeaning && letter.example) {
      this.exampleWord.textContent = letter.example.word;
      this.exampleMeaning.textContent = letter.example.meaning;
    }

    // Update progress indicators
    this.updateProgress();

    // Make sure active cell highlights are synced
    this._syncGridActiveCell();

    // Play pronunciation
    this.playPronunciation(letter);

    // Confetti on final letter 🎉
    if (currentIndex === this.app.getLettersCount() - 1) {
      this.showConfetti();
    }
  }

  /* ----------------------
     Confetti Celebration
  ---------------------- */
  showConfetti() {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';

      const isStar = Math.random() > 0.5;
      if (isStar) {
        confetti.classList.add('star-piece');
        confetti.style.width = '20px';
        confetti.style.height = '20px';
      } else {
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 65%)`;
        confetti.style.width = '10px';
        confetti.style.height = '20px';
        confetti.style.borderRadius = '3px';
      }

      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.setProperty('--fall-duration', `${Math.random() * 2 + 2}s`);
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }
  }
}
