const { User } = require('./init')

const register = async (userData) => {
	return await User.create(userData)
		.then(user => ({ status: 200, id: user.id, isAdmin: user.isAdmin, message: 'user created' }))
		.catch(error => {
			if (error.name === 'SequelizeUniqueConstraintError') {
				throw { status: 403, message: 'Пользователь уже существует. Пожалуйста войдите!', field: 'email' }
			}
			throw { status: 500, message: 'Something went wrong' }
		})
}

const login = async (userData) => {
	const { email, password } = userData
	const user = await User.findOne({
		where: {
			email
		}
	}).then(user => {
		if (!user.authenticate(password)) throw { status: 401, message: 'Неверный пароль! Попробуйте ещё раз!', field: 'password' }
		return { status: 200, id: user.id, isAdmin: user.isAdmin, message: 'user has logged in' }
	}).catch((error) => {
		if (error.status === 401) throw error
		throw { status: 401, message: 'Пользователя не существует. Пожалуйста, зарегестрируйтесь!', field: 'email' }
	})
	return user
}

module.exports = { register, login }