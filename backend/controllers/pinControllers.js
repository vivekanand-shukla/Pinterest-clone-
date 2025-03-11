import { Pin } from "../models/pinModel.js";
import TryCatch from "../utils/tryCatch.js";

import cloudinary from 'cloudinary'
import getDataUrl from "../utils/urlGenerator.js";

export const createPin = TryCatch(async (req, res) => {
   const { title, pin } = req.body;
   const file = req.file;
   const fileUrl = getDataUrl(file);
   const cloud = await cloudinary.v2.uploader.upload(fileUrl.content)

   await Pin.create({
      title,
      pin,
      image: {
         id: cloud.public_id,
         url: cloud.secure_url,
      },
      owner: req.user._id
   })

   res.json({
      massage: "Pin Created",
   })

})

//
export const getAllPin = TryCatch(async (req, res) => {
   const pins = await Pin.find().sort({ createdAt: -1 })
   res.json(pins);
})
//
export const getSinglePin = TryCatch(async (req, res) => {
   const pin = await Pin.findById(req.params.id).populate("owner", "-password")

   res.json(pin);
})

//f
export const commentOnPin = TryCatch(async (req, res) => {
   const pin = await Pin.findById(req.params.id);

   if (!pin) {
      return res.status(400).json({
         massage: "no Pin With This Id",

      });
   }
   pin.comments.push({
      user: req.user._id,
      name: req.user.name,
      comment: req.body.comment,
   })

   await pin.save();
   res.json({
      massage: "Comment Added",
   })

})

export const deleteComment = TryCatch(async (req, res) => {

   const pin = await Pin.findById(req.params.id);

   if (!pin) {
      return res.status(400).json({
         massage: "no Pin With This Id",

      });
   }
   if (!req.query.commentId) {
      return (res.status(400).json({
         massage: "please give comment id",
      }))
   }

   const commentIndex = pin.comments.findIndex(
      (item) => item._id.toString() === req.query.commentId.toString()
   );

   if (commentIndex === -1) {
      return res.status(400).json({
         massage: "comment not found",

      });
   }

   const comment = pin.comments[commentIndex]
   if (comment.user.toString() === req.user._id.toString()) {
      pin.comments.splice(commentIndex, 1)
      await pin.save()

      return (res.json({
         massage: "comment deleated"
      }))


   } else {
      return res.status(403).json({
         massage: "you are not owner of this comment"
      })
   }


})


export const deletePin = TryCatch(async(req,res)=>{
   const pin =await Pin.findById(req.params.id)
     
   if (!pin) {
      return res.status(400).json({
         massage: "no Pin With This Id",

      });}

      if(pin.owner.toString()!==req.user._id.toString()){
         return  res.status(403).json({
            massage:"Unauthorized"
         })
      }

      await cloudinary.v2.uploader.destroy(pin.image.id);
      await pin.deleteOne()

      res.json({
         massage:"pin Deleted"
      })
  
})


export const updatePin = TryCatch(async(req,res)=>{

   const pin =await Pin.findById(req.params.id)
     
   if (!pin) {
      return res.status(400).json({
         massage: "no Pin With This Id",

      });}



      if(pin.owner.toString()!==req.user._id.toString()){
         return  res.status(403).json({
            massage:"Unauthorized"
         })
      }

      pin.title = req.body.title;
      pin.pin =req.body.pin
      await pin.save()

      res.json({
         massage:"pin updated"
      })

})
