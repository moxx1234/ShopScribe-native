export const trimForm = (values) => {
	const trimmed = {}
	for (const [key, value] of Object.entries(values)) {
		if (typeof value !== 'string') trimmed[key] = value
		else trimmed[key] = value.trim()
	}
	return trimmed
}