const express=require('express')
const app=express();
const mongoose=require('mongoose')
require('dotenv').config()
const userRoute = require('../API/routes/user')
const videoRoutes = require('../API/routes/video')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

mongoose.connect(process.env.MONGO_URI)
.then(res=>{
    console.log('connected with database...')
})
.catch(err=>{
    console.log(err)
})

app.use(bodyParser.json())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir :'/tmp/'
}));

app.use('/user',userRoute)
app.use('/video',videoRoutes)
app.use('/comment',commentRoute)

module.exports=app;
