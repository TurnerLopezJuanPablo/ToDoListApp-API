import { User } from "../models/index.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";

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
            // END

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

    logOut = async (req, res, next) => {
        try {
            res.cookie("tokenToDoListApp", "");

            res.status(200).send({ success: true, message: "User session was closed" });
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