import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { useState } from "react";

function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
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
      

  const handleSubmit = (e) => {
    e.preventDefault();
    setCommentError(null);
    if (comment.trim() === "") return; // Prevent empty comments
    mutation.mutate();
  };

  return (
    <div className="w-full m-auto">
      <div className="max-w-[800px] m-auto pt-[30px]">
        <h1 className="font-[500] text-[20px] sm:text-[25px] my-[30px]">Leave a Comment</h1>

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
              <NavLink to="/sign-in" className="text-blue-500 font-medium ml-1 hover:underline">
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
              <div key={comment._id} className="py-2 flex">
                <img
                  className="w-[35px] mr-[10px] object-cover h-[35px] rounded-full"
                  src={comment?.profilePicture}
                  alt="User"
                />
                <div className="flex flex-col shadow-sm bg-gray-50 p-[10px] rounded-lg text-black gap-x-[5px]">
                  <div className="font-[500] text-start">{comment?.username}</div>
                  <div className="text-start break-words max-w-[330px] md:max-w-[500px] lg:max-w-[730px] p-2">
                    {comment?.comment}
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
            <button
              className="underline my-[30px] text-green-500 cursor-pointer"
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? "Loading more..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
