
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreatePost() {
  return (
    <>
      <div className="w-full  m-auto px-[20px] lg:px-[30px] pb-[350px] " >
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
               <input className="mr-[10px] w-full sm:flex-1 border-none  mb-[10px] sm:mb-[0px] rounded-lg text-white bg-[gray] "  accept="image/>*"  id="file" type="file"  />
               <button type="button" className="bg-[blue] text-white font-[500] hover:bg-[gray] p-[10px] rounded-lg cursor-pointer " >Upload image </button>
               </div>
              
               <ReactQuill theme="snow" required className=" mt-[30px] h-72 mb-[70px] sm:mt-[0px] " placeholder="Write something..." />
               
               <button type="submit" className="bg-[blue] text-lg text-white   font-[500] w-full hover:bg-[gray] p-[10px] rounded-lg cursor-pointer " >Publish</button>

          </form>
        </div>
      </div>
    </>
  )
}

export default CreatePost 
