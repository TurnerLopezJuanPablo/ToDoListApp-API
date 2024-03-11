import { Router } from "express";
import taskRoutes from "./taskRoutes.js";
import userRoutes from "./userRoutes.js";
import groupRoutes from "./groupRoutes.js";
import commentRoutes from "./commentRoutes.js";
import categoryRoutes from "./categoryRoutes.js";

const indexRoutes = Router()

indexRoutes.use("/task", taskRoutes);
indexRoutes.use("/user", userRoutes);
indexRoutes.use("/group", groupRoutes);
indexRoutes.use("/comment", commentRoutes);
indexRoutes.use("/category", categoryRoutes);

export default indexRoutes;
