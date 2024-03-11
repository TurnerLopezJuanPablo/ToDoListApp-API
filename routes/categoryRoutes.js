import { Router } from "express";

const categoryRoutes = Router();
import CategoryController from "../Controllers/categoryController.js";

const categoryController = new CategoryController();

// GET
categoryRoutes.get("/getAll", categoryController.getAll);
categoryRoutes.get("/:id", categoryController.getCategoryById);

// POST
categoryRoutes.post("/create", categoryController.createCategory);

// PUT 
categoryRoutes.put("/:id/update", categoryController.updateCategory);

// DELETE
categoryRoutes.delete("/:id/delete", categoryController.deleteCategory);

export default categoryRoutes;