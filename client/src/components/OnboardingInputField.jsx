function OnboardingInputField({ errorMsg, label, children }) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-lg mt-10 font-semibold">
                {label}
            </p>
            <div className="flex flex-col gap-0">
                {children}
                {errorMsg !== '' ?
                    <p className="text-sm text-red-400 mt-2 font-semibold">{errorMsg}</p>
                :
                    null
                }
            </div>
        </div>
    )
}

export default OnboardingInputField