import { Router } from "express";
import taskRoutes from "./taskRoutes.js";
import userRoutes from "./userRoutes.js";
import boardRoutes from "./boardRoutes.js";
import commentRoutes from "./commentRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import subTaskRoutes from "./subTaskRoutes.js";
import calculatorHistoryRoutes from "./calculatorHistoryRoutes.js";

const indexRoutes = Router()

indexRoutes.use("/task", taskRoutes);
indexRoutes.use("/user", userRoutes);
indexRoutes.use("/board", boardRoutes);
indexRoutes.use("/comment", commentRoutes);
indexRoutes.use("/category", categoryRoutes);
indexRoutes.use("/subTask", subTaskRoutes);
indexRoutes.use("/calculatorHistory", calculatorHistoryRoutes);

export default indexRoutes;
