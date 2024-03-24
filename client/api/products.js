import Config from 'react-native-config'
import { setHeaders } from './helpers/headers'

const BACK_URL = Config.REACT_APP_DEV_BACKEND_URL

export const addProduct = async (productInfo) => {
	const URL = `${BACK_URL}/products/add`
	const headers = await setHeaders()
	const body = JSON.stringify(productInfo)
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

export const getProducts = async () => {
	const URL = `${BACK_URL}/products/all`
	const headers = await setHeaders()
	return await fetch(URL, {
		method: 'GET',
		headers
	})
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			return response.json()
		})
		.catch(error => { throw error })
}

export const updateProduct = async (productInfo) => {
	const URL = `${BACK_URL}/products/update`
	const headers = await setHeaders()
	return await fetch(URL, {
		method: 'PUT',
		headers,
		body: JSON.stringify(productInfo)
	})
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			return response.json()
		})
		.catch(error => { throw error })
}