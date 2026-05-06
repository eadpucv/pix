# @pix/core

Shared core for the PiX projects in this monorepo. Both `@pix/editor` and
`@pix/extension` depend on it.

## Status

**Scaffolded, not yet populated.** This package was created during the
workspace migration. The migration commit deliberately did not extract
existing editor code into `core` — that refactor needs its own pass to
avoid breaking the editor.

## What lives here, eventually

| Concern | Source today | Target here |
|---|---|---|
| Score / Movement / ScoreStep types | implicit in editor runtime | `src/types.js` |
| 160 pixogram SVGs | `packages/editor/icons/` | `src/pixograms/` |
| Pixogram metadata (names, layer suggestions) | `packages/editor/src/data/icons-meta.js` | `src/pixograms/meta.js` |
| IndexedDB score library | `packages/editor/src/storage/db.js` | `src/storage/db.js` |
| Score migrations | `packages/editor/src/data/migrate.js` | `src/migrations/` |
| Allium spec of the data contract | does not exist | `score-contract.allium` |

## Why a separate package

The editor and the extension agree on **what a score is** down to
field names, pixogram identifiers and storage layout. Keeping that
shared definition in one package means:

- A schema change is one commit, not coordinated PRs across repos.
- Migrations run identically wherever a score lives.
- The pixogram catalogue is shared (no "bundle vs fetch" question
  for the extension).
- A round-trip CI test can verify the extension's exported JSON
  reloads losslessly in the editor.

## Extraction sequence (next chat)

1. Move `packages/editor/src/storage/db.js` → here. Update editor imports.
2. Move `packages/editor/icons/` → `src/pixograms/`. Update editor's
   vite plugin that copies icons to `dist/`.
3. Move `packages/editor/src/data/icons-meta.js` and `migrate.js` here.
4. Add explicit types (JSDoc or TypeScript).
5. Author `score-contract.allium` distilling the contract into Allium.
