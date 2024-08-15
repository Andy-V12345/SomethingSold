import logoDark from "../assets/dark-logo-only.png"
import GoogleSignInButton from "./GoogleSignInButton";

const Landing = () => {
  return (
      <div className="bg-[#545454] w-full h-screen overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-center gap-20 pb-24 pt-44">
          <div className="flex flex-col items-center">

            <img className="w-72" alt="Somethingsold" src={logoDark} />

            <div className=" self-stretch w-full">

              <div className=" [font-family:'League_Spartan-Bold',Helvetica] font-bold text-white text-7xl tracking-[-1.63px] leading-[normal] whitespace-nowrap text-center">
                Welcome!
              </div>

              <p className="[font-family:'Inter-Light',Helvetica] font-light text-white text-lg tracking-[-0.41px] leading-[normal] text-center">
                A marketplace for students - by students.
              </p>

            </div>
          </div>

          <div className="m-auto flex items-center justify-between flex-wrap gap-32">

            <div className="flex items-start px-16 py-4 relative bg-[#d9d9d9] rounded-[32px] overflow-hidden">
              <div className="flex-1 [font-family:'Inter-Bold',Helvetica] font-bold text-[#545454] text-xl tracking-[-0.68px] leading-[normal]">
                Login
              </div>
            </div>

            <GoogleSignInButton />
            
            <div className="flex items-start px-16 py-4 relative bg-[#d6c1ff] rounded-[32px] overflow-hidden">
              <div className="relative flex-1 [font-family:'Inter-Bold',Helvetica] font-bold text-[#545454] text-xl tracking-[-0.68px] leading-[normal]">
                Sign Up
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Landing;