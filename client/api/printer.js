import { NativeModules, PermissionsAndroid } from "react-native"
import { getFullDate } from "../app/helpers/formatDate"

const { ThermalPrinterModule } = NativeModules

const generateText = (data) => {
	console.log(data)
	let result = ''
	const { createdAt, product_sales, total, user, shop, debt } = data
	const { organization } = user
	const orgName = `Продавец: ${organization.name}\n`
	const buyer = `Покупатель: ${shop.name}\n`
	const seller = `Экспедитор: ${user.surname} ${user.name}. \nПодпись: \n`
	const payed = `Оплачено: [R]${total - debt}\n`
	const saleDebt = `В долг: [R]${debt}\n`
	const totalDebt = `Общий долг: [R]${shop.totalDebt}\n`
	const fullDate = getFullDate(new Date(createdAt))
	const productsList = product_sales.reduce((result, productSale) => {
		const line = `[L]${productSale.product.name}:\n[L]${productSale.salePrice}[C]*[C]${productSale.productQty}[C]=[R]${productSale.total}\n`
		return result += line
	}, '')
	const totalLine = `\n[L]<font size="tall"><b>Итого:</b></font>[R]<font size="tall"><b>${total}</b></font>\n`
	result += orgName + buyer + `\n${fullDate}\n\n` + productsList + totalLine + payed + saleDebt + totalDebt + `${seller}\n`
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