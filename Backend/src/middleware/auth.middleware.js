const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../model/blacklist.model")

async function authUser(req, res, next){
    //fetch the token from cookies 

    const token = req.cookies.token
    
    if(!token){
        return res.status(401).json({
            message: "token not provided"
        })
    }

    //if we get the token, check if its blacklisted or not 
    const isTokenBlacklsited = await tokenBlacklistModel.findOne({
        token
    })
    if(isTokenBlacklsited){
        return res.status(401).json({
            message:"The token is black listed"
        })
    }


    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //create a new property "user" in req.user .. so we can use this later
        req.user = decoded
        next()//Authentication middleware passed. Continue to the next middleware or controller
    }catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }
    
}

module.exports = {authUser}