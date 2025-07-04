const mongoose = require('mongoose');
require('dotenv').config();


const connectToMongo = async ()=>{
    const mongo_key = process.env.MONGO_URI
    if(!mongo_key){
        console.error("Mongo key is not defined.")
        process.exit(1);
    }

    try {
        await mongoose.connect(mongo_key);
        console.log('Connected to MongoDB Successfully.')
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`)
    }
}

module.exports = connectToMongo;