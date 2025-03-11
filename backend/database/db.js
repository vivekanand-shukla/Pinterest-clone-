import mongoose from "mongoose";

const connectDb = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "Pinterest"
        })
        console.log("mongoDb connected")

    } catch (error) {

        console.log(error);
    };



};
export default connectDb;