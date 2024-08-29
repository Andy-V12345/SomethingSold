import MyListingCard from "./MyListingCard"

function MyListings({ setShowProfile }) {
    return (
        <div onClick={() => setShowProfile(false)} className="h-svh w-full bg-white flex justify-center">
            <div className="h-full w-full max-w-[1500px] py-8 px-8 flex flex-col gap-2">
                <h1 className="text-[30px] font-extrabold text-primary-gray">Your Listings</h1>

                <div>
                    <MyListingCard />
                </div>
            </div>
        </div>
    )
}

export default MyListings