const { read } = require("fs");
const { verify } = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        console.log("Token ===>>", token);
        if(token){
            token = token.slice(7);
            verify(token, "abcdQ123", (err, decoded) => {
                if(err){
                    res.json({
                        success: 0,
                        message: "Invalid Token"
                    });
                }
                else{
                    next();
                }
                
            });
        }
        else{
            res.json({
                success: 0,
                message: "Access Denied !! Unauthorized User"
            });
        }
    }
}