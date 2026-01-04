// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando o seed do banco de dados...')

  await prisma.wallet.deleteMany()
  await prisma.user.deleteMany()
  console.log('Banco limpo.')

  const passwordHash = await bcrypt.hash('123456', 10)

  // ADMIN
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador Chefe',
      email: 'admin@sistema.com',
      password: passwordHash,
      role: 'ADMIN',
      wallet: {
        create: {
          balance: 10000,
        },
      },
    },
  })

  console.log(`👤 Admin criado: ${admin.email}`)

  const usersData = [
    { name: 'Alice Silva', email: 'alice@gmail.com' },
    { name: 'Bob Santos', email: 'bob@hotmail.com' },
    { name: 'Carlos Oliveira', email: 'carlos@yahoo.com' },
    { name: 'Diana Prince', email: 'diana@themyscira.com' },
  ]

  // USERS
  for (const u of usersData) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: passwordHash,
        role: 'USER',
        wallet: {
          create: {
            balance: 0,
          },
        },
      },
    })

    console.log(`👤 User criado: ${user.email}`)
  }

  if (!prisma.user.findMany()) {
    throw new Error('Erro: A tabela de usuários não foi criada corretamente.')
  }

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
