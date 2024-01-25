import { Text, View, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeProvider'

const ShopItem = ({ onChoice, name, category }) => {
	const { themeStyles } = useTheme()

	return (
		<Pressable onPress={onChoice}>
			<View style={[styles.row, themeStyles.border]}>
				<View style={styles.column}>
					<Text style={[styles.text, styles.name, themeStyles.text]}>{name}</Text>
				</View>
				<View style={styles.column}>
					<Text style={[styles.text, themeStyles.text]}>{category}</Text>
				</View>
			</View>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	row: {
		padding: 5,
		marginBottom: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderWidth: 1
	},
	column: {
		flexBasis: '50%',
	},
	text: {
		fontSize: 18,
		textAlign: 'center',
	},
	name: {
		fontWeight: 'bold'
	}
})

export default ShopItem