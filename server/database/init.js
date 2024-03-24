const { Sequelize, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: 'mysql'
})

const Organization = sequelize.define('organization', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
		unique: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
})

const User = sequelize.define('user', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
		unique: true
	},
	login: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	name: {
		type: DataTypes.STRING,
	},
	surname: {
		type: DataTypes.STRING,
	},
	phone: {
		type: DataTypes.STRING,
	},
	isAdmin: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false
	},
	permissions: {
		type: DataTypes.STRING,
		get() {
			return this.getDataValue('permissions')?.split(';') || null
		},
		set(val) {
			this.setDataValue('permissions', val?.join(';')) || null
		}
	},
}, {
	hooks: {
		beforeCreate: async (user) => {
			const salt = await bcrypt.genSalt()
			user.password = await bcrypt.hash(user.password, salt)
		},
		beforeUpdate: async (user) => {
			if (user.changed('password')) {
				const salt = await bcrypt.genSalt()
				user.password = await bcrypt.hash(user.password, salt)
			}
		}
	}
})

const Shop = sequelize.define('shop', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
		unique: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	owner: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	phone: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	address: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	remark: {
		type: DataTypes.TEXT,
	},
	debt: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
})

const Product = sequelize.define('product', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
		unique: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	category: {
		type: DataTypes.STRING,
		allowNull: false
	},
	units: {
		type: DataTypes.STRING,
		allowNull: false
	},
	price: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
})

const ShopSale = sequelize.define('shop_sale', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
		unique: true
	},
	total: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	debt: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	}
})

const ProductSale = sequelize.define('product_sale', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
		unique: true
	},
	productQty: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	salePrice: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
})

// Models relations
Organization.hasMany(User)
User.belongsTo(Organization)
Organization.hasMany(Shop)
Organization.hasMany(Product)
Organization.hasMany(ShopSale)
ShopSale.belongsTo(Organization)
User.hasMany(ShopSale)
ShopSale.belongsTo(User)
Shop.hasMany(ShopSale)
Shop.belongsTo(Organization)
ShopSale.belongsTo(Shop)
ShopSale.hasMany(ProductSale)
ProductSale.belongsTo(ShopSale)
ProductSale.belongsTo(Product)
Product.hasMany(ProductSale)
Product.belongsTo(Organization)

User.prototype.isValidPassword = function (password) {
	return bcrypt.compareSync(password, this.password)
}

// Hooks
const updateShopDebt = async (shopSale, options) => {
	const { dataValues } = await ShopSale.findOne({
		attributes: [[sequelize.fn('sum', sequelize.col('debt')), 'debt']],
		where: { shopId: shopSale.shopId },
		transaction: options.transaction
	})

	await Shop.update(
		{ debt: dataValues.debt || shopSale.debt || 0 },
		{ where: { id: shopSale.shopId }, transaction: options.transaction },
	)
}

ShopSale.addHook('afterCreate', 'updateShopDebt', updateShopDebt)
ShopSale.addHook('afterUpdate', 'updateShopDebt', updateShopDebt)
ShopSale.addHook('afterDestroy', 'updateShopDebt', updateShopDebt)

sequelize.sync({ force: true }).then(() => {
	console.log('tables had been synchronised')
}).catch((err) => console.log('table sync error', err))

module.exports = { sequelize, User, Shop, Product, ProductSale, ShopSale, Organization }