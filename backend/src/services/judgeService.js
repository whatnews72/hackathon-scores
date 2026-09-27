const Judge = require('../models/Judge');

const judges = new Map();
let judgeIdCounter = 1;

class JudgeService {
  static createJudge(name, category = '') {
    const id = judgeIdCounter++;
    const judge = new Judge(id, name, category);
    judges.set(id, judge);
    return judge;
  }

  static getJudgeById(id) {
    return judges.get(Number(id));
  }

  static getAllJudges() {
    return Array.from(judges.values());
  }

  static updateJudge(id, name, category) {
    const judge = judges.get(Number(id));
    if (!judge) return null;

    if (name !== undefined) judge.name = name;
    if (category !== undefined) judge.category = category;

    return judge;
  }

  static deleteJudge(id) {
    return judges.delete(Number(id));
  }
}

module.exports = JudgeService;
