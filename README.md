# Hijaiyah Learning Web

An interactive web application designed to introduce young children (ages 2+) to the 28 letters of the Arabic alphabet (Hijaiyah). Built with vanilla HTML, CSS, and JavaScript—no frameworks, no dependencies, works completely offline.

## Features

- **28 Hijaiyah Letters**: Complete Arabic alphabet in traditional order
- **Touch-Optimized**: Large buttons and swipe gestures designed for small hands
- **Offline-First**: Works without internet connection—all resources bundled locally
- **Responsive Design**: Adapts to phones and tablets (320px-1024px)
- **High Contrast**: Clear, readable text with bright colors to engage young learners
- **Smooth Animations**: Gentle transitions between letters (300ms)
- **Zero Dependencies**: Pure HTML, CSS, and JavaScript

## Quick Start

1. Download or clone this repository
2. Open `index.html` in a web browser
3. That's it! Start learning immediately

No installation, no build process, no configuration required.

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
│   ├── data.js            # Hijaiyah letters dataset (28 letters)
│   ├── app.js             # Application state and navigation logic
│   └── ui.js              # DOM manipulation and event handlers
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

### Running Tests

The application includes comprehensive tests using Node.js built-in test runner and fast-check for property-based testing.

**Install development dependencies**:
```bash
npm install
```

**Run all tests**:
```bash
npm test:all
```

**Run specific test suites**:
```bash
npm test              # Data integrity tests
npm test:unit         # Unit tests
npm test:property     # Property-based tests
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
3. Ensure touch targets remain at least 44x44px
4. Test on actual devices with young children
5. Run all tests before submitting changes

## Credits

Built with ❤️ for young learners exploring the Arabic alphabet.
