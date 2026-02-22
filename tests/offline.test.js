/**
 * Offline Functionality Tests
 * Validates: Requirements 7.1, 7.2
 * 
 * These tests verify that the application has no external dependencies
 * and can function completely offline.
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Test 1: Verify no external CDN links in HTML
 * Validates: Requirements 7.1
 */
test('index.html contains no external CDN links', () => {
  const htmlPath = join(__dirname, '..', 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  
  // Check for common CDN patterns
  const cdnPatterns = [
    /https?:\/\/cdn\./i,
    /https?:\/\/.*\.cloudflare\.com/i,
    /https?:\/\/.*\.jsdelivr\.net/i,
    /https?:\/\/.*\.unpkg\.com/i,
    /https?:\/\/fonts\.googleapis\.com/i,
    /https?:\/\/fonts\.gstatic\.com/i,
    /https?:\/\/ajax\.googleapis\.com/i,
    /https?:\/\/code\.jquery\.com/i,
    /https?:\/\/maxcdn\.bootstrapcdn\.com/i,
    /https?:\/\/stackpath\.bootstrapcdn\.com/i,
    /\/\/cdn\./i,
    /\/\/fonts\./i,
    /\/\/ajax\./i,
    /\/\/code\./i
  ];
  
  cdnPatterns.forEach((pattern, index) => {
    const match = htmlContent.match(pattern);
    assert.strictEqual(
      match,
      null,
      `HTML should not contain CDN pattern ${index + 1}: ${pattern}`
    );
  });
});

test('index.html uses only local resource paths', () => {
  const htmlPath = join(__dirname, '..', 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  
  // Extract all href and src attributes
  const hrefMatches = htmlContent.match(/href=["']([^"']+)["']/g) || [];
  const srcMatches = htmlContent.match(/src=["']([^"']+)["']/g) || [];
  
  const allResources = [...hrefMatches, ...srcMatches];
  
  allResources.forEach(resource => {
    // Extract the actual path
    const pathMatch = resource.match(/=["']([^"']+)["']/);
    if (pathMatch) {
      const path = pathMatch[1];
      
      // Verify it's a local path (doesn't start with http://, https://, or //)
      assert.ok(
        !path.startsWith('http://') && 
        !path.startsWith('https://') && 
        !path.startsWith('//'),
        `Resource should be local, found: ${path}`
      );
    }
  });
});

test('index.html links to local CSS file', () => {
  const htmlPath = join(__dirname, '..', 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  
  // Check for local CSS link
  const cssLinkMatch = htmlContent.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/i);
  
  assert.ok(cssLinkMatch, 'HTML should contain a stylesheet link');
  
  // Verify it's a local path
  const hrefMatch = cssLinkMatch[0].match(/href=["']([^"']+)["']/);
  assert.ok(hrefMatch, 'Stylesheet link should have href attribute');
  
  const cssPath = hrefMatch[1];
  assert.ok(
    cssPath.startsWith('styles/') || cssPath.startsWith('./styles/'),
    `CSS path should be local, found: ${cssPath}`
  );
});

test('index.html links to local JavaScript files', () => {
  const htmlPath = join(__dirname, '..', 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  
  // Check for local script tags
  const scriptMatches = htmlContent.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
  
  assert.ok(
    scriptMatches.length >= 3,
    'HTML should contain at least 3 script tags (data.js, app.js, ui.js)'
  );
  
  scriptMatches.forEach(scriptTag => {
    const srcMatch = scriptTag.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      const scriptPath = srcMatch[1];
      
      // Verify it's a local path
      assert.ok(
        scriptPath.startsWith('scripts/') || scriptPath.startsWith('./scripts/'),
        `Script path should be local, found: ${scriptPath}`
      );
    }
  });
});

/**
 * Test 2: Verify no network requests in JavaScript
 * Validates: Requirements 7.1
 */
test('app.js contains no network request code', () => {
  const appJsPath = join(__dirname, '..', 'scripts', 'app.js');
  const appJsContent = readFileSync(appJsPath, 'utf-8');
  
  // Check for common network request patterns
  const networkPatterns = [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\baxios\./,
    /\b\.get\s*\(/,
    /\b\.post\s*\(/,
    /\bajax\s*\(/,
    /\b\$\.ajax\b/,
    /\b\$\.get\b/,
    /\b\$\.post\b/
  ];
  
  networkPatterns.forEach((pattern, index) => {
    const match = appJsContent.match(pattern);
    assert.strictEqual(
      match,
      null,
      `app.js should not contain network request pattern ${index + 1}: ${pattern}`
    );
  });
});

test('ui.js contains no network request code', () => {
  const uiJsPath = join(__dirname, '..', 'scripts', 'ui.js');
  const uiJsContent = readFileSync(uiJsPath, 'utf-8');
  
  // Check for common network request patterns
  const networkPatterns = [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\baxios\./,
    /\b\.get\s*\(/,
    /\b\.post\s*\(/,
    /\bajax\s*\(/
  ];
  
  networkPatterns.forEach((pattern, index) => {
    const match = uiJsContent.match(pattern);
    assert.strictEqual(
      match,
      null,
      `ui.js should not contain network request pattern ${index + 1}: ${pattern}`
    );
  });
});

test('data.js contains no network request code', () => {
  const dataJsPath = join(__dirname, '..', 'scripts', 'data.js');
  const dataJsContent = readFileSync(dataJsPath, 'utf-8');
  
  // Check for common network request patterns
  const networkPatterns = [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\baxios\./,
    /\b\.get\s*\(/,
    /\b\.post\s*\(/,
    /\bajax\s*\(/
  ];
  
  networkPatterns.forEach((pattern, index) => {
    const match = dataJsContent.match(pattern);
    assert.strictEqual(
      match,
      null,
      `data.js should not contain network request pattern ${index + 1}: ${pattern}`
    );
  });
});

test('JavaScript files contain no external API endpoints', () => {
  const jsFiles = [
    join(__dirname, '..', 'scripts', 'app.js'),
    join(__dirname, '..', 'scripts', 'ui.js'),
    join(__dirname, '..', 'scripts', 'data.js')
  ];
  
  jsFiles.forEach(filePath => {
    const content = readFileSync(filePath, 'utf-8');
    
    // Check for URL patterns
    const urlPatterns = [
      /https?:\/\/[^\s'"]+/,
      /api\.[^\s'"]+/i,
      /\/api\//
    ];
    
    urlPatterns.forEach((pattern, index) => {
      const match = content.match(pattern);
      assert.strictEqual(
        match,
        null,
        `${filePath} should not contain URL pattern ${index + 1}: ${pattern}`
      );
    });
  });
});

/**
 * Test 3: Verify no external resources in CSS
 * Validates: Requirements 7.1
 */
test('CSS contains no external font imports', () => {
  const cssPath = join(__dirname, '..', 'styles', 'main.css');
  const cssContent = readFileSync(cssPath, 'utf-8');
  
  // Check for @import statements
  const importMatch = cssContent.match(/@import\s+url\s*\(/i);
  assert.strictEqual(
    importMatch,
    null,
    'CSS should not contain @import statements'
  );
  
  // Check for external font URLs
  const fontUrlMatch = cssContent.match(/url\s*\(\s*["']?https?:\/\//i);
  assert.strictEqual(
    fontUrlMatch,
    null,
    'CSS should not contain external font URLs'
  );
});

test('CSS uses only system fonts', () => {
  const cssPath = join(__dirname, '..', 'styles', 'main.css');
  const cssContent = readFileSync(cssPath, 'utf-8');
  
  // Extract all font-family declarations
  const fontFamilyMatches = cssContent.match(/font-family:\s*[^;]+;/gi) || [];
  
  fontFamilyMatches.forEach(declaration => {
    // Verify no external font URLs in the declaration
    const hasUrl = declaration.match(/url\s*\(/i);
    assert.strictEqual(
      hasUrl,
      null,
      `Font family declaration should not contain url(), found: ${declaration}`
    );
    
    // Verify it uses system fonts (common font names)
    const hasSystemFont = 
      /Segoe UI|Tahoma|Arial|sans-serif|Traditional Arabic|Arabic Typesetting/i.test(declaration);
    
    assert.ok(
      hasSystemFont,
      `Font family should use system fonts, found: ${declaration}`
    );
  });
});

test('CSS contains no external resource URLs', () => {
  const cssPath = join(__dirname, '..', 'styles', 'main.css');
  const cssContent = readFileSync(cssPath, 'utf-8');
  
  // Check for any external URLs in url() functions
  const externalUrlMatch = cssContent.match(/url\s*\(\s*["']?(https?:\/\/|\/\/)/i);
  assert.strictEqual(
    externalUrlMatch,
    null,
    'CSS should not contain external resource URLs'
  );
});

/**
 * Test 4: Verify all data is embedded locally
 * Validates: Requirements 7.1
 */
test('All Hijaiyah letters are defined locally in data.js', () => {
  const dataJsPath = join(__dirname, '..', 'scripts', 'data.js');
  const dataJsContent = readFileSync(dataJsPath, 'utf-8');
  
  // Verify HIJAIYAH_LETTERS array is defined
  const arrayDefinitionMatch = dataJsContent.match(/const\s+HIJAIYAH_LETTERS\s*=\s*\[/);
  assert.ok(
    arrayDefinitionMatch,
    'data.js should define HIJAIYAH_LETTERS array'
  );
  
  // Verify it contains letter objects with arabic property
  const arabicLetterMatches = dataJsContent.match(/arabic:\s*['"][ا-ي]['"],?/g) || [];
  assert.ok(
    arabicLetterMatches.length >= 28,
    `data.js should contain at least 28 Arabic letters, found ${arabicLetterMatches.length}`
  );
});

test('No dynamic data loading from external sources', () => {
  const jsFiles = [
    join(__dirname, '..', 'scripts', 'app.js'),
    join(__dirname, '..', 'scripts', 'ui.js'),
    join(__dirname, '..', 'scripts', 'data.js')
  ];
  
  jsFiles.forEach(filePath => {
    const content = readFileSync(filePath, 'utf-8');
    
    // Check for dynamic loading patterns
    const dynamicLoadPatterns = [
      /import\s*\(\s*["']https?:\/\//,
      /require\s*\(\s*["']https?:\/\//,
      /loadScript\s*\(/,
      /createElement\s*\(\s*["']script["']\)/
    ];
    
    dynamicLoadPatterns.forEach((pattern, index) => {
      const match = content.match(pattern);
      assert.strictEqual(
        match,
        null,
        `${filePath} should not contain dynamic loading pattern ${index + 1}: ${pattern}`
      );
    });
  });
});

/**
 * Test 5: Verify application structure supports offline use
 * Validates: Requirements 7.2
 */
test('All required local files exist', () => {
  const requiredFiles = [
    join(__dirname, '..', 'index.html'),
    join(__dirname, '..', 'styles', 'main.css'),
    join(__dirname, '..', 'scripts', 'data.js'),
    join(__dirname, '..', 'scripts', 'app.js'),
    join(__dirname, '..', 'scripts', 'ui.js')
  ];
  
  requiredFiles.forEach(filePath => {
    let fileExists = false;
    try {
      readFileSync(filePath, 'utf-8');
      fileExists = true;
    } catch (error) {
      fileExists = false;
    }
    
    assert.ok(
      fileExists,
      `Required file should exist: ${filePath}`
    );
  });
});

test('HTML file is self-contained with inline initialization', () => {
  const htmlPath = join(__dirname, '..', 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  
  // Verify inline initialization script exists
  const inlineScriptMatch = htmlContent.match(/<script>\s*\/\/\s*Application initialization/);
  assert.ok(
    inlineScriptMatch,
    'HTML should contain inline initialization script'
  );
  
  // Verify DOMContentLoaded event listener
  const domContentLoadedMatch = htmlContent.match(/DOMContentLoaded/);
  assert.ok(
    domContentLoadedMatch,
    'HTML should use DOMContentLoaded for initialization'
  );
});

test('Application can initialize without network access', () => {
  // This test verifies that all initialization code is synchronous
  // and doesn't depend on network requests
  
  const htmlPath = join(__dirname, '..', 'index.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');
  
  // Check that initialization doesn't use async network operations
  const initScriptMatch = htmlContent.match(/<script>[\s\S]*?Application initialization[\s\S]*?<\/script>/);
  
  if (initScriptMatch) {
    const initScript = initScriptMatch[0];
    
    // Verify no async network operations in initialization
    const hasAsyncNetwork = /await\s+fetch|\.then\s*\(\s*response|XMLHttpRequest/.test(initScript);
    assert.strictEqual(
      hasAsyncNetwork,
      false,
      'Initialization script should not contain async network operations'
    );
  }
});

/**
 * Test 6: Verify no external dependencies in package.json
 * Validates: Requirements 7.1
 */
test('Application has no runtime dependencies', () => {
  const packageJsonPath = join(__dirname, '..', 'package.json');
  let packageJson;
  
  try {
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(packageJsonContent);
  } catch (error) {
    // If package.json doesn't exist or is invalid, that's acceptable
    // as the app doesn't require npm packages
    return;
  }
  
  // If package.json exists, verify no runtime dependencies
  const dependencies = packageJson.dependencies || {};
  const dependencyKeys = Object.keys(dependencies);
  
  // Filter out any dev-only dependencies that might be listed
  const runtimeDeps = dependencyKeys.filter(dep => {
    // Allow test frameworks and dev tools
    return !dep.includes('test') && 
           !dep.includes('jest') && 
           !dep.includes('mocha') &&
           !dep.includes('jsdom') &&
           !dep.includes('fast-check');
  });
  
  assert.strictEqual(
    runtimeDeps.length,
    0,
    `Application should have no runtime dependencies, found: ${runtimeDeps.join(', ')}`
  );
});

/**
 * Test 7: Summary test - Complete offline functionality
 * Validates: Requirements 7.1, 7.2
 */
test('Application is completely self-contained and offline-capable', () => {
  // This is a comprehensive test that verifies all aspects of offline functionality
  
  const checks = {
    htmlExists: false,
    cssExists: false,
    jsFilesExist: false,
    noExternalLinks: false,
    noNetworkRequests: false,
    dataEmbedded: false
  };
  
  // Check 1: All files exist
  try {
    readFileSync(join(__dirname, '..', 'index.html'), 'utf-8');
    checks.htmlExists = true;
  } catch (e) {}
  
  try {
    readFileSync(join(__dirname, '..', 'styles', 'main.css'), 'utf-8');
    checks.cssExists = true;
  } catch (e) {}
  
  try {
    readFileSync(join(__dirname, '..', 'scripts', 'app.js'), 'utf-8');
    readFileSync(join(__dirname, '..', 'scripts', 'ui.js'), 'utf-8');
    readFileSync(join(__dirname, '..', 'scripts', 'data.js'), 'utf-8');
    checks.jsFilesExist = true;
  } catch (e) {}
  
  // Check 2: No external links in HTML
  const htmlContent = readFileSync(join(__dirname, '..', 'index.html'), 'utf-8');
  checks.noExternalLinks = !/https?:\/\//.test(htmlContent);
  
  // Check 3: No network requests in JS
  const appJsContent = readFileSync(join(__dirname, '..', 'scripts', 'app.js'), 'utf-8');
  const uiJsContent = readFileSync(join(__dirname, '..', 'scripts', 'ui.js'), 'utf-8');
  checks.noNetworkRequests = !/fetch\(|XMLHttpRequest/.test(appJsContent + uiJsContent);
  
  // Check 4: Data is embedded
  const dataJsContent = readFileSync(join(__dirname, '..', 'scripts', 'data.js'), 'utf-8');
  checks.dataEmbedded = /HIJAIYAH_LETTERS\s*=\s*\[/.test(dataJsContent);
  
  // Verify all checks passed
  Object.keys(checks).forEach(checkName => {
    assert.ok(
      checks[checkName],
      `Offline capability check failed: ${checkName}`
    );
  });
  
  // Final assertion
  const allChecksPassed = Object.values(checks).every(check => check === true);
  assert.ok(
    allChecksPassed,
    'Application should be completely self-contained and offline-capable'
  );
});
