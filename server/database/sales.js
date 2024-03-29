const { Op } = require('sequelize')
const { sequelize, ProductSale, Product, ShopSale, Shop, Organization, User } = require('./init')

const getSales = async (shopId, user) => {
	const applyCondition = () => {
		const condition = { shopId }
		if (user.isAdmin) condition.organizationId = user.organization
		else condition.userId = user.id
		return condition
	}
	const sales = await ShopSale.findAll({
		where: applyCondition(),
		order: [
			['createdAt', 'DESC']
		],
		include: [
			{
				model: Shop,
				attributes: ['name', ['debt', 'totalDebt']],
				required: true
			},
			{
				model: ProductSale,
				attributes: ['productQty', 'salePrice'],
				include: [{
					model: Product,
					attributes: ['name'],
					required: true
				}]
			},
			{
				model: User,
				attributes: ['surname', 'name'],
			},
			{
				model: Organization,
				attributes: ['name'],
				required: true
			},
		]
	}).then(response => response.map(sale => {
		const result = sale.dataValues
		result.shop = result.shop.dataValues
		result.product_sales = result.product_sales.map(productSale => {
			const sale = productSale.dataValues
			sale.product = sale.product.dataValues
			sale.total = sale.productQty * sale.salePrice
			return sale
		})
		return result
	}))
		.catch(error => {
			console.log(error)
		})
	return { status: 200, sales }
}

const createSale = async (saleInfo, user) => {
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
			const saleObj = await ShopSale.create({ shopId, total, userId: user.id, debt, organizationId: user.organization }, { transaction })
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
		})

		return { status: 200, message: 'Продажа успешно создана' }
	}
	catch (error) {
		console.log(error)
		throw { status: 500, message: 'Something went wrong' }
	}
}

const payDebt = async (debtInfo) => {
	const { id, amount, shopId } = debtInfo
	try {
		await sequelize.transaction(async (transaction) => {
			const saleUpdate = ShopSale.update({ debt: 0 }, { where: { id }, transaction })
			const shopUpdate = Shop.update({ 'debt': sequelize.literal(`debt - ${amount}`) }, { where: { id: shopId }, transaction })

			await Promise.all([saleUpdate, shopUpdate]).then(result => console.log(result))
		})
		return { status: 200, message: 'Долг погашен!' }
	} catch (error) {
		console.log(error)
		throw { status: 500, message: 'Something went wrong' }
	}
}

module.exports = { createSale, getSales, payDebt }