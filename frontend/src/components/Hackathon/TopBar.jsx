import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function TopBar({ title, connected, mode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('teacher');

  useEffect(() => {
    const pathRole = location.pathname.replace('/', '');
    if (['teacher', 'student', 'screen', 'results'].includes(pathRole)) {
      setRole(pathRole);
      localStorage.setItem('hk.role', pathRole);
    }
  }, [location.pathname]);

  const handleRoleClick = (newRole) => {
    setRole(newRole);
    localStorage.setItem('hk.role', newRole);
    navigate(`/${newRole}`);
  };

  return (
    <header className="top">
      <div className="brand">🏆 {title || '우리반 해커톤'}</div>
      <nav className="roles">
        <button
          onClick={() => handleRoleClick('teacher')}
          aria-pressed={role === 'teacher'}
          className={role === 'teacher' ? 'active' : ''}
        >
          교사 콘솔
        </button>
        <button
          onClick={() => handleRoleClick('student')}
          aria-pressed={role === 'student'}
          className={role === 'student' ? 'active' : ''}
        >
          학생 채점
        </button>
        <button
          onClick={() => handleRoleClick('screen')}
          aria-pressed={role === 'screen'}
          className={role === 'screen' ? 'active' : ''}
        >
          결과 스크린
        </button>
        <button
          onClick={() => handleRoleClick('results')}
          aria-pressed={role === 'results'}
          className={role === 'results' ? 'active' : ''}
        >
          최종 결과
        </button>
      </nav>
      <div style={{ fontSize: '0.75rem', color: 'var(--fg2)' }}>
        {connected ? '🟢 실시간 연결됨' : '🔴 연결 중…'}
      </div>
    </header>
  );
}
