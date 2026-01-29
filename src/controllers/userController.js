const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getUser = async (req, res) => {
  try {
    const userId = Number(req.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'ID do usuário inválido no token' });
    }

    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { name: true, email: true, cpf: true, telefone: true }
    })

    if(!user){
      return res.status(404).json({ message: 'Usuário não encontrado!'})
    }
    
    res.status(200).json({
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    telefone: user.telefone
    })

  }catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
}

const updateUser = async (req, res) => {
  const userId = req.params.id
  const { name, email, cpf, telefone } = req.body

  try {
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: { name, email, cpf, telefone },
    })

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message })
  }
}
