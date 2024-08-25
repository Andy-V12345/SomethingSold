import { Link } from "react-router-dom";
import logoDark from "../assets/dark-logo-only.png"

const Landing = () => {
  return (
      <div className="bg-primary-gray w-full h-screen overflow-y-auto overflow-x-hidden">
        <div className="flex my-auto flex-col justify-center gap-20 pb-24 pt-44">
          <div className="flex flex-col items-center">

            <img className="w-72" alt="Somethingsold" src={logoDark} />

            <div className="self-stretch w-full">

              <div className="font-bold text-white text-7xl tracking-[-1.63px] leading-[normal] whitespace-nowrap text-center">
                Welcome!
              </div>

              <p className="[font-light text-white text-lg tracking-[-0.41px] leading-[normal] text-center">
                A marketplace for students - by students.
              </p>

            </div>
          </div>

          <div className="m-auto flex items-center justify-between flex-wrap gap-32">

            <Link to="/auth/login" className="flex items-start px-16 py-4 relative bg-secondary-gray rounded-[32px] overflow-hidden">
              <div className="flex-1 font-bold text-primary-gray text-xl tracking-[-0.68px] leading-[normal]">
                Login
              </div>
            </Link>
            
            <Link to="/auth/signup" className="flex items-start px-16 py-4 relative bg-brand-purple rounded-[32px] overflow-hidden">
              <div className="relative flex-1 font-bold text-primary-gray text-xl tracking-[-0.68px] leading-[normal]">
                Sign Up
              </div>
            </Link>
          </div>
        </div>

      </div>
  );
};

export default Landing;