const { Op } = require('sequelize')
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

const createSale = async (dealInfo) => {
	const [shopId, products] = Object.entries(dealInfo)[0]
	const total = products.reduce((result, product) => {
		return result += product.total
	}, 0)

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
			const saleObj = await ShopSale.create({ shopId, total }, { transaction })
				.then(response => response.dataValues)
			const productSales = products.map(product => {
				const { id, quantity, ...rest } = product
				const shopSaleId = saleObj.id,
					productId = id,
					productQty = quantity
				return { productId, productQty, shopSaleId, ...rest }
			})
			await ProductSale.bulkCreate(productSales, { transaction })
			await Product.bulkCreate(productsFromTable, {
				updateOnDuplicate: ['quantity', 'updatedAt'],
				transaction
			})
		})

		return { status: 200, message: 'Продажа успешно создана' }
	}
	catch (error) {
		console.log(error)
		throw { status: 500, message: 'Something went wrong' }
	}

}

module.exports = { createSale, getSales }