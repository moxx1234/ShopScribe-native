import Config from 'react-native-config'
import { getToken } from './auth'

const BACK_URL = Config.REACT_APP_DEV_BACKEND_URL
const headers = { 'Content-Type': 'application/json' }

export const addShop = async (shopInfo) => {
	const userToken = await getToken() || ''
	const URL = `${BACK_URL}/shops/add`
	const body = JSON.stringify(shopInfo)
	return await fetch(URL, {
		method: 'POST',
		headers: { ...headers, 'Authorization': 'Bearer ' + userToken },
		body
	})
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			return response.json()
		})
		.catch(error => { throw error })
}

export const getShops = async () => {
	const URL = `${BACK_URL}/shops/all`
	return await fetch(URL, {
		headers
	})
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			return response.json()
		})
		.catch(error => { throw error })
}