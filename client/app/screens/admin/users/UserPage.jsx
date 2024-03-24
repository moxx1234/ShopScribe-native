import { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native"
import * as yup from 'yup'
import { deleteUser, updateUser } from "../../../../api/organizations"
import Form from "../../../components/form/Form"
import InputGroup from "../../../components/form/InputGroup"
import SubmitButton from "../../../components/form/SubmitButton"
import { useTheme } from "../../../context/ThemeProvider"
import { trimForm } from "../../../helpers/trimForm"

const permissionTitles = {
	addShop: 'Добавление магазина',
	addProduct: 'Добавление товара',
	createSale: 'Создание продажи',
	updateProduct: 'Изменение товара'
}

const UserPage = ({ route, navigation }) => {
	const user = route.params.user
	user.permissions = user.permissions !== null ? user.permissions : []

	const { themeStyles } = useTheme()
	const [permissions, setPermissions] = useState({
		addShop: user.permissions.includes('addShop'),
		addProduct: user.permissions.includes('addProduct'),
		createSale: user.permissions.includes('createSale'),
		updateProduct: user.permissions.includes('updateProduct')
	})

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={removeUser} style={styles.removeButtonContainer}>
					<Text style={styles.removeButtonText} >Удалить</Text>
				</TouchableOpacity>
			)
		})
	})

	const initialValues = {
		login: user.login,
		name: user.name || '',
		surname: user.surname || '',
		phone: user.phone || '',
		password: ''
	}

	const validationObject = Object.keys(initialValues).reduce((res, key) => {
		if (key === 'password') return res
		return res = { ...res, [key]: yup.string().required('Заполните поле!') }
	}, {})
	const schema = yup.object(validationObject)

	const asyncAlert = (title, message) => {
		return new Promise((resolve) => {
			Alert.alert(title, message, [
				{ text: 'Подтвердить', onPress: () => resolve(true) },
				{ text: 'Отменить', style: 'cancel', onPress: () => resolve(false) }
			], { cancelable: false })
		})
	}

	const handleSubmit = async (values, onSubmitProps) => {
		let isConfirmed = !values.password
		const trimmedValues = trimForm(values)

		if (!!trimmedValues.password) isConfirmed = await asyncAlert('Новый пароль', `Подтвердите изменение пароля пользователя на ${trimmedValues.password}`)
		else delete trimmedValues.password

		if (!isConfirmed) return onSubmitProps.setSubmitting(false)

		if (!user.isAdmin) {
			trimmedValues.permissions = Object.entries(permissions).filter(([key, value]) => !!value).map(([key]) => key)
		}
		updateUser(user.id, trimmedValues)
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
	const toggleSwitch = (name) => (value) => {
		setPermissions(prev => ({ ...prev, [name]: value }))
	}
	const removeUser = async () => {
		let isConfirmed = await asyncAlert('Удалить пользователя', 'Подтвердите удаление пользователя')

		if (!isConfirmed) return

		deleteUser(user.id)
			.then(response => {
				alert(response.message)
				navigation.goBack()
			})
			.catch(error => {
				if (error.message) return alert(error.message)
				alert(error)
			})
	}

	return (
		<ScrollView style={{ padding: 15 }}>
			<Form
				initialValues={initialValues}
				schema={schema}
				onSubmit={handleSubmit}
			>
				<InputGroup name='login' label='Логин' type='text' />
				<InputGroup name='name' label='Имя' type='text' />
				<InputGroup name='surname' label='Фамилия' type='text' />
				<InputGroup name='phone' label='Телефон' type='phone' />
				<InputGroup name='password' label='Новый пароль (необязательно)' type='password' />
				<View style={styles.section}>
					<Text style={[themeStyles.text, styles.title]}>Доступы:</Text>
					{
						user.isAdmin ? (
							<Text style={[themeStyles.text]}>Администратор</Text>
						) : (
							Object.entries(permissions).map(([name, value]) => (
								<View key={name} style={styles.rowContainer}>
									<Switch
										onValueChange={toggleSwitch(name)}
										value={value}
										trackColor={{ false: 'grey' }}
									/>
									<Text style={[themeStyles.text, styles.switchText]}>{permissionTitles[name]}</Text>
								</View>
							))
						)
					}
				</View>
				<SubmitButton title='Сохранить' />
			</Form>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	section: {
		marginVertical: 20,
	},
	title: {
		fontSize: 24,
		marginBottom: 10
	},
	rowContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	switchText: {
		fontSize: 20,
	},
	removeButtonContainer: {
		backgroundColor: 'red',
		padding: 10,
		borderRadius: 5
	},
	removeButtonText: {
		color: 'white',
		fontWeight: '500',
		fontSize: 16
	}
})

export default UserPage