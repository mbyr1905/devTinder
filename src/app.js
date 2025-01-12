const express = require('express');
const {connectDB} = require('./config/database')
const {User} = require('./models/user')
const app = express()

app.use(express.json());

app.post('/signup', async (req,res)=>{

    const user = new User(req.body);
    await user.save();
    res.send('user added successfully')
});


connectDB().then(()=>{
    console.log('db connected successfully')
    app.listen(3000, () =>{
        console.log('server is successfully listening on port 3000')
    });
}).catch(err=>{
    console.error(err);
})


