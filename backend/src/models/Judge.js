class Judge {
  constructor(id, name, category = '', createdAt = new Date()) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      createdAt: this.createdAt,
    };
  }
}

module.exports = Judge;
