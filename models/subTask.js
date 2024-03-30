import { DataTypes, Model } from 'sequelize';
import connection from "../connection/connection.js";

class SubTask extends Model { }

SubTask.init({
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
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize: connection,
    modelName: "SubTask",
    timestamps: false
});

export default SubTask;