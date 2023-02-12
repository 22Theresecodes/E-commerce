const { verifyToken, verifyTokenandAuthorization, verifyTokenandAdmin} = require("./verifyToken")

const user = require("../models/User");
const User = require("../models/User");

const router = require("express").Router()

//UPDATE
router.put("/:id", verifyTokenandAuthorization, async (req,res)=>{
  const id = req.params.id   //passing id into params
  const existinguser = await user.findById(id) //findingbyId to access salt
  const salt = existinguser.salt
    if(req.body.password){
        req.body.password = await bcrypt.hash(password, salt)
    }
     try{
        const updatedUser = await user.findByIdAndUpdate(id, {
            $set:req.body
        },
        { new: true});
        res.status(200).json(updatedUser)
     } catch (err){
        res.status(500).json(err)
     }
});

//DELETE
router.delete("/:id", verifyTokenandAuthorization, async (req,res)=>{
  try{
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("User deleted...")
  }catch(err){
    res.status(500).json(err)
  }
})

//GET USER
router.get("/find/:id", verifyTokenandAdmin, async (req,res)=>{
  try{
    const user = await User.findById(req.params.id)
    const { password, ...others } = user._doc

    res.status(200).json(others)
  }catch(err){
    res.status(500).json(err)
  }
})

 //GET ALL USERS
 router.get("/", verifyTokenandAdmin, async (req,res)=>{
   const query = req.query.new
try{
    const users = query 
          ? await User.find().sort({_id:-1}).limit(3)
          :await User.find();
      res.status(200).json(users)
    }catch(err){
     res.status(500).json(err)
     }
   })

  //GET USER STATS
   router.get("/stats", verifyTokenandAdmin, async (req,res)=>{
     const date = new Date();
     const lastYear = new Date(date.setFullYear(date.getFullYear()-1))
     try{

      const data = await User.aggregate([
        {$match:{createdAt:{$gte:lastYear} }},
        {
          $project: {
            month: { $month: "$createdAt"}
          },
        },
        {
          $group:{
            _id: "$month",
            total: {$sum: 1},
          },
        },
      ])
      res.status(200).json(data)

     }catch(Err){
      res.status(500)
     }
   })

  
module.exports = router