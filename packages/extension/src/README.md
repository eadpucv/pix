# Implementation map

Each subdirectory implements a slice of the contract in
[`../interaction-capture.allium`](../interaction-capture.allium).
Use the cross-reference below when navigating between the spec and
the code.

| Folder | Spec entities / rules implemented |
|---|---|
| `background/` | `entity Recorder`, `rule UserStartsRecording`, `rule UserStopsRecording`, `@invariant SingleActiveScore`, `@invariant RecordingSurvivesNavigationAndTabs`. The service worker holds the recording state, persists it across navigations, owns the IndexedDB connection. |
| `content/` | `external entity InteractiveElement`, `@invariant ElementInteractivityCriteria`, `rule UserClickCapturesStep`. Content script that detects interactive elements, captures clicks, screenshots the viewport, computes the focus region. One copy injected per matching tab. |
| `popup/` | `entity Score`, `rule UserCreatesScore`, `rule UserEditsCell`, `rule UserEditsScoreMetadata`, `rule UserDeletesStep`, `rule UserDeletesScore`, `rule UserExportsScoreAsPiXJson`, `rule UserExportsScoreAsPdf`, `rule UserImportsPiXScore`, `@guarantee ImportRejectionExplained`. The score library and editor UI. |
| `overlay/` | `@guarantee RecordingStateAlwaysVisible`. The persistent "red light" indicator injected into every tab while `Recorder.state = recording`. |

Imports from `@pix/core` (when populated) cover types, the pixogram
catalogue, IndexedDB helpers and migrations. See
[`../../core/README.md`](../../core/README.md).
