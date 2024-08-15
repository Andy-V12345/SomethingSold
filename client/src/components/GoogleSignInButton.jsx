import GoogleIcon from "../assets/google-icon.png"

export default function GoogleSignInButton() {
    return (
        <div className="flex flex-row justify-center items-center pr-6 pl-2 py-1 relative bg-[#F2F2F2] rounded-[32px] overflow-hidden">
            <img className="w-12" alt="google-icon" src={GoogleIcon} />
            <p className="[font-family:'Inter-Bold',Helvetica] font-semibold text-[#1F1F1F] text-lg tracking-[-0.68px] leading-[normal]">Sign in with Google</p>
        </div>
    )
}