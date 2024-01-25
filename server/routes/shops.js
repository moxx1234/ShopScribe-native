const express = require('express')
const { authenticateToken } = require('../middlewares/authToken')
const { addShop, getAllShops } = require('../database/shops')

const shops = express.Router()

shops.get('/all', async (req, res) => {
	const { status, ...rest } = await getAllShops()
		.catch(error => error)
	res.status(status).json(rest)
})

shops.post('/add', authenticateToken, async (req, res) => {
	const { status, ...rest } = await addShop(req.body).catch(error => error)
	res.status(status).json(rest)
})

module.exports = shops