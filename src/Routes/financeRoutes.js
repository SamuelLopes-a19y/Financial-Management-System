const express = require('express')
const router = express.Router()

const financeController = require('../controllers/financeController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/summary', authMiddleware, financeController.summary)

module.exports = router
