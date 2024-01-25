import { Text, TouchableOpacity } from "react-native"

const IconButton = ({ name, style, size, Icon, onPress }) => {
	return (
		<TouchableOpacity onPress={onPress} style={style} >
			<Text>
				<Icon
					name={name}
					size={size}
					style={[style, { backgroundColor: 'transparent' }]}
				/>
			</Text>
		</TouchableOpacity>
	)
}

export default IconButton