const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {connectDB} = require('./config/database')
const {userAuth} = require('./middlewares/auth');

const app = express()

app.use(express.json());
app.use(cookieParser());


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


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


