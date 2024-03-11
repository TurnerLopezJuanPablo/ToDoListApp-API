import { Router } from "express";

const commentRoutes = Router();
import CommentController from "../Controllers/CommentController.js";

const commentController = new CommentController();

// // GET
// commentRoutes.get("/getAll", commentController.getAll);
// commentRoutes.get("/:id", commentController.getCommentById);

// // POST
// commentRoutes.post("/create", commentController.createComment);

// // PUT 
// commentRoutes.put("/:id/update", commentController.updateComment);

// // DELETE
// commentRoutes.delete("/:id/delete", commentController.deleteComment);

export default commentRoutes;