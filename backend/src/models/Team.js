class Team {
  constructor(id, name, members = [], createdAt = new Date()) {
    this.id = id;
    this.name = name;
    this.members = members;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      members: this.members,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Team;
