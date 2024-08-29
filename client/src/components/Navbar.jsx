import logoLight from "../assets/light-logo-only.png"
import { FaRegEnvelope, FaRegHeart, FaUser, FaPencilAlt, FaSignOutAlt, FaClipboardList, FaReceipt } from 'react-icons/fa'
import { MdOutlineShoppingCart } from 'react-icons/md'
import LetteredAvatar from 'react-lettered-avatar'
import Searchbar from "./Searchbar"
import { Link } from "react-router-dom"
import "./Navbar.css"
import { useContext } from "react"
import { AccountContext } from "./Account"

function Navbar({ firstName, lastName, showProfile, setShowProfile, setMode }) {

    const { logout } = useContext(AccountContext)

    return (
        <nav className="flex sticky shadow-sm justify-center">
            <div className="flex relative py-4 px-8 justify-between items-center gap-10 lg:gap-20 w-full max-w-[1500px]">
                <img onClick={() => setMode('HOME')} className="h-9" src={logoLight} />

                <Searchbar />

                <div className="my-auto flex items-center gap-6 justify-center text-primary-gray">
                    <Link to={"/sell"} className="bg-brand-purple rounded-[10px] font-semibold text-white px-12 py-1 hover:opacity-70">
                        Sell
                    </Link>

                    <button>
                        <FaRegEnvelope className="text-[23px] hover:opacity-70" />
                    </button>

                    <button>
                        <FaRegHeart className="text-[23px] hover:opacity-70" />
                    </button>

                    <button>
                        <MdOutlineShoppingCart className="text-[23px] hover:opacity-70" />
                    </button>

                    <button onClick={() => setShowProfile(!showProfile)}>
                        <LetteredAvatar size={50} name={`${firstName} ${lastName}`} />
                    </button>

                    <div className="action">
                        <div className={`menu ${showProfile ? `active` : ``}`}>
                            <ul onClick={() => setShowProfile(false)} className="text-primary-gray font-semibold text-base">
                                <li>
                                    <FaUser />
                                    <a href="#">My profile</a>
                                </li>
                                <li onClick={() => setMode('MY_LISTINGS')}>
                                    <FaClipboardList />
                                    <a href="#">My listings</a>
                                </li>
                                <li>
                                    <FaReceipt />
                                    <a href="#">My purchases</a>
                                </li>
                                <li>
                                    <FaPencilAlt />
                                    <a href="#">Edit profile</a>
                                </li>
                                <li onClick={logout}>
                                    <FaSignOutAlt />
                                    <a href="#">Logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar