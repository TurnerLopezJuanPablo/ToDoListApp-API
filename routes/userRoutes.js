import { Router } from "express";

const userRoutes = Router();
import UserController from "../Controllers/userController.js";

const userController = new UserController();

// // LOGIN
// userRoutes.post("/login", userController.logIn);

// // Validate access

// // GET
// userRoutes.get("/getAll", userController.getAll);
// userRoutes.get("/me", userController.getLoggedUser);
// userRoutes.get("/:id", userController.getUserById);

// // POST
// userRoutes.post("/create", userController.createUser);
// userRoutes.post("/logout", userController.logOut);
// userRoutes.post("/:id/updatePassword", userController.updatePassword);

// // PUT 
// userRoutes.put("/:id/update", userController.updateUser);

// // DELETE
// userRoutes.delete("/:id/delete", userController.deleteUser);

export default userRoutes;