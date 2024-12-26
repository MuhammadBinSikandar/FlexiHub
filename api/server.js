import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';

const app = express();
dotenv.config();
mongoose.set('strictQuery', true)

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('MongoDB is connected');
    } catch (error) {
        console.log(error);
    }
};

app.use("/api/users", userRoute);

app.listen(8000, () => {
    connect();
    console.log('Server is running on port 8000');
})