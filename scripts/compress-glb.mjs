#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression } from "@gltf-transform/extensions";
import {
  dedup,
  draco,
  flatten,
  instance,
  join,
  palette,
  prune,
  resample,
  simplify,
  sparse,
  textureCompress,
  weld,
} from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { MeshoptSimplifier } from "meshoptimizer";

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function printHelp() {
  console.log(`Usage: compress-glb [options] <file.glb> [...]

Compress GLB files with Draco mesh compression.
Skips files that are already fully Draco-compressed unless --force is used.

Options:
  --force, -f     Recompress even if Draco is already present
  --dry-run, -n   Report actions without writing files
  --help, -h      Show this help message

Examples:
  npm run compress-glb -- apps/web/public/products/lxfiber/lxfiber-3d.glb
  npm run compress-glb -- --dry-run apps/web/public/products/**/*.glb
`);
}

function parseArgs(argv) {
  const options = { force: false, dryRun: false, help: false, files: [] };

  for (const arg of argv) {
    if (arg === "--force" || arg === "-f") {
      options.force = true;
    } else if (arg === "--dry-run" || arg === "-n") {
      options.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      options.files.push(path.resolve(arg));
    }
  }

  return options;
}

function isDracoCompressedFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  return buffer.includes(Buffer.from("KHR_draco_mesh_compression"));
}

async function createIO() {
  const io = new NodeIO().registerExtensions([KHRDracoMeshCompression]);

  io.registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
    "draco3d.encoder": await draco3d.createEncoderModule(),
  });

  return io;
}

async function compressDocument(document) {
  await document.transform(
    dedup(),
    instance(),
    palette(),
    flatten(),
    join(),
    weld(),
    simplify({ simplifier: MeshoptSimplifier }),
    resample(),
    prune(),
    sparse(),
    textureCompress(),
    draco(),
  );
}

async function processFile(io, filePath, options) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  if (!filePath.toLowerCase().endsWith(".glb")) {
    throw new Error(`Not a GLB file: ${filePath}`);
  }

  const inputSize = fs.statSync(filePath).size;

  if (!options.force && isDracoCompressedFile(filePath)) {
    console.log(
      `skip ${filePath} (already Draco compressed, ${formatBytes(inputSize)})`,
    );
    return;
  }

  if (options.dryRun) {
    console.log(`would compress ${filePath} (${formatBytes(inputSize)})`);
    return;
  }

  const document = await io.read(filePath);
  const meshCount = document.getRoot().listMeshes().length;

  if (meshCount === 0) {
    console.log(`skip ${filePath} (no meshes)`);
    return;
  }

  await compressDocument(document);

  const tmpPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.tmp`,
  );

  await io.write(tmpPath, document);

  const outputSize = fs.statSync(tmpPath).size;
  fs.renameSync(tmpPath, filePath);

  const ratio =
    inputSize > 0
      ? ((1 - outputSize / inputSize) * 100).toFixed(1)
      : "0.0";

  console.log(
    `compressed ${filePath}: ${formatBytes(inputSize)} -> ${formatBytes(outputSize)} (-${ratio}%)`,
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (options.files.length === 0) {
    printHelp();
    process.exit(1);
  }

  const io = await createIO();
  let hadError = false;

  for (const file of options.files) {
    try {
      await processFile(io, file, options);
    } catch (error) {
      hadError = true;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`error ${file}: ${message}`);
    }
  }

  process.exit(hadError ? 1 : 0);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  main();
}
