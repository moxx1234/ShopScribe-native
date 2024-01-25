import { useEffect } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useTheme } from "../../context/ThemeProvider"


const DateReport = ({ navigation, route }) => {
	const { params } = route
	const { themeStyles } = useTheme()

	useEffect(() => {
		navigation.setOptions({
			title: `Отчет за ${params.date}`
		})

	}, [])

	return (
		<ScrollView>
			{params.sales.map((marketSale, index) => (
				<View key={index} style={styles.container}>
					<Text style={[themeStyles.text, styles.title]}>Магазин: {marketSale.shop}</Text>
					<View style={styles.section}>
						<Text style={[themeStyles.text, styles.title]}>Товары:</Text>
						{marketSale.product_sales.map((product, index) => (
							<Text style={[themeStyles.text, styles.row]} key={index}>{product.product.name}: {product.product.price} * {product.productQty} = {product.total}</Text>
						)
						)}
					</View>
					<Text style={[themeStyles.text, styles.title, styles.right]}>Итого: {marketSale.total}</Text>
				</View>
			))}
		</ScrollView>
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
	}
})

export default DateReport