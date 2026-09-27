const { Server } = require('socket.io');
const stateService = require('../services/stateService');
const scoreService = require('../services/scoreService');
const { rebuildRoster, expected, scoreId: makeScoreId, makeDemoRow, CRITERIA, steps } = require('../shared/hackathon');

let io;

const attachSockets = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (process.env.CORS_ORIGIN || 'http://localhost:3001').split(','),
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] ${socket.id} 연결됨`);

    // 초기 상태 전송
    stateService.getState((err, state) => {
      scoreService.getAllScores((err, scores) => {
        socket.emit('hk:init', { state, scores: scores || [] });
      });
    });

    socket.join('main');

    // setState 이벤트 핸들러
    socket.on('hk:setState', (payload) => {
      try {
        const { patch } = payload;
        if (!patch || typeof patch !== 'object') {
          socket.emit('hk:error', { code: 'INVALID_PAYLOAD', message: '잘못된 요청입니다.' });
          return;
        }

        // 허용된 키만 필터링
        const allowedKeys = ['title', 'teamCount', 'sizes', 'teams', 'projects', 'phase', 'current', 'revealCount', 'trim'];
        const filtered = {};
        for (const key of allowedKeys) {
          if (key in patch) {
            filtered[key] = patch[key];
          }
        }

        stateService.setState(filtered, (err, updated) => {
          if (err) {
            socket.emit('hk:error', { code: 'SERVER_ERROR', message: '상태 저장 실패' });
          } else {
            io.to('main').emit('hk:state', { state: updated });
          }
        });
      } catch (err) {
        console.error('[setState 오류]', err);
        socket.emit('hk:error', { code: 'SERVER_ERROR', message: '서버 오류가 발생했습니다.' });
      }
    });

    // submitScore 이벤트 핸들러
    socket.on('hk:submitScore', (payload) => {
      try {
        const { studentId, team, criteria, comment } = payload;

        stateService.getState((err, state) => {
          if (err || !state) {
            socket.emit('hk:error', { code: 'SERVER_ERROR', message: '상태 조회 실패' });
            return;
          }

          const roster = rebuildRoster(state);
          const { TEAM_IDS, STUDENTS } = roster;

          // 검증
          if (!studentId || !team) {
            socket.emit('hk:error', { code: 'INVALID_PARAMS', message: '학생 ID와 팀이 필요합니다.' });
            return;
          }

          const student = STUDENTS.find(s => s.id === studentId);
          if (!student) {
            socket.emit('hk:error', { code: 'STUDENT_NOT_FOUND', message: '학생을 찾을 수 없습니다.' });
            return;
          }

          if (!TEAM_IDS.includes(team)) {
            socket.emit('hk:error', { code: 'TEAM_NOT_FOUND', message: '팀을 찾을 수 없습니다.' });
            return;
          }

          if (student.team === team) {
            socket.emit('hk:error', { code: 'SELF_SCORE', message: '자신의 팀은 평가할 수 없습니다.' });
            return;
          }

          if (state.phase !== 'open' || state.current !== team) {
            socket.emit('hk:error', { code: 'INVALID_PHASE', message: '지금은 이 팀을 평가할 수 없습니다.' });
            return;
          }

          // 기준값 검증
          if (!criteria || typeof criteria !== 'object') {
            socket.emit('hk:error', { code: 'INVALID_CRITERIA', message: '평가 기준이 잘못되었습니다.' });
            return;
          }

          for (const criterion of CRITERIA) {
            const allowedSteps = steps(criterion);
            const val = criteria[criterion.k];
            if (val !== undefined && val !== null && !allowedSteps.includes(val)) {
              socket.emit('hk:error', { code: 'INVALID_SCORE', message: `${criterion.name}의 점수가 올바르지 않습니다.` });
              return;
            }
          }

          const id = makeScoreId(studentId, team);
          const scoreRow = {
            id,
            student: studentId,
            from: student.team,
            team,
            c1: criteria.c1 ?? null,
            c2: criteria.c2 ?? null,
            c3: criteria.c3 ?? null,
            c4: criteria.c4 ?? null,
            c5: criteria.c5 ?? null,
            comment: comment || '',
            hidden: false,
            demo: false,
            at: Date.now(),
          };

          scoreService.putScore(id, scoreRow, (err) => {
            if (err) {
              socket.emit('hk:error', { code: 'SERVER_ERROR', message: '점수 저장 실패' });
            } else {
              io.to('main').emit('hk:scoreUpserted', { score: scoreRow });
            }
          });
        });
      } catch (err) {
        console.error('[submitScore 오류]', err);
        socket.emit('hk:error', { code: 'SERVER_ERROR', message: '점수 저장에 실패했습니다.' });
      }
    });

    // patchScore 이벤트 핸들러
    socket.on('hk:patchScore', (payload) => {
      try {
        const { id, patch } = payload;
        if (!id || !patch) {
          socket.emit('hk:error', { code: 'INVALID_PARAMS', message: '잘못된 요청입니다.' });
          return;
        }

        // hidden만 허용
        if (!('hidden' in patch)) {
          socket.emit('hk:error', { code: 'INVALID_PATCH', message: '지원하지 않는 패치입니다.' });
          return;
        }

        scoreService.patchScore(id, { hidden: patch.hidden }, (err) => {
          if (err) {
            socket.emit('hk:error', { code: 'SERVER_ERROR', message: '점수 수정 실패' });
          } else {
            io.to('main').emit('hk:scorePatched', { id, patch: { hidden: patch.hidden } });
          }
        });
      } catch (err) {
        console.error('[patchScore 오류]', err);
        socket.emit('hk:error', { code: 'SERVER_ERROR', message: '점수 수정에 실패했습니다.' });
      }
    });

    // clearScores 이벤트 핸들러
    socket.on('hk:clearScores', () => {
      try {
        scoreService.clearScores((err) => {
          if (err) {
            socket.emit('hk:error', { code: 'SERVER_ERROR', message: '점수 삭제 실패' });
          } else {
            io.to('main').emit('hk:scoresCleared', {});
          }
        });
      } catch (err) {
        console.error('[clearScores 오류]', err);
        socket.emit('hk:error', { code: 'SERVER_ERROR', message: '점수 삭제에 실패했습니다.' });
      }
    });

    // demoFill 이벤트 핸들러
    socket.on('hk:demoFill', (payload) => {
      try {
        const { team } = payload;
        if (!team) {
          socket.emit('hk:error', { code: 'INVALID_PARAMS', message: '팀이 필요합니다.' });
          return;
        }

        stateService.getState((err, state) => {
          if (err || !state) {
            socket.emit('hk:error', { code: 'SERVER_ERROR', message: '상태 조회 실패' });
            return;
          }

          const roster = rebuildRoster(state);
          const { STUDENTS } = roster;

          scoreService.getAllScores((err, existingScores) => {
            const existingIds = new Set((existingScores || []).map(s => s.id));
            const newScores = [];
            let pendingInserts = 0;

            for (const student of STUDENTS) {
              if (student.team !== team) {
                const id = makeScoreId(student.id, team);
                if (!existingIds.has(id)) {
                  const demoRow = makeDemoRow(student.id, team, state, roster);
                  pendingInserts++;
                  scoreService.putScore(id, demoRow, (err) => {
                    if (!err) {
                      newScores.push(demoRow);
                    }
                    pendingInserts--;

                    if (pendingInserts === 0 && newScores.length > 0) {
                      io.to('main').emit('hk:scoresUpsertedBatch', { scores: newScores });
                    }
                  });
                }
              }
            }

            if (pendingInserts === 0) {
              socket.emit('hk:error', { code: 'NO_DATA', message: '추가할 데이터가 없습니다.' });
            }
          });
        });
      } catch (err) {
        console.error('[demoFill 오류]', err);
        socket.emit('hk:error', { code: 'SERVER_ERROR', message: '예시 점수 채우기에 실패했습니다.' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] ${socket.id} 연결 해제됨`);
    });
  });

  return io;
};

module.exports = { attachSockets };
