const jwt = require('jsonwebtoken')
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if (!token) return res.status(401).json({ message: 'no token' })
	jwt.verify(token, ACCESS_TOKEN, (err, user) => {
		if (err) return res.sendStatus(403).json({ message: 'invalid token' })
		req.user = user
		next()
	})
}
const createJWT = (userData) => {
	const { email, isAdmin } = userData
	return jwt.sign(({ email, isAdmin }), ACCESS_TOKEN)
}

module.exports = { authenticateToken, createJWT }