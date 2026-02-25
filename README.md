# Hijaiyah Learning Web

An interactive web application designed to introduce young children (ages 2+) to the 28 letters of the Arabic alphabet (Hijaiyah). Built with vanilla HTML, CSS, and JavaScript—no frameworks, no dependencies, works completely offline.

## Features

- **28 Hijaiyah Letters**: Complete Arabic alphabet in traditional order
- **Touch-Optimized**: Large buttons and swipe gestures designed for small hands
- **Progressive Web App (PWA)**: Installable directly to the home screen for a native app-like experience
- **Offline-First**: Works without an internet connection via Service Worker caching
- **Audio Pronunciation**: Tap the speaker icon to hear the correct pronunciation
- **Progress Tracking**: Visual indicator showing current position (e.g., 1/28)
- **Engaging Visuals**: Dynamic background colors, bounce animations, and end-of-alphabet confetti celebration!
- **Responsive Design**: Adapts to phones and tablets (320px-1024px)
- **High Contrast**: Clear, readable text with child-friendly typography (Nunito)
- **Zero Dependencies**: Pure HTML, CSS, and JavaScript

## Quick Start

1. Download or clone this repository, or host it on any web server
2. Open `index.html` in a web browser
3. (Optional) Click "Install/Add to Home Screen" in your browser's menu to install as a PWA
4. That's it! Start learning immediately

No build process or configuration required.

## Usage

### Navigation

- **Next/Previous Buttons**: Tap the large arrow buttons at the bottom to move between letters
- **Swipe Gestures**: Swipe left for next letter, swipe right for previous letter
- **Wrap-Around**: Automatically loops from last letter back to first (and vice versa)

### For Parents

- The app displays one letter at a time to maintain focus
- Letters appear in traditional Hijaiyah order (Alif to Ya)
- Each letter shows both the Arabic character and its romanized name
- Works on tablets and phones—perfect for on-the-go learning

## Project Structure

```
hijaiyah-learning-web/
├── index.html              # Main application entry point
├── scripts/
│   ├── data.js            # Browser version (no exports)
│   ├── data.test.js       # Test version (with ES6 exports)
│   ├── app.js             # Browser version (no exports)
│   ├── app.test.js        # Test version (with ES6 exports)
│   ├── ui.js              # Browser version (no exports)
│   └── ui.test.js         # Test version (with ES6 exports)
├── styles/
│   └── main.css           # All styling, responsive layout, animations
├── tests/
│   ├── data.test.js       # Data integrity tests
│   ├── app.unit.test.js   # Unit tests for core functionality
│   ├── app.property.test.js  # Property-based tests
│   └── offline.test.js    # Offline functionality verification
├── package.json           # Development dependencies (testing only)
└── README.md              # This file
```

## File Architecture

The project uses a **dual-file approach** to solve ES6 module compatibility between browsers and Node.js:

### Browser Files (`scripts/*.js`)
- Used by `index.html` via `<script>` tags
- No ES6 exports—functions and variables are global
- Work directly in browsers without module bundlers
- Keep the app dependency-free and offline-capable

### Test Files (`scripts/*.test.js`)
- Used by Node.js test runner
- Include ES6 exports (`export { ... }`)
- Import statements for Node.js module system
- Enable proper unit testing without browser environment

### Why Separate Files?

Browsers and Node.js handle modules differently:
- **Browsers**: Can't use ES6 modules with regular `<script>` tags without `type="module"`, which adds complexity
- **Node.js**: Requires explicit exports to import code in tests

This architecture keeps the browser code simple while enabling comprehensive testing.

### Keeping Files in Sync

When modifying code:
1. Make changes to the browser file (`*.js`)
2. Copy the same logic to the test file (`*.test.js`)
3. Add `export { ... }` statements at the end of the test file
4. Run tests to verify both versions work correctly

**Example**:
```javascript
// app.js (browser)
function nextLetter() { /* ... */ }

// app.test.js (test)
function nextLetter() { /* ... */ }
export { nextLetter };  // Only difference
```

## Browser Compatibility

Tested and working on:

- **Chrome/Edge** (Chromium-based): ✅ Full support
- **Safari** (iOS and macOS): ✅ Full support
- **Firefox**: ✅ Full support
- **Samsung Internet** (Android): ✅ Full support

**Minimum Requirements**:
- Modern browser with ES6 support
- Touch events support (for mobile/tablet)
- CSS Grid and Flexbox support

**Recommended**:
- Tablet or phone with touchscreen for optimal experience
- Screen size: 320px-1024px width

## Development

### File Architecture Note

The project maintains separate browser and test versions of JavaScript files (see "File Architecture" section above). When making changes:
- Edit the browser file (`scripts/*.js`) first
- Sync changes to the test file (`scripts/*.test.js`)
- Ensure exports are added to test files only
- Run tests to verify both versions work

### Running Tests

The application includes comprehensive tests using Node.js built-in test runner and fast-check for property-based testing.

**Install development dependencies**:
```bash
npm install
```

**Run all tests**:
```bash
npm run test:all
```

**Run specific test suites**:
```bash
npm test              # Data integrity tests
npm run test:unit     # Unit tests
npm run test:property # Property-based tests
npm run test:offline  # Offline mode tests
```

### Testing Offline Functionality

1. Open `index.html` in your browser
2. Open browser DevTools (F12)
3. Go to Network tab
4. Enable "Offline" mode
5. Reload the page—it should work perfectly

Alternatively, enable airplane mode on your device and test the application.

### Code Architecture

The application follows a simple MVC pattern:

- **Model** (`data.js`): Hijaiyah letters dataset
- **Controller** (`app.js`): State management and navigation logic
- **View** (`ui.js`): DOM manipulation and user interactions

State flows unidirectionally: User Action → Controller → View Update

### Performance Notes

- **Initial Load**: < 2 seconds (typically < 500ms)
- **Navigation Response**: < 300ms per letter change
- **Animation Duration**: 300ms smooth transitions
- **Memory**: Minimal—single letter card reused, no dynamic DOM creation

### Accessibility

- ARIA labels on navigation buttons
- High contrast colors (4.5:1 ratio minimum)
- Large touch targets (44x44px minimum)
- Keyboard navigation support (basic)

## Technical Details

### Touch Gesture Detection

- **Swipe Threshold**: 50px minimum horizontal movement
- **Vertical Swipes**: Ignored (allows scrolling)
- **Fallback**: Mouse events for desktop testing

### Responsive Breakpoints

- **Phone**: 320px-767px (optimized for portrait)
- **Tablet**: 768px-1024px (optimized for landscape)
- **Font Scaling**: Uses CSS `clamp()` for proportional sizing

### Animation Lock

The `isTransitioning` flag prevents rapid navigation during animations, ensuring smooth visual experience and preventing state conflicts.

## License

MIT License - Feel free to use, modify, and distribute this application.

## Contributing

This is an educational project designed for simplicity. If you'd like to contribute:

1. Keep it simple—no external dependencies
2. Maintain offline functionality
3. Follow the dual-file architecture (browser `.js` + test `.test.js`)
4. Ensure touch targets remain at least 44x44px
5. Test on actual devices with young children
6. Run all tests before submitting changes

## Credits

Built with ❤️ for young learners exploring the Arabic alphabet.
