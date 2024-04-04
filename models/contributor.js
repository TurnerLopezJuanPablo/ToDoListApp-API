import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection/connection.js';
import connection from "../connection/connection.js";
import { permit } from '../utils/utils.js';

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
        type: DataTypes.ENUM(
            permit.Owner,
            permit.Editor,
            permit.Commentor,
            permit.Reader
        ),
        allowNull: false
    }
}, {
    sequelize: connection,
    modelName: "Contributor",
    timestamps: false
});

export default Contributor;
