import test from 'node:test';
import assert from 'node:assert/strict';
import {publicCatalogSchema} from '../src/lib/public-catalog.ts';
import {studyPilotPrograms} from '../src/lib/data/study-pilot.ts';
test('public export validates catalog data and rejects private payloads',()=>{
 const publicData={schemaVersion:1,engineVersion:'3.5.0',generatedAt:'2026-10-25T20:00:00Z',catalogVersion:'a'.repeat(64),programs:studyPilotPrograms};
 assert.ok(publicCatalogSchema.safeParse(publicData).success);
 assert.equal(publicCatalogSchema.safeParse({...publicData,profiles:[]}).success,false);
 assert.equal(publicCatalogSchema.safeParse({...publicData,programs:[]}).success,false);
});
