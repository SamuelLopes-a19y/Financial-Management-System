const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/authMiddleware')
const financeController = require('../controllers/financeController')

router.get('/resumo', authMiddleware, financeController.resumo)

module.exports = router
