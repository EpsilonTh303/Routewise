import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_PERSONA, parsePersona, personaSchema, serializePersona } from '../src/lib/persona.ts';

test('persona parser safely defaults malformed and legacy storage values', () => {
  assert.deepEqual(parsePersona('{bad json'), EMPTY_PERSONA);
  assert.deepEqual(parsePersona(null), EMPTY_PERSONA);
  assert.deepEqual(parsePersona({ displayName: 8, headline: null, location: {}, bio: false, photo: 'https://example.com/photo.jpg' }), EMPTY_PERSONA);
});

test('persona parsing bounds strings and only preserves small raster data URLs', () => {
  const parsed = parsePersona({
    displayName: ` ${'A'.repeat(100)} `,
    headline: 'Engineer', location: 'Baku', bio: 'About me',
    photo: `data:image/webp;base64,${'A'.repeat(399_970)}`,
  });
  assert.equal(parsed.displayName.length, 80);
  assert.equal(parsed.photo?.startsWith('data:image/webp;base64,'), true);
  assert.equal(parsePersona({ photo: `data:image/svg+xml;base64,${'A'.repeat(50)}` }).photo, null);
  assert.equal(parsePersona({ photo: `data:image/jpeg;base64,${'A'.repeat(400_001)}` }).photo, null);
});

test('persona schema enforces field bounds and safe photo type', () => {
  assert.equal(personaSchema.safeParse({ ...EMPTY_PERSONA, displayName: 'B'.repeat(81) }).success, false);
  assert.equal(personaSchema.safeParse({ ...EMPTY_PERSONA, bio: 'b'.repeat(601) }).success, false);
  assert.equal(personaSchema.safeParse({ ...EMPTY_PERSONA, photo: 'data:image/svg+xml;base64,AAAA' }).success, false);
  assert.equal(personaSchema.safeParse({ ...EMPTY_PERSONA, photo: 'data:image/png;base64,AAAA' }).success, true);
});

test('persona serializes only schema-valid browser identity data', () => {
  const persona = { displayName: 'Ada', headline: 'Engineer', location: 'Baku', bio: 'Hello', photo: null };
  assert.deepEqual(JSON.parse(serializePersona(persona)), persona);
  assert.throws(() => serializePersona({ ...persona, displayName: 'x'.repeat(81) }));
});
