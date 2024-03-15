import { StyleSheet, Switch, Text, TextInput, View } from "react-native"
import { useTheme } from "../../context/ThemeProvider"

const SwitchInput = ({ switchTitle, inputLabel, onChange, value, isEnabled, onToggle }) => {
	const { themeStyles } = useTheme()

	return (
		<View style={styles.wrapper}>
			<View style={styles.container}>
				<Text style={[themeStyles.text, styles.label]}>{switchTitle}</Text>
				<Switch
					onValueChange={onToggle}
					value={isEnabled}
				/>
			</View>
			{
				isEnabled && (
					<View style={styles.container}>
						<Text style={[styles.label, themeStyles.text]}>{inputLabel}:</Text>
						<TextInput
							onChangeText={onChange}
							value={value}
							inputMode="numeric"
							style={[styles.input, themeStyles.border, themeStyles.text]}
						/>
					</View>
				)
			}
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		gap: 10,
		marginTop: 10,
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		justifyContent: 'flex-end'
	},
	label: {
		fontSize: 20
	},
	input: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderWidth: 1,
		flexGrow: 1
	},
})

export default SwitchInput