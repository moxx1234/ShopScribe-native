import { useIsFocused } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getProducts } from '../../../api/products'
import { createDeal, getDeals } from "../../../api/sales"
import CustomModal from "../../components/CustomModal"
import SalesList from "../../components/SalesList"
import { useTheme } from '../../context/ThemeProvider'
import { useAuth } from "../../context/UserProvider"
import CreateOrder from "./CreateOrder"

const translationMap = {
	name: 'Название',
	owner: 'Владелец',
	phone: 'Телефон',
	address: 'Адрес',
	debt: 'Долг',
	remark: 'Примечание'
}

const Shop = ({ route }) => {
	const shop = route.params.shop

	const { themeStyles } = useTheme()
	const [modalOpen, setModalOpen] = useState(false)
	const [products, setProducts] = useState([])
	const [sales, setSales] = useState([])
	const isFocused = useIsFocused()
	const { isAdmin, permissions } = useAuth()

	useEffect(() => {
		getProducts()
			.then(response => setProducts(response.products))
			.catch(error => console.error(error))
	}, [])

	useEffect(() => {
		if (!isFocused) return
		getSales()
	}, [isFocused])

	const handleDealCreate = async (dealInfo) => {
		await createDeal(shop.id, dealInfo)
			.then(response => {
				if (response.message) {
					setModalOpen(false)
					getSales()
					return Alert.alert('Продажа', response.message)
				}
			})
			.catch(error => Alert.alert('Ошибка', error))
	}

	const getSales = () => {
		getDeals(shop.id)
			.then(response => setSales(response.sales))
			.catch(error => console.error(error))
	}

	return (
		<ScrollView style={{ padding: 15 }}>
			{Object.entries(shop).map(([key, value]) => (
				value.toString() && key !== 'id' && (
					<View key={key} style={styles.container}>
						<Text style={[themeStyles.text, styles.key]}>{`${translationMap[key]}:`}</Text>
						<Text style={[themeStyles.text, styles.value]}>{`${value.toString()}`}</Text>
					</View>
				)
			)
			)}
			<View style={styles.section}>
				{!!products.length && (isAdmin || permissions.includes('createSale')) && (
					<CustomModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title='Создать продажу'>
						<CreateOrder products={products} onDealCreate={handleDealCreate} />
					</CustomModal>
				)}
				<View style={[styles.container, styles.sectionHeader]}>
					<Text style={[themeStyles.text, styles.title]}>Продажи</Text>
					{
						(isAdmin || permissions.includes('createSale')) && (
							<TouchableOpacity style={styles.buttonContainer} onPress={() => setModalOpen(true)}>
								<Text style={styles.buttonText}>Создать продажу +</Text>
							</TouchableOpacity>
						)
					}
					{!!sales.length && <SalesList sales={sales} />}
				</View>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	key: {
		fontSize: 18,
		marginRight: 10,
	},
	value: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	section: {
		paddingTop: 20,
	},
	sectionHeader: {
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	buttonContainer: {
		backgroundColor: 'rgb(0,122,255)',
		borderRadius: 5,
		padding: 5,
	},
	buttonText: {
		color: '#fff'
	},
})

export default Shop