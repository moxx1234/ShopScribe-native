const { Product } = require('./init')

const getAllProducts = async (user) => {
	return await Product.findAll({
		where: {
			organizationId: user.organization
		},
		order: [
			['updatedAt', 'DESC']
		],
		attributes: ['id', 'name', 'category', 'units', 'price', 'quantity']
	})
		.then(products => {
			const result = products.map(product => product.dataValues)
			return { status: 200, products: result }
		})
		.catch(error => { throw { status: 500, message: 'Something went wrong' } })
}

const addProduct = async (productInfo) => {
	return await Product.create(productInfo)
		.then(product => ({ status: 200, id: product.id, message: 'Товар добавлен' }))
		.catch(error => {
			console.log(error)
			if (error.name === 'SequelizeUniqueConstraintError') {
				throw { status: 409, message: 'Такое название уже существует. Выберите другое', field: 'name' }
			}
			throw { status: 500, message: 'Something went wrong' }
		})
}

module.exports = { addProduct, getAllProducts }