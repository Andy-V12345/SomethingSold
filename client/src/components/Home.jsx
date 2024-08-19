import { useContext } from "react"
import { AccountContext } from "./Account"

function Home() {

    const {logout} = useContext(AccountContext)

    return (
        <div>
            <button onClick={() => logout()}>
                Log Out
            </button>
        </div>
    )
}

export default Home