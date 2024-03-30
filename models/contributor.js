import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection/connection.js';
import connection from "../connection/connection.js";

class Contributor extends Model { }

Contributor.init({
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },   
    permit: {
        type: DataTypes.ENUM('owner','reader','commentor','editor'),
        allowNull: false,
    },
}, {
    sequelize: connection,
    modelName: "Contributor",
    timestamps: false
});

export default Contributor;
