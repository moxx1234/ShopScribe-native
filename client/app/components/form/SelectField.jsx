import { useField } from 'formik'
import React, { useState } from 'react'
import DropDown from 'react-native-input-select'

const SelectField = (props) => {
	const [field, meta, helpers] = useField(props)
	const handleChange = (item) => {
		helpers.setValue(item)
	}
	return (
		<DropDown
			isSearchable
			options={props.options}
			onValueChange={handleChange}
			selectedValue={field.value}
			{...props}
		/>
	)
}

export default SelectField