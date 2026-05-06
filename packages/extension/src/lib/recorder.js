// recorder.js — pure state machine
//
// Implements `entity Recorder` from interaction-capture.allium as a
// plain reducer:  (state, event) → { state, effects }
//
// The reducer never calls chrome.* or DOM APIs. The background service
// worker is the only place that translates effects into side-effects.
// This split lets us unit-test the recording lifecycle in node, and
// keeps RecordingSurvivesNavigationAndTabs as pure data flow.

/** @typedef {'idle' | 'recording'} RecorderState */
/** @typedef {{ state: RecorderState, active_score_id: string | null }} Recorder */

/** @type {Recorder} */
export const initialRecorder = {
  state: 'idle',
  active_score_id: null
};

/**
 * Apply an event to the recorder. Returns the next recorder snapshot
 * and a list of side effects the caller (background) should perform.
 *
 * Events:
 *   { type: 'start',       score_id }   — UserStartsRecording
 *   { type: 'stop' }                    — UserStopsRecording
 *   { type: 'click_captured', step }    — UserClickCapturesStep result
 *
 * Effects (descriptive, not imperative):
 *   { kind: 'append_step', score_id, step }
 *   { kind: 'show_overlay' }
 *   { kind: 'hide_overlay' }
 *   { kind: 'persist_recorder' }
 */
export function reduce(recorder, event) {
  switch (event.type) {
    case 'start': {
      if (recorder.state === 'recording') {
        return { recorder, effects: [] };
      }
      return {
        recorder: { state: 'recording', active_score_id: event.score_id },
        effects: [{ kind: 'show_overlay' }, { kind: 'persist_recorder' }]
      };
    }

    case 'stop': {
      if (recorder.state === 'idle') {
        return { recorder, effects: [] };
      }
      return {
        recorder: { state: 'idle', active_score_id: null },
        effects: [{ kind: 'hide_overlay' }, { kind: 'persist_recorder' }]
      };
    }

    case 'click_captured': {
      if (recorder.state !== 'recording' || !recorder.active_score_id) {
        return { recorder, effects: [] };
      }
      return {
        recorder,
        effects: [{
          kind: 'append_step',
          score_id: recorder.active_score_id,
          step: event.step
        }]
      };
    }

    default:
      return { recorder, effects: [] };
  }
}
