import { Comment, Task, Contributor } from "../models/index.js";
import sequelize from '../connection/connection.js';
import { permit, deletedCommentText } from "../utils/utils.js";

class CommentController {
    constructor() { }

    getAll = async (req, res, next) => {
        try {
            const result = await Comment.findAll({
                attributes: [
                    "id",
                    "text",
                    "created_at",
                    "updatedAt",
                    "deleted",
                    "oldText",
                    "UserId",
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
                    "text",
                    "created_at",
                    "updatedAt",
                    "deleted",
                    "oldText",
                    "UserId",
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
            const { text, TaskId, BoardId } = req.body;

            const { user } = req;

            await this.checkPermit(user.idUser, BoardId, TaskId, null);

            const result = await Comment.create({
                text,
                UserId: user.idUser,
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
            const { text, TaskId, BoardId } = req.body;

            const { user } = req;

            await this.checkPermit(user.idUser, BoardId, TaskId, id);

            const existingComment = await Comment.findByPk(id);

            if (existingComment.updatedAt !== null) {
                const error = new Error(`Comment with id: ${id} has already been edited`);
                error.status = 400;
                throw error;
            }

            const oldText = existingComment.text;

            const result = await Comment.update(
                {
                    text,
                    updatedAt: sequelize.literal('CURRENT_TIMESTAMP'),
                    oldText
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

    setCommentToDeleted = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { TaskId, BoardId } = req.body;

            const { user } = req;

            await this.checkPermit(user.idUser, BoardId, TaskId, id);

            const result = await Comment.update(
                {
                    text: deletedCommentText,
                    oldText: deletedCommentText,
                    deleted: true,
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
                result: deletedCommentText
            });
        }
        catch (error) {
            next(error);
        }
    };

    checkPermit = async (userId, boardId, taskId, commentId) => {
        const contributor = await Contributor.findOne({ where: { UserId: userId, BoardId: boardId } });

        if (!contributor) {
            const error = new Error(`No contributor found with UserId: ${userId} and BoardId: ${boardId}`);
            error.status = 404;
            throw error;
        }

        if (!contributor.active) {
            const error = new Error(`The contributor relation found is not active: ${contributor.active}` );
            error.status = 403;
            throw error;
        }

        if (contributor.permit === permit.Reader) {
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

        if (commentId) {
            const existingComment = await Comment.findOne({ where: { id: commentId, TaskId: taskId } });
            if (!existingComment) {
                const error = new Error("Comment with ID: " + commentId + " does not match the provided task ID");
                error.status = 404;
                throw error;
            }

            if (existingComment.UserId !== userId) {
                const error = new Error("The provided user ID does not match the user ID associated with the comment");
                error.status = 401; 
                throw error;
            }          
            
            if (existingComment.deleted) {
                const error = new Error("The comment has been deleted");
                error.status = 401;
                throw error;
            }
        }

        return true;
    };
}

export default CommentController;