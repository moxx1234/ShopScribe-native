const { User } = require("../database/init")

const checkOrganization = async (req, res, next) => {
	const { dataValues: { organizationId } } = await User.findOne({
		where: {
			id: req.user.id
		},
		attributes: ['organizationId']
	})
	if (organizationId === null) return res.status(403).json({ message: 'Вы НЕ привязаны к организации' })
	req.user = { ...req.user, organization: organizationId }
	next()
}

module.exports = checkOrganization