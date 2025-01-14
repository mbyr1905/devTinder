const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { User } = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedSattsu = ['ignored', 'interested']
        if(!allowedSattsu.includes(status)){
            throw new Error('Invalid status. Only "ignored" or "interested" are allowed');
        }
        if(fromUserId===toUserId){
            throw new Error('Cannot send request to yourself');
        }
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId: fromUserId, toUserId: toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });
        if(existingRequest){
            res.status(400).json({message:'Request already sent'});
        }
        const toUser = await User.findOne({_id: toUserId});
        if(!toUser){
            res.status(404).json({message:"User not found"});
        }
        const connectionRequest = new ConnectionRequest({fromUserId, toUserId, status});
        const data = await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully",
            data
        });
        
    }catch(err){
        res.status(400).send("Error message: "+ err.message);
    }
})

requestRouter.post('/request/send/:status/:requestId', userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        const allowedStatus = ["accepted", "rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:'status not allowed'});
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested',
        });
        if(!connectionRequest){
            return res.status(404).json({message:'Request not found or not interested'});
        }
        connectionRequest.status = status;
        const data = connectionRequest.save()
        res.send(200).json({message:"request accepted interested", data});
    }catch(err){
        res.status(400).send("Error message: "+ err.message);
    }
})


module.exports = requestRouter;