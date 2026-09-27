import { useState, useEffect } from 'react';
import { scoreAPI, teamAPI, judgeAPI } from '../../services/api';
import ScoreForm from './ScoreForm';

export default function ScoreList() {
  const [scores, setScores] = useState([]);
  const [teams, setTeams] = useState({});
  const [judges, setJudges] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scoresRes, teamsRes, judgesRes] = await Promise.all([
        scoreAPI.getAll(),
        teamAPI.getAll(),
        judgeAPI.getAll(),
      ]);

      setScores(scoresRes.data.data || []);

      const teamsMap = {};
      (teamsRes.data.data || []).forEach(team => {
        teamsMap[team.id] = team.name;
      });
      setTeams(teamsMap);

      const judgesMap = {};
      (judgesRes.data.data || []).forEach(judge => {
        judgesMap[judge.id] = judge.name;
      });
      setJudges(judgesMap);

      setError(null);
    } catch (err) {
      setError('점수 목록을 불러올 수 없습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await scoreAPI.delete(id);
        setScores(scores.filter(score => score.id !== id));
      } catch (err) {
        setError('점수 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
    loadData();
  };

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">점수 관리</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          점수 추가
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <ScoreForm editingId={editingId} onClose={handleFormClose} />
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-3 text-left">팀</th>
              <th className="border border-gray-300 p-3 text-left">심사위원</th>
              <th className="border border-gray-300 p-3 text-center">점수</th>
              <th className="border border-gray-300 p-3 text-left">평가 의견</th>
              <th className="border border-gray-300 p-3 text-center">작업</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(score => (
              <tr key={score.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">
                  {teams[score.teamId] || `팀 ${score.teamId}`}
                </td>
                <td className="border border-gray-300 p-3">
                  {judges[score.judgeId] || `심사위원 ${score.judgeId}`}
                </td>
                <td className="border border-gray-300 p-3 text-center font-bold">
                  {score.score}
                </td>
                <td className="border border-gray-300 p-3 text-sm">
                  {score.comment || '-'}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <button
                    onClick={() => {
                      setEditingId(score.id);
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(score.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {scores.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          등록된 점수가 없습니다. 새로운 점수를 추가하세요.
        </div>
      )}
    </div>
  );
}
