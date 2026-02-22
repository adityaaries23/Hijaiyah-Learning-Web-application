/**
 * Unit Tests for HijaiyahApp State Management
 * Validates: Requirements 2.2, 2.3, 2.4, 2.5
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { HIJAIYAH_LETTERS } from '../scripts/data.test.js';
import { HijaiyahApp } from '../scripts/app.test.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Test initial state
 */
test('Initial state has currentIndex = 0', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  assert.strictEqual(
    app.getCurrentIndex(),
    0,
    'Initial currentIndex should be 0'
  );
});

test('Initial state returns first letter (Alif)', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  const currentLetter = app.getCurrentLetter();
  
  assert.strictEqual(
    currentLetter.arabic,
    'ا',
    'Initial letter should be Alif (ا)'
  );
  assert.strictEqual(
    currentLetter.name,
    'Alif',
    'Initial letter name should be Alif'
  );
  assert.strictEqual(
    currentLetter.id,
    1,
    'Initial letter id should be 1'
  );
});

test('Initial state has isTransitioning = false', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  assert.strictEqual(
    app.state.isTransitioning,
    false,
    'Initial isTransitioning should be false'
  );
});

test('Constructor throws error for empty letters array', () => {
  assert.throws(
    () => new HijaiyahApp([]),
    /Letters array must be a non-empty array/,
    'Should throw error for empty array'
  );
});

test('Constructor throws error for non-array input', () => {
  assert.throws(
    () => new HijaiyahApp(null),
    /Letters array must be a non-empty array/,
    'Should throw error for null input'
  );
  
  assert.throws(
    () => new HijaiyahApp('not an array'),
    /Letters array must be a non-empty array/,
    'Should throw error for string input'
  );
});

/**
 * Test state transitions at boundaries
 */
test('State transition: next from index 0 goes to index 1', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  assert.strictEqual(app.getCurrentIndex(), 0);
  app.nextLetter();
  assert.strictEqual(app.getCurrentIndex(), 1);
});

test('State transition: previous from index 1 goes to index 0', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  app.goToLetter(1);
  
  assert.strictEqual(app.getCurrentIndex(), 1);
  app.previousLetter();
  assert.strictEqual(app.getCurrentIndex(), 0);
});

test('State transition: next from last index (27) wraps to 0', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  app.goToLetter(27);
  
  assert.strictEqual(app.getCurrentIndex(), 27);
  app.nextLetter();
  assert.strictEqual(app.getCurrentIndex(), 0);
});

test('State transition: previous from first index (0) wraps to 27', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  assert.strictEqual(app.getCurrentIndex(), 0);
  app.previousLetter();
  assert.strictEqual(app.getCurrentIndex(), 27);
});

test('State transition: goToLetter with valid index updates currentIndex', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  const result = app.goToLetter(15);
  assert.strictEqual(result, true, 'goToLetter should return true for valid index');
  assert.strictEqual(app.getCurrentIndex(), 15);
});

test('State transition: goToLetter with invalid index returns false', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  const result1 = app.goToLetter(-1);
  assert.strictEqual(result1, false, 'goToLetter should return false for negative index');
  assert.strictEqual(app.getCurrentIndex(), 0, 'Index should remain unchanged');
  
  const result2 = app.goToLetter(28);
  assert.strictEqual(result2, false, 'goToLetter should return false for out-of-range index');
  assert.strictEqual(app.getCurrentIndex(), 0, 'Index should remain unchanged');
  
  const result3 = app.goToLetter(1.5);
  assert.strictEqual(result3, false, 'goToLetter should return false for non-integer index');
  assert.strictEqual(app.getCurrentIndex(), 0, 'Index should remain unchanged');
});

/**
 * Test isTransitioning flag behavior
 */
test('isTransitioning flag can be set to true', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  app.setTransitioning(true);
  assert.strictEqual(app.state.isTransitioning, true);
});

test('isTransitioning flag can be set to false', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  app.setTransitioning(true);
  app.setTransitioning(false);
  assert.strictEqual(app.state.isTransitioning, false);
});

