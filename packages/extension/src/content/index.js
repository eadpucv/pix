// PiX Recorder — content script
//
// Runs in every matching tab. Detects interactive elements, captures
// click events, asks the background for a screenshot, builds the
// ScoreStep payload.
//
// Implements (per interaction-capture.allium):
//   - external entity InteractiveElement
//   - @invariant ElementInteractivityCriteria
//   - rule UserClickCapturesStep
//
// Stage 1: stub — only proves injection works.

console.log('[pix-recorder] content script injected on', window.location.href);
