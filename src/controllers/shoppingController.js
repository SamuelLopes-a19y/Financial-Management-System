const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getShopping = async (req, res) => {
    try {
        const userId = parseInt(req.userId);

        console.log("Buscando compras para o User ID:", userId);

        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: "ID do usuário inválido." });
        }

        const shoppingItems = await prisma.shopping.findMany({
            where: { 
                userId: userId 
            },

            select: {
                description: true,
                store: true,
                date: true,
                category: true,
                value: true,
                id: true 
            },
            orderBy: {
                date: 'desc' // Ordena do mais recente para o mais antigo
            }
        });

        res.json({ shopping: shoppingItems });

    } catch (error) {
        console.error("Erro ao buscar compras:", error);
        res.status(500).json({ error: "Error loading financial summary" });
    }
};