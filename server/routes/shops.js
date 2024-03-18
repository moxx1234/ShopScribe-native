const express = require('express')
const { authenticateToken } = require('../middlewares/authToken')
const { addShop, getAllShops } = require('../database/shops')
const checkOrganization = require('../middlewares/checkOrg')

const shops = express.Router()
shops.use(authenticateToken)
shops.use(checkOrganization)

shops.get('/all', async (req, res) => {
	const { status, ...rest } = await getAllShops(req.user).catch(error => error)
	res.status(status).json(rest)
})

shops.post('/add', async (req, res) => {
	const { status, ...rest } = await addShop({ ...req.body, organizationId: req.user.organization }).catch(error => error)
	res.status(status).json(rest)
})

module.exports = shops