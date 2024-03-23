import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { useTheme } from '../context/ThemeProvider'
import { useAuth } from '../context/UserProvider'
import Loading from './Loading'
import Navigator from './Navigator'
import SignInScreen from './auth/SignIn'
import SignUpScreen from './auth/SignUp'
import ProductSales from './productSales/ProductSales'
import Shop from './shop/Shop'
import DateReport from './dateReport/DateReport.jsx'
import UserPage from './admin/users/UserPage.jsx'

const Stack = createNativeStackNavigator()

const Layout = () => {
	const { isLoading, isSignedIn, isAdmin } = useAuth()
	const { theme } = useTheme()

	return (
		<>
			<StatusBar />
			<PaperProvider theme={theme}>
				<NavigationContainer theme={theme}>
					<Stack.Navigator>
						{
							!isLoading ?
								(
									isSignedIn ?
										<>
											<Stack.Screen name='Navigator' options={{ headerShown: false }} component={Navigator} />
											<Stack.Screen name='Shop' options={{ title: 'Магазин' }} component={Shop} />
											<Stack.Screen name='ProductSales' component={ProductSales} />
											<Stack.Screen name='Report' component={DateReport} />
											<Stack.Screen name='User' options={{ title: 'Работник' }} component={UserPage} />
										</>
										:
										<>
											<Stack.Screen name='SignIn' component={SignInScreen} options={{ title: 'Вход' }} />
											<Stack.Screen name='SignUp' component={SignUpScreen} options={{ title: 'Регистрация' }} />
										</>
								)
								:
								<Stack.Screen name='Loading' component={Loading} options={{ headerShown: false }} />
						}
					</Stack.Navigator>
				</NavigationContainer>
			</PaperProvider>
		</>
	)
}

export default Layout