const express = require('express')
const { authenticateToken } = require('../middlewares/authToken')
const { addProduct, getAllProducts } = require('../database/products')

const products = express.Router()

products.get('/all', async (req, res) => {
	const { status, ...rest } = await getAllProducts()
		.catch(error => error)
	res.status(status).json(rest)
})

products.post('/add', authenticateToken, async (req, res) => {
	const { status, ...rest } = await addProduct(req.body).catch(error => error)
	res.status(status).json(rest)
})

module.exports = products