const authenticateAdmin = (req, res, next) => {
	if (!req.user.isAdmin) return res.status(403).json({ message: 'Отказано в доступе!' })
	next()
}

module.exports = authenticateAdmin