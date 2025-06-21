import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

const baseId = process.env.AIRTABLE_BASE_ID;
if (!baseId) {
  throw new Error("AIRTABLE_BASE_ID environment variable is not set");
}
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  baseId
);

const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "todos";

export const getTodosFromAirtable = async () => {
  try {
    const records = await base(TABLE_NAME).select().all();
    return records;
  } catch (error) {
    console.error("Error fetching from Airtable:", error);
    throw error;
  }
};
