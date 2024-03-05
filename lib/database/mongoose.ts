import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}
// The purpose of caching the connection is to avoid repeatedly reconnecting to the MongoDB database every time the connectToDatabase function is called.

// Using a global variable to cache the Mongoose connection to avoid reconnecting on each function call
let cached: MongooseConnection = (global as any).mongoose
// If the connection is not cached, initialize it
if (!cached) {
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error('MONGODB_URL is not defined');

    // If a promise is not already created, create a new Mongoose connection
    cached.promise =
        cached.promise ||
        mongoose.connect(MONGODB_URL, {
            dbName: 'imaginify', bufferCommands: false
        })

    // Await the connection promise and store the connection in the cache
    cached.conn = await cached.promise;
    return cached.conn;
}