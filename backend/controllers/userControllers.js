import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt'
import TryCatch from "../utils/tryCatch.js";
import generateToken from "../utils/generateTokens.js";
export const registerUser = TryCatch(async (req, res) => {

    const { name, email, password } = req.body;
    let user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({
            massage: "Already hava an account with this  email"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    user = await User.create({
        name,
        email,
        password: hashPassword,
    })

    generateToken(user._id, res)


    res.status(201).json({
        user,
        massage: "User Registered",
    })

})

export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({
            massage: "No user with  this mail"
        })
    }



    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
        return res.status(400).json({
            massage: "Wrong password"
        })
    }

    generateToken(user._id, res);

    res.json({
        user,
        massage: "logged In"
    })


})


export const myProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id)
    res.json(user)
})

export const userProfle = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
})

export const followAndUfollowUser = TryCatch(async (req, res) => {

    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id)
    if (!user) {
        return (
            res.status(400).json({
                massage: "no user with this id",
            })
        )
    }
    if (user._id.toString() === loggedInUser._id.toString()) {
        return (res.status(400).json({
            massage: " you can't follow yourself",
        }))

    }

    if (user.followers.includes(loggedInUser._id)) {
        const indexFollowing = loggedInUser.followings.indexOf(user._id)
        const indexFollowers = user.followers.indexOf(loggedInUser._id)

        loggedInUser.followings.splice(indexFollowing, 1);
        user.followers.splice(indexFollowers, 1);

        await loggedInUser.save();
        await user.save();
        res.json({
            massage: "user unfollowed",
        })
    }
    else {
        loggedInUser.followings.push(user._id);
        user.followers.push(loggedInUser._id)

        await loggedInUser.save();
        await user.save();
        res.json({
            massage: "user followed",
        })


    }
})

export const logOutUser = TryCatch(async (req, res) => {
    res.cookie("token", "", { maxAge: "0" })
    res.json({
        massage: "Logged Out Susscessfully",
    })
})