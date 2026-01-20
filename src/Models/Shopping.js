class Shopping {
    constructor(id, userId, category,description, value, date) {
        this.id = id;
        this.userId = userId;
        this.category = category;
        this.description = description;
        this.value = value;
        this.date = date;
    }

    getDetails() {
        return `${this.description} - R$ ${this.value} (${this.date})`;
    }
}

module.exports = Shopping;