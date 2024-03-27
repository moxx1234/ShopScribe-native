import { useEffect, useState } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as yup from 'yup'
import { addProduct, getProducts } from '../../../api/products'
import CustomModal from '../../components/CustomModal'
import IconButton from '../../components/IconButton'
import Form from '../../components/form/Form'
import InputGroup from '../../components/form/InputGroup'
import SubmitButton from '../../components/form/SubmitButton'
import ProductsList from './ProductsList'
import { useAuth } from '../../context/UserProvider'

const unitsList = ['кг.', 'шт.', 'литр', 'метр']
const dropDownOptions = unitsList.map((unit) => ({ label: unit, value: unit }))

const Products = () => {
	const [modalOpen, setModalOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [products, setProducts] = useState()
	const { isAdmin, permissions } = useAuth()

	useEffect(() => {
		handleRefresh()
	}, [])

	const initialValues = { name: '', category: '', units: '', price: '', quantity: '' }

	const schema = yup.object({
		name: yup.string().required('Заполните имя!'),
		category: yup.string().required('Заполните это поле!'),
		units: yup.string().required('Укажите единицу измерения!'),
		price: yup.number().required('Укажите цену за единицу товара!'),
		quantity: yup.number().required('Укажите количество товара!')
	})

	const handleSubmit = (values, onSubmitProps) => {
		const trimmedValues = Object.entries(values).reduce((result, [field, value]) => result = ({ ...result, [field]: value.trim() }), {})
		addProduct(trimmedValues)
			.then(response => {
				Alert.alert('Товар', response.message)
				setModalOpen(false)
				handleRefresh()
			})
			.catch(error => {
				if (error.field) return onSubmitProps.setErrors({ [error.field]: [error.message] })
				if (error.message) return Alert.alert('Ошибка', error.message)
				Alert.alert('Ошибка', error)
			})
			.finally(() => { onSubmitProps.setSubmitting(false) })
	}
	const handleClose = () => {
		setModalOpen(false)
	}
	const handleRefresh = () => {
		setIsLoading(true)
		getProducts()
			.then(response => {
				setProducts(response.products)
			})
			.catch(error => {
				if (error.message) return Alert.alert('Ошибка', error.message)
				Alert.alert('Ошибка', error)
			})
			.finally(() => setIsLoading(false))
	}

	return (
		<View style={{ flex: 1 }}>
			<ProductsList onRefresh={handleRefresh} isRefreshing={isLoading} data={products} />
			{
				(isAdmin || permissions.includes('addProduct')) && (
					<>
						<CustomModal isOpen={modalOpen} onClose={handleClose} title='Добавить товар'>
							<Form initialValues={initialValues} schema={schema} onSubmit={handleSubmit}>
								<InputGroup name='name' label='Название' type='text' />
								<InputGroup name='category' label='Категория' type='text' />
								<InputGroup
									name='units'
									label='Единицы измерения'
									type='select'
									isSearchable={false}
									placeholder='Выбрать'
									options={dropDownOptions}
								/>
								<InputGroup name='price' label='Цена' type='number' />
								<InputGroup name='quantity' label='Количество' type='number' />
								<SubmitButton title='Создать' />
							</Form>
						</CustomModal>
						<IconButton
							Icon={Ionicons}
							size={50}
							name='add-sharp'
							style={[styles.buttonWrapper, styles.buttonIcon]}
							onPress={() => setModalOpen(true)}
						/>
					</>
				)}
		</View>
	)
}

const addButtonStyle = {
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonWrapper: {
		backgroundColor: 'rgb(0,122,255)',
		borderRadius: 50,
		padding: 10,
		position: 'absolute',
		bottom: 50,
		right: 30,
	},
	buttonIcon: {
		color: '#fff'
	}
}
const styles = StyleSheet.create({
	...addButtonStyle
})

export default Products