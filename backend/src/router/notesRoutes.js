import express from "express";
import { createNote, deleteNote, getAllNotes, getNoteById,updateNote } from "../controllers/notesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router =express.Router();


router.get("/", protect, getAllNotes);
router.post("/", protect, createNote);
router.get("/:id", protect, getNoteById);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);


export default router;



