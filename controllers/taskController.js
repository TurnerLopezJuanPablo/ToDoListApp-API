import { Task } from "../models/index.js";

class TaskController {
    constructor() { }
    getAll = async (req, res, next) => {
        try {
            const result = await Task.findAll({
                attributes: [
                    "id",
                    "title",
                    "description",
                    "done",
                    "created_at",
                    "due_date",
                    "priority",
                    "order",
                    "parentId",
                    "GroupId",
                    "UserId",
                    "CategoryId",
                ],
            });
            if (result.length == 0) {
                const error = new Error("No tasks uploaded");
                error.status = 400;
                throw error;
            }
            res
                .status(200)
                .send({ success: true, message: "Tasks - getAll:", result });
        } catch (error) {
            next(error);
        }
    };

    getTaskById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await Task.findOne({
                where: {
                    id,
                },
                attributes: [
                    "id",
                    "title",
                    "description",
                    "done",
                    "created_at",
                    "due_date",
                    "priority",
                    "order",
                    "parentId",
                    "GroupId",
                    "UserId",
                    "CategoryId",
                ],
            });

            if (!result) {
                const error = new Error("No task found with id: " + id);
                error.status = 404;
                throw error;
            }

            res
                .status(200)
                .send({ success: true, message: "Task found with id: " + id, result });
        } catch (error) {
            next(error);
        }
    };

    createTask = async (req, res, next) => {
        try {
            const { title, description, due_date, priority } = req.body;
            const result = await Task.create({
                title,
                description,
                due_date,
                priority
            });
            if (!result) throw new Error("Failed to create the task");
            res
                .status(200)
                .send({ success: true, message: "Task created successfully" });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    };

    updateTask = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, description, priority } = req.body;

            if (priority !== undefined && !['low', 'medium', 'high', 'none'].includes(priority)) {
                const error = new Error("Invalid priority value");
                error.status = 400;
                throw error;
            }

            const result = await Task.update(
                {
                    title,
                    description,
                    priority,
                },
                {
                    where: {
                        id,
                    },
                }
            );

            if (!result)
                throw new Error("Failed to update the task with id: " + id);

            res.status(200).send({
                success: true,
                message: "Task with id " + id + " updated successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    toggleDone = async (req, res, next) => {
        try {
            const { id } = req.params;

            const existingTask = await Task.findByPk(id);
            if (!existingTask) {
                const error = new Error("Task not found with id: " + id);
                error.status = 404;
                throw error;
            }

            const updatedDoneValue = !existingTask.done;

            const result = await Task.update(
                { done: updatedDoneValue },
                { where: { id: id } }
            );

            if (result[0] === 0) {
                const error = new Error("Error updating Task with id: " + id);
                error.status = 400;
                throw error;
            }

            res.status(200).send({
                success: true,
                message: "Done update in Task with id: " + id,
                updatedDoneValue: updatedDoneValue,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteTask = async (req, res, next) => {
        try {
            const { id } = req.params;

            const resultado = await Task.destroy({
                where: { id: id },
            });

            if (resultado === 1) {
                res.status(200).send({
                    success: true,
                    message: "Task deleted successfully",
                });
            } else if (resultado === 0) {
                res.status(404).send({
                    success: false,
                    message: "Task not found with id: " + id,
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error trying to delete Task with id: " + id + error.message,
            });
        }
    };

}

export default TaskController;