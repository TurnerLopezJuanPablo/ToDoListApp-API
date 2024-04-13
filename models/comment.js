import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../connection/connection.js';
import connection from "../connection/connection.js";

class Comment extends Model { }

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Text is required',
            },
            customLength(value) {
                if (value.length > 50) {
                    throw new Error('Text must have a maximum of 50 characters');
                }
            },
        },
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    oldText: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize: connection,
    modelName: "Comment",
    timestamps: false
});

export default Comment;
