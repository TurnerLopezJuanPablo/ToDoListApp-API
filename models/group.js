import { DataTypes, Model } from 'sequelize'; 
import connection from "../connection/connection.js";

class Group extends Model { }

Group.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize: connection,
    modelName: "Group",
    timestamps: false
});

export default Group;
