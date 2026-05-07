// PiX — build script (esbuild)
//
// Each JS entry produces a single, self-contained bundle (no chunks).
// The service worker, content script and popup/overlay scripts can all
// run as standalone files this way, including their imports from
// @pix/core and ./lib/* resolved through npm workspaces.
//
// HTML files are copied verbatim. Manifest is renamed per target.
// Toolbar icon is rasterised from a pixogram SVG so Chrome's MV3 action
// stops falling back to the puzzle-piece — see renderToolbarIcons.

import { build } from 'esbuild';
import { copyFileSync, rmSync, mkdirSync, existsSync, readFileSync, cpSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

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

// Localised strings — Chrome reads _locales/<lang>/messages.json from
// the extension root; Firefox does the same.
cpSync(resolve(__dirname, '_locales'), resolve(outDir, '_locales'), { recursive: true });

// Toolbar/store icon — rasterised from @pix/core/icons/system.svg.
// Chrome's MV3 action loader does not render SVG reliably (it falls
// back to the generic puzzle piece), so we ship PNGs at the canonical
// sizes. White glyph on black rounded background for legibility at
// small sizes and consistency across light/dark toolbars.
mkdirSync(resolve(outDir, 'icons'), { recursive: true });
await renderToolbarIcons(resolve(outDir, 'icons'));

console.log(`Built ${target} → ${outDir}`);

// ---- icon rasterisation ----

async function renderToolbarIcons(iconsDir) {
  const sourceSvg = readFileSync(
    resolve(__dirname, '../core/icons/system.svg'),
    'utf8'
  );

  // Strip the icomoon-ignore guide group; keep the original black fill
  // and transparent background. Chrome's toolbar handles light/dark
  // theming on its own so a monochrome glyph on transparent is the
  // friendliest baseline.
  const cleaned = sourceSvg
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/<!DOCTYPE[^>]*>/, '')
    .replace(/<g id="icomoon-ignore"[\s\S]*?<\/g>/, '');

  const innerMatch = cleaned.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const inner = innerMatch ? innerMatch[1] : cleaned;

  // Centre the glyph on a 256x256 transparent canvas. The source paths
  // sit roughly in y:47..119, so a 45px down-shift drops the optical
  // centre near 128.
  const wrap = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <g transform="translate(0, 45)">${inner}</g>
  </svg>`;

  const sizes = [16, 32, 48, 128];
  for (const size of sizes) {
    await sharp(Buffer.from(wrap))
      .resize(size, size)
      .png()
      .toFile(resolve(iconsDir, `icon-${size}.png`));
  }
}
