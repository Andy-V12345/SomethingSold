import { useEffect, useState } from "react"
import AuthInputField from "./AuthInputField"
import { CognitoUser } from "amazon-cognito-identity-js"
import UserPool from "../UserPool"

function ResetPassword({status, setStatus, setState}) {

    const [resetCode, setResetCode] = useState("")
    const [resetEmail, setResetEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [resetStage, setResetStage] = useState("EMAIL")
    const [errorMsg, setErrorMsg] = useState("")

    
    useEffect(() => {
        if (resetStage !== 'EMAIL' && resetCode.trim() !== "" && newPassword.trim() !== "") {
            setStatus("READY")
        }
        else if (resetStage === 'EMAIL' && resetEmail.trim() !== "") {
            setStatus("READY")
        }
        else if (resetStage === 'SUCCESS') {
            setStatus('READY')
        }
        else {
            setStatus("DEFAULT")
        }
    }, [newPassword, resetCode, resetStage, resetEmail])

    const handleClick = () => {
        if (resetStage === 'EMAIL') {
            const emailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (!emailValidator.test(resetEmail)) {
                setStatus("ERROR")
                setErrorMsg("Please enter a valid email.")
            }
            else {
                setStatus('LOADING')

                const cognitoUser = new CognitoUser({
                    Username: resetEmail,
                    Pool: UserPool
                })

                cognitoUser.forgotPassword({
                    onSuccess: () => {
                        setStatus('DEFAULT')
                        setResetStage('RESET')
                    },
                    onFailure: () => {
                        setStatus('ERROR')
                        setErrorMsg('Something went wrong. Please try again.')
                    }
                })
            }
        }
        else if (resetStage === 'RESET') {
            const passwordValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

            if (!passwordValidator.test(newPassword)) {
                setStatus('ERROR')
                setErrorMsg("Passwords need to be at least 8 characters and have a number, a capital letter, a lowercase letter, and a special character")
            }
            else {
                setStatus('LOADING')

                const cognitoUser = new CognitoUser({
                    Username: resetEmail,
                    Pool: UserPool
                })

                cognitoUser.confirmPassword(resetCode, newPassword, {
                    onSuccess: () => {
                        setResetStage('SUCCESS')
                    },
                    onFailure: (err) => {
                        setStatus('ERROR')
                        setErrorMsg(err.message)
                    }
                })
            }
        }
        else {
            setState('DEFAULT')
        }
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                <p className="font-bold text-[45px] text-primary-gray">Reset Password</p>

                {resetStage === 'EMAIL' ?
                    <AuthInputField label="Email" value={resetEmail} setValue={setResetEmail} placeholder="Enter the email associated with your account" isSecure={false} />
                :
                    <>
                        <AuthInputField label="Reset code" value={resetCode} setValue={setResetCode} placeholder="Enter the reset code we sent to your email" isSecure={false} />
                        <AuthInputField label="New password" value={newPassword} setValue={setNewPassword} placeholder="Enter your new password" isSecure={true} />
                    </>
                }

                {resetStage == 'SUCCESS' ? 
                    <div className="bg-green-200 p-3 border-2 border-green-400 rounded-[14px] text-sm text-green-400 font-semibold">
                    <p>Your password was successfully reset!</p>
                </div>
                :
                    null
                }

                {status == "ERROR" ?
                    <div className="bg-red-200 p-3 border-2 border-red-400 rounded-[14px] text-sm text-red-400 font-semibold">
                        <p>{errorMsg === 'User already exists' ? `A user with this email already exists` : errorMsg}</p>
                    </div>
                :
                    null
                }

                <div className="flex flex-col gap-3">
                    <button disabled={status != 'READY' && status != 'ERROR'} onClick={() => handleClick()} className={`flex items-start px-16 h-[50px] mt-10 relative bg-brand-purple rounded-[14px] overflow-hidden ${status != 'READY' && status != 'ERROR' ? `opacity-50` : `opacity-100`}`}>
                        <div className="flex-1 my-auto font-bold text-primary-gray text-md tracking-[-0.68px] leading-[normal]">
                            {resetStage === 'RESET' ? 'Reset Password' : resetStage === 'SUCCESS' ? 'Back to Log In' : 'Next'}
                        </div>
                    </button>

                </div>
            </div>
        </>
    )
}

export default ResetPassword