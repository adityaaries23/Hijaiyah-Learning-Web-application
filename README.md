# Hijaiyah Kids 🌙

An interactive, kid-friendly web application designed to introduce young children (ages 2+) to the 28 letters of the Arabic alphabet (Hijaiyah). Built with vanilla HTML, CSS, and JavaScript—no frameworks, no dependencies, works completely offline.

## ✨ Features

- **28 Hijaiyah Letters**: Complete Arabic alphabet in traditional order with audio pronunciation
- **Multi-Device Support**: Optimized layouts for phones, tablets (portrait & landscape), and desktop
- **Touch-Optimized**: Large buttons and swipe gestures designed for small hands
- **Progressive Web App (PWA)**: Installable directly to the home screen for a native app-like experience
- **Offline-First**: Works without an internet connection via Service Worker caching
- **Audio Pronunciation**: Tap the speaker icon to hear the correct pronunciation of each letter
- **Progress Tracking**: Visual indicators showing current position (e.g., 1/28) with progress bar and dots
- **Engaging Visuals**: Decorative dots, smooth animations, and end-of-alphabet confetti celebration 🎉
- **Responsive Design**: Adapts seamlessly to all screen sizes (320px-1440px+)
- **Modern Typography**: Beautiful fonts (Plus Jakarta Sans & Inter) with Arabic letter support
- **Zero Dependencies**: Pure HTML, CSS, and JavaScript

## 🚀 Quick Start

1. Download or clone this repository, or host it on any web server
2. Open `index.html` in a web browser
3. (Optional) Click "Install/Add to Home Screen" in your browser's menu to install as a PWA
4. That's it! Start learning immediately

No build process or configuration required.

## 📱 Device Support

### Phone (Portrait)
- Optimized for 320px-480px width
- Full-screen card layout with swipe navigation
- Bottom navigation bar with Previous/All Letters/Next buttons
- Progress bar and dots for visual feedback

### Tablet (iPad)
- **Portrait Mode**: Larger card and buttons, 6-column grid in modal
- **Landscape Mode**: Split-view layout with letter card on left (380px) and grid panel on right
- Inline grid always visible in landscape for quick navigation

### Desktop/Laptop
- Sidebar navigation (280px) with scrollable letter list
- Centered letter card (480px max-width)
- Keyboard navigation support (← → arrow keys)
- Keyboard hint displayed in bottom-right corner

## 🎮 Usage

### Navigation

- **Next/Previous Buttons**: Tap the large arrow buttons at the bottom to move between letters
- **All Letters Grid**: Tap the center button to view all 28 letters in a grid
- **Swipe Gestures** (Mobile): Swipe left for next letter, swipe right for previous letter
- **Keyboard** (Desktop): Use arrow keys (← →) to navigate
- **Sidebar** (Desktop): Click any letter in the sidebar to jump directly to it
- **Wrap-Around**: Automatically loops from last letter back to first (and vice versa)

### For Parents

- The app displays one letter at a time to maintain focus
- Letters appear in traditional Hijaiyah order (Alif to Ya)
- Each letter shows:
  - Arabic character in a circular container
  - Romanized name (e.g., "Alif")
  - Arabic name (e.g., "أسد")
  - Example word with meaning and emoji (e.g., "Lion 🦁")
- Works on tablets and phones—perfect for on-the-go learning
- Completely safe—no ads, no tracking, no internet required after first load

## 📁 Project Structure

```
hijaiyah-for-kids/
├── index.html              # Main application entry point
├── scripts/
│   ├── data.js            # Hijaiyah letters dataset
│   ├── app.js             # Application controller (state management)
│   └── ui.js              # UI manager (DOM manipulation)
├── styles/
│   └── main.css           # All styling, responsive layouts, animations
├── audio/                  # Audio pronunciation files (28 letters)
│   ├── alif.mp3
│   ├── ba.mp3
│   └── ...
├── tests/                  # Test files
│   ├── app.unit.test.js
│   ├── app.property.test.js
│   ├── data.test.js
│   └── offline.test.js
├── plan/                   # Development planning documents
├── service-worker.js       # PWA offline support
├── manifest.json          # PWA manifest
├── package.json           # Development dependencies
└── README.md              # This file
```

## 🎨 Design System

### Colors
- **Background**: `#F0F4FF` (Light lavender)
- **Card**: `#FFFFFF` (White)
- **Primary Purple**: `#8B5CF6`
- **Dark Purple**: `#2D1B69`
- **Progress Track**: `#E9D5FF` (Light purple)
- **Previous Button**: `#FEE2E2` (Light red)
- **Next Button**: `#DCFCE7` (Light green)

