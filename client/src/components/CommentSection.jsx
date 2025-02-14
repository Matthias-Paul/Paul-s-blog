import { useSelector } from "react-redux";
import {  NavLink } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import {  useState } from "react";

function CommentSection({postId}) {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState("")



    const handleSubmit = async (e)=>{
      e.preventDefault()
      setComment("")
      

    }

  return (
    <>
      <div className="w-full  m-auto  ">
        <div  className="  max-w-[800px] m-auto pt-[30px] ">
           <h1 className="font-[500] text-[20px] sm:text-[25px] my-[30px] " > Leave a Comment </h1>
           {
           currentUser? (
            <div className="flex items-center text-[16px] sm:text-[20px] text-[gray] font-[400] ">
                 <p className="flex"> Signed in as:  </p>
                 <img className="h-[30px] object-cover rounded-[50%] mx-[5px] w-[30px] " src={currentUser.user.profilePicture} />
               <NavLink to="/dashboard?tab=profile">  <p className="text-[16px] flex  hover:underline "  > @{currentUser.user.username} </p> </NavLink>



            </div>    
           ):(
            <div className="flex items-center">
            <p className="text-start">
              You need to sign in before you can make a comment.  
              <NavLink to="/sign-in" className="text-[blue] font-medium ml-1 hover:underline">
                Sign In
              </NavLink>
            </p>
          </div>
          
           )}
           {
            currentUser && (
                <form onSubmit={handleSubmit} className="w-full  mx-auto">
                <div className="relative">
                 
                  <input
                    className="w-full text-black rounded-xl mt-5 h-[60px] sm:h-[70px] p-4 pr-14 border-2 border-gray-300 shadow-md outline-none resize-none "
                    placeholder="Add a comment..."
                    onChange={(e)=> setComment(e.target.value) }
                    value={comment}
                    />
                   <button type="submit" >
                     <FaPaperPlane className="absolute mt-[10px] right-4 bg-[gray] p-[10px] rounded-[50%] top-1/2 transform -translate-y-1/2 text-white text-[35px] md:text-[40px]  cursor-pointer hover:scale-110 transition-all"/>
                    </button>              
                </div>
              </form>  
            )
           }
           
           
           
           </div>   

      </div>  
    </>
  )
}

export default CommentSection
