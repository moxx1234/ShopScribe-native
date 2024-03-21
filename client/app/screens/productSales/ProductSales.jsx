import { useEffect, useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native"
import { useTheme } from "../../context/ThemeProvider"
import { getFullDate } from "../../helpers/formatDate"
import { printReceipt } from "../../../api/printer"
import BluetoothStateManager from "react-native-bluetooth-state-manager"
import { payDebt } from "../../../api/sales"

const ProductSales = ({ navigation, route }) => {
	const sale = route.params.saleInfo

	const { themeStyles } = useTheme()
	const [isPrinting, setIsPrinting] = useState(false)
	const [saleDebt, setSaleDebt] = useState(sale.debt)

	useEffect(() => {
		navigation.setOptions({
			title: `Продажа от ${sale.date}`
		})
	}, [])

	const print = async () => {
		const bluetoothState = await BluetoothStateManager.getState()
		if (bluetoothState !== 'PoweredOn') return BluetoothStateManager.openSettings()
		setIsPrinting(true)
		printReceipt(sale).finally(() => setIsPrinting(false))
	}
	const closeDebt = () => {
		Alert.alert('Погасить долг', `Подтвердите погашение долга. \nСумма: ${saleDebt}`, [
			{ text: 'Подтвердить', onPress: proceedDebtPayment },
			{ text: 'Отменить', style: 'cancel' }
		], {
			cancelable: true
		})
	}
	const proceedDebtPayment = async () => {
		payDebt({ id: sale.id, amount: saleDebt, shopId: sale.shopId })
			.then((response) => {
				setSaleDebt(0)
				Alert.alert(response.message)
			})
			.catch(error => console.error(error))
	}

	return (
		<View style={styles.container}>
			<View style={styles.rowContainer}>
				<TouchableOpacity style={styles.buttonContainer} onPress={print} disabled={isPrinting}>
					<Text style={styles.buttonText}>Распечатать чек</Text>
				</TouchableOpacity>
				{saleDebt > 0 && (
					<TouchableOpacity style={styles.buttonContainer} onPress={closeDebt}>
						<Text style={styles.buttonText}>Погасить долг за продажу</Text>
					</TouchableOpacity>
				)}
			</View>
			<Text style={[themeStyles.text, styles.title]}>Магазин: {sale.shop.name}</Text>
			<Text style={[themeStyles.text, styles.title]}>Дата: {getFullDate(new Date(sale.createdAt))}</Text>
			<View style={styles.section}>
				<Text style={[themeStyles.text, styles.title]}>Товары:</Text>
				{sale.product_sales.map((product, index) => (
					<Text style={[themeStyles.text, styles.row]} key={index}>{product.product.name} - {product.salePrice} * {product.productQty} = {product.total}</Text>
				)
				)}
			</View>
			<Text style={[themeStyles.text, styles.title, styles.right]}>Итого: {sale.total}</Text>
			{saleDebt > 0 && <Text style={[themeStyles.text, styles.title, styles.right]}>Долг: {saleDebt}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 10
	},
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	},
	title: {
		fontSize: 20,
		marginBottom: 10
	},
	section: {
		marginVertical: 20,
		alignSelf: 'center'
	},
	row: {
		fontSize: 18,
		marginBottom: 5,
	},
	right: {
		alignSelf: 'flex-end'
	},
	buttonContainer: {
		marginBottom: 5,
		backgroundColor: 'rgb(0,122,255)',
		borderRadius: 5,
		padding: 10,
	},
	buttonText: {
		color: '#fff'
	},
})

export default ProductSales