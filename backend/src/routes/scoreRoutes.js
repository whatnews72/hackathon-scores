const express = require('express');
const router = express.Router();
const ScoreService = require('../services/scoreService');
const { validateScore } = require('../utils/validation');

// 모든 점수 조회
router.get('/', (req, res) => {
  try {
    const scores = ScoreService.getAllScores();
    res.json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 팀별 점수 조회
router.get('/team/:teamId', (req, res) => {
  try {
    const scores = ScoreService.getScoresByTeam(req.params.teamId);
    res.json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 심사위원별 점수 조회
router.get('/judge/:judgeId', (req, res) => {
  try {
    const scores = ScoreService.getScoresByJudge(req.params.judgeId);
    res.json({ success: true, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 특정 점수 조회
router.get('/:id', (req, res) => {
  try {
    const score = ScoreService.getScoreById(req.params.id);
    if (!score) {
      return res.status(404).json({ success: false, error: '점수를 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 점수 생성
router.post('/', (req, res) => {
  try {
    const { error, value } = validateScore(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const score = ScoreService.createScore(
      value.teamId,
      value.judgeId,
      value.score,
      value.comment
    );
    res.status(201).json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 점수 수정
router.put('/:id', (req, res) => {
  try {
    const score = ScoreService.updateScore(req.params.id, req.body.score, req.body.comment);
    if (!score) {
      return res.status(404).json({ success: false, error: '점수를 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 점수 삭제
router.delete('/:id', (req, res) => {
  try {
    const deleted = ScoreService.deleteScore(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: '점수를 찾을 수 없습니다.' });
    }
    res.json({ success: true, message: '점수가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
