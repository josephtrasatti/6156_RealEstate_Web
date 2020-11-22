import React from 'react';
import './GoogleButton.css'
import { GoogleLogin } from 'react-google-login';



export const GoogleButton = (props:any) => {

    const responseGoogle = (response: any) => {
        props.onSuccess({
            id: response.googleId,
            accessToken: response.accessToken,
            email: response.profileObj.email,
            firstName: response.profileObj.firstName,
            lastName: response.profileObj.lastName
        })
      }


    return (
        <GoogleLogin
            clientId="75778883083-lkfu282t0fgsg844v6rbkkdlcum3rf96.apps.googleusercontent.com"
            render={renderProps => (
                <button className={props.css} onClick={renderProps.onClick} disabled={renderProps.disabled}>{props.btnText}</button>
            )}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />
    )
}