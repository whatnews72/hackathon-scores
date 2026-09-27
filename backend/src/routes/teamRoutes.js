const express = require('express');
const router = express.Router();
const TeamService = require('../services/teamService');
const { validateTeam } = require('../utils/validation');

// 모든 팀 조회
router.get('/', (req, res) => {
  try {
    const teams = TeamService.getAllTeams();
    res.json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 팀 상세 조회
router.get('/:id', (req, res) => {
  try {
    const team = TeamService.getTeamById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, error: '팀을 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 팀 생성
router.post('/', (req, res) => {
  try {
    const { error, value } = validateTeam(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const team = TeamService.createTeam(value.name, value.members);
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 팀 수정
router.put('/:id', (req, res) => {
  try {
    const team = TeamService.updateTeam(req.params.id, req.body.name, req.body.members);
    if (!team) {
      return res.status(404).json({ success: false, error: '팀을 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 팀 삭제
router.delete('/:id', (req, res) => {
  try {
    const deleted = TeamService.deleteTeam(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: '팀을 찾을 수 없습니다.' });
    }
    res.json({ success: true, message: '팀이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
