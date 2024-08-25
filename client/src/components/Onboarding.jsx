import { useContext, useEffect, useState } from "react";
import OnboardingInputField from "./OnboardingInputField";
import { AccountContext } from "./Account";
import UserPool from "../UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

function Onboarding({setIsOnboarded, firstName}) {

    const {getSession} = useContext(AccountContext)

    const [state, setState] = useState("ERROR")

    const [stage, setStage] = useState(0)
    const [mode, setMode] = useState("BUYING")
    const [address, setAddress] = useState("")
    const [addressErrorMsg, setAddressErrorMsg] = useState("")
    const [dateErrorMsg, setDateErrorMsg] = useState("")
    const [date, setDate] = useState("")
    const [errorMsg, setErrorMsg] = useState("Something went wrong.")

    const clickBuy = () => {
        setMode("BUYING")
        setStage(1)
    }

    const clickSell = () => {
        setMode("SELLING")
        setStage(1)
    }

    const handleFinish = () => {
        setState('LOADING')

        if (validateFields()) {
            getSession()
                .then((session) => {
                    const user = UserPool.getCurrentUser()
                    user.setSignInUserSession(session)

                    let attributeList = [
                        new CognitoUserAttribute({
                            Name: "custom:is_onboarded",
                            Value: "true"
                        }),
                        new CognitoUserAttribute({
                            Name: "custom:address",
                            Value: address
                        })
                    ]

                    if (mode === 'BUYING') {
                        attributeList.push(new CognitoUserAttribute({
                            Name: "custom:move_in_date",
                            Value: date
                        }))
                    }
                    else {
                        attributeList.push(new CognitoUserAttribute({
                            Name: "custom:move_out_date",
                            Value: date
                        }))
                    }

                    user.updateAttributes(attributeList, (err) => {
                        if (err) {
                            console.error(err)
                            setState('ERROR')
                            setErrorMsg(err.message)
                        }
                        else {
                            const idToken = session.getIdToken()
                            const payload = idToken.payload

                            let body = {
                                isOnboarded: 1,
                                location: address
                            }

                            if (mode === 'BUYING') {
                                body.move_in_date = date
                            }
                            else {
                                body.move_out_date = date
                            }

                            const requestOptions = {
                                method: 'PUT',
                                headers: { 
                                    'Content-Type': 'application/json',
                                    'Authorization': idToken.getJwtToken()
                                },
                                body: JSON.stringify(body)
                            };

                            fetch(`${import.meta.env.VITE_BASE_API}/users/${payload['cognito:username']}`, requestOptions)
                                .then((response) => {
                                    return response.json()
                                })
                                .then((data) => {
                                    if (data.msg === 'USER_UPDATED') {
                                        user.refreshSession(session.getRefreshToken(), (err, session) => {
                                            if (err) {
                                                console.error(err)
                                                setState('ERROR')
                                                setErrorMsg("Something went wrong. Please try again.")
                                            }
                                            else {
                                                user.setSignInUserSession(session)
                                                setState('READY')
                                                setIsOnboarded(true)
                                            }
                                        })
                                    }
                                    else {
                                        setState('ERROR')
                                        setErrorMsg("Something went wrong. Please try again.")
                                    }
                                })
                        }
                    })
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const handleAddressChange = (e) => {
        setAddress(e.target.value)
    }

    const handleDateChange = (e) => {
        setDate(e.target.value)
    }

    const validateFields = () => {
        const addressRegex = /^\d+\s+[A-Za-z0-9\s,.'-]+(?:\s+(?:Apt|Suite|Unit)\s*\d+)?(?:,\s*[A-Za-z\s]+,\s*[A-Za-z]{2}\s*\d{5})?$/
        let isAddressValid = true
        let isDateValid = true

        if (!addressRegex.test(address)) {
            setAddressErrorMsg("Please enter a valid address.")
            isAddressValid = false
        }
        else {
            setAddressErrorMsg("")
            isAddressValid = true
        }
        
        const enteredDate = new Date(date)
        const today = new Date();

        today.setHours(0, 0, 0)
        enteredDate.setHours(0, 0, 0)

        if (enteredDate === 'Invalid Date' || enteredDate < today) {
            setDateErrorMsg("Please enter a valid date.")
            isDateValid = false
        }
        else {
            setDateErrorMsg("")
            isDateValid = true
        }

        return isAddressValid && isDateValid
    }

    useEffect(() => {
        if (address.trim() !== "" && date.trim() !== "") {
            setState("READY")
        }
        else {
            setState("DEFAULT")
        }
    }, [address, date])

    return (
        <div className="bg-white h-screen w-full flex justify-center">
            <div className="text-primary-gray text-[46px] font-extrabold leading-none w-full max-w-[550px] my-auto flex flex-col justify-center">
                <h1>Welcome,</h1>
                <h1>{`${firstName}!`}</h1>

                {stage == 0 ?
                    <>
                        <p className="text-sm mt-10 text-primary-gray font-medium">First, we have some questions for you.</p>
                        <p className="text-lg mb-10 font-semibold">Are you planning on <strong className="text-brand-purple">buying</strong> or <strong className="text-brand-purple">selling</strong> furniture?</p>

                        <div className="flex text-base justify-between">
                            <button onClick={() => clickBuy()} className="px-8 py-3 relative bg-[#D9D9D9] rounded-[20px] overflow-hidden">
                                {`I'm buying`}
                            </button>
        
                            <button onClick={() => clickSell()} className="px-8 py-3 relative bg-brand-purple rounded-[20px] overflow-hidden">
                                {`I'm selling`}
                            </button>
                        </div>
                    </>
                :
                    <>
                        <OnboardingInputField errorMsg={addressErrorMsg} label={`Where are you living off-campus? (If you're a sophomore, where will you be next year?)`}>
                            <textarea value={address} onChange={handleAddressChange} className="text-base p-2 font-medium text-primary-gray w-full rounded-md border-2 border-brand-purple" placeholder="123 Main St Apt 4B, Evanston, IL 60208" />
                        </OnboardingInputField>

                        <OnboardingInputField errorMsg={dateErrorMsg} label={mode === 'BUYING' ? `When will you move your furniture in?` : `When will you move your furniture out?`}>
                            <input type="date" value={date} onChange={handleDateChange} className="text-base p-2 font-medium text-primary-gray w-full rounded-md border-2 border-brand-purple" />
                        </OnboardingInputField>

                        {state === 'ERROR' ? 
                            <div className="bg-red-200 p-3 border-2 mt-4 border-red-400 rounded-[14px] text-sm text-red-400 font-semibold">
                                <p>{errorMsg}</p>
                            </div>
                        :
                            null
                        }

                        <div className="flex justify-end gap-8 mt-10">
                            <button onClick={() => setStage(0)} className="text-base font-medium text-brand-purple">
                                Back
                            </button>

                            <button disabled={state === 'DEFAULT'} onClick={() => handleFinish()} className={`px-8 py-2 text-base bg-brand-purple rounded-[20px] overflow-hidden w-fit ${state === 'DEFAULT' ? `opacity-50` : `opacity-100`}`}>
                                {`Finish`}
                            </button>
                        </div>
                        
                    </>
                }
                
            </div>
            {state === 'LOADING' ?
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-85 flex justify-center">
                    <div className="border-gray-300 h-[25px] w-[25px] animate-spin rounded-full border-[4px] border-t-brand-purple my-auto" />
                </div>
            :
                null
            }
        </div>
    )
}

export default Onboarding;