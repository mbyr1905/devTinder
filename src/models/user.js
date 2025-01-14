const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
        index: true
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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid');
            }
        }
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

userSchema.methods.getJWT = async function(){
    const user = this; 
    // create a jwt cookie
    const token = await jwt.sign({_id:user._id}, "DEV@TINDER$MBYR1905", {expiresIn:"1h"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordByUser){
    const user = this;
    const passwordHash = user.password
    const isPasswordValid = await bcrypt.compare(passwordByUser, passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = {User}