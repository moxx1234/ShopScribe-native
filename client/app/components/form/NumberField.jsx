import { TextInput } from "react-native"

const NumberField = ({ onChange, onBlur, name, value, style }) => {
	return (
		<TextInput
			style={style}
			onChangeText={onChange(name)}
			onBlur={onBlur(name)}
			value={value}
			inputMode="numeric"
		/>
	)
}

export default NumberField