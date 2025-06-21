import { getTodosFromAirtable } from "../services/airtableService.js";
import {
  storeTodoInRedis,
  getTodoFromRedis,
  removeTodoFromRedis,
} from "../services/redisService.js";
import { saveTodoToMongo } from "../services/mongoService.js";

export const fetchFromAirtable = async (req, res) => {
  try {
    const records = await getTodosFromAirtable();
    const todos = records.map((record) => ({
      id: record.id,
      name: record.fields.todo_name,
      created_at: record.fields.created_at,
    }));
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos from Airtable" });
  }
};

export const markAsDone = async (req, res) => {
  const { todo_id, todo_name } = req.body;

  if (!todo_id || !todo_name) {
    res.status(400).json({ message: "todo_id and todo_name are required" });
    return;
  }

  try {
    await storeTodoInRedis(todo_id, todo_name);
    res
      .status(200)
      .json({ message: "Todo marked as done and stored in Redis" });
  } catch (error) {
    res.status(500).json({ message: "Error storing todo in Redis" });
  }
};

export const moveToDb = async (req, res) => {
  const { todo_id } = req.body;
  if (!todo_id) {
    res.status(400).json({ message: "todo_id is required" });
    return;
  }

  try {
    const todoName = await getTodoFromRedis(todo_id);
    if (!todoName) {
      res.status(404).json({ message: "Todo not found in Redis" });
      return;
    }

    await saveTodoToMongo(todoName);
    await removeTodoFromRedis(todo_id);

    res.status(200).json({ message: "Todo moved to MongoDB" });
  } catch (error) {
    res.status(500).json({ message: "Error moving todo to MongoDB" });
  }
};
