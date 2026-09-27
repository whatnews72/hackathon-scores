const Team = require('../models/Team');

const teams = new Map();
let teamIdCounter = 1;

class TeamService {
  static createTeam(name, members = []) {
    const id = teamIdCounter++;
    const team = new Team(id, name, members);
    teams.set(id, team);
    return team;
  }

  static getTeamById(id) {
    return teams.get(Number(id));
  }

  static getAllTeams() {
    return Array.from(teams.values());
  }

  static updateTeam(id, name, members) {
    const team = teams.get(Number(id));
    if (!team) return null;

    if (name !== undefined) team.name = name;
    if (members !== undefined) team.members = members;

    return team;
  }

  static deleteTeam(id) {
    return teams.delete(Number(id));
  }
}

module.exports = TeamService;
