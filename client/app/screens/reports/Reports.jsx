import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { authorizeAdmin } from '../../../api/auth'
import { getDeals } from "../../../api/sales"
import Table from "../../components/table/Table"
import { useAuthUpdate } from '../../context/UserProvider'
import { getFormattedDate } from "../../helpers/formatDate"

const Reports = () => {
	const updateUser = useAuthUpdate()
	const [sales, setSales] = useState()
	const navigation = useNavigation()

	useEffect(() => {
		getDeals()
			.then(response => setSales(response.sales))
			.catch(error => console.error(error))
		authorizeAdmin()
			.catch(error => {
				console.error(error)
				navigation.navigate('Home')
				updateUser({ type: 'checkAdmin', setAdmin: false })
			})
	}, [])

	const createTableBody = (data) => {
		const dayTotals = data.reduce((result, item) => {
			const { createdAt, total } = item
			const date = getFormattedDate(new Date(createdAt))
			if (result[date]) result[date] += total
			else result[date] = total
			return result
		}, {})
		return Object.entries(dayTotals).map(([day, total]) => ({ id: day, 'Дата': day, 'Сумма': total }))
	}

	const tableData = {
		titles: ['Дата', 'Сумма'],
		body: sales && createTableBody(sales)
	}

	const handleDateSelect = (date) => {
		const desiredSales = sales.filter(marketSale => getFormattedDate(new Date(marketSale.createdAt)) === date)
		navigation.navigate('Report', { sales: desiredSales, date })
	}
	return (
		sales && <Table data={tableData} onRowPress={handleDateSelect} />
	)
}

export default Reports