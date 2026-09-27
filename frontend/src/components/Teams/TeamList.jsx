import { useState, useEffect } from 'react';
import { teamAPI } from '../../services/api';
import TeamForm from './TeamForm';

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getAll();
      setTeams(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('팀 목록을 불러올 수 없습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await teamAPI.delete(id);
        setTeams(teams.filter(team => team.id !== id));
      } catch (err) {
        setError('팀 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
    loadTeams();
  };

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">팀 관리</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          팀 추가
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <TeamForm editingId={editingId} onClose={handleFormClose} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <div
            key={team.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
            <div className="mb-4">
              <p className="text-gray-600 text-sm">팀원 ({team.members?.length || 0}명)</p>
              {team.members && team.members.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {team.members.map((member, idx) => (
                    <li key={idx}>{member}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingId(team.id);
                  setShowForm(true);
                }}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-sm"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(team.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          등록된 팀이 없습니다. 새로운 팀을 추가하세요.
        </div>
      )}
    </div>
  );
}
