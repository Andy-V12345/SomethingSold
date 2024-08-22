import { Link, useLocation, useParams } from "react-router-dom"
import AuthInputField from "./AuthInputField"
import { useContext, useEffect, useState } from "react"
import GoogleSignInButton from "./GoogleSignInButton"
import { CognitoAccessToken, CognitoIdToken, CognitoRefreshToken, CognitoUser, CognitoUserAttribute, CognitoUserSession } from "amazon-cognito-identity-js"
import UserPool from "../UserPool"
import { AccountContext } from "./Account"
import ResetPassword from "./ResetPassword"

export default function AuthPage() {

    const { mode } = useParams()

    const { authenticate, setAuthState } = useContext(AccountContext)

    const [email, setEmail] = useState("")
    const [emailErrorMsg, setEmailErrorMsg] = useState("")
    const [emailError, setEmailError] = useState(false)

    const [password, setPassword] = useState("")
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("")
    const [passwordError, setPasswordError] = useState(false)

    const [firstName, setFirstName] = useState("")
    const [firstNameErrorMsg, setFirstNameErrorMsg] = useState("")
    const [firstNameError, setFirstNameError] = useState(false)

    const [startCooldown, setStartCooldown] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)

    useEffect(() => {
        if (startCooldown) {
            const timerInterval = setInterval(() => {
                setResendCooldown((prevTime) => {
                    if (prevTime == 0) {
                        clearInterval(timerInterval)
                        setStartCooldown(false)
                        return 0
                    }
                    else {
                        return prevTime - 1
                    }
                })
            }, 1000)

            return () => clearInterval(timerInterval)
        }
    }, [startCooldown])

    useEffect(() => {
        const onlyLetters = /^[a-zA-Z]+$/;

        if (firstName.trim() !== "" && !onlyLetters.test(firstName)) {
            setFirstNameError(true)
            setFirstNameErrorMsg("Names can only have letters")
        }
        else {
            setFirstNameError(false)
            setFirstNameErrorMsg("")
        }
    }, [firstName])

    const [lastName, setLastName] = useState("")
    const [lastNameErrorMsg, setLastNameErrorMsg] = useState("")
    const [lastNameError, setLastNameError] = useState(false)

    useEffect(() => {
        const onlyLetters = /^[a-zA-Z]+$/;

        if (lastName.trim() !== "" && !onlyLetters.test(lastName)) {
            setLastNameError(true)
            setLastNameErrorMsg("Names can only have letters")
        }
        else {
            setLastNameError(false)
            setLastNameErrorMsg("")
        }
    }, [lastName])

    const [retypePassword, setRetypePassword] = useState("")
    const [retypePasswordErrorMsg, setRetypePasswordErrorMsg] = useState("")
    const [retypePasswordError, setRetypePasswordError] = useState(false)

    useEffect(() => {
        if (retypePassword.trim() !== "" && retypePassword !== password) {
            setRetypePasswordError(true)
            setRetypePasswordErrorMsg("Passwords don't match")
        }
        else {
            setRetypePasswordError(false)
            setRetypePasswordErrorMsg("")
        }
    }, [retypePassword, password])

    const [state, setState] = useState("DEFAULT")
    const [status, setStatus] = useState("DEFAULT")

    const [errorMsg, setErrorMsg] = useState("Incorrect code")

    const [verificationCode, setVerificationCode] = useState("")

    useEffect(() => {
        if (verificationCode.trim().length == 6) {
            setStatus("READY")
        }
        else {
            setStatus("DEFAULT")
        }
    }, [verificationCode])

    useEffect(() => {
        if (mode === 'login') {
            if (email.trim() === '' || password.trim() === '') {
                setStatus('DEFAULT')
            }
            else {
                setStatus('READY')
            }
        }
        else {
            if (retypePasswordError || firstNameError || lastNameError) {
                setStatus('DEFAULT')
            }
            else if (email.trim() === '' || password.trim() === '' || firstName.trim() === '' || lastName.trim() === '' || retypePassword.trim() === '') {
                setStatus('DEFAULT')
            }
            else {
                setStatus('READY')
            }
        }
    }, [email, password, retypePassword, firstName, lastName, retypePasswordError, firstNameError, lastNameError])

    const validateEmailAndPassword = () => {
        let res = true
        const emailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const passwordValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (!emailValidator.test(email) || (!email.endsWith("@u.northwestern.edu") && !email.endsWith("@northwestern.edu"))) {
            setEmailError(true)
            setEmailErrorMsg("Please use an NU email")

            res = false
        }
        else {
            setEmailError(false)
            setEmailErrorMsg("")
        }

        if (!passwordValidator.test(password)) {
            setPasswordError(true)
            setPasswordErrorMsg("Passwords need to be at least 8 characters and have a number, a capital letter, a lowercase letter, and a special character")
            
            res = false
        }
        else {
            setPasswordError(false)
            setPasswordErrorMsg("")
        }

        return res
    }

    const handleSubmission = () => {
        
        setStatus("LOADING")
        
        const isValid = validateEmailAndPassword()

        if (isValid) {
            if (mode == 'login') {
                authenticate(email, password)
                    .then(() => {
                        setStatus('READY')
                        setAuthState('AUTHORIZED')
                    })
                    .catch((err) => {
                        if (err.message === 'User is not confirmed.') {
                            setState('VERIFYING')
                            setStatus('DEFAULT')
                        }
                        else {
                            setStatus('ERROR')
                            setErrorMsg(err.message === 'Incorrect username or password.' ? 'Incorrect email or password.' : err.message)
                        }
                    })
            }
            else {
                const attributeList = [
                    new CognitoUserAttribute({
                        Name: "email",
                        Value: email
                    }),
                    new CognitoUserAttribute({
                        Name: "custom:first_name",
                        Value: firstName
                    }),
                    new CognitoUserAttribute({
                        Name: "custom:last_name",
                        Value: lastName
                    }),
                    new CognitoUserAttribute({
                        Name: "custom:is_onboarded",
                        Value: "false"
                    })
                ]

                UserPool.signUp(email, password, attributeList, null, (err, data) => {
                    if (err) {
                        setStatus("ERROR")
                        setErrorMsg(err.message)
                    }
                    else {
                        const user_aws_id = data.userSub

                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id: user_aws_id, 
                                email: email,
                                first_name: firstName,
                                last_name: lastName,
                                isOnboarded: 0
                            })
                        };

                        fetch(`${import.meta.env.VITE_BASE_API}/users`, requestOptions)

                        setState("VERIFYING")
                        setStatus("DEFAULT")
                    }
                })
            }
        }
        else {
            setStatus("READY")
        }
        
    }

    const verifyCode = () => {
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: UserPool
        })

        setStatus('LOADING')

        cognitoUser.confirmRegistration(verificationCode, true, (err) => {
            if (err) {
                setStatus("ERROR")
                setErrorMsg(err.message)
            }
            else {
                authenticate(email, password)
                    .then(() => {
                        setStatus('READY')
                        setAuthState('AUTHORIZED')
                    })
                    .catch((err) => {
                        setStatus('ERROR')
                        setErrorMsg(err.message === 'Incorrect username or password.' ? 'Incorrect email or password.' : err.message)
                    })
            }
        })
    }

    const resendCode = () => {
        setResendCooldown(30)
        setStartCooldown(true)

        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: UserPool
        })

        cognitoUser.resendConfirmationCode((err) => {
            if (err) {
                setStatus("ERROR")
                setErrorMsg(err.message)
            }
        })
    }

    const signInWithGoogle = () => {
        window.location.href = `${import.meta.env.VITE_COGNITO_URL}/oauth2/authorize?response_type=code&client_id=${import.meta.env.VITE_CLIENT_ID}&redirect_uri=http://localhost:5173/auth/${mode}&identity_provider=Google`
    }

    const location = useLocation()

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const code = queryParams.get("code")

        if (code) {
            setStatus('LOADING')
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'grant_type': 'authorization_code',
                    'client_id': import.meta.env.VITE_CLIENT_ID,
                    'redirect_uri': `http://localhost:5173/auth/${mode}`,
                    'code': code
                })
            };
    
            fetch(`${import.meta.env.VITE_COGNITO_URL}/oauth2/token`, requestOptions)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    if (!(data.error)) {
                        const id_token = new CognitoIdToken({IdToken: data.id_token})
                        const access_token = new CognitoAccessToken({AccessToken: data.access_token})
                        const refresh_token = new CognitoRefreshToken({RefreshToken: data.refresh_token})

                        const id_token_info = id_token.decodePayload()
                        
                        if (!(id_token_info.email.endsWith('@u.northwestern.edu') || id_token_info.email.endsWith('@northwestern.edu'))) {
                            setStatus('ERROR')
                            setErrorMsg('Please use an NU email')
                        }
                        else {
                            const requestOptions2 = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    id: id_token_info["cognito:username"], 
                                    email: id_token_info.email,
                                    first_name: firstName,
                                    last_name: lastName,
                                    isOnboarded: 0
                                })
                            };
    
                            fetch(`${import.meta.env.VITE_BASE_API}/users`, requestOptions2)
                                .then(response => response.json())
                                .then((data) => {
                                    if (data.msg && data.msg === 'EMAIL_TAKEN') {
                                        console.log("dup email")
                                        setStatus("ERROR")
                                        setErrorMsg("This email is already linked to an account. Try logging in.")
                                    }
                                    else {
                                        const new_session = new CognitoUserSession({
                                            IdToken: id_token,
                                            RefreshToken: refresh_token,
                                            AccessToken: access_token
                                        })
            
                                        const new_user = new CognitoUser({
                                            Username: id_token_info["cognito:username"],
                                            Pool: UserPool
                                        })
            
                                        new_user.setSignInUserSession(new_session)

                                        if (id_token_info["custom:is_onboarded"]) {
                                            setStatus('DEFAULT')
                                            setAuthState('AUTHORIZED')
                                        }
                                        else {
                                            new_user.updateAttributes([
                                                new CognitoUserAttribute({
                                                    Name: "custom:is_onboarded",
                                                    Value: "false"
                                                })
                                            ], (err) => {
                                                if (err) {
                                                    console.error(err)
                                                }
                                                else {
                                                    setStatus('DEFAULT')
                                                setAuthState('AUTHORIZED')
                                                }
                                            })

                                        }
                                    }
                                })
                        }
                    }
                    else {
                        setStatus('ERROR')
                        setErrorMsg('Something went wrong. Please try again!')
                    }
                })
                
        }
    }, [location])

    const resetFields = () => {
        setState('DEFAULT')
        setStatus('DEFAULT')
        setEmail('')
        setPassword('')
        setFirstName('')
        setLastName('')
        setRetypePassword('')
        setErrorMsg('')
    }

    return (
        <div className="bg-[#D9D9D9] w-full h-full absolute flex justify-center">
            <div className={`relative my-auto h-5/6 ${mode == 'login' ? `max-h-[650px]` : `max-h-[900px]`} w-1/2 max-w-[500px]`}>
                <div className="bg-white rounded-[40px] my-auto h-full w-full p-[45px] flex flex-col justify-between overflow-scroll gap-6">
                    {state == "VERIFYING" ? 
                        <>
                            <div className="flex flex-col gap-6">
                                <p className="font-bold text-[45px] text-[#545454]">Verify Email</p>

                                <AuthInputField label="Verification code" value={verificationCode} setValue={setVerificationCode} placeholder="Enter the 6 digit code we sent to your email" isSecure={false} />

                                {status == "ERROR" ?
                                    <div className="bg-red-200 p-3 border-2 border-red-400 rounded-[14px] text-sm text-red-400 font-semibold">
                                        <p>{errorMsg === 'User already exists' ? `A user with this email already exists` : errorMsg}</p>
                                    </div>
                                :
                                    null
                                }

                                <div className="flex flex-col gap-3">
                                    <button disabled={status != 'READY' && status != 'ERROR'} onClick={() => verifyCode()} className={`flex items-start px-16 h-[50px] mt-10 relative bg-[#D6C1FF] rounded-[14px] overflow-hidden ${status != 'READY' && status != 'ERROR' ? `opacity-50` : `opacity-100`}`}>
                                        <div className="flex-1 my-auto font-bold text-[#545454] text-md tracking-[-0.68px] leading-[normal]">
                                            Verify
                                        </div>
                                    </button>

                                    <button disabled={startCooldown} onClick={() => resendCode()} className="text-left text-[#545454] text-sm">
                                        {startCooldown ? `Next resend in ${resendCooldown}` : `Resend code`}
                                    </button>
                                </div>
                            </div>
                        </>
                    :
                    <>
                        {state === 'RESETTING' ?
                            <ResetPassword status={status} setStatus={setStatus} setState={setState} />
                        :
                            <>
                                <div className="flex flex-col gap-6">
                                    <p className="font-bold text-[45px] text-[#545454]">{mode === 'login' ? `Log In` : `Sign Up`}</p>

                                    {mode === 'login' ?
                                        <>
                                            <AuthInputField label="Email" value={email} setValue={setEmail} placeholder="johndoe@u.northwestern.edu" isSecure={false} errorMsg={emailErrorMsg} isError={emailError} />
                                            <div className="flex flex-col gap-3">
                                                <AuthInputField label="Password" value={password} setValue={setPassword} placeholder="Enter your password" isSecure={true} errorMsg={passwordErrorMsg} isError={passwordError} />
                                                <button onClick={() => setState("RESETTING")} className="text-left text-sm text-[#D6C1FF] font-semibold">
                                                    Forgot password
                                                </button>   
                                            </div>
                                        </>
                                    :
                                        <>
                                            <AuthInputField label="First Name" value={firstName} setValue={setFirstName} placeholder="John" isSecure={false} errorMsg={firstNameErrorMsg} isError={firstNameError} />
                                            <AuthInputField label="Last Name" value={lastName} setValue={setLastName} placeholder="Doe" isSecure={false} errorMsg={lastNameErrorMsg} isError={lastNameError} />
                                            <AuthInputField label="Email" value={email} setValue={setEmail} placeholder="johndoe@u.northwestern.edu" isSecure={false} errorMsg={emailErrorMsg} isError={emailError} />
                                            <AuthInputField label="Password" value={password} setValue={setPassword} placeholder="Enter your password" isSecure={true} errorMsg={passwordErrorMsg} isError={passwordError} />   
                                            <AuthInputField label="Retype Password" value={retypePassword} setValue={setRetypePassword} placeholder="Confirm your password" isSecure={true} errorMsg={retypePasswordErrorMsg} isError={retypePasswordError} />   
                                        </>
                                    }

                                    {status == "ERROR" ?
                                        <div className="bg-red-200 p-3 border-2 border-red-400 rounded-[14px] text-sm text-red-400 font-semibold">
                                            <p>{errorMsg === 'User already exists' ? `A user with this email already exists` : errorMsg}</p>
                                        </div>
                                    :
                                        null
                                    }
                                    
                                </div>

                                <div className="flex flex-col gap-1">
                                    <button disabled={status != 'READY' && status != 'ERROR'} onClick={() => handleSubmission()} className={`flex items-start px-16 h-[50px] mt-10 relative bg-[#D6C1FF] rounded-[14px] overflow-hidden ${status != 'READY' && status != 'ERROR' ? `opacity-50` : `opacity-100`}`}>
                                        <div className="flex-1 my-auto font-bold text-[#545454] text-md tracking-[-0.68px] leading-[normal]">
                                            {mode === 'login' ? `Log In` : `Sign Up`}
                                        </div>
                                    </button>

                                    <div className="mx-auto">
                                        <p className="inline text-sm text-[#545454]">{mode === 'login' ? `Don't have an account? ` : `Already have an account? `}</p>
                                        <Link onClick={() => resetFields()} to={mode === 'login' ? `/auth/signup` : `/auth/login`} className="text-sm text-[#D6C1FF] font-semibold">
                                            {mode === 'login' ? `Sign up` : `Log in`}
                                        </Link>
                                    </div>

                                    <p className="mx-auto my-3 text-[#545454]">or</p>

                                    <GoogleSignInButton handleClick={signInWithGoogle} text={mode === 'login' ? `Log in with Google` : `Sign up with Google`} />
                                </div>
                            </>
                        }
                    </>
                }

                </div>
                {status == 'LOADING' ? 
                    <div className="absolute rounded-[40px] top-0 left-0 w-full h-full bg-white opacity-85 flex justify-center">
                        <div className="border-gray-300 h-[25px] w-[25px] animate-spin rounded-full border-[4px] border-t-[#D6C1FF] my-auto" />
                    </div>
                :
                    null
                }
            </div>
        </div>
    )   
    
       
}