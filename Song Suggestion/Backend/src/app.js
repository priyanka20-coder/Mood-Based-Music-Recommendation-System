//

const express=require("express");
const connectToDb = require("./db/db");
const app=express();
const songRoute=require("./routes/songs.routes")

connectToDb()
app.use(express.json());
app.use("/",songRoute)

module.exports=app;