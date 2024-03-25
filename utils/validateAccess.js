import { verifyToken } from "../utils/token.js";

const validateAccess = (req, res, next) => {
    try {
        const cookieHeader = req.headers.authorization;

        if (!cookieHeader) {
            const error = new Error("Access denied, no cookie session found");
            error.status = 401;
            throw error;
        }

        const tokenToDoListApp = cookieHeader.split('=')[1];

        if (!tokenToDoListApp) {
            const error = new Error("Access denied, no token found in the cookie");
            error.status = 401;
            throw error;
        }

        const { payload, expired } = verifyToken(tokenToDoListApp);

        if (expired) {
            const error = new Error("Access denied, token expired");
            error.status = 401;
            throw error;
        }

        if (!payload) {
            const error = new Error("Access denied, no payload found");
            error.status = 401;
            throw error;
        }

        req.user = payload;
        next();
    } catch (error) {
        if (error.message === 'JWT expired') {
            res.clearCookie('tokenToDoListApp');
            error.message = 'JWT expired';
        }

        next(error);
    }
};

export default validateAccess;
