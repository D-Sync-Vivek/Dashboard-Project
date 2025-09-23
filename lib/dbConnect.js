import dotenv from "dotenv";
dotenv.config();

console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined.");
}

import { MongoClient } from "mongodb";

let client;
let db;

export default async function dbConnect() {
  if (db) return db;

  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }

  db = client.db("DashboardDB");
  return db;
}

// closing connection.
export async function closeConnection(){
    if(client){
        await client.close();
        client = null;
        db = null;
    }
}