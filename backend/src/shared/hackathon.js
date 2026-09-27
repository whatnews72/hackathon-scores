// KEEP IN SYNC WITH frontend/src/lib/hackathon.js
// 아티팩트의 전역 상수 및 순수 함수들을 CommonJS로 포팅

const ALL_IDS = 'ABCDEFGHIJ'.split('');
const MIN_TEAMS = 2;
const MAX_TEAMS = ALL_IDS.length;
const MAX_SIZE = 10;
const DEFAULT_SIZE = 6;

const CRITERIA = [
  {k:'c1', name:'기획우수성', max:20, q:'아이디어의 차별성 및 독창성', lo:'흔한 아이디어', hi:'처음 보는 아이디어'},
  {k:'c2', name:'구현우수성', max:40, q:'결과물의 기능성 및 완성도', lo:'거의 작동하지 않음', hi:'모든 기능이 완벽히 작동'},
  {k:'c3', name:'실현가능성', max:10, q:'실생활에 활용 가능성', lo:'실제로 쓰기 어려움', hi:'바로 쓸 수 있음'},
  {k:'c4', name:'발표능력', max:20, q:'프레젠테이션 발표 전달 능력', lo:'이해하기 어려움', hi:'한 번에 이해됨'},
  {k:'c5', name:'팀워크', max:10, q:'팀원 참여도 및 단합성', lo:'일부만 참여', hi:'모두 함께 참여'},
];

const MAX_TOTAL = CRITERIA.reduce((a,c) => a + c.max, 0); // 100

const DEFAULT_STATE = {
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

const DEMO_COMMENTS = [
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

const steps = (c) => {
  return [1, 2, 3, 4, 5];
};

// FNV-1a 해시
const hash = (s) => {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

// 3자리 PIN 생성
const pin = (id, salt = 'hk26') => {
  const key = (salt || 'hk26') + ':' + id;
  return String(100 + hash(key) % 900);
};

// 참여 코드 (e.g. "A3-517")
const codeOf = (id, salt = 'hk26') => {
  return id + '-' + pin(id, salt);
};

// 팀의 학생 수
const sizeOf = (state, teamId) => {
  return state.sizes[teamId] || DEFAULT_SIZE;
};

// 팀 개수 범위 제약
const teamCountClamp = (n) => {
  return Math.max(MIN_TEAMS, Math.min(MAX_TEAMS, Math.round(n)));
};

// State로부터 roster 재구성
const rebuildRoster = (state) => {
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
const expected = (state, roster, team) => {
  const studentsForTeam = roster.STUDENTS.filter(s => s.team !== team);
  return studentsForTeam.length;
};

// 점수 합계 계산
const total = (row) => {
  return (row.c1 || 0) + (row.c2 || 0) + (row.c3 || 0) + (row.c4 || 0) + (row.c5 || 0);
};

// 숫자 포맷 (소수점 자리)
const fmt = (n, d = 2) => {
  return Number.isFinite(n) ? n.toFixed(d) : '0.00';
};

// 점수 ID 생성
const scoreId = (studentId, teamId) => {
  return studentId + '_' + teamId;
};

// 팀 이름 조회
const teamName = (state, teamId) => {
  return state.teams[teamId] || '';
};

// 프로젝트명 조회
const projName = (state, teamId) => {
  return state.projects[teamId] || '';
};

// 팀 색상 클래스명 (c1-c10)
const tcolor = (teamId) => {
  const idx = ALL_IDS.indexOf(teamId);
  return 't' + String.fromCharCode('A'.charCodeAt(0) + idx);
};

// 데모 행 생성 (서버에서 확정적으로 생성)
const makeDemoRow = (student, team, state, roster) => {
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

module.exports = {
  ALL_IDS,
  MIN_TEAMS,
  MAX_TEAMS,
  MAX_SIZE,
  DEFAULT_SIZE,
  CRITERIA,
  MAX_TOTAL,
  DEFAULT_STATE,
  DEMO_COMMENTS,
  steps,
  hash,
  pin,
  codeOf,
  sizeOf,
  teamCountClamp,
  rebuildRoster,
  expected,
  total,
  fmt,
  scoreId,
  teamName,
  projName,
  tcolor,
  makeDemoRow,
};
