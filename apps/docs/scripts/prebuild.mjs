#!/usr/bin/env node
// Orchestrates the cross-repo content sync that runs before `docusaurus start`
// and `docusaurus build`. Each step is intentionally best-effort: when the
// network or a GitHub token is unavailable (e.g. local dev, offline CI), the
// step logs a warning and leaves the committed placeholder content in place so
// the site still builds. Set SYNC_STRICT=1 to fail the build if a step errors.

import {syncApiReference} from './sync-api.mjs';
import {syncReleaseNotes} from './sync-release-notes.mjs';
import {syncExamples} from './sync-examples.mjs';

const strict = process.env.SYNC_STRICT === '1';

const steps = [
  {name: 'LXMASTER API reference', run: syncApiReference},
  {name: 'LXMASTER release notes', run: syncReleaseNotes},
  {name: 'LXMASTER example projects', run: syncExamples},
];

let failed = false;

for (const step of steps) {
  try {
    console.log(`[prebuild] Syncing ${step.name}...`);
    await step.run();
  } catch (err) {
    failed = true;
    console.warn(
      `[prebuild] WARNING: ${step.name} sync failed: ${err?.message ?? err}`,
    );
    console.warn('[prebuild] Falling back to committed placeholder content.');
  }
}

if (failed && strict) {
  console.error('[prebuild] SYNC_STRICT=1 and at least one step failed.');
  process.exit(1);
}

console.log('[prebuild] Done.');