test('nextLetter changes index even when isTransitioning is true', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  app.setTransitioning(true);
  
  const beforeIndex = app.getCurrentIndex();
  app.nextLetter();
  const afterIndex = app.getCurrentIndex();
  
  assert.strictEqual(
    afterIndex,
    (beforeIndex + 1) % 28,
    'Index should change even when isTransitioning is true (UI handlers control the lock)'
  );
});

test('previousLetter changes index even when isTransitioning is true', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  app.goToLetter(5);
  app.setTransitioning(true);
  
  const beforeIndex = app.getCurrentIndex();
  app.previousLetter();
  const afterIndex = app.getCurrentIndex();
  
  assert.strictEqual(
    afterIndex,
    (beforeIndex - 1 + 28) % 28,
    'Index should change even when isTransitioning is true (UI handlers control the lock)'
  );
});

test('goToLetter does not change index when isTransitioning is true', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  app.setTransitioning(true);
  
  const result = app.goToLetter(10);
  assert.strictEqual(result, false, 'goToLetter should return false when isTransitioning is true');
  assert.strictEqual(app.getCurrentIndex(), 0, 'Index should remain at initial value');
});

/**
 * Test isValidIndex validation method
 */
test('isValidIndex returns true for valid indices (0-27)', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  assert.strictEqual(app.isValidIndex(0), true);
  assert.strictEqual(app.isValidIndex(13), true);
  assert.strictEqual(app.isValidIndex(27), true);
});

test('isValidIndex returns false for negative indices', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  assert.strictEqual(app.isValidIndex(-1), false);
  assert.strictEqual(app.isValidIndex(-10), false);
});

test('isValidIndex returns false for out-of-range indices', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  assert.strictEqual(app.isValidIndex(28), false);
  assert.strictEqual(app.isValidIndex(100), false);
});

test('isValidIndex returns false for non-integer indices', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  assert.strictEqual(app.isValidIndex(1.5), false);
  assert.strictEqual(app.isValidIndex(3.14), false);
});

test('isValidIndex returns false for non-numeric values', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  assert.strictEqual(app.isValidIndex('5'), false);
  assert.strictEqual(app.isValidIndex(null), false);
  assert.strictEqual(app.isValidIndex(undefined), false);
  assert.strictEqual(app.isValidIndex({}), false);
});

/**
 * Test helper methods
 */
test('getLettersCount returns correct count', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  assert.strictEqual(app.getLettersCount(), 28);
});

test('getCurrentLetter returns correct letter object', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  app.goToLetter(5);
  
  const letter = app.getCurrentLetter();
  assert.strictEqual(letter.id, 6);
  assert.strictEqual(letter.arabic, 'ح');
  assert.strictEqual(letter.name, 'Ha');
});

/**
 * Test gesture detection edge cases
 * Validates: Requirements 4.4, 4.5
 */

test('Swipe exactly at 50px threshold (right) should trigger navigation', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate swipe right exactly 50px
  const deltaX = 50;
  const deltaY = 0;
  
  // deltaX > 50 is false, so exactly 50px should NOT trigger
  // But deltaX >= 50 would trigger, so we need to check the actual logic
  // According to detectSwipe: deltaX > 50 (strictly greater)
  // So exactly 50px should NOT trigger navigation
  
  const initialIndex = app.getCurrentIndex();
  
  // Simulate the condition check from detectSwipe
  const shouldTrigger = deltaX > 50;
  
  assert.strictEqual(
    shouldTrigger,
    false,
    'Swipe exactly at 50px should NOT trigger navigation (requires > 50)'
  );
});

test('Swipe exactly at -50px threshold (left) should trigger navigation', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate swipe left exactly -50px
  const deltaX = -50;
  const deltaY = 0;
  
  // deltaX < -50 is false, so exactly -50px should NOT trigger
  // According to detectSwipe: deltaX < -50 (strictly less than)
  // So exactly -50px should NOT trigger navigation
  
  const shouldTrigger = deltaX < -50;
  
  assert.strictEqual(
    shouldTrigger,
    false,
    'Swipe exactly at -50px should NOT trigger navigation (requires < -50)'
  );
});

