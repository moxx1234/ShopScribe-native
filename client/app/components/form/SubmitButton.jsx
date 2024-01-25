import { useFormikContext } from 'formik'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const SubmitButton = ({ title }) => {
	const { isSubmitting, isValid, touched, handleSubmit } = useFormikContext()
	const disabled = isSubmitting || (Object.values(touched).some(value => value === true) && !isValid)
	return (
		<TouchableOpacity disabled={disabled} onPress={handleSubmit} style={[styles.button, disabled && styles.disabled]}>
			<Text style={styles.text}>{title}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: 'rgb(0,122,255)',
		padding: 10,
		borderRadius: 10,
	},
	disabled: {
		opacity: 0.5,
	},
	text: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 20
	},
})

export default SubmitButton