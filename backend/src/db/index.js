const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { DEFAULT_STATE } = require('../shared/hackathon');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../hackathon.db');

// 데이터베이스 폴더 생성
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('DB 연결 실패:', err);
  } else {
    console.log('✓ SQLite 연결됨:', dbPath);
    initSchema();
  }
});

// foreign_keys 활성화
db.run('PRAGMA foreign_keys = ON');

function initSchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  const statements = schema.split(';').filter(s => s.trim());

  let index = 0;
  function executeNext() {
    if (index >= statements.length) {
      initState();
      return;
    }
    const stmt = statements[index++];
    if (stmt.trim()) {
      db.run(stmt, (err) => {
        if (err && !err.message.includes('already exists')) {
          console.error('스키마 실행 오류:', err.message);
        }
        executeNext();
      });
    } else {
      executeNext();
    }
  }
  executeNext();
}

function initState() {
  db.get('SELECT id FROM state WHERE id = 1', (err, row) => {
    if (err) {
      console.error('state 조회 오류:', err.message);
    } else if (!row) {
      db.run(
        'INSERT INTO state (id, data, updated_at) VALUES (?, ?, ?)',
        [1, JSON.stringify(DEFAULT_STATE), Date.now()],
        (err) => {
          if (err) {
            console.error('state 초기화 오류:', err.message);
          } else {
            console.log('✓ State 테이블 초기화됨');
          }
        }
      );
    } else {
      console.log('✓ State 테이블 준비됨');
    }
  });
}

module.exports = db;
