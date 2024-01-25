import { useNavigation } from '@react-navigation/native'
import { RefreshControl, ScrollView, Text } from "react-native"
import Table from "../../components/table/Table"

const ShopsList = ({ onRefresh, isRefreshing, data }) => {
	const navigation = useNavigation()

	const tableData = {
		titles: data?.length && Object.keys(data[0]).filter(title => title === 'name' || title === 'phone' || title === 'address'),
		body: data
	}

	const handleMarketChoice = (id) => {
		const marketInfo = data.find(market => market.id === id)
		navigation.navigate('Shop', { shop: marketInfo })
	}

	return (
		data ?
			data.length ?
				<ScrollView refreshControl={
					<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
				}
				>
					<Table data={tableData} onRowPress={handleMarketChoice} />
				</ScrollView>
				:
				<Text>В списке нет магазинов!</Text>
			: <Text>Загрузка...</Text>
	)
}

export default ShopsList