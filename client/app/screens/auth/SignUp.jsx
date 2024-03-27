import EncryptedStorage from 'react-native-encrypted-storage'
import { StyleSheet, View, Alert } from 'react-native'
import * as yup from 'yup'
import { authenticateUser, authorizeUser } from "../../../api/auth"
import Form from '../../components/form/Form'
import InputGroup from '../../components/form/InputGroup'
import SubmitButton from '../../components/form/SubmitButton'
import { useAuthUpdate } from "../../context/UserProvider"

const SignUpScreen = () => {
	const updateUserState = useAuthUpdate()

	const initialValues = { login: '', password: '', passwordRepeat: '' }

	const schema = yup.object({
		login: yup.string().required('Введите свой логин'),
		password: yup.string().required('Введите свой пароль'),
		passwordRepeat: yup.string().oneOf([yup.ref('password'), ''], 'Пароли не совпадают!').required('Введите свой пароль')
	})

	const handleSubmit = (values, onSubmitProps) => {
		authenticateUser('register', values)
			.then(async (response) => {
				await EncryptedStorage.setItem('token', response.JWT)
				authorizeUser().then(response => {
					updateUserState({ type: 'login', setAdmin: response.isAdmin })
				})
			})
			.catch(error => {
				if (error.field) return onSubmitProps.setErrors({ [error.field]: [error.message] })
				Alert.alert('Ошибка', error)
			})
			.finally(() => { onSubmitProps.setSubmitting(false) })
	}
	return (
		<View style={styles.container}>
			<Form initialValues={initialValues} schema={schema} onSubmit={handleSubmit}>
				<InputGroup name='login' label='Логин' type='text' />
				<InputGroup name='password' label='Пароль' type='password' />
				<InputGroup name='passwordRepeat' label='Повторите пароль' type='password' />
				<SubmitButton title='Зарегистрироваться' />
			</Form>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 20,
		paddingHorizontal: 10,
	},
})

export default SignUpScreen