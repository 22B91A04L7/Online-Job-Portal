import mongoose from 'mongoose';

// Function to connect to the MongoDB database
const connectDB = async () =>
{
    mongoose.connection.on('connected',() => console.log("MongoDB connected successfully"));
    mongoose.connection.on('error', (err) => console.error("MongoDB connection error:", err));
    mongoose.connection.on('disconnected', () => console.log("MongoDB disconnected"));

    await mongoose.connect(`${process.env.MONGODB_URI}job-portal`)
}

export default connectDB;