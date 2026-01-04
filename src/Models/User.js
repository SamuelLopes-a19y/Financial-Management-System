const { Role } = require('@prisma/client')

class User {

    constructor(id, name, email, password, role) {
        this.id = id
        this.role = role    
        this.name = name
        this.email = email
        this.password = password
        Object.assign(this, authenticatable)

        if (!Object.values(Role).includes(this.role)) {
             throw new Error("Role inválido!")
        }

        Object.assign(this, authenticatable)
    }

    isAdmin() {
        return this.role === Role.ADMIN
    }

}