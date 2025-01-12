const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://mbyr:Bhanu%401905@clustermbyr.a11dq.mongodb.net/devTinder');
};

module.exports = {connectDB}

