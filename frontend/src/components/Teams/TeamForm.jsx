import { useState, useEffect } from 'react';
import { teamAPI } from '../../services/api';

export default function TeamForm({ editingId, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    members: [],
  });
  const [memberInput, setMemberInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingId) {
      loadTeam();
    }
  }, [editingId]);

  const loadTeam = async () => {
    try {
      const response = await teamAPI.getById(editingId);
      setFormData(response.data.data);
    } catch (err) {
      setError('팀 정보를 불러올 수 없습니다.');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handleAddMember = () => {
    if (memberInput.trim()) {
      setFormData({
        ...formData,
        members: [...formData.members, memberInput.trim()],
      });
      setMemberInput('');
    }
  };

  const handleRemoveMember = (index) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('팀 이름을 입력하세요.');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await teamAPI.update(editingId, formData);
      } else {
        await teamAPI.create(formData);
      }
      onClose();
    } catch (err) {
      setError('팀 저장에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mb-6">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {editingId ? '팀 수정' : '팀 추가'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              팀 이름
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="팀 이름 입력"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              팀원 추가
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddMember();
                    e.preventDefault();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
                placeholder="팀원 이름"
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                추가
              </button>
            </div>

            {formData.members.length > 0 && (
              <div className="space-y-2">
                {formData.members.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                  >
                    <span>{member}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
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
