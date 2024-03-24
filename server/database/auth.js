const { User } = require('./init')

const register = async (userData) => {
	return await User.create(userData)
		.then(user => ({ status: 200, id: user.id, message: 'user created', isAdmin: user.isAdmin, permissions: user.permissions }))
		.catch(error => {
			if (error.name === 'SequelizeUniqueConstraintError') {
				throw { status: 403, message: 'Пользователь уже существует. Пожалуйста войдите!', field: 'login' }
			}
			throw { status: 500, message: 'Something went wrong' }
		})
}

const login = async (userData) => {
	const { login, password } = userData
	const user = await User.findOne({
		where: {
			login
		}
	}).then((user) => {
		if (!user.isValidPassword(password)) throw { status: 401, message: 'Неверный пароль! Попробуйте ещё раз!', field: 'password' }
		return { status: 200, id: user.id, isAdmin: user.isAdmin, permissions: user.isAdmin ? ['all'] : user.permissions, message: 'user has logged in' }
	}).catch((error) => {
		if (error.status === 401) throw error
		throw { status: 401, message: 'Пользователя не существует. Пожалуйста, зарегестрируйтесь!', field: 'login' }
	})
	return user
}

module.exports = { register, login }