const express = require('express')
const { register, login } = require('../database/auth')
const { authenticateToken, createJWT } = require('../middlewares/authToken')

const auth = express.Router()

auth.get('/login', authenticateToken, (req, res) => {
	res.json(req.user)
})

const actions = ['register', 'login']
actions.forEach(action => {
	auth.post((`/${action}`), async (req, res) => {
		const dbFunction = action === 'register' ? register : login
		const { status, ...rest } = await dbFunction(req.body).catch(error => error)
		if (status !== 200) return res.status(status).json(rest)
		const token = createJWT(rest)
		res.status(status).json({ JWT: token })
	})
})

module.exports = auth