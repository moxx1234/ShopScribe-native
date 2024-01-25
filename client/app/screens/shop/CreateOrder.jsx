import { useState } from "react"
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native"
import * as yup from 'yup'
import Form from "../../components/form/Form"
import InputGroup from "../../components/form/InputGroup"
import SubmitButton from '../../components/form/SubmitButton'
import { useTheme } from "../../context/ThemeProvider"
import Table from "../../components/table/Table"

const CreateOrder = ({ products, onDealCreate }) => {
	const [addedProducts, setAddedProducts] = useState([])
	const { themeStyles } = useTheme()

	const initialValues = { product: '', quantity: '' }

	const schema = yup.object({
		product: yup.string().required('Выберите товар!'),
		quantity: yup.number().required('Введите количество!')
	})

	const handleSubmit = (values, onSubmitProps) => {
		const productFromCatalogue = products.find(product => product.id === values.product)
		const { id, name, price, quantity, units } = productFromCatalogue
		setAddedProducts(prevAdded => {
			const existingProductIndex = prevAdded.findIndex(product => product.id === id)
			if (existingProductIndex !== -1) {
				prevAdded[existingProductIndex].quantity += Number(values.quantity)
				prevAdded[existingProductIndex].total += price * values.quantity
				return [...prevAdded]
			}
			return [
				...prevAdded,
				{ id, name, quantity: Number(quantity) >= Number(values.quantity) && Number(values.quantity), units, price, total: values.quantity * price }
			]
		})
		onSubmitProps.resetForm()
		onSubmitProps.setSubmitting(false)
	}

	const formatOptions = (data) => {
		const titles = []
		return data.reduce((result, product) => {
			if (!titles.includes(product.category)) {
				titles.push(product.category)
				return result = [...result, { title: product.category, data: [{ label: product.name, value: product.id }] }]
			}
			const listIndex = result.findIndex(list => list.title === product.category)
			result[listIndex].data.push({ label: product.name, value: product.id })
			return result
		}, [])
	}

	const tableData = {
		titles: !!addedProducts.length && Object.keys(addedProducts[0]).filter(key => key !== 'id'),
		body: addedProducts
	}
	return (
		<ScrollView>
			<Form initialValues={initialValues} schema={schema} onSubmit={handleSubmit}>
				<InputGroup
					name='product'
					label='Выберите товар'
					type='select'
					placeholder='Выберите товар'
					options={formatOptions(products)}
					searchControls={{ textInputProps: { placeholder: 'Поиск' } }}
				/>
				<InputGroup name='quantity' label='Количество' type='number' />
				<SubmitButton title='Добавить в заказ' />
			</Form>
			<View style={styles.list}>
				<Text style={[themeStyles.text, styles.title]}>Товаров добавлено: {addedProducts.length}</Text>
				{!!addedProducts.length && (
					<View>
						<Table data={tableData} />
						<TouchableOpacity style={styles.buttonWrapper} onPress={() => onDealCreate(addedProducts)}>
							<Text style={styles.buttonText}>Создать продажу</Text>
						</TouchableOpacity>
					</View>
				)
				}
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		marginVertical: 15
	},
	buttonWrapper: {
		backgroundColor: 'rgb(0,122,255)',
		borderRadius: 10,
		padding: 10,
		marginTop: 15
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 20,
	}
})

export default CreateOrder