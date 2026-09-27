import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 팀 API
export const teamAPI = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
};

// 심사위원 API
export const judgeAPI = {
  getAll: () => api.get('/judges'),
  getById: (id) => api.get(`/judges/${id}`),
  create: (data) => api.post('/judges', data),
  update: (id, data) => api.put(`/judges/${id}`, data),
  delete: (id) => api.delete(`/judges/${id}`),
};

// 점수 API
export const scoreAPI = {
  getAll: () => api.get('/scores'),
  getById: (id) => api.get(`/scores/${id}`),
  getByTeam: (teamId) => api.get(`/scores/team/${teamId}`),
  getByJudge: (judgeId) => api.get(`/scores/judge/${judgeId}`),
  create: (data) => api.post('/scores', data),
  update: (id, data) => api.put(`/scores/${id}`, data),
  delete: (id) => api.delete(`/scores/${id}`),
};

// 결과 API
export const resultAPI = {
  getAll: () => api.get('/results'),
  getByTeam: (teamId) => api.get(`/results/team/${teamId}`),
  calculate: () => api.post('/results/calculate'),
};

export default api;
