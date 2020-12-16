import React from 'react';
import './GoogleButton.css'
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login';

interface GoogleButtonProps {
	text?: string
	className?: string
	onSuccess: (res: {
		id: string
		accessToken: string
		email: string 
		firstName: string
		lastName: string
		profilePicture?: string
	}) => void
}

export const GoogleButton = (props: GoogleButtonProps) => {

    const responseGoogle = (res: GoogleLoginResponse)  => {
        props.onSuccess({
			id: res.googleId,
			accessToken: res.accessToken,
			email: res.profileObj.email,
			firstName: res.profileObj.givenName,
			lastName: res.profileObj.familyName,
			profilePicture: res.profileObj.imageUrl || '',
        })
    }



    return (
        <GoogleLogin
            clientId="76770001645-gpp2vkat48bk8o42b1d782kq96m3q0q2.apps.googleusercontent.com"
            render={renderProps => (
                <button className={props.className} onClick={renderProps.onClick} disabled={renderProps.disabled}>{props.text}</button>
            )}
            buttonText="Login"
            onSuccess={responseGoogle as any}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />
    )
}