import Config from 'react-native-config'
import { setHeaders } from './helpers/headers'

const BACK_URL = Config.REACT_APP_DEV_BACKEND_URL

export const addShop = async (shopInfo) => {
	const URL = `${BACK_URL}/shops/add`
	const headers = await setHeaders()
	const body = JSON.stringify(shopInfo)
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

export const getShops = async () => {
	const URL = `${BACK_URL}/shops/all`
	const headers = await setHeaders()
	return await fetch(URL, {
		headers
	})
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			return response.json()
		})
		.catch(error => { throw error })
}