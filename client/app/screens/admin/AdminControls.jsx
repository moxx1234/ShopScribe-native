import { Text } from 'react-native'
import { authorizeAdmin } from '../../../api/auth'
import { useAuthUpdate } from '../../context/UserProvider'
import { useEffect } from 'react'

const AdminControls = ({ navigation }) => {
	const updateUser = useAuthUpdate()

	useEffect(() => {
		authorizeAdmin().catch(error => {
			console.error(error)
			navigation.navigate('Home')
			updateUser({ type: 'checkAdmin', setAdmin: false })
		})
	}, [])

	return (
		<Text>Admin Controls</Text>
	)
}

export default AdminControls