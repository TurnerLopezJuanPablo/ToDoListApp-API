import { Router } from "express";
import validateAccess from "../utils/validateAccess.js"

const categoryRoutes = Router();
import CategoryController from "../controllers/categoryController.js";

const categoryController = new CategoryController();

// Validate access
categoryRoutes.use(validateAccess);

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