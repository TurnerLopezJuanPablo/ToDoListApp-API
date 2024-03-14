import { DataTypes, Model } from 'sequelize';
import connection from "../connection/connection.js";
import { generateUniqueTitle } from '../utils/utils.js';

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
            customLength(value) {
                if (value.length > 50) {
                    throw new Error('Title must have a maximum of 50 characters');
                }
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
        // Check for unique value between Tasks and Groups
    },
    parentId: {
        type: DataTypes.INTEGER,
        validate: {
            cannotBeCircular(value) {
                if (parseInt(value) === parseInt(this.getDataValue('id'))) {
                    throw new Error('A task cannot be its own subtask.');
                }
            },
        },
    },
}, {
    sequelize: connection,
    modelName: "Task",
    timestamps: false
});

Task.beforeCreate(async (taskInstance, options) => {
    taskInstance.title = await generateUniqueTitle(taskInstance.title, Task);
});

Task.beforeUpdate(async (taskInstance, options) => {
    taskInstance.title = await generateUniqueTitle(taskInstance.title, Task);
});

export default Task;
