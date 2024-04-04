import { Board, Category, Contributor, SubTask, Task, User, Comment } from "../models/index.js";
import sequelize from '../connection/connection.js';
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";
import moment from "moment";
import { Op } from "sequelize";

class UserController {
    constructor() { }

    logIn = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email) {
                const error = new Error("Email not entered");
                error.status = 400;
                throw error;
            }

            if (!password) {
                const error = new Error("Password not entered");
                error.status = 400;
                throw error;
            }

            const result = await User.findOne({
                where: {
                    email,
                },

            });

            if (!result) {
                const error = new Error("No User found with Email: " + email);
                error.status = 404;
                throw error;
            }
            if (!result.activeUser) {
                const error = new Error(`User with email ${email} is no longer active. Please go to the HELP section to reactivate the account.`);
                error.status = 403;
                throw error;
            }

            const correctPassword = await result.validatePassword(password);

            if (!correctPassword) {
                const error = new Error("Incorrect Email or Password");
                error.status = 404;
                throw error;
            }

            const payload = {
                idUser: result.id,
                userName: result.userName,
                name: result.name,
                surName: result.surname,
                email: result.email,
            };

            const token = generateToken(payload);

            // Cookie for Thunder Client - Start
            res.cookie('tokenToDoListApp', token, {
                httpOnly: true, // The cookie is not accessible via client-side JavaScript
                sameSite: 'Strict', // Ensure the cookie is sent only in a first-party context
                maxAge: 86400000, // Set the cookie expiration time (e.g., 1 day)
            });
            // End

            res
                .status(200)
                .send({
                    success: true,
                    message: "User Successfully Logged In",
                    user: { token },
                });
        } catch (error) {
            next(error);
        }
    };

    createUser = async (req, res, next) => {
        try {
            const {
                userName,
                name,
                surname,
                birthDate,
                email,
                password,
            } = req.body;

            const result = await User.create({
                userName,
                name,
                surname,
                birthDate,
                email,
                password,
            });
            if (!result) throw new Error("Failed to create the user");
            res
                .status(200)
                .send({ success: true, message: "User created successfully" });
        } catch (error) {
            next(error);
        }
    };

    getLoggedUser = async (req, res, next) => {
        try {
            const { user } = req;
            res.status(200).send({ success: true, message: "User", user });
        } catch (error) {
            next(error);
        }
    };

    getUserById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await User.findOne({
                where: {
                    id,
                },
                attributes: [
                    "id",
                    "userName",
                    "name",
                    "surname",
                    "birthDate",
                    "email",
                    "emailConfirmed",
                    "oldUserName"
                ]
            });

            if (!result) {
                const error = new Error("No user found with id: " + id);
                error.status = 404;
                throw error;
            }

            res
                .status(200)
                .send({ success: true, message: "User found with id: " + id, result });
        } catch (error) {
            next(error);
        }
    };

    getAllData = async (req, res, next) => {
        try {
            const { user } = req;
            const id = user.idUser;
            const result = await User.findOne({
                where: {
                    id,
                },
                attributes: [
                    "id",
                    "userName",
                    "name",
                    "surname",
                    "birthDate",
                    "email",
                    "emailConfirmed",
                    "oldUserName"
                ],
                include: [
                    {
                        model: Contributor,
                        as: 'Contributes',
                        attributes: ['id', 'createdAt', 'updatedAt', 'permit'],
                        include: [
                            {
                                model: Board,
                                as: 'Board',
                                attributes: ['id', 'title', 'description'],
                                include: [
                                    {
                                        model: Category,
                                        as: 'Categories',
                                        attributes: ['id', 'title']
                                    },
                                    {
                                        model: Task,
                                        as: 'Tasks',
                                        attributes: [
                                            'id',
                                            'title',
                                            'description',
                                            'done',
                                            'starred',
                                            'due_date',
                                            'priority',
                                            'order',
                                            'assigned',
                                            'createdAt',
                                            'updatedAt',
                                            'updatedBy',
                                            'CategoryId',
                                        ],
                                        include: [
                                            {
                                                model: SubTask,
                                                as: 'SubTasks',
                                                attributes: ['id', 'text', 'done', 'order']
                                            },
                                            {
                                                model: Comment,
                                                as: 'Comments',
                                                attributes: ['id', 'text', 'created_At']
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            if (!result) {
                const error = new Error("No user found with id: " + id);
                error.status = 404;
                throw error;
            }

            res.status(200).send({ success: true, message: "User found with id: " + id, result });
        } catch (error) {
            next(error);
        }
    };

    getUsersBySearch = async (req, res, next) => {
        try {
            const { search } = req.params;
            const result = await User.findAndCountAll({
                where: {
                    userName: {
                        [Op.like]: `%${search}%`
                    },
                    activeUser: true,
                },
                attributes: [
                    "userName",
                    "name",
                    "surname",
                    "email",
                    "oldUserName"
                ],
                limit: 15
            });
            if (!result) {
                const error = new Error("No users found with search: " + search);
                error.status = 404;
                throw error;
            }

            res
                .status(200)
                .send({ success: true, message: "Users found with search: " + search, result });
        } catch (error) {
            next(error);
        }
    };

    logOut = async (req, res, next) => {
        try {
            // Cookie for Thunder Client - Start
            res.cookie("tokenToDoListApp", "");
            // End

            res.status(200).send({ success: true, message: "User session was closed" });
        } catch (error) {
            next(error);
        }
    };

    updatePassword = async (req, res, next) => {
        try {
            let result;
            const { id } = req.params;
            const {
                oldPassword,
                newPassword,
            } = req.body;

            const user = await User.findOne({
                where: {
                    id: id,
                },
            });

            if (!user) {
                const error = new Error("No user found with id: " + id);
                error.status = 404;
                throw error;
            }

            if (oldPassword == null || oldPassword == "") {
                const error = new Error(`The old password provided is empty or null`);
                error.status = 400;
                throw error;
            }

            if (newPassword == null || newPassword == "") {
                const error = new Error(`The new password provided is empty or null`);
                error.status = 400;
                throw error;
            }

            const passwordMatch = await bcrypt.compare(oldPassword, user.password);

            if (passwordMatch) {
                const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
                if (!passwordRegex.test(newPassword)) {
                    const error = new Error(`The password must have a minimum of 8 characters, one uppercase letter and one number`);
                    error.status = 400;
                    throw error;
                }

                result = await User.update(
                    { password: newPassword },
                    {
                        where: { id },
                        individualHooks: true,
                    }
                );
            } else {
                res
                    .status(400)
                    .send({ success: false, message: "Incorrect password" });
            }

            if (!result) {
                throw new Error("Failed to update the user password");
            }

            res
                .status(200)
                .send({
                    success: true,
                    message: "Password updated successfully",
                });
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const {
                name,
                surname,
                birthDate,
            } = req.body;

            if (!name || !surname || !birthDate) {
                const error = new Error("One or more fields are empty or null");
                error.status = 400;
                throw error;
            }

            const user = await User.findOne({
                where: {
                    id: id,
                },
            });

            if (!user) {
                const error = new Error("No user found with id: " + id);
                error.status = 404;
                throw error;
            }

            const result = await User.update(
                {
                    name,
                    surname,
                    birthDate,
                },
                {
                    where: {
                        id,
                    },
                    individualHooks: true,
                }
            );

            if (!result) throw new Error("Failed to update the User");

            res
                .status(200)
                .send({ success: true, message: "User updated successfully" });
        } catch (error) {
            next(error);
        }
    };

    updateUserName = async (req, res, next) => {
        try {
            const { id } = req.params;
            const {
                newUserName,
            } = req.body;

            const user = await User.findOne({
                where: {
                    id: id,
                },
            });

            if (!user) {
                const error = new Error("No user found with id: " + id);
                error.status = 404;
                throw error;
            }

            if (newUserName == null || newUserName == "") {
                const error = new Error(`The new UserName provided is empty or null`);
                error.status = 400;
                throw error;
            }

            const thirtyDaysAgo = moment().subtract(30, 'days');
            if (user.lastUserNameUpdated && moment(user.lastUserNameUpdated).isAfter(thirtyDaysAgo)) {
                const daysRemaining = thirtyDaysAgo.diff(moment(user.lastUserNameUpdated), 'days');
                throw new Error(`You can only change your username once every 30 days. Days remaining: ${daysRemaining * (-1)}`);
            }

            const oldUserName = user.userName
            if (oldUserName === newUserName) {
                const error = new Error(`The new username provided is the same as the old one`);
                error.status = 400;
                throw error;
            }

            const result = await User.update(
                {
                    userName: newUserName,
                    oldUserName,
                    lastUserNameUpdated: sequelize.literal('CURRENT_TIMESTAMP')
                },
                {
                    where: { id },
                }
            );

            if (!result[0]) {
                throw new Error(`Failed to update the username of User with id: ${id}`);
            }

            res.status(200).send({
                success: true,
                message: "Username updated successfully",
            });
        } catch (error) {
            next(error);
        };
    };

    setInactiveToUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await User.update(
                {
                    activeUser: false
                },
                {
                    where: { id },
                }
            );

            if (!result) {
                const error = new Error("No user found with id: " + id);
                error.status = 404;
                throw error;
            }

            res
                .status(200)
                .send({ success: true, message: "User with id: " + id + " was set to inactive" });
        } catch (error) {
            next(error);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            const { id } = req.params;

            const result = await User.destroy({
                where: { id: id },
            });

            if (result === 1) {
                res.status(200).send({
                    success: true,
                    message: "User deleted successfully",
                });
            } else if (result === 0) {
                res.status(404).send({
                    success: false,
                    message: "User not found with id: " + id,
                });
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error trying to delete User with id: " + id + error.message,
            });
        }
    };

}

export default UserController;