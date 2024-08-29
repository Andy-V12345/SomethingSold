import logoDark from "../assets/dark-logo-only.png"


function MyListingCard() {
    return (
        <div style={{boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"}} className="flex flex-col items-stretch p-3 bg-white rounded-[15px] w-fit gap-[12px]">

            <div className="relative">
                <img src={logoDark} className="w-[250px] h-[200px] object-cover rounded-[10px]" />

                <div className="absolute bottom-0 right-0 p-2">
                    <p className="text-[10px] leading-none bg-secondary-gray py-[4px] px-2 text-primary-gray rounded-md h-fit w-fit font-bold">
                        FOR SALE
                    </p>
                </div>
            </div>
            
            
            <div className="flex flex-col gap-1 mt-1">
                <div className="text-lg flex items-center justify-between font-extrabold">
                    <p className="leading-none">Item name • $40.00</p>
                </div>

                <p className="text-sm text-primary-gray leading-none">5106 E Ave, Kearney, NE 68847</p>
            </div>

            <div>
                <p className="text-brand-purple text-[12px]">Dimensions</p>
                <p className="text-primary-gray text-sm font-semibold">10 in x 400 in x 30 in</p>
            </div>

            <div>
                <p className="text-brand-purple text-[12px]">Condition</p>
                <p className="text-primary-gray text-sm font-semibold">10</p>
            </div>

            <div>
                <p className="text-brand-purple text-[12px]">Move Out Date</p>
                <p className="text-primary-gray text-sm font-semibold">6/6/2025</p>
            </div>

            <div className="flex justify-end gap-8 mt-3">
                <button className={`text-sm text-red-400 w-fit hover:opacity-70`}>
                    Delete
                </button>
                <button className={`px-8 py-1 text-sm bg-brand-purple rounded-[10px] w-fit text-white hover:opacity-70`}>
                    Edit
                </button>
            </div>

            

        </div>
    )
}

export default MyListingCard