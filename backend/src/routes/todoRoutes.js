import { Router } from "express";
import {
  fetchFromAirtable,
  markAsDone,
  moveToDb,
  createTodo,
} from "../controllers/todoController.js";

const router = Router();

router.post("/todos", createTodo);
router.get("/fetch-from-airtable", fetchFromAirtable);
router.post("/mark-as-done", markAsDone);
router.post("/move-to-db", moveToDb);

export default router;
