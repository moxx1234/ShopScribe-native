import { TextInput } from "react-native"

const TextField = ({ onChange, onBlur, name, value, style }) => {
	return (
		<TextInput
			style={style}
			onChangeText={onChange(name)}
			onBlur={onBlur(name)}
			value={value.replace(/\s\s/g, ' ')}
			inputMode="text"
		/>
	)
}

export default TextField