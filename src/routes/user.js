const express = require('express');
const userRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { User } = require('../models/user');

userRouter.get("/user/requests/received",userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = ConnectionRequest.find({toUserId:loggedInUser._id, status:"interested"}).populate("fromUserId", ['firstName', 'lastName', 'age', 'gender']);

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[{toUserId: loggedInUser._id, status:'accepted'},
                {fromUserId: loggedInUser._id, status:'accepted'}
            ]
        }).populate("fromUserId",['firstName', 'lastName', 'age', 'gender']).populate("toUserId",['firstName', 'lastName', 'age', 'gender']);

        const data = connectionRequests.map(row=>{
            if(row.fromUserId.to_String() === loggedInUser._id.to_String()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({data:data});
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

userRouter.get('/feed', async (req,res)=>{
    try{
        // no accepted , rejeted, himself, intrrested, 
        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit)||10;
        limit = limit>50 ? 50: limit;
        const skip = (page-1)*limit
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select(["fromUserId", "toUserId"]);

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req=>{
            hideUsersFromFeed.add(req.fromUserId.to_String());
            hideUsersFromFeed.add(req.toUserId.to_String());
        });
        const user  = await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUsersFromFeed)}},
                {_id:{$ne:loggedInUser._id}},
            ]
        }).select(['firstName', 'lastName', 'age', 'gender']).skip(skip).limit(limit);
        res.send(user);
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
})

module.exports = userRouter;