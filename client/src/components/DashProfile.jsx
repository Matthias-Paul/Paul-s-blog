import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import image from "../assets/download.png";
import { updateStart, updateSuccess, updateFailure } from "../redux/user/userSlice.js";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (profileImage) {
      const uploadImage = async () => {
        const data = new FormData();
        data.append("file", profileImage);
        data.append("upload_preset", "cloudinary_backend");
        data.append("cloud_name", "drkxtuaeg");

        try {
          setIsUploading(true);
          const res = await fetch("https://api.cloudinary.com/v1_1/drkxtuaeg/image/upload", {
            method: "POST",
            body: data,
          });
          const result = await res.json();
          setProfileImageURL(result.secure_url);
        } catch (error) {
          console.error("Image upload failed:", error);
        } finally {
          setIsUploading(false);
        }
      };
      uploadImage();
    }
  }, [profileImage]);

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImageURL(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    


    const updatedFormData = {
      username,
      email,
      ...(password && { password }), // Only include password if it's provided
      ...(profileImageURL && { profilePicture: profileImageURL }), // Only include profilePicture if it's available
    };
  
    if(Object.keys(updatedFormData).length === 0){
      return;
    }

    try {
      dispatch(updateStart());
  
      const res = await fetch("http://localhost:5000/api/user/update/" + currentUser._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "cookie": "access-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDg2NWQyNDY3NWJiNjYyMzI0YzdmMSIsImlhdCI6MTczNDQzNzk4N30.H8A_GWHwq-3SO7BCD4q7wbiooCD8wwaseIbBi-3J6zM; access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDg2NWQyNDY3NWJiNjYyMzI0YzdmMSIsImlhdCI6MTczNDczMDgzNn0.9v3BpEjo_JxPYjSB-6O9XiCEUHklJ8_ah1Kaq62lQK0",
        },
        body: JSON.stringify(updatedFormData),
      });
  
      const data = await res.json();
      console.log(updatedFormData);
      console.log(data);
  
      if (!res.ok) {
        dispatch(updateFailure(data))
      }else {
              dispatch(updateSuccess(data));
             console.log("User updated successfully:", data);
      }
  
    } catch (error) {
      dispatch(updateFailure(error.message));
      console.error("An error occurred while updating user:", error);
    }
  };
  

  return (
    <div>
      <div className="text-center flex flex-col items-center">
        <h1 className="font-[500] text-[30px] md:text-[40px] py-[20px]">Profile</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleProfileImage}
            ref={filePickerRef}
          />
          <div className="flex justify-center pb-[20px]">
            <img
              onClick={() => filePickerRef.current.click()}
              className="w-[120px] h-[120px] md:w-[160px] cursor-pointer md:h-[160px] object-cover rounded-full border-8"
              src={profileImageURL || image}
              alt="Profile"
            />
          </div>

          <div className="flex flex-col mt-[12px]">
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
              value={username}
              className="w-[320px] text-black sm:w-[370px] rounded-lg border border-gray-300 mt-[6px]"
            />
          </div>

          <div className="flex flex-col mt-[12px]">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              value={email}
              className="w-[320px] sm:w-[370px] text-black rounded-lg border border-gray-300 mt-[6px]"
            />
          </div>

          <div className="flex flex-col mt-[12px]">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-[320px] sm:w-[370px] text-black rounded-lg border border-gray-300 mt-[6px]"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-[370px] p-[10px] text-lg rounded-lg font-[500] text-white mt-[30px] cursor-pointer bg-[blue] hover:bg-[gray]"
          >
            Update
          </button>
        </form>
      </div>
      <div className="text-red-500 flex justify-between mt-[12px] mb-[25px] text-[15px]">
        <div className="cursor-pointer">Delete Account</div>
        <div className="cursor-pointer">Sign Out</div>
      </div>
    </div>
  );
};

export default DashProfile;
