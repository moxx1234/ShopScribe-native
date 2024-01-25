import Config from 'react-native-config'

const BACK_URL = Config.REACT_APP_DEV_BACKEND_URL
const headers = { 'Content-Type': 'application/json' }

export const getDeals = async (shopId = null) => {
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

export const createDeal = async (shopId, productsInfo) => {
	const URL = `${BACK_URL}/sales/create`
	const body = JSON.stringify({
		[shopId]: productsInfo
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