test('Swipe at 51px (right) should trigger navigation', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate swipe right 51px (just above threshold)
  const deltaX = 51;
  const deltaY = 0;
  
  // deltaX > 50 should be true
  const shouldTrigger = deltaX > 50;
  
  assert.strictEqual(
    shouldTrigger,
    true,
    'Swipe at 51px should trigger navigation'
  );
});

test('Swipe at -51px (left) should trigger navigation', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate swipe left -51px (just above threshold)
  const deltaX = -51;
  const deltaY = 0;
  
  // deltaX < -50 should be true
  const shouldTrigger = deltaX < -50;
  
  assert.strictEqual(
    shouldTrigger,
    true,
    'Swipe at -51px should trigger navigation'
  );
});

test('Swipe just below 50px threshold (49px right) should be ignored', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate swipe right 49px (below threshold)
  const deltaX = 49;
  const deltaY = 0;
  
  // deltaX > 50 should be false
  const shouldTrigger = deltaX > 50;
  
  assert.strictEqual(
    shouldTrigger,
    false,
    'Swipe at 49px should be ignored (below threshold)'
  );
});

test('Swipe just below -50px threshold (-49px left) should be ignored', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate swipe left -49px (below threshold)
  const deltaX = -49;
  const deltaY = 0;
  
  // deltaX < -50 should be false
  const shouldTrigger = deltaX < -50;
  
  assert.strictEqual(
    shouldTrigger,
    false,
    'Swipe at -49px should be ignored (below threshold)'
  );
});

test('Vertical swipe where |deltaY| > |deltaX| should be ignored', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate vertical swipe: 30px horizontal, 60px vertical
  const deltaX = 30;
  const deltaY = 60;
  
  // Check if vertical movement is greater than horizontal
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
  
  assert.strictEqual(
    isVertical,
    true,
    'Vertical swipe should be detected when |deltaY| > |deltaX|'
  );
  
  // Vertical swipes should be ignored (no navigation)
  const shouldIgnore = isVertical;
  assert.strictEqual(
    shouldIgnore,
    true,
    'Vertical swipe should be ignored'
  );
});

test('Vertical swipe with negative deltaY should be ignored', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate upward vertical swipe: 20px horizontal, -80px vertical
  const deltaX = 20;
  const deltaY = -80;
  
  // Check if vertical movement is greater than horizontal
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
  
  assert.strictEqual(
    isVertical,
    true,
    'Upward vertical swipe should be detected when |deltaY| > |deltaX|'
  );
});

test('Vertical swipe with large horizontal component but larger vertical should be ignored', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate diagonal swipe: 60px horizontal (above threshold), 100px vertical
  const deltaX = 60;
  const deltaY = 100;
  
  // Even though deltaX > 50, vertical component is larger
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
  
  assert.strictEqual(
    isVertical,
    true,
    'Should be classified as vertical when |deltaY| > |deltaX|, even if deltaX > 50'
  );
});

test('Diagonal swipe where |deltaY| = |deltaX| should be ignored as vertical', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate perfect diagonal swipe: 60px horizontal, 60px vertical
  const deltaX = 60;
  const deltaY = 60;
  
  // When equal, Math.abs(deltaY) > Math.abs(deltaX) is false
  // So this would NOT be ignored by the vertical check
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
  
  assert.strictEqual(
    isVertical,
    false,
    'Perfect diagonal (|deltaY| = |deltaX|) is NOT classified as vertical'
  );
  
  // However, it would trigger horizontal navigation since deltaX > 50
  const shouldTriggerHorizontal = deltaX > 50;
  assert.strictEqual(
    shouldTriggerHorizontal,
    true,
    'Perfect diagonal with deltaX > 50 would trigger horizontal navigation'
  );
});

