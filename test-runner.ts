import { run } from 'node:test';
import { spec } from 'node:test/reporters';

run({
  files: ['lib/analysis/__tests__/engine.test.ts'],
}).compose(new spec()).pipe(process.stdout);
