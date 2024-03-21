import { useNavigation } from '@react-navigation/native'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native"
import Table from "../../components/table/Table"
import { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeProvider'

const ShopsList = ({ onRefresh, isRefreshing, data }) => {
	const navigation = useNavigation()
	const [tableData, setTableData] = useState()
	const { themeStyles } = useTheme()

	useEffect(() => {
		if (!data || !data.length) return setTableData(undefined)
		const newData = {
			titles: Object.keys(data[0]).filter(title => title === 'name' || title === 'phone' || title === 'address'),
			body: data
		}
		setTableData(newData)
	}, [data])

	const handleMarketChoice = (id) => {
		const marketInfo = data.find(market => market.id === id)
		navigation.navigate('Shop', { shop: marketInfo })
	}

	return (
		<ScrollView
			refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
			contentContainerStyle={{ flex: 1 }}
		>
			{data ? (
				tableData ? <Table
					data={tableData}
					onRowPress={handleMarketChoice}
				/> : (
					<View style={styles.container}>
						<Text style={themeStyles.text}>Список пуст!</Text>
					</View>
				)
			) : (
				<View style={styles.container}>
					<Text style={themeStyles.text}>Загрузка...</Text>
				</View>
			)}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
})

export default ShopsList