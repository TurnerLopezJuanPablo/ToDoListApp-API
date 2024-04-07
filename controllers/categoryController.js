import { Category, Task, Contributor } from "../models/index.js";
import { permit } from "../utils/utils.js";

class CategoryController {
    constructor() { }

    getAll = async (req, res, next) => {
        try {
            const result = await Category.findAll({
                attributes: [
                    "id",
                    "title",
                    "BoardId",
                ],
                include: [
                    {
                        model: Task,
                        as: 'Tasks',
                        attributes: ['id'],
                    },
                ]
            });
            if (!result || result.length === 0) {
                const error = new Error("No categories found");
                error.status = 404;
                throw error;
            }
            res.status(200).send({ success: true, message: "Categories:", result });
        } catch (error) {
            next(error);
        }
    };

    getCategoryById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await Category.findOne({
                where: {
                    id,
                },
                attributes: [
                    "id",
                    "title",
                    "BoardId",
                ],
                include: [
                    {
                        model: Task,
                        as: 'Tasks',
                        attributes: ['id'],
                    },
                ]
            });

            if (!result) {
                const error = new Error("No category found with id: " + id);
                error.status = 404;
                throw error;
            }

            res
                .status(200)
                .send({ success: true, message: "Category found with id: " + id, result });
        } catch (error) {
            next(error);
        }
    };

    createCategory = async (req, res, next) => {
        try {
            const { title, BoardId } = req.body;
            const { user } = req;

            await this.checkPermit(user.idUser, BoardId);

            const result = await Category.create({
                title,
                BoardId
            });
            if (!result) throw new Error("Failed to create the category");
            res
                .status(200)
                .send({ success: true, message: "Category created successfully" });
        } catch (error) {
            next(error);
        }
    };

    updateCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, BoardId } = req.body;
            const { user } = req;

            await this.checkPermit(user.idUser, BoardId);

            const result = await Category.update(
                {
                    title,
                },
                {
                    where: {
                        id,
                        BoardId
                    },
                    individualHooks: true,
                }
            );

            if (result[0] === 0) {
                const error = new Error("Failed to update the category with id: " + id);
                error.status = 404;
                throw error;
            }

            res.status(200).send({
                success: true,
                message: "Category with id " + id + " updated successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    deleteCategory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { BoardId } = req.body;
            const { user } = req;

            await this.checkPermit(user.idUser, BoardId);

            const result = await Category.destroy({
                where: { id: id, BoardId },
            });

            if (result === 1) {
                res.status(200).send({
                    success: true,
                    message: "Category deleted successfully",
                });
            } else if (result === 0) {
                res.status(404).send({
                    success: false,
                    message: "Category not found with id: " + id,
                });
            }
        } catch (error) {
            // res.status(500).send({
            //     success: false,
            //     message: "Error trying to delete Category with id: " + id + error.message,
            // });
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

        if (contributor.permit !== permit.Owner && contributor.permit !== permit.Editor) {
            const error = new Error(`User does not have permission to perform this action`);
            error.status = 403;
            throw error;
        }

        return true;
    };
}

export default CategoryController;