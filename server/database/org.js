const { Organization, sequelize, User, ShopSale, Shop, ProductSale, Product } = require("./init")

const createOrg = async (organization, userId) => {
	try {
		const result = await sequelize.transaction(async (t) => {
			const org = await Organization.create({ name: organization }, { transaction: t })
			await User.update({ organizationId: org.id }, {
				where: {
					id: userId
				},
				transaction: t
			})
			return { status: 200, id: org.id, message: 'Организация успешно создана' }
		})
		return result
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			throw { status: 409, message: 'Такое название уже существует. Выберите другое', field: 'organization' }
		}
		throw { status: 500, message: 'Something went wrong' }
	}
}

const getUsers = async (userId) => {
	try {
		const result = await sequelize.transaction(async (t) => {
			const organization = await Organization.findOne({ userId, attributes: ['id', 'name'], transaction: t })
				.then(record => record?.dataValues)
			if (!organization) return { status: 204 }
			const users = await User.findAll({
				where: { organizationId: organization.id },
				attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
				transaction: t
			})
			return { status: 200, [organization.name]: users }
		})
		return result
	} catch (error) {
		throw { status: 500, message: 'Something went wrong' }
	}
}

const createUser = async (organizationId, userData) => {
	try {
		await User.create({ ...userData, organizationId })
		return { status: 200, message: 'Работник успешно добавлен!' }
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			throw { status: 403, message: 'Логин занят! Выберите другой', field: 'login' }
		}
		throw { status: 500, message: 'Something went wrong' }
	}
}

const updateUser = async (userData) => {
	const { id, ...rest } = userData
	try {
		await User.findOne({ where: { id } })
			.then(user => {
				if (!user) throw { status: 404, message: 'Пользователя не существует!' }
				Object.entries(rest).forEach(([key, value]) => {
					user[key] = value
				})
				user.save()
			})
		return { status: 200, message: 'Информация о работнике обновлена!' }
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			throw { status: 403, message: 'Логин занят! Выберите другой', field: 'login' }
		}
		throw { status: 500, message: 'Something went wrong' }
	}
}

const deleteUser = async (id) => {
	try {
		await User.destroy({ where: { id } })
		return { status: 200, message: 'Пользователь удален' }
	} catch (error) {
		throw { status: 500, message: 'Something went wrong' }
	}
}

const getSales = async (organization) => {
	try {
		const sales = await ShopSale.findAll({
			where: {
				organizationId: organization
			},
			include: [
				{
					model: Shop,
					attributes: ['name']
				},
				{
					model: ProductSale,
					attributes: ['salePrice', 'productQty'],
					include: [
						{
							model: Product,
							attributes: ['name']
						}
					]
				},
				{
					model: User,
					attributes: ['name', 'surname']
				}
			]
		})
		if (!sales.length) return { status: 204 }
		return { status: 200, sales }
	} catch (error) {
		throw { status: 500, message: 'Something went wrong' }
	}
}

module.exports = { createOrg, getUsers, createUser, updateUser, deleteUser, getSales }