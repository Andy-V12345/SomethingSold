import { useContext, useEffect, useState } from "react"
import UploadPhotoBox from "./UploadPhotoBox"
import { AccountContext } from "./Account"
import { Link } from "react-router-dom"

function ListItem() {

    const {getIdToken} = useContext(AccountContext)

    const [unit, setUnit] = useState('in')
    const [files, setFiles] = useState([])

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [width, setWidth] = useState("")
    const [height, setHeight] = useState("")
    const [depth, setDepth] = useState("")
    const [condition, setCondition] = useState(1)
    const [date, setDate] = useState("")

    const [state, setState] = useState("DEFAULT")
    const [errorMsg, setErrorMsg] = useState("Something went wrong. Try again.")

    const handleChange = (e) => {
        const fieldName = e.target.getAttribute('name')

        if (fieldName === "itemName") {
            setName(e.target.value)
        }
        else if (fieldName === "price") {
            setPrice(e.target.value)
        }
        else if (fieldName === "width") {
            setWidth(e.target.value)
        }
        else if (fieldName === "height") {
            setHeight(e.target.value)
        }
        else if (fieldName === "depth") {
            setDepth(e.target.value)
        }
        else if (fieldName === "condition") {
            setCondition(e.target.value)
        }
        else if (fieldName === "date") {
            setDate(e.target.value)
        }
    }

    useEffect(() => {
        if (name.trim() !== "" && price.trim() !== "" && width.trim() !== "" && height.trim() !== "" && depth.trim() !== "" && date.trim() !== "") {
            setState("READY")
        }
    }, [name, price, width, height, depth, date])

    useEffect(() => {
        getIdToken()
            .then((idToken) => {
                const payload = idToken.payload
                if (payload["custom:move_out_date"]) {
                    let moveOutDate = new Date(payload["custom:move_out_date"])
                    let today = new Date();
                    today.setHours(0, 0, 0)
                    moveOutDate.setHours(0, 0, 0)

                    if (moveOutDate !== 'Invalid Date' && moveOutDate.getDate() >= today.getDate()) {
                        setDate(payload["custom:move_out_date"])
                    }
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    const postListing = () => {
        setState("LOADING")
        if (Number(price) < 0) {
            setState("ERROR")
            setErrorMsg("Price cannot be negative.")
        }
        else if (Number(width) < 0 || Number(height) < 0 || Number(depth) < 0) {
            setState("ERROR")
            setErrorMsg("Dimensions cannot be negative")
        }
        else {
            let moveOutDate = new Date(date)
            let today = new Date();
            today.setHours(0, 0, 0)
            moveOutDate.setHours(0, 0, 0)

            if (moveOutDate === 'Invalid Date' || moveOutDate < today) {
                setState("ERROR")
                setErrorMsg("Your move out date cannot be in the past.")
            }
            else {
                setState("LOADING")
                
                getIdToken()
                    .then((idToken) => {
                        const payload = idToken.payload
                        const user_id = payload["cognito:username"]

                        const dimensions = `${width} ${unit} x ${height} ${unit} x ${depth} ${unit}`

                        const itemPostOptions = {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': idToken.getJwtToken()
                            },
                            body: JSON.stringify({
                                name: name,
                                price: Number(price),
                                condition: condition.toString(),
                                availability_date: date,
                                dimensions: dimensions,
                                seller_id: user_id
                            })
                        }

                        fetch(`${import.meta.env.VITE_BASE_API}/items`, itemPostOptions)
                            .then((res) => {
                                return res.json()
                            })
                            .then((data) => {
                                if (data.item_id) {
                                    const item_id = data.item_id[0]
                                    
                                    if (files.length > 0) {
                                        for (let i = 0; i < files.length; i++) {
                                            const oldNameSplit = files[i].name.split(".")
                                            const nameType = oldNameSplit[1]
                                            const newName = i.toString() + "." + nameType
                                            const imgPath = user_id + "/" + item_id.toString()
                                            const newImgFile = new File(
                                                [files[i]],
                                                newName,
                                                {
                                                    type: files[i].type
                                                }
                                            )

                                            const formData = new FormData()
                                            formData.append('file', newImgFile)
                                            formData.append('metadata', JSON.stringify({
                                                imagePath: imgPath
                                            }))

                                            const imgPostOptions = {
                                                method: 'POST',
                                                headers: {
                                                    'Authorization': idToken.getJwtToken()
                                                },
                                                body: formData
                                            }

                                            fetch(`${import.meta.env.VITE_BASE_API}/images`, imgPostOptions)
                                                .then((res) => {
                                                    return res.json()
                                                })
                                                .then((data) => {
                                                    if (data.message) {
                                                        const imgPathPostOptions = {
                                                            method: 'POST',
                                                            headers: { 
                                                                'Content-Type': 'application/json',
                                                                'Authorization': idToken.getJwtToken()
                                                            },
                                                            body: JSON.stringify({
                                                                path: imgPath + "/" + item_id.toString(),
                                                                item_id: item_id
                                                            })
                                                        }

                                                        fetch(`${import.meta.env.VITE_BASE_API}/imagePath`, imgPathPostOptions)
                                                            .then((res) => {
                                                                return res.json()
                                                            })
                                                            .then((data) => {
                                                                if (data.message) {
                                                                    setFiles([])
                                                                    setUnit('in')
                                                                    setName("")
                                                                    setPrice("")
                                                                    setDate("")
                                                                    setWidth("")
                                                                    setHeight("")
                                                                    setDepth("")
                                                                    setCondition(1)
                                                                    setState('SUCCESS')
                                                                }
                                                                else {
                                                                    setState('ERROR')
                                                                    setErrorMsg(data.error)
                                                                }
                                                            })
                                                            .catch((err) => {
                                                                console.error(err)
                                                                setState('ERROR')
                                                                setErrorMsg(err.msg)
                                                            })
                                                    }
                                                    else {
                                                        setState('ERROR')
                                                        setErrorMsg(data.error)
                                                    }
                                                })
                                                .catch((err) => {
                                                    console.error(err)
                                                    setState('ERROR')
                                                    setErrorMsg(err.msg)
                                                })

                                        }
                                    }
                                    
                                }
                                else {
                                    console.error(data.error)
                                    setState('ERROR')
                                    setErrorMsg(data.error)
                                }
                            })
                            .catch((err) => {
                                console.log("error")
                                console.error(err)
                            })
                        
                    })
                    .catch((err) => {
                        setState("ERROR")
                        setErrorMsg(err.message)
                    })
            }
        }
    }

    return (
        <div className="h-screen w-screen">
            <div disabled={state === 'LOADING'} className={`h-full w-full max-w-[600px] mx-auto bg-white p-10`}>
                {state === 'SUCCESS' ?
                    <div className="flex items-center justify-between py-3 px-4 mb-7 bg-green-200 h-fit border-2 border-green-400 rounded-[10px] opacity-100">
                        <p className="text-green-400">Successfully posted your listing</p>

                        <Link to={"/home"} className="text-green-400 rounded-[5px] bg-white text-sm font-semibold py-1 px-4 hover:opacity-70">
                            Back home
                        </Link>
                    </div>
                :
                    null
                }
                <h1 className="text-primary-gray text-[35px] font-bold">List an Item</h1>

                <form className='mt-10 pb-10'>
                    <div className="flex flex-col gap-5 w-full h-full">
                        <div className="flex flex-col gap-1">
                            <p className="text-base text-primary-gray font-semibold">Item Name</p>

                            <input name="itemName" value={name} onChange={handleChange} type="text" placeholder="Brown couch" className="text-base px-2 py-1 font-medium text-primary-gray w-full rounded-md border-2 border-brand-purple outline-none" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-base text-primary-gray font-semibold">Item Price</p>

                            <div className="flex items-center rounded-md px-2 py-1 border-2 border-brand-purple">
                                <p className="text-nowrap text-primary-gray text-base font-semibold">$ USD</p>

                                <input name="price" value={price} onChange={handleChange} type="number" placeholder="0.00" className="text-end text-base font-medium text-primary-gray w-full appearance-none outline-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between">
                                <p className="text-base text-primary-gray font-semibold">Dimensions</p>

                                <div className="flex gap-1 text-primary-gray">
                                    <button type="button" onClick={() => setUnit('in')} className={`${unit === 'in' ? `text-primary-gray` : `text-secondary-gray`} hover:text-primary-gray`}>
                                        in
                                    </button>

                                    <p className="text-secondary-gray">/</p>

                                    <button type="button" onClick={() => setUnit('cm')} className={`${unit === 'cm' ? `text-primary-gray` : `text-secondary-gray`} hover:text-primary-gray`}>
                                        cm
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input value={width} onChange={handleChange} name="width" type="number" placeholder="0" className="rounded-md px-2 py-1 border-2 border-brand-purple text-base font-medium text-primary-gray w-full appearance-none outline-none" />
                                <p className="text-primary-gray">x</p>
                                <input value={height} onChange={handleChange} name="height" type="number" placeholder="0" className="rounded-md px-2 py-1 border-2 border-brand-purple text-base font-medium text-primary-gray w-full appearance-none outline-none" />
                                <p className="text-primary-gray">x</p>
                                <input value={depth} onChange={handleChange} name="depth" type="number" placeholder="0" className="rounded-md px-2 py-1 border-2 border-brand-purple text-base font-medium text-primary-gray w-full appearance-none outline-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-base text-primary-gray font-semibold">Move Out Date</p>
                            <input name="date" type="date" value={date} onChange={handleChange} className="rounded-md px-2 py-1 border-2 border-brand-purple text-base font-medium text-primary-gray w-full appearance-none outline-none" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-base text-primary-gray font-semibold">Item Condition</p>

                            <div className="rounded-md border-2 border-brand-purple px-2 py-1">
                                <select value={condition} onChange={handleChange} name="condition" className="text-base font-medium text-primary-gray w-full outline-none">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>


                            <p className="text-sm text-primary-gray">1 is unusable, 10 is brand new!</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="inline text-base text-primary-gray font-semibold">{`Upload Photos (0 / 6)`}</p>

                            <div className="flex flex-wrap gap-4">
                                <UploadPhotoBox state={state} index={0} isActive={true} onFilesSelected={setFiles} width="150px" height="150px" />
                                <UploadPhotoBox state={state} index={1} isActive={true} onFilesSelected={setFiles} width="150px" height="150px" />
                                <UploadPhotoBox state={state} index={2} isActive={true} onFilesSelected={setFiles} width="150px" height="150px" />
                                <UploadPhotoBox state={state} index={3} isActive={true} onFilesSelected={setFiles} width="150px" height="150px" />
                                <UploadPhotoBox state={state} index={4} isActive={true} onFilesSelected={setFiles} width="150px" height="150px" />
                                <UploadPhotoBox state={state} index={5} isActive={true} onFilesSelected={setFiles} width="150px" height="150px" />
                            </div>
                        </div>

                        {state === 'ERROR' ? 
                            <div className="bg-red-200 p-3 border-2 border-red-400 rounded-[14px] text-sm text-red-400 font-semibold">
                                <p>{errorMsg}</p>
                            </div>
                        :
                            null
                        }

                        <div className="flex justify-between mt-10">
                            <button type="button" className="bg-secondary-gray rounded-[10px] font-semibold text-primary-gray px-12 py-2 hover:opacity-70">
                                Save Draft
                            </button>

                            <button onClick={postListing} disabled={state === 'DEFAULT' || state === 'SUCCESS'} type="button" className={`bg-brand-purple rounded-[10px] font-semibold text-white px-12 py-2 hover:opacity-7 ${state === 'DEFAULT' || state === 'SUCCESS' ? `opacity-50` : `opacity-100`}`}>
                                Post Item
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {state === 'LOADING' ?
                <div className="fixed top-0 left-0 w-screen h-screen bg-white opacity-85 flex justify-center">
                    <div className="border-gray-300 h-[25px] w-[25px] animate-spin rounded-full border-[4px] border-t-brand-purple my-auto" />
                </div>
            :
                null
            }

        </div>
    )
}

export default ListItem