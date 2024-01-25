export const getFormattedDate = (date) => {
	const year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate()
	return `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month}.${year}`
}

export const getFullDate = (date) => {
	const dateObject = {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
		hours: date.getHours(),
		minutes: date.getMinutes(),
		seconds: date.getSeconds()
	}
	Object.entries(dateObject).forEach(([key, value]) => {
		if (value < 10) dateObject[key] = `0${value}`
	})
	const { year, month, day, hours, minutes, seconds } = dateObject
	return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
}