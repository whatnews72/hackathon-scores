const express = require('express');
const router = express.Router();
const JudgeService = require('../services/judgeService');
const { validateJudge } = require('../utils/validation');

// 모든 심사위원 조회
router.get('/', (req, res) => {
  try {
    const judges = JudgeService.getAllJudges();
    res.json({ success: true, data: judges });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 심사위원 상세 조회
router.get('/:id', (req, res) => {
  try {
    const judge = JudgeService.getJudgeById(req.params.id);
    if (!judge) {
      return res.status(404).json({ success: false, error: '심사위원을 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: judge });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 심사위원 생성
router.post('/', (req, res) => {
  try {
    const { error, value } = validateJudge(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const judge = JudgeService.createJudge(value.name, value.category);
    res.status(201).json({ success: true, data: judge });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 심사위원 수정
router.put('/:id', (req, res) => {
  try {
    const judge = JudgeService.updateJudge(req.params.id, req.body.name, req.body.category);
    if (!judge) {
      return res.status(404).json({ success: false, error: '심사위원을 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: judge });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 심사위원 삭제
router.delete('/:id', (req, res) => {
  try {
    const deleted = JudgeService.deleteJudge(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: '심사위원을 찾을 수 없습니다.' });
    }
    res.json({ success: true, message: '심사위원이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
