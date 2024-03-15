const express = require('express')
const { authenticateToken } = require('../middlewares/authToken')
const { createOrg, getUsers, createUser } = require('../database/org')
const authenticateAdmin = require('../middlewares/authAdmin')

const organization = express.Router()
organization.use(authenticateToken, authenticateAdmin)

organization.post('/create', async (req, res) => {
	const { status, ...rest } = await createOrg(req.body.organization.trim(), req.user.id).catch(error => error)
	res.status(status).json({ ...rest })
})

organization.get('/users', async (req, res) => {
	const { status, ...rest } = await getUsers(req.user.id)
	res.status(status).json({ ...rest })
})

organization.post('/create-user', async (req, res) => {
	console.log(req.body, req.user)
	createUser(req.user.id, req.body)
	res.json({ message: 'hello' })
})

module.exports = organization