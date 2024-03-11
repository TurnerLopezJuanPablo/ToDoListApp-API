import { Category } from "../models/index.js";

class CategoryController {
    constructor() { }

    getAll = async (req, res, next) => {
        try {
            const result = await Category.findAll({
                attributes: [
                    "id",
                    "title",
                    "UserId",
                ]
            });
            if (result.length == 0) {
                const error = new Error("No categories uploaded");
                error.status = 400;
                throw error;
            }
            res
                .status(200)
                .send({ success: true, message: "Categories:", result });
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
                    "UserId",
                ],
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
            const { title } = req.body;
            const result = await Category.create({
                title,
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
            const { title } = req.body;

            const result = await Category.update(
                {
                    title,
                },
                {
                    where: {
                        id,
                    },
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

            const result = await Category.destroy({
                where: { id: id },
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
            res.status(500).send({
                success: false,
                message: "Error trying to delete Category with id: " + id + error.message,
            });
        }
    };
}

export default CategoryController;