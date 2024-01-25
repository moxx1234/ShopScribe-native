import { TextInput } from "react-native"

const PasswordField = ({ onChange, onBlur, name, value, style }) => {
	return (
		<TextInput
			style={style}
			onChangeText={onChange(name)}
			onBlur={onBlur(name)}
			value={value.replace(/\s/g, '')}
			inputMode="text"
			autoCapitalize='none'
			autoCorrect={false}
			secureTextEntry={true}
			textContentType="password"
		/>
	)
}

export default PasswordField