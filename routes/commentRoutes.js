import { Router } from "express";
import validateAccess from "../utils/validateAccess.js"

const commentRoutes = Router();
import CommentController from "../controllers/commentController.js";

const commentController = new CommentController();

// Validate access
commentRoutes.use(validateAccess);

// GET
commentRoutes.get("/getAll", commentController.getAll);
commentRoutes.get("/:id", commentController.getCommentById);

// POST
commentRoutes.post("/create", commentController.createComment);

// PUT 
commentRoutes.put("/:id/update", commentController.updateComment);

// DELETE
commentRoutes.delete("/:id/delete", commentController.deleteComment);

export default commentRoutes;