# Implementation map

Each subdirectory implements a slice of the contract in
[`../interaction-capture.allium`](../interaction-capture.allium).
Use the cross-reference below when navigating between the spec and
the code.

| Folder | Spec entities / rules implemented |
|---|---|
| `background/` | `entity Recorder`, `rule UserStartsRecording`, `rule UserStopsRecording`, `@invariant SingleActiveScore`, `@invariant RecordingSurvivesNavigationAndTabs`, `@invariant CaptureDerivedFieldsImmutable`. The service worker holds the recording state, persists it across navigations, owns the capture pipeline (`captureVisibleTab` coordinated with the overlay's pre/post-capture hide), the right-click context menu and the manager auto-open on Start. |
| `content/index.js` | `external entity InteractiveElement`, `@invariant ElementInteractivityCriteria`, `rule UserClickCapturesStep`, `rule UserTextInputCapturesStep`, `rule UserSelectionCapturesStep`, `rule UserFileAttachmentCapturesStep`, `@invariant TriggerMatchesKind`, `@invariant DialogueValuePrivacy`. Content script that classifies the target, computes the focus region from its rect and forwards a payload to the background. One copy injected per matching tab. |
| `content/overlay.js` | `@guarantee RecordingStateAlwaysVisible`. Draggable shadow-DOM red dot. Click → `RECORDER_STOP`. Drag → reposition (persisted in `chrome.storage.local`). Visibility-toggle protocol (`OVERLAY_PRE_CAPTURE` / `OVERLAY_POST_CAPTURE`) keeps it out of every screenshot. |
| `manager/` | `entity Score`, `rule UserDeletesScore`, the "Open in editor" handoff (Score via `#!/edit/<b64>`, Trace via `chrome.scripting.executeScript` in `world: 'MAIN'`), the score library UI. Replaces the old popup as the toolbar action target. |

Imports from `@pix/core` cover stable nanoid ids (`@pix/core/ids`),
score migrations and trace extraction (`@pix/core/migrations`) and the
pixogram catalogue (`@pix/core/icons` for the toolbar logo). See
[`../../core/README.md`](../../core/README.md).
