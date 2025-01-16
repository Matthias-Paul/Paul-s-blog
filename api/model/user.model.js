import mongoose from "mongoose"


const userShema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:mongoose.Schema.Types.Mixed,
        required:true,
    },
    profilePicture:{
        type:String,
        default:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1735897100/Image_4_jb0cpq.png",
    },
},{timestamps: true}
);  

const User = mongoose.model("User", userShema);

export default User;



