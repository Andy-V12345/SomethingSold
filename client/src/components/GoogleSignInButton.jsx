import GoogleIcon from "../assets/google-icon.png"

export default function GoogleSignInButton({ text, handleClick }) {
    return (
        <button onClick={() => handleClick()} className="flex flex-row justify-center items-center h-[50px] relative bg-[#F2F2F2] rounded-[14px] overflow-hidden">
            <img className="w-10" alt="google-icon" src={GoogleIcon} />
            <p className="[font-family:'Inter-Bold',Helvetica] font-semibold text-primary-gray text-md tracking-[-0.68px] leading-[normal]">{text}</p>
        </button>
    )
}