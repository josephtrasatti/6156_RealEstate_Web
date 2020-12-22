import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import './OnSignUp.css';
import { Hasher } from '../../utils/Hasher'
import URI from 'urijs'
import { Client, Objects, Users } from '../../utils';
import { TextInput } from '../../components/forms'

export const OnSignUp = () => {

    const location = useLocation()
    const history = useHistory()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showError, setShowError] = useState(false)

    const [userToken, setUserToken] = useState(undefined as string | null | undefined)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [position, setPosition] = useState('')
    const [landLordId, setLandLordId] = useState('')


    useEffect(() => {
        setLoading(true)

        try {
            const decodedDetails = Hasher.decode(URI(window.location.href).query(true)['details'] as string) as {
				id: string
				accessToken: string
				email: string
				firstName: string
				lastName: string
				expiryTime?: number
            }
            if (!decodedDetails || (decodedDetails.expiryTime && decodedDetails.expiryTime < Date.now())) {
                history.push('/profile')
            }
            else {
                setPassword(decodedDetails.id)
				setEmail(decodedDetails.email)
				setFirstName(decodedDetails.firstName)
                setLastName(decodedDetails.lastName)
                
                Client.User.logIn(decodedDetails.id, decodedDetails.email).then(({ token }) => {
                    if (token) {
                        console.log('token', token)
                        setUserToken(token)
                    }
                    else {
                        console.log('token1', token)
                        setLoading(false)
                    }
                }).catch((e) => {
                    setLoading(false)
                })
            }
        } catch (e) {
			history.push('/login')
		}
    }, [location.pathname, history])

    useEffect(() => {
        if (!Objects.isNullish(userToken)) {
            Users.setUserToken(userToken!)
            history.push('/profile')
        }
    }, [userToken, history])

    const createAccount = async () => {
        try{
            Client.User.signUp(password, firstName, lastName, email, position, landLordId).then(({ token }) => {
                setUserToken(token)
            })
        } catch (e) {
            setShowError(true)
            setError('Signup failed.')
        }
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
        <div>
            <div className='inputArea'>
                <h1>Before we get started please confirm your info:</h1>
                <div className='inputList'>
                    <TextInput
                        value={email}
                        label={'Email'}
                        errorLabel={'Invalid email name.'}
                        onChange={(t) => setEmail(t)}
                        required
                    />
                    <TextInput
                        value={firstName}
                        label={'First Name'}
                        errorLabel={'Invalid first name.'}
                        onChange={(t) => setFirstName(t)}
                        required
                    />
                    <TextInput
                        value={lastName}
                        label={'Last Name'}
                        errorLabel={'Invalid last name.'}
                        onChange={(t) => setLastName(t)}
                        required
                    />
                    <TextInput
                        value={position}
                        label={'Position'}
                        errorLabel={'Invalid position.'}
                        onChange={(t) => setPosition(t)}
                        required
                    />
                    <TextInput
                        value={landLordId}
                        label={'LandLordId'}
                        errorLabel={'Invalid landLordId.'}
                        onChange={(t) => setLandLordId(t)}
                        required
                    />


                </div>

                <button onClick={createAccount} className='accountButton'>Create Account</button>
            </div>
        </div>
    )
}