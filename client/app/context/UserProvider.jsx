import { createContext, useContext, useEffect, useReducer } from "react"
import { authorizeUser } from "../../api/auth.js"

const UserContext = createContext()
const UserUpdateContext = createContext()

export const useAuth = () => {
	return useContext(UserContext)
}
export const useAuthUpdate = () => {
	return useContext(UserUpdateContext)
}

const userReducer = (state, action) => {
	switch (action.type) {
		case 'login': {
			return {
				...state,
				isLoading: false,
				isSignedIn: true,
				isAdmin: action.setAdmin || state.isAdmin
			}
		}
		case 'logout': {
			return {
				...state,
				isSignedIn: false,
				isAdmin: false,
				isLoading: false
			}
		}
		case 'adminCheck': {
			return {
				...state,
				isAdmin: action.setAdmin
			}
		}
	}
	throw Error('Unknown action: ' + action.type)
}

const UserProvider = ({ children }) => {
	const initialState = { isLoading: true, isSignedIn: false, isAdmin: false }
	const [userState, dispatch] = useReducer(userReducer, initialState)

	useEffect(() => {
		authorizeUser()
			.then(response => {
				dispatch({ type: 'login', setAdmin: response.isAdmin })
			})
			.catch((error) => {
				dispatch({ type: 'logout' })
			})
	}, [])

	return (
		<UserContext.Provider value={userState}>
			<UserUpdateContext.Provider value={dispatch}>
				{children}
			</UserUpdateContext.Provider>
		</UserContext.Provider>
	)
}

export default UserProvider