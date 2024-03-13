import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection/connection.js';
import connection from "../connection/connection.js";

class UserTask extends Model { }

UserTask.init({
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    taskId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },   
}, {
    sequelize: connection,
    modelName: "UserTask",
    timestamps: false
});

export default UserTask;
