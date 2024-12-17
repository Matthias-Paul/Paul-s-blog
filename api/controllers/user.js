export const  test = (req, res)=>{
    res.send("API Call");
}
export const  updateUser = async (req, res, next)=>{
     console.log(req.user);
    

}