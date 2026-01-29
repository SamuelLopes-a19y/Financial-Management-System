// authController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Essa linha garante que o .env foi lido

const prisma = new PrismaClient();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        wallet: true,
        invoices: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch =
      user.password === password ||
      (await bcrypt.compare(password, user.password));

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, // JWT_SECRET está no .env
      { expiresIn: '1d' } 
    );

    // Retorna os dados e o token
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      wallet: user.wallet,
      invoices: user.invoices,
      token: token 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging' });
  }
};

module.exports = {
  login,
};