import Config from 'react-native-config'
import { setHeaders } from './helpers/headers'

const BACK_URL = Config.REACT_APP_DEV_BACKEND_URL
export const createOrg = async (organization) => {
	const headers = await setHeaders()
	return await fetch(`${BACK_URL}/org/create`, {
		method: 'POST',
		headers,
		body: JSON.stringify(organization)
	})
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			return response.json()
		})
		.catch(error => { throw error })
}

export const getOrgUsers = async () => {
	const headers = await setHeaders()
	return await fetch(`${BACK_URL}/org/users`, { headers })
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			if (response.status === 204) return {}
			return response.json()
		})
		.catch(error => { throw error })
}

export const createUser = async (userData) => {
	const headers = await setHeaders()
	return await fetch(`${BACK_URL}/org/create-user`, {
		method: 'POST',
		headers,
		body: JSON.stringify(userData)
	})
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			return response.json()
		})
		.catch(error => { throw error })
}

export const updateUser = async (userId, userData) => {
	const headers = await setHeaders()
	return await fetch(`${BACK_URL}/org/update-user`, {
		method: 'PUT',
		headers,
		body: JSON.stringify({ ...userData, id: userId })
	})
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			return response.json()
		})
		.catch(error => { throw error })
}