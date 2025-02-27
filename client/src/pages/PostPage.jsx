import {  useParams, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CommentSection from "../components/CommentSection"
function PostPage() {
    const { postSlug } = useParams();
    const [post, setPost] = useState({})
    const [recentArticle, setRecentArticle] = useState([])



    const fetchPost = async () => {
   
    
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
      }, [data, post, postSlug]);

       const fetchRecentArticle = async () => {
   
    
        const res = await fetch(
          `https://paul-s-blog.onrender.com/api/post/get-post?limit=3`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        return res.json();
      };

      const { data: recentPost } = useQuery({
        queryKey: ["recentPost"],
        queryFn: fetchRecentArticle,
        
      });
      useEffect(() => {
        if (recentPost) {
          setRecentArticle(recentPost.posts);
          console.log(recentPost.posts)
        }
      }, [recentPost, post, postSlug ]);

      if (isLoading) {
    return (
      <div className="flex justify-center text-xl pt-[60px] sm:pt-[80px] md:text-2xl">
        Loading...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center px-[12px] sm:px-[0px] text-xl pt-[60px] sm:pt-[80px] md:text-2xl">
        Failed to load post. Please try again later.
      </div>
    );
  }

  return (
    <>
      <main className="w-full  m-auto px-[12px] font-serif sm:px-[20px] pb-[150px]  ">
        <div className=" max-w-[1400px] flex flex-col items-center text-center m-auto pt-[70px] sm:pt-[100px] ">
          <div className="  w-full  ">
          <h1 className=" text-[25px] md:text-[40px] px-[30px]    max-w-[800px] font-serif m-auto font-[600] ">{post.title}</h1>
          <NavLink to={`/post?category=${post.category}`}>
             <button className=" py-[4px] px-[22px] md:px-[38px] first-letter:uppercase bg-[gray] active:bg-[blue] text-[16px] md:text-[19px] text-white rounded-[12px] my-[12px] " > {post.category} </button>
          </NavLink>
          <div className=" w-full" ><img className=" w-full  mt-[20px] object-cover rounded-[6px] sm:rounded-[12px] max-h-[800px]" src={post.image} alt={post.title} /> </div>
          
          <div className="flex items-center justify-between border-b-[2px] pb-[15px] text-[15px] mt-[7px] md:text-[20px] font-[500] ">
                   <div className="flex items-center ">
                    <div className="w-[35px] h-[35px] md:w-[55px] md:h-[55px]   ">
                      <img 
                        className="w-full h-full object-cover rounded-[50%]  "
                        src={post.profilePicture}
                        alt="profile"/>
                    </div>
                    <p className=" ml-[7px]  sm:ml-[10px]  ">{post.username}</p>
               </div>

                    <p className=" ">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>  
          <div dangerouslySetInnerHTML={{__html:post.content}}  className="text-start m-auto mt-[20px]  break-words w-full max-w-[800px] post-content ">

          </div>
          </div>

          <CommentSection postId={post._id} />

          <div>
            <h1 className="text-center font-[500] text-2xl my-[25px]  " > Recent Articles  </h1>

               <div className=" max-w-[500px]   lg:max-w-[900px] xl:max-w-[1400px] grid-cols-1 lg:grid-cols-2 grid xl:grid-cols-3 gap-x-[20px] m-auto">
                  {  recentArticle &&    recentArticle.map((article) => (

                              <div
                              className="mb-[20px] p-[16px] border border-color-[#E8E8EA]  rounded-[12px] "
                              key={article._id}
                            >
                                                              <NavLink to={`/post/${article.slug}`}>

                              <div className="h-[285px]   object-cover flex-shrink-0   " >
                                <img className="rounded-[6px] w-full h-full object-cover flex-shrink-0 " src={article.image} alt={article.title} />
                              </div>

                              <div className="text-[14px]  first-letter:capitalize font-[500] text-[#4B6BFB]  my-[26px] bg-[#4B6BFB0D] rounded-[6px] px-[10px] py-[4px] ">
                              {article.category}

                              </div>
            
                              <div className=" line-clamp-3  text-[22px] text-start  sm:text-[26px] font-[600] mb-[24px] leading-[30px]">
                                {article.title}
                              </div>

                              <div className="flex items-center text-[14px] sm:text-[16px] font-[500] text-[#97989F] ">
                                <div className=" object-cover flex-shrink-0  ">
                                  <img 
                                    className="w-[40px] h-[40px] object-cover rounded-[50%]  "
                                    src={article.profilePicture}
                                    alt="profile"/>
                                </div>
                                <div  className="flex justify-between w-full ">
                                <div className=" ml-[7px]  sm:ml-[10px]  ">{article.username}</div>
                                <div className="  ">
                                {new Date(article.createdAt).toLocaleDateString()}


                                </div>
                                
                                </div>

                              </div>

                              </NavLink>

                            </div>





                            ))



                  }

                  </div>

          </div> 
          
           
        </div>    
      </main>  
    </>
  );
}

export default PostPage;
