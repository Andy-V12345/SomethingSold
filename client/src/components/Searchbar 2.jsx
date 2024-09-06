import { BiSearchAlt } from "react-icons/bi"

function Searchbar() {
    return (
        <div className="flex rounded-[30px] w-full items-center bg-[#E5E5E5] px-3 gap-[12px]">
            <BiSearchAlt className="text-lg text-primary-gray" />

            <input type="text" className="bg-transparent outline-none py-2 h-full w-full appearance-none text-primary-gray" placeholder="Search..." />
        </div>
    )
}

export default Searchbar