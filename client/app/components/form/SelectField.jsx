import { useField } from 'formik'
import DropDown from 'react-native-input-select'
import { useTheme } from '../../context/ThemeProvider'

const SelectField = (props) => {
	const { themeStyles } = useTheme()
	const [field, meta, helpers] = useField(props)
	const { error, touched } = meta
	const handleChange = (item) => {
		helpers.setValue(item)
	}
	return (
		<DropDown
			isSearchable
			options={props.options}
			onValueChange={handleChange}
			selectedValue={field.value}
			placeholderStyle={{ ...themeStyles.text, fontSize: 16 }}
			selectedItemStyle={{ ...themeStyles.text, fontSize: 16 }}
			checkboxComponentStyles={{
				checkboxLabelStyle: themeStyles.text
			}}
			dropdownStyle={{
				...themeStyles.background,
				borderRadius: null,
				paddingVertical: 10,
				paddingHorizontal: 10,
				minHeight: 0,
				borderColor: error && touched ? 'red' : themeStyles.border.borderColor,
			}}
			modalOptionsContainerStyle={themeStyles.background}
			dropdownContainerStyle={{ marginBottom: 5 }}
			dropdownIconStyle={{ display: 'none' }}
			searchControls={{
				textInputProps: {
					placeholderTextColor: themeStyles.text.color
				}
			}}
			searchInputStyle={{ ...themeStyles.text, ...themeStyles.background, ...themeStyles.border }}
			{...props}
		/>
	)
}

export default SelectField