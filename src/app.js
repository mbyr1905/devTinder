const express = require('express');

const app = express()

app.post('/test', (req,res)=>{
    res.send("testing")
})

app.get('/test', (req,res)=>{
    res.send({name:'mbyr', age:24})
})

app.use('/', (req,res)=>{
    res.send("hello from the server")
})

app.listen(3000, () =>{
    console.log('server is successfully listening on port 3000')
});