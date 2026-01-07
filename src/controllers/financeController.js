const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.resumo = async (req, res) => {
  const receitas = await prisma.transaction.aggregate({
    where: { type: 'RECEITA' },
    _sum: { value: true }
  });

  const despesas = await prisma.transaction.aggregate({
    where: { type: 'DESPESA' },
    _sum: { value: true }
  });

  res.json({
    receitas: receitas._sum.value || 0,
    despesas: despesas._sum.value || 0
  });
};
