import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {db} from '../src/lib/db';
import {CatalogRepository} from '../src/lib/server/catalog';
import {ENGINE_VERSION} from '../src/lib/server/service';
import {publicCatalogSchema} from '../src/lib/public-catalog';

if(!process.env.ROUTEWISE_DATABASE_URL||!process.argv[2]) throw new Error('An explicit isolated build database and output path are required');
try {
  const {programs,version}=await new CatalogRepository(db).snapshot();
  const snapshot=publicCatalogSchema.parse({schemaVersion:1,engineVersion:ENGINE_VERSION,generatedAt:new Date().toISOString(),catalogVersion:version,programs});
  writeFileSync(resolve(process.argv[2]),JSON.stringify(snapshot));
  console.log(JSON.stringify({publicPrograms:snapshot.programs.length,engineVersion:snapshot.engineVersion}));
} finally {await db.$disconnect();}
