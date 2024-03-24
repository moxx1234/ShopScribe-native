const express = require('express')
const { authenticateToken } = require('../middlewares/authToken')
const { createOrg, getUsers, createUser, updateUser, deleteUser, getSales } = require('../database/org')
const authenticateAdmin = require('../middlewares/authAdmin')
const checkOrganization = require('../middlewares/checkOrg')

const organization = express.Router()
organization.use(authenticateToken, authenticateAdmin)

organization.post('/create', async (req, res) => {
	const { status, ...rest } = await createOrg(req.body.organization.trim(), req.user.id).catch(error => error)
	res.status(status).json({ ...rest })
})

organization.get('/users', async (req, res) => {
	const { status, ...rest } = await getUsers(req.user.id).catch(error => error)
	res.status(status).json({ ...rest })
})

organization.post('/create-user', checkOrganization, async (req, res) => {
	const { status, ...rest } = await createUser(req.user.organization, req.body).catch(error => error)
	res.status(status).json({ ...rest })
})

organization.put('/update-user', checkOrganization, async (req, res) => {
	const { status, ...rest } = await updateUser(req.body).catch(error => error)
	res.status(status).json({ ...rest })
})

organization.delete('/delete-user', checkOrganization, async (req, res) => {
	const { status, ...rest } = await deleteUser(req.body.id).catch(error => error)
	res.status(status).json({ ...rest })
})

organization.get('/sales', checkOrganization, async (req, res) => {
	const { status, ...rest } = await getSales(req.user.organization).catch(error => error)
	res.status(status).json({ ...rest })
})

module.exports = organization