const express = require('express')
const { createSale, getSales } = require('../database/sales')
const { authenticateToken } = require('../middlewares/authToken')
const checkOrganization = require('../middlewares/checkOrg')

const sales = express.Router()
sales.use(authenticateToken)
sales.use(checkOrganization)

sales.get('/', async (req, res) => {
	const { status, ...rest } = await getSales(req.query?.shopId, req.user).catch(error => error)
	res.status(status).json(rest)
})

sales.post('/create', async (req, res) => {
	const { status, ...rest } = await createSale(req.body, req.user).catch(error => error)
	res.status(status).json(rest)
})

module.exports = sales