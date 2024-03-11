import { Router } from "express";
import validateAccess from "../utils/validateAccess.js"

const userRoutes = Router();
import UserController from "../Controllers/userController.js";

const userController = new UserController();

// LOGIN - CREATE USER // no need of validate access
userRoutes.post("/login", userController.logIn);
userRoutes.post("/create", userController.createUser);

// Validate access
userRoutes.use(validateAccess);

// GET
userRoutes.get("/me", userController.getLoggedUser);
userRoutes.get("/:id", userController.getUserById);
// I could use a GET to "get" all related data of the user in one shot

// POST
userRoutes.post("/logout", userController.logOut);
// userRoutes.post("/:id/updatePassword", userController.updatePassword);

// PUT 
// userRoutes.put("/:id/update", userController.updateUser);

// DELETE
userRoutes.delete("/:id/delete", userController.deleteUser);

export default userRoutes;