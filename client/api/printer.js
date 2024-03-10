import { NativeModules, PermissionsAndroid } from "react-native"
import { getFullDate } from "../app/helpers/formatDate"

const { ThermalPrinterModule } = NativeModules

const generateText = (data) => {
	let result = ''
	const { createdAt, product_sales, total } = data
	const fullDate = getFullDate(new Date(createdAt))
	const productsList = product_sales.reduce((result, productSale) => {
		const line = `[L]${productSale.product.name}:[C]${productSale.product.price}[C]*[C]${productSale.productQty}[C]=[R]${productSale.total}\n`
		return result += line
	}, '')
	const totalLine = `\n[L]<font size="tall"><b>Итого:</b></font>[R]<font size="tall"><b>${total}</b></font>\n`
	result += `\n${fullDate}\n\n` + productsList + totalLine
	return result
}

const checkPermissions = async () => {
	return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) && PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN)
}

export const printReceipt = async (data) => {
	const granted = await checkPermissions()
	if (!granted) return
	const text = generateText(data)
	return ThermalPrinterModule.print(text).catch(error => alert(error))
}