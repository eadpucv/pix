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
| `@pix/core` | Scaffolded; population pending | (planned) `packages/core/score-contract.allium` |
| `@pix/editor` | Stable, in production | implicit in code (distill pending) |
| `@pix/extension` | Spec only, implementation pending | [`packages/extension/interaction-capture.allium`](packages/extension/interaction-capture.allium) |

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

Specification only at the moment — see [`packages/extension/interaction-capture.allium`](packages/extension/interaction-capture.allium) (Allium v3) for the full behavioural contract, then `packages/extension/README.md` for the implementation plan.

## Core (`@pix/core`)

The shared core: score data contract, types, pixograms, IndexedDB storage, score migrations. Both editor and extension depend on it. Currently scaffolded but not yet populated — the extraction from `@pix/editor` is the next refactor pass. See [`packages/core/README.md`](packages/core/README.md).

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
