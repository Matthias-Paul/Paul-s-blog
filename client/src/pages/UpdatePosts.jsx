import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

function UpdatePosts() {
    const { currentUser } = useSelector((state) => state.user);

    const [UploadImage, setUploadImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadImageURL, setUploadImageURL] = useState("");
    const [imageUploadErrorMessage, setImageUploadErrorMessage] = useState(null);
    const [publishMessage, setPublishMessage] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);
    const { postId } = useParams();
    const navigate = useNavigate();

    const formDataRef = useRef({
        _id: "",
        title: "",
        category: "",
        content: "",
        image: "",
    });

    const handlePostImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadImage(file);
        }
    };

    const handleUploadImage = async () => {
        setImageUploadErrorMessage(null);

        if (!UploadImage) {
            setImageUploadErrorMessage("Please select an image.");
            return;
        }

        const data = new FormData();
        data.append("file", UploadImage);
        data.append("upload_preset", "cloudinary_backend");
        data.append("cloud_name", "drkxtuaeg");

        try {
            setIsUploading(true);
            const res = await fetch("https://api.cloudinary.com/v1_1/drkxtuaeg/image/upload", {
                method: "POST",
                body: data,
            });

            if (!res.ok) {
                throw new Error("Image upload failed. Please try again.");
            }

            const result = await res.json();
            setUploadImageURL(result.secure_url);
            console.log("Uploaded Image URL:", result.secure_url);
            formDataRef.current.image = result.secure_url; // Update form data
        } catch (error) {
            console.error(error.message);
            setImageUploadErrorMessage("Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const fetchPost = async () => {
        try {
            const res = await fetch(
                `https://paul-s-blog.onrender.com/api/post/get-post?postId=${postId}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch post");
            }

            return res.json();
        } catch (error) {
            console.error("Error fetching post:", error.message);
            return null;
        }
    };

    const { data } = useQuery({
        queryKey: ["post", postId],
        queryFn: fetchPost,
        enabled: !!postId,
    });

    useEffect(() => {
        if (data && data.posts?.length > 0) {
            const post = data.posts[0];
            formDataRef.current = {
                _id: post._id || "",
                title: post.title || "",
                category: post.category || "",
                content: post.content || "",
                image: post.image || "",
                slug: post.slug || "",
            };
            setUploadImageURL(post.image || "");
        }
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPublishing(true);

        const token = localStorage.getItem("access_token");

        // Log formDataRef for debugging
        console.log("formDataRef:", formDataRef.current);
        console.log("currentUser:", currentUser);

        if (!formDataRef.current._id || !currentUser?.user?._id) {
            setPublishMessage("Invalid post or user information.");
            setIsPublishing(false);
            return;
        }

        try {
            const res = await fetch(
                `https://paul-s-blog.onrender.com/api/post/edit-post/${formDataRef.current._id}/${currentUser.user._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formDataRef.current),
                }
            );

            const data = await res.json();
            console.log(data)
            if (!res.ok) {
                setPublishMessage(data.message || "Failed to update the post.");
                setIsPublishing(false);
                return;
            }

            setPublishMessage(data.message || "Post updated successfully!");
            setIsPublishing(false);
            console.log(data)
            navigate(`/post/${data.updatedPost.slug}`);
        } catch (error) {
            console.error("Error updating post:", error);
            setPublishMessage("Something went wrong.");
            setIsPublishing(false);
        }
    };

    return (
        <div className={`w-full m-auto px-[12px] sm:px-[20px] ${uploadImageURL === "" ? "pb-[350px]" : "pb-[750px]"}`}>
            <div className="h-screen max-w-[1400px] m-auto pt-[70px]">
                <h1 className="text-center font-[600] text-[24px] sm:text-[30px] my-[25px]">Edit a post</h1>
                <form onSubmit={handleSubmit} className="flex flex-col m-auto max-w-[800px]">
                    <div className="flex flex-col sm:flex-row justify-between">
                        <input
                            onChange={(e) => (formDataRef.current.title = e.target.value)}
                            defaultValue={formDataRef.current.title}
                            className="drop-shadow-md border-none rounded-lg flex-1"
                            id="title"
                            type="text"
                            placeholder="Title"
                        />
                        <select
                            onChange={(e) => (formDataRef.current.category = e.target.value)}
                            defaultValue ={formDataRef.current.category}
                            className="drop-shadow-md text-black cursor-pointer border-none rounded-lg sm:ml-[15px] my-[20px] sm:my-[0px]"
                        >
                            <option value="uncategorized">Select a category</option>
                            <option value="health">Health</option>
                            <option value="sport">Sport</option>
                            <option value="religion">Religion</option>
                        </select>
                    </div>
                    <div className="flex border flex-col sm:flex-row border-[4px] border-[blue] border-dotted rounded-lg sm:my-[35px] p-[10px]">
                        <input
                            className="mr-[10px] w-full sm:flex-1 border-none mb-[10px] sm:mb-[0px] rounded-lg text-white bg-[gray]"
                            onChange={handlePostImage}
                            accept="image/*"
                            id="file"
                            type="file"
                        />
                        <button
                            type="button"
                            className="bg-[blue] text-white font-[500] hover:bg-[gray] p-[10px] rounded-lg cursor-pointer"
                            onClick={handleUploadImage}
                        >
                            {isUploading ? "Uploading... " : "Upload image"}
                        </button>
                    </div>
                    {imageUploadErrorMessage && (
                        <div className="text-start mt-[10px] sm:mt-[-30px] mb-[-20px] sm:mb-[10px] text-red-500">
                            {imageUploadErrorMessage}
                        </div>
                    )}
                    {uploadImageURL && (
                        <div className="mt-[20px] sm:mt-[0px] mb-[10px] w-full sm:mb-[20px] m-auto">
                            <img
                                className="rounded-[2px] w-full object-cover max-h-[400px]"
                                src={uploadImageURL}
                                alt="Uploaded"
                            />
                        </div>
                    )}
                    <ReactQuill
                        value={formDataRef.current.content}
                        onChange={(value) => (formDataRef.current.content = value)}
                        theme="snow"
                        required
                        className="mt-[30px] h-72 mb-[90px] sm:mb-[70px] sm:mt-[0px]"
                        placeholder="Write something..."
                    />
                    <button
                        type="submit"
                        className="bg-[blue] text-lg text-white font-[500] w-full hover:bg-[gray] p-[10px] rounded-lg cursor-pointer"
                    >
                        {isPublishing ? "Editing... " : "Edit"}
                    </button>
                    {publishMessage && (
                        <div className="text-start mt-[10px] mb-[-20px] sm:mb-[10px] text-red-500">
                            {publishMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default UpdatePosts;
