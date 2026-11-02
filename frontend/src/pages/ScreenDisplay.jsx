import { useMemo } from 'react';
import { useHackathonSocket } from '../hooks/useHackathonSocket';
import { rebuildRoster, ranked, stats } from '../lib/hackathon';
import LeaderboardTable from '../components/Results/LeaderboardTable';

export default function ScreenDisplay() {
  const { state, scores } = useHackathonSocket();
  const roster = rebuildRoster(state);
  const st = stats(state, roster, scores);
  const rankings = ranked(state, roster, scores);

  const revealsToShow = useMemo(() => {
    if (!rankings.length) return [];
    const sortedByPos = [...rankings].sort((a, b) => a.pos - b.pos);
    return sortedByPos.slice(0, state.revealCount);
  }, [rankings, state.revealCount]);

  const revealedIds = new Set(revealsToShow.map(r => r.team));

  const isScoring = state.phase === 'open' && state.current;

  if (isScoring) {
    const teamStats = st[state.current];
    const expected = roster.STUDENTS.filter(s => s.team !== state.current).length;
    const progress = teamStats?.n || 0;

    return (
      <div className="screen">
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{state.current} 팀 채점 중</h1>
          <div className="ring">
            <svg viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--bd)" strokeWidth="4" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - progress / expected)}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <text x="80" y="80" textAnchor="middle" dominantBaseline="middle">
              {progress}/{expected}
            </text>
          </div>
        </div>
      </div>
    );
  }

  if (state.revealCount === 0) {
    return (
      <div className="screen">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🏆 해커톤 채점판</h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--fg2)' }}>결과 공개 대기 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>🏆 최종 순위</h1>
      </div>

      <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
        <LeaderboardTable
          rows={rankings}
          teams={state.teams}
          projects={state.projects}
          title={null}
          size="lg"
          sortable={false}
          isHidden={r => !revealedIds.has(r.team)}
        />
      </div>

      {state.revealCount > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>💬 칭찬 한마디</h2>
          <div className="wall">
            {scores
              .filter(s => !s.hidden && s.comment)
              .slice(0, 12)
              .map(s => (
                <div key={s.id} className="comment">
                  {s.comment}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
