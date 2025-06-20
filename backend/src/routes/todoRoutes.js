import { Router } from "express";
import {
  fetchFromAirtable,
  markAsDone,
  moveToDb,
} from "../controllers/todoController.js";

const router = Router();

router.get("/fetch-from-airtable", fetchFromAirtable);
router.post("/mark-as-done", markAsDone);
router.post("/move-to-db", moveToDb);

export default router;
