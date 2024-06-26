import { DataTypes, Model, Sequelize } from 'sequelize';
import connection from "../connection/connection.js";
import { generateUniqueTitle, priority } from '../utils/utils.js';

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
        allowNull: true,
        validate: {
            customLength(value) {
                if (value.length > 500) {
                    throw new Error('Description must have a maximum of 500 characters');
                }
            },
        },
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    starred: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM(
            priority.High,
            priority.Medium,
            priority.Low,
            priority.None,
        ),
        defaultValue: 'none'
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    assigned: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    },
    updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
    }
}, {
    sequelize: connection,
    modelName: "Task",
    timestamps: false
});

const trimFields = (instance) => {
    if (instance.title) instance.title = instance.title.trim();
    if (instance.description) instance.description = instance.description.trim();
};

Task.beforeCreate(async (taskInstance, options) => {
    trimFields(taskInstance);

    taskInstance.title = await generateUniqueTitle(taskInstance.title, Task, taskInstance.BoardId, "BoardId");
});

Task.beforeUpdate(async (taskInstance, options) => {
    trimFields(taskInstance);

    taskInstance.title = await generateUniqueTitle(taskInstance.title, Task, taskInstance.BoardId, "BoardId");
});

export default Task;
