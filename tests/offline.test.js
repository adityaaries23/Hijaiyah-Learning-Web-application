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
 * Test 1: Verify local JavaScript files in HTML
 * Validates: Requirements 7.1
 */

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

