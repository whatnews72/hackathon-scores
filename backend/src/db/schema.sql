CREATE TABLE IF NOT EXISTS state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
  id TEXT PRIMARY KEY,
  student TEXT NOT NULL,
  from_team TEXT NOT NULL,
  team TEXT NOT NULL,
  c1 REAL,
  c2 REAL,
  c3 REAL,
  c4 REAL,
  c5 REAL,
  comment TEXT DEFAULT '',
  hidden INTEGER NOT NULL DEFAULT 0,
  demo INTEGER NOT NULL DEFAULT 0,
  at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scores_team ON scores(team);
CREATE INDEX IF NOT EXISTS idx_scores_student ON scores(student);
