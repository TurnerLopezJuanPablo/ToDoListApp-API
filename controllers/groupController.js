import { Group } from "../models/index.js";

class GroupController {
    constructor() { }

    getAll = async (req, res, next) => {
        try {
            const result = await Group.findAll({
                attributes: [
                    "id",
                    "title",
                    "description",
                    "order",
                    "UserId",
                ],
            });
            if (result.length == 0) {
                const error = new Error("No groups uploaded");
                error.status = 400;
                throw error;
            }
            res
                .status(200)
                .send({ success: true, message: "Groups:", result });
        } catch (error) {
            next(error);
        }
    };

    getGroupById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await Group.findOne({
                where: {
                    id,
                },
                attributes: [
                    "id",
                    "title",
                    "description",
                    "order",
                    "UserId",
                ],
            });

            if (!result) {
                const error = new Error("No group found with id: " + id);
                error.status = 404;
                throw error;
            }

            res
                .status(200)
                .send({ success: true, message: "Group found with id: " + id, result });
        } catch (error) {
            next(error);
        }
    };

    createGroup = async (req, res, next) => {
        try {
            const { title, description } = req.body;
            const result = await Group.create({
                title,
                description 
            });
            if (!result) throw new Error("Failed to create the group");
            res
                .status(200)
                .send({ success: true, message: "Group created successfully" });
        } catch (error) {
            res.status(400).send({ success: false, message: error.message });
        }
    };

    updateGroup = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, description } = req.body;

            const result = await Group.update(
                {
                    title,
                    description,
                },
                {
                    where: {
                        id,
                    },
                }
            );

            if (result[0] === 0) {
                const error = new Error("Failed to update the group with id: " + id);
                error.status = 404;
                throw error;
            }

            res.status(200).send({
                success: true,
                message: "Group with id " + id + " updated successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    deleteGroup = async (req, res, next) => {
        try {
            const { id } = req.params;

            const result = await Group.destroy({
                where: { id: id },
            });

            if (result === 1) {
                res.status(200).send({
                    success: true,
                    message: "Group deleted successfully",
                });
            } else if (result === 0) {
                res.status(404).send({
                    success: false,
                    message: "Group not found with id: " + id,
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error trying to delete Group with id: " + id + error.message,
            });
        }
    };
}

export default GroupController;