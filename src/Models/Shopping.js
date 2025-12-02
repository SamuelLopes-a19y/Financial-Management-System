class Shopping {
    constructor(id, description, value, date, category) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.date = date;
        this.category = category;
    }

    // Add methods as needed
    getDetails() {
        return `${this.description} - R$ ${this.value} (${this.date})`;
    }
}

module.exports = Shopping;