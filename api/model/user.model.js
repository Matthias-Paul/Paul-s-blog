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
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F49917726%2Fretrieving-default-image-all-url-profile-picture-from-facebook-graph-api&psig=AOvVaw0p6hYzLc3NpzMeusWaiYG6&ust=1734968013699000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJil_OXZu4oDFQAAAAAdAAAAABAE"
    },
},{timestamps: true}
);

const User = mongoose.model("User", userShema);

export default User;



