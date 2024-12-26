import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import gigRoute from './routes/gig.route.js';
import orderRoute from './routes/order.route.js';
import conversationRoute from './routes/conversation.route.js';
import messageRoute from './routes/message.route.js';
import reviewRoute from './routes/review.route.js';
import cookieParser from 'cookie-parser';

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

app.use(cookieParser())
app.use(express.json())

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);


app.listen(8000, () => {
    connect();
    console.log('Server is running on port 8000');
})