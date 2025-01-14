const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {validateEditProfileData} = require('../utils/validation');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try{
        user = req.user;
        if(!user){
            throw new Error('User not found, login again');
        }
        res.send(user);
    }catch(err){
        res.status(400).send("Error message: "+ err.message);
    }
})

profileRouter.patch('/profile/edit', userAuth,async (req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error('Invalid edit request');
        }
        user = req.user;
        Object.keys(req.body).forEach(key =>{
            user[key] = req.body[key];
        })
        await user.save()
        res.send("Profile updates successfully")
    }catch(err){
        res.status(400).send("Error message: "+ err.message);
    }
})


profileRouter.patch('./profile/password', (req,res)=>{
    try{
        
    }catch(err){
        res.status(400).send("Error message: "+ err.message);
    }
})

module.exports = profileRouter;