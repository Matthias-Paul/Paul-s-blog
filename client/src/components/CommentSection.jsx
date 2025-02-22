import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaPaperPlane, FaThumbsUp } from "react-icons/fa";
import { useState, useEffect, useRef, } from "react";
import moment from "moment";
import close from "../assets/close.svg";


function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [model, setModel] = useState(false);

  const [editComment, setEditComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const editRef = useRef(null); // Reference for detecting outside clicks

  const queryClient = useQueryClient();

  const fetchComments = async ({ pageParam = 0 }) => {
    const commentPerPage = 5;
    const startIndex = pageParam * commentPerPage;

    const res = await fetch(
      `https://paul-s-blog.onrender.com/api/comments/get-comment/${postId}?startIndex=${startIndex}&limit=${commentPerPage}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch comments");
    }

    return res.json();
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", postId],
      queryFn: fetchComments,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.comments.length === 5 ? allPages.length : undefined,
      enabled: !!postId,
    });

  const mutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        "https://paul-s-blog.onrender.com/api/comments/create-comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment,
            postId,
            userId: currentUser?.user?._id,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to post comment");
      }

      return res.json();
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries(["comments", postId]);
    },
    onError: (error) => {
      setCommentError(error.message);
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (commentId) => {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `https://paul-s-blog.onrender.com/api/comments/like-comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to like comment");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  const editMutation = useMutation({
    mutationFn: async (commentId) => {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `https://paul-s-blog.onrender.com/api/comments/edit-comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: editComment }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to edit comment");
      }

      return res.json();
    },
    onSuccess: () => {
      setEditingCommentId(null);
      setEditComment("");
      queryClient.invalidateQueries(["comments", postId]);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `https://paul-s-blog.onrender.com/api/comments/delete-comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete comment");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
      setModel(false);
      setCommentToDelete(null);
    },
  });

  const confirmDelete = (commentId) => {
    setCommentToDelete(commentId);
    setModel(true);
  };
 
  const handleLikes = (commentId) => {
    likeMutation.mutate(commentId);
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditComment(comment.comment);
  };

  const handleEditSubmit = (commentId) => {
    editMutation.mutate(commentId);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setCommentError(null);
    if (comment.trim() === "") return;
    mutation.mutate();
  };


  const handleClickOutside = (event) => {
    if (editRef.current && !editRef.current.contains(event.target)) {
      setEditingCommentId(null);
    }
  };

  // Attach event listener for outside clicks
  useEffect(() => {
    if (editingCommentId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingCommentId]);

  const showModel = ()=>{
    setModel(true)
  }

  const hideModel = ()=>{
    setModel(false)
  }

  return (
    <div className="w-full m-auto">
      <div className="max-w-[800px] m-auto pt-[30px]">
        <h1 className="font-[600] opacity-[0.8] text-[20px] sm:text-[25px] my-[30px]">Leave a Comment</h1>

        {currentUser ? (
          <div className="flex items-center text-[16px] sm:text-[20px] text-gray-500 font-[400]">
            <p>Signed in as:</p>
            <img
              className="h-[30px] w-[30px] object-cover rounded-full mx-[5px]"
              src={currentUser.user.profilePicture}
              alt="User"
            />
            <NavLink to="/dashboard?tab=profile">
              <p className="text-[16px] flex hover:underline">@{currentUser.user.username}</p>
            </NavLink>
          </div>
        ) : (
          <div className="flex items-center">
            <p className="text-start">
              You need to sign in before you can make a comment.
              <NavLink to="/sign-in" className="text-[blue] font-medium ml-1 hover:underline">
                Sign In
              </NavLink>
            </p>
          </div>
        )}

        {currentUser && (
          <form onSubmit={handleSubmit} className="w-full mx-auto">
            <div className="relative">
              <input
                className="w-full text-black rounded-xl mt-5 h-[60px] sm:h-[70px] p-4 pr-14 border-2 border-gray-300 shadow-md outline-none resize-none"
                placeholder="Add a comment..."
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <button type="submit">
                <FaPaperPlane className="absolute mt-[10px] right-4 bg-gray-500 p-[10px] rounded-full top-1/2 transform -translate-y-1/2 text-white text-[35px] md:text-[40px] cursor-pointer hover:scale-110 transition-all" />
              </button>
            </div>

            {commentError && (
              <div className="text-red-500 flex justify-between mt-[12px] mb-[25px] text-[15px]">
                {commentError}
              </div>
            )}
          </form>
        )}

        <div className="flex flex-col items-start mt-[10px]">
          {data?.pages.flatMap((page) => page.comments).length > 0 ? (
            data.pages.flatMap((page) => page.comments).map((comment) => (
              <div ref={editingCommentId === comment._id ? editRef : null} key={comment._id} className="py-2 flex">
                <img
                  className="w-[35px] flex flex-shrink-0 mr-[10px] object-cover h-[35px] rounded-full"
                  src={comment?.profilePicture}
                  alt="User"
                />
                <div className="flex flex-col shadow-sm bg-gray-50 p-[8px] rounded-lg text-black gap-x-[5px]">
                  <div className="font-[600] opacity-[0.7] text-start">{comment?.username}</div>
                  
                  {
                    editingCommentId === comment._id ? ( <div className="relative">
                        <input
                          className="w-full text-black rounded-xl mt-5 h-[50px] p-4 pr-14 border-2 border-gray-300 shadow-md outline-none resize-none"
                          
                          onChange={(e) => setEditComment(e.target.value)}
                          value={editComment}
                        />  
                        <button onClick={() => handleEditSubmit(comment._id)} type="submit">
                          <div className="absolute mt-[10px]  right-4 bg-gray-500 p-[10px] rounded-full top-1/2 transform -translate-y-1/2 text-white text-[15px] w-[30px] h-[30px] flex items-center cursor-pointer hover:scale-110 transition-all"> &#x2713; </div>
                        </button>
                      </div> ) :
                          ( <div className="text-start break-words max-w-[250px] sm:max-w-[470px] md:max-w-[600px] lg:max-w-[730px] p-2">
                        {comment?.comment}
                      </div> 
                          
                          )}
                    

                  <div className={` flex font-[500] text-[13px] gap-x-[10px]`  }  >
                  <div>
                    {(() => {
                      const diff = moment.duration(moment().diff(moment(comment.createdAt)));

                      if (diff.asSeconds() < 60) return "just now";
                      if (diff.asMinutes() < 60) return `${Math.floor(diff.asMinutes())}m ago`;
                      if (diff.asHours() < 24) return `${Math.floor(diff.asHours())}h ago`;
                      return `${Math.floor(diff.asDays())}d ago`;
                    })()}
                  </div>

                  <button onClick={() => handleLikes(comment._id)} className="flex items-center">
                    <FaThumbsUp className={`mr-1 ${comment.likes.length >0 ? "text-[blue]" : "text-[gray]" } `} /> { comment.likes.length > 0 && comment.likes.length}
                  </button>
                    {
                      currentUser && (currentUser?.user?._id === comment?.userId || currentUser?.user?.isAdmin) &&(
                          <button onClick={() => handleEditClick(comment)} className=" text-green-500 hover:underline  " >
                              Edit
                          </button>
                      )
                    }

{
                      currentUser && (currentUser?.user?._id === comment?.userId || currentUser?.user?.isAdmin) &&(
                          <button onClick={() => confirmDelete(comment._id)} className=" text-red-500 hover:underline  " >
                              Delete
                          </button>
                      )
                    }

                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No comments yet.</p>
        )}
      </div>
                    
               
                  


        {hasNextPage && (
          <div className="flex justify-center items-center">
            <button className="underline my-[30px] text-green-500 cursor-pointer" onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? "Loading more..." : "Load more"}
            </button>
          </div>
        )}

{model && (
            <div className="fixed px-[12px] sm:px-[20px] inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="relative w-full max-w-[350px] p-6 bg-gray-800 text-white rounded-lg shadow-lg">
                <button
                  onClick={hideModel}
                  className="absolute top-2 right-2 text-white hover:text-gray-400 focus:outline-none"
                >
                  <img className="w-6 h-6" src={close} alt="Close" />
                </button>
                <div className="text-center mt-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Are you sure you want to delete this comment?
                  </h3>
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      onClick={() => deleteMutation.mutate(commentToDelete)}                   
                         className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={hideModel}
                      className="px-4 py-2 text-sm font-medium text-gray-800 bg-white rounded-lg hover:bg-gray-200 focus:outline-none"
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default CommentSection;
