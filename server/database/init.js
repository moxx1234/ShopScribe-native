const { Sequelize, DataTypes } = require('sequelize')
const useBcrypt = require('sequelize-bcrypt')

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
})

Organization.hasMany(User)
User.hasMany(ShopSale)
ShopSale.belongsTo(User)
Shop.hasMany(ShopSale)
ShopSale.belongsTo(Shop)
ShopSale.hasMany(ProductSale)
ProductSale.belongsTo(ShopSale)
ProductSale.belongsTo(Product)
Product.hasMany(ProductSale)

sequelize.sync({ alter: true }).then(() => {
	console.log('tables had been synchronised')
}).catch((err) => console.log('table sync error', err))

useBcrypt(User, {
	field: 'password',
	rounds: 12,
	compare: 'authenticate'
})

module.exports = { sequelize, User, Shop, Product, ProductSale, ShopSale, Organization }