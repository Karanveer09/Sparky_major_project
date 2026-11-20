import mongoose from "mongoose";
import "dotenv/config";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connects() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI not defined in environment variables");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
       dbName: "sparky", // ✅ IMPORTANT
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
