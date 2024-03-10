import { useLayoutEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as yup from 'yup'
import { authorizeAdmin } from '../../../api/auth'
import { createOrg, createUser, getOrgUsers } from '../../../api/organizations'
import CustomModal from '../../components/CustomModal'
import Form from '../../components/form/Form'
import InputGroup from '../../components/form/InputGroup'
import SubmitButton from '../../components/form/SubmitButton'
import { useTheme } from '../../context/ThemeProvider'
import { useAuthUpdate } from '../../context/UserProvider'
import CreateUserForm from './users/CreateUserForm'
import UsersList from './users/UsersList'

const AdminControls = ({ navigation }) => {
	const { themeStyles } = useTheme()
	const updateUser = useAuthUpdate()
	const [organization, setOrganization] = useState()
	const [isRefreshing, setIsRefreshing] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const initialValues = { organization: '' }
	const schema = yup.object({
		organization: yup.string().trim().required('Введите название огранизации')
	})

	useLayoutEffect(() => {
		authorizeAdmin()
			.catch(error => {
				console.error(error)
				navigation.navigate('Home')
				updateUser({ type: 'checkAdmin', setAdmin: false, permissions: null })
			})
		handleRefresh()
	}, [])

	const handleRefresh = () => {
		setIsRefreshing(true)
		getOrgUsers()
			.then(response => {
				// response type: { organizationName: user[] } || {}
				const org = Object.keys(response)[0]
				if (!org) return
				setOrganization({ [org]: Object.values(response)[0] })
			})
			.catch(error => alert(error))
			.finally(() => setIsRefreshing(false))
	}

	const handleSubmit = (values, onSubmitProps) => {
		createOrg(values)
			.then(() => handleRefresh())
			.catch(error => {
				if (error.field) return onSubmitProps.setErrors({ [error.field]: [error.message] })
				alert(error)
			})
			.finally(() => onSubmitProps.setSubmitting(false))
	}

	const handleUserCreate = (values, onSubmitProps) => {
		const userData = Object.entries(values).reduce((result, [field, value]) => result = ({ ...result, [field]: value.trim() }), {})
		createUser(userData)
			.finally(() => onSubmitProps.setSubmitting(false))
	}

	return (
		<ScrollView
			refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
		>
			{
				organization ? (
					<View>
						<CustomModal
							isOpen={isModalOpen}
							title='Добавить работника'
							onClose={() => setIsModalOpen(false)}
						>
							<CreateUserForm onSubmit={handleUserCreate} />
						</CustomModal>
						<View style={styles.container}>
							<Text
								style={[themeStyles.text, styles.title]}
							>
								Организация: {Object.keys(organization)[0]}
							</Text>
							<TouchableOpacity style={styles.buttonContainer} onPress={() => setIsModalOpen(true)} >
								<Text style={styles.buttonText}>Добавить работника +</Text>
							</TouchableOpacity>
						</View>
						<UsersList users={Object.values(organization)[0]} />
					</View>
				)
					: (
						<Form
							initialValues={initialValues}
							schema={schema}
							onSubmit={handleSubmit}
						>
							<InputGroup name='organization' label='Организация' type='text' />
							<SubmitButton title='Подтвердить' />
						</Form>
					)
			}
		</ScrollView>)
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		gap: 5
	},
	title: {
		fontSize: 24
	},
	buttonContainer: {
		backgroundColor: 'rgb(0,122,255)',
		borderRadius: 5,
		padding: 5,
	},
	buttonText: {
		color: '#fff'
	},
})

export default AdminControls