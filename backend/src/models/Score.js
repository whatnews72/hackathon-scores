class Score {
  constructor(id, teamId, judgeId, score, comment = '', createdAt = new Date()) {
    this.id = id;
    this.teamId = teamId;
    this.judgeId = judgeId;
    this.score = score;
    this.comment = comment;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      teamId: this.teamId,
      judgeId: this.judgeId,
      score: this.score,
      comment: this.comment,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Score;
