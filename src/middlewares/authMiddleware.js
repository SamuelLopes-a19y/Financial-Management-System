const jwt = require('jsonwebtoken');
require('dotenv').config(); // Garante que o .env foi lido

module.exports = (req, res, next) => {
  console.log('--- INICIO DEBUG MIDDLEWARE ---');

  const authHeader = req.headers.authorization;
  
  // Verificar se o header chegou
  if (!authHeader) {
    console.log('ERRO: Header Authorization não encontrado na requisição.');
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  console.log('Header recebido:', authHeader);

  // Tentar separar o "Bearer" do token
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    console.log('ERRO: Formato do header inválido. Esperado: "Bearer <token>"');
    return res.status(401).json({ erro: 'Erro no formato do token' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    console.log('ERRO: Token mal formatado (não começa com Bearer)');
    return res.status(401).json({ erro: 'Token mal formatado' });
  }

  // Verificar o Segredo e a Validade
  try {
    console.log('Tentando validar com JWT_SECRET:', process.env.JWT_SECRET); 
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não está definido no .env');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('SUCESSO: Token decodificado:', decoded);
    req.userId = decoded.id; // Ou decoded.userId (depende de como você gerou)
    
    console.log('--- FIM DEBUG MIDDLEWARE ---');
    return next();

  } catch (err) {
    console.log('ERRO FATAL NA VERIFICAÇÃO:', err.message);
    
    if (err.message === 'jwt expired') {
        return res.status(401).json({ erro: 'Sessão expirada. Faça login novamente.' });
    }
    
    return res.status(401).json({ erro: 'Token inválido' });
  }
};