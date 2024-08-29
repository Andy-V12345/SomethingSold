/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "./Account"
import Onboarding from "./Onboarding"
import Navbar from "./Navbar"

function Home() {

    const {getIdToken, authState} = useContext(AccountContext)
    const [isOnboarded, setIsOnboarded] = useState(true)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [showProfile, setShowProfile] = useState(false)

    useEffect(() => {
        if (authState === 'AUTHORIZED') {
            getIdToken()
                .then((idToken) => {
                    const payload = idToken.payload
                    setIsOnboarded(payload['custom:is_onboarded'] === 'true')
                    setFirstName(payload['custom:first_name'])
                    setLastName(payload['custom:last_name'])
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }, [authState])

    if (isOnboarded) {
        return (
            <div>
                <Navbar firstName={firstName} lastName={lastName} showProfile={showProfile} setShowProfile={setShowProfile} />
            </div>
        )
    }
    else {
        return (
            <Onboarding isOnboarded={isOnboarded} setIsOnboarded={setIsOnboarded} firstName={firstName} />
        )
    }
}

export default Home