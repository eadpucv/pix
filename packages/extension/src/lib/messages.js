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
  OVERLAY_HIDE: 'overlay:hide'
};

export const STORAGE_KEY = 'pix.recorder';
