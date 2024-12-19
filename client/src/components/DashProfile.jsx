import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import image from "../assets/download.png";
import { useDispatch } from "react-redux"
import { updateStart, updateSuccess, updateFailure } from "../redux/user/userSlice.js"
const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({});


  const filePickerRef = useRef();
  const dispatch = useDispatch()
   
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
          setFormData({...formData, profilePicture: profileImageURL})
        } catch (error) {
          console.error("Image upload failed:", error);
        } finally {
          setIsUploading(false);
        }
      };
      uploadImage();
    }
  }, [profileImage, formData, profileImageURL ]);

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImageURL(URL.createObjectURL(file));
      
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormData({username, email, password, profileImage})
    if(Object.keys(formData).length ===0){
      return;
    }
    
    try {
      dispatch(updateStart())
      const response = await fetch(`http://localhost:5000/api/user/update/${currentUser._id}`, {
        method:"PUT",
        headers: {
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formData)
      }) 
      const data = response.json();
      console.log(formData)

      if(!response.ok){
        dispatch(updateFailure(data.message))
        return;
      }else{
        dispatch(updateSuccess(data))

      }

    } catch (error) {
      dispatch(updateFailure(error.message))
    }
  }; 

  return (
    <div> 
    <div className="text-center flex flex-col items-center">
      <h1 className="font-[500] text-[30px] md:text-[40px] py-[20px]"> Profile</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleProfileImage}
          ref={filePickerRef}
        />
        <div
          className="flex justify-center pb-[20px]  ">
        
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
