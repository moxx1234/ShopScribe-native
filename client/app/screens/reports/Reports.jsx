import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Alert, RefreshControl, ScrollView } from "react-native"
import { authorizeAdmin } from '../../../api/auth'
import { getSales } from "../../../api/organizations"
import Table from "../../components/table/Table"
import { useAuthUpdate } from '../../context/UserProvider'
import { getFormattedDate } from "../../helpers/formatDate"

const Reports = () => {
	const updateUser = useAuthUpdate()
	const [sales, setSales] = useState()
	const [isRefreshing, setIsRefreshing] = useState(false)
	const navigation = useNavigation()

	useEffect(() => {
		refresh()
		authorizeAdmin()
			.catch(error => {
				console.error(error)
				navigation.navigate('Home')
				updateUser({ type: 'checkAdmin', setAdmin: false })
			})
	}, [])

	const refresh = () => {
		setIsRefreshing(true)
		getSales()
			.then(response => { setSales(response.sales) })
			.catch(error => {
				if (error.message) return Alert.alert('Ошибка', error.message)
				Alert.alert('Ошибка', JSON.stringify(error))
			})
			.finally(() => setIsRefreshing(false))
	}

	const createTableBody = (data) => {
		const dayTotals = data.reduce((result, item) => {
			const { createdAt, total, debt } = item
			const date = getFormattedDate(new Date(createdAt))
			if (result[date]) {
				result[date] = {
					total: result[date].total + total,
					debt: result[date].debt + debt
				}
			}
			else result[date] = { total, debt }
			return result
		}, {})
		return Object.entries(dayTotals).map(([day, { total, debt }]) => ({ id: day, 'Дата': day, 'Сумма': total, 'Долг': debt }))
	}

	const tableData = {
		titles: ['Дата', 'Сумма', 'Долг'],
		body: sales && createTableBody(sales)
	}

	const handleDateSelect = (date) => {
		const desiredSales = sales.filter(marketSale => getFormattedDate(new Date(marketSale.createdAt)) === date)
		navigation.navigate('Report', { sales: desiredSales, date })
	}
	return (
		<ScrollView
			refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
		>
			{sales && <Table data={tableData} onRowPress={handleDateSelect} />}
		</ScrollView>
	)
}

export default Reports