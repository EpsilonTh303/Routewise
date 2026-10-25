import { registerHooks } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Source imports use bundler-style extensionless paths. Resolve them for native Node tests.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) specifier = new URL('../src/' + specifier.slice(2), import.meta.url).href;
  if (specifier.startsWith('file:')) {
    for (const suffix of ['.ts', '.tsx', '/index.ts']) {
      if (existsSync(new URL(specifier + suffix))) return nextResolve(specifier + suffix, context);
    }
  }
  if (specifier.startsWith('.')) {
    for (const suffix of ['.ts', '.tsx', '/index.ts']) {
      const url = new URL(specifier + suffix, context.parentURL);
      if (existsSync(url)) return nextResolve(url.href, context);
    }
  }
  return nextResolve(specifier, context);
}, load(url, context, nextLoad) {
  if (url.endsWith('.tsx')) {
    const ts = require('typescript');
    const source = ts.transpileModule(readFileSync(new URL(url), 'utf8'), {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    return { format: 'module', source, shortCircuit: true };
  }
  return nextLoad(url, context);
} });
