import { useState, useEffect } from 'react';
import { judgeAPI } from '../../services/api';
import JudgeForm from './JudgeForm';

export default function JudgeList() {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadJudges();
  }, []);

  const loadJudges = async () => {
    try {
      setLoading(true);
      const response = await judgeAPI.getAll();
      setJudges(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('심사위원 목록을 불러올 수 없습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await judgeAPI.delete(id);
        setJudges(judges.filter(judge => judge.id !== id));
      } catch (err) {
        setError('심사위원 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
    loadJudges();
  };

  if (loading) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">심사위원 관리</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          심사위원 추가
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <JudgeForm editingId={editingId} onClose={handleFormClose} />
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-3 text-left">이름</th>
              <th className="border border-gray-300 p-3 text-left">평가 카테고리</th>
              <th className="border border-gray-300 p-3 text-center">작업</th>
            </tr>
          </thead>
          <tbody>
            {judges.map(judge => (
              <tr key={judge.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">{judge.name}</td>
                <td className="border border-gray-300 p-3">{judge.category || '-'}</td>
                <td className="border border-gray-300 p-3 text-center">
                  <button
                    onClick={() => {
                      setEditingId(judge.id);
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(judge.id)}
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

      {judges.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          등록된 심사위원이 없습니다. 새로운 심사위원을 추가하세요.
        </div>
      )}
    </div>
  );
}
