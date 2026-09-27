import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-xl hover:opacity-80">
            🏆 해커톤 점수 시스템
          </Link>

          <div className="flex gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded hover:bg-blue-700 transition ${isActive('/')}`}
            >
              홈
            </Link>
            <Link
              to="/teams"
              className={`px-4 py-2 rounded hover:bg-blue-700 transition ${isActive('/teams')}`}
            >
              팀 관리
            </Link>
            <Link
              to="/judges"
              className={`px-4 py-2 rounded hover:bg-blue-700 transition ${isActive('/judges')}`}
            >
              심사위원
            </Link>
            <Link
              to="/scores"
              className={`px-4 py-2 rounded hover:bg-blue-700 transition ${isActive('/scores')}`}
            >
              점수
            </Link>
            <Link
              to="/results"
              className={`px-4 py-2 rounded hover:bg-blue-700 transition ${isActive('/results')}`}
            >
              결과
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
