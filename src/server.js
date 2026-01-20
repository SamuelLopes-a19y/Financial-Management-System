require('dotenv').config();

const express = require('express')
const path = require('path')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
//const invoiceRoutes = require('./routes/invoiceRoutes')
const financeRoutes = require('./routes/financeRoutes')

const app = express()

// MIDDLEWARES
app.use(express.json())

// Arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public'), { index: false }))

// ROTAS DA API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
//app.use('/api/invoices', invoiceRoutes)
app.use('/api/finance', financeRoutes) 

// ROTA INICIAL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

// START SERVER
app.listen(3000, () => {
  console.log(' http://localhost:3000')
})
