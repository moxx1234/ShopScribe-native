import 'react-native-gesture-handler'
import React from 'react'
import View from 'react-native'
import UserProvider from './app/context/UserProvider'
import Layout from './app/screens/Layout'
import ThemeProvider from './app/context/ThemeProvider'

const App = () => {

	return (
        <ThemeProvider>
            <UserProvider>
                <Layout />
            </UserProvider>
        </ThemeProvider>
	)
}

export default App