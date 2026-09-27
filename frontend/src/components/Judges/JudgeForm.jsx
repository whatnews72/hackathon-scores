import { useState, useEffect } from 'react';
import { judgeAPI } from '../../services/api';

export default function JudgeForm({ editingId, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingId) {
      loadJudge();
    }
  }, [editingId]);

  const loadJudge = async () => {
    try {
      const response = await judgeAPI.getById(editingId);
      setFormData(response.data.data);
    } catch (err) {
      setError('심사위원 정보를 불러올 수 없습니다.');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('이름을 입력하세요.');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await judgeAPI.update(editingId, formData);
      } else {
        await judgeAPI.create(formData);
      }
      onClose();
    } catch (err) {
      setError('심사위원 저장에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mb-6">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {editingId ? '심사위원 수정' : '심사위원 추가'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="심사위원 이름"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              평가 카테고리
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="예: 기술성, 창의성, 완성도"
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
