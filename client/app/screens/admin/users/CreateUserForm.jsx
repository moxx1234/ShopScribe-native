import * as yup from 'yup'
import Form from '../../../components/form/Form'
import InputGroup from '../../../components/form/InputGroup'
import SubmitButton from '../../../components/form/SubmitButton'

const CreateUserForm = ({ onSubmit }) => {
	const initialValues = { login: '', password: '', name: '', surname: '', phone: '' }

	const schema = yup.object({
		login: yup.string().required('Введите логин'),
		password: yup.string().required('Введите пароль'),
		name: yup.string().required('Введите имя'),
		surname: yup.string().required('Введите фамилию'),
		phone: yup.string().required('Введите телефон'),
	})

	return (
		<Form onSubmit={onSubmit} initialValues={initialValues} schema={schema}>
			<InputGroup name='login' label='Логин' type='text' />
			<InputGroup name='password' label='Пароль' type='password' />
			<InputGroup name='name' label='Имя' type='text' />
			<InputGroup name='surname' label='Фамилия' type='text' />
			<InputGroup name='phone' label='Телефон' type='phone' />
			<SubmitButton title='Создать' />
		</Form>
	)
}

export default CreateUserForm