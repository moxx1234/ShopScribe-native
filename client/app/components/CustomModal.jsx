import { Modal, View, Text, StyleSheet } from "react-native"
import IconButton from "./IconButton"
import Entypo from 'react-native-vector-icons/Entypo'
import { useTheme } from "../context/ThemeProvider"

const CustomModal = ({ title, children, isOpen, onClose }) => {
	const { themeStyles } = useTheme()

	return (
		<Modal
			visible={isOpen}
			onRequestClose={onClose}
			animationType="fade"
			transparent={true}
		>
			<View style={[styles.modalView, themeStyles.shadow, themeStyles.background]}>
				{title && <View style={[styles.header, themeStyles.border]}>
					<Text style={[styles.title, themeStyles.text]}>{title}</Text>
					<IconButton
						Icon={Entypo}
						name='cross'
						size={30}
						onPress={onClose}
						style={themeStyles.text}
					/>
				</View>}
				<View style={styles.body}>{children}</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalView: {
		flex: 1,
		margin: 20,
		borderRadius: 20,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 10,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		padding: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold'
	},
	body: {
		padding: 10,
		flex: 1,
	}
})

export default CustomModal