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

## Status — v0.2.0 · functional alpha

What works:

- **Recorder state machine.** Start / stop survive navigation, tab switches
  and MV3 service-worker termination. Persisted in `chrome.storage.local`.
- **Multi-trigger capture.** Clicks (button / link / generic), text-input
  commits (blur with value change), select / checkbox / radio commits and
  file attachments. Each step gets a localised caption (es / en / pt) and a
  pixogram seed.
- **Section breaks.** A new section starts on the first step and on every
  URL or `document.title` change between consecutive steps. The section
  title cascades from `document.title` → first `<h1>` → humanised path
  segment.
- **ScreenshotTrace as a separate entity.** Capture-derived fields
  (screenshot, focus, captured\_\*) live in a `pix.trace:<id>` blob; the
  Score itself stays clean.
- **Recording dot.** A draggable red dot in the corner of every recorded
  page. Click stops recording, drag repositions and persists the new
  spot. The dot is hidden via `visibility: hidden` for the duration of
  every `chrome.tabs.captureVisibleTab` so it never bleeds into the
  screenshot.
- **No popup.** Clicking the toolbar action opens the manager directly
  (the popup is gone); a right-click context menu exposes Start / Stop /
  Open library on any page.
- **Trace handoff.** "Open in editor" from the manager creates a tab at
  `#!/edit/<base64-score>` and follows up with `chrome.scripting.executeScript`
  running in `world: 'MAIN'` to call `window.__pixReceiveTrace(trace)`,
  which the editor's `PixApp` persists to IndexedDB. The walkthrough
  viewer (`#/walkthrough/<score_id>`) reads it from there.

What's still pending — see `interaction-capture.allium` for the full set:

- Pause / resume of an active recording.
- Hover / tooltip capture, drag-and-drop steps, error visibility, media
  playback events.
- Async-result capture (e.g. the chatbot response that lands after a text
  commit without further user input).

The behavioural contract lives in
[`interaction-capture.allium`](interaction-capture.allium) (Allium v3).
Read it before extending the recorder — it documents the lifecycle, the
trigger rules, the privacy invariants and the round-trip with the editor.

## Build and load

```bash
# from the repo root
npm install
npm run build:chrome -w @pix/extension     # → packages/extension/dist/chrome/
npm run build:firefox -w @pix/extension    # → packages/extension/dist/firefox/
npm run build -w @pix/extension            # both
```

### Load unpacked — Chrome / Edge / Arc

1. `chrome://extensions`
2. Toggle **Developer mode** (top right).
3. **Load unpacked** → pick `packages/extension/dist/chrome/`.
4. The PiX logo appears in the toolbar; clicking it opens the manager
   tab. Open DevTools on the service-worker card and you should see
   `[pix] background service worker booted`.

After every code change, click the **reload icon** on the extension
card and reload the page you're testing on.

### Load temporary — Firefox

1. `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on** → pick
   `packages/extension/dist/firefox/manifest.json`.

### Watch mode

```bash
npm run watch:chrome -w @pix/extension
```

Re-runs the build on changes under `src/` and `manifest.chrome.json`.
Chrome still requires a manual reload click.

## Source layout

```
packages/extension/
├── interaction-capture.allium       Allium v3 spec — the contract
├── manifest.chrome.json             MV3 (Chrome / Edge / Arc)
├── manifest.firefox.json            MV2 / WebExtensions (Firefox)
├── build.mjs                        esbuild-based bundler
├── src/
│   ├── background/index.js          Service worker — Recorder state, capture
│   │                                pipeline, context menus, manager auto-open,
│   │                                pre/post-capture overlay coordination
│   ├── content/
│   │   ├── index.js                 Multi-trigger capture, focus regions,
│   │   │                            forwarding to background
│   │   └── overlay.js               Draggable click-to-stop red dot (shadow DOM)
│   ├── manager/                     Full-page library — Start/Stop, captured
│   │   ├── index.html               scores list with thumbnails, "Open in editor"
│   │   └── index.js                 handoff
│   └── lib/                         Pure functions
│       ├── classify.js              Element kind + caption derivation
│       ├── focus.js                 BoundingBox → FocusRegion, hostOf
│       ├── messages.js              Message-type constants
│       └── recorder.js              Reducer: (state, event) → state + effects
├── dist/
│   ├── chrome/                      MV3 build
│   └── firefox/                     MV2 build
└── package.json
```

## Spec → module map

| Module | Allium entities / rules |
|---|---|
| `background/` | `entity Recorder`, `rule UserStartsRecording`, `rule UserStopsRecording`, `@invariant SingleActiveScore`, `@invariant RecordingSurvivesNavigationAndTabs`, `@invariant CaptureDerivedFieldsImmutable`, capture pipeline coordination |
| `content/index.js` | `external entity InteractiveElement`, `@invariant ElementInteractivityCriteria`, `rule UserClickCapturesStep`, `rule UserTextInputCapturesStep`, `rule UserSelectionCapturesStep`, `rule UserFileAttachmentCapturesStep`, `@invariant TriggerMatchesKind`, `@invariant DialogueValuePrivacy` |
| `content/overlay.js` | `@guarantee RecordingStateAlwaysVisible` |
| `manager/` | `entity Score`, `rule UserDeletesScore`, `rule UserExportsScoreAsPiXJson` (via "Open in editor" round-trip), score library UI |
| `lib/` | Pure helpers — `classify_element`, `pixogram_for_kind`, `auto_caption`, `focus_from_box`, `host_of`, recorder reducer |

## Dependency on `@pix/core`

Stable nanoid-based ids at Score / Movement / ScoreStep level live in
`@pix/core/ids`. `extractTrace` and the score migrations live in
`@pix/core/migrations`. The extension imports both — score handoff, trace
splitting and id round-tripping all flow through the same primitives the
editor uses.
