// Legacy data migration utilities

/**
 * Migrate a score from legacy format to v2 format.
 * - Fixes the "enviroment" typo to "environment"
 * - Ensures scores is an array of arrays
 * - Adds missing fields with defaults
 */
export function migrateScore(data) {
  if (!data) return null;

  const score = { ...data };

  // Ensure layout
  if (!score.layout) score.layout = 'ip';
  score.layout = score.layout.toLowerCase();

  // Ensure title & description
  if (!score.title) score.title = '';
  if (!score.description) score.description = '';

  // Ensure scores structure
  if (!score.scores) {
    score.scores = [[]];
  } else if (!Array.isArray(score.scores)) {
    score.scores = [[]];
  } else if (score.scores.length > 0 && !Array.isArray(score.scores[0])) {
    // Single flat array of steps — wrap it
    score.scores = [score.scores];
  }

  // Migrate each step
  score.scores = score.scores.map(movement =>
    movement.map(step => migrateStep(step, score.layout))
  );

  return score;
}

function migrateStep(step, layout) {
  const migrated = { ...step };

  // Fix enviroment typo
  if ('enviroment' in migrated) {
    migrated.environment = migrated.enviroment;
    delete migrated.enviroment;
  }

  // Ensure all fields exist
  if (migrated.step_title === undefined) migrated.step_title = '';
  if (migrated.user === undefined) migrated.user = '';
  if (migrated.dialogue === undefined) migrated.dialogue = '';
  if (migrated.system === undefined) migrated.system = '';
  if (migrated.note === undefined) migrated.note = '';

  // SB fields
  if (layout === 'sb') {
    if (migrated.environment === undefined) migrated.environment = '';
    if (migrated.supporting_processes === undefined) migrated.supporting_processes = '';
  }

  return migrated;
}

/**
 * Parse legacy base64 URL data
 */
export function parseLegacyData(base64String) {
  try {
    const json = atob(base64String);
    const data = JSON.parse(json);
    return migrateScore(data);
  } catch (e) {
    console.error('Failed to parse legacy data:', e);
    return null;
  }
}

/**
 * Encode score data to base64 for embed URLs
 */
export function encodeScoreData(score) {
  return btoa(JSON.stringify(score));
}
