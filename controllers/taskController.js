import { Task, SubTask, Comment, Contributor } from "../models/index.js";
import sequelize from "../connection/connection.js";
import { permit } from "../utils/utils.js";

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
                    "starred",
                    "due_date",
                    "priority",
                    "order",
                    "assigned",
                    "createdAt",
                    "updatedAt",
                    "updatedBy",
                    "BoardId",
                    "CategoryId"
                ], include: [
                    {
                        model: SubTask,
                        as: 'SubTasks',
                        attributes: ['id', 'text', 'done', 'order'],
                    },
                    {
                        model: Comment,
                        as: 'Comments',
                        attributes: ['id', 'text'],
                    }
                ],
            });
            if (result.length == 0) {
                const error = new Error("No tasks uploaded");
                error.status = 400;
                throw error;
            }
            res
                .status(200)
                .send({ success: true, message: "Tasks:", result });
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
                    "starred",
                    "due_date",
                    "priority",
                    "order",
                    "assigned",
                    "createdAt",
                    "updatedAt",
                    "updatedBy",
                    "BoardId",
                    "CategoryId"
                ], include: [
                    {
                        model: SubTask,
                        as: 'SubTasks',
                        attributes: ['id', 'text', 'done', 'order'],
                    },
                    {
                        model: Comment,
                        as: 'Comments',
                        attributes: ['id', 'text'],
                    }
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
            const { title, description, due_date, priority: newPriority, BoardId } = req.body;
            const { user } = req;

            await this.checkPermit(user.idUser, BoardId);

            const result = await Task.create({
                title,
                description,
                due_date,
                priority: newPriority,
                BoardId
            });
    
            if (!result) throw new Error("Failed to create the task");

            res
                .status(200)
                .send({ success: true, message: "Task created successfully" });
        } catch (error) {
            next(error);
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

            const { user } = req;

            const result = await Task.update(
                {
                    title,
                    description,
                    priority,
                    updatedAt: sequelize.literal('CURRENT_TIMESTAMP'),
                    updatedBy: user.idUser
                },
                {
                    where: {
                        id,
                    },
                    individualHook: true,
                }
            );

            if (result[0] === 0) {
                const error = new Error("Failed to update the task with id: " + id);
                error.status = 404;
                throw error;
            };

            res.status(200).send({
                success: true,
                message: "Task with id " + id + " updated successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    generateNewOrder = async (req, res, next) => {
        try {
            const { boardId } = req.params;
            const { orderedTasks } = req.body;
            const tasksToOrder = await Task.findAll({
                attributes: [
                    "id",
                    "order",
                ],
                where: {
                    BoardId: boardId
                }
            });

            if (tasksToOrder.length == 0) {
                const error = new Error("Tasks not found");
                error.status = 400;
                throw error;
            }

            if (orderedTasks.length !== tasksToOrder.length) {
                const error = new Error("Arrays do not have the same length");
                error.status = 400;
                throw error;
            }

            const orderedTasksJSON = JSON.stringify(orderedTasks);
            const tasksToOrderJSON = JSON.stringify(tasksToOrder);

            if (orderedTasksJSON === tasksToOrderJSON) {
                console.log("Arrays are the same");
            } else {
                console.log("Arrays are not the same");
            }

            orderedTasks.sort((a, b) => a.order - b.order);

            for (let i = 0; i < orderedTasks.length; i++) {
                const task = orderedTasks[i];
                await Task.update({ order: i + 1 }, { where: { id: task.id } });
            }

            res
                .status(200)
                .send({ success: true, message: "Tasks with with BoardId: " + boardId + " have been reordered", orderedTasks: orderedTasks });
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

    toggleStarred = async (req, res, next) => {
        try {
            const { id } = req.params;

            const existingTask = await Task.findByPk(id);
            if (!existingTask) {
                const error = new Error("Task not found with id: " + id);
                error.status = 404;
                throw error;
            }

            const updatedStarredValue = !existingTask.starred;

            const result = await Task.update(
                { starred: updatedStarredValue },
                { where: { id: id } }
            );

            if (result[0] === 0) {
                const error = new Error("Error updating Task with id: " + id);
                error.status = 400;
                throw error;
            }

            res.status(200).send({
                success: true,
                message: "Starred update in Task with id: " + id,
                updatedDoneValue: updatedStarredValue,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteTask = async (req, res, next) => {
        try {
            const { id } = req.params;

            const result = await Task.destroy({
                where: { id: id },
            });

            if (result === 1) {
                res.status(200).send({
                    success: true,
                    message: "Task deleted successfully",
                });
            } else if (result === 0) {
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

    checkPermit = async (userId, boardId) => {
        const contributor = await Contributor.findOne({ where: { UserId: userId, BoardId: boardId } });

        if (!contributor) {
            const error = new Error(`No contributor found with UserId: ${userId} and BoardId: ${boardId}`);
            error.status = 404;
            throw error;
        }

        if (contributor.permit !== permit.Owner && contributor.permit !== permit.Editor) {
            const error = new Error(`User does not have permission to perform this action`);
            error.status = 403;
            throw error;
        }

        return true;
    };
}

export default TaskController;