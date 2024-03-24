const express = require('express')
const { authenticateToken } = require('../middlewares/authToken')
const { addProduct, getAllProducts, updateProduct } = require('../database/products')
const checkOrganization = require('../middlewares/checkOrg')

const products = express.Router()
products.use(authenticateToken)
products.use(checkOrganization)

products.get('/all', async (req, res) => {
	const { status, ...rest } = await getAllProducts(req.user).catch(error => error)
	res.status(status).json(rest)
})

products.post('/add', async (req, res) => {
	const { status, ...rest } = await addProduct({ ...req.body, organizationId: req.user.organization }).catch(error => error)
	res.status(status).json(rest)
})

products.put('/update', async (req, res) => {
	const { status, ...rest } = await updateProduct(req.body).catch(error => error)
	res.status(status).json(rest)
})

module.exports = products