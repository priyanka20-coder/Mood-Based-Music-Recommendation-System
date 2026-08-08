// Model

const mongoose=require("mongoose")

const songSchema=new mongoose.Schema({
    
    title:{
        type:String,
        requires:true
    },
    artist:{
        type:String,
        requires:true
    },
    mood:{
        type:String,
        requires:true
    },
    audioFile:{
        type:String,
        requires:true
    },
})

const songModel=mongoose.model("songs",songSchema);

module.exports=songModel;