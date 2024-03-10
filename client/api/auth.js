import Config from 'react-native-config'
import EncryptedStorage from 'react-native-encrypted-storage'

const BACK_URL = Config.REACT_APP_DEV_BACKEND_URL
const headers = { 'Content-Type': 'application/json' }

export const authenticateUser = async (action, userData) => {
	const URL = `${BACK_URL}/auth/${action}`
	const body = JSON.stringify({
		login: userData.login.trim(),
		password: userData.password.trim()
	})
	return await fetch(URL, {
		method: 'POST',
		headers,
		body
	})
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			return response.json()
		})
		.catch(error => { throw error })
}

export const getToken = async () => {
	return await EncryptedStorage.getItem('token')
		.catch(() => {
			alert('Something went wrong while authorization!')
			return null
		})
}
export const authorizeUser = async () => {
	const token = await getToken() || ''
	const URL = `${BACK_URL}/auth/login`
	return await fetch(URL, {
		method: 'GET',
		headers: { ...headers, 'Authorization': 'Bearer ' + token }
	})
		.then(async (response) => {
			if (!response.ok) { throw await response.json() }
			return response.json()
		})
		.catch(error => {
			throw error
		})
}
export const authorizeAdmin = async () => {
	return await authorizeUser()
		.then(response => {
			if (!response.isAdmin) {
				throw { message: 'Unauthorized attempt to secured resource!' }
			}
			return { isAdmin: response.isAdmin }
		})
		.catch(error => error.message || error)
}
export const endUserSession = () => {
	EncryptedStorage.removeItem('token')
}