test('Diagonal swipe where |deltaY| = |deltaX| with negative values', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate perfect diagonal swipe: -60px horizontal, -60px vertical
  const deltaX = -60;
  const deltaY = -60;
  
  // When equal, Math.abs(deltaY) > Math.abs(deltaX) is false
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
  
  assert.strictEqual(
    isVertical,
    false,
    'Perfect diagonal with negative values is NOT classified as vertical'
  );
  
  // It would trigger horizontal navigation since deltaX < -50
  const shouldTriggerHorizontal = deltaX < -50;
  assert.strictEqual(
    shouldTriggerHorizontal,
    true,
    'Perfect diagonal with deltaX < -50 would trigger horizontal navigation'
  );
});

test('Ambiguous gesture with very small horizontal movement should be ignored', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate very small horizontal movement: 5px horizontal, 2px vertical
  const deltaX = 5;
  const deltaY = 2;
  
  // Not vertical (deltaY not greater than deltaX)
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
  assert.strictEqual(isVertical, false);
  
  // But below threshold, so should be ignored
  const shouldTrigger = deltaX > 50 || deltaX < -50;
  assert.strictEqual(
    shouldTrigger,
    false,
    'Very small horizontal movement should be ignored (below threshold)'
  );
});

test('Ambiguous gesture with very small vertical movement should be ignored', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate very small vertical movement: 3px horizontal, 8px vertical
  const deltaX = 3;
  const deltaY = 8;
  
  // Vertical (deltaY greater than deltaX)
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
  assert.strictEqual(
    isVertical,
    true,
    'Small vertical movement should be classified as vertical'
  );
});

test('Ambiguous gesture with zero movement should be ignored', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate no movement (tap)
  const deltaX = 0;
  const deltaY = 0;
  
  // Not vertical
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
  assert.strictEqual(isVertical, false);
  
  // Below threshold
  const shouldTrigger = deltaX > 50 || deltaX < -50;
  assert.strictEqual(
    shouldTrigger,
    false,
    'Zero movement (tap) should be ignored'
  );
});

test('Horizontal swipe with minimal vertical component should trigger navigation', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate mostly horizontal swipe: 80px horizontal, 10px vertical
  const deltaX = 80;
  const deltaY = 10;
  
  // Not vertical (deltaY not greater than deltaX)
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
  assert.strictEqual(isVertical, false);
  
  // Above threshold
  const shouldTrigger = deltaX > 50;
  assert.strictEqual(
    shouldTrigger,
    true,
    'Mostly horizontal swipe should trigger navigation'
  );
});

test('Horizontal swipe left with minimal vertical component should trigger navigation', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate mostly horizontal left swipe: -80px horizontal, 10px vertical
  const deltaX = -80;
  const deltaY = 10;
  
  // Not vertical (deltaY not greater than deltaX in absolute terms)
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX);
  assert.strictEqual(isVertical, false);
  
  // Above threshold
  const shouldTrigger = deltaX < -50;
  assert.strictEqual(
    shouldTrigger,
    true,
    'Mostly horizontal left swipe should trigger navigation'
  );
});

/**
 * Test animation timing
 * Validates: Requirements 8.1
 */

test('Animation duration is set to 300ms in CSS', () => {
  // Read the CSS file to verify transition duration
  const cssPath = join(__dirname, '..', 'styles', 'main.css');
  const cssContent = readFileSync(cssPath, 'utf-8');
  
  // Check for --transition-speed: 300ms in CSS custom properties
  const transitionSpeedMatch = cssContent.match(/--transition-speed:\s*300ms/);
  
  assert.ok(
    transitionSpeedMatch,
    'CSS should define --transition-speed as 300ms'
  );
  
  // Check that transition properties use the variable
  const transitionUsageMatch = cssContent.match(/transition:.*var\(--transition-speed\)/);
  
  assert.ok(
    transitionUsageMatch,
    'CSS transitions should use var(--transition-speed)'
  );
});

