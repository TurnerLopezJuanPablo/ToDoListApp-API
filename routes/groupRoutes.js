import { Router } from "express";

const groupRoutes = Router();
import GroupController from "../controllers/groupController.js";

const groupController = new GroupController();

// GET
groupRoutes.get("/getAll", groupController.getAll);
groupRoutes.get("/:id", groupController.getGroupById);

// POST
groupRoutes.post("/create", groupController.createGroup);

// PUT 
groupRoutes.put("/:id/update", groupController.updateGroup);

// DELETE
groupRoutes.delete("/:id/delete", groupController.deleteGroup);

export default groupRoutes;