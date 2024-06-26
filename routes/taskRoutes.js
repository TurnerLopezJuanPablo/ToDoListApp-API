import { Router } from "express";
import validateAccess from "../utils/validateAccess.js"

const taskRoutes = Router();
import TaskController from "../controllers/taskController.js";

const taskController = new TaskController();

// Validate access
taskRoutes.use(validateAccess);

// GET
taskRoutes.get("/getAll", taskController.getAll);
taskRoutes.get("/:id", taskController.getTaskById);

// POST
taskRoutes.post("/create", taskController.createTask);

// PUT 
taskRoutes.put("/:id/update", taskController.updateTask);
taskRoutes.put("/:boardId/generateNewOrder", taskController.generateNewOrder);

// PATCH
taskRoutes.patch("/:id/toggleDone", taskController.toggleDone);
taskRoutes.patch("/:id/toggleStarred", taskController.toggleStarred);
taskRoutes.patch("/:id/asignUserToTask", taskController.asignUserToTask);

// DELETE
taskRoutes.delete("/:id/delete", taskController.deleteTask);

export default taskRoutes;