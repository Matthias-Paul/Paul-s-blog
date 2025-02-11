import {  useParams, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

function PostPage() {
    const { postSlug } = useParams();
    const [post, setPost] = useState({})
    const fetchPost = async ({ pageParam = 0 }) => {
   
    
        const res = await fetch(
          `https://paul-s-blog.onrender.com/api/post/get-post?slug=${postSlug}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        return res.json();
      };

      const { data, isLoading, isError } = useQuery({
        queryKey: ["post", postSlug],
        queryFn: fetchPost,
        enabled: !!postSlug,
      });
    
      useEffect(() => {
        if (data && data.posts?.length > 0) {
          setPost(data.posts[0]);
          console.log(postSlug, post)
        }
      }, [data]);

      if (isLoading) {
    return (
      <div className="flex justify-center text-xl pt-[60px] md:pt-[80px] md:text-2xl">
        Loading...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center text-xl pt-[60px] md:pt-[80px] md:text-2xl">
        Failed to load post. Please try again later.
      </div>
    );
  }

  return (
    <>
      <main className="w-full  m-auto px-[12px] sm:px-[20px] pb-[1000px] ">
        <div className=" h-screen max-w-[1400px] flex flex-col items-center text-center m-auto pt-[100px] ">
          <div className="  h-screen max-w-[800px] ">
          <h1 className=" text-[25px] md:text-[40px] px-[30px]    max-w-[600px] font-serif m-auto font-[600] ">{post.title}</h1>
          <NavLink to={`/search?category=${post.category}`}>
             <button className=" py-[4px] px-[22px] md:px-[38px] first-letter:uppercase bg-[gray] active:bg-[blue] text-[16px] md:text-[19px] text-white rounded-[12px] my-[12px] " > {post.category} </button>
          </NavLink>
          <div ><img className=" mt-[20px] object-cover rounded-[5px] max-h-[800px]" src={post.image} alt={post.title} /> </div>
          
          <div className="flex items-center text-[14px] sm:text-[16px] font-[500] ">
                    <div className="w-[35px] h-[35px]  ">
                      <img 
                        className="w-full h-full rounded-[50%]  "
                        src={post.profilePicture}
                        alt="profile"/>
                    </div>
                    <p className=" ml-[7px]  sm:ml-[10px]  ">{post.username}</p>
                    <p className="  ml-[30px] sm:ml-[40px]">{post.createdAt}</p>
                  </div>  
          <div>{post.content}</div>
          </div>
        </div>    
      </main>  
    </>
  );
}

export default PostPage;
