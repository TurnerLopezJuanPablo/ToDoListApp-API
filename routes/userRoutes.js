import { Router } from "express";
import validateAccess from "../utils/validateAccess.js"

const userRoutes = Router();
import UserController from "../controllers/userController.js";

const userController = new UserController();

// LOGIN - CREATE USER // no need of validate access
userRoutes.post("/login", userController.logIn);
userRoutes.post("/create", userController.createUser);

// Validate access
userRoutes.use(validateAccess);

// GET
userRoutes.get("/me", userController.getLoggedUser);
userRoutes.get("/getAllData", userController.getAllData)
userRoutes.get("/:id", userController.getUserById);
userRoutes.get("/:search/getUsersBySearch", userController.getUsersBySearch);

// POST
userRoutes.post("/logout", userController.logOut);
userRoutes.post("/updatePassword", userController.updatePassword);

// PUT 
userRoutes.put("/update", userController.updateUser);

// PATCH
userRoutes.patch("/:id/updateUserName", userController.updateUserName);
userRoutes.patch("/:id/setInactiveToUser", userController.setInactiveToUser);

// DELETE
userRoutes.delete("/:id/delete", userController.deleteUser);

export default userRoutes;