### Typography
- **Display Font**: Plus Jakarta Sans (700-800 weight)
- **Body Font**: Inter (400-600 weight)
- **Arabic Font**: Scheherazade New, Arabic Typesetting

### Responsive Breakpoints
- **Extra Small Phones**: ≤360px
- **Small Phones**: ≤390px
- **Phones**: ≤480px
- **Small Tablets**: 481px-767px
- **iPad Portrait**: 768px-1024px (portrait)
- **iPad Landscape**: ≥768px (landscape)
- **Desktop**: ≥1280px

## 🌐 Browser Compatibility

Tested and working on:

- ✅ **Chrome/Edge** (Chromium-based): Full support
- ✅ **Safari** (iOS 12+ and macOS): Full support
- ✅ **Firefox** (Desktop & Android): Full support
- ✅ **Samsung Internet** (Android): Full support

**Minimum Requirements**:
- Modern browser with ES6 support
- CSS Grid and Flexbox support
- Touch events support (for mobile/tablet)
- Service Worker support (for offline functionality)

**Optimized For**:
- iPhone SE to iPhone 14 Pro Max
- iPad Mini to iPad Pro
- Android phones and tablets
- Desktop browsers (1280px-4K)

## 🛠️ Development

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

- **Model** (`data.js`): Hijaiyah letters dataset with audio paths
- **Controller** (`app.js`): State management and navigation logic
- **View** (`ui.js`): DOM manipulation, animations, and user interactions

State flows unidirectionally: User Action → Controller → View Update

### Key Features Implementation

#### Responsive Layout
- Mobile-first approach with progressive enhancement
- CSS media queries for different device sizes and orientations
- Dynamic viewport height (`dvh`) for proper mobile browser support
- Safe area insets for notched devices (iPhone X+)

#### Touch Gestures
- Swipe detection with 60px threshold
- Prevents accidental swipes during vertical scrolling
- Smooth animations with transition locking

#### PWA Support
- Service Worker caches all assets for offline use
- Manifest file for home screen installation
- Theme color and icons for native app feel

#### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- High contrast colors (WCAG AA compliant)
- Large touch targets (minimum 44x44px)
- Screen reader friendly

## 🚀 Performance

- **Initial Load**: < 2 seconds (typically < 500ms)
- **Navigation Response**: < 300ms per letter change
- **Animation Duration**: 300ms smooth transitions
- **Memory**: Minimal—single letter card reused, no dynamic DOM creation
- **Bundle Size**: ~50KB total (HTML + CSS + JS)
- **Audio Files**: ~2MB total (28 × ~70KB each)

## 📝 Recent Updates

### Mobile & Tablet Fixes
- ✅ Fixed viewport meta tags for proper mobile scaling
- ✅ Added safe area support for notched devices
- ✅ Implemented dynamic viewport height (dvh) for mobile browsers
- ✅ Improved touch interactions with proper touch-action properties
- ✅ Fixed scrolling behavior on iOS devices
- ✅ Added responsive breakpoints for all device sizes
- ✅ Fixed iPad landscape split-view layout
- ✅ Disabled dark mode for consistent design

### Desktop Improvements
- ✅ Fixed background color to match design (#F0F4FF)
- ✅ Enhanced sidebar with better hover effects and scrollbar
- ✅ Improved keyboard navigation hints
- ✅ Better spacing and typography for desktop viewing
- ✅ Fixed layout centering and proportions

### Design Alignment
- ✅ Matched all colors, spacing, and typography to design specs
- ✅ Fixed progress bar color (#E9D5FF)
- ✅ Corrected button sizes (52px for navigation)
- ✅ Updated padding and gaps throughout
- ✅ Ensured pixel-perfect implementation

### Layout Fixes
- ✅ Fixed navigation container to be full width
- ✅ Centered progress bar properly
- ✅ Removed unwanted margins and padding
- ✅ Fixed card positioning and overflow issues
- ✅ Improved layout for short-height devices

## 📄 License

MIT License - Feel free to use, modify, and distribute this application.

## 🤝 Contributing

This is an educational project designed for simplicity. If you'd like to contribute:

1. Keep it simple—no external dependencies
2. Maintain offline functionality
3. Ensure touch targets remain at least 44x44px
4. Test on actual devices with young children
5. Run all tests before submitting changes
6. Follow the existing code style and architecture

## 💝 Credits

Built with ❤️ for young learners exploring the Arabic alphabet.

Special thanks to all parents and educators who provided feedback to make this app better for children.

---

**Made with 🌙 for curious little minds**
