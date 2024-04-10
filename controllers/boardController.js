import { Board, Category, SubTask, Task, Comment, Contributor } from "../models/index.js";
import { permit } from "../utils/utils.js";
import sequelize from "../connection/connection.js";
import { Sequelize } from "sequelize";

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
            next(error);
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

    addUserToBoard = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { idUserToAdd, permit: newPermit } = req.body;
            const { user } = req;

            await this.checkPermit(user.idUser, id);

            const result = await Contributor.findOne({ where: { BoardId: id, UserId: idUserToAdd } });
            if (result) {
                const error = new Error(`The User with id: ${idUserToAdd} you are trying to add is already a Contributor of this Board`);
                error.status = 409;
                throw error;
            }

            if (permit.Owner === newPermit) {
                const error = new Error(`Only 1 Owner per board is allowed`);
                error.status = 400;
                throw error;
            }

            if (!Object.values(permit).includes(newPermit)) {
                const error = new Error(`Invalid permission type: ${newPermit}. Please provide a valid permission`);
                error.status = 400;
                throw error;
            }

            const newContributor = await Contributor.create(
                {
                    permit: newPermit,
                    UserId: idUserToAdd,
                    BoardId: id
                }
            );
            if (!newContributor) throw new Error("Failed to create the Contributor");

            res
                .status(200)
                .send({ success: true, message: "User added to the Board successfully", result: newContributor });
        } catch (error) {
            next(error);
        }
    };

    changePermit = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { idUserChangePermit, permit: newPermit } = req.body;
            const { user } = req;

            await this.checkPermit(user.idUser, id);

            const contributor = await Contributor.findByPk(idUserChangePermit);
            if (contributor && contributor.permit === permit.Owner) {
                const error = new Error("Cannot change permit for user with Owner role");
                error.status = 400;
                throw error;
            }

            if (!Object.values(permit).includes(newPermit) || newPermit === permit.Owner) {
                let errorMessage = '';

                if (newPermit === permit.Owner) {
                    errorMessage = 'Cannot change permit to owner';
                } else {
                    errorMessage = `Invalid permit: ${newPermit}`;
                }

                const error = new Error(errorMessage);
                error.status = 400;
                throw error;
            }

            const result = await Contributor.update(
                {
                    permit: newPermit,
                    updatedAt: sequelize.literal('CURRENT_TIMESTAMP')
                },
                {
                    where: { id: idUserChangePermit },
                    individualHooks: true,
                }
            );

            if (result[0] === 0) {
                const error = new Error("Failed to update the permit");
                error.status = 404;
                throw error;
            }

            res.status(200).send({ success: true, message: "Permit updated successfully", result });
        } catch (error) {
            next(error);
        }
    };

    setNewOwner = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { idUserChangePermit } = req.body;
            const { user } = req;

            if (user.idUser === idUserChangePermit) {
                const error = new Error("Cannot update permit for the same user");
                error.status = 400;
                throw error;
            }

            await this.checkPermit(user.idUser, id);

            const result = await Contributor.update(
                {
                    permit: permit.Owner,
                    updatedAt: sequelize.literal('CURRENT_TIMESTAMP')
                },
                {
                    where: { id: idUserChangePermit },
                    individualHooks: true,
                }
            );

            if (result[0] === 0) {
                const error = new Error("Failed to update the permit");
                error.status = 404;
                throw error;
            }

            const result2 = await Contributor.update(
                {
                    permit: permit.Editor,
                    updatedAt: sequelize.literal('CURRENT_TIMESTAMP')
                },
                {
                    where: { id: user.idUser },
                    individualHooks: true,
                }
            );

            if (result2[0] === 0) {
                const error = new Error("Failed to update the permit");
                error.status = 404;
                throw error;
            }

            res.status(200).send({ success: true, message: "Permit updated successfully", result, result2 });
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

    removeUserFromBoard = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { idUserToRemove, permit: newPermit } = req.body;
            const { user } = req;

            await this.checkPermit(user.idUser, id);

            const contributor = await Contributor.findOne({ where: { UserId: idUserToRemove, BoardId: id } });

            if (!contributor) {
                const error = new Error(`No contributor found with UserId: ${idUserToRemove} and BoardId: ${id} that you are going to remove`);
                error.status = 404;
                throw error;
            }

            if (contributor.permit === permit.Owner) {
                const { count, rows } = await Contributor.findAndCountAll({
                    where: {
                        id: { [Sequelize.Op.not]: idUserToRemove },
                        active: true,
                        BoardId: id
                    }
                });

                if (count === 0) {
                    const error = new Error(`No other active contributor found to promote to Owner. You may need to delete the board.`);
                    error.status = 400;
                    throw error;
                }

                const newOwner = rows[0];
                await Contributor.update({ permit: permit.Owner }, { where: { id: newOwner.id } });
                await Contributor.update({ active: false, permit: permit.Reader }, { where: { id: idUserToRemove } });

                if (parseInt(idUserToRemove) === user.idUser) {
                    return res.status(200).send({
                        success: true,
                        message: "You have successfully left the board.",
                    });
                }
            }

            await Contributor.update({ active: false, permit: permit.Reader }, { where: { id: idUserToRemove } });

            res.status(200).send({
                success: true,
                message: `User with id: ${idUserToRemove} was successfully removed from the board`,
            });
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

        if (!contributor.active) {
            const error = new Error(`The contributor relation found is not active: ${contributor.active}`);
            error.status = 403;
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