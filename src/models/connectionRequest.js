const mongoose = require('mongoose');
const {User} = require('./user'); 

const connectionRequestSchema = new mongoose.Schema({
    fromUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    status:{
        type:String,
        enum :{
            values:["ignore", "interested", "rejected", "accepted"],
            message: `{Values} is not a valid type`
        },
        required:true
    }
}, {
    timestamps: true,
})
const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequest;