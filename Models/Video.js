const mongoose = require('mongoose')
const { Schema } = mongoose;

const videoSchema = new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true},
    description:{type:String,required:true},
    user_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    videoUrl:{type:String,required:true},
    videoId:{type:String,required:true},
    thumbnailUrl:{type:String,required:true},
    thumbnailId:{type:String,required:true},
    category:{type:String,required:true},
    tags:[{type:String,required:true}],
    likes:{type:Number,default:0},
    dislikes:{type:Number,default:0},
    views:{type:Number,default:0},
    likedBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    dislikedBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    viewedBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],


},{timestamps:true})

module.exports = mongoose.model('Video', videoSchema);