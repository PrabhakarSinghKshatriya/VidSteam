const mongoose = require('mongoose')
const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'user'},
    videoId:{type:String,required:true},
    commentText:{type:String,required:true}


},{timestamps:true})

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
module.exports = Comment;