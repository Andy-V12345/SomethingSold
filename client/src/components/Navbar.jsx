import logoLight from "../assets/light-logo-only.png"
import { FaRegEnvelope, FaRegHeart, FaChevronDown } from 'react-icons/fa'
import { MdOutlineShoppingCart } from 'react-icons/md'
import LetteredAvatar from 'react-lettered-avatar'
import Searchbar from "./Searchbar"

function Navbar({ firstName, lastName }) {
    return (
        <nav className="flex sticky shadow-sm justify-center">
            <div className="flex py-4 px-8 justify-between items-center gap-20 w-full max-w-[1500px]">
                <img className="h-9" src={logoLight} />

                <Searchbar />

                <div className="my-auto flex items-center gap-6 justify-center text-[#545454]">
                    <button className="bg-[#D6C1FF] rounded-[10px] font-semibold text-white px-12 py-1">
                        Sell
                    </button>

                    <button>
                        <FaRegEnvelope className="text-[23px]" />
                    </button>

                    <button>
                        <FaRegHeart className="text-[23px]" />
                    </button>

                    <button>
                        <MdOutlineShoppingCart className="text-[23px]" />
                    </button>

                    <LetteredAvatar size={50} name={`${firstName} ${lastName}`} />

                    <button>
                        <FaChevronDown className="text-[10px]" />
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar