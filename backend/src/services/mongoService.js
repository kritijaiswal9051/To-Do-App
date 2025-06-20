import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI environment variable is not set");
}
const client = new MongoClient(uri);

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectToMongo();

export const saveTodoToMongo = async (todoName) => {
  try {
    const database = client.db();
    const collection = database.collection("completed_todos");
    const doc = {
      todo_name: todoName,
      completed_at: new Date(),
    };
    await collection.insertOne(doc);
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    throw error;
  }
};
