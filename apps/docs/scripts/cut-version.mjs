#!/usr/bin/env node
// Cut a new Docusaurus docs version keyed to an LXMASTER release.
//
// It first syncs the generated content (API reference, release notes, examples)
// for the target version into the current docs, then snapshots the current docs
// into versioned_docs/version-<version>/ via `docusaurus docs:version`. The
// snapshot freezes that version's API reference so users can browse docs that
// match their installed .deb.
//
// Usage:
//   node scripts/cut-version.mjs 1.0.10
//   LXMASTER_DOCS_VERSION=1.0.10 node scripts/cut-version.mjs

import {execFileSync} from 'node:child_process';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(scriptDir, '..');

const version = process.argv[2] ?? process.env.LXMASTER_DOCS_VERSION;
if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
  console.error('Usage: cut-version.mjs <semver>   (e.g. 1.0.10)');
  process.exit(1);
}

const env = {...process.env, LXMASTER_DOCS_VERSION: version, SYNC_STRICT: '1'};

console.log(`==> Syncing generated content for LXMASTER ${version}`);
execFileSync('node', ['scripts/prebuild.mjs'], {cwd: appDir, stdio: 'inherit', env});

console.log(`==> Cutting Docusaurus docs version ${version}`);
execFileSync('npx', ['docusaurus', 'docs:version:lxmaster', version], {
  cwd: appDir,
  stdio: 'inherit',
  env,
});

console.log(`==> Done. Review lxmaster_versioned_docs/version-${version}/ and commit.`);
