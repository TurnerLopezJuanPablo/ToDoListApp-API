import { Router } from "express";
import validateAccess from "../utils/validateAccess.js"

const boardRoutes = Router();
import BoardController from "../controllers/boardController.js";

const boardController = new BoardController();

// Validate access
boardRoutes.use(validateAccess);

// GET
boardRoutes.get("/getAll", boardController.getAll);
boardRoutes.get("/:id", boardController.getBoardById);

// POST
boardRoutes.post("/create", boardController.createBoard);

// PUT 
boardRoutes.put("/:id/update", boardController.updateBoard);

// PATCH
boardRoutes.patch("/:id/changePermit", boardController.changePermit);
boardRoutes.patch("/:id/setNewOwner", boardController.setNewOwner);

// DELETE
boardRoutes.delete("/:id/delete", boardController.deleteBoard);

export default boardRoutes;