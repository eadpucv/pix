# @pix/extension

Browser extension that records a user's interaction with the open web page
and writes it down as a [PiX interaction score](../editor) — a 3- or 5-layer
"partitura" of User / Dialogue / System / (Environment / Supporting).

This package is a **deliberate fork in intent** from
[accesibilidad-inclusion/extension-chrome](https://github.com/accesibilidad-inclusion/extension-chrome).
The capture mechanism is reused; the cloud integration with `pictos.cl`
is dropped. What gets captured is the score itself, kept locally in the
browser and exportable as PiX-JSON (re-importable round-trip into this
extension after editing in `@pix/editor`) or as a step-by-step tutorial
PDF.

## Status

**Stage 1 — extension shell loadable, all modules inert.** Stubs in
place for background, content, popup and overlay so that "Load unpacked"
in Chrome / `web-ext run` in Firefox produces a working extension that
proves the pipeline is wired. No actual recording yet.

The behavioural contract lives in
[`interaction-capture.allium`](interaction-capture.allium) (Allium v3).
Read it before implementing the recording — it documents the lifecycle,
the click-capture rule, multi-site continuity, forensic semantics and
the round-trip with the editor.

## Build and load

```bash
# from the repo root
npm install
npm run build:chrome -w @pix/extension     # → packages/extension/dist/chrome/
npm run build:firefox -w @pix/extension    # → packages/extension/dist/firefox/
npm run build -w @pix/extension            # both
```

### Load unpacked — Chrome

1. `chrome://extensions`
2. Toggle **Developer mode** (top right)
3. **Load unpacked** → pick `packages/extension/dist/chrome/`
4. The "PiX Recorder" icon appears in the toolbar; clicking it opens
   the popup stub. Open DevTools → Console and you should see the
   `[pix-recorder] background service worker booted` line. On any tab
   you visit, the content script logs `[pix-recorder] content script
   injected on <url>`.

After every code change, click the **reload icon** on the extension
card in `chrome://extensions` and reload the page you're testing on.

### Load temporary — Firefox

1. `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on** → pick `packages/extension/dist/firefox/manifest.json`

### Watch mode (Chrome)

```bash
npm run watch:chrome -w @pix/extension
```

This re-runs the build whenever a file under `src/` or `manifest.chrome.json`
changes. Chrome still requires a manual reload click — the alternative is
to use `@crxjs/vite-plugin` for HMR, which we'll consider once iteration
gets painful.

## Source layout

```
packages/extension/
├── interaction-capture.allium       Allium v3 spec — the contract
├── manifest.chrome.json             MV3 (Chrome, Edge)
├── manifest.firefox.json            MV2 / WebExtensions (Firefox)
├── build.mjs                        File-copy build (no bundler yet)
├── src/
│   ├── background/index.js          Service worker — Recorder state, IDB owner
│   ├── content/index.js             Click capture, screenshot, focus
│   ├── overlay/                     Red-light indicator (web_accessible_resource)
│   │   ├── index.html
│   │   └── index.js
│   ├── popup/                       Score manager UI
│   │   ├── index.html
│   │   └── index.js
│   └── lib/                         Pure functions — testable in node
│       ├── classify.js              (Element) → CapturedElementKind
│       ├── focus.js                 BoundingBox → FocusRegion, hostOf
│       └── recorder.js              State machine: (state, event) → state + effects
├── dist/                            Build output (gitignored)
│   ├── chrome/
│   └── firefox/
└── package.json
```

## Spec → module map

| Module | Allium entities / rules |
|---|---|
| `background/` | `entity Recorder`, `rule UserStartsRecording`, `rule UserStopsRecording`, `@invariant SingleActiveScore`, `@invariant RecordingSurvivesNavigationAndTabs` |
| `content/` | `external entity InteractiveElement`, `@invariant ElementInteractivityCriteria`, `rule UserClickCapturesStep` |
| `popup/` | `rule UserCreatesScore`, `rule UserEditsCell`, `rule UserDeletesStep`, `rule UserExportsScoreAsPiXJson`, `rule UserExportsScoreAsPdf`, `rule UserImportsPiXScore`, `@guarantee ImportRejectionExplained` |
| `overlay/` | `@guarantee RecordingStateAlwaysVisible` |
| `lib/` | Pure helpers — `classify_element`, `pixogram_for_kind`, `focus_from_box`, `host_of`, the Recorder reducer |

The popup will eventually reuse `<pix-cell>`, `<pix-icon-picker>` and
`<pix-score>` from `@pix/editor` and IndexedDB / migrations / pixogram
catalogue from `@pix/core`. None of those imports are wired yet — Stage 1
is bundler-free deliberately.

## Open dependency on `@pix/core` — RESOLVED

Phase C of the monorepo migration introduced stable nanoid-based ids at
Score / Movement / ScoreStep level in `@pix/core`. The bidirectional
re-import flow specified in `interaction-capture.allium` ("Dependency on
eadpucv/pix") is now unblocked.
