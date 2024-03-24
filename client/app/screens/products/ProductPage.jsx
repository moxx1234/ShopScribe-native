import { StyleSheet, Text, View, ScrollView } from "react-native"
import { useTheme } from "../../context/ThemeProvider"
import * as yup from 'yup'
import Form from "../../components/form/Form"
import InputGroup from "../../components/form/InputGroup"
import SubmitButton from "../../components/form/SubmitButton"
import { updateProduct } from "../../../api/products"

const translationMap = {
	name: 'Название',
	category: 'Категория',
	price: 'Цена',
	quantity: 'Количество',
	units: 'Ед. измерения'
}

const ProductPage = ({ route }) => {
	const { product } = route.params

	console.log(product)

	const { themeStyles } = useTheme()

	const uneditable = Object.keys(product).filter(key => key === 'name' || key === 'category' || key === 'units')
	const editable = Object.keys(product).filter(key => key === 'price' || key === 'quantity')

	const initialValues = editable.reduce((res, key) => ({ ...res, [key]: product[key].toString() }), {})
	const validationObject = editable.reduce((res, key) => ({ ...res, [key]: yup.string().required('Заполните поле!') }), {})
	const schema = yup.object(validationObject)

	const handleSubmit = (values, onSubmitProps) => {
		const productInfo = { id: product.id, ...values }
		updateProduct(productInfo)
			.then(response => {
				onSubmitProps.resetForm({
					values: Object.keys(initialValues).reduce((res, key) => {
						if (key === 'password') return res = { ...res, [key]: '' }
						return res = { ...res, [key]: values[key] }
					}, {})
				})
				alert(response.message)
			})
			.catch(error => {
				if (error.field) return onSubmitProps.setErrors({ [error.field]: [error.message] })
				alert(error)
			})
			.finally(() => onSubmitProps.setSubmitting(false))
	}

	return (
		<ScrollView style={{ padding: 15 }}>
			<View style={styles.section}>
				{
					uneditable.map(key => (
						<View key={key} style={styles.container}>
							<Text style={[themeStyles.text, styles.key]}>{translationMap[key]}:</Text>
							<Text style={[themeStyles.text, styles.value]}>{product[key]}</Text>
						</View>
					))
				}
			</View>
			<Form
				initialValues={initialValues}
				schema={schema}
				onSubmit={handleSubmit}
			>
				<InputGroup name='price' label='Цена' type='number' />
				<InputGroup name='quantity' label='Количество' type='number' />
				<SubmitButton title='Сохранить' />
			</Form>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	section: {
		marginBottom: 20,
	},
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
})

export default ProductPage