import { Router } from "express";
import validateAccess from "../utils/validateAccess.js"

const subTaskRoutes = Router();
import SubTaskController from "../controllers/subTaskController.js";

const subTaskController = new SubTaskController();

// Validate access
subTaskRoutes.use(validateAccess);

// GET
subTaskRoutes.get("/getAll", subTaskController.getAll);
subTaskRoutes.get("/:id", subTaskController.getSubTaskById);

// POST
subTaskRoutes.post("/create", subTaskController.createSubTask);

// PUT 
subTaskRoutes.put("/:id/update", subTaskController.updateSubTask);

// PATCH
subTaskRoutes.patch("/:id/toggleDone", subTaskController.toggleDone);

// DELETE
subTaskRoutes.delete("/:id/delete", subTaskController.deleteSubTask);

export default subTaskRoutes;