const express = require('express');
const router = express.Router();
const ResultService = require('../services/resultService');
const TeamService = require('../services/teamService');

// 모든 결과 조회 (순위 포함)
router.get('/', (req, res) => {
  try {
    const results = ResultService.getAllResults();
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 팀별 결과 조회
router.get('/team/:teamId', (req, res) => {
  try {
    const result = ResultService.getResultByTeamId(req.params.teamId);
    if (!result) {
      return res.status(404).json({ success: false, error: '결과를 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 최종 결과 계산 및 순위 결정
router.post('/calculate', (req, res) => {
  try {
    const teams = TeamService.getAllTeams();
    const results = ResultService.calculateAllResults(teams);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
