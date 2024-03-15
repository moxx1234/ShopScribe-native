import { StyleSheet, Text, View } from "react-native"
import SwitchInput from "../../components/form/SwitchInput"
import { useTheme } from "../../context/ThemeProvider"

const DebtInput = ({ debt, onChange, value, onToggleDept, isDebt }) => {
	const { themeStyles } = useTheme()

	return (
		<View>
			<SwitchInput
				switchTitle='В долг'
				inputLabel='Внесено'
				onChange={onChange}
				value={value}
				onToggle={onToggleDept}
				isEnabled={isDebt}
			/>
			{isDebt && (
				<View style={styles.rowContainer}>
					<Text style={[themeStyles.text, styles.text]}>Долг:</Text>
					<Text style={[themeStyles.text, styles.text, styles.error]}>{debt}</Text>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
		gap: 10,
	},
	text: {
		fontSize: 20
	},
	error: {
		color: 'red'
	},
})

export default DebtInput