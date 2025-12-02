const { authenticatable } = require("./Behaviors")

class User {

    constructor(id, name, email, password) {
        this.id = id
        this.name = name
        this.email = email
        this.password = password
        Object.assign(this, authenticatable)
    }



}