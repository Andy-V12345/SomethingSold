import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { createContext, useState } from "react";
import UserPool from "../UserPool";

export const AccountContext = createContext()

export function Account(props) {

    const [authState, setAuthState] = useState('PROCESSING')
    
    const getUser = () => {
        const user = UserPool.getCurrentUser()

        if (user) {
            return user
        }
        
        return null;
    }

    const getIdToken = async () => {
        return await new Promise((resolve, reject) => {
            getSession()
                .then((session) => {
                    resolve(session.getIdToken())
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = getUser()
            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        reject(err)
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
                onSuccess: (session) => {
                    resolve(session)
                },
                onFailure: (err) => {
                    reject(err)
                },
            })
        })
    }

    const logout = () => {
        const user = getUser()
        if (user) {
            user.signOut()
            setAuthState('UNAUTHORIZED')
        }
    }

    return (
        <AccountContext.Provider value={{authenticate, getSession, logout, setAuthState, authState, getIdToken}}>
            {props.children}
        </AccountContext.Provider>
    )
}