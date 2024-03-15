const { Op, where } = require('sequelize')
const { sequelize, ProductSale, Product, ShopSale, Shop } = require('./init')

const getSales = async (shopId) => {
	const sales = await ShopSale.findAll({
		where: {
			shopId: shopId || { [Op.not]: null }
		},
		attributes: {
			exclude: ['shopId', 'updatedAt']
		},
		order: [
			['createdAt', 'DESC']
		],
		include: [{
			model: Shop,
			attributes: ['name'],
			required: true
		}, {
			model: ProductSale,
			attributes: ['productQty'],
			include: [{
				model: Product,
				attributes: ['name', 'price'],
				required: true
			}]
		}]
	}).then(response => response.map(sale => {
		const result = sale.dataValues
		result.shop = result.shop.dataValues.name
		result.product_sales = result.product_sales.map(productSale => {
			const sale = productSale.dataValues
			sale.product = sale.product.dataValues
			sale.total = sale.productQty * sale.product.price
			return sale
		})
		return result
	}))
	return { status: 200, sales }
}

const createSale = async (saleInfo, user) => {
	console.log(user)
	const [shopId, dealInfo] = Object.entries(saleInfo)[0]
	const { products, debt, total } = dealInfo

	try {
		const productsFromTable = await Product.findAll({
			where: {
				id: {
					[Op.or]: products.map(product => product.id)
				}
			}
		}).then(response => response.map((product) => product.dataValues))

		productsFromTable.forEach(product => {
			const productLeft = product.quantity - products.find(item => item.id === product.id).quantity
			product.quantity = productLeft
			product.updatedAt = new Date()
		})

		await sequelize.transaction(async (transaction) => {
			const saleObj = await ShopSale.create({ shopId, total, userId: user.id, debt }, { transaction })
				.then(response => response.dataValues)
			const productSales = products.map(product => {
				const { id, quantity, price, ...rest } = product

				return {
					productId: id,
					productQty: quantity,
					salePrice: price,
					shopSaleId: saleObj.id,
					...rest
				}
			})
			await ProductSale.bulkCreate(productSales, { transaction })
			await Product.bulkCreate(productsFromTable, {
				updateOnDuplicate: ['quantity', 'updatedAt'],
				transaction
			})
			if (debt === 0) return
			await Shop.update({ 'debt': sequelize.literal(`debt + ${debt}`) }, { where: { id: shopId }, transaction })
		})

		return { status: 200, message: 'Продажа успешно создана' }
	}
	catch (error) {
		console.log(error)
		throw { status: 500, message: 'Something went wrong' }
	}

}

module.exports = { createSale, getSales }