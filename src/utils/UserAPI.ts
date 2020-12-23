import { Objects } from './Objects'
import { User } from '../models'


class UserClient {
	public static logIn = (password: string, email: string): Promise<{ token: string }> => {
		return client('/login', { password, email })
	}

	public static signUp = (
		password: string,
		firstName: string,
		lastName: string,
		email: string,
		position: string,
		landLordId: string
	): Promise<{ token: string }> => {
		return client('/registrations', {
			password,
			firstName,
			lastName,
			email,
			position,
			landLordId
		})
	}

	public static delete = (id: string): Promise<{ success: boolean }> => {
		return client('/user/delete', { id })
	}

	public static getByToken = (token: string): Promise<User> => {
		return client('/user/getbytoken', { token })
	}

	public static editProfile = (
		token: string,
		firstName: string,
		lastName: string,
		phone: string,
		email: string,
		profilePicture?: string,
	): Promise<{ success: boolean }> => {
		return client('/user/editProfile', {
			token,
			firstName,
			lastName,
			phone,
			email,
			profilePicture,
		})
	}


	public static getAll = (token: string): Promise<User[]> => {
		return client('/user/getAll', { token })
	}

	public static getSuggestions = (streetName: string): Promise<string[]> => {
		return client('/address-suggest', { streetName })
	}

	public static checkAddress = (
		street: string,
		city: string,
		state: string,
		zipcode: string
	): Promise<string> => {
		return client('/address-rsp', { 
			street,
			city,
			state,
			zipcode 
		})
	}

	public static addAddress = (
		streetName: string,
		city: string,
		state: string,
		zipcode: string
	): Promise<boolean> => {
		return client('/addresses', { 
			streetName,
			city,
			state,
			zipcode 
		})
	}
	
}


export class Client {
	public static User = UserClient
}


const API_URL = 'https://d2rbw25t7b.execute-api.us-east-1.amazonaws.com/dev/api/customers'
//const API_URL = 'http://localhost:8000'

/**
 * Creates a URI from the endpoint and API URL.
 * @param endpoint The endpoint to append.
 * @returns A string URI to the given endpoint.
 */
const getUri = (endpoint: string): string => {
	let uri = API_URL
	if (uri.lastIndexOf('/') === uri.length - 1) {
		uri = uri.substring(0, uri.length - 1)
	}
	uri += endpoint
	return uri
}

const parseResponse = async (res: Response) => {
	const resText = await res.text()
	if (!res.ok) {
		throw new Error(resText)
	}
	// Return null if the response is null
	if (!resText || resText === 'null') {
		return null
	}
	// Return JSON if the response is JSON
	try {
		const resJson = JSON.parse(resText)
		if (Objects.isObject(resJson)) {
			return resJson
		}
	} catch {}
	// Return text if the response is text
	return resText
}

/**
 * Calls a RealEstate endpoint and returns the result as JSON or text (or null), depending on what it is.
 * @param endpoint The endpoint to call, starting with a /.
 * @param body The body of the request, usually an object.
 * @returns Asynchronously returns a response.
 * @throws An error coming from RealEstate.
 */
export const client = async (endpoint: string, body: any): Promise<any> => {
	if (endpoint.indexOf('/') !== 0) {
		throw new Error('client Error: endpoint must start with a forward slash')
	}
	const uri = getUri(endpoint)
	try {
		const res = await fetch(uri, {
			method: 'POST',
			body: Objects.isObject(body) ? JSON.stringify(body) : body,
			headers: {
				'Content-Type': Objects.isObject(body) ? 'application/json' : 'text/plain',
			},
		})
		return parseResponse(res)
	} catch (e) {
		throw new Error(`RealEstate Error: ${e.toString()}`)
	}
}