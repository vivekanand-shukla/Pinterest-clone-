import express from 'express';

import uploadFile from '../middlewares/multer.js';
import { commentOnPin, createPin, deleteComment, deletePin, getAllPin, getSinglePin, updatePin } from '../controllers/pinControllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router()

router.post("/new" ,isAuth, uploadFile ,createPin);

router.get("/all" , isAuth ,getAllPin );

router.get("/:id" , isAuth ,getSinglePin );

router.put("/:id" , isAuth ,updatePin );

router.delete("/:id" , isAuth ,deletePin );

router.post("/comment/:id" , isAuth  ,commentOnPin);

router.delete("/comment/:id" , isAuth  ,deleteComment);



export default router;

