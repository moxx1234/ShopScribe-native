import { ScrollView, View, Text, RefreshControl, StyleSheet } from "react-native"
import Table from "../../components/table/Table"
import { useEffect, useState } from "react"
import { useTheme } from "../../context/ThemeProvider"

const ProductsList = ({ onRefresh, isRefreshing, data }) => {
	const [tableData, setTableData] = useState()
	const { themeStyles } = useTheme()

	useEffect(() => {
		if (!data || !data.length) return setTableData(undefined)
		const newData = {
			titles: Object.keys(data[0]).filter(title => title === 'name' || title === 'quantity' || title === 'price' || title === 'units'),
			body: data
		}
		setTableData(newData)
	}, [data])

	return (
		<ScrollView
			refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isRefreshing} />}
			contentContainerStyle={{ flex: 1 }}
		>
			{data ? (
				tableData ? <Table
					data={tableData}
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

export default ProductsList