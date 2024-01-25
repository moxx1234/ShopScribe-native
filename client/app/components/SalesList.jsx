import { useNavigation } from '@react-navigation/native'
import { getFormattedDate } from '../helpers/formatDate'
import Table from './table/Table'

const SalesList = ({ sales }) => {
	const navigation = useNavigation()

	const data = sales.map(sale => {
		sale.date = getFormattedDate(new Date(sale.createdAt))
		return sale
	})

	const tableData = {
		titles: Object.keys(data[0]).filter(title => (title !== 'id' && title !== 'shop' && title !== 'product_sales' && title !== 'createdAt')),
		body: data.map(sale => {
			const { shop, product_sales, ...rest } = sale
			return rest
		})
	}

	const handleRowPress = (rowId) => {
		const chosenSale = data.find(sale => sale.id === rowId)
		navigation.navigate('ProductSales', { saleInfo: chosenSale })
	}

	return (
		<Table data={tableData} onRowPress={handleRowPress} />
	)
}

export default SalesList