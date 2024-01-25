import { useEffect, useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { useTheme } from "../../context/ThemeProvider"
import { getFullDate } from "../../helpers/formatDate"
import { printReceipt } from "../../../api/printer"
import BluetoothStateManager from "react-native-bluetooth-state-manager"

const ProductSales = ({ navigation, route }) => {
	const { themeStyles } = useTheme()
	const sale = route.params.saleInfo
	const [isPrinting, setIsPrinting] = useState(false)

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

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.buttonContainer} onPress={print} disabled={isPrinting}>
				<Text style={styles.buttonText}>Распечатать чек</Text>
			</TouchableOpacity>
			<Text style={[themeStyles.text, styles.title]}>Магазин: {sale.shop}</Text>
			<Text style={[themeStyles.text, styles.title]}>Дата: {getFullDate(new Date(sale.createdAt))}</Text>
			<View style={styles.section}>
				<Text style={[themeStyles.text, styles.title]}>Товары:</Text>
				{sale.product_sales.map((product, index) => (
					<Text style={[themeStyles.text, styles.row]} key={index}>{product.product.name} - {product.product.price} * {product.productQty} = {product.total}</Text>
				)
				)}
			</View>
			<Text style={[themeStyles.text, styles.title, styles.right]}>Итого: {sale.total}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 10
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
		marginRight: 'auto',
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