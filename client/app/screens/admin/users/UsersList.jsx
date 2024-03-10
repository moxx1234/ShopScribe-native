import { View } from "react-native"
import Table from "../../../components/table/Table"
import { useNavigation } from "@react-navigation/native"

const UsersList = ({ users }) => {
	const navigation = useNavigation()

	const tableData = users.reduce((result, user) => {
		if (!result.titles) result = { ...result, titles: ['login', 'name'] }
		return result = {
			...result,
			body: [...result.body, { login: user.login, name: user.name || '-', id: user.id }]
		}
	}, { body: [] })

	const handleUserChoice = (id) => {
		const userInfo = users.find(user => user.id === id)
		navigation.navigate('User', { user: userInfo })
	}

	return (
		<View>
			<Table data={tableData} onRowPress={handleUserChoice} />
		</View>
	)
}

export default UsersList