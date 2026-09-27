class Result {
  constructor(teamId, totalScore = 0, rank = null, createdAt = new Date()) {
    this.teamId = teamId;
    this.totalScore = totalScore;
    this.rank = rank;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      teamId: this.teamId,
      totalScore: this.totalScore,
      rank: this.rank,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Result;
