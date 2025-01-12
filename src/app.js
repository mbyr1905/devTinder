const express = require('express');
const bcrypt = require('bcrypt');
const {connectDB} = require('./config/database')
const {User} = require('./models/user')
const {validateSignUpData} = require('./utils/validation.js')


const app = express()

app.use(express.json());

app.post('/signup', async (req,res)=>{
    try{
        // validate user
        validateSignUpData(req)
        //encrypt password
        const {firstName,lastName,emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash)
        const user = new User({
            firstName,lastName,emailId,password:passwordHash
        });
        await user.save();
        res.send('user added successfully')
    }catch(err){
        res.status(400).send("Error message: "+ err.message);
    }
});

app.post('/login', async (req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error('Invalid Credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            res.send('Logged in successfully');
        }else{
            res.status(400).send('Invalid credentials');
        }
    }catch(err){
        res.status(400).send("Error message: "+ err.message);
    }
})

app.get('/user', async (req,res)=>{
    const email = req.body.emailId;
    try{
        const users = await User.find({ emailId: email});
        if(users.length===0){
            res.status(404).send("No users found");
        }
        else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.get('/feed', async (req,res)=>{
    const users = User.findOne({})
    try{
        const users = await User.find({ emailId: email});
        if(users.length===0){
            res.status(404).send('No users found')
        }
        else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Something went wrong"+str(err.message));
    }
})

app.patch('/user/:userId', async (req,res)=>{
    const userId = req.params?.userId;
    const user = req.body
    
    try{
        const allowed_updates =['photoUrl', 'age', 'about', 'gender','skills']
        const isUpdateAllowed = Object.keys(user).every((k)=>{
            allowed_updates.includes(k);
        });

        if(!isUpdateAllowed){
            throw new Error("update not allowed");
        }
        if(user.body.skills.length>10){
            throw new Error("skills can't have more than 10 items");
        }
        const user = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument:'after' ,runValidators: true});
        res.send("updated successfully");
    }catch(err){
        res.status(400).send("Something went wrong" + err.message);
    }
})

app.delete("/user", async(req,res)=>{
    const userId = req.body.id;
    try{
        const users = await User.findByIdAndDelete(userId);
        res.send('user deleted successfully')
    }catch(err){
        res.status(400).send("Something went wrong"+str(err.message));
    }
})

connectDB().then(()=>{
    console.log('db connected successfully')
    app.listen(3000, () =>{
        console.log('server is successfully listening on port 3000')
    });
}).catch(err=>{
    console.error(err);
})


