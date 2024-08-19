import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { createContext, useState } from "react";
import UserPool from "../UserPool";

export const AccountContext = createContext()

export function Account(props) {

    const [authState, setAuthState] = useState('PROCESSING')

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = UserPool.getCurrentUser()
            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        reject()
                    }
                    else {
                        resolve(session)
                    }
                })
            }
            else {
                reject()
            }
        })
    }

    const authenticate = async (email, password) => {
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        })

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        })

        return await new Promise((resolve, reject) => {
            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    resolve(data)
                },
                onFailure: (err) => {
                    reject(err)
                },
            })
        })
    }

    const logout = () => {
        const user = UserPool.getCurrentUser()
        if (user) {
            user.signOut()
            setAuthState('UNAUTHORIZED')
        }
    }

    return (
        <AccountContext.Provider value={{authenticate, getSession, logout, setAuthState, authState}}>
            {props.children}
        </AccountContext.Provider>
    )
}