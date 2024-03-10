import Config from 'react-native-config'
import { getToken } from './auth'

const BACK_URL = Config.REACT_APP_DEV_BACKEND_URL
const headers = { 'Content-Type': 'application/json' }

const setHeaders = async () => {
	headers['Authorization'] = `Bearer ${await getToken() || ''}`
}

export const createOrg = async (organization) => {
	await setHeaders()
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
	await setHeaders()
	return await fetch(`${BACK_URL}/org/users`, { headers })
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			if (response.status === 204) return {}
			return response.json()
		})
		.catch(error => { throw error })
}

export const createUser = async (userData) => {
	await setHeaders()
	return await fetch(`${BACK_URL}/org/create-user`, {
		method: 'POST',
		headers,
		body: JSON.stringify(userData)
	})
		.then(response => {
			console.log(response)
		})
		.catch(error => console.log(error))
}