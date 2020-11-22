import React from 'react';
import './Login.css';
import { Hasher } from '../../utils/Hasher'
import { GoogleButton } from '../../components/buttons/GoogleButton';
import { useHistory } from 'react-router';

export const Login = () => {

    const history = useHistory()


    const onSuccessSignUp = (res: {
        id: string
        accessToken: string
        email: string
        firstName: string
        lastName: string
        profilePicture?: string
    }) => {
        const hash = Hasher.encode(res)
        // history.push(`/TeamSelection?details=${hash}`)
    }


    return (
        <div className="login-page">
            <div className="login-area">
                <h1 className="login-title">Welcome to RealEstate</h1>
                <GoogleButton btnText='Sign up as Super' css="gbuttonSignup" onSuccess={onSuccessSignUp}/>
                <GoogleButton btnText='Sign up as Tenant ' css="gbuttonSignup"/>
            </div>
        </div>
        
    )
}