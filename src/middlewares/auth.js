const jwt = require('jsonwebtoken');
const {User} = require('../models/user');

const userAuth = async (req,res,next)=>{
    try{
        const cookies = req.cookies;
        const {token} = cookies
        if(!token){
            throw new Error('No token found');
        }
        const decodedMessage = await jwt.verify(token, 'DEV@TINDER$MBYR1905')
        const {_id} = decodedMessage
        const user = await User.findOne({_id})
        if(!user){
            throw new Error('User not found, login again');
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).send("Error message: "+ err.message);
    }
}; 

module.exports = {userAuth}