import { useEffect, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as yup from 'yup'
import { addProduct, getProducts } from '../../../api/products'
import CustomModal from '../../components/CustomModal'
import IconButton from '../../components/IconButton'
import Form from '../../components/form/Form'
import InputGroup from '../../components/form/InputGroup'
import SubmitButton from '../../components/form/SubmitButton'
import Table from '../../components/table/Table'

const Products = () => {
	const [modalOpen, setModalOpen] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [products, setProducts] = useState()

	useEffect(() => {
		getProducts()
			.then(response => setProducts(response.products))
			.catch(error => console.error(error))
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
				alert(response.message)
				setModalOpen(false)
				handleRefresh()
			})
			.catch(error => {
				if (error.field) return onSubmitProps.setErrors({ [error.field]: [error.message] })
				if (error.message) return alert(error.message)
				alert(error)
			})
			.finally(() => { onSubmitProps.setSubmitting(false) })
	}
	const handleClose = () => {
		setModalOpen(false)
	}
	const handleRefresh = () => {
		setIsRefreshing(true)
		getProducts()
			.then(response => {
				setProducts(response.products)
			})
			.catch(error => console.error(error))
			.finally(() => setIsRefreshing(false))
	}

	const tableData = {
		titles: products?.length && Object.keys(products[0]).filter(title => title === 'name' || title === 'quantity' || title === 'price' || title === 'units'),
		body: products
	}

	return (
		<View style={{ flex: 1 }}>
			<CustomModal isOpen={modalOpen} onClose={handleClose} title='Добавить товар'>
				<Form initialValues={initialValues} schema={schema} onSubmit={handleSubmit}>
					<InputGroup name='name' label='Название' type='text' />
					<InputGroup name='category' label='Категория' type='text' />
					<InputGroup name='units' label='Единицы измерения' type='text' />
					<InputGroup name='price' label='Цена' type='number' />
					<InputGroup name='quantity' label='Количество' type='number' />
					<SubmitButton title='Создать' />
				</Form>
			</CustomModal>
			<ScrollView
				refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />}
			>
				{products && <Table data={tableData} />}
			</ScrollView>
			<IconButton
				Icon={Ionicons}
				size={50}
				name='add-sharp'
				style={[styles.buttonWrapper, styles.buttonIcon]}
				onPress={() => setModalOpen(true)}
			/>
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
		color: '#fff'
	}
}
const styles = StyleSheet.create({
	...addButtonStyle
})

export default Products