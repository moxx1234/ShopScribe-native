import { TextInput } from "react-native"

const PhoneField = ({ onChange, onBlur, name, value, style }) => {
	return (
		<TextInput
			style={style}
			onChangeText={onChange(name)}
			onBlur={onBlur(name)}
			value={value.replace(/\s\s/g, ' ')}
			inputMode="tel"
		/>
	)
}

export default PhoneField