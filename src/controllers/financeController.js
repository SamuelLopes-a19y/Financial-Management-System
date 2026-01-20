const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.summary = async (req, res) => {
  try {
    // Definido pelo middleware de autenticação
    const userId = req.userId; 

    // Definir datas para o "Gasto do Mês"
    const today = new Date();
    const beginningMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [wallet, monthExpenses, pendingInvoice, invoiceTotal, lastShopping] = await Promise.all([
      
      // Saldo da Carteira
      prisma.wallet.findUnique({
        where: { userId: userId }
      }),

      // Gastos do Mês 
      prisma.shopping.aggregate({
        _sum: { value: true },
        where: {
          userId: userId,
          date: {
            gte: beginningMonth,
            lte: endMonth
          }
        }
      }),

      // Faturas Pendentes
      prisma.invoice.aggregate({
        _sum: { amount: true },
        where: {
          userId: userId,
          status: 'PENDING'
        }
      }),

      // Assinaturas 
      prisma.invoice.count({
        where: { userId: userId }
      }),

      // Movimentações Recentes 
      prisma.shopping.findMany({
        where: { userId: userId },
        orderBy: { date: 'desc' },
        take: 5
      })
    ]);

    // Montamos o objeto para o Frontend
    res.json({
      balance: wallet ? Number(wallet.balance) : 0,
      expenses: monthExpenses._sum.value ? Number(monthExpenses._sum.value) : 0,
      pending: pendingInvoice._sum.amount ? Number(pendingInvoice._sum.amount) : 0,
      subscriptions: invoiceTotal, 
      transactions: lastShopping 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error loading financial summary" });
  }
  
};
