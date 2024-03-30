import { DataTypes, Model } from 'sequelize';
import connection from "../connection/connection.js";
import { generateUniqueTitle } from '../utils/utils.js';

class Board extends Model { }

Board.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Board Title is required',
            },
            customLength(value) {
                if (value.length > 50) {
                    throw new Error('Board Title must have a maximum of 50 characters');
                }
            },
        },
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            customLength(value) {
                if (value.length > 255) {
                    throw new Error('Board description must have a maximum of 255 characters');
                }
            },
        },
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize: connection,
    modelName: "Board",
    timestamps: false
});

Board.beforeCreate(async (board, options) => {
    board.title = await generateUniqueTitle(board.title, Board);
});

Board.beforeUpdate(async (board, options) => {
    board.title = await generateUniqueTitle(board.title, Board);
});

export default Board;
