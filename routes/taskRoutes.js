import { Router } from "express";

const taskRoutes = Router();
import TaskController from "../controllers/taskController.js";

const taskController = new TaskController();

// GET
taskRoutes.get("/getAll", taskController.getAll);
taskRoutes.get("/:id", taskController.getTaskById);

// POST
taskRoutes.post("/create", taskController.createTask);

// // PUT 
taskRoutes.put("/:id/update", taskController.updateTask);

// PATCH
taskRoutes.patch("/:id/toggleDone", taskController.toggleDone);

// // DELETE
taskRoutes.delete("/:id/delete", taskController.deleteTask);

export default taskRoutes;