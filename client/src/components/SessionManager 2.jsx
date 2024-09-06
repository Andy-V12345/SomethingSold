import { useContext, useEffect } from "react"
import { AccountContext } from "./Account"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"


function SessionManager(props) {

    const navigate = useNavigate()

    const { authState, getSession, setAuthState } = useContext(AccountContext)

    const location = useLocation()

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const code = queryParams.get("code")

        if (!(code)) {
            getSession()
                .then((session) => {
                    setAuthState('AUTHORIZED')
                })
                .catch(() => {
                    setAuthState('UNAUTHORIZED')
                })
        }
    }, [])

    useEffect(() => {
        if (authState == 'UNAUTHORIZED') {
            navigate('/')
        }
        else if (authState == 'AUTHORIZED') {
            navigate('/home')
        }
    }, [authState])

    return (
        <div className="w-full p-0 h-full">
            {props.children}
        </div>
    )
}

export default SessionManager