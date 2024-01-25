import {
	DarkTheme as NavigationDarkTheme,
	DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme, Appearance, StyleSheet } from 'react-native'
import {
	MD3DarkTheme,
	MD3LightTheme,
	adaptNavigationTheme,
} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { LightTheme, DarkTheme } = adaptNavigationTheme({
	reactNavigationLight: NavigationDefaultTheme,
	reactNavigationDark: NavigationDarkTheme,
})
const CombinedDefaultTheme = {
	...MD3LightTheme,
	...LightTheme,
	colors: {
		...MD3LightTheme.colors,
		...LightTheme.colors,
	},
}
const CombinedDarkTheme = {
	...MD3DarkTheme,
	...DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		...DarkTheme.colors,
	},
}

const ThemeContext = createContext()
export const useTheme = () => {
	return useContext(ThemeContext)
}

const ThemeProvider = ({ children }) => {
	const colorScheme = useColorScheme()
	const [isDark, setIsDark] = useState(colorScheme === 'dark')

	const toggleTheme = () => { setIsDark(prevIsDark => !prevIsDark) }

	useEffect(() => {
		AsyncStorage.getItem('current theme')
			.then(async (value) => {
				if (value !== null) setIsDark(value === 'dark')
				else await AsyncStorage.setItem('current theme', colorScheme)
			})
			.catch(error => console.error(error))

		Appearance.addChangeListener(appearance => setIsDark(appearance.colorScheme === 'dark'))
	}, [])

	useEffect(() => {
		AsyncStorage.setItem('current theme', isDark ? 'dark' : 'light')
	}, [isDark])

	const theme = isDark ? CombinedDarkTheme : CombinedDefaultTheme
	const providerValue = {
		isDark,
		theme,
		toggleTheme,
		themeStyles: createStyleSheet(theme.colors)
	}

	return (
		<ThemeContext.Provider value={providerValue}>
			{children}
		</ThemeContext.Provider>
	)
}

const createStyleSheet = (colors) => StyleSheet.create({
	text: {
		color: colors.text
	},
	background: {
		backgroundColor: colors.background
	},
	border: {
		borderColor: colors.border
	},
	shadow: {
		shadowColor: colors.shadow
	}
})

export default ThemeProvider