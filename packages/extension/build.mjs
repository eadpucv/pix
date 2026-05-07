// PiX — build script (esbuild)
//
// Each JS entry produces a single, self-contained bundle (no chunks).
// The service worker, content script and popup/overlay scripts can all
// run as standalone files this way, including their imports from
// @pix/core and ./lib/* resolved through npm workspaces.
//
// HTML files are copied verbatim. Manifest is renamed per target.

import { build } from 'esbuild';
import { copyFileSync, rmSync, mkdirSync, existsSync } from 'fs';
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

if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const entries = [
  { in: 'src/background/index.js', out: 'background/index.js' },
  { in: 'src/content/index.js',    out: 'content/index.js' },
  { in: 'src/manager/index.js',    out: 'manager/index.js' }
];

for (const e of entries) {
  await build({
    entryPoints: [resolve(__dirname, e.in)],
    outfile: resolve(outDir, e.out),
    bundle: true,
    format: 'esm',
    target: 'es2022',
    platform: 'browser',
    sourcemap: 'linked',
    logLevel: 'silent',
    legalComments: 'none'
  });
}

copyFileSync(resolve(srcDir, 'manager/index.html'), resolve(outDir, 'manager/index.html'));
copyFileSync(resolve(__dirname, `manifest.${target}.json`), resolve(outDir, 'manifest.json'));

console.log(`Built ${target} → ${outDir}`);