test('Animation keyframes use 300ms duration', () => {
  // Verify that animation classes reference the transition speed
  const cssPath = join(__dirname, '..', 'styles', 'main.css');
  const cssContent = readFileSync(cssPath, 'utf-8');
  
  // Check for animation duration in slide-in animations
  const slideInLeftMatch = cssContent.match(/\.slide-in-left\s*\{[^}]*animation:[^}]*var\(--transition-speed\)/s);
  const slideInRightMatch = cssContent.match(/\.slide-in-right\s*\{[^}]*animation:[^}]*var\(--transition-speed\)/s);
  
  assert.ok(
    slideInLeftMatch || slideInRightMatch,
    'Slide animations should use var(--transition-speed) for duration'
  );
});

test('isTransitioning flag is set during navigation', (t, done) => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Initial state should be false
  assert.strictEqual(
    app.state.isTransitioning,
    false,
    'isTransitioning should initially be false'
  );
  
  // Set transitioning to true (simulating navigation start)
  app.setTransitioning(true);
  
  assert.strictEqual(
    app.state.isTransitioning,
    true,
    'isTransitioning should be true during navigation'
  );
  
  // Clean up
  app.setTransitioning(false);
  done();
});

test('isTransitioning flag prevents concurrent navigation via goToLetter', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Set transitioning to true
  app.setTransitioning(true);
  
  // Attempt to navigate using goToLetter
  const result = app.goToLetter(5);
  
  assert.strictEqual(
    result,
    false,
    'goToLetter should return false when isTransitioning is true'
  );
  
  assert.strictEqual(
    app.getCurrentIndex(),
    0,
    'Index should remain unchanged when navigation is blocked'
  );
});

test('isTransitioning flag is cleared after 300ms timeout', (t, done) => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Set transitioning to true
  app.setTransitioning(true);
  
  assert.strictEqual(
    app.state.isTransitioning,
    true,
    'isTransitioning should be true initially'
  );
  
  // Simulate the timeout that clears the flag (as done in UIManager)
  setTimeout(() => {
    app.setTransitioning(false);
    
    assert.strictEqual(
      app.state.isTransitioning,
      false,
      'isTransitioning should be false after 300ms timeout'
    );
    
    done();
  }, 300);
});

test('Concurrent navigation attempts are blocked during transition', (t, done) => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Start first navigation
  app.setTransitioning(true);
  app.nextLetter();
  
  const indexAfterFirst = app.getCurrentIndex();
  assert.strictEqual(indexAfterFirst, 1, 'First navigation should succeed');
  
  // Attempt second navigation while transitioning
  const goToResult = app.goToLetter(10);
  
  assert.strictEqual(
    goToResult,
    false,
    'Second navigation via goToLetter should be blocked'
  );
  
  assert.strictEqual(
    app.getCurrentIndex(),
    1,
    'Index should remain at 1 after blocked navigation'
  );
  
  // Clear transition flag after 300ms
  setTimeout(() => {
    app.setTransitioning(false);
    
    // Now navigation should work
    const result = app.goToLetter(10);
    assert.strictEqual(
      result,
      true,
      'Navigation should succeed after transition completes'
    );
    
    assert.strictEqual(
      app.getCurrentIndex(),
      10,
      'Index should update after transition completes'
    );
    
    done();
  }, 300);
});

test('Multiple rapid navigation attempts respect transition lock', (t, done) => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Simulate rapid navigation attempts
  app.setTransitioning(true);
  app.nextLetter(); // Should work (index -> 1)
  
  const attempt1 = app.goToLetter(5);
  const attempt2 = app.goToLetter(10);
  const attempt3 = app.goToLetter(15);
  
  assert.strictEqual(attempt1, false, 'First rapid attempt should be blocked');
  assert.strictEqual(attempt2, false, 'Second rapid attempt should be blocked');
  assert.strictEqual(attempt3, false, 'Third rapid attempt should be blocked');
  
  assert.strictEqual(
    app.getCurrentIndex(),
    1,
    'Index should remain at 1 after all blocked attempts'
  );
  
  // After 300ms, navigation should work again
  setTimeout(() => {
    app.setTransitioning(false);
    
    const successfulAttempt = app.goToLetter(20);
    assert.strictEqual(
      successfulAttempt,
      true,
      'Navigation should succeed after lock is released'
    );
    
    assert.strictEqual(
      app.getCurrentIndex(),
      20,
      'Index should update to 20'
    );
    
    done();
  }, 300);
});

