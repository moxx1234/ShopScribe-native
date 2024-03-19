const { Shop } = require('./init')

const getAllShops = async (user) => {
	return await Shop.findAll({
		where: {
			organizationId: user.organization
		},
		order: [
			['updatedAt', 'DESC']
		],
		attributes: {
			exclude: ['createdAt', 'updatedAt', 'organizationId']
		}
	})
		.then(shops => {
			const result = shops.map(shop => shop.dataValues).filter(shop => shop.organization !== null)
			return { status: 200, shops: result }
		})
		.catch(error => {
			console.log(error)
			throw { status: 500, message: 'Something went wrong' }
		})
}

const addShop = async (shopInfo) => {
	return await Shop.create(shopInfo)
		.then(market => ({ status: 200, id: market.id, message: 'магазин добавлен' }))
		.catch(error => {
			console.log(error)
			if (error.name === 'SequelizeUniqueConstraintError') {
				throw { status: 409, message: 'Такое название уже существует. Выберите другое', field: 'name' }
			}
			throw { status: 500, message: 'Something went wrong' }
		})
}

module.exports = { getAllShops, addShop }