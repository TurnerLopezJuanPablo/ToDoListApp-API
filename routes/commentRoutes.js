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

// PATCH
commentRoutes.patch("/:id/setCommentToDeleted", commentController.setCommentToDeleted);

export default commentRoutes;