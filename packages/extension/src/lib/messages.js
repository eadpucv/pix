// Message types exchanged between popup, background and content scripts.
// String constants make typos fail at build time and keep the contract
// in one place.

export const MSG = {
  // popup → background
  RECORDER_START:    'recorder:start',
  RECORDER_STOP:     'recorder:stop',
  RECORDER_GET_STATE:'recorder:get_state',

  // background → popup (broadcast on state change)
  RECORDER_STATE_CHANGED: 'recorder:state_changed',

  // background → content scripts (per-tab broadcast)
  OVERLAY_SHOW: 'overlay:show',
  OVERLAY_HIDE: 'overlay:hide',

  // background → content (target tab) — hide the dot during a screenshot
  // capture so the recording indicator does not contaminate snapshots.
  // PRE asks the content script to make the host invisible and respond
  // once the next paint has flushed; POST restores it.
  OVERLAY_PRE_CAPTURE:  'overlay:pre_capture',
  OVERLAY_POST_CAPTURE: 'overlay:post_capture',

  // content → background (capture pipeline)
  STEP_CAPTURE_REQUEST: 'step:capture_request',

  // popup ↔ background (active score stats)
  SCORE_GET_STATS: 'score:get_stats',
  SCORE_UPDATED:   'score:updated'
};

export const STORAGE_KEY = 'pix.recorder';
