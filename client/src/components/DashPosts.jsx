import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react"
import { NavLink } from "react-router-dom"

function DashPosts() {

  const { currentUser} = useSelector(state => state.user)
   const [userPosts, setUserPosts] = useState([])
  useEffect(() => {
       const fetchPosts= async()=>{     
        try {
          
          const res = await fetch(`https://paul-s-blog.onrender.com/api/post/get-post?userId=${currentUser.user._id}`)
          const data = await res.json()
         console.log(data)
         if(res.ok){
          setUserPosts(data.posts)
         }
         
        } catch (error) {
          console.log(error)
        }
      }
     if(currentUser.user.isAdmin){

      fetchPosts()

     }
  }, [currentUser.user._id, currentUser.user.isAdmin]);
  return (

    <>
      <div className="w-full  m-auto  pb-[50px] ">
        <div className=" h-screen px-[20px] m-auto " >
         {
         currentUser.user.isAdmin && userPosts.length > 0 ? (
           <div className="table-auto  overflow-x-scroll scrollbar scrollbar-tract-[gray] ">
         
          <Table hoverable className="shadow-md  m-auto " >
           <Table.Head >
            <Table.HeadCell>  <div className="ml-[10px] "> Date Updated </div> </Table.HeadCell>
            <Table.HeadCell> Post Image</Table.HeadCell>
            <Table.HeadCell> Post Title </Table.HeadCell>
            <Table.HeadCell> Category </Table.HeadCell>
            <Table.HeadCell> Delete </Table.HeadCell>
            <Table.HeadCell> <span> Edit </span> </Table.HeadCell>
           </Table.Head> 

           {
            userPosts.map((post) =>(
                  <Table.Body  key={post._id}>
                  <Table.Row >  
                    <Table.Cell> <div className="ml-[10px] "> {new Date(post.updatedAt).toLocaleDateString()}</div> </Table.Cell>
                    <Table.Cell> 
                      <NavLink to={`/post/${post.slug}`}>
                        <img  src={post.image} alt={post.title} className=" my-[15px] max-w-[75px] rounded-[5px] bg-[gray] " />
                      </NavLink>          
                       </Table.Cell>
                       <Table.Cell> 
                      <NavLink to={`/post/${post.slug}`}>
                        {post.title}                      
                      </NavLink>
                       </Table.Cell>
                       <Table.Cell> 
                        {post.category}                      
                 
                       </Table.Cell>

                       <Table.Cell> 
                         <span className=" text-red-400 hover:underline cursor-pointer">
                            Delete
                         </span>                       
                 </Table.Cell>
                 <Table.Cell> 
                      <NavLink to={`/edit-post/${post._id}`}>
                        Edit                      
                      </NavLink>
                       </Table.Cell>

                 
                  </Table.Row>
                  </Table.Body>  
            ))
           }
          </Table>
             </div>
         ): (
          <div className="m-auto text-xl "> You have no post yet!</div>
         )
        
        }
        </div>       
      </div>
    </>
  );
}

export default DashPosts;
