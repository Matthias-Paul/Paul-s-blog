import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

function UpdatePosts() {
    const { currentUser } = useSelector((state) => state.user);

    const [UploadImage, setUploadImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadImageURL, setUploadImageURL] = useState("");
    const [imageUploadErrorMessage, setImageUploadErrorMessage] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishMessage, setPublishMessage] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);
    const { postId } = useParams();
    const navigate = useNavigate();

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
        if (data) {
            setFormData(data.posts[0]);
            setUploadImageURL(data.posts[0]?.image || ""); // Ensure image URL is set
        }
    }, [data]);

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
            setUploadImageURL(result.secure_url); // Save uploaded image URL
            console.log("Uploaded Image URL:", result.secure_url);
            setFormData((prev) => ({ ...prev, image: result.secure_url }));
        } catch (error) {
            console.error(error.message);
            setImageUploadErrorMessage("Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPublishing(true);
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(`https://paul-s-blog.onrender.com/api/post/edit-post/${formData._id}/${currentUser.user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                if (data.message.includes("duplicate")) {
                    setPublishMessage("Unable to update a post, provide a unique title!");
                } else {
                    setPublishMessage(data.message);
                }
                setIsPublishing(false);
                return;
            } else {
                setPublishMessage(data.message);
                setIsPublishing(false);
                navigate(`/post/${data.createdPost.slug}`);
            }
        } catch (error) {
            console.log(error);
            setPublishMessage("Something went wrong");
            setIsPublishing(false);
        }
    };

    return (
        <>
            <div className={`w-full m-auto px-[12px] sm:px-[20px] ${uploadImageURL === "" ? "pb-[350px]" : "pb-[750px]"}`}>
                <div className="h-screen max-w-[1400px] m-auto pt-[70px]">
                    <h1 className="text-center font-[600] text-[24px] sm:text-[30px] my-[25px]">Edit a post</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col m-auto max-w-[800px]">
                        <div className="flex flex-col sm:flex-row justify-between">
                            <input
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                value={formData.title }
                                className="drop-shadow-md border-none rounded-lg flex-1"
                                id="title"
                                type="text"
                                placeholder="Title"
                            />
                            <select
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                value={formData.category }
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
                            value={formData.content || ""}
                            onChange={(value) => setFormData({ ...formData, content: value })}
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
        </>
    );
}

export default UpdatePosts;
