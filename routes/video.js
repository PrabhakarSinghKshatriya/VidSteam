const express = require('express')
const Router = express.Router()
const checkAuth = require('../middleware/checkAuth')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const Video = require('../Models/Video')
const mongoose = require('mongoose')

cloudinary.config({
cloud_name: process.env.cloud_name,
api_key: process.env.api_key,
api_secret: process.env.api_secret
});

Router.post('/upload',checkAuth,async()=>{
    try
    {
        const token =  req.headers.authorization.split(" ")[1]
        const user = await jwt.verify(token,'Prabhakar Singh Kshatriya')
        const uploadedVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath,{
            resource_type:'video'
        })
        const uploaderThumbnail = await cloudinary.uploader.upload(req.files.uploaderThumbnail.tempFilePath)

        const newVideo = new Video({
            _id:mongoose.Schema.Types.ObjectId,
            title:req.body.title,
            description:req.body.description,
            user_id:User._id,
            videoUrl:uploadedVideo,
            videoId:uploadedVideo.public_id,
            thumbnailUrl:uploadedVideo.secure_url,
            thumbnailId:uploadedVideo.public_id,
            category:req.body.category,
            tags:req.body.tags.split(",")
            })

            const newUploadedVideoData = await newVideo.save()
            res.status(200).json({
                newVideo:newUploadedVideoData
            })
    }
    catch(err)
    {
            console.log(err)
            return res.status(500).json({
            error:err
        })
    }
})


//update video detail
Router.put('/:videoId',checkAuth,async(req,res)=>{
    try
    {
        const verifiedUser = await jwt.verify(req.headers.authorization.split(" ")[1],'Prabhakar Singh Kshatriya')
        const video = await Video.findById(req.params.videoId)
        console.log(video)

        if(video.user_id == verifiedUser._id)
        {
            //update video detail
            if(req.files)
            {
                //update thumbnail and text data
                await cloudinary.uploader.destroy(video.thumbnailId)
                const updateThumnail = await cloudinary.uploader.upload(res.files.thumbnail.tempFilePath)
                const updateData ={
                    title:req.body.title,
                    description:req.body.description,
                    category:req.body.category,
                    tags:req.body.tags.split(","),
                    thumbnailUrl:updateThumnail.secure_url,
                    thumbnailId:updateThumnail.public_id,
                }
                const updatedVideoDetail = video.findByIdAndUpdate(req.params.videoId,updateData)
                res.status(200).json({
                    uploadedVideo:updatedVideoDetail
                })
            }
            else{
                const updateThumnail = await cloudinary.uploader.upload(res.files.thumbnail.tempFilePath)
                const updateData ={
                    title:req.body.title,
                    description:req.body.description,
                    category:req.body.category,
                    tags:req.body.tags.split(","),
                }
                const updatedVideoDetail = video.findByIdAndUpdate(req.params.videoId,updateData)
                res.status(200).json({
                    uploadedVideo:updatedVideoDetail
                })
            }
        }
        else
        {
            return res.status(500).json({
                error:'you have no permission'
            })
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
})

// Delete API
Router.delete('/:videoId',checkAuth,async(req,re)=>{
    try
    {
        const verifiedUser = await jwt.verify(req.headers.authorization.split(" ")[1],'Prabhakar Singh Kshatriya')
        console.log(verifiedUser)
        const video = await video.findById(req.params.videoId)
        if(video.user_id == verifiedUser._id)
        {
            //delete video ,thumbnail and data from database
            await cloudinary.uploader.distroy(video.videoId,{resource_type:'video'})
            await cloudinary.uploader.distroy(video.thumbnailId)
            const deletedResponse = await video.findIdAndDelete(req.params.videoId)
            res.status(200).json({
                deletedResponse:deletedResponse
            })
        }
        else
        {
            return res.status(500).json({
                error:'aapke bas ki bat n beta ....'
            })
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
})

// Like API
Router.put('/like/:videoId',checkAuth,async(req,res)=>{
    try
    {
        const verifiedUser = await jwt.verify(req.headers.authorization.split(" ")[1],'Prabhakar Singh Kshatriya')
        console.log(verifiedUser)
        const video = await video.findById(req.params.videoId)
        console.log(Video)
        if(video.likedBy.includes(verifiedUser._id))
        {
            return res.status(500).json({
                error:'already liked'
            })
        }
        if(video.dislikedBy.includes(verifiedUser._id))
        {
            video.dislike -= 1;
            video.dislikedBy = video.dislikedBy.filter(userId=>userId.toString() != verifiedUser._id)
        }

        video.likes+=1;
        video.likedBy.push(verifiedUser._id)
        await video.save();

        res.status(200).json({
            msg:'liked'
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

// Dislike API
Router.put('/dislike/:videoId',checkAuth,async(req,res)=>{
    try
    {
        const verifiedUser = await jwt.verify(req.headers.authorization.split(" ")[1],'Prabhakar Singh Kshatriya')
        console.log(verifiedUser)
        const video = await video.findById(req.params.videoId)
        console.log(Video)
        if(video.dislikedBy.includes(verifiedUser._id))
        {
            return res.status(500).json({
                error:'already disliked'
            })
        }

        if(video.likedBy.includes(verifiedUser._id))
        {
            video.like -= 1;
            video.likedBy = video.likedBy.filter(userId=>userId.toString() != verifiedUser._id)
        }
        video.dislikes +=1;
        video.dislikedBy.push(verifiedUser._id)
        await video.save();
        res.status(200).json({
            msg:'disliked'
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

Router.put('/views/:video',async(req,res)=>{
    try
    {
        const video= await video.findById(req.params.videoId)
        console.log(video)
        video.views +=1;
        await video.save();
        res.status(200).json({
            msg:'ok'
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


module.exports = Router