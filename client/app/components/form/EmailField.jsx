import { TextInput } from "react-native"

const EmailField = ({ onChange, onBlur, name, value, style }) => {
	return (
		<TextInput
			style={style}
			onChangeText={onChange(name)}
			onBlur={onBlur(name)}
			value={value.replace(/\s/g, '')}
			autoCapitalize='none'
			textContentType='emailAddress'
			keyboardType='email-address'
		/>
	)
}

export default EmailField