const db = require('../db');
const { DEFAULT_STATE } = require('../shared/hackathon');

const getState = (callback) => {
  db.get('SELECT data FROM state WHERE id = 1', (err, row) => {
    if (err) {
      callback(null, DEFAULT_STATE);
    } else if (!row) {
      callback(null, DEFAULT_STATE);
    } else {
      try {
        const parsed = JSON.parse(row.data);
        callback(null, Object.assign({}, DEFAULT_STATE, parsed));
      } catch {
        callback(null, DEFAULT_STATE);
      }
    }
  });
};

const setState = (patch, callback) => {
  getState((err, current) => {
    if (err || !current) {
      callback(null, DEFAULT_STATE);
      return;
    }
    const updated = Object.assign({}, current, patch);
    db.run(
      'UPDATE state SET data = ?, updated_at = ? WHERE id = 1',
      [JSON.stringify(updated), Date.now()],
      (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, updated);
        }
      }
    );
  });
};

module.exports = {
  getState,
  setState,
};
