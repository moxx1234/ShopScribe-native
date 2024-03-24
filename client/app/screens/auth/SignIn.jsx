import EncryptedStorage from 'react-native-encrypted-storage'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as yup from 'yup'
import { authenticateUser, authorizeUser } from '../../../api/auth'
import Form from '../../components/form/Form'
import InputGroup from '../../components/form/InputGroup'
import SubmitButton from '../../components/form/SubmitButton'
import { useTheme } from '../../context/ThemeProvider'
import { useAuthUpdate } from "../../context/UserProvider"

const SignInScreen = ({ navigation }) => {
	const navigate = (page) => navigation.navigate(page)
	const { themeStyles } = useTheme()
	const updateUserState = useAuthUpdate()

	const initialValues = { login: '', password: '' }

	const schema = yup.object({
		login: yup.string().required('Введите свой логин'),
		password: yup.string().required('Введите свой пароль')
	})

	const handleSubmit = (values, onSubmitProps) => {
		authenticateUser('login', values)
			.then(async (response) => {
				await EncryptedStorage.setItem('token', response.JWT)
				authorizeUser().then(response => {
					updateUserState({ type: 'login', setAdmin: response.isAdmin, permissions: response.permissions })
				})
			})
			.catch(error => {
				if (error.field) return onSubmitProps.setErrors({ [error.field]: [error.message] })
				alert(error)
			})
			.finally(() => { onSubmitProps.setSubmitting(false) })
	}
	return (
		<View style={styles.container}>
			<Text style={[styles.title, themeStyles.text]}>Войдите, чтобы продолжить!</Text>
			<Form initialValues={initialValues} schema={schema} onSubmit={handleSubmit}>
				<InputGroup name='login' label='Логин' type='text' />
				<InputGroup name='password' label='Пароль' type='password' />
				<SubmitButton title='Войти' />
			</Form>
			<View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 30 }}>
				<Text style={[{ fontSize: 18 }, themeStyles.text]}>Нет аккаунта?</Text>
				<TouchableOpacity onPress={() => navigate('SignUp')}>
					<Text style={styles.link}>Зарегестрируйтесь!</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
		paddingHorizontal: 10
	},
	title: {
		fontSize: 36,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	link: {
		color: 'blue',
		textDecorationLine: 'underline',
		fontSize: 18
	}
})

export default SignInScreen