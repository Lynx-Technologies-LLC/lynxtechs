import {readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const API_DOC_ROOTS = [
  'docs/lxmaster/api',
  'lxmaster_versioned_docs',
];

function walkMarkdownFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walkMarkdownFiles(fullPath, files);
      continue;
    }

    if (entry.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function collectApiMarkdownFiles(appRoot) {
  const files = [];

  for (const relativeRoot of API_DOC_ROOTS) {
    const absoluteRoot = join(appRoot, relativeRoot);

    try {
      statSync(absoluteRoot);
    } catch {
      continue;
    }

    for (const filePath of walkMarkdownFiles(absoluteRoot)) {
      if (filePath.includes(`${join('api', 'classes')}`) || filePath.includes(`${join('api', 'namespaces')}`)) {
        files.push(filePath);
      }
    }
  }

  return files;
}

export function sanitizeApiMarkdown(content) {
  let next = content;

  // Doxygen/doxybook2 sometimes emits links with no destination.
  next = next.replace(/\[([^\]]+)\]\(\)/g, '$1');

  // Namespace pages are not published in the docs bundle.
  next = next.replace(
    /\[claim_score\]\(\/lxmaster\/api\/namespaces\/namespaceecdev_1_1claim__score\)/g,
    'claim_score',
  );

  return next;
}

export function sanitizeApiDocs(appRoot) {
  const files = collectApiMarkdownFiles(appRoot);
  let changedFiles = 0;

  for (const filePath of files) {
    const original = readFileSync(filePath, 'utf8');
    const sanitized = sanitizeApiMarkdown(original);

    if (sanitized !== original) {
      writeFileSync(filePath, sanitized);
      changedFiles += 1;
    }
  }

  return {scanned: files.length, changedFiles};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const result = sanitizeApiDocs(appRoot);
  console.log(
    `[sanitize-api-docs] Scanned ${result.scanned} API markdown file(s); updated ${result.changedFiles}.`,
  );
}
