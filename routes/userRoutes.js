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
userRoutes.get("/getUsersBySearch", userController.getUsersBySearch);
userRoutes.get("/:id", userController.getUserById);


// POST
userRoutes.post("/logout", userController.logOut);
userRoutes.post("/updatePassword", userController.updatePassword);

// PUT 
userRoutes.put("/update", userController.updateUser);

// PATCH
userRoutes.patch("/updateUserName", userController.updateUserName);
userRoutes.patch("/setInactiveToUser", userController.setInactiveToUser);

// DELETE
userRoutes.delete("/:id/delete", userController.deleteUser);

export default userRoutes;