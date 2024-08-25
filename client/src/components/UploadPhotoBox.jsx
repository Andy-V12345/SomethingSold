import { useState, useEffect } from "react"
import "./UploadPhotoBox.css"
import { FaCamera } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'

function UploadPhotoBox({width, height, onFilesSelected, isActive, index, state}) {
    const [files, setFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState()

    const handleFileChange = (event) => {
      event.preventDefault()
      const selectedFiles = event.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        setImagePreview(URL.createObjectURL(selectedFiles[0]))
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      }
    };
    const handleDrop = (event) => {
      event.preventDefault();
      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles.length > 0) {
        if (droppedFiles[0].type === "image/png" || droppedFiles[0].type === "image/jpg" || droppedFiles[0].type === "image/jpeg") {
          const newFiles = Array.from(droppedFiles);
          setImagePreview(URL.createObjectURL(newFiles[0]))
          setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
      }
    };
    
    const handleRemoveFile = (index) => {
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      setImagePreview(null)
    };
  
    useEffect(() => {
      onFilesSelected(files);
    }, [files]);

    useEffect(() =>{
      if (state === 'SUCCESS') {
        setImagePreview(null)
      }
    }, [state])

    return (
        <section className="drag-drop" style={{ width: width, height: height }}>
          <div
            className={`document-uploader ${imagePreview ? `` : `border-2 border-dashed border-brand-purple`}`}
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
          >
            <>
              <div className="flex flex-col gap-2 justify-center items-center w-full h-full text-primary-gray">
                {imagePreview ?
                  <img className="object-cover w-full h-full rounded-[8px]" src={imagePreview} />
                : 
                  <>
                    <FaCamera className="text-[25px]" />
                    { isActive ? 
                      <>
                        <input
                          type="file"
                          hidden
                          id="browse"
                          onChange={handleFileChange}
                          accept=".png,.jpeg,.jpg"
                          multiple
                        />
                        <label htmlFor="browse" className="bg-secondary-gray px-4 py-1 text-xs rounded-md text-primary-gray hover:opacity-70">
                          Browse
                        </label>

                        <p className="text-[10px] text-primary-gray">{`Or Drag and Drop`}</p>
                      </>
                    :
                      null
                    }
                  </>
                }
              </div>
            </>
    
            {imagePreview ?
              <FaXmark onClick={() => handleRemoveFile(index)} className="absolute w-[25px] h-[25px] p-1 top-0 translate-x-[-40%] translate-y-[-40%] left-0 text-primary-gray hover:text-white hover:bg-primary-gray bg-white drop-shadow-lg rounded-[50%]"/>
            :
              null
            }
          </div>
        </section>
    )
}

export default UploadPhotoBox