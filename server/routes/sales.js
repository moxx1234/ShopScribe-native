const express = require('express')
const { createSale, getSales } = require('../database/sales')

const sales = express.Router()

sales.get('/', async (req, res) => {
	const { status, ...rest } = await getSales(req.query?.shopId).catch(error => error)

	res.status(status).json(rest)
})

sales.post('/create', async (req, res) => {
	const { status, ...rest } = await createSale(req.body).catch(error => error)
	res.status(status).json(rest)
})

module.exports = sales