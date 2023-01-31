const { verifyToken, verifyTokenandAuthorization} = require("./verifyToken")

const user = require("../models/User")

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
        const updatedUser = await user.findByIdAndUpdate(req.params.id, {
            $set:req.body,
        },
        { new: true}
        );
        res.status(200).json(updatedUser)
     } catch (err){
        res.status(500).json(err)
     }
})

module.exports = router;