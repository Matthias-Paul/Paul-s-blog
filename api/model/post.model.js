import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
   userId:{
        type:String,
        unique:true,
   },
   userEmail:{
        type:String,
        unique:true,
},
   username:{
        type:String,
        unique:true,
   },
   title:{
        type:String,
        unique:true,
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
   