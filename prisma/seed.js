const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.wallet.deleteMany()
  await prisma.user.deleteMany()

 // Testes de criação de usuário com relacionamentos
 const user = await prisma.user.create({
    data: {
      name: 'Samuel Silva',
      email: 'samuel.silva@exemplo.com',
      password: '123', 
      cpf: '123.456.789-00',           
      telefone: '(11) 99999-8888',     
      role: 'ADMIN',                   // Enum: 'USER' ou 'ADMIN'

      //Relacionamento 1 para 1: Carteira 
      wallet: {
        create: {
          balance: 5000.50 
        }
      },

      // Relacionamento 1 para N: Compras 
      shoppings: {
        create: [
          {
            description: 'Teclado Mecânico',
            value: 250.00,
            date: new Date() 
          },
          {
            category: 'Trabalho',
            description: 'Monitor Gamer',
            value: 1200.99,
            date: new Date('2023-12-25')
          }
        ]
      },

      // Relacionamento 1 para N: Faturas
      invoices: {
        create: [
          {
            description: 'Cartão de Crédito Nubank',
            amount: 850.75,
            dueDate: new Date('2024-02-10'), 
            status: 'PENDING' // Enum: 'PENDING', 'PAID' ou 'OVERDUE'
          }
        ]
      }
    },
    include: {
      wallet: true,
      shoppings: true,
      invoices: true
    }
  })

  // console.dir com depth: null mostra todos os objetos aninhados sem cortar
  console.dir(user, { depth: null })
}
main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
