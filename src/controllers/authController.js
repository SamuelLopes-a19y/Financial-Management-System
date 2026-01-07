const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        wallet: true,
        invoices: true,
      },
    })

    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' })
    }

   
    const passwordMatch =
      user.password === password ||
      (await bcrypt.compare(password, user.password))

    if (!passwordMatch) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' })
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      wallet: user.wallet,
      invoices: user.invoices,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao realizar login' })
  }
}

module.exports = {
  login,
}
