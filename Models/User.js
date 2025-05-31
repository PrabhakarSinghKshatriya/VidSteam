const mongoose= require('mongoose')
const { subscribe } = require('../app')

const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    channelName:{type:String,required:true},
    phone:{type:String,required:true},
    password:{type:String,required:true},
    logoUrl:{type:String,required:true},
    logold:{type:String,required:true},
    subscribes:{type:Number,default:0},
    subscribedBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    subscribedChannels:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)