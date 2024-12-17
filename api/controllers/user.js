import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import User from "../model/user.model.js"

export const  test = (req, res)=>{
    res.send("API Call");
}
export const  updateUser = async (req, res, next)=>{
     if(req.user.id !== req.params.userId){
        return next(errorHandler(403, "You are not allowed to update"))
     }
     if(req.body.password){
         if(req.body.password.length < 6){
            return next(errorHandler(400, "Password must be at least 6 characters"))
         }
         req.body.password = bcryptjs.hashSync(req.body.password, 10)
     }
     if(req.body.username){
        if(req.body.username.length < 5 || req.body.username.length > 20 ){
           return next(errorHandler(400, "Username must be between 5 and 20 characters"))
        }
        if(req.body.username.includes(" ")){
            return next(errorHandler(400, "Username must not include a space"))
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    profilePicture:req.body.profilePicture,
                    password:req.body.password,
                },
            },{new:true})
            const {password, ...rest} = updatedUser._doc;
            res.status(200).json(rest);
        } catch (error) {
            next(error);
        }
    }
   
    

}