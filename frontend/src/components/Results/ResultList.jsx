import { useState, useEffect } from 'react';
import { resultAPI, teamAPI } from '../../services/api';

export default function ResultList() {
  const [results, setResults] = useState([]);
  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resultsRes, teamsRes] = await Promise.all([
        resultAPI.getAll(),
        teamAPI.getAll(),
      ]);

      setResults(resultsRes.data.data || []);

      const teamsMap = {};
      (teamsRes.data.data || []).forEach(team => {
        teamsMap[team.id] = team.name;
      });
      setTeams(teamsMap);

      setError(null);
    } catch (err) {
      setError('결과를 불러올 수 없습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    try {
      setCalculating(true);
      const response = await resultAPI.calculate();
      setResults(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('결과 계산에 실패했습니다.');
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-400 text-black';
      case 2:
        return 'bg-gray-400 text-white';
      case 3:
        return 'bg-orange-400 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">최종 결과 및 순위</h1>
        <button
          onClick={handleCalculate}
          disabled={calculating}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {calculating ? '계산 중...' : '순위 계산'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={result.teamId}
              className={`rounded-lg p-6 border-l-4 ${
                result.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-white border-yellow-400' : 'bg-white border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${getRankBadgeColor(result.rank)}`}>
                    {result.rank}위
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {teams[result.teamId] || `팀 ${result.teamId}`}
                    </h3>
                    <p className="text-gray-600">
                      {result.rank === 1 && '🏆 우승'}
                      {result.rank === 2 && '🥈 준우승'}
                      {result.rank === 3 && '🥉 3위'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-blue-600">
                    {result.totalScore.toFixed(2)}
                  </p>
                  <p className="text-gray-600">점</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            아직 계산된 결과가 없습니다.
          </p>
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded text-lg disabled:bg-gray-400"
          >
            {calculating ? '계산 중...' : '지금 순위 계산하기'}
          </button>
        </div>
      )}
    </div>
  );
}
