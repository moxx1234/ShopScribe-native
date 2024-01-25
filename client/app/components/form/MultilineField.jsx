import { TextInput } from "react-native"

const MultilineField = ({ onChange, onBlur, name, value, style }) => {
	return (
		<TextInput
			style={[style, { textAlignVertical: 'top' }]}
			onChangeText={onChange(name)}
			onBlur={onBlur(name)}
			value={value.replace(/\s\s/g, ' ')}
			multiline
			numberOfLines={4}
		/>
	)
}

export default MultilineField