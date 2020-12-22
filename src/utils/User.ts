
import { Storage, Client, Hasher } from './'
import { User } from '../models'

export class Users {
	public static getCurrentUser = async (): Promise<(User) | null> => {
		const hashedUserData = Storage.get('user_data') as string | null
		let userData = hashedUserData ? Hasher.decode(hashedUserData) : null
		if (userData && userData.expDate > Date.now() && !userData.expired) {
			return userData
		}

		const userToken = Storage.get('user_token')
		if (userToken === null) {
			return null
		}

		let user = null as (User) | null
		try {
			user = await Client.User.getByToken(userToken)
			userData = user as any
			console.log(userData)
            // Expire in one minute
            const expDate = new Date()
			userData.expDate = expDate.setDate(expDate.getDate() + 7)
			userData.expired = false

			Storage.set('user_data', Hasher.encode(userData))
		} catch (e) {}

		return user
	}

	public static logOut = () => {
		Storage.remove('user_token')
		Storage.remove('user_data')
	}

	public static updateUserData = async () => {
		const userToken = Storage.get('user_token')
		let user = null as (User) | null
		try {
            user = await Client.User.getByToken(userToken)
			let userData = user as any
            // Expire in one minute
            const expDate = new Date()
			userData.expDate = expDate.setDate(expDate.getDate() + 7)
			userData.expired = false

			Storage.set('user_data', Hasher.encode(userData))
		} catch (e) {}
	}

	public static getUserToken = () => Storage.get('user_token')
	public static hasUserToken = () => Storage.has('user_token')
	public static setUserToken = (userToken: string) => Storage.set('user_token', userToken)
}
