import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-paper'
import { endUserSession } from '../../api/auth'
import { useTheme } from '../context/ThemeProvider'
import { useAuth, useAuthUpdate } from '../context/UserProvider'
import AdminControls from './admin/AdminControls'
import Main from './main/Main'
import Products from './products/Products'
import Reports from './reports/Reports'

const Drawer = createDrawerNavigator()

const ThemeIcon = ({ toggleTheme, isDark }) => {

	return (
		<View style={styles.icon}>
			<TouchableOpacity onPress={toggleTheme}>
				<Icon
					source={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'}
					size={40}
					color=''
				/>
			</TouchableOpacity>
		</View>
	)
}

const CustomDrawerContent = (props) => {
	const updateUserState = useAuthUpdate()

	const logout = () => {
		endUserSession()
		updateUserState({ type: 'logout' })
	}

	return (
		<DrawerContentScrollView {...props}>
			<ThemeIcon {...props} />
			<DrawerItemList {...props} />
			<DrawerItem label="Выйти" onPress={() => logout()} />
		</DrawerContentScrollView>
	)
}

const Navigator = () => {
	const { isAdmin } = useAuth()
	const { themeStyles, ...rest } = useTheme()
	return (
		<Drawer.Navigator screenOptions={{ headerTintColor: themeStyles.text.color }} drawerContent={(props) => CustomDrawerContent({ ...props, ...rest })}>
			<Drawer.Screen name='Home' options={{ title: 'Главная' }} component={Main} />
			<Drawer.Screen name='Products' options={{ title: 'Товары' }} component={Products} />
			{
				isAdmin && (
					<>
						<Drawer.Screen name='AdminPanel' options={{ title: 'Панель управления' }} component={AdminControls} />
						<Drawer.Screen name='Reports' options={{ title: 'Отчеты' }} component={Reports} />
					</>
				)
			}
		</Drawer.Navigator>
	)
}

const styles = StyleSheet.create({
	icon: {
		margin: 10,
		flex: 1,
		alignItems: 'flex-end'
	}
})

export default Navigator