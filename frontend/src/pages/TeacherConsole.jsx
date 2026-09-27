import { useState } from 'react';
import { useHackathonSocket } from '../hooks/useHackathonSocket';
import { useToast } from '../hooks/useToast';
import { rebuildRoster, stats, CRITERIA, steps, codeOf } from '../lib/hackathon';

export default function TeacherConsole() {
  const { state, scores, actions } = useHackathonSocket();
  const { toast } = useToast();
  const [showCodes, setShowCodes] = useState(false);
  const [teamConfigOpen, setTeamConfigOpen] = useState(false);
  const [teamNameDrafts, setTeamNameDrafts] = useState({});
  const [projectDrafts, setProjectDrafts] = useState({});
  const [titleDraft, setTitleDraft] = useState(null);
  const roster = rebuildRoster(state);
  const st = stats(state, roster, scores);

  const handleOpenTeam = (team) => {
    actions.setState({ phase: 'open', current: team });
    toast(`${team} 팀 채점이 시작되었습니다.`);
  };

  const handleCloseTeam = () => {
    actions.setState({ phase: 'idle', current: null });
    toast('채점이 마감되었습니다.');
  };

  const handleDemoFill = (team) => {
    actions.demoFill(team);
    toast('예시 점수를 채우는 중...');
  };

  const handleClearScores = () => {
    if (window.confirm('정말로 모든 점수를 삭제하시겠습니까?')) {
      if (window.confirm('한 번 더 확인합니다. 정말 삭제하시겠습니까?')) {
        actions.clearScores();
        toast('모든 점수가 삭제되었습니다.');
      }
    }
  };

  const handleTeamCountChange = (delta) => {
    const newCount = state.teamCount + delta;
    if (newCount >= 2 && newCount <= 10) {
      actions.setState({ teamCount: newCount });
    }
  };

  const handleTeamNameChange = (team, name) => {
    setTeamNameDrafts(d => ({ ...d, [team]: name }));
  };

  const handleTeamNameBlur = (team) => {
    const draft = teamNameDrafts[team];
    if (draft !== undefined) {
      actions.setState({
        teams: { ...state.teams, [team]: draft },
      });
      setTeamNameDrafts(d => {
        const newD = { ...d };
        delete newD[team];
        return newD;
      });
    }
  };

  const handleProjectChange = (team, proj) => {
    setProjectDrafts(d => ({ ...d, [team]: proj }));
  };

  const handleProjectBlur = (team) => {
    const draft = projectDrafts[team];
    if (draft !== undefined) {
      actions.setState({
        projects: { ...state.projects, [team]: draft },
      });
      setProjectDrafts(d => {
        const newD = { ...d };
        delete newD[team];
        return newD;
      });
    }
  };

  const handleSizeChange = (team, size) => {
    const newSize = Math.max(1, Math.min(10, size));
    actions.setState({
      sizes: { ...state.sizes, [team]: newSize },
    });
  };

  const handleReveal = () => {
    const total = Object.values(st).filter(s => s.n > 0).length;
    if (state.revealCount < total) {
      actions.setState({ revealCount: state.revealCount + 1 });
    }
  };

  const handleTrimToggle = () => {
    actions.setState({ trim: !state.trim });
  };

  const handleTitleChange = (title) => {
    setTitleDraft(title);
  };

  const handleTitleBlur = () => {
    if (titleDraft !== null && titleDraft !== state.title) {
      actions.setState({ title: titleDraft || '우리반 해커톤' });
    }
    setTitleDraft(null);
  };

  return (
    <div className="phone" style={{ maxWidth: '100%' }}>
      <div className="panel">
        <h2>행사 정보</h2>
        <label>
          행사명:
          <input
            type="text"
            value={titleDraft !== null ? titleDraft : (state.title || '우리반 해커톤')}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="행사명 입력"
          />
        </label>
      </div>

      <div className="panel">
        <h2>발표 진행 관리</h2>
        <div style={{ marginTop: '1rem' }}>
          {roster.TEAM_IDS.map(team => {
            const teamStats = st[team] || {};
            const isLive = state.current === team;
            return (
              <div
                key={team}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: isLive ? 'rgba(37, 99, 235, 0.1)' : 'var(--hl)',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  border: isLive ? '2px solid var(--primary)' : '1px solid var(--bd)',
                }}
              >
                <div>
                  <strong>{team}팀</strong> - {teamStats.n || 0}/{roster.STUDENTS.filter(s => s.team !== team).length} 제출
                </div>
                <div>
                  {!isLive ? (
                    <button className="btn small" onClick={() => handleOpenTeam(team)}>
                      시작
                    </button>
                  ) : (
                    <button className="btn small danger" onClick={handleCloseTeam}>
                      마감
                    </button>
                  )}
                  <button className="btn small" onClick={() => handleDemoFill(team)} style={{ marginLeft: '0.5rem' }}>
                    예시
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel">
        <h2>집계 현황</h2>
        <table>
          <thead>
            <tr>
              <th>팀</th>
              <th>평균</th>
              <th>제출</th>
            </tr>
          </thead>
          <tbody>
            {roster.TEAM_IDS.map(team => {
              const teamStats = st[team] || {};
              return (
                <tr key={team}>
                  <td>
                    <strong>{team}팀</strong>
                  </td>
                  <td>{teamStats.avg ? teamStats.avg.toFixed(1) : '-'}</td>
                  <td>{teamStats.n || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <label>
          <input
            type="checkbox"
            checked={state.trim}
            onChange={handleTrimToggle}
          />
          최고/최저 제외 (Trimmed Mean)
        </label>
      </div>

      <div className="panel">
        <h2>팀 구성</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            팀 수:
            <button className="btn small" onClick={() => handleTeamCountChange(-1)}>
              -
            </button>
            <span style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}>{state.teamCount}</span>
            <button className="btn small" onClick={() => handleTeamCountChange(1)}>
              +
            </button>
          </label>
        </div>

        {roster.TEAM_IDS.map(team => (
          <div key={team} style={{ marginBottom: '1rem', padding: '0.5rem', background: 'var(--hl)', borderRadius: '4px' }}>
            <label>
              {team}팀 이름:
              <input
                type="text"
                value={teamNameDrafts[team] ?? state.teams[team] ?? ''}
                onChange={(e) => handleTeamNameChange(team, e.target.value)}
                onBlur={() => handleTeamNameBlur(team)}
                placeholder={`팀 ${team}`}
              />
            </label>
            <label>
              프로젝트명:
              <input
                type="text"
                value={projectDrafts[team] ?? state.projects[team] ?? ''}
                onChange={(e) => handleProjectChange(team, e.target.value)}
                onBlur={() => handleProjectBlur(team)}
                placeholder="프로젝트명"
              />
            </label>
            <label>
              인원수:
              <input
                type="number"
                min="1"
                max="10"
                value={state.sizes[team] || 6}
                onChange={(e) => handleSizeChange(team, parseInt(e.target.value))}
              />
            </label>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>학생 참여 코드</h2>
        <button className="btn" onClick={() => setShowCodes(!showCodes)}>
          {showCodes ? '숨기기' : '보기'}
        </button>
        {showCodes && (
          <table style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>학생</th>
                <th>코드</th>
              </tr>
            </thead>
            <tbody>
              {roster.STUDENTS.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td className="mono">{codeOf(student.id, state.salt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="panel">
        <h2>결과 공개</h2>
        <button className="btn primary" onClick={handleReveal} style={{ marginRight: '0.5rem' }}>
          다음 순위 공개
        </button>
        <button className="btn primary" onClick={() => {
          const total = Object.values(st).filter(s => s.n > 0).length;
          actions.setState({ revealCount: total });
        }}>
          모두 공개
        </button>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          공개됨: {state.revealCount} / {Object.values(st).filter(s => s.n > 0).length}
        </p>
      </div>

      <div className="panel">
        <h2>초기화</h2>
        <button className="btn danger" onClick={handleClearScores}>
          새 대회로 초기화
        </button>
      </div>
    </div>
  );
}
