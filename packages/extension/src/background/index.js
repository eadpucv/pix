// PiX Recorder — background service worker (MV3)
//
// Owns: recorder state, IndexedDB connection, message routing between
// content scripts / popup / overlay, lifecycle of the active recording.
//
// Implements (per interaction-capture.allium):
//   - entity Recorder
//   - rule UserStartsRecording, UserStopsRecording
//   - @invariant SingleActiveScore
//   - @invariant RecordingSurvivesNavigationAndTabs
//
// Stage 1: stub — only proves the extension loads.

console.log('[pix-recorder] background service worker booted');

self.addEventListener('install', () => {
  console.log('[pix-recorder] background install');
});

self.addEventListener('activate', () => {
  console.log('[pix-recorder] background activate');
});
