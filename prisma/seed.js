const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...')

  // 1. Limpeza: Deletar usuários (o Cascade deletará carteiras, faturas e compras automaticamente)
  await prisma.user.deleteMany()
  console.log('🧹 Banco de dados limpo.')

  // ====================================================================
  // USUÁRIO 1: SAMUEL (ADMIN) - Finanças Equilibradas
  // ====================================================================
  const samuel = await prisma.user.create({
    data: {
      name: 'Samuel Silva',
      email: 'samuel.silva@exemplo.com',
      password: '123', // Em produção, use hash (bcrypt)
      cpf: '123.456.789-00',
      telefone: '(11) 99999-8888',
      role: 'ADMIN',
      
      wallet: {
        create: { balance: 5000.50 }
      },
      shoppings: {
        create: [
          { description: 'Teclado Mecânico', category: 'Eletrônicos', value: 250.00, date: new Date() },
          { description: 'Monitor Gamer', category: 'Trabalho', value: 1200.99, date: new Date('2023-12-25') },
          { description: 'Almoço Executivo', category: 'Alimentação', value: 45.90, date: new Date() }
        ]
      },
      invoices: {
        create: [
          { description: 'Cartão Nubank', amount: 850.75, dueDate: new Date('2024-05-10'), status: 'PENDING' },
          { description: 'Conta de Luz', amount: 120.00, dueDate: new Date('2024-05-15'), status: 'PENDING' }
        ]
      }
    },
    include: { wallet: true, shoppings: true, invoices: true }
  })
  console.log(`✅ Usuário criado: ${samuel.name} (${samuel.role})`)

  // ====================================================================
  // USUÁRIO 2: MARIA (USER) - Endividada (Teste de Status OVERDUE)
  // ====================================================================
  const maria = await prisma.user.create({
    data: {
      name: 'Maria Souza',
      email: 'maria.souza@exemplo.com',
      password: '123',
      cpf: '987.654.321-11',
      role: 'USER', // Usuário padrão

      wallet: {
        create: { balance: 150.25 } // Saldo baixo
      },
      shoppings: {
        create: [
          { description: 'Supermercado Mensal', category: 'Casa', value: 600.00, date: new Date('2024-01-10') },
          { description: 'Farmácia', category: 'Saúde', value: 85.50, date: new Date('2024-01-15') }
        ]
      },
      invoices: {
        create: [
          // Fatura Vencida (OVERDUE)
          { description: 'Empréstimo Pessoal', amount: 1500.00, dueDate: new Date('2023-12-01'), status: 'OVERDUE' },
          // Fatura Paga (PAID)
          { description: 'Internet Fibra', amount: 100.00, dueDate: new Date('2024-01-05'), status: 'PAID' }
        ]
      }
    }
  })
  console.log(`✅ Usuário criado: ${maria.name} (${maria.role})`)

  // ====================================================================
  // USUÁRIO 3: CARLOS (USER) - Rico e Organizado (Teste de Status PAID)
  // ====================================================================
  const carlos = await prisma.user.create({
    data: {
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@exemplo.com',
      password: '123',
      role: 'USER',

      wallet: {
        create: { balance: 25000.00 } // Saldo alto
      },
      shoppings: {
        create: [
          { description: 'Macbook Pro', category: 'Trabalho', value: 12000.00, date: new Date('2024-02-01') },
          { description: 'Cadeira Herman Miller', category: 'Conforto', value: 8000.00, date: new Date('2024-02-02') },
          { description: 'Spotify Premium', category: 'Assinatura', value: 21.90, date: new Date() }
        ]
      },
      invoices: {
        create: [
          { description: 'Cartão Black', amount: 5000.00, dueDate: new Date('2024-01-10'), status: 'PAID' },
          { description: 'Seguro do Carro', amount: 3000.00, dueDate: new Date('2024-02-15'), status: 'PENDING' }
        ]
      }
    }
  })
  console.log(`✅ Usuário criado: ${carlos.name} (${carlos.role})`)

  console.log('🚀 Seed finalizado com sucesso!')
}

main()
  .catch(e => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })