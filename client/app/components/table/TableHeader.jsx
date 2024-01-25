import React from 'react'
import { DataTable } from 'react-native-paper'

const TableHeader = ({ titles }) => {
	return (
		<DataTable.Header>
			{titles.map((title, index) => (
				<DataTable.Title key={index}>{title}</DataTable.Title>
			))}
		</DataTable.Header>
	)
}

export default TableHeader