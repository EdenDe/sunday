// import { showErrorMsg } from '../services/event-bus.service.js'
import { utilService } from '../services/util.service.js'
import { userService } from '../services/user.service.js'

export const userStore = {
	state: {
		users: [],
		user: userService.getLoggedinUser(),
	},
	mutations: {
		setUsers(state, { users }) {
			state.users = users
		},
		setUser(state, { user }) {
			state.user = user
		},
		logoutUser(state) {
			state.user = null
		},
	},
	getters: {
		loggedinUser({ user }) {
			return user
		},
		users({ users }) {
			return users
		},
	},
	actions: {
		async loadUsers({ commit }) {
			try {
				const users = await userService.query()
				commit({ type: 'setUsers', users })
			} catch (err) {
				console.error('Cannot login', err)
				throw err
			}
		},
		async login({ commit }, { credentials }) {
			try {
				const user = await userService.login(credentials)
				commit({ type: 'setUser', user })
			} catch (err) {
				console.error('Cannot login', err)
				throw err
			}
		},
		async signup({ commit }, { credentials }) {
			try {
				const user = await userService.signup(credentials)
				commit({ type: 'setUser', user })
			} catch (err) {
				console.error('Cannot signup', err)
				throw err
			}
		},
		async logout({ commit }) {
			try {
				await userService.logout()
				commit({ type: 'logoutUser' })
			} catch (err) {
				console.error('Cannot logout', err)
				throw err
			}
		},
		fetchUser() {
			console.log(this.loggedinUser)
			return this.loggedinUser
		},
	},
}
