import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection/connection.js';
import connection from "../connection/connection.js";

class Task extends Model { }

Task.init({
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
                msg: 'Title is required',
            },
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'none'),
        defaultValue: 'none'
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize: connection,
    modelName: "Task",
    timestamps: false
});

export default Task;
