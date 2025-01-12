const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(["male",'female', 'other'].includes(value)){
                throw new Error('Gender data is not valid');
            }
        }
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:'this is default about of users'
    },
    skills:{
        type:[String]
    }
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = {User}