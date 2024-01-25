import { Text, StyleSheet, View } from "react-native"
import InputField from "./InputField"
import { useTheme } from "../../context/ThemeProvider"
import { Field, useField } from "formik"

const InputGroup = ({ label, ...props }) => {
	const { themeStyles } = useTheme()
	const [field, meta, helpers] = useField(props)
	const { error, touched } = meta
	const inputStyle = [styles.input, themeStyles.border, themeStyles.text, (error && touched) && styles.errorInput]
	return (
		<View>
			<Text style={[styles.label, themeStyles.text]}>{label}</Text>
			<Field as={InputField} style={inputStyle} {...props} />
			{(error && touched) && <Text style={styles.errorMessage}>{error}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	label: {
		fontSize: 20,
		marginBottom: 5
	},
	input: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderWidth: 1,
		marginBottom: 10,
	},
	errorInput: {
		borderColor: 'red',
		marginBottom: 5,
	},
	errorMessage: {
		marginBottom: 10,
		color: 'red'
	},
})

export default InputGroup