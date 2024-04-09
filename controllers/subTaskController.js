import { Contributor, SubTask, Task } from "../models/index.js";
import { permit } from "../utils/utils.js";

class SubTaskController {
    constructor() { }

    getAll = async (req, res, next) => {
        try {
            const result = await SubTask.findAll({
                attributes: [
                    "id",
                    "text",
                    "done",
                    "order",
                    "TaskId",
                ]
            });
            if (result.length == 0) {
                const error = new Error("No subTasks uploaded");
                error.status = 400;
                throw error;
            }
            res
                .status(200)
                .send({ success: true, message: "SubTasks:", result });
        } catch (error) {
            next(error);
        }
    };

    getSubTaskById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await SubTask.findOne({
                where: {
                    id,
                },
                attributes: [
                    "id",
                    "text",
                    "done",
                    "order",
                    "TaskId",
                ]
            });

            if (!result) {
                const error = new Error("No subTask found with id: " + id);
                error.status = 404;
                throw error;
            }

            res
                .status(200)
                .send({ success: true, message: "SubTask found with id: " + id, result });
        } catch (error) {
            next(error);
        }
    };

    createSubTask = async (req, res, next) => {
        try {
            const { text, TaskId, BoardId } = req.body;
            const { user } = req;

            await this.checkPermit(user.idUser, BoardId, TaskId, null);

            const result = await SubTask.create({
                text,
                TaskId
            });
            if (!result) throw new Error("Failed to create the subTask");

            res
                .status(200)
                .send({ success: true, message: "SubTask created successfully" });
        } catch (error) {
            next(error);
        }
    };

    updateSubTask = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { text, TaskId, BoardId } = req.body;

            const { user } = req;

            await this.checkPermit(user.idUser, BoardId, TaskId, id);

            const result = await SubTask.update(
                {
                    text
                },
                {
                    where: {
                        id,
                    },
                }
            );

            if (result[0] === 0) {
                const error = new Error("Failed to update the subTask with id: " + id);
                error.status = 404;
                throw error;
            };

            res.status(200).send({
                success: true,
                message: "SubTask with id " + id + " updated successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    generateNewOrder = async (req, res, next) => {
        try {
            const { TaskId } = req.params;
            const { orderedSubTasks, BoardId } = req.body;

            const { user } = req;

            await this.checkPermit(user.idUser, BoardId, TaskId, null);

            const subTasksToOrder = await SubTask.findAll({
                attributes: [
                    "id",
                    "order",
                ],
                where: {
                    TaskId: TaskId
                }
            });

            if (subTasksToOrder.length == 0) {
                const error = new Error("SubTasks not found");
                error.status = 400;
                throw error;
            }

            console.log(orderedSubTasks.length, subTasksToOrder.length);

            if (orderedSubTasks.length !== subTasksToOrder.length) {
                const error = new Error("Arrays do not have the same length");
                error.status = 400;
                throw error;
            }

            const orderedSubTasksJSON = JSON.stringify(orderedSubTasks);
            const subTasksToOrderJSON = JSON.stringify(subTasksToOrder);

            if (orderedSubTasksJSON === subTasksToOrderJSON) {
                console.log("Arrays are the same");
            } else {
                console.log("Arrays are not the same");
            }

            orderedSubTasks.sort((a, b) => a.order - b.order);

            for (let i = 0; i < orderedSubTasks.length; i++) {
                const subTask = orderedSubTasks[i];
                await SubTask.update({ order: i + 1 }, { where: { id: subTask.id } });
                subTask.order = i + 1;
            }

            res
                .status(200)
                .send({ success: true, message: "SubTasks with with Task: " + TaskId + " have been reordered", orderedSubTasks: orderedSubTasks });
        } catch (error) {
            next(error);
        }
    };

    toggleDone = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { BoardId, TaskId } = req.body;

            const { user } = req;

            await this.checkPermit(user.idUser, BoardId, TaskId, id);

            const existingSubTask = await SubTask.findByPk(id);
            if (!existingSubTask) {
                const error = new Error("SubTask not found with id: " + id);
                error.status = 404;
                throw error;
            }

            const updatedDoneValue = !existingSubTask.done;

            const result = await SubTask.update(
                { done: updatedDoneValue },
                { where: { id: id } }
            );

            if (result[0] === 0) {
                const error = new Error("Error updating SubTask with id: " + id);
                error.status = 400;
                throw error;
            }

            res.status(200).send({
                success: true,
                message: "Done update in SubTask with id: " + id,
                updatedDoneValue: updatedDoneValue,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteSubTask = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { BoardId, TaskId } = req.body;

            const { user } = req;

            await this.checkPermit(user.idUser, BoardId, TaskId, id);

            const result = await SubTask.destroy({
                where: { id: id },
            });

            if (result === 1) {
                res.status(200).send({
                    success: true,
                    message: "SubTask deleted successfully",
                });
            } else if (result === 0) {
                res.status(404).send({
                    success: false,
                    message: "SubTask not found with id: " + id,
                });
            }
        } catch (error) {
            next(error);
        }
    };

    checkPermit = async (userId, boardId, taskId, subTaskId) => {
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

        const existingTask = await Task.findOne({ where: { id: taskId, boardId } });

        if (!existingTask) {
            const error = new Error("Task with ID: " + taskId + " does not match the provided board ID");
            error.status = 404;
            throw error;
        }

        if (subTaskId) {
            const existingSubTask = await SubTask.findOne({ where: { id: subTaskId, TaskId: taskId } });
            if (!existingSubTask) {
                const error = new Error("SubTask with ID: " + subTaskId + " does not match the provided task ID");
                error.status = 404;
                throw error;
            }
        }

        return true;
    };
}

export default SubTaskController;