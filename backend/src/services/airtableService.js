import Airtable from "airtable";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID;
if (!baseId) {
  throw new Error("AIRTABLE_BASE_ID environment variable is not set");
}
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  baseId
);

const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "ToDo";

export const getTodosFromAirtable = async () => {
  try {
    const records = await base(TABLE_NAME).select().all();
    return records;
  } catch (error) {
    console.error("Error fetching from Airtable:", error);
    throw error;
  }
};

export const createTodoInAirtable = async (todoName) => {
  try {
    const todoId = uuidv4();
    const newRecord = await base(TABLE_NAME).create([
      {
        fields: {
          todo_name: todoName,
          todo_id: todoId,
          status: "Todo",
        },
      },
    ]);
    return newRecord;
  } catch (error) {
    console.error("Error creating todo in Airtable:", error);
    throw error;
  }
};