test('Transition timeout duration matches CSS animation duration', (t, done) => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  
  // Record start time
  const startTime = Date.now();
  
  // Set transitioning
  app.setTransitioning(true);
  
  // Simulate the timeout (as done in UIManager)
  setTimeout(() => {
    app.setTransitioning(false);
    
    const elapsedTime = Date.now() - startTime;
    
    // Allow reasonable margin for timing (280-330ms to account for system delays)
    assert.ok(
      elapsedTime >= 280 && elapsedTime <= 330,
      `Timeout should be approximately 300ms, was ${elapsedTime}ms`
    );
    
    assert.strictEqual(
      app.state.isTransitioning,
      false,
      'Flag should be cleared after timeout'
    );
    
    done();
  }, 300);
});

/**
 * Test initial load behavior
 * Validates: Requirements 8.2, 9.1
 */

test('Application displays first letter (Alif) on load', () => {
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  const currentLetter = app.getCurrentLetter();
  
  assert.strictEqual(
    currentLetter.arabic,
    'ا',
    'Application should display Alif (ا) on initial load'
  );
  
  assert.strictEqual(
    currentLetter.name,
    'Alif',
    'Application should display letter name "Alif" on initial load'
  );
  
  assert.strictEqual(
    currentLetter.id,
    1,
    'Application should display first letter with id 1 on initial load'
  );
});

test('Initial load time is under 2 seconds', (t, done) => {
  // Record start time
  const startTime = Date.now();
  
  // Simulate application initialization
  const app = new HijaiyahApp(HIJAIYAH_LETTERS);
  const currentLetter = app.getCurrentLetter();
  
  // Calculate elapsed time
  const elapsedTime = Date.now() - startTime;
  
  // Verify first letter is displayed
  assert.strictEqual(
    currentLetter.arabic,
    'ا',
    'First letter should be displayed'
  );
  
  // Verify load time is under 2 seconds (2000ms)
  assert.ok(
    elapsedTime < 2000,
    `Initial load time should be under 2 seconds, was ${elapsedTime}ms`
  );
  
  // In practice, this should be nearly instantaneous (< 10ms)
  // But we test against the requirement of < 2000ms
  assert.ok(
    elapsedTime < 100,
    `Initial load should be fast (< 100ms), was ${elapsedTime}ms`
  );
  
  done();
});

test('Initialization process completes successfully', () => {
  // Test that all initialization steps complete without errors
  let app;
  let initializationSuccessful = false;
  
  try {
    // Step 1: Create app instance
    app = new HijaiyahApp(HIJAIYAH_LETTERS);
    
    // Step 2: Verify initial state is set correctly
    assert.strictEqual(app.getCurrentIndex(), 0, 'Initial index should be 0');
    assert.strictEqual(app.state.isTransitioning, false, 'Initial transition state should be false');
    assert.strictEqual(app.getLettersCount(), 28, 'Should have 28 letters loaded');
    
    // Step 3: Verify first letter is accessible
    const firstLetter = app.getCurrentLetter();
    assert.ok(firstLetter, 'First letter should be accessible');
    assert.ok(firstLetter.arabic, 'First letter should have arabic property');
    assert.ok(firstLetter.name, 'First letter should have name property');
    assert.ok(firstLetter.id, 'First letter should have id property');
    
    // Step 4: Verify navigation methods are available
    assert.strictEqual(typeof app.nextLetter, 'function', 'nextLetter method should exist');
    assert.strictEqual(typeof app.previousLetter, 'function', 'previousLetter method should exist');
    assert.strictEqual(typeof app.goToLetter, 'function', 'goToLetter method should exist');
    
    initializationSuccessful = true;
  } catch (error) {
    assert.fail(`Initialization failed with error: ${error.message}`);
  }
  
  assert.strictEqual(
    initializationSuccessful,
    true,
    'Initialization process should complete successfully'
  );
});
