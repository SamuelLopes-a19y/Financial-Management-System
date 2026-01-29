const express = require('express')
const router = express.Router()

const shoppingController = require('../controllers/shoppingController')
const authMiddleware = require('../middlewares/authMiddleware')

//router.VERBO('caminho', middleware, controller)
router.get('/getShopping', authMiddleware, shoppingController.getShopping)

module.exports = router