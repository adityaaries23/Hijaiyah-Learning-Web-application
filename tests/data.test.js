/**
 * Unit Tests for Hijaiyah Letters Data Integrity
 * Validates: Requirements 6.1, 6.2
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { HIJAIYAH_LETTERS } from '../scripts/data.test.js';


test('HIJAIYAH_LETTERS array contains exactly 28 elements', () => {
  assert.strictEqual(
    HIJAIYAH_LETTERS.length,
    28,
    'Array should contain exactly 28 letters'
  );
});

test('Each letter has required fields (id, arabic, name)', () => {
  HIJAIYAH_LETTERS.forEach((letter, index) => {
    assert.ok(
      letter.hasOwnProperty('id'),
      `Letter at index ${index} should have 'id' field`
    );
    assert.ok(
      letter.hasOwnProperty('arabic'),
      `Letter at index ${index} should have 'arabic' field`
    );
    assert.ok(
      letter.hasOwnProperty('name'),
      `Letter at index ${index} should have 'name' field`
    );
    
    // Verify field types
    assert.strictEqual(
      typeof letter.id,
      'number',
      `Letter at index ${index} should have numeric id`
    );
    assert.strictEqual(
      typeof letter.arabic,
      'string',
      `Letter at index ${index} should have string arabic character`
    );
    assert.strictEqual(
      typeof letter.name,
      'string',
      `Letter at index ${index} should have string name`
    );
    
    // Verify fields are not empty
    assert.ok(
      letter.arabic.length > 0,
      `Letter at index ${index} should have non-empty arabic character`
    );
    assert.ok(
      letter.name.length > 0,
      `Letter at index ${index} should have non-empty name`
    );
  });
});

test('Letters are in correct traditional order (ids 1-28 sequential)', () => {
  HIJAIYAH_LETTERS.forEach((letter, index) => {
    const expectedId = index + 1;
    assert.strictEqual(
      letter.id,
      expectedId,
      `Letter at index ${index} should have id ${expectedId}, but has id ${letter.id}`
    );
  });
});

test('All letter ids are unique', () => {
  const ids = HIJAIYAH_LETTERS.map(letter => letter.id);
  const uniqueIds = new Set(ids);
  assert.strictEqual(
    uniqueIds.size,
    HIJAIYAH_LETTERS.length,
    'All letter ids should be unique'
  );
});

test('First letter is Alif', () => {
  assert.strictEqual(
    HIJAIYAH_LETTERS[0].arabic,
    'ا',
    'First letter should be Alif (ا)'
  );
  assert.strictEqual(
    HIJAIYAH_LETTERS[0].name,
    'Alif',
    'First letter name should be Alif'
  );
  assert.strictEqual(
    HIJAIYAH_LETTERS[0].id,
    1,
    'First letter id should be 1'
  );
});

test('Last letter is Ya', () => {
  assert.strictEqual(
    HIJAIYAH_LETTERS[27].arabic,
    'ي',
    'Last letter should be Ya (ي)'
  );
  assert.strictEqual(
    HIJAIYAH_LETTERS[27].name,
    'Ya',
    'Last letter name should be Ya'
  );
  assert.strictEqual(
    HIJAIYAH_LETTERS[27].id,
    28,
    'Last letter id should be 28'
  );
});
