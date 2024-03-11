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

// PATCH
taskRoutes.patch("/:id/toggleDone", taskController.toggleDone);
taskRoutes.patch("/:id/:groupId/addGroup", taskController.addTaskToGroup);
taskRoutes.patch("/:id/removeTaskFromGroup", taskController.removeTaskFromGroup);
taskRoutes.patch("/:id/:subTaskId", taskController.addSubTask);
taskRoutes.patch("/:id/:subTaskId/remove", taskController.removeSubTask);

// DELETE
taskRoutes.delete("/:id/delete", taskController.deleteTask);

export default taskRoutes;