const express=require('express')
const app=express();
const mongoose=require('mongoose')
require('dotenv').config()
const userRoute = require('./routes/user')
const videoRoutes = require('./routes/video')
const commentRoute = require('./routes/comment')

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors') 

const connectWithDatabase =async()=>{
    try{
        const res=await mongoose.connect(process.env.MONGO_URI)
        console.log('connected with database')
    }
    catch(err)
    {
        console.log(err)
    }
}
connectWithDatabase()

app.use(cors())
app.use(bodyParser.json())

app.use(fileUpload({
    useTempFiles : true,
    // tempFileDir :'/tmp/'
}));

app.use('/user',userRoute)
app.use('/video',videoRoutes)
app.use('/comment',commentRoute)

module.exports=app;
