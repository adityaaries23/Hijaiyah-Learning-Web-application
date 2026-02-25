/**
 * sync-check.js
 * Verifies that browser files (scripts/*.js) and their test counterparts
 * (scripts/*.test.js) are in sync — i.e., the test file is the same as the
 * browser file plus an `export { ... }` statement at the end.
 *
 * Usage:
 *   node sync-check.js
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const __dirname = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const PAIRS = [
  { browser: 'scripts/data.js', test: 'scripts/data.test.js' },
  { browser: 'scripts/app.js',  test: 'scripts/app.test.js'  },
  { browser: 'scripts/ui.js',   test: 'scripts/ui.test.js'   },
];

/**
 * Strip trailing export statements and blank lines from a file's content
 * so we can compare the shared logic portion only.
 */
function stripExports(content) {
  return content
    .split('\n')
    .filter(line => !line.trimStart().startsWith('export '))
    .join('\n')
    .trimEnd();
}

let hasErrors = false;

for (const { browser, test } of PAIRS) {
  const browserPath = resolve(__dirname, browser);
  const testPath    = resolve(__dirname, test);

  let browserContent, testContent;

  try {
    browserContent = readFileSync(browserPath, 'utf8');
  } catch {
    console.error(`❌  Cannot read browser file: ${browser}`);
    hasErrors = true;
    continue;
  }

  try {
    testContent = readFileSync(testPath, 'utf8');
  } catch {
    console.error(`❌  Cannot read test file: ${test}`);
    hasErrors = true;
    continue;
  }

  const browserNorm = stripExports(browserContent);
  const testNorm    = stripExports(testContent);

  if (browserNorm === testNorm) {
    console.log(`✅  In sync:  ${browser}  ↔  ${test}`);
  } else {
    console.error(`❌  OUT OF SYNC: ${browser}  ↔  ${test}`);
    console.error(`    The browser file and its test counterpart have diverged.`);
    console.error(`    Make sure to copy any logic changes from ${browser} → ${test} (or vice versa).`);
    hasErrors = true;
  }
}

console.log('');

if (hasErrors) {
  console.error('⚠️   Sync check FAILED — fix the files listed above before running tests.');
  process.exit(1);
} else {
  console.log('✔   All browser/test file pairs are in sync. Safe to run tests.');
}
