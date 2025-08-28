const jwt = require('jsonwebtoken')

const verifyToken = async (req,res,next)=>{

    const token = req.cookies.token

    if(!token){
        return res.status(401).json("You are not authenticated!")
    }

    jwt.verify(token,process.env.JWTSECRET,async (err,data)=>{
        if(err){
            return res.status(403).json("Token is not valid!")
        }
        req.userId = data._id
        next()
    })
}

module.exports = verifyToken