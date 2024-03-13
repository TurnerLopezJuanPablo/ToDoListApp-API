import { Comment, Task } from "../models/index.js";

class CommentController {
    constructor() { }

    getAll = async (req, res, next) => {
        try {
            const result = await Comment.findAll({
                attributes: [
                    "id",
                    "title",
                    "created_at",
                    "TaskId",
                    "TaskId",
                ],
            });
            if (!result || result.length === 0) {
                const error = new Error("No comments found");
                error.status = 404;
                throw error;
            }
            res.status(200).send({ success: true, message: "Comments:", result });
        } catch (error) {
            next(error);
        }
    };

    getCommentById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await Comment.findOne({
                where: {
                    id,
                },
                attributes: [
                    "id",
                    "title",
                    "created_at",
                    "TaskId",
                ],
            });

            if (!result) {
                const error = new Error("No comments found with id: " + id);
                error.status = 404;
                throw error;
            }

            res
                .status(200)
                .send({ success: true, message: "Comments found with id: " + id, result });
        } catch (error) {
            next(error);
        }
    };

    createComment = async (req, res, next) => {
        try {
            const { title, TaskId } = req.body;
            const result = await Comment.create({
                title,
                TaskId
            });
            if (!result) throw new Error("Failed to create the comment");
            res
                .status(200)
                .send({ success: true, message: "Comment created successfully" });
        } catch (error) {
            next(error);
        }
    };

    updateComment = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title } = req.body;

            const result = await Comment.update(
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
                const error = new Error("Failed to update the comment with id: " + id);
                error.status = 404;
                throw error;
            }

            res.status(200).send({
                success: true,
                message: "Comment with id " + id + " updated successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    deleteComment = async (req, res, next) => {
        try {
            const { id } = req.params;

            const result = await Comment.destroy({
                where: { id: id },
            });

            if (result === 1) {
                res.status(200).send({
                    success: true,
                    message: "Comment deleted successfully",
                });
            } else if (result === 0) {
                res.status(404).send({
                    success: false,
                    message: "Comment not found with id: " + id,
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error trying to delete Comment with id: " + id + error.message,
            });
        }
    };
}

export default CommentController;