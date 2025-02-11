import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
   userId:{
        type:String,
   },
   userEmail:{
        type:String,
    },
   username:{
        type:String,
   },

   title:{
        type:String,
        required:[true, "Title is required"],
   },
   content:{
        type:String,
        required:[true, "Content is required"],
   },
   image:{
        type:String,
        default:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1736170619/lauren-mancke-aOC7TSLb1o8-unsplash_ksmaf9.jpg",
   },
   profilePicture:{
     type:String,
     default:"https://res.cloudinary.com/drkxtuaeg/image/upload/v1735897100/Image_4_jb0cpq.png",
},
   category:{
        type:String,
        default:"uncategorized",

   },
   slug:{
        type:String,
        unique:true,
        required:[true, "Slug is required"],
   }


},{timestamps:true})

const Post = mongoose.model("Post", postSchema)

export default Post;
   