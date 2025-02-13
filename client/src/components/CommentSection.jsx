import { useSelector } from "react-redux";
import {  NavLink } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";

function CommentSection({postId}) {
    const { currentUser } = useSelector((state) => state.user);


  return (
    <>
      <div className="w-full  m-auto  pb-[20px ] ">
        <div  className="  h-screen max-w-[800px] m-auto pt-[70px] ">

           {
           currentUser? (
            <div className="flex items-center text-[16px] sm:text-[20px] text-[gray] font-[400] ">
                 <p className="flex"> Signed in as:  </p>
                 <img className="h-[30px] object-cover rounded-[50%] mx-[5px] w-[30px] " src={currentUser.user.profilePicture} />
               <NavLink to="/dashboard?tab=profile">  <p className="text-[16px] flex  hover:underline "  > @{currentUser.user.username} </p> </NavLink>



            </div>    
           ):(
                <div className="flex items-center">
                      <p className="flex" > You need to sign in before you can make a comment. 
                       <NavLink to="/sign-in">  <p className=" flex text-[blue] ml-[3px] font-[500] hover:underline  "  > Sign In </p> </NavLink>
                      </p> 


                </div>
           )}
           {
            currentUser && (
                <form className="w-full  mx-auto">
                <div className="relative">
                 
                  <input
                    className="w-full rounded-xl mt-5 h-[60px] sm:h-[70px] p-4 pr-14 border-2 border-gray-300 shadow-md outline-none resize-none "
                    placeholder="Add a comment..."
                    />
                    <FaPaperPlane className="absolute mt-[10px] right-4 top-1/2 transform -translate-y-1/2 text-[blue] text-[20px] md:text-[35px]  cursor-pointer hover:scale-110 transition-all"/>
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
