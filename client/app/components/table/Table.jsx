import React from 'react'
import { DataTable } from 'react-native-paper'
import TableHeader from './TableHeader'
import TableBody from './TableBody'

const Table = ({ data, onRowPress = () => { } }) => {
	return (
		<DataTable>
			<TableHeader titles={data.titles} />
			<TableBody data={data} onRowPress={onRowPress} />
		</DataTable>
	)
}

export default Table