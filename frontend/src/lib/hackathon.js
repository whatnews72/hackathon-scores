// KEEP IN SYNC WITH backend/src/shared/hackathon.js
// 아티팩트의 전역 상수 및 순수 함수들을 ESM으로 포팅

export const ALL_IDS = 'ABCDEFGHIJ'.split('');
export const MIN_TEAMS = 2;
export const MAX_TEAMS = ALL_IDS.length;
export const MAX_SIZE = 10;
export const DEFAULT_SIZE = 6;

export const CRITERIA = [
  {k:'c1', name:'기획우수성', max:20, q:'아이디어의 차별성 및 독창성', lo:'흔한 아이디어', hi:'처음 보는 아이디어'},
  {k:'c2', name:'구현우수성', max:40, q:'결과물의 기능성 및 완성도', lo:'거의 작동하지 않음', hi:'모든 기능이 완벽히 작동'},
  {k:'c3', name:'실현가능성', max:10, q:'실생활에 활용 가능성', lo:'실제로 쓰기 어려움', hi:'바로 쓸 수 있음'},
  {k:'c4', name:'발표능력', max:20, q:'프레젠테이션 발표 전달 능력', lo:'이해하기 어려움', hi:'한 번에 이해됨'},
  {k:'c5', name:'팀워크', max:10, q:'팀원 참여도 및 단합성', lo:'일부만 참여', hi:'모두 함께 참여'},
];

export const MAX_TOTAL = CRITERIA.reduce((a,c) => a + c.max, 0); // 100

export const DEFAULT_STATE = {
  title: '우리반 해커톤',
  teamCount: 5,
  sizes: {},
  teams: {},
  projects: {},
  phase: 'idle', // 'idle' | 'open' | 'closed'
  current: null, // 현재 채점 중인 팀
  revealCount: 0,
  trim: false,
  salt: 'hk26',
};

export const DEMO_COMMENTS = [
  '정말 좋은 발표였습니다!',
  '아이디어가 창의로워요.',
  '완성도가 높네요.',
  '실현 가능성이 뛰어나요.',
  '팀워크가 돋보였어요.',
  '발표 능력이 우수합니다.',
  '혁신적인 접근이군요.',
  '기술적으로 뛰어나요.',
  '사용자 경험을 잘 고려했네요.',
  '실용적인 솔루션입니다.',
  '팀 분위기가 좋아 보여요.',
  '앞으로도 기대됩니다!',
];

export const steps = (c) => {
  return [1, 2, 3, 4, 5];
};

