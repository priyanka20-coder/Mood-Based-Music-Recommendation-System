// database

const mongoose = require("mongoose");

async function connectToDb(){
    try{
        let connect=await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to DB");
    }
    catch(err){
        console.log(err);
    }
}
//DBsongSuggestion
module.exports=connectToDb;