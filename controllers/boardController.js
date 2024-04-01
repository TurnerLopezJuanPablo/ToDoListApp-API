import { Board, Category, SubTask, Task, Comment } from "../models/index.js";

class BoardController {
    constructor() { }

    getAll = async (req, res, next) => {
        try {
            const result = await Board.findAll({
                attributes: [
                    "id",
                    "title",
                    "description",
                    "order",
                ],
                include: [
                    {
                        model: Task,
                        as: 'Tasks',
                        attributes: ['id'],
                        include: [
                            {
                                model: SubTask,
                                as: 'SubTasks',
                                attributes: ['id'],
                            },
                            {
                                model: Comment,
                                as: 'Comments',
                                attributes: ['id'],
                            }
                        ]
                    },
                    {
                        model: Category,
                        as: 'Categories',
                        attributes: ['id'],
                    }
                ]
            });
            if (result.length == 0) {
                const error = new Error("No boards uploaded");
                error.status = 400;
                throw error;
            }
            res
                .status(200)
                .send({ success: true, message: "Boards:", result });
        } catch (error) {
            next(error);
        }
    };

    getBoardById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await Board.findOne({
                where: {
                    id,
                },
                attributes: [
                    "id",
                    "title",
                    "description",
                    "order",
                ], include: [
                    {
                        model: Task,
                        as: 'Tasks',
                        attributes: ['id'],
                    },
                ]
            });

            if (!result) {
                const error = new Error("No board found with id: " + id);
                error.status = 404;
                throw error;
            }

            res
                .status(200)
                .send({ success: true, message: "Board found with id: " + id, result });
        } catch (error) {
            next(error);
        }
    };

    createBoard = async (req, res, next) => {
        try {
            const { title, description } = req.body;
            const { user } = req;
            const result = await Board.create({
                title,
                description,
            });
            if (!result) throw new Error("Failed to create the board");
            res
                .status(200)
                .send({ success: true, message: "Board created successfully" });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    };

    updateBoard = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, description } = req.body;

            const result = await Board.update(
                {
                    title,
                    description,
                },
                {
                    where: {
                        id,
                    },
                    individualHooks: true,
                }
            );

            if (result[0] === 0) {
                const error = new Error("Failed to update the board with id: " + id);
                error.status = 404;
                throw error;
            }

            res.status(200).send({
                success: true,
                message: "Board with id: " + id + " updated successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    deleteBoard = async (req, res, next) => {
        try {
            const { id } = req.params;

            const result = await Board.destroy({
                where: { id: id },
            });

            if (result === 1) {
                res.status(200).send({
                    success: true,
                    message: "Board deleted successfully",
                });
            } else if (result === 0) {
                res.status(404).send({
                    success: false,
                    message: "Board not found with id: " + id,
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error trying to delete Board with id: " + id + error.message,
            });
        }
    };
}

export default BoardController;