// FNV-1a 해시
export const hash = (s) => {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

// 3자리 PIN 생성
export const pin = (id, salt = 'hk26') => {
  const key = (salt || 'hk26') + ':' + id;
  return String(100 + hash(key) % 900);
};

// 참여 코드 (e.g. "A3-517")
export const codeOf = (id, salt = 'hk26') => {
  return id + '-' + pin(id, salt);
};

// 팀의 학생 수
export const sizeOf = (state, teamId) => {
  return state.sizes[teamId] || DEFAULT_SIZE;
};

// 팀 개수 범위 제약
export const teamCountClamp = (n) => {
  return Math.max(MIN_TEAMS, Math.min(MAX_TEAMS, Math.round(n)));
};

// State로부터 roster 재구성
export const rebuildRoster = (state) => {
  const teamCount = state.teamCount || DEFAULT_STATE.teamCount;
  const TEAM_IDS = ALL_IDS.slice(0, teamCount);
  const STUDENTS = [];
  for (const t of TEAM_IDS) {
    const size = sizeOf(state, t);
    for (let i = 1; i <= size; i++) {
      STUDENTS.push({
        id: t + i,
        team: t,
        no: i,
      });
    }
  }
  return { TEAM_IDS, STUDENTS };
};

// 팀 t를 평가할 예상 학생 수 (자기팀 제외)
export const expected = (state, roster, team) => {
  const studentsForTeam = roster.STUDENTS.filter(s => s.team !== team);
  return studentsForTeam.length;
};

// 점수 합계 계산
export const total = (row) => {
  return (row.c1 || 0) + (row.c2 || 0) + (row.c3 || 0) + (row.c4 || 0) + (row.c5 || 0);
};

// 숫자 포맷 (소수점 자리)
export const fmt = (n, d = 2) => {
  return Number.isFinite(n) ? n.toFixed(d) : '0.00';
};

// 점수 ID 생성
export const scoreId = (studentId, teamId) => {
  return studentId + '_' + teamId;
};

// 팀 이름 조회
export const teamName = (state, teamId) => {
  return state.teams[teamId] || '';
};

// 프로젝트명 조회
export const projName = (state, teamId) => {
  return state.projects[teamId] || '';
};

// 팀 색상 클래스명 (tA-tJ)
export const tcolor = (teamId) => {
  const idx = ALL_IDS.indexOf(teamId);
  return 't' + String.fromCharCode('A'.charCodeAt(0) + idx);
};

// 데모 행 생성
export const makeDemoRow = (student, team, state, roster) => {
  const biasMap = { A: 0.55, B: 0.3, C: 0.8, D: 0.1, E: 0.45 };
  const bias = biasMap[team] !== undefined ? biasMap[team] : (hash(team + student) % 1000) / 1000;

  const crit = {};
  for (const c of CRITERIA) {
    const stepsForC = steps(c);
    const biasedIdx = Math.floor(bias * (stepsForC.length - 1));
    crit[c.k] = stepsForC[biasedIdx];
  }

  const comment = DEMO_COMMENTS[hash(student + team) % DEMO_COMMENTS.length];
  return {
    id: scoreId(student, team),
    student,
    from: student.charAt(0),
    team,
    ...crit,
    comment,
    hidden: false,
    demo: true,
    at: Date.now(),
  };
};

// 집계 계산 (팀별 통계)
export const stats = (state, roster, scores) => {
  const result = {};

  for (const teamId of roster.TEAM_IDS) {
    const teamScores = scores.filter(s => s.team === teamId);
    const totals = teamScores.map(s => total(s)).sort((a, b) => a - b);

    let used = totals;
    if (state.trim && totals.length >= 3) {
      used = totals.slice(1, -1);
    }

    const avg = used.length > 0 ? used.reduce((a, b) => a + b) / used.length : 0;

    const crit = {};
    for (const c of CRITERIA) {
      const avg_c = teamScores.length > 0
        ? teamScores.reduce((sum, s) => sum + (s[c.k] || 0), 0) / teamScores.length
        : 0;
      crit[c.k] = avg_c;
    }

    result[teamId] = {
      avg,
      totals,
      used,
      n: teamScores.length,
      crit,
    };
  }

  return result;
};

// 순위 계산
export const ranked = (state, roster, scores) => {
  const st = stats(state, roster, scores);
  const entries = roster.TEAM_IDS
    .map(t => ({
      team: t,
      ...st[t],
    }))
    .sort((a, b) => {
      if (a.avg !== b.avg) return b.avg - a.avg;
      if (a.crit.c2 !== b.crit.c2) return b.crit.c2 - a.crit.c2;
      return b.n - a.n;
    });

  const result = [];
  let pos = 1;
  let prevAvg = null;
  for (let i = 0; i < entries.length; i++) {
    if (prevAvg !== null && entries[i].avg !== prevAvg) {
      pos = i + 1;
    }
    result.push({
      ...entries[i],
      pos,
    });
    prevAvg = entries[i].avg;
  }

  return result;
};

// 공개할 수 있는 팀 수
export const revealTotal = (state, roster, scores) => {
  const st = stats(state, roster, scores);
  return roster.TEAM_IDS.filter(t => st[t].n > 0).length;
};

// 팀에 대해 아직 점수를 제출하지 않은 학생들
export const missingFor = (state, roster, scores, team) => {
  const scored = new Set(scores.filter(s => s.team === team).map(s => s.student));
  return roster.STUDENTS.filter(s => s.team !== team && !scored.has(s.id));
};
