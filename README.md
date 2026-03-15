# PiX — Interaction Score Editor

PiX is a visual notation system for defining and modeling user experience within digital services. Based on service blueprinting and customer journeys, PiX provides a structured way to represent the layers of interaction between users and systems.

Developed at [e[ad] Escuela de Arquitectura y Diseño PUCV](https://www.ead.pucv.cl), Chile.

**Live app → [eadpucv.github.io/pix](https://eadpucv.github.io/pix)**

## Score Types

- **PiX** (Interaction Process): 3 layers — User, Dialogue, System
- **SB** (Service Blueprint): 5 layers — Environment, User, Dialogue, System, Supporting Processes

## Tech Stack

- Vanilla JavaScript with [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) (Custom Elements, no framework)
- [Vite](https://vitejs.dev/) for development and build
- CSS custom properties, no preprocessor
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for client-side storage (up to 20 scores)
- Client-side export: SVG (vector), PDF (vector via jsPDF + svg2pdf.js), PNG, JSON
- 160 pixogram icons (SVG, IcoMoon-generated)
- i18n: Spanish / English

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node.js)

### Install and run

```bash
git clone https://github.com/hspencer/pix.git
cd pix
git checkout v3
npm install
npm run dev
```

This opens the app at `http://localhost:5173/pix/`.

### Build for production

```bash
npm run build
npm run preview   # preview the built site locally
```

The built site goes to `dist/`.

## Project Structure

```
pix/
├── index.html              # SPA entry point
├── vite.config.js          # Vite configuration
├── package.json
├── icons/                  # 160 pixogram SVGs (256×256, monochrome)
├── favicon/
├── public/
│   └── pages/app-embed/    # Legacy embed route for MediaWiki compatibility
├── src/
│   ├── main.js             # Entry point
│   ├── version.js          # Version from package.json (injected by Vite)
│   ├── components/         # Web Components
│   │   ├── PixApp.js       # Shell, router, i18n
│   │   ├── PixLibrary.js   # Score library grid
│   │   ├── PixEditor.js    # Score editor with auto-save
│   │   ├── PixScore.js     # CSS Grid score renderer
│   │   ├── PixCell.js      # Editable cell with icon autocomplete
│   │   ├── PixIconPicker.js
│   │   ├── PixToolbar.js
│   │   ├── PixExportDialog.js
│   │   ├── PixViewer.js    # Read-only renderer for embeds
│   │   └── PixAbout.js
│   ├── data/
│   │   ├── icons-meta.js   # Icon names, layer suggestions, SVG loader
│   │   ├── examples.js     # Pre-loaded example scores
│   │   └── migrate.js      # Legacy format migration
│   ├── export/             # SVG, PDF, PNG, JSON exporters
│   ├── storage/
│   │   └── db.js           # IndexedDB wrapper
│   ├── i18n/               # Translations (en.js, es.js)
│   └── styles/
│       ├── main.css        # Global styles, CSS custom properties
│       ├── score.css       # Score grid visual styles
│       └── editor.css      # App shell, nav, toolbar, library
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

## Legacy Compatibility

PiX v3 maintains backward compatibility with v1 embed URLs used in [Casiopea](https://wiki.ead.pucv.cl) (MediaWiki + SemanticMediaWiki):

```
#!/import/[base64-encoded-json]
#!/print/[base64-encoded-json]
```

The MediaWiki widget embeds scores via iframe pointing to `/pix/pages/app-embed/#!/import/[data]`. This route is preserved through a redirect in `public/pages/app-embed/index.html`.

Imported data is automatically migrated: flat arrays are wrapped, the `enviroment` → `environment` typo is corrected, and missing fields are filled with defaults.

## Contributing

1. Fork this repo
2. Create a feature branch from `dev`
3. Make your changes
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
