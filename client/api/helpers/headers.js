import { getToken } from "../auth"

export const setHeaders = async () => {
	const contentType = 'application/json'
	const authorization = `Bearer ${await getToken() || ''}`
	return {
		'Content-Type': contentType,
		'Authorization': authorization
	}
}