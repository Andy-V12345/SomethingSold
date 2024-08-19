import { useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"

const GoogleCallback = () => {

    const { code } = useParams()

    return (
        <div>{code}</div>
    )
}

export default GoogleCallback