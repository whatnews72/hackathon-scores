import { useMemo, useState } from 'react';
import { CRITERIA, tcolor } from '../../lib/hackathon';

// 21st.dev "Leaderboard Table"(arihantcodes) 디자인을 참고해 직접 구현한 순위표
// - 1~3위 메달 배지, 정렬 가능한 열, 직전 대비 순위 변동 표시
// - rows: lib/hackathon.js의 ranked() 결과 ({ team, pos, avg, n, crit })

// 순위 변동 화살표 (위/아래)
function DeltaChevron({ up }) {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
      <path
        d={up ? 'M6 2.5 L10.5 8.5 H1.5 Z' : 'M6 9.5 L1.5 3.5 H10.5 Z'}
        fill="currentColor"
      />
    </svg>
  );
}

// 정렬 방향 표시
function SortIcon({ dir }) {
  return (
    <span className={`lb-sort ${dir ? 'on' : ''}`} aria-hidden="true">
      {dir === 'desc' ? '▼' : '▲'}
    </span>
  );
}

// 팀별 순위가 바뀌면 그 변동폭을 기억한다 (다음 변동 전까지 유지)
// 순위 구성이 달라졌을 때만 렌더 중에 state를 갱신하는 React 권장 패턴 사용
function usePositionDelta(rows) {
  const sig = rows.map(r => `${r.team}:${r.pos}`).join(',');
  const [track, setTrack] = useState({ sig: '', pos: new Map(), deltas: new Map() });

  if (track.sig === sig) return track.deltas;

  const pos = new Map();
  const deltas = new Map(track.deltas);
  for (const r of rows) {
    const before = track.pos.get(r.team);
    if (before !== undefined && before !== r.pos) {
      // 순위 숫자가 작아지면 상승 (+)
      deltas.set(r.team, before - r.pos);
    }
    pos.set(r.team, r.pos);
  }
  setTrack({ sig, pos, deltas });
  return deltas;
}

export default function LeaderboardTable({
  rows,
  teams = {},
  projects = {},
  title = '리더보드',
  showCriteria = false,
  variant = 'panel', // 'panel' | 'striped'
  size = 'md', // 'md' | 'lg' (대형 화면/프로젝터용)
  sortable = true,
  isHidden = () => false, // 공개 전 팀: 팀·점수를 DOM에서도 가린다
}) {
  const [sort, setSort] = useState({ id: 'pos', dir: 'asc' });
  const deltas = usePositionDelta(rows);

  // 정렬 가능한 열 정의: value는 정렬 기준값
  const columns = useMemo(() => {
    const base = [
      { id: 'pos', header: '#', value: r => r.pos, align: 'center', defaultDir: 'asc' },
      { id: 'team', header: '팀', value: r => r.team, align: 'left', defaultDir: 'asc' },
      { id: 'avg', header: '총점', value: r => r.avg, align: 'right', defaultDir: 'desc' },
    ];
    const crit = showCriteria
      ? CRITERIA.map(c => ({
          id: c.k,
          header: c.name.slice(0, 2),
          title: `${c.name} (${c.max}점 만점)`,
          value: r => r.crit?.[c.k] ?? 0,
          align: 'right',
          defaultDir: 'desc',
          hide: 'md',
        }))
      : [];
    return [
      ...base,
      ...crit,
      { id: 'n', header: '제출', value: r => r.n, align: 'right', defaultDir: 'desc', hide: 'sm' },
      { id: 'moved', header: '변동', value: r => deltas.get(r.team) || 0, align: 'right', defaultDir: 'desc', hide: 'sm' },
    ];
  }, [showCriteria, deltas]);

  const sorted = useMemo(() => {
    if (!sortable) return [...rows].sort((a, b) => a.pos - b.pos);
    const col = columns.find(c => c.id === sort.id) || columns[0];
    const sign = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = col.value(a);
      const vb = col.value(b);
      const cmp = typeof va === 'string' ? va.localeCompare(vb, 'ko') : va - vb;
      // 동점이면 순위 순으로
      return cmp !== 0 ? cmp * sign : a.pos - b.pos;
    });
  }, [rows, columns, sort, sortable]);

  const toggleSort = (col) => {
    setSort(prev =>
      prev.id === col.id
        ? { id: col.id, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { id: col.id, dir: col.defaultDir }
    );
  };

  const renderCell = (col, r, hidden) => {
    // 공개 전: 순위 번호만 남기고 팀·점수·변동은 실제 값을 렌더링하지 않는다
    if (hidden && col.id === 'team') {
      return (
        <span className="lb-team">
          <span className="lb-dot masked" aria-hidden="true">?</span>
          <span className="lb-team-name">공개 대기</span>
        </span>
      );
    }
    if (hidden && col.id !== 'pos') return <span className="lb-muted">??</span>;

    switch (col.id) {
      case 'pos':
        return r.pos <= 3 ? (
          <span className={`lb-medal m${r.pos}`}>{r.pos}</span>
        ) : (
          <span className="lb-muted">{r.pos}</span>
        );
      case 'team': {
        const name = teams[r.team];
        const project = projects[r.team];
        return (
          <span className="lb-team">
            <span className={`lb-dot ${tcolor(r.team)}`} aria-hidden="true">
              {r.team}
            </span>
            <span className="lb-team-text">
              <span className="lb-team-name">{name ? `${r.team}팀 · ${name}` : `${r.team}팀`}</span>
              {project && <span className="lb-sub">{project}</span>}
            </span>
          </span>
        );
      }
      case 'avg':
        return <span className="lb-score">{r.avg.toFixed(1)}</span>;
      case 'n':
        return <span className="lb-muted">{r.n}명</span>;
      case 'moved': {
        const d = deltas.get(r.team) || 0;
        if (d === 0) return <span className="lb-muted">—</span>;
        return (
          <span className={`lb-delta ${d > 0 ? 'up' : 'down'}`}>
            <DeltaChevron up={d > 0} />
            {Math.abs(d)}
          </span>
        );
      }
      default: {
        const v = col.value(r);
        return v ? v.toFixed(1) : <span className="lb-muted">-</span>;
      }
    }
  };

  return (
    <div className={`lb ${variant === 'striped' ? 'striped' : ''} ${size === 'lg' ? 'lg' : ''}`}>
      {title && <div className="lb-title">{title}</div>}
      <div className="lb-scroll">
        <table className="lb-table">
          <caption className="sr-only">팀 순위표: 순위, 팀, 총점, 제출 수, 순위 변동</caption>
          <thead>
            <tr>
              {columns.map(col => {
                const active = sort.id === col.id;
                return (
                  <th
                    key={col.id}
                    scope="col"
                    className={`${col.align} ${col.hide ? `hide-${col.hide}` : ''}`}
                    aria-sort={sortable && active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    {sortable ? (
                      <button type="button" onClick={() => toggleSort(col)} title={col.title}>
                        {col.header}
                        <SortIcon dir={active ? sort.dir : null} />
                      </button>
                    ) : (
                      <span className="lb-th-label" title={col.title}>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => {
              const hidden = isHidden(r);
              const cls = hidden ? 'masked' : r.pos === 1 ? 'top1' : '';
              return (
                <tr key={r.team} className={cls}>
                  {columns.map(col => (
                    <td key={col.id} className={`${col.align} ${col.hide ? `hide-${col.hide}` : ''}`}>
                      {renderCell(col, r, hidden)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
