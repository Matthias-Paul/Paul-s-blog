import { useSelector } from "react-redux";
import {  NavLink } from "react-router-dom";


function CommentSection({postId}) {
    const { currentUser } = useSelector((state) => state.user);


  return (
    <>
      <div className="w-full  m-auto  pb-[20px ] ">
        <div  className="  h-screen max-w-[800px] m-auto pt-[70px] ">

           {
           currentUser? (
            <div className="flex items-center text-[16px] sm:text-[20px] text-[gray] font-[400] ">
                 <p> Signed in as:  </p>
                 <img className="h-[30px] object-cover rounded-[50%] mx-[5px] w-[30px] " src={currentUser.user.profilePicture} />
               <NavLink to="/dashboard?tab=profile">  <p className="text-[16px]  hover:underline "  > @{currentUser.user.username} </p> </NavLink>



            </div>    
           ):(
                <div className="flex items-center">
                      <p> You need to sign in before you can make a comment. </p> 
                      <NavLink to="/sign-in">  <p className=" text-[blue] ml-[3px] font-[500] hover:underline  "  > Sign In </p> </NavLink>


                </div>
           )}
           {
            currentUser && (
                <div>


                 </div>   
            )
           }
           
           
           
           </div>   

      </div>  
    </>
  )
}

export default CommentSection
