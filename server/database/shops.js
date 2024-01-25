const { Shop } = require('./init')

const getAllShops = async () => {
	return await Shop.findAll({
		order: [
			['updatedAt', 'DESC']
		],
		attributes: ['id', 'name', 'owner', 'phone', 'address', 'remark']
	})
		.then(shops => {
			const result = shops.map(shop => shop.dataValues)
			return { status: 200, shops: result }
		})
		.catch(error => { throw { status: 500, message: 'Something went wrong' } })
}

const addShop = async (shopInfo) => {
	return await Shop.create(shopInfo)
		.then(market => ({ status: 200, id: market.id, message: 'магазин добавлен' }))
		.catch(error => {
			console.log(error)
			if (error.name === 'SequelizeUniqueConstraintError') {
				throw { status: 403, message: 'Такое название уже существует. Выберите другое', field: 'name' }
			}
			throw { status: 500, message: 'Something went wrong' }
		})
}

module.exports = { getAllShops, addShop }