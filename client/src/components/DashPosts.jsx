import { useInfiniteQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Table } from 'flowbite-react';
import { NavLink } from 'react-router-dom';

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);

  // Define the fetch function for posts
  const fetchPosts = async ({ pageParam = 0 }) => {
    const postsPerPage = 9;
    const startIndex = pageParam * postsPerPage;

    const res = await fetch(
      `https://paul-s-blog.onrender.com/api/post/get-post?userId=${currentUser.user._id}&startIndex=${startIndex}&limit=${postsPerPage}`
    );
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    return res.json();
  };

  // Use useInfiniteQuery for paginated data
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['posts', currentUser.user._id],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) => {
        // Calculate the next page based on the current page
        return lastPage.posts.length === 9 ? (lastPage.posts.length / 9) : undefined;
      },
      enabled: currentUser.user.isAdmin, // Fetch only if user is an admin
    });
  if (isLoading) {
    return <div className="mx-auto text-xl md:ml-[300px] md:text-2xl">Loading posts...</div>;
  }

  if (isError) {
    return <div className="mx-auto md:ml-[300px] text-xl lg:text-2xl">Failed to load posts. Please try again later.</div>;
  }

  // Flatten the data from the pages
  const posts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <>
      <div className="w-full mx-auto pb-[50px]">
        <div className="md:ml-[280px] px-[12px] md:px-[20px] mx-auto">
          {currentUser.user.isAdmin && posts.length > 0 ? (
            <>
              <div className="sm:p-[20px] md:mt-[-3px] rounded-[5px] md:shadow-md dark:border md:mx-auto overflow-x-scroll mt-[10px] scrollbar scrollbar-thumb-[gray]">
                <Table className="w-[1000px] static mx-auto table-auto bg-transparent dark:bg-transparent">
                  <Table.Head>
                    <Table.HeadCell>Date Updated</Table.HeadCell>
                    <Table.HeadCell>Post Image</Table.HeadCell>
                    <Table.HeadCell>Post Title</Table.HeadCell>
                    <Table.HeadCell>Category</Table.HeadCell>
                    <Table.HeadCell>Delete</Table.HeadCell>
                    <Table.HeadCell>Edit</Table.HeadCell>
                  </Table.Head>

                  {posts.map((post) => (
                    <Table.Body key={post._id}>
                      <Table.Row>
                        <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                          <NavLink to={`/post/${post.slug}`}>
                            <img
                              src={post.image}
                              alt={post.title}
                              className="my-[15px] cursor-pointer max-w-[75px] rounded-[5px] bg-[gray]"
                            />
                          </NavLink>
                        </Table.Cell>
                        <Table.Cell>
                          <NavLink to={`/post/${post.slug}`}>
                            <div className="truncate max-w-[250px] mr-[0px]">{post.title}</div>
                          </NavLink>
                        </Table.Cell>
                        <Table.Cell>{post.category}</Table.Cell>
                        <Table.Cell>
                          <span className="text-red-400 hover:underline cursor-pointer">Delete</span>
                        </Table.Cell>
                        <Table.Cell>
                          <NavLink to={`/edit-post/${post._id}`}>Edit</NavLink>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </div>
              {hasNextPage && (
                <div className="flex justify-center items-center">
                  <button
                    className="bg-[blue] px-[20px] my-[30px] py-[7px] rounded-lg text-white hover:bg-[gray] cursor-pointer"
                    onClick={() => fetchNextPage()} // Trigger fetching the next page
                    disabled={isFetchingNextPage} // Disable the button while fetching more posts
                  >
                    {isFetchingNextPage ? 'Loading more...' : 'Show more'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="m-auto px-[12px] sm:px-[20px] text-xl">You have no post yet!</div>
          )}
        </div>
      </div>
    </>
  );
}

export default DashPosts;
