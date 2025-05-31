const express=require('express');
const Router = express.Router();
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2;
require('dotenv').config()
const User = require('../Models/User')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { json } = require('body-parser')
const checkAuth = require('../middleware/checkAuth ')


cloudinary.config({
cloud_name: process.env.cloud_name,
api_key: process.env.api_key,
api_secret: process.env.api_secret
});

Router.post('/signup',async (req,res)=>{
    try{

        const users = await User.find({email:req.body.email})
        if (User.length>0)
        {
            return res.status(500).json({
                error:'email already registered'
            })
        }
        const hasCode = await bcrypt.hash(req.body.password,10)
        const uploadedImage = await cloudinary.uploader.upload(req.files.logo.tempFilePath)
        
        const newUser = new User({
            _id:new mongoose.Types.ObjectId,
            channelName:req.body.channelName,
            email:req.body.email,
            phone:req.body.phone,
            password:hasCode,
            logoUrl:uploadedImage,
            logoId:uploadedImage.public_id
        })
        const user = await newUser.save()
        res.status(200).json({
            newUser:user
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
    
    })

    Router.post('/login',async(req,res)=>{
    try
    {
        //   console.log(req.body)
            const user = await  User.find({email:req.body.email})
        //   console.log (users)
            if(user.length==0)
            {
            return res.status(500).json({
                error:'email is not rejisterd...'
            })
        }
            const isValid = await bcrypt.compare(req.body.password,users[0].password)
            console.log(isValid)
            if(!isValid)
            {
            return res.status(500).json({
                error:'invalid password'
            })
        }

            const token = jwt.sign({
            _id:users[0]._id,
            channelName:users[0].channelName,
            email:users[0].email,
            phone:users[0].phone,
            logoId:users[0].logoId
            },
            'Prabhakar Singh Kshatriya',
            {
                expiresIn:'365d'

            }
        )
        res.status(200).json({
            _id:users[0]._id,
            channelName:users[0].channelName,
            email:users[0].email,
            phone:users[0].phone,
            logoId:user[0].logoId,
            logoUrl:users[0].logoUrl,
            token:token,
            subscribers:users[0].subscribers,
            subscribedChannels:users[0].subscribedChannels
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({
            error:'something is wrong'

        })
    }
    })

    // subscriber api
    Router.put('/subscribe/:userBId', checkAuth ,async(req,res)=>{
try{
        const userA = await jwt.verify(req.headers.authorization.split(" ")[1],'Prabhakar Singh Kshatriya')
        console.log(userA)
        const userB = await User.findById(req.params.userBId)
        console.log(userB)
        if(userB.subscribedBy.includes(userA._id))
        {
            return res.status(500).json({
                arror:'already subsribed'
            })
        }
       // console.log('not subscribed')
        userB.subscribers  +=1
        userB.subscribedBy.push(userA._id)
        await userB.save()
        const userAFullInformation = await User.findById(userA._id)
        userAFullInformation.subscribedChannels.push(userB._id)
        await userAFullInformation.save()
        res.status(200).json({
            msg:'Subscribed...'
        })
}
catch(err)
{
    console.log(err)
    res.status(500).json({
        error:err
    })
}
    })

    // unsubscribe api
    Router.put('/unsubscribe/userBId',checkAuth,async(req,res)=>{
        try
        {
            const userA = await jwt.verify(req.headers.authorization.split(" ")[1],'Prabhakar Singh Kshatriya')
            const userB = await User.findById(req.params.userBId)
            console.log(userA)
            console.log(userB)

            if(!userB.subscribedBy.includes(userA._id))
            {
            // unsubscribe logic
            userB.subscribers -=1
            userB.subscribedBy = userB.subscribedBy.filter(userId=>userId.toString() != userA._id)
            await userB.save()
            const userAFullInformation = await User.findById(userA._id)
            userAFullInformation.subscribedChannels = userAFullInformation.subscribedChannels.filter(userId=>userId.toString() != userA._id)
            await userAFullInformation.save()

            res.status(200).json({
                msg:'unsubscribed...'
            })
            }
            else
            {
                return res.status(500).json({
                    error:'aapne subscribe nhi kiya hai..'
                })
            }

        }
        catch(err)
    {
    console.log(err)
    res.status(500).json({
        error:err
    })
}

    })

module.exports = Router