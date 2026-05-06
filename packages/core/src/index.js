// @pix/core entry point.
//
// This package is intentionally empty in the migration commit. It is
// the future home of:
//
//   * src/types.js           — the Score / Movement / ScoreStep / Cell
//                              data contract (today: implicit in the editor)
//   * src/pixograms/         — the 160 PiX SVG icons + metadata
//                              (today: lives at packages/editor/icons/)
//   * src/storage/           — IndexedDB wrapper for the score library
//                              (today: packages/editor/src/storage/db.js)
//   * src/migrations/        — schema migrations for stored scores
//                              (today: packages/editor/src/data/migrate.js)
//   * score-contract.allium  — the Allium spec of the data contract
//
// Until those are extracted, both @pix/editor and @pix/extension keep
// vendoring this code. See ../score-contract.allium (when it exists)
// for the behavioural spec.
