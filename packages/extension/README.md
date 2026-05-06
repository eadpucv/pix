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

**Specification only — no implementation yet.** The behavioural
contract lives in [`interaction-capture.allium`](interaction-capture.allium)
(Allium v3). Read it before implementing — it documents:

- the recording lifecycle (start, stop, single active score);
- exactly what counts as an interactive element (granularity criterion);
- when and how screenshots are taken;
- how each captured click maps to a PiX score column;
- how the recorder handles **multi-site sequences** (cross-origin
  navigations to a payment gateway and back);
- the **forensic posture**: append-only capture-derived fields,
  per-score provenance metadata, replace-in-place re-import;
- export formats: PiX-JSON for round-trip with the editor, tutorial
  PDF for replicability.

It also documents what is **out of scope** (network calls, browser-
extension plumbing details, the editor itself, audit trails) and lists
the open design questions the implementation will need to resolve.

## Relationship to the rest of the monorepo

- **`@pix/core`** — owns the score data contract: layouts (`pix`,
  `sb`), layers, the 160-icon pixogram catalogue, the IndexedDB
  library pattern, score migrations. This extension imports types
  and helpers from `@pix/core`.
- **`@pix/editor`** — the canonical PiX home where users enrich the
  `user` layer of a recorded score. Round-trip happens through
  PiX-JSON: the extension exports a score (without screenshots),
  the editor enriches it, the user re-imports it in the same Score
  in the extension; capture-derived fields are preserved by id-match.

## Layout

```
packages/extension/
├── interaction-capture.allium  ← Allium v3 spec (the contract)
├── manifest.chrome.json        ← (TODO) Chrome MV3 manifest
├── manifest.firefox.json       ← (TODO) Firefox WebExtensions manifest
├── src/                        ← (TODO) implementation
│   ├── background/             ← service worker, recorder state
│   ├── content/                ← interactive-element detection, click capture
│   ├── popup/                  ← the manager UI
│   └── overlay/                ← the "red light" indicator
└── package.json
```

## Open dependency on `@pix/core`

The bidirectional re-import flow (replace-in-place, preserving
screenshots through a round-trip via the editor) requires `@pix/core`
to introduce stable ids at three levels (Score, Movement, ScoreStep).
The current PiX editor preserves only `Score.id` and strips it on
export. See `interaction-capture.allium` → "Dependency on eadpucv/pix"
and `packages/core/README.md` for the extraction plan.

Until that lands in `@pix/core`, the extension can implement everything
**except** lossless re-import — it would have to fall back to
positional matching, which the spec explicitly rejects.
