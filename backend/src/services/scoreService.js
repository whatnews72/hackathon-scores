const db = require('../db');

const getAllScores = (callback) => {
  db.all('SELECT * FROM scores', (err, rows) => {
    if (err) {
      callback(err, []);
    } else {
      const scores = rows.map(row => ({
        id: row.id,
        student: row.student,
        from: row.from_team,
        team: row.team,
        c1: row.c1,
        c2: row.c2,
        c3: row.c3,
        c4: row.c4,
        c5: row.c5,
        comment: row.comment,
        hidden: row.hidden === 1,
        demo: row.demo === 1,
        at: row.at,
      }));
      callback(null, scores);
    }
  });
};

const putScore = (id, data, callback) => {
  db.run(
    `INSERT INTO scores (id, student, from_team, team, c1, c2, c3, c4, c5, comment, hidden, demo, at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       student = excluded.student,
       from_team = excluded.from_team,
       team = excluded.team,
       c1 = excluded.c1,
       c2 = excluded.c2,
       c3 = excluded.c3,
       c4 = excluded.c4,
       c5 = excluded.c5,
       comment = excluded.comment,
       hidden = excluded.hidden,
       demo = excluded.demo,
       at = excluded.at`,
    [
      id,
      data.student,
      data.from,
      data.team,
      data.c1 ?? null,
      data.c2 ?? null,
      data.c3 ?? null,
      data.c4 ?? null,
      data.c5 ?? null,
      data.comment || '',
      data.hidden ? 1 : 0,
      data.demo ? 1 : 0,
      data.at,
    ],
    callback
  );
};

const patchScore = (id, patch, callback) => {
  const setClauses = [];
  const values = [];

  if ('hidden' in patch) {
    setClauses.push('hidden = ?');
    values.push(patch.hidden ? 1 : 0);
  }

  if (setClauses.length === 0) {
    callback(null);
    return;
  }

  values.push(id);
  db.run(
    `UPDATE scores SET ${setClauses.join(', ')} WHERE id = ?`,
    values,
    callback
  );
};

const clearScores = (callback) => {
  db.run('DELETE FROM scores', callback);
};

module.exports = {
  getAllScores,
  putScore,
  patchScore,
  clearScores,
};
