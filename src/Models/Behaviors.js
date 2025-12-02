const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// --> 1 - Autentication
const authenticatable = { 

    emailValidation() {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(this.email)
    },

    async authentication(emailInput, passwordInput) {

    // Looking for user email in BD  
    const dbUser = await prisma.user.findUnique({ 
        where: { email: emailInput } 
    })

    if (!dbUser) 
        console.log("User not be found!.")

    // Validate password: Verify there's this pass in DB
    const matchPassword = await bcrypt.compare(passwordInput, dbUser.password)

    if (!matchPassword) 
        console.log("Incorrect password.")
    
    return dbUser

    }

}
 
// --> 2 - Moderator
const moderable = {

    async addUser(name, email, password){
        //Verify there's already an email
        const userExist = await prisma.user.findUnique({ where: email })

        if(userExist)
            console.log("This email has already been registeresd")

        // Encrypting password in the database
        passwordHash = await bcrypt.hash(password, 10)

        try{
            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: passwordHash // Save hash, not password directly
                }
            })
            console.log(`User ${newUser.name} with ID ${newUser.id} has been created successfully!`)

        }catch (error) {
            console.error("Error creating user:", error);
            return false;
        }
        
    },

    async deleteUser(id){
        // Check if the user exists
        const userExist = await prisma.user.findUnique({ where: id })

        if(!userExist)
            console.log("This user ID does not exist")

        try {
            const deletedUser = await prisma.user.delete({ where: id })

            console.log(`User ${deletedUser.name} - ID ${deletedUser.id} has been deleted successfully!`)

        } catch (error) {
            // The error code P2025 means "Record not found"
            if (error.code === 'P2025') {
                console.log("Error: This user does not exist, impossible to delete.")
            }
        }
    },

    async editUser(id){
        // Check if the user exists
        const userExist = await prisma.user.findUnique({ where: id })

        if(!userExist)
            console.log("This user ID does not exist")

         try {
            const editedUser = await prisma.user.update({ 
                 data: {
                    name:  this.name,
                    email: this.email,
                    cel:   this.cel
                }
             })

            console.log(`User ${editedUser.name} - ID ${editedUser.id} has been edited successfully!`)

            return editedUser

        } catch (error) {
            // The error code P2025 means "Record not found"
            if (error.code === 'P2025') {
                console.log("Error: This user does not exist, impossible to edit.")
            }
        }
    }

}

// --> 3 - Reports
const reportable = {
    async userReport(){
        const userList = await prisma.user.findMany()
    
        if(userList == null)
            console.log("There's no users registered")


    }

}

module.exports = { authenticatable, reportable, moderable };