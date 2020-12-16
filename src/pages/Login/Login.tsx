import React, { useState } from 'react';
import './Login.css';
import { Hasher } from '../../utils/Hasher'
import { GoogleButton } from '../../components/buttons/GoogleButton';
import { useHistory } from 'react-router';
import { TextInput } from '../../components/forms'

export const Login = () => {

    const history = useHistory()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const onSuccessSignUp = (res: {
        id: string
        accessToken: string
        email: string
        firstName: string
        lastName: string
        profilePicture?: string
    }) => {
        const hash = Hasher.encode(res)
        history.push(`/onsignup?details=${hash}`)
    }
    
    const register = () => {
        const res = {email, id: password}
        const hash = Hasher.encode(res)
        history.push(`/onsignup?details=${hash}`)
        console.log(res)
    }

    return (
        <div className="login-page">
            <div className="login-area">
                <h1 className="login-title">Welcome to RealEstate</h1>
                <TextInput 
                    value={email}
                    label="Email: "
                    onChange={(t) => setEmail(t)}
                />
                <TextInput
                    value={password}
                    label="Password: "
                    onChange={(t) => setPassword(t)}
                />
                <button className="createAccount" onClick={register}>Create an Account</button>
                <GoogleButton text='Sign up through Google' className="gbuttonLogin" onSuccess={onSuccessSignUp}/>
            </div>
        </div>
        
    )
}