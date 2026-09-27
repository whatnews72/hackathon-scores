import { useState, useEffect } from 'react';
import { useHackathonSocket } from '../hooks/useHackathonSocket';
import { useToast } from '../hooks/useToast';
import { rebuildRoster, codeOf, pin, CRITERIA, steps, total } from '../lib/hackathon';

export default function StudentScoring() {
  const { state, scores, actions } = useHackathonSocket();
  const { toast } = useToast();
  const [me, setMe] = useState(() => localStorage.getItem('hk.me'));
  const [loginCode, setLoginCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [criteria, setCriteria] = useState({});
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roster = rebuildRoster(state);
  const student = roster.STUDENTS.find(s => s.id === me);
  const canScore = state.phase === 'open' && state.current && me && student?.team !== state.current;

  const myScoreForTeam = submitted && state.current
    ? scores.find(s => s.student === me && s.team === state.current)
    : null;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const codeUpper = loginCode.toUpperCase().replace(/\s/g, '');
    const match = codeUpper.match(/^([A-J])(\d{1,2})-?(\d{3})$/);

    if (!match) {
      setLoginError('코드 형식이 올바르지 않습니다.');
      return;
    }

    const [, teamLetter, numStr, pinStr] = match;
    const studentId = teamLetter + numStr;
    const expectedPin = pin(studentId, state.salt);

    if (pinStr !== expectedPin) {
      setLoginError('코드가 올바르지 않습니다.');
      return;
    }

    const foundStudent = roster.STUDENTS.find(s => s.id === studentId);
    if (!foundStudent) {
      setLoginError('학생을 찾을 수 없습니다.');
      return;
    }

    setMe(studentId);
    localStorage.setItem('hk.me', studentId);
    setLoginCode('');
    toast('로그인되었습니다!');
  };

  const handleLogout = () => {
    setMe(null);
    localStorage.removeItem('hk.me');
    setCriteria({});
    setComment('');
    setSubmitted(false);
    setSubmittedScore(null);
  };

  const handleCriterionChange = (key, value) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.current || !me) return;

    // 모든 기준이 선택되었는지 확인
    for (const c of CRITERIA) {
      if (!(c.k in criteria)) {
        toast('모든 기준을 선택해주세요.');
        return;
      }
    }

    setIsSubmitting(true);
    actions.submitScore({
      studentId: me,
      team: state.current,
      criteria,
      comment,
    });

    setTimeout(() => {
      setSubmitted(true);
      const newScore = scores.find(s => s.student === me && s.team === state.current);
      setSubmittedScore(newScore);
      toast('점수가 제출되었습니다!');
      setCriteria({});
      setComment('');
      setIsSubmitting(false);
    }, 500);
  };

  if (!me) {
    return (
      <div className="phone" style={{ marginTop: '2rem' }}>
        <div className="panel">
          <h2>참여 코드 입력</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              placeholder="예: A1-234"
              autoFocus
              autoCapitalize="characters"
              style={{ marginTop: '1rem' }}
            />
            {loginError && (
              <p style={{ color: 'var(--danger)', marginTop: '0.5rem' }}>{loginError}</p>
            )}
            <button type="submit" className="btn primary" style={{ marginTop: '1rem', width: '100%' }}>
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!canScore && !submitted) {
    return (
      <div className="phone" style={{ marginTop: '2rem' }}>
        <div className="panel">
          <h2>대기 중</h2>
          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.25rem' }}>
            {state.current === student?.team ? '🎤 우리 팀 발표 차례!' : '⏳ 채점 시작을 기다리는 중...'}
          </p>
          <button className="btn" onClick={handleLogout} style={{ marginTop: '2rem', width: '100%' }}>
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  if (submitted && myScoreForTeam) {
    return (
      <div className="phone" style={{ marginTop: '2rem' }}>
        <div className="panel">
          <h2>✅ 채점 완료</h2>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              합계: {total(myScoreForTeam).toFixed(1)}점
            </p>
            <table style={{ marginTop: '1rem' }}>
              <tbody>
                {CRITERIA.map(c => (
                  <tr key={c.k}>
                    <td>{c.name}</td>
                    <td style={{ textAlign: 'right' }}>{myScoreForTeam[c.k] || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {myScoreForTeam.comment && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--hl)', borderRadius: '4px' }}>
                <strong>코멘트:</strong> {myScoreForTeam.comment}
              </div>
            )}
          </div>
          <button className="btn" onClick={handleLogout} style={{ marginTop: '2rem', width: '100%' }}>
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="phone" style={{ marginTop: '1rem' }}>
      <div className="panel">
        <h2>{state.current} 팀 평가</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--fg2)' }}>
          {me} / {student?.team}팀
        </p>

        <form onSubmit={handleSubmit}>
          {CRITERIA.map(c => (
            <div key={c.k} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {c.name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--fg2)', marginBottom: '0.5rem' }}>
                {c.q}
              </p>
              <div style={{ fontSize: '0.7rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.lo}</span>
                <span>{c.hi}</span>
              </div>
              <div className="scale">
                {steps(c).map((step, i) => (
                  <button
                    key={i}
                    type="button"
                    className={criteria[c.k] === step ? 'selected' : ''}
                    onClick={() => handleCriterionChange(c.k, step)}
                    style={{
                      background: criteria[c.k] === step ? 'var(--primary)' : 'var(--hl)',
                      color: criteria[c.k] === step ? 'white' : 'var(--fg)',
                      border: `2px solid ${criteria[c.k] === step ? 'var(--primary)' : 'var(--bd)'}`,
                    }}
                  >
                    {step.toFixed(0)}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              칭찬 한마디
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="팀의 좋은 점을 칭찬해주세요..."
              rows="3"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              합계: {Object.values(criteria).reduce((a, b) => a + (b || 0), 0).toFixed(1)}점
            </p>
          </div>

          <button
            type="submit"
            className="btn primary"
            disabled={isSubmitting || !Object.values(criteria).some(v => v)}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            {isSubmitting ? '제출 중...' : '점수 제출'}
          </button>

          <button
            type="button"
            className="btn"
            onClick={handleLogout}
            style={{ width: '100%' }}
          >
            로그아웃
          </button>
        </form>
      </div>
    </div>
  );
}
