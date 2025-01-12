const validator = require('validator');

const validateSignUpData = (req) =>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(firstName.length<=3 && firstName.length>50 ){
        throw new Error("First name should be between 3 and 50 characters");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password should be at least 8 characters long with at least one uppercase letter, one lowercase letter, one number, and one special character");
    }
}


module.exports = {validateSignUpData}