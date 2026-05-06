// PiX Recorder — build script
//
// Stage 1: file copy. No bundler yet — every entry is a self-contained
// stub with no imports beyond browser globals. When src/ starts importing
// from @pix/core, switch this to esbuild or @crxjs/vite-plugin and update
// the README.
//
// Output layout (matches manifest paths):
//   dist/<browser>/
//     manifest.json
//     background/index.js
//     content/index.js
//     overlay/index.html
//     overlay/index.js
//     popup/index.html
//     popup/index.js

import { cpSync, copyFileSync, rmSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = process.argv[2] || 'chrome';

if (target !== 'chrome' && target !== 'firefox') {
  console.error(`Unknown target: ${target}. Use 'chrome' or 'firefox'.`);
  process.exit(1);
}

const srcDir = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist', target);
const manifestSource = resolve(__dirname, `manifest.${target}.json`);
const manifestDest = resolve(outDir, 'manifest.json');

if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// Copy each module folder. Skip lib/ — pure helpers, only consumed via
// imports from background/content; once a bundler is in place those imports
// resolve and the lib/ files don't need to ship as separate assets.
for (const mod of ['background', 'content', 'overlay', 'popup']) {
  cpSync(resolve(srcDir, mod), resolve(outDir, mod), { recursive: true });
}

copyFileSync(manifestSource, manifestDest);

console.log(`Built ${target} → ${outDir}`);
