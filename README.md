# PiX — Interaction Score System

PiX is a visual notation system for defining and modeling user experience within digital services. Based on service blueprinting and customer journeys, PiX provides a structured way to represent the layers of interaction between users and systems.

Developed at [e[ad] Escuela de Arquitectura y Diseño PUCV](https://www.ead.pucv.cl), Chile.

**Live editor → [eadpucv.github.io/pix](https://eadpucv.github.io/pix)**

## Repository layout

This repo is a npm-workspaces monorepo. The PiX project is split into three packages that share a single dependency tree and version history.

```
pix/
├── packages/
│   ├── core/        @pix/core       — score data contract, types, pixograms, IndexedDB storage
│   ├── editor/      @pix/editor     — the web app at eadpucv.github.io/pix
│   └── extension/   @pix/extension  — browser extension (Chrome + Firefox) that records interactions as PiX scores
├── package.json     (workspaces declaration, root-level scripts)
└── README.md        (this file)
```

| Package | Status | Spec |
|---|---|---|
| `@pix/core` | Populated — score migrations, stable ids, IndexedDB storage, pixogram catalogue, ScreenshotTrace | [`packages/core/score-contract.allium`](packages/core/score-contract.allium) — owns the shared data model |
| `@pix/editor` | Stable, in production · v3.2.0 | [`packages/editor/walkthrough-viewer.allium`](packages/editor/walkthrough-viewer.allium); the editor proper is still implicit in code |
| `@pix/extension` | Functional alpha · v0.2.0 — recording, multi-trigger capture, ScreenshotTrace handoff, walkthrough viewer integration | [`packages/extension/interaction-capture.allium`](packages/extension/interaction-capture.allium) |

### Specs

`score-contract.allium` owns the shared vocabulary — Score, Movement, ScoreStep,
ScreenshotTrace, RecordingSession, TraceSnapshot, TraceAnnotation. The other two
specs import it (`use "../core/score-contract.allium" as core`) and reference
those entities rather than redefining them.

Because of that import, the specs must be checked **as a set** — checking one
file alone leaves the import unresolved:

```bash
npm run spec            # allium check, all three together
npm run spec:analyse    # process-level analysis
```

## Score Types

- **PiX** (Interaction Process): 3 layers — User, Dialogue, System
- **SB** (Service Blueprint): 5 layers — Environment, User, Dialogue, System, Supporting Processes

## Local development

Requires Node.js 18+ and npm.

```bash
git clone https://github.com/eadpucv/pix.git
cd pix
npm install                 # installs deps for all packages, links them together
npm run dev                 # runs the editor (shortcut for: npm run dev -w @pix/editor)
```

The editor opens at `http://localhost:5173/pix/`.

### Per-package scripts

```bash
npm run dev -w @pix/editor          # editor dev server
npm run build -w @pix/editor        # editor production build (outputs to packages/editor/dist/)
npm run build -w @pix/extension     # extension build (TODO)
npm run preview -w @pix/editor      # preview the built editor
```

The `-w` flag (`--workspace`) tells npm which package the script belongs to. Running `npm install` once at the root installs dependencies for every workspace and creates symlinks so packages can import each other (`@pix/extension` depends on `@pix/core` via a normal `import`, npm resolves it to the sibling folder).

## Editor (`@pix/editor`)

The web app — vanilla JS Web Components, Vite, IndexedDB. See [`packages/editor/`](packages/editor/) for its source. The internal layout (components, data, export, i18n, storage, styles) is unchanged from before the workspace migration; only its location inside the repo moved.

### Tech stack

- Vanilla JavaScript with [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) (Custom Elements, no framework)
- [Vite](https://vitejs.dev/) for development and build
- CSS custom properties, no preprocessor
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for client-side storage (up to 20 scores)
- Client-side export: SVG, PDF (jsPDF + svg2pdf.js), PNG, JSON
- 160 pixogram icons (SVG, IcoMoon-generated)
- i18n: Spanish / English

### Legacy compatibility

PiX v3 maintains backward compatibility with v1 embed URLs used in [Casiopea](https://wiki.ead.pucv.cl) (MediaWiki + SemanticMediaWiki):

```
#!/import/[base64-encoded-json]
#!/print/[base64-encoded-json]
```

The MediaWiki widget embeds scores via iframe pointing to `/pix/pages/app-embed/#!/import/[data]`. This route is preserved through a redirect in `packages/editor/public/pages/app-embed/index.html`.

Imported data is automatically migrated: flat arrays are wrapped, the `enviroment` → `environment` typo is corrected, and missing fields are filled with defaults.

## Extension (`@pix/extension`)

Browser extension (Chrome MV3 + Firefox WebExtensions) that records the user's interaction with any web page and writes the result as a PiX score. Local-only, no network calls. Exports PiX-JSON (round-trip with `@pix/editor`) or step-by-step tutorial PDFs.

Functional in alpha. The current build covers:

- Recording state machine surviving navigation, tab changes and service worker hibernation.
- Multi-trigger capture: clicks, text input commits (blur with value change), select / checkbox / radio commits, file attachments. Captions are localised (es / en / pt) and always describe the action — never the value typed into a free-text field.
- Section breaks emitted automatically when the URL or `document.title` changes between two consecutive steps.
- Screenshots taken with the recording dot hidden, so the indicator never leaks into a snapshot.
- Score and ScreenshotTrace stored separately in `chrome.storage.local`; the trace ships to the editor's IndexedDB on "Open in editor" via `chrome.scripting.executeScript` running in the page's MAIN world.
- A toolbar button that opens the manager directly (no popup), a right-click context menu (Start / Stop / Open library) and an on-page red dot that clicks-to-stop and drags-to-reposition.

See [`packages/extension/interaction-capture.allium`](packages/extension/interaction-capture.allium) (Allium v3) for the behavioural contract and [`packages/extension/README.md`](packages/extension/README.md) for the build/load instructions.

## Core (`@pix/core`)

The shared core: score data contract, stable nanoid-based ids, pixogram catalogue (160 SVG icons), IndexedDB storage with v2 schema (separate `scores` and `traces` stores), score migrations (`enviroment` typo, lazy capture-field extraction, legacy backfill), Casiopea-locked URL encoder. Both editor and extension import from it. See [`packages/core/README.md`](packages/core/README.md).

## Contributing

1. Fork this repo
2. Create a feature branch from `dev`
3. Make your changes (in the relevant package under `packages/`)
4. Open a Pull Request to `dev`

```bash
git checkout dev
git pull origin dev
git checkout -b my-feature
# ... make changes ...
git push origin my-feature
# then open a PR on GitHub
```

## License

[Artistic License 2.0](LICENSE)
