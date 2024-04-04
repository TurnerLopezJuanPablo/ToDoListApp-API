import { Board, Category, SubTask, Task, Comment, Contributor } from "../models/index.js";
import { permit } from "../utils/utils.js";

class BoardController {
    constructor() { }

    getAll = async (req, res, next) => {
        try {
            const result = await Board.findAll({
                attributes: [
                    "id",
                    "title",
                    "description",
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
            const result = await Board.create({
                title,
                description,
            });
            if (!result) throw new Error("Failed to create the board");

            const { user } = req;
            const result2 = await Contributor.create({
                permit: permit.Owner,
                UserId: user.idUser,
                BoardId: result.id,
            });
            if (!result2) {
                await Board.destroy({ where: { id: result.id } }).then(() => {
                    throw new Error("Failed to create contributor");
                })
            }

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
            const { user } = req;

            await this.checkPermit(user.idUser, id);

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
            const { user } = req;

            await this.checkPermit(user.idUser, id);

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
            next(error);
        }
    };

    checkPermit = async (userId, boardId) => {
        const contributor = await Contributor.findOne({ where: { UserId: userId, BoardId: boardId } });

        if (!contributor) {
            const error = new Error(`No contributor found with UserId: ${userId} and BoardId: ${boardId}`);
            error.status = 404;
            throw error;
        }

        if (contributor.permit !== permit.Owner) {
            const error = new Error(`User does not have permission to perform this action`);
            error.status = 403;
            throw error;
        }

        return true;
    };
}

export default BoardController;