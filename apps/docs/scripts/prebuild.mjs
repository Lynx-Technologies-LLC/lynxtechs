#!/usr/bin/env node
// Orchestrates the cross-repo content sync that runs before `docusaurus start`
// and `docusaurus build`. Each step is intentionally best-effort: when the
// network or a GitHub token is unavailable (e.g. local dev, offline CI), the
// step logs a warning and leaves the committed placeholder content in place so
// the site still builds. Set SYNC_STRICT=1 to fail the build if a step errors.

import {cpSync, readFileSync, rmSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {sanitizeApiDocs} from './sanitize-api-docs.mjs';
import {syncApiReference} from './sync-api.mjs';
import {syncReleaseNotes} from './sync-release-notes.mjs';
import {syncExamples} from './sync-examples.mjs';

const strict = process.env.SYNC_STRICT === '1';

// Populate docs/lxmaster/ from the latest versioned docs so Docusaurus always
// has a valid current-version source, without a git-committed symlink (which
// breaks on Vercel and Windows). This runs before every start/build.
const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const versionsFile = resolve(appRoot, 'lxmaster_versions.json');
const versions = JSON.parse(readFileSync(versionsFile, 'utf8'));
const latestVersion = versions[0];
const versionedSrc = resolve(appRoot, `lxmaster_versioned_docs/version-${latestVersion}`);
const currentDst  = resolve(appRoot, 'docs/lxmaster');
console.log(`[prebuild] Seeding docs/lxmaster from version-${latestVersion}`);
rmSync(currentDst, {recursive: true, force: true});
cpSync(versionedSrc, currentDst, {recursive: true});

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

const sanitized = sanitizeApiDocs(appRoot);
console.log(
  `[prebuild] Sanitized API docs: ${sanitized.changedFiles} file(s) updated.`,
);
