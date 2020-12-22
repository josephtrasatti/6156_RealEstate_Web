import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import './Profile.css';
import { Client, Users } from '../../utils'
import { User } from '../../models'
import { TextInput } from '../../components/forms';

interface Suggestion {
    city: string,
    entries: number,
    secondary: string,
    state: string,
    street_line: string,
    zipcode: string
}

const getUserInfo = async () => {
	return await Users.getCurrentUser()
}

const KEY = "45845494968185145"

export const Profile = () => {
	const history = useHistory()
	const location = useLocation()

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [showError, setShowError] = useState(false)

	const [didSetUserInfo, setDidSetUserInfo] = useState(false)
    const [userInfo, setUserInfo] = useState(null as User | null)
    
    const [streetName, setStreetName] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [suggestions, setSuggestions] = useState([] as Suggestion[])

	useEffect(() => {
		setLoading(true)
		if (!didSetUserInfo) {
            console.log('test')
			setDidSetUserInfo(true)
			getUserInfo().then((user) => {
				setUserInfo(user)
				setLoading(false)
			}).catch((e) => {
				setShowError(true)
				setError(e)
				setLoading(false)
			})
		}
		else {
			setLoading(false)
		}
    }, [didSetUserInfo, location.pathname])
    
    useEffect(() => {
        //getSuggestions(streetName).then(suggestions => setSuggestions(suggestions))
        if (streetName) {
            const search = encodeURI(streetName)
            const uri = `https://us-autocomplete-pro.api.smartystreets.com/lookup?key=${KEY}&search=${search}&max_results=10&`
            console.log(uri)
            fetch(uri)
                .then(res => res.json())
                .then(data => setSuggestions(data['suggestions'] as Suggestion[]))
        }
    }, [streetName])

    const fillInfo = (suggestion: Suggestion) => {
        setStreetName(suggestion.street_line)
        setState(suggestion.state)
        setCity(suggestion.city)
        setZipcode(suggestion.zipcode)
    }

    const checkAddress = async () => {
        await Client.User.checkAddress(streetName, city, state, zipcode).then(res => console.log(res))
    }

	return showError ? (
		<div>
            Sorry, something went wrong. Here is the error: {error}
        </div>
	) : loading ? (
		<div>
            Loading...
        </div>
	) :  (
		<div className="root">
			<div className="profileArea">
				<div>
					{userInfo &&
					<div className={'userInfo'}>
						<h1>{userInfo.firstName} {userInfo.lastName} </h1>
					</div>
            		}
        		</div>
                <div>
					<button onClick={() => {
						Users.logOut()
						setDidSetUserInfo(false)
						setUserInfo(null)
						history.push('/login')
					}
					}>Logout</button>
				</div>
                <div>
                    {userInfo && !userInfo.addressId &&
                    <div>
                        Street Name*
                        <input
                            value={streetName}
                            onChange={(t) => setStreetName(t.target.value)}
                        />
                    </div>
                    }
                    {suggestions.map(suggestion => {
                        return (
                            <button onClick={() => fillInfo(suggestion)}>{suggestion.street_line}{suggestion.city}{suggestion.state}</button>
                        )
                    })}
                    <div>
                        City*
                        <input
                            value={city}
                            onChange={(t) => setCity(t.target.value)}
                            required
                        />
                    </div>
                    <div>
                        State*
                        <input
                            value={state}
                            onChange={(t) => setState(t.target.value)}
                            required
                        />
                    </div>
                    <div>
                        Zip Code*
                        <input
                            value={zipcode}
                            onChange={(t) => setState(t.target.value)}
                            required
                        />
                    </div>
                    <button onClick={() => checkAddress()}>Enter Address</button>
                </div>
			</div>
		</div>
	)

}

