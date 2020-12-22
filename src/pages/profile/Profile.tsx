import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import './Profile.css';
import { Users } from '../../utils'
import { User } from '../../models'

const getUserInfo = async () => {
	return await Users.getCurrentUser()
}

export const Profile = () => {
	const history = useHistory()
	const location = useLocation()

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [showError, setShowError] = useState(false)

	const [didSetUserInfo, setDidSetUserInfo] = useState(false)
	const [userInfo, setUserInfo] = useState(null as User | null)

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
			</div>
		</div>
	)

}

