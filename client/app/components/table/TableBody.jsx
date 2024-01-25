import React from 'react'
import { DataTable } from 'react-native-paper'

const TableBody = ({ data, onRowPress }) => {
	const { body, titles } = data
	return (
		body.map(row => {
			return (
				<DataTable.Row key={row.id} onPress={() => onRowPress(row.id)}>
					{titles.map((column, index) => (
						<DataTable.Cell key={index}>{row[column]}</DataTable.Cell>
					))}
				</DataTable.Row>
			)
		})
	)
}

export default TableBody