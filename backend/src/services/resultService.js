const Result = require('../models/Result');
const ScoreService = require('./scoreService');

const results = new Map();

class ResultService {
  // 팀의 총점 계산 (산술평균)
  static calculateTeamScore(teamId) {
    const teamScores = ScoreService.getScoresByTeam(teamId);
    if (teamScores.length === 0) return 0;

    const sum = teamScores.reduce((acc, score) => acc + score.score, 0);
    return sum / teamScores.length;
  }

  // 최종 결과 계산 및 순위 결정
  static calculateAllResults(teams) {
    const resultsList = [];

    teams.forEach(team => {
      const totalScore = this.calculateTeamScore(team.id);
      resultsList.push({
        teamId: team.id,
        totalScore: totalScore,
      });
    });

    // 점수 기준으로 정렬 (내림차순)
    resultsList.sort((a, b) => b.totalScore - a.totalScore);

    // 순위 할당
    let currentRank = 1;
    resultsList.forEach((result, index) => {
      if (index > 0 && result.totalScore < resultsList[index - 1].totalScore) {
        currentRank = index + 1;
      }
      result.rank = currentRank;

      const finalResult = new Result(
        result.teamId,
        result.totalScore,
        result.rank
      );
      results.set(result.teamId, finalResult);
    });

    return Array.from(results.values()).sort((a, b) => a.rank - b.rank);
  }

  static getResultByTeamId(teamId) {
    return results.get(Number(teamId));
  }

  static getAllResults() {
    return Array.from(results.values()).sort((a, b) => a.rank - b.rank);
  }

  static clearResults() {
    results.clear();
  }
}

module.exports = ResultService;
