import { useEffect, useState } from "react"
import { StyleSheet, View, Alert } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { addShop, getShops } from "../../../api/shops"
import CustomModal from "../../components/CustomModal"
import IconButton from "../../components/IconButton"
import AddShopForm from "../../components/form/AddShopForm"
import ShopsList from "../shop/ShopsList"
import { useAuth } from "../../context/UserProvider"

const Main = () => {
	const [modalOpen, setModalOpen] = useState(false)
	const [shops, setShops] = useState()
	const [isRefreshing, setIsRefreshing] = useState(false)
	const { permissions, isAdmin } = useAuth()

	const refresh = () => {
		setIsRefreshing(true)
		getShops()
			.then(response => { setShops(response.shops) })
			.catch(error => {
				if (error.message) return Alert.alert('Ошибка', error.message)
				Alert.alert('Ошибка', error)
			})
			.finally(() => setIsRefreshing(false))
	}

	useEffect(() => {
		refresh()
	}, [])

	const handleSubmit = (values, onSubmitProps) => {
		const trimmedValues = Object.entries(values).reduce((result, [field, value]) => result = ({ ...result, [field]: value.trim() }), {})
		addShop(trimmedValues)
			.then(response => {
				Alert.alert('Магазин', response.message)
				setModalOpen(false)
				refresh()
			})
			.catch(error => {
				if (error.field) return onSubmitProps.setErrors({ [error.field]: [error.message] })
				if (error.message) return Alert.alert('Ошибка', error.message)
				Alert.alert('Ошибка', error)
			})
			.finally(() => { onSubmitProps.setSubmitting(false) })
	}
	const handlePress = () => {
		setModalOpen(true)
	}
	const handleClose = () => {
		setModalOpen(false)
	}
	return (
		<View style={{ flex: 1 }}>
			<ShopsList
				onRefresh={refresh}
				data={shops}
				isRefreshing={isRefreshing}
			/>
			{(permissions.includes('addShop') || isAdmin) && (
				<>
					<CustomModal
						isOpen={modalOpen}
						onClose={handleClose}
						title='Добавить магазин'
					>
						<ScrollView>
							<AddShopForm onSubmit={handleSubmit} />
						</ScrollView>
					</CustomModal>
					<IconButton
						Icon={Ionicons}
						size={50}
						name='add-sharp'
						style={[styles.buttonWrapper, styles.buttonIcon]}
						onPress={handlePress}
					/>
				</>)}
		</View>
	)
}

const addButtonStyle = {
	buttonWrapper: {
		backgroundColor: 'rgb(0,122,255)',
		borderRadius: 50,
		padding: 10,
		position: 'absolute',
		bottom: 50,
		right: 30,
	},
	buttonIcon: {
		color: '#fff',
	}
}
const styles = StyleSheet.create({
	...addButtonStyle
})

export default Main