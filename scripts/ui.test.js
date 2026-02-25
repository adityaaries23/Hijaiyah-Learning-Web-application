/**
 * UIManager
 * Handles all DOM manipulation and user interactions
 * Validates: Requirements 1.1, 1.2, 1.4, 9.1
 * TEST VERSION - with ES6 exports for Node.js testing
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
    this.letterArabic = document.querySelector('.letter-arabic');
    this.letterName = document.querySelector('.letter-name');
    this.prevButton = document.querySelector('.prev-button');
    this.nextButton = document.querySelector('.next-button');
    this.progressCurrent = document.querySelector('.progress-current');
    this.progressTotal = document.querySelector('.progress-total');
    this.soundButton = document.querySelector('.sound-button');

    // Validate that all required DOM elements exist
    if (!this.displayArea || !this.letterCard || !this.letterArabic ||
      !this.letterName || !this.prevButton || !this.nextButton) {
      throw new Error('Required DOM elements not found');
    }

    // Audio player instance for letter pronunciation
    this.audio = new Audio();
    this.audio.onerror = () => {
      if (this.soundButton) {
        this.soundButton.classList.add('sound-error');
        setTimeout(() => this.soundButton.classList.remove('sound-error'), 600);
      }
    };

    // Touch/swipe tracking properties
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
  }

  /**
   * Initialize the UI by rendering the first letter
   * Validates: Requirements 9.1
   */
  init() {
    if (this.progressTotal) {
      this.progressTotal.textContent = this.app.getLettersCount();
    }
    const firstLetter = this.app.getCurrentLetter();
    this.updateDisplay(firstLetter);
  }
  /**
   * Set up event listeners for navigation buttons
   * Validates: Requirements 2.2, 2.3, 4.1, 4.2
   */
  setupEventListeners() {
    // Add click event listeners to navigation buttons
    this.nextButton.addEventListener('click', () => this.handleNextClick());
    this.prevButton.addEventListener('click', () => this.handlePreviousClick());

    // Sound button — replay audio for current letter
    if (this.soundButton) {
      this.soundButton.addEventListener('click', () => {
        const letter = this.app.getCurrentLetter();
        if (letter && letter.audio) this.playAudio(letter.audio);
      });
    }

    // Add touch event listeners for swipe gestures
    this.displayArea.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.displayArea.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

    // Add mouse event fallbacks for desktop testing
    this.displayArea.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.displayArea.addEventListener('mouseup', (e) => this.handleMouseUp(e));

    // Keyboard navigation — ArrowRight: next, ArrowLeft: previous
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.handleNextClick();
      else if (e.key === 'ArrowLeft') this.handlePreviousClick();
    });
  }

  /**
   * Handle touch start event
   * @param {TouchEvent} e - Touch event
   * Validates: Requirements 4.1, 4.4, 4.5
   */
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  }

  /**
   * Handle touch end event and detect swipe
   * @param {TouchEvent} e - Touch event
   * Validates: Requirements 4.1, 4.4, 4.5
   */
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.touchEndY = e.changedTouches[0].screenY;
    this.detectSwipe();
  }

  /**
   * Handle mouse down event (desktop fallback)
   * @param {MouseEvent} e - Mouse event
   * Validates: Requirements 4.1, 4.4, 4.5
   */
  handleMouseDown(e) {
    this.touchStartX = e.screenX;
    this.touchStartY = e.screenY;
  }

  /**
   * Handle mouse up event (desktop fallback)
   * @param {MouseEvent} e - Mouse event
   * Validates: Requirements 4.1, 4.4, 4.5
   */
  handleMouseUp(e) {
    this.touchEndX = e.screenX;
    this.touchEndY = e.screenY;
    this.detectSwipe();
  }

  /**
   * Detect swipe direction and trigger navigation
   * Validates: Requirements 4.4, 4.5
   */
  detectSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Ignore vertical swipes (when vertical movement is greater than horizontal)
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    // Detect left swipe (next letter)
    if (deltaX < -50) {
      this.handleSwipe('left');
    }
    // Detect right swipe (previous letter)
    else if (deltaX > 50) {
      this.handleSwipe('right');
    }
  }

  /**
   * Handle swipe gesture and trigger navigation
   * @param {string} direction - Swipe direction ('left' or 'right')
   * Validates: Requirements 4.4, 4.5
   */
  handleSwipe(direction) {
    // Check if animation is in progress
    if (this.app.state.isTransitioning) {
      return;
    }

    // Set animation lock
    this.app.setTransitioning(true);

    // Navigate based on swipe direction
    if (direction === 'left') {
      // Left swipe = next letter
      this.app.nextLetter();

      // Update display with new letter
      const newLetter = this.app.getCurrentLetter();
      this.updateDisplay(newLetter);

      // Show transition animation
      this.showTransition('next');
    } else if (direction === 'right') {
      // Right swipe = previous letter
      this.app.previousLetter();

      // Update display with new letter
      const newLetter = this.app.getCurrentLetter();
      this.updateDisplay(newLetter);

      // Show transition animation
      this.showTransition('prev');
    }

    // Release animation lock after transition duration (300ms)
    setTimeout(() => {
      this.app.setTransitioning(false);
    }, 300);
  }

  /**
   * Handle next button click with animation lock
   * Validates: Requirements 2.2, 4.1, 4.2
   */
  handleNextClick() {
    // Check if animation is in progress
    if (this.app.state.isTransitioning) {
      return;
    }

    // Set animation lock
    this.app.setTransitioning(true);

    // Navigate to next letter
    this.app.nextLetter();

    // Update display with new letter
    const newLetter = this.app.getCurrentLetter();
    this.updateDisplay(newLetter);

    // Show transition animation
    this.showTransition('next');

    // Release animation lock after transition duration (300ms)
    setTimeout(() => {
      this.app.setTransitioning(false);
    }, 300);
  }

  /**
   * Handle previous button click with animation lock
   * Validates: Requirements 2.3, 4.1, 4.2
   */
  handlePreviousClick() {
    // Check if animation is in progress
    if (this.app.state.isTransitioning) {
      return;
    }

    // Set animation lock
    this.app.setTransitioning(true);

    // Navigate to previous letter
    this.app.previousLetter();

    // Update display with new letter
    const newLetter = this.app.getCurrentLetter();
    this.updateDisplay(newLetter);

    // Show transition animation
    this.showTransition('prev');

    // Release animation lock after transition duration (300ms)
    setTimeout(() => {
      this.app.setTransitioning(false);
    }, 300);
  }

  /**
   * Show transition animation when changing letters
   * @param {string} direction - Direction of navigation ('next' or 'prev')
   * Validates: Requirements 3.3, 8.1
   */
  showTransition(direction) {
    // Remove any existing transition classes
    this.letterCard.classList.remove('slide-in-left', 'slide-in-right');

    // Apply appropriate transition based on direction
    if (direction === 'next') {
      // Next: slide in from right
      this.letterCard.classList.add('slide-in-left');
    } else if (direction === 'prev') {
      // Previous: slide in from left
      this.letterCard.classList.add('slide-in-right');
    }

    // Remove transition class after animation completes (300ms)
    setTimeout(() => {
      this.letterCard.classList.remove('slide-in-left', 'slide-in-right');
    }, 300);
  }

  /**
   * Play pronunciation audio for a letter
   * @param {string} src - Audio file path
   */
  playAudio(src) {
    if (!src) return;
    this.audio.src = src;
    this.audio.play().catch(() => {
      // Autoplay may be blocked until user interacts — silent fail
    });
  }

  /**
   * Update the progress indicator
   */
  updateProgress() {
    if (this.progressCurrent) {
      this.progressCurrent.textContent = this.app.getCurrentIndex() + 1;
    }
  }

  /**
   * Update the display with a new letter
   * @param {Object} letter - Letter object with arabic and name properties
   * Validates: Requirements 1.1, 1.2, 1.4
   */
  updateDisplay(letter) {
    if (!letter || !letter.arabic || !letter.name) {
      throw new Error('Invalid letter object');
    }

    // Update the letter card content
    this.letterArabic.textContent = letter.arabic;
    this.letterName.textContent = letter.name;

    // Update progress indicator
    this.updateProgress();

    // Play pronunciation audio
    if (letter.audio) this.playAudio(letter.audio);
  }
}

export { UIManager };


