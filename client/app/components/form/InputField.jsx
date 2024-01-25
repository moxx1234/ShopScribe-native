import EmailField from './EmailField'
import MultilineField from './MultilineField'
import NumberField from './NumberField'
import PasswordField from './PasswordField'
import PhoneField from './PhoneField'
import SelectField from './SelectField'
import TextField from './TextField'

const InputField = ({ type, ...props }) => {
	switch (type) {
		case 'text': return <TextField {...props} />
		case 'email': return <EmailField {...props} />
		case 'password': return <PasswordField {...props} />
		case 'phone': return <PhoneField {...props} />
		case 'textarea': return <MultilineField {...props} />
		case 'number': return <NumberField {...props} />
		case 'select': return <SelectField {...props} />
		default: throw new Error('unknown field type')
	}
}

export default InputField