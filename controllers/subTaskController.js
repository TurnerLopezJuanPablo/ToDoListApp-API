import { SubTask } from "../models/index.js";

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
            const { text, TaskId } = req.body;
            const result = await SubTask.create({
                text,
                TaskId
            });
            if (!result) throw new Error("Failed to create the subTask");

            res
                .status(200)
                .send({ success: true, message: "SubTask created successfully" });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    };

    updateSubTask = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { text } = req.body;
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
            const { orderedSubTasks } = req.body;
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
            res.status(500).send({
                success: false,
                message: "Error trying to delete SubTask with id: " + id + error.message,
            });
        }
    };
}

export default SubTaskController;