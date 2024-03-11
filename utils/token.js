import jwt from 'jsonwebtoken'
import { secret } from '../config/config.js'

export const generateToken = (payload) => {
    const token = jwt.sign(payload, secret, {
        expiresIn: '6h',
    });

    return token;
};

export const verifyToken = (token) => {
    try {
        const payload = jwt.verify(token, secret);
        return { payload, expired: false };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { payload: null, expired: true };
        }
        throw error;
    }
};
