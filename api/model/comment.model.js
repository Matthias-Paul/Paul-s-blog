import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    },
    postId:{
        type:String,
        required:true,
    },
    likes:{
      type:Array,
      default:[],
    },
    numberOfLikes:{
      type:Number,
      default:0,
    },
    username:{
        type:String,
    }, 
     profilePicture:{
        type:String,
        default:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1735897100/Image_4_jb0cpq.png",
   },

},{timestamps:true})

 const Comment = mongoose.model("Comment", commentSchema)
 export default Comment;