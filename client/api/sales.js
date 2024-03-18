import Config from 'react-native-config'
import { setHeaders } from './helpers/headers'

const BACK_URL = Config.REACT_APP_DEV_BACKEND_URL

export const getDeals = async (shopId = null) => {
	const headers = await setHeaders()
	const query = shopId ? `?${new URLSearchParams({ shopId })}` : ''
	const URL = `${BACK_URL}/sales${query}`
	return await fetch(URL, {
		headers
	})
		.then(async (response) => {
			if (!response.ok) throw await response.json()
			return response.json()
		})
		.catch(error => { throw error })
}

export const createDeal = async (shopId, dealInfo) => {
	const URL = `${BACK_URL}/sales/create`
	const headers = await setHeaders()
	const body = JSON.stringify({
		[shopId]: dealInfo
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