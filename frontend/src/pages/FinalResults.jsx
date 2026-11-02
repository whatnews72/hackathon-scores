import { useMemo } from 'react';
import { useHackathonSocket } from '../hooks/useHackathonSocket';
import { rebuildRoster, ranked, revealTotal } from '../lib/hackathon';
import LeaderboardTable from '../components/Results/LeaderboardTable';

export default function FinalResults() {
  const { state, scores } = useHackathonSocket();
  const roster = rebuildRoster(state);
  const rankings = ranked(state, roster, scores);

  const revealsToShow = useMemo(() => {
    if (!rankings.length) return [];
    const sortedByPos = [...rankings].sort((a, b) => a.pos - b.pos);
    return sortedByPos.slice(0, state.revealCount);
  }, [rankings, state.revealCount]);

  const revealedIds = new Set(revealsToShow.map(r => r.team));
  const total = revealTotal(state, roster, scores);

  const scoredRankings = rankings.filter(r => r.n > 0);
  const unscoredTeams = rankings.filter(r => r.n === 0);

  return (
    <div style={{ maxWidth: '100%', padding: '1rem' }}>
      <div className="panel">
        <h2>🏆 최종 결과</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--fg2)', marginBottom: '1rem' }}>
          공개됨: {state.revealCount} / {total}
        </p>

        {scoredRankings.length > 0 ? (
          <div style={{ marginBottom: '1rem' }}>
            <LeaderboardTable
              rows={scoredRankings}
              teams={state.teams}
              projects={state.projects}
              title={null}
              showCriteria
            />
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--fg2)', padding: '2rem 0' }}>
            채점 데이터가 없습니다.
          </p>
        )}

        {unscoredTeams.length > 0 && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--bd)', borderRadius: '4px' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              채점 대기:
            </p>
            <div style={{ fontSize: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {unscoredTeams.map(t => (
                <span key={t.team} style={{ display: 'inline-block' }}>
                  {t.team}팀
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
