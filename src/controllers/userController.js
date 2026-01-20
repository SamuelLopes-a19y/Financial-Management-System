const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const updateUser = async (req, res) => {
  const { id } = req.params
  const { name, email, cpf, telefone } = req.body

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, cpf, telefone },
    })

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message })
  }
}

module.exports = {
  updateUser,
}
