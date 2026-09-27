import { useState, useEffect } from 'react';
import { scoreAPI, teamAPI, judgeAPI } from '../../services/api';

export default function ScoreForm({ editingId, onClose }) {
  const [formData, setFormData] = useState({
    teamId: '',
    judgeId: '',
    score: '',
    comment: '',
  });
  const [teams, setTeams] = useState([]);
  const [judges, setJudges] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSelectOptions();
    if (editingId) {
      loadScore();
    }
  }, [editingId]);

  const loadSelectOptions = async () => {
    try {
      const [teamsRes, judgesRes] = await Promise.all([
        teamAPI.getAll(),
        judgeAPI.getAll(),
      ]);
      setTeams(teamsRes.data.data || []);
      setJudges(judgesRes.data.data || []);
    } catch (err) {
      setError('데이터를 불러올 수 없습니다.');
      console.error(err);
    }
  };

  const loadScore = async () => {
    try {
      const response = await scoreAPI.getById(editingId);
      setFormData(response.data.data);
    } catch (err) {
      setError('점수 정보를 불러올 수 없습니다.');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'score' ? (value ? Number(value) : '') : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.teamId || !formData.judgeId || formData.score === '') {
      setError('필수 항목을 입력하세요.');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await scoreAPI.update(editingId, formData);
      } else {
        await scoreAPI.create(formData);
      }
      onClose();
    } catch (err) {
      setError('점수 저장에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mb-6">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {editingId ? '점수 수정' : '점수 추가'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              팀 *
            </label>
            <select
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">팀을 선택하세요</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              심사위원 *
            </label>
            <select
              name="judgeId"
              value={formData.judgeId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">심사위원을 선택하세요</option>
              {judges.map(judge => (
                <option key={judge.id} value={judge.id}>
                  {judge.name} ({judge.category})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              점수 (0-100) *
            </label>
            <input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="점수 입력"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              평가 의견
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="평가 의견을 입력하세요"
              rows="3"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded disabled:bg-gray-400"
            >
              {loading ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
