import express from 'express'
const router = express.Router()
import { followAndUfollowUser, loginUser, logOutUser, myProfile, registerUser , userProfle } from '../controllers/userControllers.js';
import { isAuth } from '../middlewares/isAuth.js';



router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout",isAuth, logOutUser);
router.get("/me", isAuth, myProfile);
router.get("/:id", isAuth , userProfle)
router.post("/follow/:id", isAuth , followAndUfollowUser)
export default router;