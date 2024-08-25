import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons"

export default function AuthInputField({label, value, setValue, placeholder, isSecure, isError, errorMsg}) {

    function handleTextChange(e) {
        setValue(e.target.value)
    }

    const [showPassword, setShowPassword] = useState(false)

    return(
        <div className="flex flex-col">
            <p className="text-primary-gray text-md">{label}</p>

            <div className="flex border-b-[3px] border-brand-purple">
                <input
                    className={`outline-none appearance-none w-full rounded-none py-2`} 
                    onChange={handleTextChange} 
                    placeholder={placeholder} 
                    value={value}
                    type={isSecure && showPassword == false ? `password` : `text`} />
                
                {isSecure ? 
                    <button onClick={() => setShowPassword(!showPassword)}>
                        <FontAwesomeIcon className="my-auto" icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                :   
                    null
                }
            </div>

            {isError ? 
                <p className="text-sm text-red-400 mt-2 font-semibold">{errorMsg}</p>
            :
                null
            }

        </div>
    )
}