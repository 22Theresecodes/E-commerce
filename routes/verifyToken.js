const jwt = require ("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1]
        const verify = jwt.verify(token, process.env.JWT_SEC)
        if(!verify){
            res.status(401).json("Token is not valid!")
        }
        const user = await User.findById(verify.id)
        console.log("=====", user)
        req.user = user
        next()
    }else{
        return res.status(401).json("You are not authenticated!")

    }
}

const verifyTokenandAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id|| req.user.isAdmin){
           next()
        }else{
            res.status(403).json("You are not allowed!")
        }
    })
}
const verifyTokenandAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
           next()
        }else{
            res.status(403).json("You are not an admin!")
        }
    })
}
module.exports = { verifyToken, verifyTokenandAuthorization,verifyTokenandAdmin }