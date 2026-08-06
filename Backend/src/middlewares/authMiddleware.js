import jsonwebtoken from "jsonwebtoken";
import tokenBlackListModel from "../model/blackListModel.js";

async function authUser(req,res,next){
    
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Token not provided"});
        }

        const isTokenBlackLiested = await tokenBlackListModel.findOne({
            token
        })
        if(isTokenBlackLiested){
            return res.status(401).json({
                message: "Token is invalid"
            })

        }


        try {
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
            req.user = decoded;
            next();

        } catch (error) {
            return res.status(401).json({message:"Invalid token"});            
        }
    
}

export default authUser;