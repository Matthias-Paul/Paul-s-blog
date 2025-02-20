import { errorHandler } from "../utils/error.js";
import User from "../model/user.model.js";
import Comment from "../model/comment.model.js";

export const postComment = async (req, res, next)=>{

    try {
        const { comment, postId, userId } = req.body;

        if(userId !== req.user.id){
            return next(errorHandler(404, "You are not allowed to make a comment"))
        }
    
        const user = await User.findById(req.user.id);

            if (!user) {
            return next(errorHandler(404, "User not found"));
            }
            
        const username = user.username
        const profilePicture = user.profilePicture

         const UserComment = new Comment({
              comment,   
              postId,
              userId,
              username,
              profilePicture,

         })

        const createdComment = await UserComment.save()

         res.status(201).json({
            message:"Create comment Successfully",
            createdComment,
         })



    } catch (error) {
       next(error) 
    }

}

export const getComment = async (req, res, next) =>{

    try {
        const startIndex = Math.max(parseInt(req.query.startIndex, 10) || 0, 0);
        const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);

        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
        
        res.status(200).json({comments})


    } catch (error) {
        next(error)
    }


}


export const likeComment = async (req, res, next) => {

    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(errorHandler(404, "Comment not found"));
        }

        const hasLiked = comment.likes.includes(userId);

        // Update the likes and numberOfLikes count in a single operation
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $inc: { numberOfLikes: hasLiked ? -1 : 1 },
                [hasLiked ? "$pull" : "$push"]: { likes: userId }
            },
            { new: true } // Return the updated document
        );

        res.status(200).json({ comment: updatedComment });
        
        console.log(updatedComment)
    } catch (error) { 
        next(error);
    }
};
