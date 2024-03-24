const { User } = require("../database/init")

const checkOrganization = async (req, res, next) => {
	const user = await User.findOne({
		where: {
			id: req.user.id
		},
		attributes: ['organizationId']
	})
	if (!user) return res.status(404).json({ message: 'Пользователь удален!' })
	if (!user.organizationId) return res.status(403).json({ message: 'Вы НЕ привязаны к организации' })
	req.user = { ...req.user, organization: user.organizationId }
	next()
}

module.exports = checkOrganization