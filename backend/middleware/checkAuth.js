const JWT = require("jsonwebtoken")

// Checking Authentication
module.exports = async(req,res,next)=>{
    const authHeader = req.headers['authorization']
    // Taking the token from the header
    const token = authHeader && authHeader.split(' ')[1];
    // If there is no token
    if(token == null){
        return res.status(401).send("You are not Authorized")
    }

    // Verifying the token
    JWT.verify(token,process.env.JWT_SECRET_KEY,(err, user)=>{
        if(err){
            return res.status(403).send("You are not Authorized")
        }
        req.user = user;
        next()
    })
}