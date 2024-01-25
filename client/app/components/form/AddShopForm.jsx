import * as yup from 'yup'
import Form from './Form'
import InputGroup from './InputGroup'
import SubmitButton from './SubmitButton'

const AddShopForm = ({ onSubmit }) => {
	const initialValues = { name: '', owner: '', phone: '', address: '', remark: '' }

	const schema = yup.object({
		name: yup.string().trim().required('Введите название магазина'),
		owner: yup.string().trim().required('Введите имя владельца'),
		phone: yup.string().required('Введите номер телефона'),
		address: yup.string().trim().required('Введите адрес')
	})

	return (
		<Form initialValues={initialValues} onSubmit={onSubmit} schema={schema}>
			<InputGroup name='name' label='Название' type='text' />
			<InputGroup name='owner' label='Имя владельца' type='text' />
			<InputGroup name='phone' label='Номер телефона' type='phone' />
			<InputGroup name='address' label='Адрес' type='text' />
			<InputGroup name='remark' label='Примечание' type='textarea' />
			<SubmitButton title='Создать' />
		</Form>
	)
}

export default AddShopForm