import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-6">해커톤 점수 관리 시스템</h1>
        <p className="text-xl mb-12 max-w-2xl">
          팀의 점수를 관리하고 최종 순위를 결정하세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl">
          <Link
            to="/teams"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur rounded-lg p-6 transition transform hover:scale-105"
          >
            <div className="text-4xl mb-3">👥</div>
            <h2 className="text-2xl font-bold mb-2">팀 관리</h2>
            <p className="text-sm">팀 정보를 등록하고 관리하세요</p>
          </Link>

          <Link
            to="/judges"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur rounded-lg p-6 transition transform hover:scale-105"
          >
            <div className="text-4xl mb-3">👨‍⚖️</div>
            <h2 className="text-2xl font-bold mb-2">심사위원</h2>
            <p className="text-sm">심사위원을 등록하세요</p>
          </Link>

          <Link
            to="/scores"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur rounded-lg p-6 transition transform hover:scale-105"
          >
            <div className="text-4xl mb-3">⭐</div>
            <h2 className="text-2xl font-bold mb-2">점수 입력</h2>
            <p className="text-sm">팀 점수를 입력하세요</p>
          </Link>

          <Link
            to="/results"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur rounded-lg p-6 transition transform hover:scale-105"
          >
            <div className="text-4xl mb-3">🏆</div>
            <h2 className="text-2xl font-bold mb-2">최종 결과</h2>
            <p className="text-sm">순위를 확인하세요</p>
          </Link>
        </div>

        <div className="mt-16 text-sm opacity-75">
          <p>© 2026 Hackathon Scoring System</p>
        </div>
      </div>
    </div>
  );
}
