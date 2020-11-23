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
            clientId="76770001645-gpp2vkat48bk8o42b1d782kq96m3q0q2.apps.googleusercontent.com"
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