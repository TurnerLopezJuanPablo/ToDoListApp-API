import { Router } from "express";
import validateAccess from "../utils/validateAccess.js"

const calculatorHistoryRoutes = Router();
import CalculatorHistoryController from "../controllers/calculatorHistoryController.js";

const calculatorHistoryController = new CalculatorHistoryController();

// Validate access
calculatorHistoryRoutes.use(validateAccess);

// GET
calculatorHistoryRoutes.get("/getAll", calculatorHistoryController.getAll);

// POST
calculatorHistoryRoutes.post("/create", calculatorHistoryController.createCalculatorHistory);

// DELETE
calculatorHistoryRoutes.delete("/:id/delete", calculatorHistoryController.deleteCalculatorHistory);
calculatorHistoryRoutes.delete("/deleteAll", calculatorHistoryController.deleteAll);


export default calculatorHistoryRoutes;