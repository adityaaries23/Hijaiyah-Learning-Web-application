/**
 * HijaiyahApp Controller
 * Manages application state and navigation logic
 * Validates: Requirements 2.2, 2.3, 2.4, 2.5
 * TEST VERSION - with ES6 exports for Node.js testing
 */

class HijaiyahApp {
  /**
   * Initialize the application with Hijaiyah letters data
   * @param {Array} letters - Array of letter objects with id, arabic, and name properties
   */
  constructor(letters) {
    if (!Array.isArray(letters) || letters.length === 0) {
      throw new Error('Letters array must be a non-empty array');
    }
    
    this.state = {
      currentIndex: 0,
      letters: letters,
      isTransitioning: false
    };
  }

  /**
   * Get the currently displayed letter
   * @returns {Object} Current letter object
   */
  getCurrentLetter() {
    return this.state.letters[this.state.currentIndex];
  }

  /**
   * Navigate to the next letter with wrap-around
   * If at last letter (index 27), wraps to first letter (index 0)
   * Validates: Requirements 2.2, 2.4
   */
  nextLetter() {
    this.state.currentIndex = (this.state.currentIndex + 1) % this.state.letters.length;
  }

  /**
   * Navigate to the previous letter with wrap-around
   * If at first letter (index 0), wraps to last letter (index 27)
   * Validates: Requirements 2.3, 2.5
   */
  previousLetter() {
    this.state.currentIndex = 
      (this.state.currentIndex - 1 + this.state.letters.length) % this.state.letters.length;
  }

  /**
   * Navigate to a specific letter by index
   * @param {number} index - Target letter index (0-27)
   * @returns {boolean} True if navigation successful, false if invalid index
   */
  goToLetter(index) {
    if (!this.isValidIndex(index)) {
      return false;
    }
    
    if (this.state.isTransitioning) {
      return false;
    }
    
    this.state.currentIndex = index;
    return true;
  }

  /**
   * Validate if an index is within valid range
   * @param {number} index - Index to validate
   * @returns {boolean} True if index is valid (0 to letters.length - 1)
   */
  isValidIndex(index) {
    return typeof index === 'number' && 
           index >= 0 && 
           index < this.state.letters.length &&
           Number.isInteger(index);
  }

  /**
   * Set the transitioning state
   * @param {boolean} isTransitioning - Whether animation is in progress
   */
  setTransitioning(isTransitioning) {
    this.state.isTransitioning = isTransitioning;
  }

  /**
   * Get the current index
   * @returns {number} Current letter index
   */
  getCurrentIndex() {
    return this.state.currentIndex;
  }

  /**
   * Get the total number of letters
   * @returns {number} Total letters count
   */
  getLettersCount() {
    return this.state.letters.length;
  }
}

export { HijaiyahApp };
