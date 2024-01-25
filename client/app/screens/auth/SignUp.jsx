import EncryptedStorage from 'react-native-encrypted-storage';
import { StyleSheet, View } from 'react-native'
import * as yup from 'yup'
import { authenticateUser, authorizeUser } from "../../../api/auth"
import Form from '../../components/form/Form'
import InputGroup from '../../components/form/InputGroup'
import SubmitButton from '../../components/form/SubmitButton'
import { useAuthUpdate } from "../../context/UserProvider"

const SignUpScreen = () => {
	const updateUserState = useAuthUpdate()

	const initialValues = { email: '', password: '', passwordRepeat: '' }

	const schema = yup.object({
		email: yup.string().email('Неверный email').required('Введите свой email'),
		password: yup.string().required('Введите свой пароль'),
		passwordRepeat: yup.string().oneOf([yup.ref('password'), ''], 'Пароли не совпадают!').required('Введите свой пароль')
	})

	const handleSubmit = (values, onSubmitProps) => {
		authenticateUser('register', values)
			.then(async (response) => {
				await EncryptedStorage.setItem('token', response.JWT)
				authorizeUser(response.JWT).then(response => {
					updateUserState({ type: 'login', setAdmin: response.isAdmin })
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
			<Form initialValues={initialValues} schema={schema} onSubmit={handleSubmit}>
				<InputGroup name='email' label='Email' type='email' />
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