
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";

function CreatePost() {

  const [UploadImage, setUploadImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadImageURL, setUploadImageURL] = useState("");
  const [imageUploadErrorMessage, setImageUploadErrorMessage] = useState(null)

  const handlePostImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadImage(file);
    }
  };

   
      const handleUploadImage = async () => {
        if(!UploadImage){
          setImageUploadErrorMessage("Please select an image.")

        }
          if(UploadImage){
            setImageUploadErrorMessage(null)

            const data = new FormData();
            data.append("file", UploadImage);
            data.append("upload_preset", "cloudinary_backend");
            data.append("cloud_name", "drkxtuaeg");
      
            try {
              setIsUploading(true);
              const res = await fetch("https://api.cloudinary.com/v1_1/drkxtuaeg/image/upload", {
                method: "POST",
                body: data,
              });
      
              if (!res.ok) {
                throw new Error("Image upload failed. Please try again.");
              }
      
              const result = await res.json();
              setUploadImageURL(result.secure_url); // Save uploaded image URL
              console.log("Uploaded Image URL:", result.secure_url);
            } catch (error) {
              console.error(error.message);
              setImageUploadErrorMessage("Image upload failed. Please try again.")

            } finally {
              setIsUploading(false);
            }
          }

    }
 
  return (
    <>
      <div className={`w-full  m-auto px-[20px] lg:px-[30px] ${uploadImageURL==""? "pb-[350px]":"pb-[750px]"} `} >
        <div   className=" h-screen max-w-[1400px] m-auto pt-[70px] ">
          <h1 className="text-center font-[600] text-[24px] sm:text-[30px] my-[25px] " > Create a post </h1>
          <form className="flex flex-col m-auto max-w-[800px] " >
             <div className="  flex flex-col sm:flex-row justify-between   ">
                 <input className="drop-shadow-md border-none rounded-lg flex-1 " required id="title" type="text" placeholder="Title" />
                 <select className="drop-shadow-md text-black cursor-pointer border-none rounded-lg sm:ml-[15px] my-[20px] sm:my-[0px]  ">
                    <option value="uncategorized">Select a  category</option>
                    <option value="health">Health</option>
                    <option value="sport">Sport</option>
                    <option value="religion">Religion</option>
                 </select>
             </div>
               <div className="flex border flex-col sm:flex-row border-[4px] border-[blue] border-dotted rounded-lg sm:my-[35px] p-[10px] ">
               <input className="mr-[10px] w-full sm:flex-1 border-none  mb-[10px] sm:mb-[0px] rounded-lg text-white bg-[gray] " onChange={handlePostImage}   accept="image/>*"  id="file" type="file"  />
               <button type="button" className="bg-[blue] text-white font-[500] hover:bg-[gray] p-[10px] rounded-lg cursor-pointer " onClick={handleUploadImage} >  {isUploading? "Uploading... ": "Upload image" }</button>

               </div>
               {
                imageUploadErrorMessage && (
                  <div className="text-start mt-[-30px] mb-[10px] text-red-500 "> {imageUploadErrorMessage} </div>
                )
               }
               {
                uploadImageURL && (
                  <div className="mt-[20px] sm:mt-[0px] mb-[10px] w-full sm:mb-[20px] m-auto "> <img className=" rounded-[2px] w-full object-cover  max-h-[400px] " src={uploadImageURL} /> </div>
                )
               }
              
              
               <ReactQuill theme="snow" required className=" mt-[30px] h-72 mb-[70px] sm:mt-[0px] " placeholder="Write something..." />
               
               <button type="submit" className="bg-[blue] text-lg text-white   font-[500] w-full hover:bg-[gray] p-[10px] rounded-lg cursor-pointer " >Publish</button>

          </form>
        </div>
      </div>
    </>
  )

}
export default CreatePost 
